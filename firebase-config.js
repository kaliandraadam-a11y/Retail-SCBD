import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// GANTI BAGIAN INI dengan data dari Firebase Console Anda
const firebaseConfig = {
  apiKey: "AIzaSy...", 
  authDomain: "proyek-anda.firebaseapp.com",
  projectId: "proyek-anda",
  storageBucket: "proyek-anda.appspot.com",
  messagingSenderId: "123456...",
  appId: "1:123456..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
