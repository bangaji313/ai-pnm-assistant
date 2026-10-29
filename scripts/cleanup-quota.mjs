import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
process.loadEnvFile(".env.local");
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (
  !projectId ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
)
  throw new Error("Server environment is incomplete");
initializeApp({
  credential: cert({
    projectId,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore();
const expired = await db
  .collection("quota")
  .where("expiresAt", "<", Timestamp.now())
  .limit(400)
  .get();
const batch = db.batch();
expired.docs.forEach((doc) => batch.delete(doc.ref));
await batch.commit();
console.log(
  `Removed ${expired.size} expired quota records from ${projectId}; active records unchanged.`,
);
