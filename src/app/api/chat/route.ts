import { NextResponse } from "next/server";
import { verifiedUser } from "@/lib/firebase-server";
import { consumeQuota } from "@/lib/quota";
import { assess, redact, retrieve } from "@/lib/policy";
import { generateAnswer, ProviderError } from "@/lib/mistral";
export const runtime = "nodejs";
export const maxDuration = 30;
const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  let origin: URL;
  try {
    origin = new URL(req.headers.get("origin") ?? "");
  } catch {
    return json({ error: "Permintaan tidak diizinkan." }, 403);
  }
  const host = req.headers.get("host") ?? new URL(req.url).host;
  if (
    origin.host !== host ||
    (origin.protocol !== "https:" &&
      !(process.env.NODE_ENV !== "production" && origin.protocol === "http:"))
  )
    return json({ error: "Permintaan tidak diizinkan." }, 403);
  const user = await verifiedUser(req);
  if (!user)
    return json({ error: "Sesi berakhir. Silakan masuk kembali." }, 401);
  if (Number(req.headers.get("content-length")) > 16000)
    return json({ error: "Pesan terlalu panjang." }, 413);
  let body;
  try {
    const raw = await req.text();
    if (raw.length > 16000)
      return json({ error: "Pesan terlalu panjang." }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Format pesan tidak valid." }, 400);
  }
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    typeof body.message !== "string" ||
    !body.message.trim() ||
    body.message.length > 1200
  )
    return json({ error: "Tulis pesan sepanjang 1–1.200 karakter." }, 400);
  const query = redact(body.message.trim());
  const history: { role: "user" | "assistant"; content: string }[] =
    Array.isArray(body.history)
      ? body.history
          .filter(
            (m: unknown) =>
              m &&
              typeof m === "object" &&
              ["user", "assistant"].includes((m as { role: string }).role) &&
              typeof (m as { content: unknown }).content === "string",
          )
          .slice(-6)
          .map((m: { role: "user" | "assistant"; content: string }) => ({
            role: m.role,
            content: redact(m.content.slice(0, 1200)),
          }))
      : [];
  let decision = assess(query);
  let retrievalQuery = query;
  const previous = history.findLast((m) => m.role === "user")?.content;
  if (
    previous &&
    ["search", "clarify"].includes(decision.kind) &&
    /^(kalau|bagaimana|lalu|tetap|masih|sudah|setelah|yang tadi)\b/i.test(
      query,
    ) &&
    retrieve(previous).length
  ) {
    retrievalQuery = `${previous}\n${query}`;
    if (decision.kind === "clarify") decision = { kind: "search" };
  }
  if (decision.kind !== "search")
    return json({
      answer: decision.answer,
      kind: decision.kind,
      sources: [],
      engine: "policy",
    });
  const docs = retrieve(retrievalQuery);
  if (!docs.length)
    return json({
      answer:
        "Saya belum memiliki sumber publik yang cukup untuk menjawab pertanyaan ini. Jelaskan topik PNM yang ingin diketahui, atau gunakan kanal resmi untuk panduan internal. Saya dapat membantu menyusun draf kendala.",
      kind: "unavailable",
      sources: [],
      engine: "policy",
    });
  try {
    const ip =
      req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
      "local";
    if (!(await consumeQuota(user.uid, ip)))
      return json(
        {
          error:
            "Batas penggunaan demo tercapai. Coba lagi nanti atau lanjutkan dengan contoh presentasi.",
          code: "QUOTA",
        },
        429,
      );
    const result = await generateAnswer(query, docs, history);
    return json({
      ...result,
      kind: "answer",
      engine: "mistral",
      sources: docs.filter((d) => result.sourceIds.includes(d.id)),
    });
  } catch (error) {
    if (error instanceof ProviderError && error.status === 429)
      return json(
        {
          error:
            "Mistral sedang membatasi permintaan. Pesan Anda tetap ada; coba lagi sebentar lagi.",
          code: "PROVIDER_LIMIT",
        },
        429,
      );
    return json(
      {
        error:
          "Layanan AI belum tersedia. Pesan Anda tetap ada; silakan coba lagi. Tidak ada jawaban pengganti yang dibuat-buat.",
        code: "UNAVAILABLE",
      },
      503,
    );
  }
}
