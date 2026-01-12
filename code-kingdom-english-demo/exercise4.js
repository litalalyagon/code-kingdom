import { Exercise } from './exercise.js';
import { englishDict } from './english-dict.js';

class Exercise4 extends Exercise {
  constructor() {
    super("ex4");
    this.enabled = false;
    this.input_sizes = {'easy': 'large', 'hard': 'xlarge'};
    this.resultImgBg = '#bfe5ef'; 
  }
  levelFieldTypes = {'easy': 'input', 'hard': 'input'};
  defaultBridgeState = englishDict.ex4.first_bridge;
  inputVariable;
  inputEqualSign;
  inputBridgeState;
  inputFirstBridge;
  inputSecondBridge;
  
  getCodeParts() {
    let full_field;
    const pretext = this.level === 'easy' ? `${englishDict.ex4.bridge_var} = ` : ''; 
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
    } else if (!secondBridge) {
      bridgeImg = this.path('bridge_broken.png');
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
    let variable = '', equal_sign = '', firstBridge = '', sign = '', secondBridge = '';
    let full_string, match;
    [full_string] = Array.from(inputs).map(s => s.value.trim());
    if (this.level === 'easy') {
      full_string = englishDict.ex4.bridge_var + ' = ' + full_string;
     }

    // separate the new bridge input first
    if (!full_string.includes('=')) {
      return { variable: full_string, equal_sign, firstBridge, sign, secondBridge };
    }

    variable = full_string.split('=')[0].trim();
    equal_sign = '=';
    const value = full_string.split('=')[1].trim();
    
    if (!value.includes('+') && !value.includes('-')) {
      return { variable, equal_sign, firstBridge: value, sign, secondBridge };
    }

    match = value.match(/^(.+?)\s*([+-])\s*(.+)$/);
    if (match) {
      const firstBridge = match[1].trim();
      const sign = match[2] ? match[2] : '';
      const secondBridge = match[3] ? match[3].trim() : '';
      return { variable, equal_sign, firstBridge, sign, secondBridge };
    }
    else {
      return { variable, equal_sign, firstBridge, sign, secondBridge };
    }
  }

  handleRun() {
    return this.composeImageHtml({firstBridge: this.inputFirstBridge, sign: this.inputSign, secondBridge: this.inputSecondBridge});
  }

  isCorrect() {
    if (this.level === 'hard') {
      if (this.inputVariable !== englishDict.ex4.bridge_var) {
        return {valid: false, message: englishDict.ex4.error_var_doesnt_exist};
      } 
      if (this.inputEqualSign !== '=') {
        return {valid: false, message: englishDict.ex4.error_equals_doesnt_exist};
      }
    }
    if (this.sign !== '+') {
      return { valid: false, message: englishDict.ex4.error_no_plus_sign};
    }
    if ((this.firstBridge === englishDict.ex4.first_bridge && this.secondBridge === englishDict.ex4.second_bridge) ||
        (this.firstBridge === englishDict.ex4.second_bridge && this.secondBridge === englishDict.ex4.first_bridge)) {
      return { valid: true, message: englishDict.ex4.success };
    }
    return { valid: false, message: englishDict.ex4.valid_but_wrong};
  }

  isValidStringHelper(str) {
    let s = str;
    if (!s) {
      return false;
    }
    s = s.replaceAll(englishDict.ex4.first_bridge, '');
    s = s.replaceAll(englishDict.ex4.second_bridge, '');
    s = s.replace(/\d+/g, '');
    s = s.replace(/[+-]/g, '');
    s = s.replace(/\s+/g, '');
    return s === '';
  }

  isValid(vars) {
    let {variable, equal_sign, firstBridge, sign, secondBridge} = vars;
    
    this.inputVariable = variable;
    this.inputEqualSign = equal_sign;
    this.inputFirstBridge = firstBridge;
    this.inputSign = sign;
    this.inputSecondBridge = secondBridge;

    if (!variable || variable !== englishDict.ex4.bridge_var) {
      return {valid: false, message: englishDict.ex4.empty_new_bridge_error};
    }
    if (!equal_sign || equal_sign !== '=') {
      return {valid: false, message: englishDict.ex4.error_equals_doesnt_exist};
    } 
     if (!firstBridge && !secondBridge && !sign) {
      return {valid: false, message: englishDict.ex4.empty_error};
    }
   
    if (this.isValidStringHelper(firstBridge) ||
        this.isValidStringHelper(secondBridge)) {
          return {valid: true, message: ''};
    }
    return {valid: false, message: englishDict.general_error_message};
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
