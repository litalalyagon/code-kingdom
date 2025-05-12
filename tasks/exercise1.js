import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise1 extends Exercise {
  constructor() {
    super('משימה 1: משנים את הנוף');
  }
  colorMap = { 
    'כחול': 'blue', 
    'ירוק': 'green', 
    'כתום': 'orange' 
  };
  validColors = Object.keys(this.colorMap);
  validClouds = ['0', '1', '2', '3'];
  validRainbow = [hebrewDict.no, hebrewDict.yes];
  defaultColor = hebrewDict.colors.blue;
  defaultClouds = '3';
  defaultRainbow = hebrewDict.no;

  getCodeParts() {
    if (this.level === 'easy') {
      return [
        { type: 'text', value: `${hebrewDict.ex1.trees_color} = ` },
        { type: 'dropdown', options: this.validColors, default: this.defaultColor },
        { type: 'text', value: '\n' },
        { type: 'text', value: `${hebrewDict.ex1.clouds} = ` },
        { type: 'dropdown', options: this.validClouds, default: this.defaultClouds },
        { type: 'text', value: '\n' },
        { type: 'text', value: `${hebrewDict.ex1.rainbow} = ` },
        { type: 'dropdown', options: this.validRainbow, default: this.defaultRainbow }
      ];
    } else {
      return [
        { type: 'text', value:  `${hebrewDict.ex1.trees_color} = ` },
        { type: 'input', default: this.defaultColor },
        { type: 'text', value: '\n' },
        { type: 'text', value: `${hebrewDict.ex1.clouds} = ` },
        { type: 'input', default: this.defaultClouds },
        { type: 'text', value: '\n' },
        { type: 'text', value: `${hebrewDict.ex1.rainbow} = ` },
        { type: 'input', default: this.defaultRainbow }
      ];
    }
  }

  composeImageHtml(vars) {
    const { color, clouds, rainbow } = vars;
    const colorKey = this.colorMap[color] || color;
    const forestImg = `ex1/forest_${colorKey}.png`;
    const cloudsImg = clouds !== '0' ? `ex1/clouds_${clouds}.png` : null;
    const rainbowImg = rainbow === hebrewDict.yes ? 'ex1/rainbow.png' : null;

    let html = `<div class="image-container">`;
    if (rainbowImg) {
        html += `<img src='${rainbowImg}' alt='rainbow' class="main-image" style="z-index: 1;">`;
    }
    html += `<img src='${forestImg}' alt='forest' class="main-image" style="z-index: 2;">`;
    if (cloudsImg) {
        html += `<img src='${cloudsImg}' alt='clouds' class="main-image" style="z-index: 3;">`;
    }
    html += '</div>';
    return html;
  }

  getDefaultHtml() {
    return this.composeImageHtml({
      color: this.defaultColor,
      clouds: this.defaultClouds,
      rainbow: this.defaultRainbow
    });
  }

  handleRun({ selects, inputs }) {
    let color, clouds, rainbow;
    if (this.level === 'easy') {
      [color, clouds, rainbow] = Array.from(selects).map(s => s.value);
    } else {
      [color, clouds, rainbow] = Array.from(inputs).map(i => i.value.trim());
    }
    return this.composeImageHtml({ color, clouds, rainbow });
  }

  isValid(color, clouds, rainbow) {
    return (
      this.validColors.includes(color) &&
      this.validClouds.includes(clouds) &&
      this.validRainbow.includes(rainbow)
    );
  }

  validate({ selects, inputs }) {
    let color, clouds, rainbow;
    if (this.level === 'easy') {
      [color, clouds, rainbow] = Array.from(selects).map(s => s.value);
    } else {
      [color, clouds, rainbow] = Array.from(inputs).map(i => i.value.trim());
    }
    if (this.isValid(color, clouds, rainbow)) {
      return { valid: true, message: this.getCorrectMessage() };
    }
    return { valid: false, message: this.getErrorMessage() };
  }

  getCorrectMessage() {
    return hebrewDict.ex1.success;
  }

  getErrorMessage() {
    return hebrewDict.ex1.error_message;
  }
}

export default new Exercise1();
