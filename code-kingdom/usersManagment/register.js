import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { db } from "../firebaseConfig.js";
import { registerUser } from "./authHandler.js";

const form = document.getElementById("registerForm");
const status = document.getElementById("status");


form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "";

    // Perform custom validation first
    const name = form.name.value.trim()
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const signupCode = form.signupCode.value.trim();

    if (!email || !email.includes('@')) {
        status.textContent = 'אנא הזן כתובת אימייל חוקית';
        status.className = 'error';
        return;
    }

    if (password.length < 6) {
        status.textContent = 'הסיסמה חייבת להיות באורך של לפחות 6 תווים';
        status.className = 'error';
        return;
    }

    // Then check built-in form validity
    if (!form.checkValidity()) {
        status.textContent = "אנא מלאו את כל השדות כראוי.";
        status.className = "error";
        return;
    }

    try {
        // Step 1: Retrieve signup code from Firestore
        const codeRef = doc(db, "config", "signup");
        const codeDoc = await getDoc(codeRef);
    
        if (!codeDoc.exists()) {
            status.textContent = "Error: Signup code is not set.";
            status.className = "error";
            return;
        }
    
        const correctCode = codeDoc.data().code;

        // Step 2: Validate signup code
        if (signupCode.toUpperCase() !== correctCode) {
            status.textContent = "קוד ההרשמה שגוי. ההרשמה היא לקוראי הספר בלבד, הקוד מופיע בעותק שלכם בעמוד ההקדמה להורים.";
            status.className = "error";
            return;
        }

        // Step 3: Register user
        await registerUser(email, password, name);

        status.textContent = `נרשמת בהצלחה! נשלח מייל לאימות לכתובת ${email}. יש לאשר את כתובת המייל לפני הכניסה לאתר. \nבדקו גם את תיקיית הספאם.`;
        status.className = "success";
        
        form.reset();
        
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            status.innerHTML = "האימייל כבר קיים במערכת. <a href='./login.html'>התחבר כאן</a>.";
            status.className = "error";
        } else if (error.code === 'auth/invalid-email') {
            status.textContent = "אנא הזן כתובת אימייל חוקית";
            status.className = "error";
        } else {
            status.textContent = "שגיאה: " + error.message;
            status.className = "error";
            console.error("Registration error:", error);
        }
    }
});