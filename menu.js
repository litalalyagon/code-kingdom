export function renderMenu(exercises, onSelect) {
  const exerciseList = document.getElementById('exercise-list');
  exerciseList.innerHTML = '';
  exercises.forEach((ex, idx) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = `תרגיל ${idx + 1}`;
    btn.onclick = () => onSelect(idx);
    if (idx === 0) btn.classList.add('active');
    li.appendChild(btn);
    exerciseList.appendChild(li);
  });
}
export function setActiveMenu(idx) {
  document.querySelectorAll('nav button').forEach((b, i) => {
    b.classList.toggle('active', i === idx);
  });
}
