import Link from "next/link";
export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      className={`brand ${dark ? "brand-ink" : ""}`}
      href="/"
      aria-label="AI.PNM beranda"
    >
      <img
        src="/brand/ai-pnm-logo.png"
        alt="AI.PNM — Permodalan Nasional Madani"
        width="174"
        height="87"
      />
    </Link>
  );
}
export function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d={back ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6"} />
    </svg>
  );
}
export function Book() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15" />
    </svg>
  );
}
export function Avatar({ large = false }: { large?: boolean }) {
  return (
    <span className={`avatar ${large ? "avatar-large" : ""}`}>
      <img src="/brand/ao-pnm.png" alt="" width="48" height="72" />
    </span>
  );
}
