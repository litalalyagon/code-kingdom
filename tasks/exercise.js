import { hebrewDict } from './hebrew-dict.js';

export class Exercise {
  level = 'easy';
  description = '';
  input_sizes = {'easy': 'medium', 'hard': 'medium'};

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
  isCorrect() {
    // Default: always false. Child classes should override for custom correctness check.
    return false;
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

  generateImageHTML(image_array) {
    let html = `<div class="image-container">`;
    for (let i = 0; i < image_array.length; i++) {
      const img_path = image_array[i];
      if (img_path) {
        html += `<img src='${img_path}' alt='image' class="main-image" style="z-index: ${i + 1};">`;
      }
    } 
    html += '</div>';
    return html;
  }

  evaluateCondition(variable, operator, value) {
    switch (operator) {
      case '<':
        return variable < value;
      case '>':
        return variable > value;
      case '==':
        return variable === value;
      default:
        return false;
    }
  }


  createFieldDisplayDetails(data) {
    let field_type = data.field_type || 'input'; // input / dropdown / text
    let pretext = data.pretext || '';
    let posttext = data.posttext || '';
    let valid_values = data.valid_values || []; // for dropdowns
    let default_value = data.default_value || ''; 
    let indentation = data.indentation || false;
    let new_line = data.new_line !== undefined ? data.new_line : true;
    
    let field_details = [];
    if (indentation) {
      pretext = "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" + pretext;
    }
    field_details.push({type: 'text', value: pretext});
    if (field_type === 'dropdown') {
      field_details.push({type: 'dropdown', options: valid_values, default: default_value});
    }
    if (field_type === 'input') {
      field_details.push({type: 'input', default: default_value});
    }
    field_details.push({type: 'text', value: posttext});
    if (new_line) {
      field_details.push({type: 'text', value: '\n'});
    }
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

    // Description
    const description = document.createElement('p');
    description.className = 'exercise-description';
    description.textContent = ex.description;
    description.style.textAlign = 'center';
    exDiv.appendChild(description);

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
        const input_size_options = {'big': 15, 'medium': 10, 'small': 5};
        input.type = 'text';
        console.log(ex.input_sizes)
        input.size = input_size_options[ex.input_sizes[currentLevel]];
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

    codeArea.querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      runBtn.click();
      }});
    });

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
        result = ex.isCorrect();
        if (typeof ex.handleRun === 'function') {
          const outcome = ex.handleRun({ selects, inputs, ex });
          if (outcome !== null && outcome !== undefined) {
            imgDiv.innerHTML = outcome;
          }
        }
      }
      if (result && result.valid) {
        msgDiv.style.color = '#1a7f37';
      }
      else {
        msgDiv.style.color = '#c00';
      }
      msgDiv.innerHTML = result.message;
    };
    container.appendChild(exDiv);
  }

  switchLevel('easy');
}