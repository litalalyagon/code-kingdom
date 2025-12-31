import { Exercise } from './exercise.js';
import { englishDict } from './english-dict.js';

class Exercise11 extends Exercise {
  constructor() {
    super("ex11");
    this.enabled = true; 
    this.input_sizes = {'easy': 'small', 'hard': 'medium'};
    this.resultImgBg = '#d7e0eb';
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
    const regex = /^\s*([a-zA-Z]+)\s*=\s*(\S+)$/;
      
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
    if (this.inputFlame <= 25) {
      return {valid: false, message: englishDict.ex11.error_too_low};
    } else if (this.inputFlame >= 50) {
      return {valid: false, message: englishDict.ex11.error_too_high};
    }
    return {valid: true, message: englishDict.ex11.success};
  }
  
  validate({ inputs }) {
    const {varName, val} = this.extractInputs(inputs);
     if (!varName || !val) {
        return { valid: false, message: englishDict.general_error_message };
     }

     if (varName !== englishDict.ex11.flame) {
        return { valid: false, message: englishDict.ex11.failure_var_doesnt_exist };
      }

    // we should check the value it's all numbers and signs, not letters
    if (!/^[\d.\s\+\-]+$/.test(val)) {
      return { valid: false, message: englishDict.ex11.flame_value_error  };
    }

    const calc_result = this.calculateResultFromString(val);
    if (isNaN(calc_result) || calc_result < 0) {
      return { valid: false, message: englishDict.ex11.flame_value_error };
    }

    // set the values
    this.inputFlame = calc_result;

    return { valid: true, message: ""};
  }

  getValidMessage() {
    return englishDict.ex11.success;
  }
}

export default new Exercise11();
