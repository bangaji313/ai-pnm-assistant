"use client";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { firebaseAuth } from "@/lib/firebase-client";
import { articles, type Article } from "@/lib/knowledge";
import { redact } from "@/lib/policy";
import { Arrow, Avatar, Book, Brand } from "./brand";
import { Answer } from "./answer";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Article[];
  engine?: string;
  feedback?: string;
};
type Conversation = { id: string; title: string; messages: Message[] };
type RetryRequest = {
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
};
const uid = () => crypto.randomUUID();
const initial = (): Conversation => ({
  id: uid(),
  title: "Percakapan baru",
  messages: [],
});
const examples = [
  "Apa itu PNM dan kapan didirikan?",
  "Apa perbedaan Mekaar dan ULaMM?",
  "Long Lat UK tidak terdeteksi, harus bagaimana?",
  "OTP belum diterima, apa yang perlu diperhatikan?",
];

export function Chat() {
  const router = useRouter();
  const params = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [active, setActive] = useState("");
  const [draft, setDraft] = useState(params.get("q")?.slice(0, 1200) ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState<RetryRequest | null>(null);
  const [online, setOnline] = useState(true);
  const [menu, setMenu] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const [panel, setPanel] = useState<"sources" | "guides" | "help" | null>(
    null,
  );
  const [sources, setSources] = useState<Article[]>([]);
  const [notice, setNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const current = conversations.find((c) => c.id === active);
  const messages = current?.messages ?? [];
  useEffect(() => {
    const media = window.matchMedia("(max-width: 850px)");
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (menu && narrow)
      sidebarRef.current
        ?.querySelector<HTMLButtonElement>("button:not([disabled])")
        ?.focus();
  }, [menu, narrow]);
  function closeMenu() {
    setMenu(false);
    menuRef.current?.focus();
  }
  useEffect(() => {
    try {
      return onAuthStateChanged(firebaseAuth(), (u) => {
        if (!u) {
          router.replace("/login");
          return;
        }
        setUser(u);
        let data: Conversation[] = [];
        try {
          const saved = JSON.parse(
            sessionStorage.getItem(`pnm-chat:${u.uid}`) ?? "[]",
          );
          if (Array.isArray(saved))
            data = saved
              .filter(
                (c) =>
                  typeof c?.id === "string" &&
                  typeof c?.title === "string" &&
                  Array.isArray(c.messages),
              )
              .slice(0, 10);
        } catch {}
        const list = data.length ? data : [initial()];
        setConversations(list);
        setActive(list[0].id);
        setReady(true);
      });
    } catch {
      router.replace("/login");
    }
  }, [router]);
  useEffect(() => {
    if (!user || !ready) return;
    try {
      sessionStorage.setItem(
        `pnm-chat:${user.uid}`,
        JSON.stringify(conversations.slice(0, 10)),
      );
    } catch {
      setNotice(
        "Riwayat tidak dapat disimpan di tab ini. Percakapan tetap dapat dilanjutkan.",
      );
    }
  }, [conversations, user, ready]);
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "instant", block: "end" });
  }, [messages.length, busy]);
  useEffect(() => {
    if (panel && !dialog.current?.open) dialog.current?.showModal();
    else if (!panel && dialog.current?.open) dialog.current.close();
  }, [panel]);
  function update(fn: (c: Conversation) => Conversation) {
    setConversations((list) => list.map((c) => (c.id === active ? fn(c) : c)));
  }
  function newChat() {
    if (busy) return;
    const c = initial();
    setConversations((list) => [c, ...list].slice(0, 10));
    setActive(c.id);
    setDraft("");
    setError("");
    setRetry(null);
    setMenu(false);
    input.current?.focus();
  }
  async function send(text = draft, retryRequest?: RetryRequest) {
    if (!user || busy || !text.trim()) return;
    if (!online) {
      setError(
        "Anda sedang offline. Pesan tetap ada; sambungkan jaringan lalu coba lagi.",
      );
      return;
    }
    const clean = redact(text.trim());
    if (clean !== text.trim())
      setNotice(
        "Informasi yang berpotensi sensitif disamarkan sebelum dikirim.",
      );
    const history =
      retryRequest?.history ??
      messages.map((m) => ({ role: m.role, content: m.content }));
    if (!retryRequest)
      update((c) => ({
        ...c,
        title: c.messages.length ? c.title : clean.slice(0, 48),
        messages: [
          ...c.messages,
          { id: uid(), role: "user" as const, content: clean },
        ].slice(-50),
      }));
    if (!retryRequest) setDraft("");
    setBusy(true);
    setError("");
    setRetry(null);
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: clean, history: history.slice(-6) }),
        signal: AbortSignal.timeout(35000),
      });
      const data = await response.json();
      if (response.status === 401) {
        await signOut(firebaseAuth());
        router.replace("/login");
        return;
      }
      if (!response.ok)
        throw new Error(data.error ?? "Pesan belum berhasil diproses.");
      update((c) => ({
        ...c,
        messages: [
          ...c.messages,
          {
            id: uid(),
            role: "assistant" as const,
            content: data.answer,
            sources: data.sources,
            engine: data.engine,
          },
        ].slice(-50),
      }));
    } catch (e) {
      setError(
        e instanceof Error && e.name === "TimeoutError"
          ? "Layanan membutuhkan waktu lebih lama. Silakan coba lagi."
          : (e as Error).message || "Koneksi terputus. Silakan coba lagi.",
      );
      setRetry({ message: clean, history });
    } finally {
      setBusy(false);
      input.current?.focus();
    }
  }
  async function logout() {
    if (busy) return;
    if (user) {
      try {
        sessionStorage.removeItem(`pnm-chat:${user.uid}`);
      } catch {}
    }
    await signOut(firebaseAuth());
    router.replace("/login");
  }
  function vote(id: string, value: string) {
    update((c) => ({
      ...c,
      messages: c.messages.map((m) =>
        m.id === id ? { ...m, feedback: value } : m,
      ),
    }));
    setNotice(
      "Terima kasih. Penilaian dicatat di sesi tab ini untuk uji demo.",
    );
  }
  async function copyDraft() {
    const text = `DRAF KENDALA — BELUM DIKIRIM\n\n${messages
      .filter((m) => m.role === "user")
      .slice(-3)
      .map((m) => redact(m.content))
      .join(
        "\n",
      )}\n\nMenu/aplikasi: [lengkapi]\nVersi: [lengkapi]\nLangkah yang sudah dicoba: [lengkapi]\n\nGunakan kanal resmi PNM. Jangan sertakan data nasabah atau rahasia akun.`;
    try {
      await navigator.clipboard.writeText(text);
      setNotice("Draf disalin. Belum ada laporan atau tiket yang dikirim.");
    } catch {
      setNotice(
        "Clipboard tidak tersedia. Silakan salin ringkasan pertanyaan dari percakapan.",
      );
    }
  }
  if (!ready)
    return (
      <main id="main" className="loading-page">
        Memeriksa sesi Anda…
      </main>
    );
  return (
    <div className="app-shell">
      <aside
        ref={sidebarRef}
        inert={narrow && !menu}
        onKeyDown={(e) => {
          if (!narrow || !menu) return;
          if (e.key === "Escape") {
            e.preventDefault();
            closeMenu();
          }
          if (e.key === "Tab") {
            const controls = [
              ...e.currentTarget.querySelectorAll<HTMLElement>(
                "a[href],button:not([disabled])",
              ),
            ].filter((el) => el.getClientRects().length > 0);
            const first = controls[0],
              last = controls.at(-1);
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first?.focus();
            }
          }
        }}
        className={`sidebar ${menu ? "sidebar-open" : ""}`}
        aria-label="Navigasi percakapan"
      >
        <div className="sidebar-brand">
          <Brand />
          <button
            className="sidebar-close"
            aria-label="Tutup menu"
            onClick={closeMenu}
          >
            ×
          </button>
        </div>
        <button className="button new-chat" onClick={newChat} disabled={busy}>
          <span aria-hidden="true">＋</span>Percakapan baru
        </button>
        <p className="sidebar-label">RUANG ANDA</p>
        <button
          className="sidebar-nav"
          onClick={() => {
            setPanel("guides");
            setMenu(false);
          }}
        >
          <Book /> Panduan & topik
        </button>
        <button
          className="sidebar-nav"
          onClick={() => {
            setPanel("help");
            setMenu(false);
          }}
        >
          Bantuan lanjutan <Arrow />
        </button>
        <div className="history-heading">
          <p className="sidebar-label">RIWAYAT TAB INI</p>
          <span>{conversations.length}/10</span>
        </div>
        <div className="history-list">
          {conversations.map((c) => (
            <button
              key={c.id}
              disabled={busy}
              className={
                c.id === active ? "history-item selected" : "history-item"
              }
              onClick={() => {
                setActive(c.id);
                setMenu(false);
                setError("");
                setRetry(null);
                setDraft("");
                input.current?.focus();
              }}
              title={c.title}
            >
              {c.title}
            </button>
          ))}
        </div>
        <div className="sidebar-companion">
          <Avatar />
          <p>
            Ada yang belum jelas?
            <br />
            <strong>Kita periksa sumbernya.</strong>
          </p>
        </div>
        <div className="sidebar-account">
          <span className="account-initial">
            {user?.isAnonymous
              ? "D"
              : (user?.displayName ?? user?.email ?? "A")[0].toUpperCase()}
          </span>
          <span>
            <strong>
              {user?.isAnonymous
                ? "Pengunjung demo"
                : (user?.displayName ?? "Akun Anda")}
            </strong>
            <small>
              {user?.isAnonymous ? "Sesi tamu pribadi" : "Akun Firebase"}
            </small>
          </span>
          <button
            aria-label="Keluar dari akun"
            title="Keluar"
            disabled={busy}
            onClick={() => void logout()}
          >
            ↪
          </button>
        </div>
      </aside>
      {menu && (
        <button
          className="menu-backdrop"
          aria-label="Tutup navigasi"
          onClick={closeMenu}
        />
      )}
      <div className="app-body">
        <header className="app-header">
          <div className="app-heading">
            <button
              ref={menuRef}
              className="menu-toggle"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label="Buka menu navigasi"
            >
              ☰
            </button>
            <Avatar />
            <div>
              <strong>AI.PNM</strong>
              <small>Teman menemukan jawaban</small>
            </div>
          </div>
          <span className="demo-tag">Demo presentasi</span>
        </header>
        <div className="app-notice">
          <span aria-hidden="true">ⓘ</span> Bukan layanan resmi PNM. Gunakan
          data contoh; jangan bagikan OTP atau data nasabah.
        </div>
        <main id="main" className="chat-main">
          <div
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {!busy
              ? messages
                  .findLast((m) => m.role === "assistant")
                  ?.content.replace(/\*\*/g, "")
              : ""}
          </div>
          <div className="chat-scroll">
            <div className="chat-content">
              {!messages.length ? (
                <div className="welcome">
                  <div className="welcome-heading">
                    <div>
                      <p className="eyebrow">
                        SELAMAT DATANG,{" "}
                        {user?.isAnonymous
                          ? "PENGUNJUNG DEMO"
                          : (user?.displayName ?? "TEMAN PNM").toUpperCase()}
                      </p>
                      <h1>
                        Apa yang ingin
                        <br />
                        Anda ketahui hari ini?
                      </h1>
                      <p>
                        Saya bantu menemukan informasi PNM dan contoh panduan
                        aplikasi, lengkap dengan rujukannya.
                      </p>
                    </div>
                    <img
                      src="/brand/ao-pnm.png"
                      width="168"
                      height="252"
                      alt="Ilustrasi asisten PNM"
                    />
                  </div>
                  <p className="welcome-label">Mulai dengan satu pertanyaan</p>
                  <div className="question-grid">
                    {examples.map((q, i) => (
                      <button
                        key={q}
                        onClick={() => void send(q)}
                        className="question-option"
                        disabled={busy}
                      >
                        <span className="question-index">0{i + 1}</span>
                        <span>{q}</span>
                        <Arrow />
                      </button>
                    ))}
                  </div>
                  <div className="welcome-footnote">
                    <Book />
                    <span>
                      Info perusahaan dari situs resmi PNM.
                      <br />
                      Contoh FAQ belum disahkan sebagai SOP operasional.
                    </span>
                  </div>
                </div>
              ) : (
                <section className="messages" aria-label="Percakapan">
                  {messages.map((m) => (
                    <article key={m.id} className={`message message-${m.role}`}>
                      <div className="message-author">
                        {m.role === "assistant" ? (
                          <>
                            <Avatar />
                            <strong>AI.PNM</strong>
                            <span>
                              {m.engine === "mistral"
                                ? "Disusun dengan Mistral"
                                : "Batas layanan"}
                            </span>
                          </>
                        ) : (
                          <strong>Anda</strong>
                        )}
                      </div>
                      <div className="message-content">
                        <Answer text={m.content} />
                      </div>
                      {!!m.sources?.length && (
                        <div className="message-sources">
                          <button
                            onClick={() => {
                              setSources(m.sources ?? []);
                              setPanel("sources");
                            }}
                          >
                            <Book /> Periksa {m.sources.length} sumber <Arrow />
                          </button>
                          {m.sources.some((s) => s.id.startsWith("demo-")) && (
                            <small>
                              Contoh presentasi · perlu validasi PNM
                            </small>
                          )}
                        </div>
                      )}
                      {m.role === "assistant" && (
                        <div className="feedback">
                          <span>Apakah membantu?</span>
                          <button
                            aria-pressed={m.feedback === "yes"}
                            onClick={() => vote(m.id, "yes")}
                          >
                            Membantu
                          </button>
                          <button
                            aria-pressed={m.feedback === "no"}
                            onClick={() => vote(m.id, "no")}
                          >
                            Belum
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </section>
              )}
              {busy && (
                <div className="processing" role="status">
                  <Avatar />
                  <span>
                    Menyiapkan jawaban dari rujukan yang tersedia
                    <span className="loading-dots">…</span>
                  </span>
                </div>
              )}
              {error && (
                <div className="chat-error" role="alert">
                  <p>{error}</p>
                  {retry && (
                    <button
                      className="button outline"
                      onClick={() => void send(retry.message, retry)}
                      disabled={busy || !online}
                    >
                      Coba lagi <Arrow />
                    </button>
                  )}
                </div>
              )}
              <div ref={end} />
            </div>
          </div>
          <div className="composer-area">
            {notice && (
              <p className="session-notice" role="status">
                {notice}
                <button
                  aria-label="Tutup pemberitahuan"
                  onClick={() => setNotice("")}
                >
                  ×
                </button>
              </p>
            )}
            {!online && (
              <p className="offline" role="status">
                Koneksi terputus. Draf tetap ada di kolom pesan.
              </p>
            )}
            <form
              className="composer"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <label className="sr-only" htmlFor="message">
                Pesan untuk AI.PNM
              </label>
              <textarea
                id="message"
                ref={input}
                placeholder="Tanyakan tentang PNM atau jelaskan kendala…"
                value={draft}
                maxLength={1200}
                rows={2}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    void send();
                  }
                }}
              />
              <button
                className="send-button"
                aria-label="Kirim pesan"
                disabled={busy || !draft.trim() || !online}
              >
                <Arrow />
              </button>
              <span className="char-count">{draft.length}/1.200</span>
            </form>
            <p className="composer-note">
              Periksa rujukan sebelum bertindak.{" "}
              <button onClick={() => setPanel("help")}>
                Butuh bantuan lanjutan?
              </button>
            </p>
          </div>
        </main>
      </div>
      <dialog
        ref={dialog}
        className="detail-dialog"
        onCancel={() => setPanel(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setPanel(null);
        }}
        aria-labelledby="panel-title"
      >
        <div className="dialog-top">
          <p className="eyebrow">AI.PNM · REFERENSI & BANTUAN</p>
          <button aria-label="Tutup panel" onClick={() => setPanel(null)}>
            ×
          </button>
        </div>
        <h2 id="panel-title">
          {panel === "sources"
            ? "Periksa rujukannya"
            : panel === "guides"
              ? "Topik yang bisa dicoba"
              : "Bantuan lanjutan"}
        </h2>
        {panel === "sources" &&
          sources.map((s) => (
            <article className="source-article" key={s.id}>
              <span className="source-status">{s.status}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <small>
                Ditinjau untuk demo: {s.updated} · ID {s.id}
              </small>
              {s.url && (
                <a
                  className="text-link"
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Buka sumber resmi ↗
                </a>
              )}
            </article>
          ))}
        {panel === "guides" && (
          <div className="guide-list">
            {articles.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setDraft(
                    a.id === "demo-gps"
                      ? examples[2]
                      : a.id === "demo-otp"
                        ? examples[3]
                        : `Jelaskan ${a.title}`,
                  );
                  setPanel(null);
                  input.current?.focus();
                }}
              >
                <span>
                  <strong>{a.title}</strong>
                  <small>{a.status}</small>
                </span>
                <Arrow />
              </button>
            ))}
          </div>
        )}
        {panel === "help" && (
          <div className="help-content">
            <p>
              Jika sumber belum cukup, tuliskan menu, pesan error, versi
              aplikasi, dan langkah yang sudah dicoba. Jangan menyertakan
              identitas nasabah atau rahasia akun.
            </p>
            <div className="draft-box">
              <strong>Draf eskalasi · belum dikirim</strong>
              <p>
                Ringkasan akan berisi hingga tiga pertanyaan terakhir dan kolom
                konteks teknis yang dapat Anda lengkapi. Tidak ada tiket yang
                dibuat oleh demo.
              </p>
              <button
                className="button primary"
                onClick={() => void copyDraft()}
              >
                Salin draf ringkasan
              </button>
            </div>
            <a
              className="text-link"
              href="https://www.pnm.co.id/"
              target="_blank"
              rel="noreferrer"
            >
              Kunjungi situs resmi PNM ↗
            </a>
            <p className="quiet">
              Riwayat disimpan pada tab browser ini dan dihapus saat keluar.{" "}
              <Link href="/privasi">Baca privasi</Link>.
            </p>
          </div>
        )}
      </dialog>
    </div>
  );
}
