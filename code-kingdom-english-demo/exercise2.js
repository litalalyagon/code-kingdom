import { Exercise } from './exercise.js';
import { englishDict } from './english-dict.js';

class Exercise2 extends Exercise {
  constructor() {
    super("ex2");
    this.enabled = false; 
    this.input_sizes = {'easy': 'small', 'hard': 'medium'};
    this.resultImgBg = '#845e37';
  }
  validColors = [
    englishDict.colors.blue,
    englishDict.colors.green,
    englishDict.colors.pink,
    englishDict.colors.purple,
    englishDict.colors.red,
    englishDict.colors.yellow,
  ]
  validSpots = ['0', '1', '2', '3', '4', '5'];
  inputColor = '';
  inputSpots = '';

  getCodeParts() {
    let color_field, spots_field;
    if (this.level === 'easy') {
      color_field = this.createFieldDisplayDetails({pretext: `${englishDict.ex2.mushrooms_color} = `});
      spots_field = this.createFieldDisplayDetails({pretext: `${englishDict.ex2.spots} = `}); 
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
    const colorKey = Object.keys(englishDict.colors).find(key => englishDict.colors[key] === color);
    
    const backgroundImg = this.path('mushrooms_bg.png');
    const mushroomImg = this.path(`mushroom_${colorKey}.png`);
    const spotsImg = spots !== '0' ? this.path(`spots_${spots}.png`) : null;
  
    return this.generateImageHTML([backgroundImg, mushroomImg, spotsImg]);
  }

  getDefaultHtml() {
    const backgroundImg = this.path('mushrooms_bg.png');  
    const mushroomImg = this.path('mushroom_missing.png');
    return this.generateImageHTML([backgroundImg, mushroomImg]);
  }

  extractInputs(inputs) {
    let input1, input2, val1, val2, varName1, varName2;
    if (this.level === 'easy') {
      [val1, val2] = Array.from(inputs).map(s => s.value.trim());
      varName1 = englishDict.ex2.mushrooms_color;
      varName2 = englishDict.ex2.spots;      
    }
    else {
      [input1, input2] = Array.from(inputs).map(i => i.value.trim());
      [varName1, val1]  = this.extractSingleInput(input1);
      [varName2, val2]  = this.extractSingleInput(input2);
    }
    return {varName1, val1, varName2, val2};
  }

  extractSingleInput(input) {
    const regex = /^\s*([a-zA-Z ]+)\s*=\s*([a-zA-Z0-9.\-]+)\s*$/;
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
    if (this.inputColor === englishDict.colors.red && this.inputSpots === "4"){
      return { valid: true, message: englishDict.ex2.success };
    } else {
      return { valid: false, message: englishDict.ex2.wrong_answer };
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
     if ((!val1 && !varName1) || (!val2 && !varName2)) {
        return { valid: false, message: englishDict.general_error_message };
     }
     if (!val1 || !val2) {
        return { valid: false, message: englishDict.ex2.empty_value_error };
     }
      if (!varName1 || !varName2) {
        return { valid: false, message: englishDict.ex2.empty_key_error };
      }

      if (varName1 === englishDict.ex2.mushrooms_color) {
        color = val1;
      } else if (varName1 === englishDict.ex2.spots) {
        spots = val1;
      } else {
        return { valid: false, message: englishDict.ex2.failure_var_doesnt_exist };
      }

     if (varName2 === englishDict.ex2.mushrooms_color) {
        color = val2;
      } else if (varName2 === englishDict.ex2.spots) {
        spots = val2;
      } else {
        return { valid: false, message: englishDict.ex2.failure_var_doesnt_exist };
      }

      if (varName1 === varName2) {
        return { valid: false, message: englishDict.ex2.failure_var_is_missing };
      }
    
     if (!this.isValid(color, spots)) {
        return { valid: false, message: this.getErrorMessage(color, spots) };
    }    

    this.inputColor = color;
    this.inputSpots = spots;

    return { valid: true, message: ""};
  }

  getErrorMessage(color, spots) {
    let message = [];
    if (!this.validColors.includes(color)) {
      message.push(englishDict.ex2.color_error);
    }
    if (!this.validSpots.includes(spots)) {
      if (isNaN(spots)) {
        message.push(englishDict.ex2.spots_not_number);
      }
      else if (!Number.isInteger(Number(spots))) {
        message.push(englishDict.ex2.spots_not_integer);
      }
      else {
        message.push(englishDict.ex2.spots_error);
      }
    }
    return message.join('<br>');
  }
}

export default new Exercise2();
