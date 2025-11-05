import admin from "firebase-admin";
import fs from "fs";

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(fs.readFileSync("serviceAccount.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function getToken() {
  try {
    // Replace with a real user's UID from your Firebase project
    const uid = "USER_UID"; 
    const customToken = await admin.auth().createCustomToken(uid);
    console.log("Custom Token (paste this in next step):", customToken);
  } catch (error) {
    console.error(error);
  }
}

getToken();
