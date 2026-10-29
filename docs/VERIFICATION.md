# Hasil verifikasi

Catatan ini membedakan layanan nyata dan test mock. Tanggal: 29 Oktober 2026.

| Pemeriksaan                                             | Status saat catatan awal                                     |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| TypeScript                                              | Lolos                                                        |
| Unit/integration kebijakan, boundary API, dan quota key | 22 test lolos; provider/auth/store dimock pada boundary test |
| Production build                                        | Lolos, halaman dan API terbentuk                             |
| npm audit                                               | 0 kerentanan yang dilaporkan setelah update dependensi       |
| Mistral daftar model                                    | HTTP 200                                                     |
| Mistral Small awal                                      | HTTP 429; tidak dipakai sebagai bukti inferensi sukses       |
| Ministral 3B inferensi nyata                            | HTTP 200                                                     |
| Structured output + source ID nyata                     | Live test lolos setelah memakai JSON Schema                  |
| Firebase project/web app                                | Dibuat khusus AI.PNM                                         |
| Firestore                                               | Standard, Jakarta, freeTier true, rules deployed             |
| Anonymous Auth nyata                                    | HTTP 200                                                     |
| API lokal Firebase → quota → Mistral                    | HTTP 200 dengan sumber mekaar                                |
| Landing dan form login desktop                          | Diperiksa di browser                                         |
| Use Demo Account browser                                | Berhasil membuka ruang chat                                  |
| Deployment publik                                       | Menunggu izin workspace Vercel dan smoke test publik         |

## Pembaruan pemeriksaan

- Suite menjadi 31 test lolos, satu live test opt-in terpisah. Typecheck dan production build diperiksa ulang sesudah perbaikan.
- Register dan login email Firebase: keduanya HTTP 200; akun QA sintetis dihapus sesudah uji.
- Landing pada 390/768/1440 px: tidak ada horizontal overflow dan gambar termuat.
- Chat 390 px: panel sumber, Escape dialog, Escape menu, inert sidebar, dan pemulihan fokus menu diperiksa di browser.
- Draf bantuan disalin ke clipboard; pemberitahuan menyatakan belum ada laporan/tiket dikirim.
- Skrip cleanup berhasil: 0 counter kedaluwarsa, bucket aktif tetap ada.
- Izin Vercel sudah aktif; environment dan proyek telah disiapkan. Smoke test publik menunggu deployment.

## Review kode akhir

Uji deployment pertama mengungkap cold-start API 500 meski build lolos: `jwks-rsa` 4 me-require `jose` ESM. Reproduksi lokal `node --no-experimental-require-module` gagal sebelum perbaikan dan lolos sesudah pin kompatibel `jwks-rsa` 3.2.2. Node dipatok 22.x. Cold import kini termasuk `npm run check`; audit dependensi tetap 0 temuan. Deployment pertama tidak dianggap sebagai chat publik yang berhasil.

Reviewer independen membaca `8834bdb → 0fca841` tanpa membuka credential/private folder. Tidak ada temuan Critical. Lima kasus direproduksi sebagai test gagal sebelum satu putaran perbaikan:

1. Retry pertanyaan lanjutan kini memakai snapshot request/history awal.
2. Deklarasi password alfabetis eksplisit disamarkan pada client dan server.
3. Istilah NIK memakai word boundary sehingga kata “teknik” tidak salah ditolak.
4. Jawaban selesai diperbarui pada live region yang persisten.
5. Pemilihan riwayat mobile mengembalikan fokus ke composer.

Kelima reproduksi RED→GREEN, suite 31/31. Tiga temuan terakhir dinilai penting untuk kebenaran domain dan aksesibilitas, sehingga ikut diperbaiki. Tidak ada temuan yang sengaja ditunda.

Batas review: IAM/rules/hosting diperiksa melalui layanan nyata terpisah. Akurasi setiap keluaran, ketahanan jailbreak menyeluruh, pengujian screen reader asli dan seluruh perangkat, serta kesiapan enterprise tidak diklaim. Credential tidak dibuka reviewer; scan file Git memakai nilai rahasia aktual memastikan tidak ada key Mistral/private key Firebase pada file tracked. Offline/provider limit/session expiry diperiksa melalui boundary/error path, bukan pemutusan jaringan pada semua perangkat.
