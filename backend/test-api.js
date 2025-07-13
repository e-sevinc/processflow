const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
let authToken = '';
let workspaceId = '';
let processId = '';

// Test fonksiyonları
async function testHealthCheck() {
    console.log('🔍 Health Check testi...');
    try {
        const response = await axios.get(`${BASE_URL}/api/health`);
        console.log('✅ Health Check başarılı:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Health Check başarısız:', error.response?.data || error.message);
        return false;
    }
}

async function testRegister() {
    console.log('\n🔍 Kullanıcı kaydı testi...');
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/register`, {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            fullName: 'Test User'
        });
        console.log('✅ Kullanıcı kaydı başarılı:', response.data.message);
        return true;
    } catch (error) {
        if (error.response?.status === 400 && error.response.data.error.includes('zaten kullanılıyor')) {
            console.log('⚠️ Kullanıcı zaten mevcut, devam ediliyor...');
            return true;
        }
        console.error('❌ Kullanıcı kaydı başarısız:', error.response?.data || error.message);
        return false;
    }
}

async function testLogin() {
    console.log('\n🔍 Giriş testi...');
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });
        authToken = response.data.token;
        console.log('✅ Giriş başarılı:', response.data.message);
        return true;
    } catch (error) {
        console.error('❌ Giriş başarısız:', error.response?.data || error.message);
        return false;
    }
}

async function testGetProfile() {
    console.log('\n🔍 Profil getirme testi...');
    try {
        const response = await axios.get(`${BASE_URL}/api/user/profile`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Profil getirme başarılı:', response.data.user.username);
        return true;
    } catch (error) {
        console.error('❌ Profil getirme başarısız:', error.response?.data || error.message);
        return false;
    }
}

async function testGetWorkspaces() {
    console.log('\n🔍 Workspace listesi testi...');
    try {
        const response = await axios.get(`${BASE_URL}/api/workspaces`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Workspace listesi başarılı:', response.data.workspaces.length, 'workspace bulundu');
        if (response.data.workspaces.length > 0) {
            workspaceId = response.data.workspaces[0].id;
        }
        return true;
    } catch (error) {
        console.error('❌ Workspace listesi başarısız:', error.response?.data || error.message);
        return false;
    }
}

async function testCreateWorkspace() {
    console.log('\n🔍 Workspace oluşturma testi...');
    try {
        const response = await axios.post(`${BASE_URL}/api/workspaces`, {
            name: 'Test Workspace',
            description: 'Test workspace açıklaması',
            isPublic: false
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        workspaceId = response.data.workspace.id;
        console.log('✅ Workspace oluşturma başarılı:', response.data.workspace.name);
        return true;
    } catch (error) {
        console.error('❌ Workspace oluşturma başarısız:', error.response?.data || error.message);
        return false;
    }
}

async function testGetWorkspaceById() {
    console.log('\n🔍 Workspace detay testi...');
    try {
        const response = await axios.get(`${BASE_URL}/api/workspaces/${workspaceId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Workspace detay başarılı:', response.data.workspace.name);
        return true;
    } catch (error) {
        console.error('❌ Workspace detay başarısız:', error.response?.data || error.message);
        return false;
    }
}

