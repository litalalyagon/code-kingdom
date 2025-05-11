import { Exercise } from './exercise.js';

class Exercise1 extends Exercise {
  constructor() {
    super('משימה 1: משנים את הנוף');
  }
  static colorMap = { 
    'כחול': 'blue', 
    'ירוק': 'green', 
    'כתום': 'orange' 
  };
  static validColors = Object.keys(Exercise1.colorMap);
  static validClouds = ['0', '1', '2', '3'];
  static validRainbow = ['כן', 'לא'];
  static defaultColor = 'כחול';
  static defaultClouds = '3';
  static defaultRainbow = 'לא';

  getCodeParts(level = 'easy') {
    if (level === 'easy') {
      return [
        { type: 'text', value: 'צבע עצים = ' },
        { type: 'dropdown', options: Exercise1.validColors, answer: Exercise1.defaultColor, default: Exercise1.defaultColor },
        { type: 'text', value: '\n' },
        { type: 'text', value: 'עננים = ' },
        { type: 'dropdown', options: Exercise1.validClouds, answer: Exercise1.defaultClouds, default: Exercise1.defaultClouds },
        { type: 'text', value: '\n' },
        { type: 'text', value: 'קשת = ' },
        { type: 'dropdown', options: Exercise1.validRainbow, answer: Exercise1.defaultRainbow, default: Exercise1.defaultRainbow }
      ];
    } else {
      return [
        { type: 'text', value: 'צבע עצים = ' },
        { type: 'input', answer: Exercise1.defaultColor, default: Exercise1.defaultColor },
        { type: 'text', value: '\n' },
        { type: 'text', value: 'עננים = ' },
        { type: 'input', answer: Exercise1.defaultClouds, default: Exercise1.defaultClouds },
        { type: 'text', value: '\n' },
        { type: 'text', value: 'קשת = ' },
        { type: 'input', answer: Exercise1.defaultRainbow, default: Exercise1.defaultRainbow }
      ];
    }
  }

  composeImageHtml(vars) {
    const { color, clouds, rainbow } = vars;
    const colorKey = Exercise1.colorMap[color] || color;
    const forestImg = `ex1/forest_${colorKey}.png`;
    const cloudsImg = clouds !== '0' ? `ex1/clouds_${clouds}.png` : null;
    const rainbowImg = rainbow === 'כן' ? 'ex1/rainbow.png' : null;
    let html = `<div style="position:relative;display:inline-block;">`;
    if (rainbowImg) {
      html += `<img src='${rainbowImg}' alt='rainbow' style='position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;'>`;
    }
    html += `<img src='${forestImg}' alt='forest' style='position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;'>`;
    if (cloudsImg) {
      html += `<img src='${cloudsImg}' alt='clouds' style='position:absolute;top:0;left:0;width:100%;height:100%;z-index:3;'>`;
    }
    html += `<img src='${forestImg}' alt='' style='visibility:hidden;position:relative;width:100%;height:auto;'>`;
    html += '</div>';
    return html;
  }

  getDefaultHtml(level = 'easy') {
    return this.composeImageHtml({
      color: Exercise1.defaultColor,
      clouds: Exercise1.defaultClouds,
      rainbow: Exercise1.defaultRainbow
    });
  }

  handleRun({ selects, inputs, codeArea, imgDiv, level = 'easy' }) {
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
      Exercise1.validColors.includes(color) &&
      Exercise1.validClouds.includes(clouds) &&
      Exercise1.validRainbow.includes(rainbow)
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
    return `${Exercise1.defaultColor},${Exercise1.defaultClouds},${Exercise1.defaultRainbow}`;
  }
}

export default new Exercise1();
