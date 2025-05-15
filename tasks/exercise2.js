import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise2 extends Exercise {
  constructor() {
    super(hebrewDict.ex2.title);
    this.description = hebrewDict.ex2.description;
    this.input_sizes = {'easy': 'small', 'hard': 'medium'};
  }
  validColors = [
    hebrewDict.colors.blue,
    hebrewDict.colors.green,
    hebrewDict.colors.pink,
    hebrewDict.colors.purple,
    hebrewDict.colors.red,
    hebrewDict.colors.yellow,
  ]
  validSpots = ['0', '1', '2', '3', '4', '5'];
  inputColor = '';
  inputSpots = '';

  getCodeParts() {
    let color_field, spots_field;
    if (this.level === 'easy') {
      color_field = this.createFieldDisplayDetails({pretext: `${hebrewDict.ex2.mushrooms_color} = `});
      spots_field = this.createFieldDisplayDetails({pretext: `${hebrewDict.ex2.spots} = `}); 
    }
    else {
      color_field = this.createFieldDisplayDetails({});
      spots_field = this.createFieldDisplayDetails({});
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

  extractInputs(inputs) {
    let input1, input2, val1, val2, varName1, varName2;
    if (this.level === 'easy') {
      [val1, val2] = Array.from(inputs).map(s => s.value.trim());
      varName1 = hebrewDict.ex2.mushrooms_color;
      varName2 = hebrewDict.ex2.spots;      
    }
    else {
      [input1, input2] = Array.from(inputs).map(i => i.value.trim());
      [varName1, val1]  = this.extractSingleInput(input1);
      [varName2, val2]  = this.extractSingleInput(input2);
    }
    return {varName1, val1, varName2, val2};
  }

  extractSingleInput(input) {
    const regex = /^\s*([\u0590-\u05FF]+)\s*=\s*([\u0590-\u05FF0-9]+)\s*$/;
      
      const match = input.match(regex);
      if (!match) {
        return [null, null];
      }
      const varName = match[1].trim();
      const val = match[2].trim();
      return [ varName, val ];
  }

  handleRun() {
    return this.composeImageHtml({
      color: this.inputColor, 
      spots: this.inputSpots
    });
  }


  isCorrect() {
    if (this.inputColor === hebrewDict.colors.red && this.inputSpots === "4"){
      return { valid: true, message: hebrewDict.ex2.success };
    } else {
      return { valid: false, message: hebrewDict.ex2.wrong_answer };
    }
  }

  isValid(color, spots) {
    return (
      this.validColors.includes(color) &&
      this.validSpots.includes(spots)
    );
  }

  validate({ inputs }) {
    let color, spots;
    const {varName1, val1, varName2, val2} = this.extractInputs(inputs);
     if (!varName1 || !val1 || !varName2 || !val2) {
        return { valid: false, message: hebrewDict.ex2.error_message };
     }

      // analyze the first input
      if (varName1 === hebrewDict.ex2.mushrooms_color) {
        color = val1;
      } else if (varName1 === hebrewDict.ex2.spots) {
        spots = val1;
      } else {
        return { valid: false, message: hebrewDict.ex2.failure_var_doesnt_exist };
      }
      // analyze the second input
     if (varName2 === hebrewDict.ex2.mushrooms_color) {
        color = val2;
      } else if (varName2 === hebrewDict.ex2.spots) {
        spots = val2;
      } else {
        return { valid: false, message: hebrewDict.ex2.failure_var_doesnt_exist };
      }

      if (varName1 === varName2) {
        return { valid: false, message: hebrewDict.ex2.failure_var_is_missing };
      }
    
    // check if the values are valid
     if (!this.isValid(color, spots)) {
        return { valid: false, message: this.getErrorMessage(color, spots) };
    }    

    // set the values
    this.inputColor = color;
    this.inputSpots = spots;

    return { valid: true, message: ""};
  }

  getValidMessage() {
    return hebrewDict.ex2.success;
  }

  getErrorMessage(color, spots) {
    let message = [];
    if (!this.validColors.includes(color)) {
      message.push(hebrewDict.ex2.color_error);
    }
    if (!this.validSpots.includes(spots)) {
      message.push(hebrewDict.ex2.spots_error);
    }
    return message.join('<br>');
  }
}

export default new Exercise2();
