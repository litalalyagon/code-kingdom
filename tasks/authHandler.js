import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { app, checkAuthentication, auth } from "../authMiddleware.js";

document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();

  // Firebase-dependent code
  const loginStatus = document.getElementById("loginStatus");
  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      loginStatus.textContent = "התנתקת בהצלחה.";
      logoutBtn.style.display = "none";
      window.location.href = "../index.html"; // Redirect to home page
    } catch (error) {
      loginStatus.textContent = "שגיאה: " + error.message;
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginStatus.textContent = `מחובר כ: ${user.email}`;
      logoutBtn.style.display = "block";
    } else {
      loginStatus.textContent = "לא מחובר.";
      logoutBtn.style.display = "none";
      window.location.href = "../login.html"; // Redirect to login page if not authenticated
    }
  });
});
