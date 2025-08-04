import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';
class Exercise7 extends Exercise {
  constructor() {
    super("ex7");
    this.input_sizes = { 'easy': 'small', 'hard': 'medium' };
    this.resultImgBg = '#d7e0eb'; 
  }

  inputIfWord;
  inputKey;
  inputSymbol;
  inputColor;

  getCodeParts() {
    let key_field, color_field, unlock_line, combined;
    if (this.level === 'easy') {
      key_field = this.createFieldDisplayDetails({ pretext: `${hebrewDict.if} `, new_line: false });
      color_field = this.createFieldDisplayDetails({ pretext: ` == `, posttext: ':' });
      unlock_line = this.createFieldDisplayDetails({ pretext: `${hebrewDict.ex7.unlock_line}`, indentation: true, new_line: false, field_type: "text" });
      combined = key_field.concat(color_field, unlock_line);
      return combined;
    } else {
      key_field = this.createFieldDisplayDetails({ posttext: ':' });
      unlock_line = this.createFieldDisplayDetails({ pretext: `${hebrewDict.ex7.unlock_line}`, indentation: true, new_line: false, field_type: "text" });
      combined = key_field.concat(unlock_line);
      return combined;
    }
  }

  composeImageHtml(vars) {
    let doorImg = this.isCorrect()["valid"] ? this.path('door_open.png') : this.path('door_closed.png');
    return this.generateImageHTML([doorImg]);
  }

  getDefaultHtml() {
    return this.generateImageHTML([this.path('door_closed.png')]);
  }

  extractInputs(inputs) {
    let full_string, key_string, symbol_string, color_string, if_word;
    if (this.level === 'easy') {
      [key_string, color_string] = Array.from(inputs).map(s => s.value.trim());
      if_word = hebrewDict.if;
      symbol_string = '==';
    } else {
      [full_string] = Array.from(inputs).map(s => s.value.trim());
      if (full_string.startsWith(hebrewDict.if)) {
        full_string = full_string.slice(hebrewDict.if.length).trim();
        if_word = hebrewDict.if;
      }
      const match = full_string.match(/^(\S+?)\s*([<>=!]+)\s*(\S+)$/);
      if (match) {
        key_string = match[1].trim();     // "מפתח"
        symbol_string = match[2].trim();   // "=="
        color_string = match[3].trim();    // צבע
      }
      if (color_string == hebrewDict.ex7.key) {
        let temp = key_string;
        key_string = color_string;
        color_string = temp;
      }
    }
    return { if_word, key_string, symbol_string, color_string };
  }

  handleRun() {
    return this.composeImageHtml();
  }

  isCorrect() {
    if (this.inputKey === hebrewDict.ex7.key && this.inputColor === hebrewDict.colors.blue) {
      return { valid: true, message: hebrewDict.ex7.success };
    }
    return { valid: false, message: hebrewDict.ex7.error_but_valid };
  }

  validate({ inputs }) {
    const { if_word, key_string, symbol_string, color_string } = this.extractInputs(inputs);
    this.inputIfWord = if_word;
    this.inputKey = key_string;
    this.inputSymbol = symbol_string;
    this.inputColor = color_string;

    if (this.inputIfWord !== hebrewDict.if) {
      return { valid: false, message: hebrewDict.ex7.if_error };
    }

    if (!this.inputKey && !this.inputSymbol && !this.inputColor) {
      return { valid: false, message: hebrewDict.ex7.error_message };
    }

    if (this.inputKey !== hebrewDict.ex7.key) {
      return { valid: false, message: hebrewDict.ex7.key_error };
    }

    if (this.inputSymbol !== '==') {
      return { valid: false, message: hebrewDict.ex7.error_wrong_symbol };
    }

    if (!this.inputColor) {
      return { valid: false, message: hebrewDict.ex7.color_empty_error };
    }
    
    return { valid: true, message: '' };

  }
}
export default new Exercise7();