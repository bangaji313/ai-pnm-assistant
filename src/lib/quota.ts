import { createHash } from "node:crypto";
import { database } from "./firebase-server";

export function quotaKeys(uid: string, ip: string, now = Date.now()) {
  const hash = (s: string) =>
    createHash("sha256").update(s).digest("hex").slice(0, 32);
  return [
    { id: `user-${hash(uid)}-${Math.floor(now / 60000)}`, limit: 6 },
    { id: `ip-${hash(ip)}-${Math.floor(now / 3600000)}`, limit: 40 },
    { id: `global-${Math.floor(now / 86400000)}`, limit: 200 },
  ];
}

export async function consumeQuota(uid: string, ip: string) {
  const db = database();
  const keys = quotaKeys(uid, ip);
  return db.runTransaction(async (tx) => {
    const refs = keys.map((k) => db.collection("quota").doc(k.id));
    const docs = await tx.getAll(...refs);
    if (docs.some((doc, i) => (doc.data()?.count ?? 0) >= keys[i].limit))
      return false;
    docs.forEach((doc, i) =>
      tx.set(refs[i], {
        count: (doc.data()?.count ?? 0) + 1,
        expiresAt: new Date(Date.now() + 172800000),
      }),
    );
    return true;
  });
}
