import { loginUser } from "./authHandler.js";
import { auth } from "../../firebase/firebaseConfig.js";

const form = document.getElementById("loginForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "";

    if (!form.checkValidity()) {
    status.textContent = "אנא מלא/י את כל השדות כראוי.";
    status.className = "error";
    return;
    }

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    try {
        await loginUser(email, password);
        // Check if email is verified before redirecting
        const user = auth.currentUser;
        if (user && user.emailVerified) {
            status.textContent = "התחברת בהצלחה!";
            status.className = "success";
            window.location.href = "tasks/index.html"; // Redirect to the exercises page after successful login
        } else {
            status.textContent = "יש לאמת את כתובת האימייל שלך לפני הכניסה למשימות.";
            status.className = "error";
            window.location.href = "verify-email.html"; // Redirect to email verification page
        }
    } catch (error) {
        // handle specific error messages
        const errorCode = error.message;
        switch (errorCode) {
            case 'auth/user-not-found': 
                status.textContent = "משתמש לא נמצא. אנא בדוק את כתובת האימייל.";
                break;
            case 'auth/wrong-password':
                status.textContent = "סיסמה שגויה. אנא נסה שוב.";
                break
            case 'auth/invalid-email':
                status.textContent = "כתובת אימייל לא תקינה.";
                break;
            case 'auth/too-many-requests':
                status.textContent = "יותר מדי ניסיונות כניסה. אנא נסה מאוחר יותר.";
                break;
            case 'auth/invalid-credential':
                status.textContent = "שם משתמש או סיסמה לא תקינים.";
                break;
            default:
                status.textContent = "שגיאה לא צפויה: " + errorCode;
                break;
        }

    status.className = "error";
    }
});