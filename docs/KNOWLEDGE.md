# Pengetahuan dan status sumber

Ditinjau 29 Oktober 2026. Peninjauan untuk demo tidak berarti pengesahan operasional PNM.

## Sumber publik

| ID      | Sumber                                                | Yang diringkas                                             |
| ------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| company | [Sejarah PNM](https://www.pnm.co.id/tentang/sejarah)  | Nama perusahaan, tanggal pendirian, tujuan pemberdayaan    |
| mekaar  | [PNM Mekaar](https://www.pnm.co.id/bisnis/pnm-mekaar) | Pengenalan program, sasaran umum dan pendampingan kelompok |
| ulamm   | [PNM ULaMM](https://www.pnm.co.id/bisnis/pnm-ulamm)   | Kepanjangan, pengenalan layanan dan pendampingan           |

Tidak memasukkan angka biaya, margin, nominal pinjaman, jumlah nasabah terkini, pengurus terkini, atau persyaratan keputusan ke corpus kecil ini. Pertanyaan di luar fakta yang tersedia perlu sumber tambahan.

## Rancangan pengguna V1 dan desain V3

Spreadsheet V1 yang diberikan pengguna memuat 21 tab rancangan dan katalog 89 slide FAQ. Tab yang digunakan untuk implementasi meliputi Katalog FAQ, Aturan Jawaban, Lingkup, Dialog, Brief Desain, serta Referensi Istilah. Workbook secara eksplisit menandai FAQ sebagai **belum disahkan**. Tautan Canva bukan bukti bahwa isi SOP masih aktif.

Corpus publik hanya memuat contoh dialog aman terkait GPS, kehati-hatian OTP, pengenalan pesan JSON/EOF, token expired, input NaN, serta cara mendeskripsikan kendala. Tidak mempublikasikan salinan workbook/Canva, daftar rahasia, formula pembiayaan, kontak internal, atau langkah perubahan transaksi. Katalog penuh bukan knowledge base terverifikasi.

Desain V3 yang diterima pengguna dipakai sebagai arah tampilan dan alur, bukan otoritas kebenaran isi FAQ. File native V2/V3 dipertahankan di luar repo demo; repository memuat source website, bukan salinan seluruh Drive pengguna.

## Menambah artikel

Ubah `src/lib/knowledge.ts`. Setiap artikel membutuhkan ID stabil, judul, kategori, keywords yang cukup spesifik, ringkasan, tanggal tinjauan, dan status. Tautan harus berasal dari sumber yang benar-benar diperiksa. Konten internal harus melalui klasifikasi akses dan persetujuan pemilik; jangan menganggap login demo sebagai otorisasi pegawai.

Sebelum menerbitkan: periksa sumber primer, tanggal/versi, risiko, prasyarat, pengecualian, dan kewenangan. Pisahkan contoh presentasi dari panduan operasional. Tambahkan pengujian retrieval, no-answer, pertanyaan ambigu, variasi error, dan upaya prompt injection.

Pembatasan finansial dan rahasia tetap berlaku meski artikel baru ditambahkan. Jangan memasukkan key, prompt rahasia, NIK/rekening nyata, password VPN, atau nilai OTP/PIN ke corpus.
