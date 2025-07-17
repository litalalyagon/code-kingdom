import { renderMenu, setActiveMenu, setCompletedStages } from './menu.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { auth, db } from "../firebaseConfig.js";
import { renderExercise } from './exercise.js';
import { logout, getChildName } from '../usersManagment/authHandler.js';
import { isLoggedIn } from "../usersManagment/auth.js";

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

// Hide body until login is checked
document.documentElement.style.visibility = 'hidden';
isLoggedIn().then(result => {
  let loggedIn, emailVerified;
  if (result !== null) {
    loggedIn = result.loggedIn;
    emailVerified = result.emailVerified;
  }
  if (!loggedIn) {
    window.location.href = "../login.html";
  } else if (!emailVerified) {
    window.location.href = "../verify-email.html";
  } else {
    document.documentElement.style.visibility = 'visible';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Firebase-dependent code
  const loginStatus = document.getElementById("loginStatus");
  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", async () => {
    try {
      logout();
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
        const childName = await getChildName();
        if (childName) {
          loginStatus.textContent = `שלום ${childName}!`;
            // Listen for email verification and update Firestore when verified
            if (user.emailVerified) {
              try {
                await updateDoc(doc(db, "users", user.uid), { emailVerified: true });
              } catch (e) {
                // Ignore update errors
                console.error("Error updating email verification status:", e);
              }
            }  
        } else {
          loginStatus.textContent = `מחובר כ: ${user.email}`;
        }
        logoutBtn.style.display = "block";        
        
      } else {
        loginStatus.textContent = "לא מחובר.";
        logoutBtn.style.display = "none";
        // hide the body just in case the redirect fails
        document.documentElement.style.visibility = 'hidden';
        window.location.href = "../login.html"; // Redirect to login page if not authenticated
      }
    } catch (error) {
      loginStatus.textContent = "שגיאה: אירעה בעיה בבדיקת המצב.";
      window.location.href = "../login.html"; // Redirect to login page if not authenticated
      console.error("Error during auth state change:", error);
    }
  });
});

// Automatically mark exercise 1 as selected in the menu after page load, even if menu items are injected dynamically.
document.addEventListener('DOMContentLoaded', function() {
  // Wait for menu items to be injected
  const observer = new MutationObserver(function() {
    const firstBtn = document.querySelector('.exercise-menu-btn');
    if (firstBtn && !firstBtn.classList.contains('selected')) {
      firstBtn.classList.add('selected');
      observer.disconnect();
    }
  });
  observer.observe(document.getElementById('exercise-list'), { childList: true });
});

// Fetch completed stages from Firestore and update menu
// Mobile next/prev exercise navigation
document.addEventListener('DOMContentLoaded', function() {
  const nextBtn = document.getElementById('nextExerciseBtn');
  const prevBtn = document.getElementById('prevExerciseBtn');
  let currentIdx = 0;

  function updateNavButtons(idx) {
    if (prevBtn) {
      if (idx <= 0) {
        prevBtn.style.display = 'none';
      } else {
        prevBtn.style.display = '';
      }
    }
    if (nextBtn) {
      if (idx >= exerciseFiles.length - 1) {
        nextBtn.style.display = 'none';
      } else {
        nextBtn.style.display = '';
      }
    }
  }

  // Find current exercise index from menu
  function getCurrentIdx() {
    const selected = document.querySelector('.exercise-menu-btn.selected');
    if (selected && selected.dataset.idx) {
      return parseInt(selected.dataset.idx, 10);
    }
    return currentIdx;
  }

  nextBtn && nextBtn.addEventListener('click', async function() {
    currentIdx = getCurrentIdx();
    if (currentIdx < exerciseFiles.length - 1) {
      currentIdx++;
      await showExercise(currentIdx);
      updateNavButtons(currentIdx);
    }
  });
  prevBtn && prevBtn.addEventListener('click', async function() {
    currentIdx = getCurrentIdx();
    if (currentIdx > 0) {
      currentIdx--;
      await showExercise(currentIdx);
      updateNavButtons(currentIdx);
    }
  });

  // Update nav buttons on exercise change
  const observer = new MutationObserver(function() {
    currentIdx = getCurrentIdx();
    updateNavButtons(currentIdx);
  });
  observer.observe(document.getElementById('exercise-list'), { childList: true, subtree: true });
  updateNavButtons(currentIdx);
});

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

