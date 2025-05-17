import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

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

// Ensure session persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Failed to set persistence:", error);
});

export function checkAuthentication() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Redirect to login page if not authenticated
      if (!window.location.href.includes("login.html")) {
        window.location.href = "../login.html";
      }
    } else {
      // Allow authenticated users to proceed
      console.log("User is authenticated:", user.email);
    }
  });
}

export { app, auth };
