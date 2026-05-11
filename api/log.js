const admin = require("firebase-admin");

if (!admin.apps.length) {

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });

}

const db = admin.firestore();

module.exports = async (req, res) => {

  try {

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

    await db.collection("logs").add({
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
      error: err.message
    });

  }

};