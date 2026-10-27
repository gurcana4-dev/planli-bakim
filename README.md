# Rebul Planlı Bakım

Makine önem sıralaması, bakım takvimi, yönetici panosu ve yaklaşan bakım uyarıları olan, sunucusuz tek sayfa uygulama.
Hesap, veritabanı veya ücretli servis gerekmez. Tamamı statik dosyadır.

Canlı adres: https://gurcana4-dev.github.io/planli-bakim/

## Önem seviyesi (A / B / C)

Rebul'un "Ekipman önem seviyesi belirleme" yöntemi uygulanır. Kriterler ve puanlar Ayarlar > Önem sınıfları'ndan değiştirilir.

- **Üretim üzerine etkisi:** tolere edilebilir kapasite düşüşü 25, siparişte gecikme 75, müşteri sipariş iptali 100 puan. 100 ise A, 75 ise B, aksi halde C.
- **Bakım ve kalite etkisi:** ekipman yaşı, hareketli parça sayısı, hız ve vibrasyon, kalite etkisi, çevresel koşul puanları toplanır. 75 ve üzeri A, 50 ve üzeri B, aksi halde C.
- **Sonuç:** iki seviyeden yüksek olanı. Sıralama önce sınıfa, sonra üretim ve bakım puanına, eşitlikte hat önemine göre yapılır.

## Sayfalar

- **Genel Bakış:** KPI şeridi, hatta göre yük, bakım türü payı, aylık plan, makine sıralaması, uyarılar. Rapor (PDF) yatay A4 çıktı verir.
- **Zaman Çizelgesi:** takvim ve ajanda. Bu haftadan başlayan 5 hafta ya da aylık görünüm. Bir güne tıklayınca o günün işleri ve gecikmişler listelenir.
- **Makineler, Bakım Planları, Geçmiş, Rehber, Ayarlar.**
- **Bakım formu (kontrol listesi):** bir plana "Ünite | Kontrol noktası | Yöntem | Ekipman" satırlarıyla form eklenir. Bakım tamamlanırken her madde Uygun, Uygunsuz ya da Yapılmadı olarak işaretlenir ve geçmişe yazılır.

## Gerçek veriyi yükleme

Makine listesi ve bakım planları şirkete ait olduğu için herkese açık siteye gömülmez. Veri, kendi bilgisayarındaki
`rebul-veri.json` dosyasındadır (git bu dosyayı yok sayar). Her cihazda bir kez yüklenir:
Ayarlar > Veri > Yedekten yükle. Veriler o tarayıcıda saklanır.

`araclar/excel-veri-olustur.js`, Rebul Excel dosyalarından `rebul-veri.json` üretir (yine git dışında):
iki .xlsx dosyasını ayrı klasörlere açıp `node araclar/excel-veri-olustur.js <klasör> <çıktı.json>` çalıştırılır.

## Dosyalar

| Dosya | Görevi |
| --- | --- |
| `index.html` | Uygulamanın tamamı (arayüz, mantık, stil) |
| `logo.png`, `icon-192.png`, `icon-512.png` | Rebul logosu ve uygulama simgeleri |
| `manifest.webmanifest`, `sw.js` | Ana ekrana ekleme ve çevrimdışı çalışma |

## Yayınlama (ücretsiz)

GitHub Pages `main` dalından yayınlar. Dosyaları değiştirip gönderince site birkaç dakikada güncellenir:

```bash
git add .
git commit -m "Güncelleme"
git push
```

## Bilmen gerekenler

- **Veri nerede?** Her kullanıcının tarayıcısında (localStorage). Sunucu yoktur. Başka cihaza taşımak için Ayarlar > Veri'deki yedek dosyasını kullan.
- **Uyarılar:** Uygulama içinde durum etiketleri, zil simgesi ve sekme sayacı her zaman çalışır. Tarayıcı bildirimi uygulama açıkken gelir.
  Uygulama kapalıyken uyarı almanın güvenilir yolu Ayarlar'daki `.ics` takvim dosyasıdır.
- **Ortak canlı veri gerekirse:** Bu sürümde yok. Google E-Tablolar (Apps Script) ya da Supabase ücretsiz katmanıyla senkron eklenebilir.
