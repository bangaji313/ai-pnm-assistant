"use client";
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export function firebaseAuth() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  if (!config.apiKey || !config.projectId)
    throw new Error("FIREBASE_NOT_CONFIGURED");
  return getAuth(getApps()[0] ?? initializeApp(config));
}
