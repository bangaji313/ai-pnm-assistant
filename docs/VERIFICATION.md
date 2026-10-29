# Hasil verifikasi

Diperbarui **30 Oktober 2026 (WIB)**. Pemeriksaan membedakan test dengan mock, layanan nyata, dan inspeksi browser. Status di bawah berlaku pada saat pemeriksaan; ketersediaan provider dan kuota dapat berubah.

## Status akhir

- Demo publik: [ai-pnm-assistant.vercel.app](https://ai-pnm-assistant.vercel.app/).
- Runtime yang diperiksa: commit `d06f633dea9f2e28b77e8cd652a77c79a05e5c87`.
- Deployment Vercel: `dpl_7qPhAyuaHmUmBKWjw1cSvwaz7Sxy`, status **READY**, Node.js 22.x.
- Perubahan dokumentasi dan gambar setelah commit runtime tidak mengubah kode aplikasi.
- Pengujian dijalankan lokal; tidak bergantung pada GitHub Actions atau workflow berbayar.

| Pemeriksaan                            | Hasil                                                                                                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `npm run check`                        | Lolos: TypeScript, 33 unit/component/boundary test, cold-import runtime, dan production build              |
| Live test Mistral opt-in               | 2 lolos: informasi perusahaan dan FAQ terkurasi; terpisah dari test mock                                   |
| `npm audit`                            | 0 kerentanan yang dilaporkan                                                                               |
| Firebase project dan web app           | Proyek khusus `ai-pnm-assistant-demo`; tidak memakai backend VitalSense                                    |
| Firestore                              | Standard, Jakarta, `freeTier: true`; client rules deny-all, server menggunakan IAM                         |
| Anonymous Authentication nyata         | HTTP 200; akses tamu berhasil di browser publik                                                            |
| Register dan login email nyata         | Keduanya HTTP 200; akun QA sintetis dihapus setelah pemeriksaan                                            |
| API publik tanpa ID token              | HTTP 401                                                                                                   |
| API publik: informasi Mekaar           | HTTP 200, `engine: mistral`, sumber `mekaar`                                                               |
| API publik: contoh GPS                 | HTTP 200, `engine: curated`, sumber `demo-gps`, label belum disahkan ditambahkan server                    |
| API publik: coding dengan kata PNM     | HTTP 200 dengan penolakan di luar lingkup                                                                  |
| API publik: status dana langsung       | HTTP 200 dengan batas layanan untuk tindakan sensitif                                                      |
| API publik: materi cuti belum tersedia | HTTP 200 dengan penjelasan sumber belum cukup                                                              |
| Landing pada 390/768/1440 px           | Tidak ditemukan horizontal overflow; gambar termuat                                                        |
| Chat mobile                            | Panel sumber, Escape dialog/menu, sidebar inert, dan pemulihan fokus diperiksa                             |
| Draf bantuan                           | Dapat disalin; tampilan menegaskan belum ada laporan atau tiket dikirim                                    |
| Cleanup counter                        | Berjalan; 0 counter kedaluwarsa saat uji, bucket aktif dipertahankan                                       |
| README di GitHub                       | Logo/badge/screenshot dimuat, daftar isi menuju bagian yang benar, kedua diagram Mermaid berhasil dirender |
| Secret pada file tracked Git           | Tidak ditemukan nilai key Mistral atau private key Firebase aktual                                         |

## Jawaban FAQ dan sumber

Uji live menemukan model menambahkan saran GPS yang tidak ada pada teks contoh. FAQ kini memakai enum teks dalam JSON Schema dan pemeriksaan kecocokan persis pada server. Model memilih teks yang disediakan, lalu server menyisipkan status contoh presentasi. Kasus penambahan langkah dan pemilihan sumber yang tidak sesuai diuji RED → GREEN.

Jawaban GPS pada deployment terakhir juga diperiksa langsung di browser: teks sesuai contoh terkurasi, label belum disahkan terlihat, dan panel sumber menjelaskan status materi. Informasi perusahaan tetap menggunakan jawaban generatif yang dibatasi sumber. Pemeriksaan ini tidak menyatakan seluruh keluaran model selalu benar.

## Review kode dan perbaikan

Reviewer independen membaca rentang `8834bdb → 0fca841` tanpa membuka credential atau folder private. Tidak ada temuan Critical. Lima kasus direproduksi sebagai test gagal lalu diperbaiki:

1. Retry pertanyaan lanjutan memakai snapshot request/history awal.
2. Deklarasi password alfabetis eksplisit disamarkan pada client dan server.
3. Istilah NIK memakai word boundary sehingga kata “teknik” tidak salah ditolak.
4. Jawaban selesai diperbarui pada live region yang persisten.
5. Pemilihan riwayat mobile mengembalikan fokus ke composer.

Kelima reproduksi RED → GREEN. Tidak ada temuan review yang sengaja ditunda. Setelah tambahan pengujian FAQ, suite akhir berisi 33 test lokal.

Deployment awal sempat mengalami cold-start API 500 meski build lolos: `jwks-rsa` 4 memanggil `jose` ESM melalui `require`. Reproduksi lokal dengan `node --no-experimental-require-module` gagal sebelum perbaikan dan lolos setelah memakai `jwks-rsa` 3.2.2 yang kompatibel. Node dipatok 22.x dan cold import dimasukkan ke `npm run check`. Deployment awal tersebut tidak dihitung sebagai bukti chat publik berhasil; status akhir mengacu pada deployment pengganti yang diuji melalui URL publik.

Mistral Small pernah mengembalikan HTTP 429 saat pemeriksaan awal. Demo memakai `ministral-3b-latest`, yang berhasil dalam uji inferensi nyata dan smoke test publik. Keberhasilan saat pemeriksaan tidak menjamin kuota gratis selalu tersedia.

## Batas verifikasi

Boundary test memock provider, autentikasi, dan penyimpanan agar jalur error dapat diuji secara terkontrol. Test tersebut dilengkapi pemeriksaan Firebase, Firestore, Mistral, dan deployment nyata di atas. Offline, provider limit, dan session expiry diuji melalui jalur boundary/error; jaringan tidak diputus pada seluruh perangkat.

Belum dilakukan audit enterprise, pengujian jailbreak menyeluruh, pemeriksaan semua perangkat, atau pengujian screen reader asli. FAQ belum disahkan PNM dan tidak dianggap SOP operasional. IAM/rules/hosting diperiksa terpisah melalui layanan nyata. Tidak ada akses data nasabah atau transaksi, dan tidak ada tiket sungguhan yang dikirim.

Screenshot dokumentasi menggunakan data demonstrasi. Credential tetap berada pada konfigurasi lokal yang diabaikan Git dan environment server deployment; tidak dimuat ke README atau bundle browser.
