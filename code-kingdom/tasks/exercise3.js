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

  tree_exists = false;
  calculation_result;

  TREE_HEIGHT = 81869;

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

  composeImageHtml() {
    const ladder = this.calculation_result;
    const cliff = this.TREE_HEIGHT + 3;

    const backgroundImg = this.path('ex3_def.png');

    let ladderImg = '';
    if (ladder === cliff) {
      ladderImg = this.path('ladder_correct.png');
    }
    else if (ladder > cliff) {
      ladderImg = this.path('ladder_long.png');
    }
    else if (ladder > this.TREE_HEIGHT + 1) {
      ladderImg = this.path('ladder_tree_2.png');
    }
    else if (ladder > this.TREE_HEIGHT) {
      ladderImg = this.path('ladder_tree_1.png');
    } 
    else if (ladder === this.TREE_HEIGHT) {
      ladderImg = this.path('ladder_tree.png');
    }
    else {
      ladderImg = this.path('ladder_short.png');
    }
    return this.generateImageHTML([backgroundImg, ladderImg]);
  }

  getDefaultHtml() {
    const backgroundImg = this.path('ex3_def.png');
    return this.generateImageHTML([backgroundImg]);
  }

  extractInputs(selects, inputs) {
    let tree_exists = false, full_string;
    if (this.level === 'easy') {
      const [var1, var2] = Array.from(inputs).map(s => s.value.trim());
      if (!var1 || !var2) {
        return { tree_exists: true, value: '' };
      }
      // Combine all input values into a single string for both levels
      full_string = `${var1} + ${var2}`;
    } else {
      [full_string] = Array.from(inputs).map(i => i.value.trim());
    }

    // Handle empty input
    if (!full_string) {
      return { tree_exists, value: '' };
    }

    // check if the tree varaible is present, and replace it with a default value
    // if can be one of valid_tree_phrases
    if (full_string.includes(hebrewDict.ex3.valid_tree_phrases[1])) {
      tree_exists = true; 
      full_string = full_string.replace(new RegExp(hebrewDict.ex3.valid_tree_phrases[1], 'g'), String(this.TREE_HEIGHT));
    }
    if (full_string.includes(hebrewDict.ex3.valid_tree_phrases[0])) {
      tree_exists = true;
      full_string = full_string.replace(new RegExp(hebrewDict.ex3.valid_tree_phrases[0], 'g'), String(this.TREE_HEIGHT));
    }

    return { tree_exists, value: full_string };
  }

  handleRun() {
    return this.composeImageHtml();
  }

  isCorrect() {
    if (this.calculation_result < this.TREE_HEIGHT + 3) {
       return { valid: false, message: hebrewDict.ex3.too_short_error };
    }
    if (this.calculation_result > this.TREE_HEIGHT + 3) {
      return { valid: false, message: hebrewDict.ex3.too_long_error };
    }
    if (this.calculation_result === this.TREE_HEIGHT + 3) {
      return { valid: true, message: this.getValidMessage() };
    }
  }


  validate({ selects, inputs }) {
    const { tree_exists, value } = this.extractInputs(selects, inputs);
    this.tree_exists = tree_exists;

    if (!tree_exists) {
      return { valid: false, message: hebrewDict.ex3.error_tree_phrase };
    }

     // we should check the value it's all numbers and signs, not letters
    if (!/^[\d.\s\+\-]+$/.test(value)) {
      return { valid: false, message: hebrewDict.general_error_message };
    }

    this.calculation_result = this.calculateResultFromString(value);
    if (isNaN(this.calculation_result)) {
      return { valid: false, message: hebrewDict.general_error_message };
    }
    return { valid: true, message: '' };
  }

  getValidMessage() {
    return hebrewDict.ex3.success;
  }

  getErrorMessage() {
    return hebrewDict.ex3.error_message;
  }
}

export default new Exercise3();