import Link from "next/link";
export default function Page() {
  return (
    <main id="main" className="legal-page">
      <Link href="/">← Beranda AI.PNM</Link>
      <h1>Ketentuan demo</h1>
      <p>
        Demo ini dibuat untuk eksplorasi konsep dan presentasi. Bukan layanan
        resmi, bukan SOP operasional yang sudah disahkan PNM, dan bukan layanan
        transaksi atau dukungan yang menjanjikan penyelesaian.
      </p>
      <h2>Penggunaan yang sesuai</h2>
      <p>
        Gunakan pertanyaan tentang informasi publik PNM dan contoh FAQ yang
        tersedia. Jangan mengirim identitas nasabah, rekening, KTP, foto
        dokumen, password, OTP, PIN, atau data internal. Jangan menggunakan
        jawaban untuk menentukan kelayakan pembiayaan atau melakukan perubahan
        finansial.
      </p>
      <h2>Sumber dan jawaban AI</h2>
      <p>
        Jawaban AI dapat keliru atau tidak lengkap. Periksa sumber yang
        ditampilkan dan gunakan informasi resmi yang berlaku sebelum bertindak.
        Contoh FAQ memiliki label belum disahkan; model tidak mendapat akses SOP
        internal, sistem PNM, atau transaksi nasabah.
      </p>
      <h2>Akun dan ketersediaan</h2>
      <p>
        Akun demo bersifat tamu dan tidak memberikan kewenangan pegawai. Layanan
        mengikuti kuota gratis penyedia dan dapat berhenti sementara. Pengembang
        tidak menjanjikan ketersediaan tanpa batas. Jangan menggunakan password
        kerja PNM untuk akun demo.
      </p>
      <h2>Kredit dan merek</h2>
      <p>
        Pengusul konsep: Maulana Dzaky Riswandi. Perancangan konsep dan UI/UX:
        Maulana Seno Aji Yudhantara. Nama, logo, dan merek PNM tetap menjadi hak
        pemiliknya; penggunaannya di sini untuk konsep yang diberikan pengguna,
        tanpa klaim afiliasi atau pengesahan.
      </p>
      <p>
        <Link href="/privasi">Baca privasi demo</Link> ·{" "}
        <Link href="/login">Mulai mencoba</Link>
      </p>
    </main>
  );
}
