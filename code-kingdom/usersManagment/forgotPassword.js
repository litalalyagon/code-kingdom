import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { auth } from "../firebaseConfig.js";

document.getElementById("forgotPasswordForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("forgotEmail").value.trim();
  const status = document.getElementById("forgotStatus");
  status.textContent = "";
  if (!email || !email.includes("@")) {
    status.textContent = "אנא הזן כתובת אימייל חוקית";
    status.className = "error";
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    status.textContent = "קישור לאיפוס סיסמה נשלח לאימייל שלך. בדוק גם את תיקיית הספאם.";
    status.className = "success";
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      status.textContent = "אימייל זה לא קיים במערכת.";
    } else if (error.code === "auth/invalid-email") {
        status.textContent = "כתובת אימייל לא תקינה.";
    } else {
      status.textContent = "שגיאה: " + error.message;
    }
    status.className = "error";
  }
});
