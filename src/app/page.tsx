import Link from "next/link";
import { Arrow, Avatar, Book, Brand } from "@/components/brand";

export default function Landing() {
  return (
    <>
      <div className="concept-note">
        Demo presentasi independen <span>·</span> Bukan layanan resmi PNM
      </div>
      <header className="landing-nav">
        <div className="wrap nav-inner">
          <Brand />
          <nav aria-label="Navigasi utama">
            <a href="#kenali">Kenali demonya</a>
            <Link href="/login" className="nav-login">
              Masuk <Arrow />
            </Link>
          </nav>
        </div>
      </header>
      <main id="main">
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="gold-line" /> ASISTEN INFORMASI PNM
            </p>
            <h1>
              Ada pertanyaan?
              <br />
              <span>Kita cari jawabannya.</span>
            </h1>
            <p className="hero-description">
              Dari mengenal PNM sampai memahami kendala aplikasi. Mulai
              percakapan, temukan rujukannya, lalu tentukan langkah berikutnya.
            </p>
            <Link href="/login" className="button primary hero-cta">
              Mari Coba <Arrow />
            </Link>
            <p className="quiet">
              Bisa langsung mencoba dengan akun demo.
              <br />
              Gunakan pertanyaan dan data contoh.
            </p>
          </div>
          <div
            className="hero-stage"
            aria-label="Ilustrasi asisten dan contoh percakapan"
          >
            <div className="stage-caption">
              Bersama petugas.
              <br />
              <strong>Dekat dengan kebutuhan.</strong>
            </div>
            <div className="ao-backdrop" />
            <img
              className="hero-ao"
              src="/brand/ao-pnm.png"
              alt="Ilustrasi petugas PNM berhijab yang tersenyum"
              width="400"
              height="600"
              fetchPriority="high"
            />
            <div className="conversation-preview">
              <div className="preview-heading">
                <Avatar />
                <div>
                  <strong>AI.PNM</strong>
                  <small>Contoh percakapan</small>
                </div>
                <span className="preview-dot" />
              </div>
              <p className="preview-question">Apa itu PNM Mekaar?</p>
              <p>
                Mekaar mendampingi perempuan pelaku usaha ultra mikro melalui
                pembiayaan dan pendampingan kelompok.
              </p>
              <span className="preview-source">
                <Book /> Rujukan: situs resmi PNM
              </span>
            </div>
          </div>
        </section>
        <section className="topic-section" id="kenali">
          <div className="wrap topic-layout">
            <div>
              <p className="eyebrow">COBA DARI SINI</p>
              <h2>
                Pertanyaan kecil.
                <br />
                Awal yang berarti.
              </h2>
              <p>Pilih satu topik untuk dibawa ke ruang percakapan.</p>
            </div>
            <div className="topic-list">
              {[
                [
                  "01",
                  "Mengenal PNM",
                  "Apa yang dilakukan PNM?",
                  "Apa itu PNM dan kapan didirikan?",
                ],
                [
                  "02",
                  "Produk & pendampingan",
                  "Apa bedanya Mekaar dan ULaMM?",
                  "Apa perbedaan PNM Mekaar dan ULaMM?",
                ],
                [
                  "03",
                  "Contoh kendala aplikasi",
                  "Long Lat UK tidak terdeteksi",
                  "Long Lat UK tidak terdeteksi, harus bagaimana?",
                ],
              ].map(([n, title, detail, q]) => (
                <Link
                  key={n}
                  href={`/login?q=${encodeURIComponent(q)}`}
                  className="topic-row"
                >
                  <span className="topic-number">{n}</span>
                  <span>
                    <strong>{title}</strong>
                    <small>{detail}</small>
                  </span>
                  <Arrow />
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="wrap source-section">
          <div className="source-heading">
            <Book />
            <h2>
              Jawaban punya rujukan.
              <br />
              Batasnya juga jelas.
            </h2>
          </div>
          <div className="source-prose">
            <p>
              Informasi perusahaan mengacu pada sumber publik PNM. Contoh FAQ
              ditandai sebagai bahan presentasi yang belum disahkan, sehingga
              tidak menggantikan panduan operasional.
            </p>
            <p>
              Asisten tidak mengecek saldo, mengambil keputusan pembiayaan, atau
              mengirim tiket. Jangan masukkan data nasabah, password, PIN, dan
              OTP.
            </p>
            <Link href="/login" className="text-link">
              Buka ruang percakapan <Arrow />
            </Link>
          </div>
        </section>
        <section className="closing-band">
          <div className="wrap closing-inner">
            <div>
              <p className="eyebrow">RUANG UNTUK MENCOBA</p>
              <h2>Kenali. Tanyakan. Periksa sumbernya.</h2>
              <Link href="/login" className="button white">
                Mulai percakapan <Arrow />
              </Link>
            </div>
            <img
              src="/brand/ao-pnm.png"
              width="190"
              height="285"
              loading="lazy"
              alt=""
            />
          </div>
        </section>
      </main>
      <footer className="wrap footer">
        <div>
          <strong>AI.PNM</strong>
          <p>
            Konsep: Maulana Dzaky Riswandi
            <br />
            Konsep & UI/UX: Maulana Seno Aji Yudhantara
          </p>
        </div>
        <div className="footer-links">
          <Link href="/privasi">Privasi</Link>
          <Link href="/ketentuan">Ketentuan demo</Link>
          <a
            href="https://github.com/bangaji313/ai-pnm-assistant"
            target="_blank"
            rel="noreferrer"
          >
            Kode & dokumentasi ↗
          </a>
        </div>
      </footer>
    </>
  );
}
