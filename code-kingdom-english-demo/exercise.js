import { englishDict } from './english-dict.js';

export class Exercise {
  level = '';
  description = '';
  input_sizes = {'easy': 'medium', 'hard': 'medium'};
  ex_indentifier = '';

  constructor(ex_indentifier) {
    this.ex_indentifier = ex_indentifier;
    this.title = englishDict[ex_indentifier].title;
    this.description = englishDict[ex_indentifier].description;
    this.img_path = `../code-kingdom/assets/tasks_images/${ex_indentifier}/`;
  }

  path(img_name) {
    return this.img_path + img_name;
  }

  getDefaultHtml() {
    return '';
  }

  handleRun({ selects = [], inputs = [], ex = null }) {
    // Override in child classes
  }

  validate({ selects, inputs }) {
    return { valid: true, message: '' };
  }
  
  isCorrect() {
    return false;
  }

  composeImageHtml(vars) {
    return '';
  }

  getCodeParts() {
    return [];
  }

  setLevel(level) {
    this.level = level;
  }

  generateImageHTML(image_array) {
    let html = `<div class="image-container" style="background-color: ${this.resultImgBg};">`;
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

  calculateResultFromString(str) {
    str = str.replace(/\s+/g, '');
    const tokens = str.match(/\d+(?:\.\d+)?|[+\-]/g);
    if (!tokens) return NaN;
    let result = parseFloat(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i];
      const num = parseFloat(tokens[i + 1]);
      if (op === '+') {
        result += num;
      } else if (op === '-') {
        result -= num;
      }
    }
    return result;
  }

  createFieldDisplayDetails(data) {
    let field_type = data.field_type || 'input';
    let pretext = data.pretext || '';
    let posttext = data.posttext || '';
    let valid_values = data.valid_values || [];
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
  const easyBtn = document.getElementById('easyBtn');
  const hardBtn = document.getElementById('hardBtn');
  const container = document.getElementById('exercise-container');
  container.innerHTML = '';
  let currentLevel = '';

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

  easyBtn.onclick = () => switchLevel('easy');
  hardBtn.onclick = () => switchLevel('hard');

  function renderLevel() {
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
    description.innerHTML = ex.description;
    exDiv.appendChild(description);

    // Flex wrap for image and code
    const flexWrap = document.createElement('div');
    flexWrap.className = 'exercise-flex-wrap';

    // Result image
    const imgDiv = document.createElement('div');
    imgDiv.className = 'result-img';
    if (typeof ex.getDefaultHtml === 'function') {
      imgDiv.innerHTML = ex.getDefaultHtml();
    } else {
      imgDiv.innerHTML = '';
    }

    // Code area and run button
    const codeWrap = document.createElement('div');
    codeWrap.className = 'code-wrap';

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
        const input_size_options = {'xlarge': 25, 'large': 15, 'medium': 10, 'small': 5};
        input.type = 'text';
        input.size = input_size_options[ex.input_sizes[currentLevel]];
        if (part.default) input.value = part.default;
        codeArea.appendChild(input);
      }
    });

    codeWrap.appendChild(codeArea);

    // Run button
    const runBtn = document.createElement('button');
    runBtn.className = 'run-btn';
    runBtn.innerHTML = englishDict.run + '  <i class="fa fa-play" style="margin-right:8px;"></i>' ;
    codeWrap.appendChild(runBtn);

    codeArea.querySelectorAll('input').forEach(input => {
      input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          runBtn.click();
        }
      });
    });

    // Message area
    const msgDiv = document.createElement('div');
    msgDiv.className = 'answer-msg';
    codeWrap.appendChild(msgDiv);

    // Add both to flex container
    flexWrap.appendChild(codeWrap);
    flexWrap.appendChild(imgDiv);
    exDiv.appendChild(flexWrap);

    // Run logic
    runBtn.onclick = () => {
      const selects = codeArea.querySelectorAll('select');
      const inputs = codeArea.querySelectorAll('input');
      
      let result = { valid: true, message: '' };
      result = ex.validate({ selects, inputs });
      if (result && result.valid) {
        result = ex.isCorrect();
        if (typeof ex.handleRun === 'function') {
          const outcome = ex.handleRun({ selects, inputs, ex });
          imgDiv.classList.remove('animate');
          void imgDiv.offsetWidth; 
          imgDiv.classList.add('animate');
    
          if (outcome !== null && outcome !== undefined) {
            imgDiv.innerHTML = outcome;
          }
        }
      }
      msgDiv.classList.remove('success', 'error');
      if (result && result.valid) {
        msgDiv.classList.add('success');
        showCelebrationPopup();
      }
      else {
        msgDiv.classList.add('error');
      }
      msgDiv.innerHTML = result.message;
    };
    container.appendChild(exDiv);
  }

  switchLevel('hard');
}

function showCelebrationPopup() {
  const celebrationMessages = [
    "Excellent Work!",
    "Amazing Job!",
    "You Did It!",
    "Brilliant!",
    "Turtle Power!",
    "Cowabunga!",
    "Radical!",
    "Totally Tubular, Dude!"
  ];
  
  const randomMessage = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
  
  const modal = document.createElement('div');
  modal.className = 'celebration-modal';
  modal.innerHTML = `
    <div class="celebration-overlay"></div>
    <div class="celebration-content">
      <h2 class="celebration-text">${randomMessage}</h2>
      <img src="assets-tmnt/Group_pose_16.png" alt="Congratulations!">
    </div>
  `;
  
  document.body.appendChild(modal);
  
  let autoCloseTimer;
  
  const closeModal = () => {
    clearTimeout(autoCloseTimer);
    modal.classList.add('fade-out');
    setTimeout(() => modal.remove(), 400);
    document.removeEventListener('keydown', handleEsc);
    modal.removeEventListener('click', closeModal);
  };
  
  // Close on any click on the modal
  modal.addEventListener('click', closeModal);
  
  // Allow ESC key to close
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  document.addEventListener('keydown', handleEsc);
  
  // Trigger fade-in animation
  setTimeout(() => modal.classList.add('show'), 10);
  
  // Auto-close after 3 seconds
  autoCloseTimer = setTimeout(() => {
    closeModal();
  }, 3000);
}
