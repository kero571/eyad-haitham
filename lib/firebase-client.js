'use client';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, inMemoryPersistence } from 'firebase/auth';

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// in-memory: مفيش توكن بيتخزن في المتصفح (IndexedDB/localStorage)
export function clientAuth() {
  const app = getApps()[0] ?? initializeApp(cfg);
  try {
    return initializeAuth(app, { persistence: inMemoryPersistence });
  } catch {
    return getAuth(app); // already initialized (HMR)
  }
}
