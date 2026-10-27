# Planlı Bakım Takvimi

Makine önem sıralaması, zaman çizelgesi ve yaklaşan bakım uyarıları olan, sunucusuz tek sayfa uygulama.
Hesap, veritabanı veya ücretli servis gerekmez. Tamamı statik dosyadır.

## Dosyalar

| Dosya | Görevi |
| --- | --- |
| `index.html` | Uygulamanın tamamı (arayüz, mantık, stil) |
| `sw.js` | Çevrimdışı çalışma ve bildirim tıklaması |
| `manifest.webmanifest`, `icon.svg` | Telefonda "ana ekrana ekle" desteği |

## Ücretsiz yayınlama (herkes bir adresten açar)

### Seçenek 1: GitHub Pages (önerilen, kalıcı adres)

Klasörde şu komutları çalıştır. `gh` komutu için GitHub CLI kurulu ve giriş yapılmış olmalı.

```bash
git init -b main
git add .
git commit -m "Planlı Bakım Takvimi"
gh repo create planli-bakim --public --source . --push
gh api -X POST repos/{owner}/planli-bakim/pages -f "source[branch]=main" -f "source[path]=/"
```

Birkaç dakika sonra adres hazır olur: `https://KULLANICI-ADIN.github.io/planli-bakim/`

Arayüzden yapmak istersen: GitHub'da boş bir public depo aç, dosyaları yükle, **Settings > Pages** bölümünde
kaynak olarak `main` dalını ve `/ (root)` klasörünü seç.

### Seçenek 2: Netlify Drop (en hızlı)

`app.netlify.com/drop` adresine klasörü sürükle. Adres anında oluşur. Kalıcı olması için ücretsiz hesapla sahiplen.

### Seçenek 3: Cloudflare Pages

Depoyu Cloudflare Pages'e bağla. Build komutu boş, çıktı klasörü `/` olmalı.

## Bilmen gerekenler

- **Veri nerede?** Her kullanıcının tarayıcısında (localStorage). Sunucu yoktur. Başka cihaza taşımak için
  Ayarlar sayfasındaki yedek dosyasını ya da paylaşım bağlantısını kullan.
- **Uyarılar nasıl çalışır?** Uygulama içinde durum etiketleri, zil simgesi ve sekme başlığındaki sayaç her zaman çalışır.
  Tarayıcı bildirimi yalnızca uygulama açıkken (ya da ana ekrana eklenmişken) gelir. Uygulama kapalıyken uyarı almanın
  güvenilir yolu Ayarlar sayfasındaki `.ics` takvim dosyasıdır. Plan değiştirince dosyayı yeniden aktar.
- **Ortak canlı veri gerekirse:** Bu sürümde yok. Ekip tek bir listeyi birlikte güncelleyecekse Google E-Tablolar
  (Apps Script) ya da Supabase ücretsiz katmanıyla küçük bir senkron katmanı eklenebilir.

## Uyarı mantığı

Her plan için durum, sonraki bakım tarihine göre hesaplanır:

- **Gecikmiş:** tarih geçti.
- **Yaklaşıyor:** tarihe, uyarı süresinden az kaldı. Varsayılan süreler makine sınıfına göredir (A 14, B 7, C 3 gün).
- **Planlı:** henüz uyarı penceresinde değil.

Makine sınıfı dört faktörün toplamından çıkar (1-5 puan): güvenlik ve çevre, üretime etki, onarım süresi,
alternatifsizlik. Toplam 15 ve üzeri A, 10-14 B, altı C sınıfıdır.
