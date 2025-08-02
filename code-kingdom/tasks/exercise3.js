import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise3 extends Exercise {
  constructor() {
    super("ex3");
    this.input_sizes = {'easy': 'small', 'hard': 'large'};
    this.resultImgBg = '#d6ebd9'; 
  }
  inputTree;
  inputBird;
  getCodeParts() {
      let tree_field, bird_field, full_field;
      if (this.level === 'easy') {
        tree_field = this.createFieldDisplayDetails({pretext: `${hebrewDict.ex3.ladder} = `, new_line: false});
        bird_field = this.createFieldDisplayDetails({pretext: ` + `}); 
        const combined = tree_field.concat(bird_field);
        return combined;
      }
      else {
        full_field = this.createFieldDisplayDetails({pretext: `${hebrewDict.ex3.ladder} = `});
      }
      return full_field;
  }
  composeImageHtml(vars) {
    const {sign, bird} = vars;
    let bird_num = parseInt(bird, 10);
    if (sign === '-') {
      bird_num = -bird_num;
    }

    const backgroundImg = this.path('ex3_def.png');
    let ladderImg = '';
    if (bird_num==3) {
      ladderImg = this.path('ladder_correct.png');
    }
    else if (bird_num == 2) {
      ladderImg = this.path('ladder_tree_2.png');
    }
    else if (bird_num == 1) {
      ladderImg = this.path('ladder_tree_1.png');
    } 
    else if (bird_num==0) {
      ladderImg = this.path('ladder_tree.png');
    }
    else if (bird_num < 0) {
      ladderImg = this.path('ladder_short.png');
    }  
    else {
      ladderImg = this.path('ladder_long.png');
    }
    return this.generateImageHTML([backgroundImg, ladderImg]);
  }
  getDefaultHtml() {
    const backgroundImg = this.path('ex3_def.png');
    return this.generateImageHTML([backgroundImg]);
  }
  extractInputs(selects, inputs, only_values=false) {
    let tree, sign, bird, full_string;
    if (this.level === 'easy') {
      [tree, bird] = Array.from(inputs).map(s => s.value.trim());
      sign = '+';
    }
    else {
      [full_string] = Array.from(inputs).map(i => i.value.trim());
      const match = full_string.match(/^(.+)\s*([+-])\s*(\d+(?:\.\d+)?)$/);
      if (match) {
        tree = match[1].trim();
        sign = match[2];
        bird = match[3].trim();
      } else {
        tree = '';
        sign = '';
        bird = '';
      }
    }
    return {tree, sign, bird}
  }
  handleRun({ selects, inputs }) {
    const {sign, bird} = this.extractInputs(selects, inputs, true);
    return this.composeImageHtml({sign, bird});
  }

  isCorrect() {
    const inputBirdNum = parseFloat(this.inputBird);
    if (this.sign === "+") {
      if (inputBirdNum === 3) {
        return { valid: true, message: this.getValidMessage()};
      }
      if (inputBirdNum < 3) {
        return { valid: false, message: hebrewDict.ex3.too_short_error};
      }
      if (inputBirdNum > 3) {
        return { valid: false, message: hebrewDict.ex3.too_long_error};
      }
    }
    // At this point, the sign is surely '-' and we don't handle negative numbers
    return { valid: false, message: hebrewDict.ex3.too_short_error};
 //   return { valid: false, message: "קלט תקין אבל לא"};
  }


  validate({selects, inputs}) {
    const {tree, sign, bird} = this.extractInputs(selects, inputs);
    this.inputTree = tree;
    this.inputBird = bird;
    this.sign = sign;
    
    if (!tree && !sign && !bird) {
      return {valid: false, message: hebrewDict.ex3.error_message};
    }

    if (!hebrewDict.ex3.valid_tree_phrases.includes(tree)) {
      return {valid: false, message: hebrewDict.ex3.error_tree_phrase};
    }

    if (!(['+', '-'].includes(sign))) {
      return {valid: false, message: hebrewDict.ex3.error_sign_phrase};
    }

    if (isNaN(bird)) {
      return {valid: false, message: hebrewDict.ex3.error_bird_number};
    }

    return { valid: true, message: ''};
  }

  getValidMessage() {
    return hebrewDict.ex3.success;
  }

  getErrorMessage() {
    return hebrewDict.ex3.error_message;
  }
}
export default new Exercise3();