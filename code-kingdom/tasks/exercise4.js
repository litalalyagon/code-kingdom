import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise4 extends Exercise {
  constructor() {
    super("ex4");
    this.input_sizes = {'easy': 'large', 'hard': 'large'};
    this.resultImgBg = '#bfe5ef'; 
  }
  levelFieldTypes = {'easy': 'input', 'hard': 'input'};
  defaultBridgeState = hebrewDict.ex4.first_bridge;
  inputVariable;
  inputEqualSign;
  inputBridgeState;
  inputFirstBridge;
  inputSecondBridge;
  
  getCodeParts() {
    let full_field;
    const pretext = this.level === 'easy' ? `${hebrewDict.ex4.bridge_var} = ` : ''; 
    full_field = this.createFieldDisplayDetails({pretext: pretext});
    return full_field;
  }
  // Ensure consistency for all exercises
  composeImageHtml(vars) {
    const { firstBridge, sign, secondBridge } = vars;
    let bridgeImg, number;
    const match = secondBridge.match(/^(.+?)\s*([+-])\s*(\d+)$/);
    if (match) {
      const sign = match[2];
      number = parseInt(match[3], 10);
      if (sign === '-') {
        number = -number;
      }
      if (number > 0) {
        bridgeImg = this.path('bridge_long.png');
      }
      if (number < 0) {
        bridgeImg = this.path('bridge_broken.png');
      }
      if (number == 0) {
        bridgeImg = this.path('bridge_complete.png');
      }
    } else if (this.isCorrect()["valid"]) {
      bridgeImg = this.path('bridge_complete.png');
    } else {
      bridgeImg = this.path('bridge_broken.png');
    }
    let backgroundImg = this.path('river.png');
    return this.generateImageHTML([backgroundImg, bridgeImg]);
  }
  getDefaultHtml() {
    return this.composeImageHtml({firstBridge: this.defaultBridgeState, sign: '', secondBridge: ''});
  }
  extractInputs(selects, inputs) {
    let firstBridge, sign, secondBridge, full_string, match;
    [full_string] = Array.from(inputs).map(s => s.value.trim());
    if (this.level === 'easy') {
      match = full_string.match(/^(.+?)\s*([+-])\s*(.+)$/);
      if (match) {
        firstBridge = match[1].trim();
        sign = match[2];
        secondBridge = match[3].trim();
        return { firstBridge, sign, secondBridge };
      }
      return { firstBridge: full_string, sign: '', secondBridge: '' };
    }
    match = full_string.match(/^(.+?)\s*(=)\s*(.+?)(?:\s*([+-])\s*(.+))?$/);
    if (match) {
      const variable = match[1].trim();
      const equal_sign = match[2]; // This will be '='
      const firstBridge = match[3].trim();
      const sign = match[4] ? match[4] : '';
      const secondBridge = match[5] ? match[5].trim() : '';
      return { variable, equal_sign, firstBridge, sign, secondBridge };
    }
    else {
      return { variable: '', equal_sign: '', firstBridge: '', sign: '', secondBridge: '' };
    }
  }

  handleRun() {
    return this.composeImageHtml({firstBridge: this.inputFirstBridge, sign: this.inputSign, secondBridge: this.inputSecondBridge});
  }

  isCorrect() {
    if (this.level === 'hard') {
      if (this.inputVariable !== hebrewDict.ex4.bridge_var) {
        return {valid: false, message: hebrewDict.ex4.error_var_doesnt_exist};
      } 
      if (this.inputEqualSign !== '=') {
        return {valid: false, message: hebrewDict.ex4.error_equals_doesnt_exist};
      }
    }
    if (this.sign !== '+') {
      return { valid: false, message: hebrewDict.ex4.error_no_plus_sign};
    }
    if ((this.firstBridge === hebrewDict.ex4.first_bridge && this.secondBridge === hebrewDict.ex4.second_bridge) ||
        (this.firstBridge === hebrewDict.ex4.second_bridge && this.secondBridge === hebrewDict.ex4.first_bridge)) {
      return { valid: true, message: hebrewDict.ex4.success };
    }
    return { valid: false, message: hebrewDict.ex4.valid_but_wrong};
  }
  isValidStringHelper(str) {
    let s = str;
    if (s === '') {
      return false;
    }
    s = s.replaceAll(hebrewDict.ex4.first_bridge, '');
    s = s.replaceAll(hebrewDict.ex4.second_bridge, '');
    s = s.replace(/\d+/g, '');
    s = s.replace(/[+-]/g, '');
    s = s.replace(/\s+/g, '');
    return s === '';
  }
  isValid(vars) {
    let variable, equal_sign, firstBridge, sign, secondBridge;
    if(this.level === 'easy') {
      ({ firstBridge, sign, secondBridge } = vars);
      this.inputFirstBridge = firstBridge;
      this.inputSign = sign;
      this.inputSecondBridge = secondBridge;
    }
    else {
      ({ variable, equal_sign, firstBridge, sign, secondBridge } = vars);
      this.inputVariable = variable;
      this.inputEqualSign = equal_sign;
      this.inputFirstBridge = firstBridge;
      this.inputSign = sign;
      this.inputSecondBridge = secondBridge;
    }
    if (this.isValidStringHelper(firstBridge) &&
        this.isValidStringHelper(secondBridge)) {
      return { valid: true, message: hebrewDict.ex4.success};
    }
    if (firstBridge === '' && secondBridge === '' && sign === '') {
      return { valid: false, message: hebrewDict.ex4.empty_error};
    }
    return { valid: false, message: hebrewDict.ex4.error_message};
  }
  validate({ selects, inputs }) {
    const vars = this.extractInputs(selects, inputs);
    const { valid, message } = this.isValid(vars);
    if (!valid) {
      return { valid: false, message };
    }
    const { firstBridge, sign, secondBridge } = vars;
    this.sign = sign;
    this.firstBridge = firstBridge;
    this.secondBridge = secondBridge;
    return { valid: true, message: '' };
  }

}
export default new Exercise4();