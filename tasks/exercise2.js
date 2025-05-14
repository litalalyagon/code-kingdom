import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise2 extends Exercise {
  constructor() {
    super('משימה 2: הפטריות הקסומות');
  }
  levelFieldTypes = {'easy': 'input', 'hard': 'input'};
  validColors = ['כחול', 'ירוק', 'ורוד', , 'סגול', 'אדום', 'צהוב'];
  validSpots = ['0', '1', '2', '3', '4', '5'];
  defaultSpots = 1;
  defaultColor = "אדום";

  getCodeParts() {
    let color_field, spots_field;
    if (this.level === 'easy') {
      color_field = this.createFieldDisplayDetails(`${hebrewDict.ex2.mushrooms_color} = `, null, this.validColors, this.defaultColor);
      spots_field = this.createFieldDisplayDetails(`${hebrewDict.ex2.spots} = `, null, this.validSpots, this.defaultSpots);
    }
    else {
      color_field = this.createFieldDisplayDetails(null, null, null, this.defaultColor);
      spots_field = this.createFieldDisplayDetails(null, null, null, this.defaultSpots);
    }
    const combined = color_field.concat(spots_field);

    return combined;
  }

  composeImageHtml(vars) {
    const {color, spots} = vars;
    const colorKey = Object.keys(hebrewDict.colors).find(key => hebrewDict.colors[key] === color);
    
    const backgroundImg = 'ex2/mushrooms_bg.png'
    const mushroomImg = `ex2/mushroom_${colorKey}.png`;
    const spotsImg = spots !== '0' ? `ex2/spots_${spots}.png` : null;
  
    return this.generateImageHTML([backgroundImg, mushroomImg, spotsImg]);
  }

  getDefaultHtml() {
    const backgroundImg = 'ex2/mushrooms_bg.png';  
    const mushroomImg = 'ex2/mushroom_missing.png';
    return this.generateImageHTML([backgroundImg, mushroomImg]);
  }

  handleRun({ selects, inputs }) {
    let color, spots;
    [color, spots] = Array.from(inputs).map(i => i.value.trim());
    return this.composeImageHtml({color, spots});
  }

  isCorrect(color, spots) {
    return (
      color === "אדום" && spots === "4"
    );
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
      return { valid: true, message: this.getValidMessage() };
    }
    return { valid: true, message: this.getErrorMessage() };
  }

  getValidMessage() {
    return hebrewDict.ex2.success;
  }

  getErrorMessage() {
    return hebrewDict.ex2.error_message;
  }
}

export default new Exercise2();
