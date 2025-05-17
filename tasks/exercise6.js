import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';
class Exercise6 extends Exercise {
  constructor() {
    super("ex6");
    this.input_sizes = {'easy': 'small', 'hard': 'medium'};
  }

  inputKey;
  inputSymbol;
  inputColor;
getCodeParts() {
    let key_field, color_field, unlock_line, combined;
    if (this.level === 'easy') {
      key_field = this.createFieldDisplayDetails({pretext: `${hebrewDict.if} `, new_line: false}); 
      color_field = this.createFieldDisplayDetails({pretext: ` == `, posttext: ':'});
      unlock_line = this.createFieldDisplayDetails({pretext: `${hebrewDict.ex6.unlock_line}`, indentation: true, new_line: false, field_type: "text"});
      combined = key_field.concat(color_field, unlock_line);
      return combined;
    } else {
      key_field = this.createFieldDisplayDetails({posttext: ':'});
      unlock_line = this.createFieldDisplayDetails({pretext: `${hebrewDict.ex6.unlock_line}`, indentation: true, new_line: false, field_type: "text"});
      combined = key_field.concat(unlock_line);
      return combined;
    }
  }

composeImageHtml(vars) {
    let doorImg = this.isCorrect()["valid"] ? this.path('door_open.png') : this.path('door_closed.png');
    return this.generateImageHTML([doorImg]);
  }

getDefaultHtml() {
    return this.composeImageHtml();
  }

extractInputs(selects, inputs) {
  let key_string, symbol_string, color_string, full_string;
  if (this.level === 'easy') {
    [key_string, color_string] = Array.from(inputs).map(s => s.value.trim());
  } else {
    [full_string] = Array.from(inputs).map(s => s.value.trim());
    const match = full_string.match(/^(.+?)\s*([=!<>]+)\s*(.+)$/);
    if (match) {
      key_string = match[1].trim();
      symbol_string = match[2].trim();
      color_string = match[3].trim();
    } else {
      key_string = '';
      symbol_string = '';
      color_string = '';
    }
  }
  return {key_string, symbol_string, color_string};
  }
handleRun() {
    return this.composeImageHtml();
  }

isCorrect() {
  if (this.level === "hard" && this.inputSymbol !== "==")
  {
    return{valid: false, message: hebrewDict.ex6.error_wrong_symbol}
  }
  if (this.inputKey === hebrewDict.ex6.key && this.inputColor === hebrewDict.colors.blue) {
    return { valid: true, message: hebrewDict.ex6.success };
  }
  return { valid: false, message: hebrewDict.ex6.error_but_valid };
  }
  isValid() {
    if (this.level === "hard" && this.inputSymbol !== "==")
    {
      return{valid: false, message: hebrewDict.ex6.error_wrong_symbol};
    }
    return ({valid: true, message: ''});
  }
  validate({selects, inputs}) {
    const { key_string, symbol_string, color_string } = this.extractInputs(selects, inputs);
    this.inputKey = key_string;
    this.inputSymbol = symbol_string;
    this.inputColor = color_string;
    return this.isValid();
  }
}
export default new Exercise6();