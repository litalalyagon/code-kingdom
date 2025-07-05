import { renderMenu, setActiveMenu, setCompletedStages } from './menu.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { auth, db } from "../firebaseConfig.js";

// Fetch completed stages from Firestore and update menu
function fetchAndSetCompletedStages() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setCompletedStages(data.completedStages || []);
        // Re-render menu to update completed status
        renderMenu(Array(exerciseFiles.length).fill({}), showExercise);
      }
    }
  });
}
import { renderExercise } from './exercise.js';

const exerciseFiles = [
  './exercise1.js',
  './exercise2.js',
  './exercise3.js',
  './exercise4.js',
  './exercise5.js',
  './exercise6.js',
  './exercise7.js', 
  './exercise8.js',
  './exercise9.js',
  './exercise10.js',
  './exercise11.js',
  './exercise12.js',
  './exercise13.js',
];

let loadedExercises = Array(exerciseFiles.length).fill(null);

async function loadExercise(idx) {
  if (!loadedExercises[idx]) {
    const module = await import(exerciseFiles[idx]);
    loadedExercises[idx] = module.default;
  }
  return loadedExercises[idx];
}

async function showExercise(idx) {
  setActiveMenu(idx);
  const ex = await loadExercise(idx);
  renderExercise(ex, idx);
}

fetchAndSetCompletedStages();
showExercise(0);

