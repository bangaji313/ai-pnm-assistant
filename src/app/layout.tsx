import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "AI.PNM — Teman menemukan jawaban",
    template: "%s | AI.PNM",
  },
  description:
    "Demo asisten PNM untuk mengenal perusahaan dan mencoba percakapan bersumber. Konsep presentasi independen, bukan layanan resmi PNM.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <a className="skip" href="#main">
          Lewati ke isi
        </a>
        {children}
      </body>
    </html>
  );
}
