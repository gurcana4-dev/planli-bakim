#!/usr/bin/env node
/* Bir yedek dosyasını (.json) parolayla şifreler: uygulamanın "parolayla yükle" özelliği bu dosyayı açar.
 *
 *   node scripts/sifrele.js <girdi.json> <cikti.enc.json> [--yeni]
 *
 * Parola PAROLA ortam değişkeninden okunur. --yeni verilirse rastgele güçlü bir parola üretilir ve yazdırılır.
 * Şifreleme: gzip, PBKDF2-SHA256 (600.000 tur) ile anahtar türetme, AES-256-GCM.
 * Parola büyük/küçük harfe, boşluğa ve tireye duyarsızdır (index.html içindeki normPw ile aynı kural).
 */
const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');

const ITER = 600000;
const normPw = (s) => String(s).replace(/[\s-]+/g, '').toUpperCase();
const b64u = (buf) => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function yeniParola() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 harf, 0/O ve 1/I karışmaz
  const bytes = crypto.randomBytes(16);
  let s = '';
  for (let i = 0; i < 16; i++) s += abc[bytes[i] % 32];
  return s.match(/.{4}/g).join('-'); // 16 karakter, 80 bit
}

const [girdi, cikti] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!girdi || !cikti) {
  console.error('Kullanım: node scripts/sifrele.js <girdi.json> <cikti.enc.json> [--yeni]');
  process.exit(1);
}
let parola = process.env.PAROLA;
const uretildi = process.argv.includes('--yeni');
if (uretildi) parola = yeniParola();
if (!parola || normPw(parola).length < 8) {
  console.error('Parola yok ya da çok kısa. PAROLA ortam değişkenini (en az 8 karakter) ver ya da --yeni kullan.');
  process.exit(1);
}
if (!uretildi && normPw(parola).length < 16) {
  console.error('Uyarı: bu parola kısa. Şifreli dosya herkese açık olduğundan kısa parolalar çevrimdışı denenerek kırılabilir.');
}

const duz = fs.readFileSync(girdi);
JSON.parse(duz); // geçerli JSON mu
const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const anahtar = crypto.pbkdf2Sync(normPw(parola), salt, ITER, 32, 'sha256');
const c = crypto.createCipheriv('aes-256-gcm', anahtar, iv);
const sifreli = Buffer.concat([c.update(zlib.gzipSync(duz, { level: 9 })), c.final(), c.getAuthTag()]);

fs.writeFileSync(
  cikti,
  JSON.stringify({ app: 'rebul-planli-bakim', v: 1, kdf: 'PBKDF2-SHA256', iter: ITER, gz: 1, salt: b64u(salt), iv: b64u(iv), data: b64u(sifreli) })
);
console.error('Yazıldı: ' + cikti + ' (' + fs.statSync(cikti).size + ' bayt, ' + duz.length + ' baytlık veriden)');
if (uretildi) console.log(parola);
