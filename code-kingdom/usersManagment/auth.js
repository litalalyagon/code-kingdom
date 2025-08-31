import { auth } from "../../firebase/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
