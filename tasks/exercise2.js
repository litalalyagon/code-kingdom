import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise2 extends Exercise {
  constructor() {
    super('משימה 2: הפטריות הקסומות');
  }
  levelFieldTypes = {'easy': 'dropdown', 'hard': 'input'};
  validColors = ['כחול', 'ירוק', 'ורוד', , 'סגול', 'אדום', 'צהוב'];
  validSpots = ['0', '1', '2', '3', '4', '5'];
  defaultSpots = 1;
  defaultColor = "אדום";

  getCodeParts() {
    const color_field = this.createFieldDisplayDetails(`${hebrewDict.ex2.mushrooms_color} = `, null, this.validColors, this.defaultColor);
    const spots_field = this.createFieldDisplayDetails(`${hebrewDict.ex2.spots} = `, null, this.validSpots, this.defaultSpots);
    const combined = color_field.concat(spots_field);
    console.log(combined);
    combined.pop();
    return combined;
  }

  composeImageHtml(vars) {
    const {color, spots} = vars;
    const colorKey = Object.keys(hebrewDict.colors).find(key => hebrewDict.colors[key] === color);
    
    const backgroundImg = 'ex2/mushrooms_def.png'
    const mushroomImg = `ex2/mushroom_${colorKey}.png`;
    const spotsImg = spots !== '0' ? `ex2/spots_${spots}.png` : null;
  
    return this.generateImageHTML([backgroundImg, mushroomImg, spotsImg]);
  }

  getDefaultHtml() {
    const backgroundImg = 'ex2/mushrooms_bg.png';  
    const mushroomImg = `ex2/mushroom_missing.png`;
    let html = `<div class="image-container">`;
    html += `<img src='${img}' alt='forest' class="main-image" style="z-index: 2;">`;
    html += '</div>';
    return html;
  }

  handleRun({ selects, inputs }) {
    let color, spots;
    if (this.level === 'easy') {
      [color, spots] = Array.from(selects).map(s => s.value);
    } else {
      [code] = Array.from(inputs).map(i => i.value.trim());
    }
   // if (!this.isValid(color, clouds, rainbow)) return null;
    return this.composeImageHtml({color, spots});
  }

  isValid(color, spots) {
    return (
      this.validColors.includes(color) &&
      this.validSpots.includes(spots)
    );
  }

  validate({ selects, inputs }) {
    let color, spots;
    if (this.level === 'easy') {
      [color, spots] = Array.from(selects).map(s => s.value);
    } else {
      [color, spots] = Array.from(inputs).map(i => i.value.trim());
    }
    if (this.isValid(color, spots)) {
      return { valid: true, message: this.getCorrectMessage() };
    }
    return { valid: false, message: this.getErrorMessage() };
  }

  getCorrectMessage() {
    return hebrewDict.ex2.success;
  }

  getErrorMessage() {
    return hebrewDict.ex2.error_message;
  }
}

export default new Exercise2();
