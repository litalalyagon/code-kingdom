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
      color_field = this.createFieldDisplayDetails({pretext: `${hebrewDict.ex2.mushrooms_color} = `, valid_values: this.validColors, default_value: this.defaultColor});
      spots_field = this.createFieldDisplayDetails({pretext: `${hebrewDict.ex2.spots} = `, valid_values: this.validSpots, default_value: this.defaultSpots}); 
    }
    else {
      color_field = this.createFieldDisplayDetails({default_value: this.defaultColor});
      spots_field = this.createFieldDisplayDetails({default_value: this.defaultSpots});
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

  extractInputs(selects, inputs, only_values=false) {
    let color_string, spots_string, color_var, spots_var, color, spots;
    if (this.level === 'easy') {
      [color, spots] = Array.from(inputs).map(s => s.value.trim());
    }
    else {
      [color_string, spots_string] = Array.from(inputs).map(i => i.value.trim());
      const color_parts = color_string.split('=');
      if (color_parts.length < 2) return '';
      color_var = color_parts[0].trim();
      color = color_parts[1].trim();

      const spots_parts = spots_string.split('=');
      if (spots_parts.length < 2) return '';
      spots_var = spots_parts[0].trim();
      spots = spots_parts[1].trim();
    }
    if (only_values) return { color, spots };
    return {color_var, color, spots_var, spots};
  }

  handleRun({ selects, inputs }) {
    const {color, spots} = this.extractInputs(selects, inputs, true);
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
      const {color, spots} = this.extractInputs(selects, inputs);
      console.log(color, spots);
      if (!this.isValid(color, spots)) {
        return { valid: false, message: this.getErrorMessage() };
      }
    }
    else {
      const {color_var, color, spots_var, spots} = this.extractInputs(selects, inputs);
      if (!this.isValid(color, spots)) {
        return { valid: false, message: this.getErrorMessage() };
      }
      if (color_var !== 'צבע' || spots_var !== 'נקודות') {
        return { valid: false, message: hebrewDict.ex2.fields_error_message };
      }
    }

    return { valid: true, message: this.getValidMessage()};
  }

  getValidMessage() {
    return hebrewDict.ex2.success;
  }

  getErrorMessage() {
    return hebrewDict.ex2.error_message;
  }
}

export default new Exercise2();
