import { auth } from "../firebaseConfig.js";
import { sendVerification } from "./authHandler.js";

document.getElementById("sendVerificationBtn").addEventListener("click", async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            await sendVerification(user);
            document.getElementById("status").textContent = `אימייל אישור נשלח לכתובת ${user.email}. אם לא קיבלת את האימייל, בדוק את תיקיית הספאם שלך.`;
        } catch (error) {
            if (error.code === 'auth/too-many-requests') {
                document.getElementById("status").textContent = "יותר מדי ניסיונות לשליחת אימייל. אנא נסה מאוחר יותר.";
            } else {    
                document.getElementById("status").textContent = "שגיאה בשליחת אימייל: " + error.message;
            }
        }
    } else {
        document.getElementById("status").textContent = "לא נמצא משתמש מחובר.";
    }
});