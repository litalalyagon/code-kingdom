import { auth } from "./firebaseConfig.js";

// auth.js

// Check if the user is logged in
export function isLoggedIn() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(!!user); // Resolve with true if user is logged in, false otherwise
    });
  });
}

// Log in the user
export function logInUser() {
  localStorage.setItem('userLoggedIn', 'true');
}

// Log out the user
export function logOutUser() {
  localStorage.removeItem('userLoggedIn');
  console.log('User logged out, localStorage cleared.'); // Debugging log
}
