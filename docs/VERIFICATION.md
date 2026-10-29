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

Tes tidak membuktikan semua keluaran LLM benar. Uji lanjutan meliputi register/login/logout nyata, keyboard, sumber, dialog, responsive, offline, retry, session expiry, dan deployment. Status akhir ditambahkan setelah dijalankan; jangan menganggap baris yang belum diperiksa sebagai lolos.
