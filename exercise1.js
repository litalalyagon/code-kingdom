import { Exercise } from './exercise.js';

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
  validRainbow = ['כן', 'לא'];
  defaultColor = 'כחול';
  defaultClouds = '3';
  defaultRainbow = 'לא';

  getCodeParts(level = 'easy') {
    if (level === 'easy') {
      return [
        { type: 'text', value: 'צבע עצים = ' },
        { type: 'dropdown', options: this.validColors, default: this.defaultColor },
        { type: 'text', value: '\n' },
        { type: 'text', value: 'עננים = ' },
        { type: 'dropdown', options: this.validClouds, default: this.defaultClouds },
        { type: 'text', value: '\n' },
        { type: 'text', value: 'קשת = ' },
        { type: 'dropdown', options: this.validRainbow, default: this.defaultRainbow }
      ];
    } else {
      return [
        { type: 'text', value: 'צבע עצים = ' },
        { type: 'input', default: this.defaultColor },
        { type: 'text', value: '\n' },
        { type: 'text', value: 'עננים = ' },
        { type: 'input', default: this.defaultClouds },
        { type: 'text', value: '\n' },
        { type: 'text', value: 'קשת = ' },
        { type: 'input', default: this.defaultRainbow }
      ];
    }
  }

  composeImageHtml(vars) {
    const { color, clouds, rainbow } = vars;
    const colorKey = this.colorMap[color] || color;
    const forestImg = `ex1/forest_${colorKey}.png`;
    const cloudsImg = clouds !== '0' ? `ex1/clouds_${clouds}.png` : null;
    const rainbowImg = rainbow === 'כן' ? 'ex1/rainbow.png' : null;

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

  getDefaultHtml(level = 'easy') {
    return this.composeImageHtml({
      color: this.defaultColor,
      clouds: this.defaultClouds,
      rainbow: this.defaultRainbow
    });
  }

  handleRun({ selects, inputs, level = 'easy' }) {
    let color, clouds, rainbow;
    if (level === 'easy') {
      [color, clouds, rainbow] = Array.from(selects).map(s => s.value);
    } else {
      [color, clouds, rainbow] = Array.from(inputs).map(i => i.value.trim());
    }
    if (!this.isValid(color, clouds, rainbow)) return null;
    return this.composeImageHtml({ color, clouds, rainbow });
  }

  isValid(color, clouds, rainbow) {
    return (
      this.validColors.includes(color) &&
      this.validClouds.includes(clouds) &&
      this.validRainbow.includes(rainbow)
    );
  }

  validate({ selects, inputs, level = 'easy' }) {
    let color, clouds, rainbow;
    if (level === 'easy') {
      [color, clouds, rainbow] = Array.from(selects).map(s => s.value);
    } else {
      [color, clouds, rainbow] = Array.from(inputs).map(i => i.value.trim());
    }
    if (this.isValid(color, clouds, rainbow)) {
      return { valid: true, message: this.getCorrectMessage(level) };
    }
    return { valid: false, message: 'נסה שוב. ודא שבחרת צבע, מספר עננים, וקשת תקינים.' };
  }

  getCorrectMessage(level = 'easy') {
    return 'כל הכבוד! אפשר לנסות לשנות שוב את היער!';
  }

  getValidString(level = 'easy') {
    return `${Exercthisise1.defaultColor},${this.defaultClouds},${this.defaultRainbow}`;
  }
}

export default new Exercise1();
