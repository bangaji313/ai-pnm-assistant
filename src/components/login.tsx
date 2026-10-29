"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-client";
import { Arrow, Brand } from "./brand";

export function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const destination = () =>
    `/chat${params.get("q") ? `?q=${encodeURIComponent(params.get("q")!.slice(0, 1200))}` : ""}`;
  async function enter(action: "demo" | "submit" | "reset") {
    setBusy(action);
    setError("");
    setNotice("");
    try {
      const auth = firebaseAuth();
      if (action === "reset") {
        if (!email) throw new Error("EMAIL_REQUIRED");
        await sendPasswordResetEmail(auth, email);
        setNotice(
          "Jika alamat terdaftar, tautan pemulihan dikirim. Periksa email Anda.",
        );
        return;
      }
      if (action === "demo") await signInAnonymously(auth);
      else if (mode === "register") {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(result.user, {
          displayName: name.trim().slice(0, 50),
        });
      } else await signInWithEmailAndPassword(auth, email, password);
      router.push(destination());
    } catch (e) {
      const code =
        (e as { code?: string; message?: string }).code ?? (e as Error).message;
      const messages: Record<string, string> = {
        FIREBASE_NOT_CONFIGURED:
          "Koneksi akun sedang disiapkan. Silakan coba kembali setelah konfigurasi Firebase selesai.",
        EMAIL_REQUIRED: "Isi email terlebih dahulu untuk memulihkan akun.",
        "auth/invalid-credential":
          "Email atau password tidak sesuai. Periksa kembali.",
        "auth/email-already-in-use":
          "Email sudah terdaftar. Gunakan tab Masuk.",
        "auth/weak-password": "Gunakan password setidaknya 8 karakter.",
        "auth/too-many-requests":
          "Terlalu banyak percobaan. Tunggu sebelum mencoba lagi.",
        "auth/operation-not-allowed":
          "Metode masuk belum aktif di Firebase. Coba metode lain atau hubungi pengelola demo.",
        "auth/network-request-failed":
          "Koneksi terputus. Periksa jaringan lalu coba kembali.",
      };
      setError(
        messages[code] ??
          "Belum berhasil masuk. Periksa email, password, dan koneksi Anda.",
      );
    } finally {
      setBusy("");
    }
  }
  return (
    <div className="auth-page">
      <aside className="auth-story">
        <Brand />
        <div className="auth-story-copy">
          <p className="eyebrow">SELAMAT DATANG DI AI.PNM</p>
          <h1>
            Teman bertanya,
            <br />
            sebelum melangkah.
          </h1>
          <p>
            Coba percakapan dengan rujukan yang bisa diperiksa. Mulai dari
            informasi PNM atau contoh kendala aplikasi.
          </p>
        </div>
        <img
          src="/brand/ao-pnm.png"
          className="auth-ao"
          width="310"
          height="465"
          alt="Ilustrasi asisten petugas PNM"
        />
        <span className="auth-caption">
          Konsep untuk presentasi. Bukan layanan resmi PNM.
        </span>
      </aside>
      <main className="auth-main" id="main">
        <Link href="/" className="back-link">
          <Arrow back /> Kembali ke beranda
        </Link>
        <div className="auth-form-wrap">
          <p className="eyebrow">MULAI PERCAKAPAN</p>
          <h2>
            {mode === "login"
              ? "Senang bertemu Anda."
              : "Buat ruang Anda sendiri."}
          </h2>
          <p className="auth-intro">
            {mode === "login"
              ? "Masuk dengan akun Anda atau langsung jelajahi demonya."
              : "Gunakan email pribadi. Jangan gunakan password akun kerja PNM."}
          </p>
          <div
            className="auth-tabs"
            role="group"
            aria-label="Pilih masuk atau daftar"
          >
            <button
              type="button"
              aria-pressed={mode === "login"}
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Masuk
            </button>
            <button
              type="button"
              aria-pressed={mode === "register"}
              onClick={() => {
                setMode("register");
                setError("");
              }}
            >
              Daftar akun
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void enter("submit");
            }}
          >
            {mode === "register" && (
              <label>
                Nama panggilan
                <input
                  autoComplete="nickname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={50}
                  placeholder="Nama yang ingin ditampilkan"
                />
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={254}
                placeholder="nama@email.com"
              />
            </label>
            <label>
              Password
              <span className="password-field">
                <input
                  type={show ? "text" : "password"}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={mode === "register" ? 8 : 1}
                  maxLength={128}
                  placeholder={
                    mode === "register"
                      ? "Minimal 8 karakter"
                      : "Masukkan password"
                  }
                />
                <button
                  type="button"
                  aria-label={
                    show ? "Sembunyikan password" : "Tampilkan password"
                  }
                  onClick={() => setShow(!show)}
                >
                  {show ? "Sembunyikan" : "Lihat"}
                </button>
              </span>
            </label>
            {mode === "login" ? (
              <button
                className="reset-link"
                type="button"
                disabled={!!busy}
                onClick={() => void enter("reset")}
              >
                Lupa password?
              </button>
            ) : (
              <label className="checkbox-label">
                <input type="checkbox" required />{" "}
                <span>
                  Saya memahami <Link href="/ketentuan">ketentuan demo</Link>{" "}
                  dan <Link href="/privasi">privasi</Link>.
                </span>
              </label>
            )}
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className="form-notice">
                {notice}
              </p>
            )}
            <button className="button primary full" disabled={!!busy}>
              {busy === "submit"
                ? "Menyiapkan ruang…"
                : mode === "login"
                  ? "Masuk ke AI.PNM"
                  : "Daftar & mulai"}{" "}
              <Arrow />
            </button>
          </form>
          <div className="auth-divider">
            <span>ingin melihat-lihat dulu?</span>
          </div>
          <button
            className="button outline full"
            disabled={!!busy}
            onClick={() => void enter("demo")}
          >
            {busy === "demo" ? "Membuka sesi demo…" : "Use Demo Account"}{" "}
            <Arrow />
          </button>
          <p className="demo-explainer">
            Tanpa email. Setiap pengunjung mendapat sesi tamu sendiri.
            <br />
            Gunakan data contoh selama mencoba.
          </p>
        </div>
        <p className="auth-legal">
          <Link href="/privasi">Privasi</Link>
          <span>·</span>
          <Link href="/ketentuan">Ketentuan demo</Link>
        </p>
      </main>
    </div>
  );
}
