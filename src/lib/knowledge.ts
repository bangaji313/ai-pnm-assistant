export type Article = {
  id: string;
  title: string;
  text: string;
  keywords: string[];
  status: string;
  url?: string;
  updated: string;
  category: string;
};

export const articles: Article[] = [
  {
    id: "company",
    title: "Mengenal PNM",
    category: "Tentang PNM",
    updated: "2026-10-29",
    status: "Sumber publik PNM",
    url: "https://www.pnm.co.id/tentang/sejarah",
    keywords: [
      "pnm",
      "perusahaan",
      "sejarah",
      "berdiri",
      "didirikan",
      "tentang",
      "permodalan",
      "nasional",
      "madani",
      "profil",
    ],
    text: "PNM adalah PT Permodalan Nasional Madani. Berdiri pada 1 Juni 1999, PNM menjalankan pembiayaan dan jasa manajemen untuk mendukung pengembangan koperasi serta usaha kecil dan menengah. Ringkasan ini berdasarkan halaman sejarah resmi; bukan informasi status akun atau transaksi.",
  },
  {
    id: "mekaar",
    title: "PNM Mekaar",
    category: "Produk & pemberdayaan",
    updated: "2026-10-29",
    status: "Sumber publik PNM",
    url: "https://www.pnm.co.id/bisnis/pnm-mekaar",
    keywords: [
      "mekaar",
      "membina",
      "ekonomi",
      "keluarga",
      "sejahtera",
      "perempuan",
      "kelompok",
    ],
    text: "Mekaar adalah Membina Ekonomi Keluarga Sejahtera. Diluncurkan pada 2015, program PNM ini menyediakan pembiayaan bagi perempuan prasejahtera pelaku usaha ultra mikro dengan pendampingan dan pendekatan kelompok. Detail persyaratan, biaya, dan keputusan pembiayaan harus diperiksa pada informasi resmi yang berlaku; demo tidak menentukan kelayakan atau menjanjikan persetujuan.",
  },
  {
    id: "ulamm",
    title: "PNM ULaMM",
    category: "Produk & pemberdayaan",
    updated: "2026-10-29",
    status: "Sumber publik PNM",
    url: "https://www.pnm.co.id/bisnis/pnm-ulamm",
    keywords: [
      "ulamm",
      "unit",
      "layanan",
      "modal",
      "mikro",
      "pendampingan",
      "pelatihan",
    ],
    text: "ULaMM berarti Unit Layanan Modal Mikro. PNM memperkenalkannya pada 2008 untuk pembiayaan langsung bagi usaha mikro dan kecil. Layanan mencakup dukungan pelatihan, konsultasi, dan pendampingan usaha. Demo hanya memberi pengenalan umum; nominal, persyaratan terkini, dan status pengajuan perlu diperiksa melalui PNM.",
  },
  {
    id: "demo-gps",
    title: "Contoh kendala GPS / Long Lat UK",
    category: "Contoh FAQ aplikasi",
    updated: "2026-10-29",
    status: "Contoh presentasi · belum disahkan",
    keywords: ["gps", "long", "lat", "lokasi", "terdeteksi", "koordinat"],
    text: "Contoh dialog rancangan V1 (DL01, merujuk katalog FAQ slide 36): kendala Long Lat UK tidak terdeteksi berkaitan dengan pemeriksaan aktivasi GPS. Contoh ini belum disahkan sebagai SOP aktif. Sebutkan menu, pesan error, dan versi aplikasi tanpa data nasabah. Jika GPS sudah aktif dan masalah berlanjut, sumber contoh tidak memuat langkah tambahan; lanjutkan ke bantuan resmi. Jangan menambah instruksi hapus data, instal ulang, atau manipulasi lokasi.",
  },
  {
    id: "demo-otp",
    title: "Contoh kendala OTP",
    category: "Contoh FAQ aplikasi",
    updated: "2026-10-29",
    status: "Contoh presentasi · belum disahkan",
    keywords: ["otp", "pin", "sms", "kode", "terima", "diterima"],
    text: "Rancangan V1 menempatkan OTP/PIN sebagai topik pemulihan akun. Tidak ada prosedur aktif yang sudah disahkan dalam corpus publik demo ini. Jangan menuliskan kode OTP, PIN, atau password dalam chat. Sebutkan menu, pesan error, dan versi aplikasi, kemudian gunakan kanal bantuan resmi untuk pemulihan. Demo tidak dapat mengirim ulang, membaca SMS, atau memverifikasi OTP.",
  },
  {
    id: "demo-json",
    title: "Contoh pesan Json Parse Error / Unexpected EOF",
    category: "Contoh FAQ aplikasi",
    updated: "2026-10-29",
    status: "Contoh presentasi · belum disahkan",
    keywords: ["json", "parse", "unexpected", "eof"],
    text: "Katalog rancangan V1 mengenali pesan Json Parse Error Unexpected EOF sebagai topik kendala aplikasi. Corpus publik tidak menyertakan urutan penanganan internal yang sudah disahkan. Catat teks error, menu, versi aplikasi, dan kapan kendala muncul tanpa data nasabah; gunakan kanal resmi untuk pemeriksaan lebih lanjut. Jangan menebak penyebab teknis atau memberi instruksi perubahan data.",
  },
  {
    id: "demo-expired",
    title: "Contoh pesan Token is Expired",
    category: "Contoh FAQ aplikasi",
    updated: "2026-10-29",
    status: "Contoh presentasi · belum disahkan",
    keywords: ["expired", "kedaluwarsa", "sesi", "token"],
    text: "Katalog rancangan V1 memuat kendala Token is Expired. Lama berlaku token dan langkah pemulihan saat ini belum divalidasi dalam corpus publik demo. Jangan membagikan token atau password. Sebutkan menu dan versi aplikasi; gunakan proses autentikasi atau bantuan resmi, bukan jalan pintas untuk melewati otorisasi.",
  },
  {
    id: "demo-nan",
    title: "Contoh input pendapatan NaN",
    category: "Contoh FAQ aplikasi",
    updated: "2026-10-29",
    status: "Contoh presentasi · belum disahkan",
    keywords: ["nan", "pendapatan", "input", "format"],
    text: "Katalog rancangan V1 mencatat kendala pendapatan NaN. Validasi format input perlu mengikuti panduan aplikasi yang berlaku. Corpus publik belum memuat aturan format yang telah disahkan. Sebutkan nama kolom, menu, dan pesan error menggunakan nilai sintetis; jangan masukkan nominal atau profil nasabah nyata. Jangan mengubah nominal untuk melewati validasi.",
  },
  {
    id: "demo-app",
    title: "Menyampaikan kendala aplikasi dengan aman",
    category: "Bantuan aplikasi",
    updated: "2026-10-29",
    status: "Contoh presentasi · belum disahkan",
    keywords: [
      "aplikasi",
      "mekdi",
      "versi",
      "apk",
      "helpdesk",
      "ticketing",
      "bantuan",
      "laporan",
      "eskalasi",
    ],
    text: "Rancangan demo membantu menyusun konteks kendala: nama aplikasi/menu, teks error, versi, waktu kejadian secara umum, dan langkah yang sudah dicoba. Gunakan contoh sintetis tanpa identitas nasabah, rekening, OTP, atau password. Materi SOP internal tidak dibuka ke pengunjung publik. Draf belum dikirim; demo tidak membuat nomor tiket atau memberi akses akun kerja.",
  },
];
