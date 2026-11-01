import { afterEach, expect, it, vi } from "vitest";
import { generateAnswer } from "./mistral";
import { articles } from "./knowledge";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
it("adds the review date of referenced public sources even when the model omits it", async () => {
  vi.stubEnv("MISTRAL_API_KEY", "test-key");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      Response.json({
        choices: [
          {
            message: {
              content: JSON.stringify({
                answer: "Direktur Utama PNM adalah Kindaris.",
                sourceIds: ["leadership"],
              }),
            },
          },
        ],
      }),
    ),
  );
  const docs = articles.filter((a) => ["leadership", "mekaar"].includes(a.id));
  const result = await generateAnswer("Siapa direktur utama PNM?", docs, []);
  expect(result.answer).toContain("2026-11-01");
  expect(result.answer).not.toContain("2026-10-29");
  expect(result.curated).toBe(false);
});
it("rejects additional procedural claims for an unapproved FAQ even with a valid source ID", async () => {
  vi.stubEnv("MISTRAL_API_KEY", "test-key");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      Response.json({
        choices: [
          {
            message: {
              content: JSON.stringify({
                answer: "Instal ulang dan ubah pengaturan lokasi.",
                sourceIds: ["demo-gps"],
              }),
            },
          },
        ],
      }),
    ),
  );
  await expect(
    generateAnswer(
      "GPS tidak terdeteksi",
      [articles.find((d) => d.id === "demo-gps")!],
      [],
    ),
  ).rejects.toMatchObject({ status: 502 });
});
it("adds the review status on the server and limits FAQ output to curated text", async () => {
  vi.stubEnv("MISTRAL_API_KEY", "test-key");
  const doc = articles.find((d) => d.id === "demo-gps")!;
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      Response.json({
        choices: [
          {
            message: {
              content: JSON.stringify({
                answer: doc.text,
                sourceIds: [doc.id],
              }),
            },
          },
        ],
      }),
    ),
  );
  const result = await generateAnswer("GPS tidak terdeteksi", [doc], []);
  expect(result.answer).toBe(
    "Ini contoh presentasi, belum menjadi panduan operasional yang disahkan PNM.\n\n" +
      doc.text,
  );
});
