const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

class ProcessFlowDatabase {
    constructor() {
        this.db = null;
        this.dbPath = path.join(__dirname, 'processflow.db');
    }

    init() {
        try {
            this.db = new Database(this.dbPath);
            this.createTables();
            this.insertInitialData();
            console.log('Veritabanı başarıyla başlatıldı:', this.dbPath);
        } catch (error) {
            console.error('Veritabanı başlatma hatası:', error);
            throw error;
        }
    }

    createTables() {
        // Users tablosu
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT,
                role TEXT DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Workspaces tablosu
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS workspaces (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                owner_id INTEGER NOT NULL,
                is_public BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users (id)
            )
        `);

        // Workspace members tablosu
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS workspace_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                workspace_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                role TEXT DEFAULT 'member',
                joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (workspace_id) REFERENCES workspaces (id),
                FOREIGN KEY (user_id) REFERENCES users (id),
                UNIQUE(workspace_id, user_id)
            )
        `);

        // Processes tablosu
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS processes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                workspace_id INTEGER NOT NULL,
                created_by INTEGER NOT NULL,
                status TEXT DEFAULT 'draft',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (workspace_id) REFERENCES workspaces (id),
                FOREIGN KEY (created_by) REFERENCES users (id)
            )
        `);

        // Process elements tablosu
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS process_elements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                process_id INTEGER NOT NULL,
                element_type TEXT NOT NULL,
                label TEXT NOT NULL,
                x_position REAL NOT NULL,
                y_position REAL NOT NULL,
                properties TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (process_id) REFERENCES processes (id)
            )
        `);

        // Process connections tablosu
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS process_connections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                process_id INTEGER NOT NULL,
                source_element_id INTEGER NOT NULL,
                target_element_id INTEGER NOT NULL,
                label TEXT,
                properties TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (process_id) REFERENCES processes (id),
                FOREIGN KEY (source_element_id) REFERENCES process_elements (id),
                FOREIGN KEY (target_element_id) REFERENCES process_elements (id)
            )
        `);
    }

    insertInitialData() {
        // Admin kullanıcısı oluştur
        const adminExists = this.db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
        if (!adminExists) {
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            this.db.prepare(`
                INSERT INTO users (username, email, password_hash, full_name, role)
                VALUES (?, ?, ?, ?, ?)
            `).run('admin', 'admin@processflow.com', hashedPassword, 'Admin User', 'admin');
        }

        // Demo workspace oluştur
        const demoWorkspaceExists = this.db.prepare('SELECT id FROM workspaces WHERE name = ?').get('Demo Workspace');
        if (!demoWorkspaceExists) {
            const adminUser = this.db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
            const workspace = this.db.prepare(`
                INSERT INTO workspaces (name, description, owner_id, is_public)
                VALUES (?, ?, ?, ?)
            `).run('Demo Workspace', 'Demo amaçlı workspace', adminUser.id, 1);

            // Admin'i workspace'e ekle
            this.db.prepare(`
                INSERT INTO workspace_members (workspace_id, user_id, role)
                VALUES (?, ?, ?)
            `).run(workspace.lastInsertRowid, adminUser.id, 'owner');
        }
    }

    // User işlemleri
    createUser(username, email, password, fullName) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        try {
            const result = this.db.prepare(`
                INSERT INTO users (username, email, password_hash, full_name)
                VALUES (?, ?, ?, ?)
            `).run(username, email, hashedPassword, fullName);
            return { id: result.lastInsertRowid, username, email, fullName };
        } catch (error) {
            throw new Error('Kullanıcı oluşturulamadı: ' + error.message);
        }
    }

    getUserByUsername(username) {
        return this.db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    }

    getUserById(id) {
        return this.db.prepare('SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?').get(id);
    }

    verifyPassword(user, password) {
        return bcrypt.compareSync(password, user.password_hash);
    }

    // Workspace işlemleri
    createWorkspace(name, description, ownerId, isPublic = false) {
        try {
            const result = this.db.prepare(`
                INSERT INTO workspaces (name, description, owner_id, is_public)
                VALUES (?, ?, ?, ?)
            `).run(name, description, ownerId, isPublic ? 1 : 0);

            // Owner'ı workspace'e ekle
            this.db.prepare(`
                INSERT INTO workspace_members (workspace_id, user_id, role)
                VALUES (?, ?, ?)
            `).run(result.lastInsertRowid, ownerId, 'owner');

            return { id: result.lastInsertRowid, name, description, ownerId, isPublic };
        } catch (error) {
            throw new Error('Workspace oluşturulamadı: ' + error.message);
        }
    }

    getWorkspacesByUser(userId) {
        return this.db.prepare(`
            SELECT w.*, wm.role as user_role
            FROM workspaces w
            JOIN workspace_members wm ON w.id = wm.workspace_id
            WHERE wm.user_id = ?
            ORDER BY w.updated_at DESC
        `).all(userId);
    }

    getWorkspaceById(workspaceId, userId) {
        return this.db.prepare(`
            SELECT w.*, wm.role as user_role
            FROM workspaces w
            JOIN workspace_members wm ON w.id = wm.workspace_id
            WHERE w.id = ? AND wm.user_id = ?
        `).get(workspaceId, userId);
    }

    // Process işlemleri
    createProcess(name, description, workspaceId, createdBy) {
        try {
            const result = this.db.prepare(`
                INSERT INTO processes (name, description, workspace_id, created_by)
                VALUES (?, ?, ?, ?)
            `).run(name, description, workspaceId, createdBy);
            return { id: result.lastInsertRowid, name, description, workspaceId, createdBy };
        } catch (error) {
            throw new Error('Süreç oluşturulamadı: ' + error.message);
        }
    }

    getProcessesByWorkspace(workspaceId) {
        return this.db.prepare(`
            SELECT p.*, u.username as created_by_name
            FROM processes p
            JOIN users u ON p.created_by = u.id
            WHERE p.workspace_id = ?
            ORDER BY p.updated_at DESC
        `).all(workspaceId);
    }

    getProcessById(processId) {
        return this.db.prepare(`
            SELECT p.*, u.username as created_by_name
            FROM processes p
            JOIN users u ON p.created_by = u.id
            WHERE p.id = ?
        `).get(processId);
    }

    // Process elements işlemleri
    createProcessElement(processId, elementType, label, xPosition, yPosition, properties = {}) {
        try {
            const result = this.db.prepare(`
                INSERT INTO process_elements (process_id, element_type, label, x_position, y_position, properties)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(processId, elementType, label, xPosition, yPosition, JSON.stringify(properties));
            return { id: result.lastInsertRowid, processId, elementType, label, xPosition, yPosition, properties };
        } catch (error) {
            throw new Error('Süreç elementi oluşturulamadı: ' + error.message);
        }
    }

    getProcessElements(processId) {
        return this.db.prepare(`
            SELECT * FROM process_elements
            WHERE process_id = ?
            ORDER BY created_at
        `).all(processId);
    }

    // Process connections işlemleri
    createProcessConnection(processId, sourceElementId, targetElementId, label = '', properties = {}) {
        try {
            const result = this.db.prepare(`
                INSERT INTO process_connections (process_id, source_element_id, target_element_id, label, properties)
                VALUES (?, ?, ?, ?, ?)
            `).run(processId, sourceElementId, targetElementId, label, JSON.stringify(properties));
            return { id: result.lastInsertRowid, processId, sourceElementId, targetElementId, label, properties };
        } catch (error) {
            throw new Error('Süreç bağlantısı oluşturulamadı: ' + error.message);
        }
    }

    getProcessConnections(processId) {
        return this.db.prepare(`
            SELECT * FROM process_connections
            WHERE process_id = ?
            ORDER BY created_at
        `).all(processId);
    }

    // Process elements - Update
    updateProcessElement(processId, elementId, updateData) {
        try {
            const result = this.db.prepare(`
                UPDATE process_elements 
                SET label = ?, x_position = ?, y_position = ?, properties = ?
                WHERE id = ? AND process_id = ?
            `).run(
                updateData.label,
                updateData.xPosition,
                updateData.yPosition,
                JSON.stringify(updateData.properties || {}),
                elementId,
                processId
            );
            
            if (result.changes === 0) {
                throw new Error('Element bulunamadı');
            }
            
            return this.getProcessElementById(elementId);
        } catch (error) {
            throw new Error('Element güncellenemedi: ' + error.message);
        }
    }

    // Process elements - Delete
    deleteProcessElement(processId, elementId) {
        try {
            // Önce bağlantıları sil
            this.db.prepare(`
                DELETE FROM process_connections 
                WHERE process_id = ? AND (source_element_id = ? OR target_element_id = ?)
            `).run(processId, elementId, elementId);
            
            // Sonra elementi sil
            const result = this.db.prepare(`
                DELETE FROM process_elements 
                WHERE id = ? AND process_id = ?
            `).run(elementId, processId);
            
            if (result.changes === 0) {
                throw new Error('Element bulunamadı');
            }
        } catch (error) {
            throw new Error('Element silinemedi: ' + error.message);
        }
    }

    // Process connections - Delete
    deleteProcessConnection(processId, connectionId) {
        try {
            const result = this.db.prepare(`
                DELETE FROM process_connections 
                WHERE id = ? AND process_id = ?
            `).run(connectionId, processId);
            
            if (result.changes === 0) {
                throw new Error('Bağlantı bulunamadı');
            }
        } catch (error) {
            throw new Error('Bağlantı silinemedi: ' + error.message);
        }
    }

    // Get process element by ID
    getProcessElementById(elementId) {
        return this.db.prepare(`
            SELECT * FROM process_elements
            WHERE id = ?
        `).get(elementId);
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = ProcessFlowDatabase; 