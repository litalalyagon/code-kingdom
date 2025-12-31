import { englishDict } from './english-dict.js';

export function renderMenu(exercises, onSelect) {
  const exerciseList = document.getElementById('exercise-list');
  exerciseList.innerHTML = '';
  
  exercises.forEach((ex, menuIdx) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = `${englishDict.task} ${ex.index}`;
    btn.className = 'exercise-menu-btn';
    const identifier = `ex${ex.index}`;
    btn.setAttribute('data-level', identifier);
    btn.setAttribute('data-idx', menuIdx);
    
    // Disable all except 1 and 10
    if (ex.index !== 1 && ex.index !== 10) {
      btn.disabled = true;
      btn.classList.add('disabled');
    }
    
    btn.onclick = () => {
      if (!btn.disabled) {
        setActiveMenu(menuIdx);
        onSelect(menuIdx);
      }
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
