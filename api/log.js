import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {

  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "unknown";

  const userAgent =
    req.headers["user-agent"] || "unknown";

  const country =
    req.headers["x-vercel-ip-country"] || "unknown";

  const city =
    req.headers["x-vercel-ip-city"] || "unknown";

  try {

    await addDoc(collection(db, "logs"), {
      ip,
      userAgent,
      country,
      city,
      createdAt: Date.now()
    });

    res.status(200).json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "firestore error"
    });
  }
}