import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise3 extends Exercise {
  constructor() {
    super(hebrewDict.ex3.title);
  }
  levelFieldTypes = {'easy': 'input', 'hard': 'input'};
  validHeights = ['0', '1', '2', '3', '4', '5'];
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
    const {bird} = vars;
    let bird_num = parseInt(bird, 10);
    console.log(bird_num, typeof bird_num);

    const backgroundImg = 'ex3/ex3_def.png'
    let ladderImg = '';
    if (bird_num==3) {
      ladderImg = 'ex3/ladder_correct.png';
    }
    if (bird_num==0) {
      ladderImg = 'ex3/ladder_tree.png';
    }  
    return this.generateImageHTML([backgroundImg, ladderImg]);
  }
  getDefaultHtml() {
    const backgroundImg = 'ex3/ex3_def.png';  
    return this.generateImageHTML([backgroundImg]);
  }
  extractInputs(selects, inputs, only_values=false) {
    let tree, bird, full_string;
    if (this.level === 'easy') {
      [tree, bird] = Array.from(inputs).map(s => s.value.trim());
    }
    else {
      [full_string] = Array.from(inputs).map(i => i.value.trim());
      const full_parts = full_string.split('+');
      if (full_parts.length < 2) return '';
      tree = full_parts[0].trim();
      bird = full_parts[1].trim();
    }
    return {tree, bird}
  }
  handleRun({ selects, inputs }) {
    const {tree, bird} = this.extractInputs(selects, inputs, true);
    return this.composeImageHtml({tree, bird});
  }

  isCorrect(tree, bird) {
    return (
      tree === "גובה עץ" && bird === "3"
    );
  }

  isValid(tree, bird) {
    return (

      tree === "גובה עץ" &&
      this.validHeights.includes(bird)
    );
  }
  validate({selects, inputs}) {
    const {tree, bird} = this.extractInputs(selects, inputs);
    if (!this.isValid(tree, bird)) {
      return {valid: false, message: this.getErrorMessage()};
    } 

    return { valid: true, message: this.getValidMessage()};
  }
  getValidMessage() {
    return hebrewDict.ex3.success;
  }

  getErrorMessage() {
    return hebrewDict.ex3.error_message;
  }
}
export default new Exercise3();