import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

export function checkAuthentication() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Redirect to login page if not authenticated
      if (!window.location.href.includes("login.html")) {
        window.location.href = "../login.html";
      }
    } else {
      // Allow authenticated users to proceed
      if (!user.emailVerified) {
        // Redirect to email verification page if email is not verified
        window.location.href = "../verify-email.html";
      } else {
        console.log("User is authenticated:", user.email);
      }
    }
  });
}

export function isLoggedIn() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve({ loggedIn: true, emailVerified: user.emailVerified });
      } else {
        resolve({ loggedIn: false, emailVerified: false });
      }
    });
  });
}
