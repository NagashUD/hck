import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc
} from "firebase/firestore";

const firebaseConfig = {
apiKey: "AIzaSyAGrWJoZ7o_QoS1gZgFmYXVW7mLrjtfkH0",

  authDomain: "idborder.firebaseapp.com",

  projectId: "idborder",

  storageBucket: "idborder.firebasestorage.app",

  messagingSenderId: "23032475884",

  appId: "1:23032475884:web:c9141c162d2f0d551cf5c9"
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