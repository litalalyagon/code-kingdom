import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDf_N4F-1mlh5_IxyLpEjqJ_8J5X8rb38Q",
  authDomain: "code-kingdom-a5310.firebaseapp.com",
  projectId: "code-kingdom-a5310",
  storageBucket: "code-kingdom-a5310.firebasestorage.app",
  messagingSenderId: "39839215522",
  appId: "1:39839215522:web:20bb7fc1ebc61ae8b10cfb",
  measurementId: "G-N0Y63EPX4T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
