import { englishDict } from './english-dict.js';

export function renderMenu(exercises, onSelect) {
  const exerciseList = document.getElementById('exercise-list');
  exerciseList.innerHTML = '';
  
  exercises.forEach((ex, menuIdx) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'exercise-menu-btn';
    const identifier = `ex${menuIdx + 1}`;
    btn.setAttribute('data-level', identifier);
    btn.setAttribute('data-idx', menuIdx);
    
    // Check if exercise is enabled
    const isEnabled = ex && ex.enabled !== false;
    
    if (!isEnabled) {
      btn.innerHTML = `<i class="fas fa-lock"></i> ${englishDict.task} ${menuIdx + 1}`;
      btn.classList.add('disabled');
      btn.disabled = true;
    } else {
      btn.textContent = `${englishDict.task} ${menuIdx + 1}`;
      btn.onclick = () => {
        setActiveMenu(menuIdx);
        onSelect(menuIdx);
      };
    }
    
    li.appendChild(btn);
    exerciseList.appendChild(li);
  });
}

export function setActiveMenu(idx) {
  const buttons = document.querySelectorAll('.exercise-menu-btn');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('selected', i === idx);
    
    // Remove existing indicator
    const existingIndicator = btn.querySelector('.level-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    
    // Add indicator to selected button
    if (i === idx && !btn.classList.contains('disabled')) {
      const indicator = document.createElement('img');
      indicator.src = 'assets-tmnt/head.png';
      indicator.alt = 'Current Level';
      indicator.className = 'level-indicator';
      btn.appendChild(indicator);
    }
  });
}
