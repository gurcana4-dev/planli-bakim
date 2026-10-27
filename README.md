# Rebul Planlı Bakım

Makine önem sıralaması, zaman çizelgesi, yönetici panosu ve yaklaşan bakım uyarıları olan, sunucusuz tek sayfa uygulama.
Hesap, veritabanı veya ücretli servis gerekmez. Tamamı statik dosyadır.

Canlı adres: https://gurcana4-dev.github.io/planli-bakim/

## Dosyalar

| Dosya | Görevi |
| --- | --- |
| `index.html` | Uygulamanın tamamı (arayüz, mantık, stil) |
| `logo.png` | Rebul 1895 logosu (saydam zeminli, beyaz) |
| `icon-192.png`, `icon-512.png` | Uygulama simgeleri (ana ekrana ekle, sekme simgesi) |
| `manifest.webmanifest` | Telefonda "ana ekrana ekle" desteği |
| `sw.js` | Çevrimdışı çalışma ve bildirim tıklaması |

## Pano

Genel Bakış sayfası yöneticiye tek bakışta şunları verir:

- KPI şeridi: PM uyum oranı, gecikmiş, yaklaşan, 30 günlük iş yükü, tamamlanan, kritik (A) makine sağlığı
- Bölüme göre bakım yükü, bakım türü payı, aylık planlanan bakım (sınıfa göre)
- Makine önem sıralaması tablosu, aylık tamamlanan bakım grafiği, uyarılar ve otomatik içgörüler
- Dönem, bölüm ve sınıf süzgeçleri. Rapor (PDF) düğmesi yatay A4 çıktı üretir.

## Tanımlar (Ayarlar sayfası)

Her tanım Ayarlar sayfasındaki sekmelerden yapılır:

- **Hatlar:** üretim hatlarını ve bölümleri ekle, adlandır, önem düzeyi (1-5) ver. Aynı puanlı makineler hat önemine göre sıralanır.
- **Makineler:** makine ekle, hatlara bağla, önem puanlarını düzenle.
- **Önem sınıfları:** A ve B eşik puanlarını, sınıf adlarını ve uyarı sürelerini belirle. Dört önem faktörünün adını, sorusunu ve puan açıklamalarını kendi tesisine göre değiştir.
- **Bakım türleri:** plan formundaki kategori listesi. Ad değişince planlar da güncellenir.
- **Sorumlular:** plan ve tamamlama formlarındaki kişi ve ekip listesi.
- **Bildirim ve görünüm:** PM uyum hedefi, tarayıcı bildirimi, takvim dosyası, tema.
- **Veri:** yedek, geri yükleme, paylaşım bağlantısı. Tanımlar da yedeğe dahildir.

## Yayınlama (ücretsiz)

GitHub Pages `main` dalından yayınlar. Dosyaları değiştirip gönderdiğinde site birkaç dakikada güncellenir:

```bash
git add .
git commit -m "Güncelleme"
git push
```

Sıfırdan kurmak için:

```bash
git init -b main
git add .
git commit -m "Rebul Planlı Bakım"
gh repo create planli-bakim --public --source . --push
gh api -X POST repos/{owner}/planli-bakim/pages -f "source[branch]=main" -f "source[path]=/"
```

Alternatifler: Netlify Drop (`app.netlify.com/drop`, klasörü sürükle) veya Cloudflare Pages.

## Bilmen gerekenler

- **Veri nerede?** Her kullanıcının tarayıcısında (localStorage). Sunucu yoktur. Başka cihaza taşımak için
  Ayarlar sayfasındaki yedek dosyasını ya da paylaşım bağlantısını kullan.
- **Uyarılar nasıl çalışır?** Uygulama içinde durum etiketleri, zil simgesi ve sekme başlığındaki sayaç her zaman çalışır.
  Tarayıcı bildirimi yalnızca uygulama açıkken (ya da ana ekrana eklenmişken) gelir. Uygulama kapalıyken uyarı almanın
  güvenilir yolu Ayarlar sayfasındaki `.ics` takvim dosyasıdır. Plan değiştirince dosyayı yeniden aktar.
- **Ortak canlı veri gerekirse:** Bu sürümde yok. Ekip tek bir listeyi birlikte güncelleyecekse Google E-Tablolar
  (Apps Script) ya da Supabase ücretsiz katmanıyla küçük bir senkron katmanı eklenebilir.

## Uyarı mantığı

- **Gecikmiş:** tarih geçti.
- **Yaklaşıyor:** tarihe, uyarı süresinden az kaldı. Varsayılan süreler makine sınıfına göredir (A 14, B 7, C 3 gün).
- **Planlı:** henüz uyarı penceresinde değil.

Makine sınıfı dört faktörün toplamından çıkar (1-5 puan): güvenlik ve çevre, üretime etki, onarım süresi,
alternatifsizlik. Toplam 15 ve üzeri A, 10-14 B, altı C sınıfıdır. PM uyum hedefi (varsayılan %90) Ayarlar'dan değişir.
