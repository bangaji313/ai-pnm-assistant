// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
const fixtures = vi.hoisted(() => ({
  fetch: vi.fn(),
  router: { replace: vi.fn(), push: vi.fn() },
}));
vi.mock("next/navigation", () => ({
  useRouter: () => fixtures.router,
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (_auth: unknown, callback: (u: unknown) => void) => {
    callback({
      uid: "qa-visitor",
      isAnonymous: true,
      getIdToken: async () => "test-token",
    });
    return () => {};
  },
  signOut: vi.fn(),
}));
vi.mock("@/lib/firebase-client", () => ({ firebaseAuth: () => ({}) }));
import { Chat } from "./chat";
let root: Root;
let host: HTMLDivElement;
beforeEach(async () => {
  vi.clearAllMocks();
  sessionStorage.clear();
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.stubGlobal("fetch", fixtures.fetch);
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({
      matches: true,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
  HTMLElement.prototype.scrollIntoView = () => {};
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  fixtures.fetch.mockResolvedValue(
    Response.json({
      answer: "Contoh GPS perlu validasi.",
      sources: [],
      engine: "mistral",
    }),
  );
  await act(async () => root.render(<Chat />));
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});
async function click(element: Element | null) {
  expect(element).not.toBeNull();
  await act(async () => (element as HTMLElement).click());
}
async function firstQuestion() {
  await click(host.querySelectorAll(".question-option")[2]);
}
it("retries the identical grounded request rather than adding the failed question to context", async () => {
  await firstQuestion();
  const textarea = host.querySelector("textarea")!;
  const setter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    "value",
  )!.set!;
  await act(async () => {
    setter.call(textarea, "Kalau masih gagal?");
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  });
  fixtures.fetch.mockResolvedValueOnce(
    Response.json(
      { error: "Mistral sedang membatasi permintaan." },
      { status: 429 },
    ),
  );
  await click(host.querySelector(".send-button"));
  expect(host.querySelector(".chat-error")).not.toBeNull();
  const original = JSON.parse(fixtures.fetch.mock.calls[1][1].body);
  await click(host.querySelector(".chat-error button"));
  const retried = JSON.parse(fixtures.fetch.mock.calls[2][1].body);
  expect(retried).toEqual(original);
});
it("provides a persistent live announcement for completed answers", async () => {
  const live = host.querySelector('[aria-live="polite"]');
  expect(live).not.toBeNull();
  await firstQuestion();
  expect(live?.textContent).toContain("Contoh GPS perlu validasi.");
});
it("returns keyboard focus to the composer after selecting mobile history", async () => {
  await firstQuestion();
  await click(host.querySelector(".menu-toggle"));
  const history = host.querySelector(".history-item") as HTMLButtonElement;
  history.focus();
  await click(history);
  expect(document.activeElement).toBe(host.querySelector("textarea"));
});
