// auth.js

// Check if the user is logged in
export function isLoggedIn() {
  return localStorage.getItem('userLoggedIn') === 'true';
}

// Log in the user
export function logInUser() {
  localStorage.setItem('userLoggedIn', 'true');
}

// Log out the user
export function logOutUser() {
  localStorage.removeItem('userLoggedIn');
}
