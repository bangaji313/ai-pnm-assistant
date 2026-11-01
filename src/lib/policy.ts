import { articles } from "./knowledge";

export function redact(input: string): string {
  return input
    .replace(
      /\b(?:password|passwd|kata\s*sandi|api[_ -]?key|token)\s+(?:saya(?:\s+adalah)?|adalah|is)\s+[^\s,;]+/gi,
      "[RAHASIA DIHAPUS]",
    )
    .replace(
      /\b(?:password|passwd|kata\s*sandi|api[_ -]?key|token)\s*(?:saya|adalah)?\s*[:=]\s*[^\s,;]+/gi,
      "[RAHASIA DIHAPUS]",
    )
    .replace(
      /\b(?:otp|pin|password|kata\s*sandi)\s*(?:saya|adalah)?\s*[:=]?\s*(?=[^\s,;]*\d)[\w@!#$%&*.+\/-]{4,}/gi,
      "[RAHASIA DIHAPUS]",
    )
    .replace(/\b\d{6,}\b/g, "[ANGKA SENSITIF DIHAPUS]")
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, "[EMAIL DIHAPUS]")
    .replace(/mstrl_[\w-]+/g, "[KEY DIHAPUS]");
}

export function assess(input: string): {
  kind: "outside" | "restricted" | "clarify" | "search" | "greeting";
  answer?: string;
} {
  const q = input.toLowerCase();
  if (
    /abaikan.*aturan|system\s*prompt|instruksi\s*(sistem|internal)|ignore.*(instruction|previous)|jailbreak|buat.*(kode|puisi|game)|rekomendasi.*laptop|resep\s|sepak\s*bola|politik|bitcoin/.test(
      q,
    )
  )
    return {
      kind: "outside",
      answer:
        "Saya membantu informasi PNM dan contoh kendala aplikasi yang tersedia. Silakan tanyakan profil atau pengurus PNM, program AO dan nasabah, Mekaar, ULaMM, GPS, atau OTP.",
    };
  if (
    /transfer|reversal|rollback|hapus\s*data|plafon.*(lolos|naik)|bypass|password\s*vpn|saldo|dana.*masuk|status.*(nasabah|transaksi|pencairan)|ludin|dukcapil|\bnik\b|\bktp\b|rekening|angsuran|suku\s*bunga/.test(
      q,
    )
  )
    return {
      kind: "restricted",
      answer:
        "Demo ini tidak terhubung ke data nasabah atau transaksi dan tidak menyediakan tindakan finansial maupun akses internal. Gunakan sistem serta petugas resmi sesuai kewenangan. Saya bisa membantu menyiapkan draf ringkasan kendala tanpa data pribadi.",
    };
  if (
    /^(halo|hai|hi|pagi|siang|sore|malam|terima kasih|makasih)[!.\s]*$/i.test(q)
  )
    return {
      kind: "greeting",
      answer:
        "Halo! Saya AI.PNM. Ingin mengenal pengurus dan grup PNM, program beasiswa AO atau nasabah, atau mencoba contoh kendala GPS dan OTP?",
    };
  if (
    /error|gagal|tidak bisa|nggak bisa|kendala/.test(q) &&
    !/(gps|long\s*lat|otp|pin|sms|mekaar|ulamm|json|unexpected|eof|expired|nan)/.test(
      q,
    )
  )
    return {
      kind: "clarify",
      answer:
        "Kendala muncul di menu apa, dan apa pesan error-nya? Sebutkan juga versi aplikasi bila diketahui. Cukup tuliskan konteks teknis tanpa identitas nasabah, password, atau OTP.",
    };
  return { kind: "search" };
}

export function retrieve(query: string) {
  const tokens: string[] = query.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const normalized = ` ${tokens.join(" ")} `;
  const employee = /\b(ao|karyawan|pegawai)\b|account officer/.test(normalized);
  const customer = /\bnasabah\b/.test(normalized);
  const audience =
    employee === customer ? null : employee ? "employee" : "customer";
  const anchored = /\b(pnm|mekaar|ulamm|ao|nasabah|karyawan|pegawai)\b/.test(
    normalized,
  );
  const generic = new Set([
    "beasiswa",
    "kuliah",
    "sarjana",
    "s1",
    "program baru",
    "komisaris",
    "divisi",
    "bri",
    "pegadaian",
    "sanitasi",
    "webinar",
  ]);
  const companyIntent =
    /\bpnm\b/i.test(query) &&
    /apa\s*itu\s*pnm|mengenal\s*pnm|kepanjangan\s*pnm|profil\s*pnm|sejarah\s*pnm/i.test(
      query,
    ) &&
    !/(mekaar|ulamm|gps|otp|aplikasi)/i.test(query);
  if (/cuti|gaji|hrd|rekrutmen|lowongan|cuaca/.test(query.toLowerCase()))
    return [];
  const ranked = articles
    .filter((doc) => !audience || !doc.audience || doc.audience === audience)
    .map((doc) => ({
      doc,
      score:
        (doc.id === "company" && companyIntent ? 1 : 0) +
        doc.keywords.reduce((n, k) => {
          if (!anchored && generic.has(k)) return n;
          const phrase = k
            .toLowerCase()
            .match(/[a-z0-9]+/g)
            ?.join(" ");
          return (
            n +
            (phrase && normalized.includes(` ${phrase} `)
              ? k === "pnm"
                ? 0.3
                : phrase.includes(" ")
                  ? 3
                  : 1
              : 0)
          );
        }, 0),
    }))
    .filter((x) => x.score >= 1)
    .sort((a, b) => b.score - a.score);
  const faq = ranked[0]?.doc.id.startsWith("demo-");
  return ranked
    .filter((x) => x.doc.id.startsWith("demo-") === faq)
    .slice(0, 2)
    .map((x) => x.doc);
}

export function validateAnswer(value: unknown, allowedIds: string[]) {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (
    typeof v.answer !== "string" ||
    v.answer.length < 4 ||
    v.answer.length > 3500 ||
    /https?:|www\.|mstrl_|\b\d{10,}\b/i.test(v.answer)
  )
    return null;
  if (
    !Array.isArray(v.sourceIds) ||
    !v.sourceIds.length ||
    v.sourceIds.some((id) => typeof id !== "string" || !allowedIds.includes(id))
  )
    return null;
  return { answer: redact(v.answer), sourceIds: v.sourceIds as string[] };
}
