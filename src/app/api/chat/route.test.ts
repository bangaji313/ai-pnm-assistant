import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  verify: vi.fn(),
  quota: vi.fn(),
  generate: vi.fn(),
}));
vi.mock("@/lib/firebase-server", () => ({ verifiedUser: mocks.verify }));
vi.mock("@/lib/quota", () => ({ consumeQuota: mocks.quota }));
vi.mock("@/lib/mistral", async () => {
  const original =
    await vi.importActual<typeof import("@/lib/mistral")>("@/lib/mistral");
  return { ...original, generateAnswer: mocks.generate };
});
import { POST } from "./route";
import { ProviderError } from "@/lib/mistral";
function request(body: unknown, origin = "https://demo.example") {
  return new Request("https://demo.example/api/chat", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
describe("chat server boundary", () => {
  it("rejects JSON null instead of crashing", async () => {
    expect((await POST(request(null))).status).toBe(400);
  });
  it("uses the latest relevant user context for a short follow-up", async () => {
    await POST(
      request({
        message: "Kalau masih gagal?",
        history: [
          { role: "user", content: "Long Lat UK tidak terdeteksi GPS" },
          { role: "assistant", content: "Contoh belum disahkan." },
        ],
      }),
    );
    expect(mocks.generate.mock.calls[0]?.[1]?.[0]?.id).toBe("demo-gps");
  });
  it("accepts a same-origin browser behind an internal upstream hostname", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        origin: "http://127.0.0.1:3000",
        host: "127.0.0.1:3000",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Halo" }),
    });
    expect((await POST(req)).status).toBe(200);
  });
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verify.mockResolvedValue({ uid: "visitor-a" });
    mocks.quota.mockResolvedValue(true);
    mocks.generate.mockResolvedValue({
      answer: "PNM berdiri pada 1 Juni 1999.",
      sourceIds: ["company"],
    });
  });
  it("blocks cross-origin requests before authentication", async () => {
    expect(
      (await POST(request({ message: "PNM" }, "https://evil.example"))).status,
    ).toBe(403);
    expect(mocks.verify).not.toHaveBeenCalled();
  });
  it("requires a verified Firebase identity", async () => {
    mocks.verify.mockResolvedValue(null);
    expect((await POST(request({ message: "PNM" }))).status).toBe(401);
    expect(mocks.generate).not.toHaveBeenCalled();
  });
  it("rejects oversize user messages", async () => {
    expect((await POST(request({ message: "a".repeat(1201) }))).status).toBe(
      400,
    );
  });
  it("handles scope refusal without consuming provider quota", async () => {
    const result = await POST(
      request({ message: "PNM buat kode Python game" }),
    );
    expect((await result.json()).engine).toBe("policy");
    expect(mocks.quota).not.toHaveBeenCalled();
    expect(mocks.generate).not.toHaveBeenCalled();
  });
  it("returns no-answer when public evidence is insufficient", async () => {
    const result = await POST(request({ message: "Aturan cuti PNM?" }));
    expect((await result.json()).kind).toBe("unavailable");
    expect(mocks.generate).not.toHaveBeenCalled();
  });
  it("enforces budget before provider call", async () => {
    mocks.quota.mockResolvedValue(false);
    expect((await POST(request({ message: "Sejarah PNM" }))).status).toBe(429);
    expect(mocks.generate).not.toHaveBeenCalled();
  });
  it("fails closed if persistent budget store is unavailable", async () => {
    mocks.quota.mockRejectedValue(new Error("offline"));
    expect((await POST(request({ message: "Sejarah PNM" }))).status).toBe(503);
    expect(mocks.generate).not.toHaveBeenCalled();
  });
  it("forwards only sanitized bounded history", async () => {
    await POST(
      request({
        message: "Sejarah PNM",
        history: Array.from({ length: 12 }, () => ({
          role: "user",
          content: "OTP saya 123456",
        })),
      }),
    );
    const args = mocks.generate.mock.calls[0];
    expect(args[2]).toHaveLength(6);
    expect(JSON.stringify(args)).not.toContain("123456");
  });
  it("does not fabricate a response on provider rate limits", async () => {
    mocks.generate.mockRejectedValue(new ProviderError(429));
    const result = await POST(request({ message: "Sejarah PNM" }));
    expect(result.status).toBe(429);
    expect((await result.json()).answer).toBeUndefined();
  });
  it("returns only referenced server-selected sources", async () => {
    const result = await POST(request({ message: "Sejarah PNM" }));
    const body = await result.json();
    expect(body.engine).toBe("mistral");
    expect(body.sources.map((s: { id: string }) => s.id)).toEqual(["company"]);
  });
});
