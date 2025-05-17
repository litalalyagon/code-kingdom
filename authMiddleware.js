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
      console.log("User is authenticated:", user.email);
    }
  });
}
