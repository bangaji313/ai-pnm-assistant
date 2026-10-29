<p align="center">
  <img src="docs/screenshots/ai-pnm-wordmark.png" width="180" alt="Logo AI.PNM">
</p>

<h1 align="center">AI.PNM Assistant</h1>

<p align="center"><strong>Teman menemukan jawaban. Rujukannya bisa diperiksa.</strong></p>

<p align="center">Demo asisten informasi PNM dengan akses tamu, percakapan bersumber, dan tampilan yang dirancang untuk presentasi.</p>

<p align="center">
  <img alt="Next.js 16.4.3" src="https://img.shields.io/badge/Next.js-16.4.3-111111?style=flat-square&logo=nextdotjs&logoColor=white">
  <img alt="React 19.3.1" src="https://img.shields.io/badge/React-19.3.1-149ECA?style=flat-square&logo=react&logoColor=white">
  <img alt="TypeScript 5.9" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white">
  <img alt="Firebase Authentication and Firestore" src="https://img.shields.io/badge/Firebase-Auth_%2B_Firestore-DD6B20?style=flat-square&logo=firebase&logoColor=white">
  <img alt="Mistral Ministral 3B" src="https://img.shields.io/badge/Mistral-Ministral_3B-F54E00?style=flat-square&logo=mistralai&logoColor=white">
  <img alt="Node.js 22" src="https://img.shields.io/badge/Node.js-22-417E38?style=flat-square&logo=nodedotjs&logoColor=white">
  <img alt="Hosted on Vercel" src="https://img.shields.io/badge/Vercel-Deployment-111111?style=flat-square&logo=vercel&logoColor=white">
  <img alt="33 local tests passing" src="https://img.shields.io/badge/Tests_local-33_passing-2E7D32?style=flat-square">
</p>

<p align="center">
  <a href="https://ai-pnm-assistant.vercel.app/"><strong>Buka Demo</strong></a> ·
  <a href="docs/PRESENTATION.md">Panduan Presentasi</a> ·
  <a href="docs/ARCHITECTURE.md">Dokumentasi Teknis</a>
</p>

> **Status:** demo presentasi independen. Bukan portal resmi PNM, bukan SOP yang telah disahkan, dan tidak terhubung ke data nasabah atau transaksi.

---

## Daftar isi

