import { hebrewDict } from './hebrew-dict.js';

export function renderMenu(exercises, onSelect) {
  const exerciseList = document.getElementById('exercise-list');
  exerciseList.innerHTML = '';
  exercises.forEach((ex, idx) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = `${hebrewDict.task} ${idx + 1}`;
    btn.className = 'exercise-menu-btn run-btn';
    btn.onclick = () => {
      setActiveMenu(idx);
      onSelect(idx);
    };
    li.appendChild(btn);
    exerciseList.appendChild(li);
  });
}

export function setActiveMenu(idx) {
  const buttons = document.querySelectorAll('.exercise-menu-btn');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('selected', i === idx);
  });
}
