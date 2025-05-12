import { Exercise } from './exercise.js';

class Exercise2 extends Exercise {
  constructor() {
    super('משימה 2: הפטריות הקסומות');
  }
  colorMap = { 
    'כחול': 'blue', 
    'ירוק': 'green', 
    'כתום': 'orange',
    'אדום': 'red',
    'סגול': 'purple',
    'צהוב': 'yellow',
  };
  validColors = Object.keys(this.colorMap);
  defaultSpots = null;
  defaultColor = null

  getCodeParts() {
    if (this.level === 'easy') {
      return [
        { type: 'text', value: 'צבע = ' },
        { type: 'input', default: this.defaultColor },
        { type: 'text', value: '\n' },
        { type: 'text', value: 'נקודות = ' },
        { type: 'input', default: this.defaultSpots },
      ];
    } else {
      return [
        { type: 'text', value: 'צבע = ' },
        { type: 'input', default: this.defaultColor },
        { type: 'text', value: '\n' },
        { type: 'text', value: 'נקודות = ' },
        { type: 'input', default: this.defaultSpots },
      ];
    }
  }

  composeImageHtml(vars) {
    return this.getDefaultHtml();
    
    // const { color, spots } = vars;
    // const colorKey = this.colorMap[color] || color;
    // //const forestImg = `ex1/forest_${colorKey}.png`;
    // //const cloudsImg = clouds !== '0' ? `ex1/clouds_${clouds}.png` : null;
    // let html = `<div style="position:relative;display:inline-block;">`;
   
    // html += `<img src='${forestImg}' alt='forest' style='position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;'>`;
    // if (cloudsImg) {
    //   html += `<img src='${cloudsImg}' alt='clouds' style='position:absolute;top:0;left:0;width:100%;height:100%;z-index:3;'>`;
    // }
    // html += `<img src='${forestImg}' alt='' style='visibility:hidden;position:relative;width:100%;height:auto;'>`;
    // html += '</div>';
    // return html;
  }

  getDefaultHtml() {
    const img = 'ex2/mushrooms_def.png';  
    let html = `<div class="image-container">`;
    html += `<img src='${img}' alt='forest' class="main-image" style="z-index: 2;">`;
    html += '</div>';
    return html;
  }

  handleRun({ selects, inputs }) {
    let color, clouds, rainbow;
    if (this.level === 'easy') {
      [color, spots] = Array.from(inputs).map(s => s.value);
    } else {
      [code] = Array.from(inputs).map(i => i.value.trim());
    }
   // if (!this.isValid(color, clouds, rainbow)) return null;
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
    return 'כל הכבוד! אפשר לנסות לשנות שוב את היער!';
  }

  getErrorMessage() {
    return 'נסה שוב. ודא שבחרת צבע, מספר עננים, וקשת תקינים.';
  }
}

export default new Exercise2();
