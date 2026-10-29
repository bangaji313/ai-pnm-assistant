import { expect, it } from "vitest";
import { generateAnswer } from "./mistral";
import { retrieve } from "./policy";
if (process.env.RUN_LIVE_MISTRAL === "1") process.loadEnvFile(".env.local");
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
