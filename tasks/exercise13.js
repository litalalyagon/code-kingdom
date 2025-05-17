import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise13 extends Exercise {
  constructor() {
    super(hebrewDict.ex13.title);
    this.input_sizes = {'easy': 'medium', 'hard': 'xlarge'};
  }
  validColors = [
    hebrewDict.colors.blue,
    hebrewDict.colors.green,
    hebrewDict.colors.red,
    hebrewDict.colors.yellow
  ]

  conditions = [];
  action = {};

  getCodeParts() {
    let condition_field, light_field;
    if (this.level === 'easy') {
      condition_field = this.createFieldDisplayDetails({
        pretext: `${hebrewDict.if} `, 
        new_line: false
      });
      condition_field = condition_field.concat(this.createFieldDisplayDetails({
        pretext: ` ${hebrewDict.or} `, 
        posttext: ":",
      })); 
      light_field = this.createFieldDisplayDetails({
        field_type: 'text',
        pretext: `${hebrewDict.ex13.light} = ${hebrewDict.yes}`,
        indentation: true,
        new_line: false
      });
    } else {
      condition_field = this.createFieldDisplayDetails({
        posttext: ":",
      });
      light_field = this.createFieldDisplayDetails({
        indentation: true,
        new_line: false
      });
    }
    
    const combined = condition_field.concat(light_field);

    return combined;
  }

  composeImageHtml(vars) {
    const backgroundImg = "ex13/board.png";
    let colorImages = [];
    if (vars.action.val === hebrewDict.yes && vars.conditions.length > 0) {
      let colors = vars.conditions.map(c => c.val);
      let colorKeys = colors.map(color => Object.keys(hebrewDict.colors).find(key => hebrewDict.colors[key] === color));
      colorImages = colorKeys.map(key => `ex13/light_${key}.png`);
    } 
    
    return this.generateImageHTML([backgroundImg, ...colorImages]);
  }

  getDefaultHtml() {
    return this.composeImageHtml({action: {val: hebrewDict.no}, conditions: []});
  }

  extractInputs(inputs) {
    let action, conditions, conditionsWordExists = false;
    if (this.level === 'easy') {
      let conditions_inputs = Array.from(inputs).map(i => i.value.trim());
      conditions = conditions_inputs.map(input => this.extractConditionInput(input));
      conditionsWordExists = true;

      // the action after the condition is predefined
      action = {var_name: hebrewDict.ex13.light, val: hebrewDict.yes};

    }
    else {
      let inputs_array = Array.from(inputs).map(i => i.value.trim());
      
      // the first input is the condition
      // check if the first word is "אם", and if so, remove it
      if (inputs_array[0].startsWith(hebrewDict.if)) {
        inputs_array[0] = inputs_array[0].substring(hebrewDict.if.length).trim();
        conditionsWordExists = true;
      }
      let conditions_inputs = inputs_array[0].split(hebrewDict.or);
      conditions = conditions_inputs.map(input => this.extractConditionInput(input));
      
      // the second input is the action
      action = this.extractActionInput(inputs_array[1]);
    }

    return [conditionsWordExists, conditions, action];
  }

  extractConditionInput(input) {
    const regex = /^\s*([\u0590-\u05FF]+)\s*==\s*([\u0590-\u05FF]+)\s*$/;

    const match = input.match(regex);
    if (!match) {
        return null;
    }
    const var_name = match[1].trim();
    const val = match[2].trim();

    return { var_name, val };
  }

  extractActionInput(input) {
    const regex = /^\s*([\u0590-\u05FF]+)\s*=\s*([\u0590-\u05FF]+)\s*$/;

    const match = input.match(regex);
    if (!match) { 
        return null;
    }
    const var_name = match[1].trim();
    const val = match[2].trim();

    return { var_name, val };
  }

  handleRun() {
    return this.composeImageHtml({conditions: this.conditions, action: this.action});
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
    let isCorrect = false;

    if (this.action.val === hebrewDict.yes) {
      if(this.conditions.length == 2) {
        let colors = this.conditions.map(c => c.val);
        let correctColores = [hebrewDict.colors.blue, hebrewDict.colors.green];
        // the colors should be exactly the correct colors
        isCorrect = colors.every(color => correctColores.includes(color)) && 
                    correctColores.every(color => colors.includes(color)); 
      }
    }
    if (isCorrect) {
      return { valid: true, message: hebrewDict.ex13.success };
    }
    return { valid: false, message: hebrewDict.ex13.wrong_answer };
  }

  validate({ inputs }) {
    const [conditionsWordExists, conditions, action] = this.extractInputs(inputs);
    if (!conditionsWordExists) {
      return { valid: false, message: hebrewDict.ex13.failure_no_condition };
    }
    if (!conditions || conditions.some(c => !c) || !action) {
      return { valid: false, message: hebrewDict.ex13.failure };
    }

    // validation of the conditions
    for (const cond of conditions) {
      if (cond.var_name !== hebrewDict.ex13.color) {
        return { valid: false, message: hebrewDict.ex13.failure_cond_var_doesnt_exist };
      }
      if (!this.isValidColor(cond.val)) {
        return { valid: false, message: hebrewDict.ex13.failure_wrong_color };
      }
    }

    // validation of the action
    if (action.var_name !== hebrewDict.ex13.light) {
      return { valid: false, message: hebrewDict.ex13.failure_action_var_doesnt_exist };
    }
    if (action.val !== hebrewDict.yes && action.val !== hebrewDict.no) {
      return { valid: false, message: hebrewDict.ex13.failure_wrong_action_val };
    }
    
    // set the values
    this.conditions = conditions;
    this.action = action;

    return { valid: true, message: ""};
  }

  isValidColor(color) { 
    return this.validColors.includes(color);
  }

}

export default new Exercise13();
