import Link from "next/link";
export default function Page() {
  return (
    <main id="main" className="legal-page">
      <Link href="/">← Beranda AI.PNM</Link>
      <h1>Privasi demo</h1>
      <p>
        Terakhir diperbarui 29 Oktober 2026. AI.PNM adalah konsep presentasi
        independen yang dikelola pengembang proyek, bukan portal resmi PNM.
        Gunakan data contoh saja.
      </p>
      <h2>Data yang diproses</h2>
      <p>
        Firebase Authentication menangani akun email/password atau identitas
        tamu anonim. Pengembang tidak menyimpan password secara manual.
        Pertanyaan dikirim melalui API server Vercel ke Mistral beserta potongan
        sumber dan hingga enam pesan konteks. Jangan masukkan informasi yang
        tidak boleh dibagikan ke penyedia tersebut.
      </p>
      <p>
        Pendeteksi sederhana menyamarkan pola kredensial, email, dan angka
        panjang sebelum dikirim. Deteksi ini tidak menjamin semua data pribadi
        terhapus; Anda tetap perlu memakai data sintetis.
      </p>
      <h2>Riwayat dan batas penggunaan</h2>
      <p>
        Hingga sepuluh percakapan disimpan dalam sessionStorage pada tab
        browser, dipisahkan menurut identitas akun. Riwayat dihapus saat keluar
        dari aplikasi. Feedback disimpan bersama riwayat tab. Tidak ada fitur
        analitik pihak ketiga atau penyimpanan pesan chat permanen pada server
        aplikasi.
      </p>
      <p>
        Firestore menyimpan penghitung penggunaan dengan hash identitas
        pengguna/IP, bukan isi percakapan atau IP mentah. Penghitung memiliki
        waktu kedaluwarsa untuk pembersihan. Vercel, Firebase, dan Mistral dapat
        memiliki log layanan dan kebijakan retensinya sendiri. Demo ini tidak
        mengklaim Zero Data Retention pada layanan Mistral gratis.
      </p>
      <h2>Kontrol Anda</h2>
      <p>
        Tutup tab atau keluar untuk mengakhiri riwayat sesi. Untuk permintaan
        terkait akun atau masalah privasi, hubungi pengelola melalui{" "}
        <a href="https://github.com/bangaji313/ai-pnm-assistant/issues">
          issue repository
        </a>{" "}
        tanpa menuliskan rahasia, identitas nasabah, atau data pribadi.
      </p>
      <h2>Penyedia layanan</h2>
      <ul>
        <li>
          <a href="https://firebase.google.com/support/privacy">
            Privasi Firebase
          </a>
        </li>
        <li>
          <a href="https://vercel.com/legal/privacy-policy">Privasi Vercel</a>
        </li>
        <li>
          <a href="https://mistral.ai/terms#privacy-policy">Privasi Mistral</a>
        </li>
      </ul>
      <p>
        <Link href="/ketentuan">Baca ketentuan demo</Link>
      </p>
    </main>
  );
}
