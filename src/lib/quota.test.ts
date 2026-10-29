import { expect, it, vi } from "vitest";
vi.mock("./firebase-server", () => ({ database: vi.fn() }));
import { quotaKeys } from "./quota";
it("separates visitors, hashes identifiers and shares a daily global budget", () => {
  const a = quotaKeys("alice", "192.0.2.1", 100000),
    b = quotaKeys("bob", "192.0.2.2", 100000);
  expect(a[0].id).not.toBe(b[0].id);
  expect(a[1].id).not.toBe(b[1].id);
  expect(a[2].id).toBe(b[2].id);
  expect(JSON.stringify(a)).not.toContain("alice");
  expect(JSON.stringify(a)).not.toContain("192.0.2.1");
  expect(a.map((k) => k.limit)).toEqual([6, 40, 200]);
});
