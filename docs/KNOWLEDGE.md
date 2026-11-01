# Pengetahuan dan status sumber

Diperluas 1 November 2026 berdasarkan masukan presentasi Dzaky. Corpus berisi **27 artikel: 21 ringkasan publik PNM dan 6 contoh FAQ**. Tanggal tinjauan tiap artikel tetap terlihat pada panel sumber. Peninjauan untuk demo tidak berarti pengesahan operasional PNM.

## Sumber publik

| ID      | Sumber                                                | Yang diringkas                                             |
| ------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| company | [Sejarah PNM](https://www.pnm.co.id/tentang/sejarah)  | Nama perusahaan, tanggal pendirian, tujuan pemberdayaan    |
| mekaar  | [PNM Mekaar](https://www.pnm.co.id/bisnis/pnm-mekaar) | Pengenalan program, sasaran umum dan pendampingan kelompok |
| ulamm   | [PNM ULaMM](https://www.pnm.co.id/bisnis/pnm-ulamm)   | Kepanjangan, pengenalan layanan dan pendampingan           |

Tambahan sumber publik yang diperiksa pada 1 November 2026:

| ID                                                                           | Sumber primer                                                                                                                                                            | Cakupan                                                                |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| leadership, commissioners                                                    | [Manajemen Sekarang](https://www.pnm.co.id/tentang/manajemen-sekarang)                                                                                                   | Nama dan jabatan yang ditampilkan situs; profil singkat pimpinan       |
| pnm-group                                                                    | [PNM Grup](https://www.pnm.co.id/tentang/pnm-group)                                                                                                                      | Entitas anak dan afiliasi; bagan diperiksa secara visual               |
| organization                                                                 | [Struktur Organisasi](https://pnm.co.id/tentang/struktur-organisasi)                                                                                                     | Unit kerja; memakai bagan `so-new.png` yang tertaut pada halaman       |
| umi-holding                                                                  | [Holding Ultra Mikro](https://pnm.co.id/berita/lima-tahun-holding-ultra-mikro-perkuat-ekosistem-pembiayaan-dan-pemberdayaan-keluarga-prasejahtera)                       | Hubungan ekosistem; publikasi 8 September 2026                         |
| ao-programs                                                                  | [Apresiasi bagi AO](https://www.pnm.co.id/berita/dari-lulusan-sma-bisa-kuliah-gratis-dan-umrah:-pnm-apresiasi-garda-terdepan-pemberdayaan-masyarakat)                    | Publikasi 30 Oktober 2025; tidak membuktikan pendaftaran sedang dibuka |
| employee-awards                                                              | [Excellence Awards](https://www.pnm.co.id/berita/27-tahun-pnm-70-ribu-insan-dan-satu-langkah-besar-membangun-budaya-kerja-apresiatif-melalui-pnm-excellence-awards-2026) | Publikasi 4 Juni 2026                                                  |
| employee-porseni                                                             | [PORSENI](https://pnm.co.id/berita/pnm-asah-daya-juang-karyawan-melalui-grand-final-porseni-2026)                                                                        | Riwayat kegiatan Agustus 2026                                          |
| customer-benefits                                                            | [Mekaar](https://www.pnm.co.id/bisnis/pnm-mekaar)                                                                                                                        | Pengenalan manfaat, bukan keputusan pembiayaan                         |
| business-development, customer-retention, customer-rewards, customer-digital | [PKU](https://www.pnm.co.id/bisnis/program-pengembangan-kapasitas-usaha)                                                                                                 | Ikhtisar program; ketentuan mengikuti sumber resmi                     |
| customer-training                                                            | [Pelatihan usaha](https://www.pnm.co.id/berita/simak-lembaga-penyedia-pelatihan-usaha-rumahan-&-cara-daftarnya)                                                          | Publikasi 9 Juni 2026                                                  |
| customer-scholarships, education-programs                                    | [Quality Education](https://www.pnm.co.id/tjsl/kontribusi/quality-education)                                                                                             | Pendidikan keluarga nasabah dan masyarakat                             |
| sanitation-programs                                                          | [Clean Water and Sanitation](https://www.pnm.co.id/tjsl/kontribusi/clean-water-and-sanitation)                                                                           | Program TJSL terkait wilayah dan penerima tertentu                     |
| business-legality                                                            | [Pendampingan di Aceh](https://www.pnm.co.id/index.php/berita/sinergi-pnm-dan-ojk-perkuat-bekal-umkm-perempuan-aceh-untuk-naik-kelas)                                    | Contoh pelaksanaan 14 Agustus 2026; bukan jaminan semua cabang         |

Pendirian badan usaha diringkas dari sejarah resmi; tidak menganggap satu tokoh pribadi sebagai pendiri tanpa bukti. Untuk pengurus, halaman **Manajemen Sekarang** dipilih ketimbang dokumen historis yang masih menampilkan susunan lama. Tanda bintang pada nama di sumber dipertahankan tanpa menebak artinya. Pada grup usaha, entitas yang berada di bawah perusahaan anak tidak disebut seluruhnya anak langsung PNM.

## Tanggal, penerima dan batas informasi

- Corpus merupakan snapshot manual, bukan pencarian internet langsung. Server menambahkan tanggal tinjauan sumber yang benar-benar dirujuk pada jawaban publik, meskipun model melewatkannya.
- Pisahkan program untuk AO/karyawan dari program anak nasabah. Metadata `audience` membantu retrieval; pertanyaan perbandingan boleh mengambil kedua kelompok.
- Program pernah dipublikasikan tidak berarti sedang dibuka. Tidak menambahkan syarat seleksi, kampus, kuota, tenggat, hak otomatis atau jaminan lolos yang tidak tersedia dalam sumber.
- Tidak memuat gaji, cuti, data pegawai/nasabah, persentase saham terkini yang belum diperiksa, nominal keputusan pembiayaan, atau seluruh kebijakan internal. Topik PNM tanpa sumber cukup tetap menghasilkan no-answer.
- Tautan berasal dari metadata sumber server. Chatbot tidak membuka pendaftaran, mengajukan bantuan, menerbitkan izin, mengirim tiket atau melakukan transaksi.

Sebelum presentasi berikutnya dan setiap kali ada perubahan organisasi/program, periksa halaman primer, perbarui isi serta `updated`, jalankan regresi dan uji live, lalu redeploy. Tidak ada pembaruan otomatis atau job GitHub yang ditambahkan.

## Rancangan pengguna V1 dan desain V3

Spreadsheet awal yang diberikan pengguna memuat 21 tab rancangan dan katalog 89 slide FAQ, lalu diselaraskan dengan implementasi V3 pada 30 Oktober 2026. Workbook tetap menandai FAQ sebagai **belum disahkan**. Tautan Canva bukan bukti bahwa isi SOP masih aktif. Perluasan corpus 1 November disimpan dalam source dan dokumentasi repository; workbook dan screenshot 30 Oktober tidak diperbarui dalam perubahan ini.

Corpus publik hanya memuat contoh dialog aman terkait GPS, kehati-hatian OTP, pengenalan pesan JSON/EOF, token expired, input NaN, serta cara mendeskripsikan kendala. Tidak mempublikasikan salinan workbook/Canva, daftar rahasia, formula pembiayaan, kontak internal, atau langkah perubahan transaksi. Katalog penuh bukan knowledge base terverifikasi.

Desain V3 yang diterima pengguna dipakai sebagai arah tampilan dan alur, bukan otoritas kebenaran isi FAQ. File native V2/V3 dipertahankan di luar repo demo; repository memuat source website, bukan salinan seluruh Drive pengguna.

## Menambah artikel

Ubah `src/lib/knowledge.ts`. Setiap artikel membutuhkan ID stabil, judul, kategori, keywords yang cukup spesifik, ringkasan, tanggal tinjauan, dan status. Tautan harus berasal dari sumber yang benar-benar diperiksa. Konten internal harus melalui klasifikasi akses dan persetujuan pemilik; jangan menganggap login demo sebagai otorisasi pegawai.

Sebelum menerbitkan: periksa sumber primer, tanggal/versi, risiko, prasyarat, pengecualian, dan kewenangan. Pisahkan contoh presentasi dari panduan operasional. Tambahkan pengujian retrieval, no-answer, pertanyaan ambigu, variasi error, dan upaya prompt injection.

Pembatasan finansial dan rahasia tetap berlaku meski artikel baru ditambahkan. Jangan memasukkan key, prompt rahasia, NIK/rekening nyata, password VPN, atau nilai OTP/PIN ke corpus.
