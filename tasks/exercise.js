import { hebrewDict } from './hebrew-dict.js';

export class Exercise {
  level = 'easy';

  constructor(title) {
    this.title = title;
  }

  getDefaultHtml() {
    // Default: show nothing. Child classes should override if needed.
    return '';
  }

  handleRun({ selects = [], inputs = [], ex = null }) {
    // Default: do nothing. Child classes should override if needed.
  }

  validate({ selects, inputs }) {
    // Default: always valid. Child classes should override for custom validation.
    return { valid: true, message: '' };
  }

  composeImageHtml(vars) {
    // To be implemented in child classes. 'vars' is an object with exercise-specific keys.
    // Example: { color, clouds, rainbow }
    return '';
  }

  getCodeParts() {
    // To be implemented in child classes if needed
    return [];
  }

  setLevel(level) {
    this.level = level;
  }


  createFieldDisplayDetails(pretext='', posttext='', valid_values, default_value, indentation=false) {
    let field_details = [];
    const field_type = this.levelFieldTypes[this.level];
    if (indentation) {
      pretext = "\u00A0\u00A0\u00A0\u00A0" + pretext;
    }
    field_details.push({ type: 'text', value: pretext });
    if (field_type === 'dropdown') {
      field_details.push({ type: 'dropdown', options: valid_values, default: default_value });
    }
    if (field_type === 'input') {
      field_details.push({type: 'input', default: default_value});
    }
    field_details.push({ type: 'text', value: posttext });
    field_details.push({ type: 'text', value: '\n' });
    return field_details;
    } 

  
}

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
  easyBtn.textContent = hebrewDict.easy;
  easyBtn.className = 'run-btn level-btn';
  easyBtn.onclick = () => switchLevel('easy');
  const hardBtn = document.createElement('button');
  hardBtn.textContent = hebrewDict.hard;
  hardBtn.className = 'run-btn level-btn';

  hardBtn.onclick = () => switchLevel('hard');
  levelDiv.appendChild(easyBtn);
  levelDiv.appendChild(hardBtn);
  container.appendChild(levelDiv);

  function switchLevel(level) {
    currentLevel = level;
    easyBtn.classList.remove('selected');
    hardBtn.classList.remove('selected');
    if (level === 'easy') {
      easyBtn.classList.add('selected');
    } else {
      hardBtn.classList.add('selected');
    }
    ex.setLevel(level);
    renderLevel();
  }

  function renderLevel() {
    // Remove previous exercise if exists
    const oldEx = container.querySelector('.exercise');
    if (oldEx) {
      oldEx.remove();
    }
    const exDiv = document.createElement('div');
    exDiv.className = 'exercise';
    
    // Title
    const title = document.createElement('h3');
    title.textContent = ex.title;
    exDiv.appendChild(title);

    // Code area
    const codeArea = document.createElement('div');
    codeArea.className = 'code-area';
    const codeParts = ex.getCodeParts();
    
    codeParts.forEach((part) => {
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
    runBtn.textContent = hebrewDict.run;
    exDiv.appendChild(runBtn);

    // Result image
    const imgDiv = document.createElement('div');
    imgDiv.className = 'result-img';
    if (typeof ex.getDefaultHtml === 'function') {
      imgDiv.innerHTML = ex.getDefaultHtml();
    } else {
      imgDiv.innerHTML = '';
    }
    exDiv.appendChild(imgDiv);
    
    // Message area
    const msgDiv = document.createElement('div');
    msgDiv.className = 'answer-msg';
    msgDiv.style.marginTop = '12px';
    msgDiv.style.fontWeight = 'bold';
    exDiv.appendChild(msgDiv);

    // Run logic
    runBtn.onclick = () => {
      const selects = codeArea.querySelectorAll('select');
      const inputs = codeArea.querySelectorAll('input');
      // Validation 
      let result = { valid: true, message: '' };
      result = ex.validate({ selects, inputs });
      if (result && result.valid) {
        if (typeof ex.handleRun === 'function') {
          const outcome = ex.handleRun({ selects, inputs, ex });
          if (outcome !== null && outcome !== undefined) {
            imgDiv.innerHTML = outcome;
          }
        }
        msgDiv.style.color = '#1a7f37';
      } else {
        msgDiv.style.color = '#c00';
      }
      msgDiv.innerHTML = result.message;
    };
    container.appendChild(exDiv);
  }

  switchLevel('easy');
}