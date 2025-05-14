import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise1 extends Exercise {
  constructor() {
    super('משימה 1: משנים את הנוף');
  }
  levelFieldTypes = {'easy': 'dropdown', 'hard': 'input'};
  validColors = ['כחול', 'ירוק', 'כתום', 'שחור', 'ורוד', 'סגול', 'אפור'];
  validClouds = ['0', '1', '2', '3', '4', '5', '6'];
  validRainbow = [hebrewDict.no, hebrewDict.yes];
  
  defaultColor = hebrewDict.colors.blue;
  defaultClouds = '3';
  defaultRainbow = hebrewDict.no;

  getCodeParts() {
    const color_field = this.createFieldDisplayDetails(`${hebrewDict.ex1.trees_color} = `, null, this.validColors, this.defaultColor);
    const clouds_field = this.createFieldDisplayDetails(`${hebrewDict.ex1.clouds} = `, null, this.validClouds, this.defaultClouds);
    const rainbow_field = this.createFieldDisplayDetails(`${hebrewDict.ex1.rainbow} = `, null, this.validRainbow, this.defaultRainbow);
    
    const combined = color_field.concat(clouds_field, rainbow_field);
    combined.pop();
    return combined;
  }

  composeImageHtml(vars) {
    const { color, clouds, rainbow } = vars;
    const colorKey = Object.keys(hebrewDict.colors).find(key => hebrewDict.colors[key] === color);
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
    return { valid: false, message: this.getErrorMessage(color, clouds, rainbow) };
  }

  getCorrectMessage() {
    return hebrewDict.ex1.success;
  }

  getErrorMessage(color, clouds, rainbow) {
    let message = [];
    if (!this.validColors.includes(color)) {
      message.push(hebrewDict.ex1.color_error);
    }
    if (!this.validClouds.includes(clouds)) {
      message.push(hebrewDict.ex1.clouds_error);
    }
    if (!this.validRainbow.includes(rainbow)) {
      message.push(hebrewDict.ex1.rainbow_error);
    }
    return message.join('<br>');
  }
}

export default new Exercise1();
