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

Makine listesi ve bakım planları şirkete ait olduğu için sitede **yalnızca parolayla şifreli** durur
(`rebul-veri.enc.json`). Düz hali, yani `rebul-veri.json`, kendi bilgisayarındadır ve git bu dosyayı yok sayar.

Siteyi ilk kez açan (ve henüz verisi olmayan) kişiye parola sorulur. Doğru parola girilince veri o tarayıcıya
yüklenir ve bir daha sorulmaz. "Örnek veriyle devam et" seçilirse örnek veri açılır, istendiğinde
Ayarlar > Veri > **Rebul verisini parolayla yükle** ile sonradan yüklenebilir. Düz yedek dosyası da
Ayarlar > Veri > Yedekten yükle ile yüklenebilir.

Şifreleme: gzip, PBKDF2-SHA256 (600.000 tur) ile anahtar türetme ve AES-256-GCM. Parola büyük/küçük harfe,
boşluğa ve tireye duyarsızdır. Parola kodda ya da depoda yoktur, tarayıcıya da kaydedilmez.

Veriyi güncellemek ya da parolayı değiştirmek için (parola yoksa `--yeni` rastgele güçlü bir parola üretir ve yazdırır):

```
node scripts/sifrele.js rebul-veri.json rebul-veri.enc.json --yeni
git add rebul-veri.enc.json && git commit -m "Rebul verisini güncelle" && git push
```

Dikkat: şifreli dosyanın eski sürümleri git geçmişinde kalır ve eski parolayla açılabilir. Parola bir kişiyle
paylaşıldıysa ve o kişinin erişimi kapatılacaksa yalnızca parolayı değiştirmek, o kişinin elindeki eski veriyi geri almaz.
Parola zayıf seçilirse (internet üzerinden herkes şifreli dosyayı indirip denemeler yapabileceği için) koruma azalır;
`--yeni` ile üretilen 16 karakterlik parola 80 bit güvenlik sağlar.

`araclar/excel-veri-olustur.js`, Rebul Excel dosyalarından `rebul-veri.json` üretir (yine git dışında):
iki .xlsx dosyasını ayrı klasörlere açıp `node araclar/excel-veri-olustur.js <klasör> <çıktı.json>` çalıştırılır.

## Dosyalar

| Dosya | Görevi |
| --- | --- |
| `index.html` | Uygulamanın tamamı (arayüz, mantık, stil) |
| `logo.png`, `icon-192.png`, `icon-512.png` | Rebul logosu ve uygulama simgeleri |
| `manifest.webmanifest`, `sw.js` | Ana ekrana ekleme ve çevrimdışı çalışma |
| `rebul-veri.enc.json` | Parolayla şifreli Rebul verisi (makineler, planlar, tanımlar) |
| `scripts/sifrele.js` | Bir yedek dosyasını parolayla şifreler |

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
