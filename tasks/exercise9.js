import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise9 extends Exercise {
  constructor() {
    super(hebrewDict.ex9.title);
    this.input_sizes = {'easy': 'medium', 'hard': 'large'};
  }

  swords = 3;
  stars = 2;

  cond1 = {};
  cond2 = {};

  getCodeParts() {
    let condition_field, fire_field;
    if (this.level === 'easy') {
      // swords
      condition_field = this.createFieldDisplayDetails({
        pretext: `${hebrewDict.if} `, 
        new_line: false
      });
      // stars
      condition_field = condition_field.concat(this.createFieldDisplayDetails({
        pretext: ` ${hebrewDict.and} `, 
        posttext: ":",
      })); 
    }
    else {
      condition_field = this.createFieldDisplayDetails({
        pretext: `${hebrewDict.if} `, 
        posttext: ":"
      });
    }
    fire_field = this.createFieldDisplayDetails({
      field_type: 'text',
      pretext: `${hebrewDict.ex9.fire} = ${hebrewDict.no}`,
      indentation: true,
      new_line: false
    });
    
    const combined = condition_field.concat(fire_field);

    return combined;
  }

  composeImageHtml(vars) {
    const cond1Correct = this.checkCondition(vars.cond1);
    const cond2Correct = this.checkCondition(vars.cond2);
    const fire = (cond1Correct && cond2Correct) ? 'off' : 'on';
    const fireImg = `ex9/fire_${fire}.png`;
    return this.generateImageHTML([fireImg, "ex9/stars.png", "ex9/swords.png"]);
  }

  getDefaultHtml() {
    return this.generateImageHTML(["ex9/fire_on.png", "ex9/stars.png", "ex9/swords.png"]);
  }

  extractInputs(inputs) {
    let input1, input2;
    if (this.level === 'easy') {
      [input1, input2] = Array.from(inputs).map(i => i.value.trim());
    }
    else {
      let [input] = Array.from(inputs).map(i => i.value.trim());
      // seperate into two inputs
      let inputs_array = input.split(hebrewDict.and);
      if (inputs_array.length !== 2) {
        return null;
      }
      [input1, input2] = inputs_array.map(i => i.trim());
    }

    const cond1 = this.extractSingleInput(input1);
    const cond2 = this.extractSingleInput(input2);

    return [cond1, cond2]
  }

  extractSingleInput(input) {
    const regex = /^\s*([\u0590-\u05FF]+)\s*(<|>|==)\s*([0-9]+)\s*$/;

    const match = input.match(regex);
    if (!match) {
        return null;
    }
    const varName = match[1].trim();
    const operator = match[2].trim();
    const val = match[3].trim();

    return { varName, operator, val };
  }

  handleRun() {
    return this.composeImageHtml({cond1: this.cond1, cond2: this.cond2});
  }

  checkCondition(condition) {
    const value = parseInt(condition.val, 10);

    switch (condition.varName) {
      case hebrewDict.ex9.swords:
        return this.evaluateCondition(this.swords, condition.operator, value);
      case hebrewDict.ex9.stars:
        return this.evaluateCondition(this.stars, condition.operator, value);
      default:
        return false;
    }
  }

  isCorrect() {
    const cond1Correct = this.checkCondition(this.cond1);
    const cond2Correct = this.checkCondition(this.cond2);

    // Both conditions must be correct
    if (cond1Correct && cond2Correct) {
        return { valid: true, message: hebrewDict.ex9.success };
    } else {
        return { valid: false, message: hebrewDict.ex9.wrong_answer };
    }
  }

  validate({ inputs }) {
    const conditions = this.extractInputs(inputs);
    if (!conditions || conditions.length !== 2 || !conditions[0] || !conditions[1]) {
      return { valid: false, message: hebrewDict.ex9.failure };
    }
    const [cond1, cond2] = conditions;

    // validation of the variables names
    const validVarNames = [hebrewDict.ex9.swords, hebrewDict.ex9.stars];
      if (!validVarNames.includes(cond1.varName) || !validVarNames.includes(cond2.varName)) {
        return { valid: false, message: hebrewDict.ex9.failure_var_doesnt_exist };
      } else if (cond1.varName === cond2.varName) {
        return { valid: false, message: hebrewDict.ex9.failure_var_is_missing };  
      }
    
    // set the values
    this.cond1 = cond1;
    this.cond2 = cond2;

    return { valid: true, message: ""};
  }

}

export default new Exercise9();
