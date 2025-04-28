import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
  });
}

export const db = getFirestore();
