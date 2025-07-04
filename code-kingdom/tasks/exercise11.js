import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise11 extends Exercise {
  constructor() {
    super("ex11"); 
    this.input_sizes = {'easy': 'small', 'hard': 'medium'};
  }

  inputFlame = '';

  getCodeParts() {
    let field;
    if (this.level === 'easy') {
      field = this.createFieldDisplayDetails({new_line: false});
      field = field.concat(this.createFieldDisplayDetails({pretext: '='})); 
    }
    else {
       field = this.createFieldDisplayDetails({});
    }

    return field;
  }

  composeImageHtml(flame) {
    let flameImg, arrowImg;
    const backgroundImg = this.path('background.png');
    if (flame == 0) {
      flameImg = null;
      arrowImg = this.path('arrow_0.png');
    } else if (flame < 25) {
      flameImg = this.path('flame_small.png');
      arrowImg = this.path('arrow_low.png');
    } else if (flame == 25) {
      flameImg = this.path('flame_small.png');
      arrowImg = this.path('arrow_25.png');
    } else if (flame < 50) {
      flameImg = this.path('flame_medium.png');
      arrowImg = this.path('arrow_medium.png');
    } else if (flame == 50) {
      flameImg = this.path('flame_large.png');
      arrowImg = this.path('arrow_50.png');
    } else {
      flameImg = this.path('flame_large.png');
      arrowImg = this.path('arrow_high.png');
    }
    
    // the background should be on the top of the other images in this case
    return this.generateImageHTML([flameImg, arrowImg, backgroundImg]);
  }

  getDefaultHtml() {
    return this.composeImageHtml(0);
  }

  extractInputs(inputs) {
    let val, varName;
    if (this.level === 'easy') {
      [varName, val] = Array.from(inputs).map(s => s.value.trim());
    }
    else {
      const [input] = Array.from(inputs).map(i => i.value.trim());
      [varName, val]  = this.extractSingleInput(input);
    }
    return {varName, val};
  }

  extractSingleInput(input) {
    const regex = /^\s*([\u0590-\u05FF]+)\s*=\s*([0-9]+)\s*$/;
      
      const match = input.match(regex);
      if (!match) {
        return [null, null];
      }
      const varName = match[1].trim();
      const val = match[2].trim();
      return [ varName, val ];
  }

  handleRun() {
    return this.composeImageHtml(this.inputFlame);
  }


  isCorrect() {
    if (this.inputFlame > 25 && this.inputFlame < 50) {
    return {valid: true, message: hebrewDict.ex11.success};
    } else {
      return {valid: false, message: hebrewDict.ex11.wrong_answer};
    }
  }
  
  validate({ inputs }) {
    const {varName, val} = this.extractInputs(inputs);
     if (!varName || !val) {
        return { valid: false, message: hebrewDict.ex11.error_message };
     }

     if (varName !== hebrewDict.ex11.flame) {
        return { valid: false, message: hebrewDict.ex11.failure_var_doesnt_exist };
      }

    // check if the value is a number
    if (isNaN(val) || val < 0) {
      return { valid: false, message: hebrewDict.ex11.flame_error };
    }

    // set the values
    this.inputFlame = parseInt(val, 10);

    return { valid: true, message: ""};
  }

  getValidMessage() {
    return hebrewDict.ex11.success;
  }
}

export default new Exercise11();
