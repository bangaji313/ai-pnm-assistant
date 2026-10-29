# Catatan implementasi

## Brief

Landing → Mari Coba → login/register atau Use Demo Account → ruang chat V3. Jawaban Mistral dibatasi sumber PNM, FAQ tidak dianggap SOP aktif, sumber dan status selalu dapat diperiksa. Source di folder ini, repo baru bangaji313, deployment Vercel langsung. GitHub Actions tidak dipakai karena batas billing akun.

## Keputusan

- Next.js App Router + TypeScript menyatukan halaman dan API server sehingga key Mistral tidak dikirim ke browser.
- Firebase dipilih pengguna pada 29 Oktober 2026. Tidak membuat proyek Supabase; tidak memakai backend VitalSense.
- Sesi demo terisolasi per pengunjung. Tidak menggunakan satu akun admin bersama.
- Corpus publik hanya fakta perusahaan dari situs resmi dan contoh dialog yang aman dari rancangan. SOP internal, formula, kredensial, data nasabah, dan langkah transaksi tidak diterbitkan.
- Retrieval leksikal dan exact error cukup untuk corpus kecil; tidak menambah vector DB/embedding berbayar.
- Pengujian lokal dan deploy langsung; tidak menambah workflow GitHub atau ketergantungan Actions.

## Urutan

1. Fondasi dan uji kebijakan/domain, redaksi rahasia, sesi, rate limit.
2. Landing, autentikasi Firebase, ruang chat responsive dan sumber.
3. Mistral server, quota, penanganan gagal/retry dan eskalasi draf.
4. Pemeriksaan build, unit/integration, visual/browser, review akhir.
5. README/dokumentasi, repo publik, deployment langsung dan smoke test.

## Bukti awal

- GitHub bangaji313 terautentikasi untuk operasi repo.
- Mistral GET models HTTP 200; chat pertama HTTP 429. Belum mengklaim inferensi berhasil.
- Koneksi Firebase ditawarkan; provisioning menunggu akses terkonfirmasi.
- Kontrol browser Windows berhenti karena URL tidak dapat dipastikan. Tidak mengubah pengaturan lewat browser setelah itu.
