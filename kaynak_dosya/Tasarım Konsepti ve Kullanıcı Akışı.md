## Tasarım Konsepti ve Kullanıcı Akışı

### Genel Tasarım Yaklaşımı
Modern, temiz ve sezgisel bir kullanıcı arayüzü (UI) tasarımı benimsenecektir. Odak noktası, karmaşık süreç haritalama işlevselliğini kullanıcı dostu bir şekilde sunmaktır. Renk paleti olarak kurumsal ve güven veren tonlar (mavi, gri, beyaz) tercih edilecek, vurgu renkleri (yeşil, turuncu) ise etkileşimli öğeler ve durum bildirimleri için kullanılacaktır. Tipografi olarak okunabilirliği yüksek, modern sans-serif fontlar kullanılacaktır.

### Kullanıcı Akışı (MVP)

1.  **Kayıt ve Giriş:**
    *   Kullanıcılar e-posta adresleri ve şifreleri ile kayıt olabilirler.
    *   Kayıt sonrası e-posta doğrulama linki gönderilir.
    *   Doğrulama sonrası kullanıcılar giriş yapabilirler.
    *   Şifremi unuttum özelliği ile e-posta üzerinden şifre sıfırlama sağlanır.

2.  **Çalışma Alanı Yönetimi:**
    *   Giriş yapan kullanıcılar mevcut çalışma alanlarını görebilir veya yeni bir çalışma alanı oluşturabilirler.
    *   Çalışma alanları arasında geçiş yapabilirler.

3.  **Süreç Haritalama:**
    *   Çalışma alanı seçildikten sonra kullanıcılar süreç listesini görürler.
    *   Yeni süreç oluşturma veya mevcut süreçleri düzenleme seçeneği sunulur.
    *   **Görsel Süreç Oluşturucu:**
        *   Boş bir tuval üzerinde sürükle-bırak ile adım, karar, başlangıç/bitiş noktaları ve bağlayıcılar eklenebilir.
        *   Elemanlar kolayca taşınabilir, boyutlandırılabilir, düzenlenebilir ve silinebilir.
        *   Her elemana çift tıklayarak veya bir özellik paneli aracılığıyla detaylar (ad, renk, ikon, açıklama) eklenebilir.
        *   Otomatik düzenleme (clean-up layout) butonu ile diyagram düzeni optimize edilebilir.

4.  **Süreç Detayları ve Özellikleri:**
    *   Her süreç için süreç sahibi, departman, sürüm ve durum gibi meta veriler girilebilir ve görüntülenebilir.

5.  **Dışa Aktarma:**
    *   Oluşturulan süreç diyagramları PDF, PNG, SVG formatlarında dışa aktarılabilir.
    *   Süreç adımları listesi Excel ve CSV formatlarında dışa aktarılabilir.

6.  **Çoklu Dil Desteği:**
    *   UI üzerinde bir dil değiştirme butonu (TR/EN) bulunur.
    *   Dil değişimi anında arayüz metinlerini ve süreç/adım etiketlerini günceller.

### Görsel Varlıklar
*   **İkonlar:** Basit, anlaşılır ve tutarlı bir ikon seti kullanılacaktır (örneğin, Material Design ikonları veya benzeri).
*   **Renk Paleti:** Ana renkler: #2196F3 (Mavi - birincil), #4CAF50 (Yeşil - başarı/onay), #FF9800 (Turuncu - uyarı/dikkat).
*   **Fontlar:** Google Fonts'tan seçilecek, örneğin 'Roboto' veya 'Open Sans' gibi modern ve okunabilir fontlar.

### Duyarlılık
*   Tasarım, masaüstü, tablet ve mobil cihazlarda sorunsuz bir deneyim sunacak şekilde duyarlı (responsive) olacaktır. Esnek grid sistemleri ve medya sorguları kullanılacaktır.




### İkon Kütüphanesi Seçimi
Web sitesinde kullanılacak ikonlar için **Font Awesome** kütüphanesi tercih edilmiştir. Geniş ikon yelpazesi, kolay entegrasyonu ve popülerliği nedeniyle uygun bir seçimdir.


