import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { checkAuthentication } from "../authMiddleware.js";
import { auth, db } from "../firebaseConfig.js";

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

  // Enhanced error handling for onAuthStateChanged
  onAuthStateChanged(auth, async (user) => {
    try {
      if (user) {
        loginStatus.textContent = `מחובר כ: ${user.email}`;
        logoutBtn.style.display = "block";

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: user.email,
            completedStages: []
          });
        }
      } else {
        loginStatus.textContent = "לא מחובר.";
        logoutBtn.style.display = "none";
        window.location.href = "../login.html"; // Redirect to login page if not authenticated
      }
    } catch (error) {
      loginStatus.textContent = "שגיאה: אירעה בעיה בבדיקת המצב.";
      console.error("Error during auth state change:", error);
    }
  });
});

export async function markStageAsCompleted(stageId) {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, {
    completedStages: arrayUnion(stageId)
  });
}
