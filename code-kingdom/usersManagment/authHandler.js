import { signOut, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { auth, db, verificationMailUrl} from "../firebaseConfig.js";

export async function logout() {
  try {
    await signOut(auth);
    console.log("User logged out successfully.");
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Logout failed: " + error.message);
  }
}

export async function getChildName() {
  const user = auth.currentUser;
  if (!user) return null;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data().childName || null;
  }

  return null;
}

export async function markStageAsCompleted(stageId) {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, {
    completedStages: arrayUnion(stageId)
  });
}

export async function registerUser(email, password, childName) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await sendVerification(user);

  // Create a new user document in Firestore with emailVerified: false
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    childName: childName,
    completedStages: [],
    emailVerified: false
  });
}

export async function sendVerification(user) {
    const actionCodeSettings = {
      // This is the URL your user will be redirected to AFTER email verification.
      url: verificationMailUrl,
      handleCodeInApp: false, 
    };

  // Send verification email
  await sendEmailVerification(user, actionCodeSettings);

}

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User logged in:", user);
    return user; // Return the user object
  } catch (error) {
    const errorCode = error.code;
    console.error("Login error:", errorCode);
    throw new Error(errorCode); // Let the caller handle the error
  }
}


