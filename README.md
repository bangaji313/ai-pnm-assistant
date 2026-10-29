# AI.PNM Assistant

Asisten percakapan untuk mengenal PNM dan mencoba pencarian informasi aplikasi dengan jawaban yang memiliki rujukan. Dibangun sebagai **demo presentasi independen**, dengan identitas visual website V3, Firebase Authentication, dan Mistral API pada server.

**Bukan portal resmi PNM, bukan SOP yang disahkan, dan tidak terhubung ke transaksi atau data nasabah.**

## Akses

- Repository: [bangaji313/ai-pnm-assistant](https://github.com/bangaji313/ai-pnm-assistant)
- Deployment publik: sedang disiapkan; URL terverifikasi akan dicatat setelah deployment berhasil.
- Lokal: `http://localhost:3000`
- Source pengembangan: `E:\Data-Aji\KERJA\AI-PNM-Assistant`

GitHub dipakai untuk version control dan dokumentasi. **Tidak ada GitHub Actions, scheduled workflow, atau otomasi GitHub yang dibutuhkan.** Pengujian berjalan lokal dan deployment dilakukan langsung ke Vercel.

## Untuk peserta presentasi

1. Buka landing page, lalu pilih **Mari Coba**.
2. Pilih **Use Demo Account** untuk masuk tanpa email. Setiap pengunjung memiliki identitas tamu Firebase sendiri; tidak ada akun admin bersama.
3. Coba pertanyaan seperti “Apa itu PNM Mekaar?” atau contoh “Long Lat UK tidak terdeteksi”.
4. Pilih **Periksa sumber** pada jawaban untuk melihat ringkasan, status materi, dan tautan publik yang relevan.
5. Untuk jawaban yang belum cukup, buka **Bantuan lanjutan** dan salin draf ringkasan. Draf **belum dikirim** dan tidak membuat tiket.

Alternatifnya, daftar akun dengan email/password lalu gunakan akun tersebut untuk masuk. Gunakan password yang berbeda dari akun kerja PNM. Riwayat percakapan berada di tab browser, bukan riwayat bersama antar pengunjung.

## Fungsi yang tersedia

- Landing page, login, register, pemulihan password, dan sesi tamu Firebase.
- Ruang chat responsive yang mengikuti shell dan identitas V3.
- Jawaban Mistral berdasarkan potongan sumber yang dipilih server.
- Informasi publik tentang PNM, Mekaar, dan ULaMM; contoh kendala GPS/OTP dan beberapa pesan error.
- Klarifikasi pertanyaan ambigu, penolakan topik di luar lingkup, dan jawaban “sumber belum cukup”.
- Panel sumber, riwayat per tab, feedback sesi, draf eskalasi, error/offline dan retry.
- Penyamaran pola rahasia sebelum request model, batas panjang pesan/history, dan kuota persisten di Firestore.
- Fokus keyboard, label form, status proses, dan dukungan reduced motion.

## Batas produk dan materi

Mistral tidak di-fine-tune. Pembatasan dilakukan melalui kebijakan server, retrieval pada corpus kecil, instruksi model, JSON Schema, dan pemeriksaan ID sumber. Penggunaan sumber tidak menjamin setiap kalimat AI benar; pengunjung tetap perlu memeriksa rujukan.

Rancangan V1 memuat katalog 89 slide FAQ. **Katalog bukan SOP aktif** dan semua artikelnya belum disahkan PNM. Corpus demo publik memakai ringkasan aman serta contoh dialog yang dipilih; tidak menyalin seluruh SOP internal, dokumen terbatas, formula, atau kredensial. Materi finansial/identitas dan proses berisiko diarahkan ke kanal resmi tanpa memberi instruksi transaksi.

Demo tidak mengecek saldo, mengubah data, mengirim OTP, mengajukan pembiayaan, atau membuat tiket. AI live bergantung pada kuota Mistral dan hosting. Batas sumber, biaya, dan status verifikasi dijelaskan dalam [dokumen pengetahuan](docs/KNOWLEDGE.md) dan [hasil pengujian](docs/VERIFICATION.md).

## Teknologi

| Bagian    | Pilihan                                                  | Tujuan                                            |
| --------- | -------------------------------------------------------- | ------------------------------------------------- |
| Aplikasi  | Next.js App Router, React, TypeScript                    | Halaman dan API pada satu proyek                  |
| Visual    | CSS, Segoe UI/system font, aset AO dan logo pengguna     | Meneruskan identitas V3 tanpa UI kit besar        |
| Akun      | Firebase Authentication                                  | Email/password, reset password, anonymous guest   |
| Database  | Cloud Firestore Standard, Jakarta                        | Penghitung kuota server; tidak menyimpan chat     |
| AI        | Mistral API, `ministral-3b-latest`                       | Menyusun jawaban dari sumber yang dibatasi        |
| Retrieval | Keyword + exact error pada corpus terkurasi              | Menghindari tambahan vector DB untuk corpus kecil |
| Hosting   | Vercel                                                   | Halaman publik dan API server                     |
| Pengujian | Vitest, TypeScript, production build, browser smoke test | Verifikasi kebijakan dan alur nyata               |

Versi yang benar-benar dipakai ada di `package.json` dan `package-lock.json`. Konfigurasi npm lokal menjaga instalasi konsisten dengan lockfile pada runtime Node.js 22.

## Menjalankan di lokal

Prasyarat: Node.js 22.23 atau lebih baru dalam major 22, npm, dan proyek Firebase Anda sendiri. Jangan memakai service account milik orang lain.

```powershell
git clone https://github.com/bangaji313/ai-pnm-assistant.git
cd ai-pnm-assistant
npm ci
Copy-Item .env.example .env.local
```

Isi `.env.local` dengan konfigurasi Firebase Web App, service account khusus server, dan key Mistral milik pengelola. File ini sudah diabaikan Git.

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=konfigurasi_web_firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project-anda.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-anda
NEXT_PUBLIC_FIREBASE_APP_ID=app_id_anda
FIREBASE_CLIENT_EMAIL=server@project-anda.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
MISTRAL_API_KEY=key_server_anda
MISTRAL_MODEL=ministral-3b-latest
```

Empat variabel `NEXT_PUBLIC_FIREBASE_*` adalah konfigurasi klien yang memang dibutuhkan Firebase Web SDK, **bukan** pengganti security rules. Private key Firebase dan Mistral tidak boleh berawalan `NEXT_PUBLIC_`.

```powershell
npm run dev
# Buka http://localhost:3000
```

Untuk produksi lokal: `npm run build` lalu `npm start`. Karena API memeriksa origin HTTPS pada produksi, gunakan deployment HTTPS untuk pengujian chat produksi; development lokal mengizinkan HTTP dengan host yang sama.

## Menyiapkan Firebase

1. Buat proyek khusus demo pada paket Spark. Aktifkan Authentication **Email/Password** dan **Anonymous**.
2. Daftarkan Web App dan isi konfigurasi publiknya di environment.
3. Buat Firestore **Standard**. Proyek ini memakai `(default)` di `asia-southeast2` (Jakarta), terkonfirmasi `freeTier: true` saat provisioning.
4. Sesuaikan `.firebaserc` dan daftar authorized domains di `firebase.json` dengan proyek/deployment Anda.
5. Deploy konfigurasi melalui CLI resmi:

```powershell
npx -y firebase-tools@latest login
npx -y firebase-tools@latest deploy --only auth,firestore --project PROJECT_ID
```

6. Gunakan service account terpisah dengan peran **Cloud Datastore User** hanya pada proyek tersebut. Simpan private key sebagai server environment; jangan memberi peran Owner/Editor kepada server demo.

Semua akses koleksi dari client ditolak oleh `firestore.rules`. Server SDK memakai IAM untuk transaksi penghitung kuota. Admin SDK tidak memakai client rules, sehingga pembatasan IAM tetap diperlukan. Tidak ada Cloud Functions Firebase berbayar atau upgrade Blaze yang dibutuhkan untuk arsitektur ini.

## Verifikasi

```powershell
npm run typecheck
npm test
npm run build
npm audit
```

Uji live Mistral bersifat opt-in dan tidak berjalan dalam unit suite:

```powershell
$env:RUN_LIVE_MISTRAL='1'
npm run test:live
Remove-Item Env:RUN_LIVE_MISTRAL
```

Perintah live memakai kuota API nyata. Jangan memasukkan rahasia atau data nasabah ke fixture. Lihat [matriks verifikasi](docs/VERIFICATION.md) untuk membedakan mock/unit, layanan nyata, dan pengujian yang belum dilakukan.

## Struktur source

```text
src/app/                 Landing, login, chat, privasi, ketentuan, API
src/components/          Komponen brand, autentikasi, dan ruang percakapan
src/lib/knowledge.ts     Corpus publik terkurasi dan status sumber
src/lib/policy.ts        Penyamaran, kebijakan domain, retrieval, validasi output
src/lib/mistral.ts       Request model khusus server + JSON Schema
src/lib/firebase-*.ts    Pemisahan SDK browser dan server
src/lib/quota.ts         Transaksi kuota Firestore
public/brand/            Aset logo dan AO dari pengguna
docs/                    Arsitektur, sumber, pengujian, deploy, presentasi
firebase.json            Konfigurasi auth dan Firestore
firestore.rules          Tolak semua akses database dari client
```

## Dokumentasi lanjutan

- [Arah visual](DESIGN.md)
- [Arsitektur dan kontrak API](docs/ARCHITECTURE.md)
- [Sumber dan kurasi pengetahuan](docs/KNOWLEDGE.md)
- [Deployment dan operasi](docs/DEPLOYMENT.md)
- [Pengujian dan bukti](docs/VERIFICATION.md)
- [Panduan presentasi Dzaky](docs/PRESENTATION.md)
- [Keamanan dan batas demo](SECURITY.md)
- [Keputusan implementasi](docs/IMPLEMENTATION.md)

## Kredit dan hak penggunaan

Pengusul konsep: **Maulana Dzaky Riswandi**. Perancangan konsep dan UI/UX: **Maulana Seno Aji Yudhantara**. Implementasi dikembangkan dengan bantuan Codex; Anti Slop dipakai untuk pemeriksaan UI/copy/aksesibilitas, Superpowers untuk alur implementasi dan verifikasi, serta Ponytail untuk membatasi dependensi dan kompleksitas.

Logo, karakter AO, dan merek PNM disediakan pengguna dan tetap menjadi hak pemiliknya. Repository publik tidak mengalihkan hak atas merek/aset atau menyatakan pengesahan PNM. Kode disediakan sebagai dokumentasi konsep; izin penggunaan di luar review/presentasi perlu disepakati dengan pemilik proyek.
