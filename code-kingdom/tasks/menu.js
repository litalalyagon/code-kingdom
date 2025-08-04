import { setCompletionModalFlagIfAllCompleted } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';
// Store completed stages globally for menu rendering
let completedStagesGlobal = [];

// Call this after fetching completedStages from Firestore
export function setCompletedStages(stages) {
  completedStagesGlobal = Array.isArray(stages) ? stages : [];
}

export function renderMenu(exercises, onSelect) {
  const exerciseList = document.getElementById('exercise-list');
  exerciseList.innerHTML = '';
  exercises.forEach((ex, idx) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = `${hebrewDict.task} ${idx + 1}`;
    btn.className = 'exercise-menu-btn';
    const identifier = `ex${idx + 1}`;
    btn.setAttribute('data-level', identifier); // For reference
   
    // Mark as completed if in completedStagesGlobal
    if (completedStagesGlobal.includes(identifier)) {
      btn.classList.add('completed');
    }
    btn.onclick = () => {
      setActiveMenu(idx);
      onSelect(idx);
    };
    li.appendChild(btn);
    exerciseList.appendChild(li);
  });
  // Check if all are completed and set the modal flag so it won't show again
  setCompletionModalFlagIfAllCompleted(exercises.length, completedStagesGlobal);
}

export function setActiveMenu(idx) {
  const buttons = document.querySelectorAll('.exercise-menu-btn');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('selected', i === idx);
  });
}
