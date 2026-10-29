import { articles } from "./knowledge";

export function redact(input: string): string {
  return input
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
        "Saya membantu informasi PNM dan contoh kendala aplikasi yang tersedia. Silakan tanyakan tentang PNM, Mekaar, ULaMM, GPS, atau OTP.",
    };
  if (
    /transfer|reversal|rollback|hapus\s*data|plafon.*(lolos|naik)|bypass|password\s*vpn|saldo|dana.*masuk|status.*(nasabah|transaksi|pencairan)|ludin|dukcapil|nik|ktp|rekening|angsuran|suku\s*bunga/.test(
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
        "Halo! Saya AI.PNM. Ingin mengenal PNM atau mencoba contoh kendala GPS dan OTP?",
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
  const companyIntent =
    /\bpnm\b/i.test(query) &&
    /apa\s*itu|mengenal|jelaskan|kepanjangan|profil/i.test(query) &&
    !/(mekaar|ulamm|gps|otp|aplikasi)/i.test(query);
  if (
    /cuti|gaji|hrd|rekrutmen|direktur|ceo|pemimpin|lowongan|cuaca/.test(
      query.toLowerCase(),
    )
  )
    return [];
  return articles
    .map((doc) => ({
      doc,
      score:
        (doc.id === "company" && companyIntent ? 1 : 0) +
        doc.keywords.reduce(
          (n, k) => n + (tokens.includes(k) ? (k === "pnm" ? 0.3 : 1) : 0),
          0,
        ),
    }))
    .filter((x) => x.score >= 1)
    .sort((a, b) => b.score - a.score)
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