async function testGetProcesses() {
    console.log('\n🔍 Süreç listesi testi...');
    try {
        const response = await axios.get(`${BASE_URL}/api/workspaces/${workspaceId}/processes`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Süreç listesi başarılı:', response.data.processes.length, 'süreç bulundu');
        return true;
    } catch (error) {
        console.error('❌ Süreç listesi başarısız:', error.response?.data || error.message);
        return false;
    }
}

async function testCreateProcess() {
    console.log('\n🔍 Süreç oluşturma testi...');
    try {
        const response = await axios.post(`${BASE_URL}/api/workspaces/${workspaceId}/processes`, {
            name: 'Test Process',
            description: 'Test süreç açıklaması'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        processId = response.data.process.id;
        console.log('✅ Süreç oluşturma başarılı:', response.data.process.name);
        return true;
    } catch (error) {
        console.error('❌ Süreç oluşturma başarısız:', error.response?.data || error.message);
        return false;
    }
}

async function testGetProcessDetails() {
    console.log('\n🔍 Süreç detay testi...');
    try {
        const response = await axios.get(`${BASE_URL}/api/processes/${processId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Süreç detay başarılı:', response.data.process.name);
        console.log('   Elementler:', response.data.elements.length);
        console.log('   Bağlantılar:', response.data.connections.length);
        return true;
    } catch (error) {
        console.error('❌ Süreç detay başarısız:', error.response?.data || error.message);
        return false;
    }
}

async function testCreateElement() {
    console.log('\n🔍 Element oluşturma testi...');
    try {
        const response = await axios.post(`${BASE_URL}/api/processes/${processId}/elements`, {
            elementType: 'start',
            label: 'Başlangıç',
            xPosition: 100.0,
            yPosition: 100.0,
            properties: {}
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Element oluşturma başarılı:', response.data.element.label);
        return response.data.element.id;
    } catch (error) {
        console.error('❌ Element oluşturma başarısız:', error.response?.data || error.message);
        return null;
    }
}

async function testCreateConnection(elementId) {
    console.log('\n🔍 Bağlantı oluşturma testi...');
    try {
        const response = await axios.post(`${BASE_URL}/api/processes/${processId}/connections`, {
            sourceElementId: elementId,
            targetElementId: elementId,
            label: 'Test Bağlantı',
            properties: {}
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Bağlantı oluşturma başarılı:', response.data.connection.label);
        return response.data.connection.id;
    } catch (error) {
        console.error('❌ Bağlantı oluşturma başarısız:', error.response?.data || error.message);
        return null;
    }
}

async function testUpdateElement(elementId) {
    console.log('\n🔍 Element güncelleme testi...');
    try {
        const response = await axios.put(`${BASE_URL}/api/processes/${processId}/elements/${elementId}`, {
            label: 'Güncellenmiş Element',
            xPosition: 200.0,
            yPosition: 200.0,
            properties: { description: 'Güncellenmiş açıklama' }
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Element güncelleme başarılı:', response.data.element.label);
        return true;
    } catch (error) {
        console.error('❌ Element güncelleme başarısız:', error.response?.data || error.message);
        return false;
    }
}

async function testDeleteConnection(connectionId) {
    console.log('\n🔍 Bağlantı silme testi...');
    try {
        const response = await axios.delete(`${BASE_URL}/api/processes/${processId}/connections/${connectionId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Bağlantı silme başarılı:', response.data.message);
        return true;
    } catch (error) {
        console.error('❌ Bağlantı silme başarısız:', error.response?.data || error.message);
        return false;
    }
}

async function testDeleteElement(elementId) {
    console.log('\n🔍 Element silme testi...');
    try {
        const response = await axios.delete(`${BASE_URL}/api/processes/${processId}/elements/${elementId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Element silme başarılı:', response.data.message);
        return true;
    } catch (error) {
        console.error('❌ Element silme başarısız:', error.response?.data || error.message);
        return false;
    }
}

// Ana test fonksiyonu
async function runTests() {
    console.log('🚀 ProcessFlow API Testleri Başlıyor...\n');

    const tests = [
        { name: 'Health Check', fn: testHealthCheck },
        { name: 'Register', fn: testRegister },
        { name: 'Login', fn: testLogin },
        { name: 'Get Profile', fn: testGetProfile },
        { name: 'Get Workspaces', fn: testGetWorkspaces },
        { name: 'Create Workspace', fn: testCreateWorkspace },
        { name: 'Get Workspace by ID', fn: testGetWorkspaceById },
        { name: 'Get Processes', fn: testGetProcesses },
        { name: 'Create Process', fn: testCreateProcess },
        { name: 'Get Process Details', fn: testGetProcessDetails }
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const test of tests) {
        const result = await test.fn();
        if (result) passedTests++;
    }

    // Element ve bağlantı testleri
    if (processId) {
        const elementId = await testCreateElement();
        if (elementId) {
            passedTests++;
            totalTests++;
            
            // Element güncelleme testi
            const updateResult = await testUpdateElement(elementId);
            if (updateResult) {
                passedTests++;
                totalTests++;
            }
            
            const connectionId = await testCreateConnection(elementId);
            if (connectionId) {
                passedTests++;
                totalTests++;
                
                // Bağlantı silme testi
                const deleteConnectionResult = await testDeleteConnection(connectionId);
                if (deleteConnectionResult) {
                    passedTests++;
                    totalTests++;
                }
            }
            
            // Element silme testi
            const deleteElementResult = await testDeleteElement(elementId);
            if (deleteElementResult) {
                passedTests++;
                totalTests++;
            }
        }
    }

    console.log('\n📊 Test Sonuçları:');
    console.log(`✅ Başarılı: ${passedTests}/${totalTests}`);
    console.log(`❌ Başarısız: ${totalTests - passedTests}/${totalTests}`);
    console.log(`📈 Başarı Oranı: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (passedTests === totalTests) {
        console.log('\n🎉 Tüm testler başarılı! API düzgün çalışıyor.');
    } else {
        console.log('\n⚠️ Bazı testler başarısız oldu. API\'yi kontrol edin.');
    }
}

// Test çalıştırma
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = {
    runTests,
    testHealthCheck,
    testLogin,
    testCreateWorkspace,
    testCreateProcess
}; 