import { expect, it } from "vitest";
import { generateAnswer } from "./mistral";
import { retrieve } from "./policy";
if (process.env.RUN_LIVE_MISTRAL === "1") process.loadEnvFile(".env.local");

it.skipIf(process.env.RUN_LIVE_MISTRAL !== "1").each([
  ["Siapa direktur utama PNM sekarang?", "leadership", /kindaris/i],
  [
    "Ada program baru apa untuk AO, termasuk beasiswa kuliah?",
    "ao-programs",
    /beasiswa/i,
  ],
  [
    "Apa beasiswa untuk anak nasabah PNM? Apakah otomatis lolos?",
    "customer-scholarships",
    /anak nasabah/i,
  ],
  ["Apa itu Mpok Rena PNM?", "customer-retention", /mpok rena/i],
])(
  "answers the researched public question: %s",
  async (query, id, expected) => {
    const result = await generateAnswer(query, retrieve(query), []);
    expect(result.curated).toBe(false);
    expect(result.sourceIds).toContain(id);
    expect(result.answer).toMatch(expected);
    if (id === "leadership") expect(result.answer).toMatch(/2026/);
    if (id === "ao-programs")
      expect(result.answer).toMatch(/resmi|tidak|belum|bukan/i);
    if (id === "customer-scholarships")
      expect(result.answer).toMatch(/tidak|bukan|seleksi|ketentuan/i);
  },
  30000,
);
it.skipIf(process.env.RUN_LIVE_MISTRAL !== "1")(
  "generates a real grounded answer without exposing credentials",
  async () => {
    const answer = await generateAnswer(
      "Apa itu PNM Mekaar?",
      retrieve("Apa itu PNM Mekaar?"),
      [],
    );
    expect(answer.answer.length).toBeGreaterThan(20);
    expect(answer.sourceIds).toContain("mekaar");
    expect(answer.answer).not.toContain("mstrl_");
  },
  30000,
);
it.skipIf(process.env.RUN_LIVE_MISTRAL !== "1")(
  "keeps live FAQ output inside curated text",
  async () => {
    const docs = retrieve("Long Lat UK tidak terdeteksi GPS");
    const answer = await generateAnswer(
      "Long Lat UK tidak terdeteksi GPS",
      docs,
      [],
    );
    expect(answer.curated).toBe(true);
    expect(answer.answer).toBe(
      "Ini contoh presentasi, belum menjadi panduan operasional yang disahkan PNM.\n\n" +
        docs[0].text,
    );
  },
  30000,
);
