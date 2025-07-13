const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ProcessFlowDatabase = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'processflow-secret-key-2024';

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // React frontend URL
    credentials: true
}));
app.use(express.json());

// Database instance
const db = new ProcessFlowDatabase();
db.init();

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token gerekli' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Geçersiz token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'ProcessFlow API çalışıyor' });
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Tüm alanlar gerekli' });
        }

        // Kullanıcı var mı kontrol et
        const existingUser = db.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Kullanıcı adı zaten kullanılıyor' });
        }

        // Yeni kullanıcı oluştur
        const newUser = db.createUser(username, email, password, fullName);

        // JWT token oluştur
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, role: 'user' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                fullName: newUser.fullName
            },
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
        }

        // Kullanıcıyı bul
        const user = db.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
        }

        // Şifreyi kontrol et
        if (!db.verifyPassword(user, password)) {
            return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
        }

        // JWT token oluştur
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Giriş başarılı',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// User routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
    try {
        const user = db.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Workspace routes
app.get('/api/workspaces', authenticateToken, (req, res) => {
    try {
        const workspaces = db.getWorkspacesByUser(req.user.id);
        res.json({ workspaces });
    } catch (error) {
        console.error('Get workspaces error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.post('/api/workspaces', authenticateToken, (req, res) => {
    try {
        const { name, description, isPublic } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Workspace adı gerekli' });
        }

        const workspace = db.createWorkspace(name, description, req.user.id, isPublic);
        res.status(201).json({
            message: 'Workspace başarıyla oluşturuldu',
            workspace
        });
    } catch (error) {
        console.error('Create workspace error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.get('/api/workspaces/:id', authenticateToken, (req, res) => {
    try {
        const workspace = db.getWorkspaceById(parseInt(req.params.id), req.user.id);
        if (!workspace) {
            return res.status(404).json({ error: 'Workspace bulunamadı' });
        }
        res.json({ workspace });
    } catch (error) {
        console.error('Get workspace error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Process routes
app.get('/api/workspaces/:workspaceId/processes', authenticateToken, (req, res) => {
    try {
        const workspaceId = parseInt(req.params.workspaceId);
        
        // Workspace'e erişim kontrolü
        const workspace = db.getWorkspaceById(workspaceId, req.user.id);
        if (!workspace) {
            return res.status(404).json({ error: 'Workspace bulunamadı' });
        }

        const processes = db.getProcessesByWorkspace(workspaceId);
        res.json({ processes });
    } catch (error) {
        console.error('Get processes error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.post('/api/workspaces/:workspaceId/processes', authenticateToken, (req, res) => {
    try {
        const workspaceId = parseInt(req.params.workspaceId);
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Süreç adı gerekli' });
        }

        // Workspace'e erişim kontrolü
        const workspace = db.getWorkspaceById(workspaceId, req.user.id);
        if (!workspace) {
            return res.status(404).json({ error: 'Workspace bulunamadı' });
        }

        const process = db.createProcess(name, description, workspaceId, req.user.id);
        res.status(201).json({
            message: 'Süreç başarıyla oluşturuldu',
            process
        });
    } catch (error) {
        console.error('Create process error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.get('/api/processes/:id', authenticateToken, (req, res) => {
    try {
        const processId = parseInt(req.params.id);
        const process = db.getProcessById(processId);
        
        if (!process) {
            return res.status(404).json({ error: 'Süreç bulunamadı' });
        }

        // Workspace'e erişim kontrolü
        const workspace = db.getWorkspaceById(process.workspace_id, req.user.id);
        if (!workspace) {
            return res.status(403).json({ error: 'Bu sürece erişim izniniz yok' });
        }

        // Süreç elementleri ve bağlantıları
        const elements = db.getProcessElements(processId);
        const connections = db.getProcessConnections(processId);

        res.json({
            process,
            elements,
            connections
        });
    } catch (error) {
        console.error('Get process error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Process elements routes
app.post('/api/processes/:processId/elements', authenticateToken, (req, res) => {
    try {
        const processId = parseInt(req.params.processId);
        const { elementType, label, xPosition, yPosition, properties } = req.body;

        if (!elementType || !label) {
            return res.status(400).json({ error: 'Element tipi ve etiket gerekli' });
        }

        // Süreç kontrolü
        const process = db.getProcessById(processId);
        if (!process) {
            return res.status(404).json({ error: 'Süreç bulunamadı' });
        }

        // Workspace'e erişim kontrolü
        const workspace = db.getWorkspaceById(process.workspace_id, req.user.id);
        if (!workspace) {
            return res.status(403).json({ error: 'Bu sürece erişim izniniz yok' });
        }

        const element = db.createProcessElement(processId, elementType, label, xPosition, yPosition, properties);
        res.status(201).json({
            message: 'Element başarıyla oluşturuldu',
            element
        });
    } catch (error) {
        console.error('Create element error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Process connections routes
app.post('/api/processes/:processId/connections', authenticateToken, (req, res) => {
    try {
        const processId = parseInt(req.params.processId);
        const { sourceElementId, targetElementId, label, properties } = req.body;

        if (!sourceElementId || !targetElementId) {
            return res.status(400).json({ error: 'Kaynak ve hedef element ID gerekli' });
        }

        // Süreç kontrolü
        const process = db.getProcessById(processId);
        if (!process) {
            return res.status(404).json({ error: 'Süreç bulunamadı' });
        }

        // Workspace'e erişim kontrolü
        const workspace = db.getWorkspaceById(process.workspace_id, req.user.id);
        if (!workspace) {
            return res.status(403).json({ error: 'Bu sürece erişim izniniz yok' });
        }

        const connection = db.createProcessConnection(processId, sourceElementId, targetElementId, label, properties);
        res.status(201).json({
            message: 'Bağlantı başarıyla oluşturuldu',
            connection
        });
    } catch (error) {
        console.error('Create connection error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Process elements - Update
app.put('/api/processes/:processId/elements/:elementId', authenticateToken, (req, res) => {
    try {
        const processId = parseInt(req.params.processId);
        const elementId = parseInt(req.params.elementId);
        const { label, xPosition, yPosition, properties } = req.body;

        // Süreç kontrolü
        const process = db.getProcessById(processId);
        if (!process) {
            return res.status(404).json({ error: 'Süreç bulunamadı' });
        }

        // Workspace'e erişim kontrolü
        const workspace = db.getWorkspaceById(process.workspace_id, req.user.id);
        if (!workspace) {
            return res.status(403).json({ error: 'Bu sürece erişim izniniz yok' });
        }

        // Element güncelleme işlemi
        const updatedElement = db.updateProcessElement(processId, elementId, {
            label, xPosition, yPosition, properties
        });
        
        res.json({
            message: 'Element başarıyla güncellendi',
            element: updatedElement
        });
    } catch (error) {
        console.error('Update element error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Process elements - Delete
app.delete('/api/processes/:processId/elements/:elementId', authenticateToken, (req, res) => {
    try {
        const processId = parseInt(req.params.processId);
        const elementId = parseInt(req.params.elementId);

        // Süreç kontrolü
        const process = db.getProcessById(processId);
        if (!process) {
            return res.status(404).json({ error: 'Süreç bulunamadı' });
        }

        // Workspace'e erişim kontrolü
        const workspace = db.getWorkspaceById(process.workspace_id, req.user.id);
        if (!workspace) {
            return res.status(403).json({ error: 'Bu sürece erişim izniniz yok' });
        }

        // Element silme işlemi
        db.deleteProcessElement(processId, elementId);
        
        res.json({ message: 'Element başarıyla silindi' });
    } catch (error) {
        console.error('Delete element error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Process connections - Delete
app.delete('/api/processes/:processId/connections/:connectionId', authenticateToken, (req, res) => {
    try {
        const processId = parseInt(req.params.processId);
        const connectionId = parseInt(req.params.connectionId);

        // Süreç kontrolü
        const process = db.getProcessById(processId);
        if (!process) {
            return res.status(404).json({ error: 'Süreç bulunamadı' });
        }

        // Workspace'e erişim kontrolü
        const workspace = db.getWorkspaceById(process.workspace_id, req.user.id);
        if (!workspace) {
            return res.status(403).json({ error: 'Bu sürece erişim izniniz yok' });
        }

        // Bağlantı silme işlemi
        db.deleteProcessConnection(processId, connectionId);
        
        res.json({ message: 'Bağlantı başarıyla silindi' });
    } catch (error) {
        console.error('Delete connection error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Sunucu hatası' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint bulunamadı' });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Server kapatılıyor...');
    db.close();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`ProcessFlow Backend API çalışıyor: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 