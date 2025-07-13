# ProcessFlow - Süreç Haritalama ve İyileştirme Platformu

ProcessFlow, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir süreç haritalama ve iyileştirme platformudur. Kullanıcıların süreçlerini görsel olarak modelleyebilmesi, analiz edebilmesi ve iyileştirmeler önerebilmesi için tasarlanmıştır.

## 🚀 Özellikler

### 🔐 Kullanıcı Yönetimi
- Kullanıcı kaydı ve girişi
- JWT tabanlı kimlik doğrulama
- Rol tabanlı erişim kontrolü

### 🏢 Workspace Yönetimi
- Çoklu workspace desteği
- Workspace üyelik sistemi
- Genel ve özel workspace'ler

### 📊 Süreç Modelleme
- Görsel süreç editörü
- Sürükle-bırak element ekleme
- Elementler arası bağlantı kurma
- Otomatik düzenleme (grid layout)
- Gerçek zamanlı kaydetme

### 🎨 Süreç Elementleri
- **Başlangıç/bitiş** noktaları
- **İşlem** adımları
- **Karar** noktaları
- **Alt süreç** referansları
- **Doküman** bağlantıları

### 🔗 Bağlantı Yönetimi
- Elementler arası akış bağlantıları
- Bağlantı etiketleri
- Çoklu bağlantı desteği
- Bağlantı modu ile kolay çizim

### 📈 Analitik ve Raporlama
- Süreç performans metrikleri
- Darboğaz analizi
- İyileştirme önerileri
- PDF/PNG export

## 🛠️ Teknolojiler

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Hızlı build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon set
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Veritabanı (better-sqlite3)
- **JWT** - Kimlik doğrulama
- **bcryptjs** - Şifre hashleme

### Veritabanı
- **SQLite** - Hafif, dosya tabanlı veritabanı
- **6 Ana Tablo**: users, workspaces, workspace_members, processes, process_elements, process_connections

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Git

### Adımlar

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/kullaniciadi/processflow.git
cd processflow
```

2. **Frontend bağımlılıklarını yükleyin:**
```bash
npm install
```

3. **Backend bağımlılıklarını yükleyin:**
```bash
cd backend
npm install
cd ..
```

4. **Ortam değişkenlerini ayarlayın (opsiyonel):**
```bash
# Backend için .env dosyası oluşturun
cd backend
echo "PORT=3001" > .env
echo "JWT_SECRET=your-secret-key-here" >> .env
cd ..
```

5. **Uygulamayı başlatın:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

6. **Tarayıcıda açın:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🧪 Test

### Backend API Testleri
```bash
cd backend
npm test
```

### Manuel Test
- Postman koleksiyonu: `backend/ProcessFlow_API.postman_collection.json`
- Health check: http://localhost:3001/api/health

## 📚 API Dokümantasyonu

Detaylı API dokümantasyonu için [backend/README.md](backend/README.md) dosyasını inceleyin.

### Ana Endpoint'ler
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/workspaces` - Workspace listesi
- `POST /api/workspaces` - Workspace oluşturma
- `GET /api/workspaces/:id/processes` - Süreç listesi
- `POST /api/workspaces/:id/processes` - Süreç oluşturma
- `GET /api/processes/:id` - Süreç detayları
- `POST /api/processes/:id/elements` - Element ekleme
- `PUT /api/processes/:id/elements/:elementId` - Element güncelleme
- `DELETE /api/processes/:id/elements/:elementId` - Element silme

## 🎯 Kullanım

### 1. Kullanıcı Kaydı ve Giriş
- Ana sayfada "Kayıt Ol" butonuna tıklayın
- Gerekli bilgileri doldurun
- Giriş yapın

### 2. Workspace Oluşturma
- Dashboard'da "Yeni Workspace" butonuna tıklayın
- Workspace adı ve açıklamasını girin
- Workspace'i oluşturun

### 3. Süreç Oluşturma
- Workspace'e girin
- "Yeni Süreç Oluştur" butonuna tıklayın
- Süreç adı ve açıklamasını girin

### 4. Süreç Modelleme
- Süreç editöründe element ekleyin
- Elementleri sürükleyerek konumlandırın
- Elementler arası bağlantılar kurun
- Otomatik düzenleme kullanın

### 5. Analiz ve Export
- Süreç analizini görüntüleyin
- PDF veya PNG olarak export edin
- İyileştirme önerilerini inceleyin

## 🔧 Geliştirme

### Proje Yapısı
```
ProcessFlow/
├── src/                    # Frontend kaynak kodları
│   ├── components/         # React bileşenleri
│   ├── contexts/          # Context API'leri
│   ├── services/          # API servisleri
│   ├── utils/             # Yardımcı fonksiyonlar
│   └── styles/            # CSS dosyaları
├── backend/               # Backend kaynak kodları
│   ├── database.js        # Veritabanı işlemleri
│   ├── server.js          # Express sunucusu
│   └── test-api.js        # API testleri
├── public/                # Statik dosyalar
└── docs/                  # Dokümantasyon
```

### Geliştirme Komutları
```bash
# Frontend geliştirme
npm run dev

# Backend geliştirme
cd backend
npm run dev

# Production build
npm run build

# Test çalıştırma
cd backend
npm test
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasını inceleyin.

## 👥 Ekip

- **Geliştirici**: [Adınız]
- **Email**: [email@example.com]
- **GitHub**: [@kullaniciadi]

## 🙏 Teşekkürler

- [React](https://reactjs.org/) - Modern UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Express.js](https://expressjs.com/) - Web framework
- [SQLite](https://www.sqlite.org/) - Veritabanı
- [Lucide](https://lucide.dev/) - Icon set

## 📞 İletişim

Proje hakkında sorularınız için:
- GitHub Issues: [Proje Issues Sayfası]
- Email: [email@example.com]

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! 