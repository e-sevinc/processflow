# 🚀 ProcessFlow GitHub'a Yükleme Rehberi

Bu rehber, ProcessFlow projesini GitHub'da yeni bir repository olarak oluşturmanız için adım adım talimatları içerir.

## 📋 Ön Gereksinimler

- GitHub hesabı
- Git yüklü (✅ Tamamlandı)
- Proje dosyaları hazır (✅ Tamamlandı)

## 🔧 Adım Adım Yükleme

### 1. GitHub'da Yeni Repository Oluşturma

1. **GitHub'a giriş yapın**: https://github.com
2. **Sağ üst köşedeki "+" butonuna tıklayın**
3. **"New repository" seçin**
4. **Repository bilgilerini doldurun:**
   - **Repository name**: `processflow` (veya istediğiniz isim)
   - **Description**: `Süreç Haritalama ve İyileştirme Platformu`
   - **Visibility**: 
     - ✅ **Public** (önerilen - açık kaynak)
     - 🔒 **Private** (sadece siz görebilirsiniz)
   - **Initialize this repository with**: 
     - ❌ **Add a README file** (bizim README'miz var)
     - ❌ **Add .gitignore** (bizim .gitignore'umuz var)
     - ❌ **Choose a license** (bizim LICENSE'ımız var)
5. **"Create repository" butonuna tıklayın**

### 2. Yerel Repository'yi GitHub'a Bağlama

GitHub'da repository oluşturduktan sonra, size şu komutları verecek:

```bash
# Mevcut durumda olduğunuz için bu komutları çalıştırın:
git remote add origin https://github.com/KULLANICI_ADINIZ/processflow.git
git branch -M main
git push -u origin main
```

**KULLANICI_ADINIZ** yerine GitHub kullanıcı adınızı yazın.

### 3. Komutları Çalıştırma

Terminal'de şu komutları sırayla çalıştırın:

```bash
# GitHub repository'sini remote olarak ekleyin
git remote add origin https://github.com/KULLANICI_ADINIZ/processflow.git

# Ana branch'i 'main' olarak ayarlayın
git branch -M main

# Kodları GitHub'a yükleyin
git push -u origin main
```

### 4. Kimlik Doğrulama

Eğer kimlik doğrulama istenirse:
- **GitHub kullanıcı adınızı** girin
- **Personal Access Token** veya **GitHub şifrenizi** girin

## 🎯 Tamamlanan Adımlar

✅ **Git repository başlatıldı**
✅ **Dosyalar eklendi**
✅ **İlk commit yapıldı**
✅ **README.md oluşturuldu**
✅ **LICENSE dosyası eklendi**
✅ **.gitignore dosyası oluşturuldu**

## 📝 Sonraki Adımlar

### 1. Repository Ayarları

GitHub'da repository oluşturduktan sonra:

1. **Settings** sekmesine gidin
2. **Pages** bölümünde GitHub Pages'i etkinleştirin (opsiyonel)
3. **Topics** ekleyin: `process-flow`, `react`, `nodejs`, `express`, `sqlite`

### 2. README.md Güncelleme

Repository oluşturduktan sonra README.md dosyasındaki linkleri güncelleyin:

```markdown
# Bu satırı güncelleyin:
git clone https://github.com/KULLANICI_ADINIZ/processflow.git

# Bu bölümü güncelleyin:
- **GitHub**: [@KULLANICI_ADINIZ]
```

### 3. Issues ve Projects

1. **Issues** sekmesinde template'ler oluşturun
2. **Projects** sekmesinde proje yönetimi board'u oluşturun

## 🔗 Faydalı Linkler

- **GitHub CLI**: https://cli.github.com/ (alternatif yöntem)
- **GitHub Desktop**: https://desktop.github.com/ (görsel arayüz)
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf

## 🚨 Olası Sorunlar ve Çözümleri

### 1. "Repository already exists" Hatası
```bash
# Remote'u değiştirin
git remote set-url origin https://github.com/KULLANICI_ADINIZ/processflow.git
```

### 2. Authentication Hatası
```bash
# Personal Access Token kullanın
# GitHub > Settings > Developer settings > Personal access tokens
```

### 3. Branch Hatası
```bash
# Branch'i yeniden adlandırın
git branch -M main
```

## 📊 Repository İstatistikleri

Proje yüklendikten sonra şunları göreceksiniz:
- 📁 **Dosya sayısı**: ~50+ dosya
- 📦 **Boyut**: ~5-10 MB
- 🌟 **Teknolojiler**: React, Node.js, Express, SQLite
- 📚 **Dokümantasyon**: Kapsamlı README ve API docs

## 🎉 Başarı!

Repository başarıyla oluşturulduktan sonra:

1. **README.md'yi kontrol edin**
2. **Issues açın** (geliştirme planları için)
3. **Stars verin** (kendi projenize 😊)
4. **Social media'da paylaşın**

---

**İyi şanslar! 🚀** 