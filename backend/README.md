# ProcessFlow Backend API Dokümantasyonu

## Genel Bakış

ProcessFlow Backend API, süreç haritalama ve iyileştirme platformu için geliştirilmiş RESTful API'dir. SQLite veritabanı kullanarak kullanıcı yönetimi, workspace yönetimi ve süreç modelleme işlevlerini sağlar.

## Teknolojiler

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Veritabanı (better-sqlite3)
- **JWT** - Kimlik doğrulama
- **bcryptjs** - Şifre hashleme
- **CORS** - Cross-origin resource sharing

## Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
cd backend
npm install
```

2. **Ortam değişkenlerini ayarlayın (opsiyonel):**
```bash
# .env dosyası oluşturun
PORT=3001
JWT_SECRET=your-secret-key-here
```

3. **Sunucuyu başlatın:**
```bash
# Geliştirme modu
npm run dev

# Prodüksiyon modu
npm start
```

Sunucu varsayılan olarak `http://localhost:3001` adresinde çalışır.

## Veritabanı Yapısı

### Tablolar

#### 1. users
Kullanıcı bilgilerini saklar.

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | INTEGER | Primary key, auto increment |
| username | TEXT | Benzersiz kullanıcı adı |
| email | TEXT | Benzersiz email adresi |
| password_hash | TEXT | Hashlenmiş şifre |
| full_name | TEXT | Kullanıcının tam adı |
| role | TEXT | Kullanıcı rolü (user/admin) |
| created_at | DATETIME | Oluşturulma tarihi |
| updated_at | DATETIME | Güncellenme tarihi |

#### 2. workspaces
Çalışma alanlarını saklar.

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | INTEGER | Primary key, auto increment |
| name | TEXT | Workspace adı |
| description | TEXT | Workspace açıklaması |
| owner_id | INTEGER | Workspace sahibi (users.id) |
| is_public | BOOLEAN | Genel erişim durumu |
| created_at | DATETIME | Oluşturulma tarihi |
| updated_at | DATETIME | Güncellenme tarihi |

#### 3. workspace_members
Workspace üyeliklerini saklar.

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | INTEGER | Primary key, auto increment |
| workspace_id | INTEGER | Workspace ID |
| user_id | INTEGER | Kullanıcı ID |
| role | TEXT | Üye rolü (owner/member) |
| joined_at | DATETIME | Katılım tarihi |

#### 4. processes
Süreçleri saklar.

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | INTEGER | Primary key, auto increment |
| name | TEXT | Süreç adı |
| description | TEXT | Süreç açıklaması |
| workspace_id | INTEGER | Workspace ID |
| created_by | INTEGER | Oluşturan kullanıcı ID |
| status | TEXT | Süreç durumu (draft/published) |
| created_at | DATETIME | Oluşturulma tarihi |
| updated_at | DATETIME | Güncellenme tarihi |

#### 5. process_elements
Süreç elementlerini saklar.

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | INTEGER | Primary key, auto increment |
| process_id | INTEGER | Süreç ID |
| element_type | TEXT | Element tipi (start/end/process/decision) |
| label | TEXT | Element etiketi |
| x_position | REAL | X koordinatı |
| y_position | REAL | Y koordinatı |
| properties | TEXT | JSON formatında ek özellikler |
| created_at | DATETIME | Oluşturulma tarihi |

#### 6. process_connections
Süreç bağlantılarını saklar.

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | INTEGER | Primary key, auto increment |
| process_id | INTEGER | Süreç ID |
| source_element_id | INTEGER | Kaynak element ID |
| target_element_id | INTEGER | Hedef element ID |
| label | TEXT | Bağlantı etiketi |
| properties | TEXT | JSON formatında ek özellikler |
| created_at | DATETIME | Oluşturulma tarihi |

## API Endpoints

### Kimlik Doğrulama

#### POST /api/auth/register
Yeni kullanıcı kaydı.

**Request Body:**
```json
{
  "username": "string",
  "email": "string", 
  "password": "string",
  "fullName": "string"
}
```

**Response:**
```json
{
  "message": "Kullanıcı başarıyla oluşturuldu",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "fullName": "string"
  },
  "token": "jwt-token"
}
```

#### POST /api/auth/login
Kullanıcı girişi.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Giriş başarılı",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "string"
  },
  "token": "jwt-token"
}
```

### Kullanıcı İşlemleri

#### GET /api/user/profile
Kullanıcı profil bilgilerini getirir.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "string",
    "created_at": "datetime"
  }
}
```

### Workspace İşlemleri

#### GET /api/workspaces
Kullanıcının workspace'lerini listeler.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "workspaces": [
    {
      "id": 1,
      "name": "string",
      "description": "string",
      "owner_id": 1,
      "is_public": false,
      "user_role": "owner",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ]
}
```

#### POST /api/workspaces
Yeni workspace oluşturur.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "isPublic": false
}
```

**Response:**
```json
{
  "message": "Workspace başarıyla oluşturuldu",
  "workspace": {
    "id": 1,
    "name": "string",
    "description": "string",
    "ownerId": 1,
    "isPublic": false
  }
}
```

#### GET /api/workspaces/:id
Belirli bir workspace'i getirir.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "workspace": {
    "id": 1,
    "name": "string",
    "description": "string",
    "owner_id": 1,
    "is_public": false,
    "user_role": "owner",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

### Süreç İşlemleri

