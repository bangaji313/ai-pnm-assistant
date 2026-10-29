import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export function serverApp() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error("FIREBASE_NOT_CONFIGURED");
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  return (
    getApps()[0] ??
    initializeApp({
      projectId,
      ...(privateKey
        ? {
            credential: cert({
              projectId,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey,
            }),
          }
        : {}),
    })
  );
}

export async function verifiedUser(request: Request) {
  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer (.+)$/)?.[1];
  if (!token || token.length > 6000) return null;
  try {
    return await getAuth(serverApp()).verifyIdToken(token);
  } catch {
    return null;
  }
}

export function database() {
  if (!process.env.FIREBASE_PRIVATE_KEY)
    throw new Error("FIRESTORE_NOT_CONFIGURED");
  return getFirestore(serverApp());
}
