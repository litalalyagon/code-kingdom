export function renderExercise(ex, idx) {
  const container = document.getElementById('exercise-container');
  container.innerHTML = '';
  let currentLevel = 'easy';

  // Difficulty selector
  const levelDiv = document.createElement('div');
  levelDiv.style.display = 'flex';
  levelDiv.style.justifyContent = 'center';
  levelDiv.style.gap = '10px';
  levelDiv.style.marginBottom = '10px';
  const easyBtn = document.createElement('button');
  easyBtn.textContent = 'קל';
  easyBtn.className = 'run-btn level-btn';
  easyBtn.style.background = '#0a84ff';
  easyBtn.onclick = () => switchLevel('easy');
  const hardBtn = document.createElement('button');
  hardBtn.textContent = 'קשה';
  hardBtn.className = 'run-btn level-btn';
  hardBtn.onclick = () => switchLevel('hard');
  levelDiv.appendChild(easyBtn);
  levelDiv.appendChild(hardBtn);
  container.appendChild(levelDiv);

  function switchLevel(level) {
    currentLevel = level;
    easyBtn.classList.toggle('selected', level === 'easy');
    hardBtn.classList.toggle('selected', level === 'hard');
    renderLevel();
  }

  function renderLevel() {
    // Remove previous exercise if exists
    const oldEx = container.querySelector('.exercise');
    if (oldEx) oldEx.remove();
    const exDiv = document.createElement('div');
    exDiv.className = 'exercise';
    // Title
    const title = document.createElement('h3');
    title.textContent = ex.title;
    exDiv.appendChild(title);
    // Code area
    const codeArea = document.createElement('div');
    codeArea.className = 'code-area';
    ex.levels[currentLevel].codeParts.forEach((part) => {
      if (part.type === 'text') {
        if (part.value === '\n') {
          codeArea.appendChild(document.createElement('br'));
        } else {
          const span = document.createElement('span');
          span.textContent = part.value;
          codeArea.appendChild(span);
        }
      } else if (part.type === 'dropdown') {
        const select = document.createElement('select');
        part.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          if (part.default && part.default === opt) {
            option.selected = true;
          }
          select.appendChild(option);
        });
        codeArea.appendChild(select);
      } else if (part.type === 'input') {
        const input = document.createElement('input');
        input.type = 'text';
        if (part.default) input.value = part.default;
        codeArea.appendChild(input);
      }
    });
    exDiv.appendChild(codeArea);

    // Run button
    const runBtn = document.createElement('button');
    runBtn.className = 'run-btn';
    runBtn.textContent = 'הרץ';
    exDiv.appendChild(runBtn);

    // Result image
    const imgDiv = document.createElement('div');
    imgDiv.className = 'result-img';
    if (ex.levels[currentLevel].image) {
      imgDiv.innerHTML = `<img src="${ex.levels[currentLevel].image}" alt="Result" style="max-width:100%;max-height:100%;">`;
    } else {
      imgDiv.innerHTML = '';
    }
    exDiv.appendChild(imgDiv);
    
    // Run logic
    runBtn.onclick = () => {
      if (typeof ex.levels[currentLevel].handleRun === 'function') {
        const selects = codeArea.querySelectorAll('select');
        ex.levels[currentLevel].handleRun({ selects, codeArea, imgDiv, ex });
      }
    };
    container.appendChild(exDiv);
  }

  switchLevel('easy');
}

export function showResult(imgDiv, img) {
  imgDiv.innerHTML = `<img src="${img}" alt="Result" style="max-width:100%;max-height:100%;">`;
}
