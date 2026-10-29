# Deployment dan operasi

Target hosting: Vercel, proyek terpisah `ai-pnm-assistant`. Tidak mengandalkan GitHub Actions atau build workflow GitHub. Repository tetap dapat di-clone, di-push, dan ditinjau seperti biasa selama fitur repo akun tersedia.

## Deployment langsung

1. Jalankan `npm ci`, `npm run check`, dan `npm audit` di lokal.
2. Siapkan proyek Vercel pada akun/workspace pengelola. Set framework Next.js, Node.js 22, root directory repository.
3. Masukkan environment dari `.env.example`. Variabel Mistral dan private key Firebase hanya server, bertipe encrypted/sensitive di hosting. Konfigurasi Web Firebase memang bersifat publik.
4. Deploy source melalui Vercel MCP/API atau CLI resmi `npx vercel@latest --prod`. Ini build Vercel, bukan GitHub Actions. CLI perlu login dan scope yang benar.
5. Domain publik harus terdaftar di Firebase Authentication authorized domains. Gunakan hostname tanpa protokol/port.
6. Verifikasi landing dapat diakses tanpa akun Vercel; akun aplikasi hanya diperlukan saat masuk ruang chat. Jangan menganggap deployment berhasil hanya karena build sudah dimulai.
7. Jalankan smoke test: demo login → pertanyaan perusahaan → sumber → penolakan → logout. Uji register/login email dengan akun uji pengelola.

Jangan mengaktifkan pembelian paket, auto-recharge, atau integrasi berbayar. Paket gratis tetap memiliki limit dan kebijakan penyedia yang dapat berubah. Deployment tidak menjanjikan bebas biaya untuk volume tanpa batas.

## Firebase proyek demo

- Project ID: `ai-pnm-assistant-demo`.
- Firestore: `(default)`, Jakarta `asia-southeast2`, Standard, free tier saat provisioning.
- Client rules: deny semua akses koleksi.
- Server identity: service account khusus AI.PNM, peran Datastore User pada proyek ini.
- Provider auth: email/password dan anonymous.

Server tidak memakai OAuth refresh token pribadi pengembang. Kredensial server dibuat terpisah agar tidak membawa akses ke proyek VitalSense.

## Kuota aplikasi

- 6 inferensi per pengguna per menit.
- 40 inferensi per hash IP per jam.
- 200 inferensi global per hari UTC.

Tiga penghitung diperiksa/diperbarui secara atomik di Firestore. Kuota dihitung sebelum panggilan provider; panggilan yang gagal tetap menghabiskan satu slot untuk membatasi retry storm. Semua sesi tamu tetap mengikuti IP/global bucket; membuat akun baru tidak melewati batas global.

Jika database kuota gagal, panggilan Mistral dihentikan. Jika Mistral 429, tampilkan error dan izinkan retry manual. Tidak ada pengulangan otomatis tak terbatas atau fallback bebas sumber.

## Retensi dan pembersihan

Riwayat chat/feedback berada di tab browser. Logout menghapus riwayat UID pada tab saat ini; browser lain bukan riwayat bersama. Counter kuota memiliki `expiresAt` dua hari setelah dibuat. **TTL otomatis tidak diaktifkan** karena arsitektur mempertahankan paket gratis; pengelola perlu membersihkan counter kedaluwarsa dengan skrip operasi yang tersedia. Jangan menghapus bucket yang belum kedaluwarsa karena akan mereset budget aktif.

```powershell
npm run quota:cleanup
```

Skrip memerlukan `.env.local` pengelola, hanya menyentuh koleksi `quota` pada project ID yang dikonfigurasi, dan membatasi batch. Tidak dijadwalkan melalui GitHub.

## Rotasi rahasia

Key yang pernah dibagikan dalam chat perlu dirotasi sebelum pemakaian luas. Buat key Mistral baru pada akun yang sama, perbarui `.env.local` dan environment Vercel, redeploy, uji jawaban, lalu cabut key lama. Private key Firebase juga perlu dirotasi berkala. Jangan mengirim key dalam issue, screenshot, README, atau Git.

Untuk tahap berikutnya, workload identity dapat menggantikan service account key; ini belum menjadi dependensi demo. Pemilik proyek tetap bertanggung jawab atas akun, kuota, akses dan pengelolaan rahasia.

## Jika terjadi masalah

| Gejala              | Pemeriksaan                                                                      |
| ------------------- | -------------------------------------------------------------------------------- |
| Login belum aktif   | Email/Password dan Anonymous aktif pada proyek Firebase yang benar               |
| Unauthorized domain | Tambahkan hostname deployment di authorized domains                              |
| 401 API             | Firebase ID token valid dan project ID server sama dengan client                 |
| 403 API             | Origin sama dengan host publik, HTTPS pada produksi                              |
| 429                 | Batas user/IP/global atau kuota model; tunggu bucket/provider pulih              |
| 503                 | Environment server, izin IAM Firestore, timeout/provider atau output tidak valid |
| Tidak ada jawaban   | Sumber publik belum cukup; kurasi artikel, jangan menonaktifkan batas domain     |

Hanya catat status/kode error yang diperlukan. Jangan mencetak request headers, token, isi percakapan, atau private key ke log.