- [Tentang AI.PNM](#tentang-aipnm)
- [Akses](#akses)
- [Penjelasan non-teknis](#penjelasan-non-teknis)
- [Fitur utama](#fitur-utama)
- [Tampilan aplikasi](#tampilan-aplikasi)
- [Alur penggunaan](#alur-penggunaan)
- [Status dan batas demo](#status-dan-batas-demo)
- [Penjelasan teknis](#penjelasan-teknis)
- [Arsitektur end-to-end](#arsitektur-end-to-end)
- [Teknologi](#teknologi)
- [Keamanan dan privasi](#keamanan-dan-privasi)
- [Menjalankan di lokal](#menjalankan-di-lokal)
- [Variabel lingkungan](#variabel-lingkungan)
- [Menyiapkan Firebase](#menyiapkan-firebase)
- [Pengujian](#pengujian)
- [Deployment](#deployment)
- [Struktur proyek](#struktur-proyek)
- [Dokumentasi](#dokumentasi)
- [Identitas dan kolaborasi](#identitas-dan-kolaborasi)

## Tentang AI.PNM

AI.PNM membantu pengunjung mengenal PNM serta mencoba pencarian informasi kendala aplikasi melalui percakapan. Jawaban disertai rujukan yang dapat dibuka, sedangkan informasi yang belum tersedia tidak diisi dengan dugaan.

Proyek ini meneruskan desain website V3 yang telah ditinjau pengguna. Tujuannya mendukung eksplorasi konsep dan presentasi Dzaky: audiens dapat langsung mencoba melalui akun tamu tanpa membagikan satu akun admin bersama.

## Akses

- Repository: [bangaji313/ai-pnm-assistant](https://github.com/bangaji313/ai-pnm-assistant)
- Demo publik: **[ai-pnm-assistant.vercel.app](https://ai-pnm-assistant.vercel.app/)**.
- Lokal: `http://localhost:3000`
- Source pengembangan: `E:\Data-Aji\KERJA\AI-PNM-Assistant`

GitHub dipakai untuk version control dan dokumentasi. **Tidak ada GitHub Actions, scheduled workflow, atau otomasi GitHub yang dibutuhkan.** Pengujian berjalan lokal dan deployment dilakukan langsung ke Vercel.

## Penjelasan non-teknis

1. Buka landing page, lalu pilih **Mari Coba**.
2. Pilih **Use Demo Account** untuk masuk tanpa email. Setiap pengunjung memiliki identitas tamu Firebase sendiri; tidak ada akun admin bersama.
3. Coba pertanyaan seperti “Apa itu PNM Mekaar?” atau contoh “Long Lat UK tidak terdeteksi”.
4. Pilih **Periksa sumber** pada jawaban untuk melihat ringkasan, status materi, dan tautan publik yang relevan.
5. Untuk jawaban yang belum cukup, buka **Bantuan lanjutan** dan salin draf ringkasan. Draf **belum dikirim** dan tidak membuat tiket.

Alternatifnya, daftar akun dengan email/password lalu gunakan akun tersebut untuk masuk. Gunakan password yang berbeda dari akun kerja PNM. Riwayat percakapan berada di tab browser, bukan riwayat bersama antar pengunjung.

## Fitur utama

- Landing page, login, register, pemulihan password, dan sesi tamu Firebase.
- Ruang chat responsive yang mengikuti shell dan identitas V3.
- Jawaban informasi perusahaan disusun Mistral berdasarkan sumber server; FAQ dibatasi ke teks terkurasi yang dipilih model.
- Informasi publik tentang PNM, Mekaar, dan ULaMM; contoh kendala GPS/OTP dan beberapa pesan error.
- Klarifikasi pertanyaan ambigu, penolakan topik di luar lingkup, dan jawaban “sumber belum cukup”.
- Panel sumber, riwayat per tab, feedback sesi, draf eskalasi, error/offline dan retry.
- Penyamaran pola rahasia sebelum request model, batas panjang pesan/history, dan kuota persisten di Firestore.
- Fokus keyboard, label form, status proses, dan dukungan reduced motion.

## Tampilan aplikasi

Screenshot berikut diambil dari deployment publik menggunakan data demonstrasi. Logo dan ilustrasi AO berasal dari aset yang disediakan pengguna.

### Landing page

![Landing page AI.PNM](docs/screenshots/landing-desktop.png)

### Masuk dan akses demo

![Halaman login dengan Use Demo Account](docs/screenshots/login-desktop.png)

### Ruang percakapan

![Beranda percakapan AI.PNM](docs/screenshots/chat-desktop.png)

<details>
<summary>Lihat contoh jawaban FAQ dengan sumber dan status materi</summary>

![Jawaban FAQ terkurasi dengan label contoh presentasi](docs/screenshots/faq-sourced-desktop.png)

Jawaban ini memakai teks contoh yang dibatasi server. Label belum disahkan tetap terlihat agar audiens dapat membedakan demonstrasi dari panduan operasional.

</details>

## Alur penggunaan

```mermaid
flowchart TD
    A["Landing AI.PNM"] --> B["Mari Coba"]
    B --> C{"Pilih cara masuk"}
    C -->|"Tanpa email"| D["Use Demo Account"]
    C -->|"Punya akun"| E["Login email dan password"]
    C -->|"Akun baru"| F["Daftar akun"]
    D --> G["Ruang percakapan pribadi"]
    E --> G
    F --> G
    G --> H["Pilih topik atau tulis pertanyaan"]
    H --> I{"Sumber dan lingkup sesuai?"}
    I -->|"Ya"| J["Jawaban bersumber / contoh terkurasi"]
    I -->|"Belum jelas"| K["Klarifikasi konteks"]
    I -->|"Tidak tersedia / di luar lingkup"| L["Penjelasan batas layanan"]
    K --> H
    J --> M["Periksa sumber dan beri feedback"]
    L --> N["Bantuan lanjutan"]
    M --> N
    N --> O["Salin draf — belum dikirim"]
    G --> P["Keluar dan akhiri riwayat tab"]
```

## Status dan batas demo

Mistral tidak di-fine-tune. Pembatasan dilakukan melalui kebijakan server, retrieval pada corpus kecil, instruksi model, JSON Schema, dan pemeriksaan ID sumber. Penggunaan sumber tidak menjamin setiap kalimat AI benar; pengunjung tetap perlu memeriksa rujukan.

Untuk FAQ yang belum disahkan, model hanya boleh memilih dan menyalin salah satu teks contoh terkurasi. Server memeriksa kecocokan persis dan menambahkan label status; model tidak bebas menciptakan langkah operasional. Mode ini diberi label berbeda pada percakapan. Informasi perusahaan memakai jawaban generatif bersumber.

Rancangan V1 memuat katalog 89 slide FAQ. **Katalog bukan SOP aktif** dan semua artikelnya belum disahkan PNM. Corpus demo publik memakai ringkasan aman serta contoh dialog yang dipilih; tidak menyalin seluruh SOP internal, dokumen terbatas, formula, atau kredensial. Materi finansial/identitas dan proses berisiko diarahkan ke kanal resmi tanpa memberi instruksi transaksi.

Demo tidak mengecek saldo, mengubah data, mengirim OTP, mengajukan pembiayaan, atau membuat tiket. AI live bergantung pada kuota Mistral dan hosting. Batas sumber, biaya, dan status verifikasi dijelaskan dalam [dokumen pengetahuan](docs/KNOWLEDGE.md) dan [hasil pengujian](docs/VERIFICATION.md).

## Penjelasan teknis

Aplikasi menggunakan Next.js App Router: halaman informasi dirender sebagai Server Components, sedangkan autentikasi dan percakapan berjalan sebagai Client Components. Route Handler `POST /api/chat` memisahkan browser dari kredensial Mistral dan akses database server.

Firebase Authentication menerbitkan ID token untuk akun email/password maupun tamu anonim. Server memverifikasi token, memeriksa origin serta input, menerapkan kebijakan domain, lalu mengambil sumber dari corpus publik yang terkurasi. Firestore memeriksa kuota secara atomik sebelum model dipanggil.

Informasi perusahaan memakai jawaban generatif bersumber. FAQ yang belum disahkan menggunakan pemilihan teks terkurasi dengan JSON Schema dan pemeriksaan kecocokan persis, sehingga model tidak bebas menambahkan langkah operasional.

## Arsitektur end-to-end

```mermaid
flowchart TB
    subgraph Client["Browser pengunjung"]
        UI["Landing · login · chat"]
        Tab["sessionStorage per UID: riwayat dan feedback"]
        UI <--> Tab
    end
    subgraph Firebase["Firebase — proyek khusus demo"]
        Auth["Authentication: email/password dan anonymous"]
        DB["Firestore Standard: counter kuota"]
    end
    subgraph Vercel["Vercel — server Next.js"]
        API["POST /api/chat"]
        Check["Verifikasi ID token · origin · batas input"]
        Policy["Penyamaran dan kebijakan domain"]
        Retrieve["Pencarian sumber publik terkurasi"]
        Budget["Transaksi kuota user / IP / global"]
        Output["Validasi struktur, ID sumber dan teks FAQ"]
        Reply["Jawaban dan metadata sumber"]
    end
    Corpus["Fakta publik PNM + contoh FAQ yang dipilih"]
    Model["Mistral API: Ministral 3B"]

    UI <-->|"Masuk / daftar · ID token"| Auth
    UI -->|"Pertanyaan + token + konteks terbatas"| API
    API --> Check --> Policy
    Policy -->|"Respons batas / klarifikasi"| Reply
    Policy -->|"Topik didukung"| Retrieve
    Corpus --> Retrieve
    Retrieve -->|"Sumber cukup"| Budget
    Retrieve -->|"Sumber belum cukup"| Reply
    Budget <-->|"Counter atomik"| DB
    Budget -->|"Kuota tersedia"| Model
    Model --> Output --> Reply
    Reply --> UI
```

Key Mistral dan private key Firebase berada pada environment server. Riwayat chat tidak disimpan di Firestore, dan browser tidak mendapat akses langsung ke koleksi kuota. Rincian kontrak API dan batas sistem ada di [dokumen arsitektur](docs/ARCHITECTURE.md).

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

## Keamanan dan privasi

| Kontrol          | Penerapan                                                                      |
| ---------------- | ------------------------------------------------------------------------------ |
| Identitas        | ID token Firebase diperiksa server; UID dari body tidak dipercaya              |
| Rahasia          | Key Mistral dan private key Firebase tidak masuk frontend atau Git             |
| Database         | Semua akses koleksi dari client ditolak; server memakai service account khusus |
| Penggunaan model | Maksimum 6 inferensi/user/menit, 40/IP/jam, dan 200 global/hari UTC            |
| Konteks          | Pesan, history, panjang output, dan waktu request dibatasi                     |
| Sumber           | Corpus publik dipilih server; FAQ dibatasi ke teks contoh yang cocok persis    |
| Riwayat          | Disimpan per UID pada tab browser, dihapus saat logout                         |
| Kegagalan        | Tidak ada jawaban pengganti yang berpura-pura berhasil saat provider gagal     |

Penyamaran berbasis pola bukan jaminan seluruh data pribadi terhapus. Gunakan data sintetis, bukan identitas nasabah, rekening, password kerja, PIN, atau OTP. Hash IP bukan anonimisasi mutlak; kebijakan retensi penyedia tetap berlaku.

Baca [SECURITY.md](SECURITY.md), [privasi demo](https://ai-pnm-assistant.vercel.app/privasi), serta [ketentuan penggunaan](https://ai-pnm-assistant.vercel.app/ketentuan).

## Menjalankan di lokal

Prasyarat: Node.js 22.23 atau lebih baru dalam major 22, npm, dan proyek Firebase Anda sendiri. Jangan memakai service account milik orang lain.

```powershell
git clone https://github.com/bangaji313/ai-pnm-assistant.git
cd ai-pnm-assistant
npm ci
Copy-Item .env.example .env.local
```

## Variabel lingkungan

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
4. Sesuaikan `.firebaserc`. Daftarkan hostname deployment di **Firebase Console → Authentication → Settings → Authorized domains**. Jangan menganggap deploy CLI sudah mengubah domain; periksa state layanan sesudah konfigurasi.
5. Deploy konfigurasi melalui CLI resmi:

```powershell
npx -y firebase-tools@latest login
npx -y firebase-tools@latest deploy --only auth,firestore --project PROJECT_ID
```

6. Gunakan service account terpisah dengan peran **Cloud Datastore User** hanya pada proyek tersebut. Simpan private key sebagai server environment; jangan memberi peran Owner/Editor kepada server demo.

Semua akses koleksi dari client ditolak oleh `firestore.rules`. Server SDK memakai IAM untuk transaksi penghitung kuota. Admin SDK tidak memakai client rules, sehingga pembatasan IAM tetap diperlukan. Tidak ada Cloud Functions Firebase berbayar atau upgrade Blaze yang dibutuhkan untuk arsitektur ini.

## Pengujian

```powershell
npm run typecheck
npm test
npm run test:runtime
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

Runtime dipatok ke Node.js 22. `jwks-rsa` dipatok ke 3.2.2 melalui npm override karena versi 4 pada Firebase Admin memanggil modul ESM dengan `require()`, yang gagal pada runtime Vercel ketika interoperabilitas eksperimental dimatikan. Tes cold import meniru kondisi tersebut; verifikasi Firebase token tetap diperiksa melalui uji layanan nyata. Override gRPC juga menghindari versi yang terkena advisory. Periksa kembali kedua override saat memperbarui SDK.

## Deployment

Demo dipublikasikan di **[ai-pnm-assistant.vercel.app](https://ai-pnm-assistant.vercel.app/)** menggunakan Vercel dengan Firebase sebagai backend akun dan penghitung kuota.

Source disimpan di GitHub. Build dan deployment dijalankan langsung melalui Vercel; proyek ini tidak memerlukan GitHub Actions atau otomasi berbayar GitHub. Badge pengujian di atas menunjukkan hasil pemeriksaan lokal yang dicatat dalam dokumentasi, bukan status CI.

Untuk publikasi mandiri: siapkan environment server, daftarkan domain Firebase, jalankan pemeriksaan lokal, deploy ke Vercel, lalu uji login dan chat dari domain HTTPS. Panduan konfigurasi, rotasi key, pembersihan counter, dan pemulihan masalah tersedia di [panduan deployment](docs/DEPLOYMENT.md).

## Struktur proyek

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

## Dokumentasi

- [Arah visual](DESIGN.md)
- [Arsitektur dan kontrak API](docs/ARCHITECTURE.md)
- [Sumber dan kurasi pengetahuan](docs/KNOWLEDGE.md)
- [Deployment dan operasi](docs/DEPLOYMENT.md)
- [Pengujian dan bukti](docs/VERIFICATION.md)
- [Panduan presentasi Dzaky](docs/PRESENTATION.md)
- [Keamanan dan batas demo](SECURITY.md)
- [Keputusan implementasi](docs/IMPLEMENTATION.md)

## Identitas dan kolaborasi

| Peran                                                  | Identitas                                                                                                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pemilik repository, pengembangan web, konsep dan UI/UX | **Maulana Seno Aji Yudhantara** — [@bangaji313](https://github.com/bangaji313)                                                                          |
| Pengusul konsep dan kebutuhan presentasi               | **Maulana Dzaky Riswandi**                                                                                                                              |
| Bantuan implementasi                                   | Codex, dengan Anti Slop untuk UI/copy/aksesibilitas, Superpowers untuk implementasi dan verifikasi, serta Ponytail untuk menjaga lingkup dan dependensi |

Logo, karakter AO, dan merek PNM tetap menjadi hak pemiliknya. Penggunaan aset pada konsep ini tidak menyatakan afiliasi atau pengesahan resmi PNM. Repository publik tidak mengalihkan hak merek/aset; izin penggunaan kode di luar review atau presentasi perlu disepakati dengan pemilik proyek.

---

<p align="center">
  <strong>Maulana Seno Aji Yudhantara</strong><br>
  Informatika · Institut Teknologi Nasional Bandung (ITENAS)<br>
  Pengembangan Web · Perancangan Produk · UI/UX
</p>

<p align="center">
  <a href="https://github.com/bangaji313">Profil GitHub</a> ·
  <a href="https://github.com/bangaji313/ai-pnm-assistant">Repository AI.PNM</a> ·
  <a href="https://ai-pnm-assistant.vercel.app/">Demo Publik</a>
</p>
