import { describe, expect, it } from "vitest";
import { articles } from "./knowledge";
import { assess, retrieve } from "./policy";

describe("expanded public PNM knowledge", () => {
  it.each([
    ["Siapa direktur utama PNM sekarang?", "leadership"],
    ["Dirutnya PNM siapa?", "leadership"],
    ["Siapa CEO PNM?", "leadership"],
    ["Siapa Pak Kindaris?", "leadership"],
    ["Siapa wakil direktur utama PNM?", "leadership"],
    ["Siapa direktur digital PNM?", "leadership"],
    ["Siapa direktur keuangan PNM?", "leadership"],
    ["Siapa direktur operasional dan hubungan kelembagaan PNM?", "leadership"],
    ["Siapa direktur bisnis dan SDM PNM?", "leadership"],
    ["Siapa direktur digital dan teknologi informasi PNM?", "leadership"],
    ["Siapa komisaris utama PNM?", "commissioners"],
    ["Siapa pendiri PNM?", "company"],
    ["Bagaimana sejarah PNM?", "company"],
    ["Apa saja anak perusahaan PNM?", "pnm-group"],
    ["Apa itu PT Mitra Tekno Madani?", "pnm-group"],
    ["Apa itu PNM IM?", "pnm-group"],
    ["Apa itu PNM VC?", "pnm-group"],
    ["Divisi apa saja di PNM?", "organization"],
    ["Apa hubungan PNM dengan BRI dan Pegadaian?", "umi-holding"],
    ["Ada program baru apa untuk AO?", "ao-programs"],
    ["Bagaimana beasiswa kuliah S1 untuk AO Mekaar?", "ao-programs"],
    ["Apa benefit karyawan PNM?", "ao-programs"],
    ["Apa itu PNM Excellence Awards?", "employee-awards"],
    ["Apa manfaat untuk nasabah PNM?", "customer-benefits"],
    ["Beasiswa untuk anak nasabah Mekaar itu apa?", "customer-scholarships"],
    ["Apa itu Ruang Pintar PNM?", "education-programs"],
    ["Apa itu PKU PNM?", "business-development"],
    ["Apa itu Mba Maya?", "customer-training"],
    ["Apa itu Mekaarpreneur?", "customer-training"],
    ["Apa itu Mpok Rena?", "customer-retention"],
    ["Reward wisata religi untuk nasabah PNM apa?", "customer-rewards"],
    ["Apa manfaat PNM Digi Nasabah di aplikasi?", "customer-digital"],
    ["Apa itu Madani Sanitasi?", "sanitation-programs"],
  ])("finds the relevant source for %s", (query, id) => {
    expect(assess(query).kind).toBe("search");
    expect(retrieve(query)[0]?.id).toBe(id);
  });

  it("keeps employee and customer scholarships separate", () => {
    expect(
      retrieve("Beasiswa kuliah untuk karyawan AO").every(
        (d) => d.audience !== "customer",
      ),
    ).toBe(true);
    expect(
      retrieve("Beasiswa anak nasabah PNM").every(
        (d) => d.audience !== "employee",
      ),
    ).toBe(true);
    const comparison = retrieve(
      "Apa beda beasiswa AO dan beasiswa anak nasabah?",
    );
    expect(comparison.map((d) => d.id)).toEqual(
      expect.arrayContaining(["ao-programs", "customer-scholarships"]),
    );
  });

  it("does not let an application keyword force public program answers into FAQ mode", () => {
    expect(
      retrieve("Apa manfaat PNM Digi Nasabah di aplikasi?").every(
        (d) => !d.id.startsWith("demo-"),
      ),
    ).toBe(true);
    expect(retrieve("Long Lat UK tidak terdeteksi GPS")[0]?.id).toBe(
      "demo-gps",
    );
  });

  it.each([
    "Siapa CEO Tesla? Saya karyawan PNM.",
    "Siapa direktur utama BRI?",
    "Bagaimana aturan cuti pegawai PNM?",
    "Berapa gaji direktur PNM?",
    "Bagaimana beasiswa LPDP untuk kuliah di luar negeri?",
  ])("does not invent unsupported facts for %s", (query) => {
    expect(retrieve(query)).toEqual([]);
  });

  it("keeps the existing financial action boundary", () => {
    expect(assess("Tolong transfer dana beasiswa ke rekening saya").kind).toBe(
      "restricted",
    );
    expect(assess("PNM buat kode Python untuk game").kind).toBe("outside");
  });

  it("gives new public sources a review date and an official URL", () => {
    const additions = articles.filter((a) => a.updated === "2026-11-01");
    expect(additions.length).toBeGreaterThanOrEqual(15);
    for (const article of additions) {
      expect(article.status).toBe("Sumber publik PNM");
      expect(new URL(article.url!).hostname.replace(/^www\./, "")).toBe(
        "pnm.co.id",
      );
      expect(article.text.length).toBeGreaterThan(80);
    }
    expect(new Set(articles.map((a) => a.id)).size).toBe(articles.length);
  });
});
