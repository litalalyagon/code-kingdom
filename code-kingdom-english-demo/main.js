import { renderMenu, setActiveMenu } from './menu.js';
import { renderExercise } from './exercise.js';

const exerciseFiles = [
  './exercise1.js',
  './exercise2.js',
  './exercise3.js',
  './exercise4.js',
  './exercise10.js',
  './exercise6.js',
  './exercise7.js',
  './exercise8.js',
  './exercise9.js',
  './exercise5.js',
  './exercise11.js',
  './exercise12.js',
  './exercise13.js',
];

let loadedExercises = Array(exerciseFiles.length).fill(null);

// Load all exercises at startup to check their enabled status
async function loadAllExercises() {
  const promises = exerciseFiles.map((file, idx) => loadExercise(idx));
  await Promise.all(promises);
}

document.addEventListener('DOMContentLoaded', async () => {
  // Show demo message
  const loginStatus = document.getElementById("loginStatus");
  if (loginStatus) {
    loginStatus.textContent = "Demo Mode";
  }

  // Load all exercises first
  await loadAllExercises();

  // Initialize the menu with all exercises
  renderMenu(loadedExercises, showExercise);
});

// Automatically mark exercise 1 as selected in the menu after page load
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

// Start with exercise 1
showExercise(0);