#### GET /api/workspaces/:workspaceId/processes
Workspace'deki süreçleri listeler.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "processes": [
    {
      "id": 1,
      "name": "string",
      "description": "string",
      "workspace_id": 1,
      "created_by": 1,
      "created_by_name": "string",
      "status": "draft",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ]
}
```

#### POST /api/workspaces/:workspaceId/processes
Yeni süreç oluşturur.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```

**Response:**
```json
{
  "message": "Süreç başarıyla oluşturuldu",
  "process": {
    "id": 1,
    "name": "string",
    "description": "string",
    "workspaceId": 1,
    "createdBy": 1
  }
}
```

#### GET /api/processes/:id
Süreç detaylarını, elementlerini ve bağlantılarını getirir.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "process": {
    "id": 1,
    "name": "string",
    "description": "string",
    "workspace_id": 1,
    "created_by": 1,
    "created_by_name": "string",
    "status": "draft",
    "created_at": "datetime",
    "updated_at": "datetime"
  },
  "elements": [
    {
      "id": 1,
      "process_id": 1,
      "element_type": "start",
      "label": "string",
      "x_position": 100.0,
      "y_position": 100.0,
      "properties": "{}",
      "created_at": "datetime"
    }
  ],
  "connections": [
    {
      "id": 1,
      "process_id": 1,
      "source_element_id": 1,
      "target_element_id": 2,
      "label": "string",
      "properties": "{}",
      "created_at": "datetime"
    }
  ]
}
```

### Süreç Elementleri

#### POST /api/processes/:processId/elements
Sürece yeni element ekler.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "elementType": "start",
  "label": "string",
  "xPosition": 100.0,
  "yPosition": 100.0,
  "properties": {}
}
```

**Response:**
```json
{
  "message": "Element başarıyla oluşturuldu",
  "element": {
    "id": 1,
    "processId": 1,
    "elementType": "start",
    "label": "string",
    "xPosition": 100.0,
    "yPosition": 100.0,
    "properties": {}
  }
}
```

### Süreç Bağlantıları

#### POST /api/processes/:processId/connections
Sürece yeni bağlantı ekler.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "sourceElementId": 1,
  "targetElementId": 2,
  "label": "string",
  "properties": {}
}
```

**Response:**
```json
{
  "message": "Bağlantı başarıyla oluşturuldu",
  "connection": {
    "id": 1,
    "processId": 1,
    "sourceElementId": 1,
    "targetElementId": 2,
    "label": "string",
    "properties": {}
  }
}
```

## Hata Kodları

| Kod | Açıklama |
|-----|----------|
| 200 | Başarılı |
| 201 | Oluşturuldu |
| 400 | Geçersiz istek |
| 401 | Kimlik doğrulama gerekli |
| 403 | Erişim reddedildi |
| 404 | Bulunamadı |
| 500 | Sunucu hatası |

## Güvenlik

### JWT Token
- Token süresi: 24 saat
- Secret key: Ortam değişkeni veya varsayılan değer
- Bearer token formatı kullanılır

### Şifre Güvenliği
- bcryptjs ile hashleme
- Salt rounds: 10
- Güvenli karşılaştırma

### CORS
- Origin: http://localhost:5173 (React frontend)
- Credentials: true

## Veritabanı Sınıfı (ProcessFlowDatabase)

### Ana Metodlar

#### init()
Veritabanını başlatır, tabloları oluşturur ve başlangıç verilerini ekler.

#### createUser(username, email, password, fullName)
Yeni kullanıcı oluşturur.

#### getUserByUsername(username)
Kullanıcı adına göre kullanıcı getirir.

#### verifyPassword(user, password)
Şifre doğrulaması yapar.

#### createWorkspace(name, description, ownerId, isPublic)
Yeni workspace oluşturur.

#### getWorkspacesByUser(userId)
Kullanıcının workspace'lerini getirir.

#### createProcess(name, description, workspaceId, createdBy)
Yeni süreç oluşturur.

#### getProcessesByWorkspace(workspaceId)
Workspace'deki süreçleri getirir.

#### createProcessElement(processId, elementType, label, xPosition, yPosition, properties)
Süreç elementini oluşturur.

#### createProcessConnection(processId, sourceElementId, targetElementId, label, properties)
Süreç bağlantısını oluşturur.

## Başlangıç Verileri

Sistem ilk çalıştırıldığında otomatik olarak oluşturulan veriler:

### Admin Kullanıcısı
- Username: admin
- Password: admin123
- Email: admin@processflow.com
- Role: admin

### Demo Workspace
- Name: Demo Workspace
- Description: Demo amaçlı workspace
- Owner: admin kullanıcısı
- Public: true

## Geliştirme

### Geliştirme Modu
```bash
npm run dev
```
Nodemon ile otomatik yeniden başlatma.

### Loglama
- Console.log ile temel loglama
- Hata durumları için detaylı loglama

### Graceful Shutdown
SIGINT sinyali ile veritabanı bağlantısı güvenli şekilde kapatılır.

## Test

### Otomatik Test
```bash
# Tüm API endpoint'lerini test et
npm test

# Veya doğrudan çalıştır
node test-api.js
```

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Postman Koleksiyonu
`ProcessFlow_API.postman_collection.json` dosyasını Postman'e import ederek tüm endpoint'leri test edebilirsiniz.

### Manuel Test
Postman veya benzeri API test araçları kullanılabilir.

## Dağıtım

### Ortam Değişkenleri
- `PORT`: Sunucu portu (varsayılan: 3001)
- `JWT_SECRET`: JWT secret key

### Prodüksiyon
```bash
npm start
```

## Lisans

ISC License 