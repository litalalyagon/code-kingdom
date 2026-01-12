import { Exercise } from './exercise.js';
import { englishDict } from './english-dict.js';

class Exercise13 extends Exercise {
  constructor() {
    super("ex13");
    this.enabled = false;
    this.input_sizes = {'easy': 'medium', 'hard': 'xlarge'};
  }
  validColors = [
    englishDict.colors.blue,
    englishDict.colors.green,
    englishDict.colors.red,
    englishDict.colors.yellow
  ]

  conditions = [];
  action = {};

  getCodeParts() {
    let condition_field, light_field;
    if (this.level === 'easy') {
      condition_field = this.createFieldDisplayDetails({
        pretext: `${englishDict.if} `, 
        new_line: false
      });
      condition_field = condition_field.concat(this.createFieldDisplayDetails({
        pretext: ` ${englishDict.or} `, 
        posttext: ":",
      })); 
      light_field = this.createFieldDisplayDetails({
        field_type: 'text',
        pretext: `${englishDict.ex13.light} = ${englishDict.yes}`,
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
    const backgroundImg = this.path("board.png");
    let colorImages = [];
    if (vars.action.val === englishDict.yes && vars.conditions.length > 0) {
      let colors = vars.conditions.map(c => c.val);
      let colorKeys = colors.map(color => Object.keys(englishDict.colors).find(key => englishDict.colors[key] === color));
      colorImages = colorKeys.map(key => this.path(`light_${key}.png`));
    } 
    
    return this.generateImageHTML([backgroundImg, ...colorImages]);
  }

  getDefaultHtml() {
    return this.composeImageHtml({action: {val: englishDict.no}, conditions: []});
  }

  extractInputs(inputs) {
    let action, conditions, conditionsWordExists = false;
    if (this.level === 'easy') {
      let conditions_inputs = Array.from(inputs).map(i => i.value.trim());
      conditions = conditions_inputs.map(input => this.extractConditionInput(input));
      conditionsWordExists = true;

      // the action after the condition is predefined
      action = {var_name: englishDict.ex13.light, val: englishDict.yes};

    }
    else {
      let inputs_array = Array.from(inputs).map(i => i.value.trim());
      
      // the first input is the condition
      // check if the first word is "אם", and if so, remove it
      if (inputs_array[0].startsWith(englishDict.if)) {
        inputs_array[0] = inputs_array[0].substring(englishDict.if.length).trim();
        conditionsWordExists = true;
      }
      let conditions_inputs = inputs_array[0].split(' ' + englishDict.or + ' ');
      conditions = conditions_inputs.map(input => this.extractConditionInput(input));
      
      // the second input is the action
      action = this.extractActionInput(inputs_array[1]);
    }

    return [conditionsWordExists, conditions, action];
  }

  extractConditionInput(input) {
    const regex = /^\s*([a-zA-Z]+)\s*==\s*([a-zA-Z]+)\s*$/;

    const match = input.match(regex);
    if (!match) {
        return null;
    }
    const var_name = match[1].trim();
    const val = match[2].trim();

    return { var_name, val };
  }

  extractActionInput(input) {
    const regex = /^\s*([a-zA-Z]+)\s*=\s*([a-zA-Z]+)\s*$/;

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
      case englishDict.ex9.swords:
        return this.evaluateCondition(this.swords, condition.operator, value);
      case englishDict.ex9.stars:
        return this.evaluateCondition(this.stars, condition.operator, value);
      default:
        return false;
    }
  }

  isCorrect() {
    let isCorrect = false;

    if (this.action.val === englishDict.yes) {
      if(this.conditions.length == 2) {
        let colors = this.conditions.map(c => c.val);
        let correctColores = [englishDict.colors.blue, englishDict.colors.green];
        // the colors should be exactly the correct colors
        isCorrect = colors.every(color => correctColores.includes(color)) && 
                    correctColores.every(color => colors.includes(color)); 
      }
    }
    else if (this.action.val === englishDict.no) {
      return {valid:false, message: englishDict.ex13.failure_action_no};
    }
    if (isCorrect) {
      return { valid: true, message: englishDict.ex13.success };
    }
    return { valid: false, message: englishDict.ex13.wrong_answer };
  }

  validate({ inputs }) {
    const [conditionsWordExists, conditions, action] = this.extractInputs(inputs);
    if (!conditionsWordExists) {
      return { valid: false, message: englishDict.ex13.failure_no_condition };
    }
    if (!conditions || conditions.some(c => !c) || !action) {
      return { valid: false, message: englishDict.general_error_message};
    }

    // validation of the conditions
    for (const cond of conditions) {
      if (cond.var_name !== englishDict.ex13.color) {
        return { valid: false, message: englishDict.ex13.failure_cond_var_doesnt_exist };
      }
      if (!this.isValidColor(cond.val)) {
        return { valid: false, message: englishDict.ex13.failure_wrong_color };
      }
    }

    // validation of the action
    if (action.var_name !== englishDict.ex13.light) {
      return { valid: false, message: englishDict.ex13.failure_action_var_doesnt_exist };
    }
    if (action.val !== englishDict.yes && action.val !== englishDict.no) {
      return { valid: false, message: englishDict.ex13.failure_wrong_action_val };
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
