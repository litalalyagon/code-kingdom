import { Exercise } from './exercise.js';
import { englishDict } from './english-dict.js';

class Exercise10 extends Exercise {
  constructor() {
    super("ex10");
    this.input_sizes = {'easy': 'small', 'hard': 'medium'};
    this.resultImgBg = '#4f4f4f';
  }
  validColors = [
    englishDict.colors.blue,
    englishDict.colors.green,
    englishDict.colors.brown,
  ];

  validSizes = [
    englishDict.ex10.small,
    englishDict.ex10.large,
  ];

  validShapes = [
    englishDict.ex10.circle,
    englishDict.ex10.triangle,
  ];

  torches = [
      {color: englishDict.colors.brown, size: englishDict.ex10.large, shape: englishDict.ex10.triangle, light: false},
      {color: englishDict.colors.green, size: englishDict.ex10.large, shape: englishDict.ex10.circle, light: false},
      {color: englishDict.colors.blue, size: englishDict.ex10.small, shape: englishDict.ex10.triangle, light: false},
      {color: englishDict.colors.green, size: englishDict.ex10.large, shape: englishDict.ex10.circle, light: false},
      {color: englishDict.colors.brown, size: englishDict.ex10.small, shape: englishDict.ex10.triangle, light: false},
      {color: englishDict.colors.blue, size: englishDict.ex10.large, shape: englishDict.ex10.triangle, light: false},
  ]

  getCodeParts() {
    let condition_field, light_field;
    if (this.level === 'easy') {
      condition_field = this.createFieldDisplayDetails({
        pretext: `${englishDict.if} ${englishDict.ex10.shape}==`, 
        new_line: false
      });
      condition_field = condition_field.concat(this.createFieldDisplayDetails({
        pretext: ` ${englishDict.or} ${englishDict.ex10.color}==`, 
        type: 'dropdown',
        posttext: ":",   
      })); 
    } else {
      condition_field = this.createFieldDisplayDetails({
        pretext: `${englishDict.if} `, 
        new_line: false
      });
      condition_field = condition_field.concat(this.createFieldDisplayDetails({
        pretext: ` ${englishDict.or} `, 
        posttext: ":",
      })); 
    }

    light_field = this.createFieldDisplayDetails({
      field_type: 'text',
      pretext: `${englishDict.ex10.light} = ${englishDict.yes}`,
      indentation: true,
      new_line: false
    });
    
    const combined = condition_field.concat(light_field);
    return combined;
  }

  composeImageHtml() {
    const backgroundImg = this.path('wall.png');
    let colorImages = [];

    this.torches.forEach((t, ind) => {
      if (t.light) {
        colorImages.push(this.path(`flame_${ind+1}.png`));
      }
    });
    
    return this.generateImageHTML([backgroundImg, ...colorImages]);
  }

  getDefaultHtml() {
    return this.generateImageHTML([this.path('wall.png')]);
  }
  
  extractInputs(inputs) {
    let cond1, cond2;
    if (this.level === 'easy') {
      let [shape, color] = Array.from(inputs).map(i => i.value.trim());
      cond1 = { var_name: englishDict.ex10.shape, val: shape };
      cond2 = { var_name: englishDict.ex10.color, val: color }
    }
    else {  
      let [input1, input2] = Array.from(inputs).map(i => i.value.trim());
      cond1 = this.extractConditionInput(input1);
      cond2 = this.extractConditionInput(input2);
    }
    return [cond1, cond2]
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

  handleRun() {
    return this.composeImageHtml();
  }

  isCorrect() {
    if (this.torches.every(t => t.light)) {
      return { valid: true, message: englishDict.ex10.success };
    }
    return { valid: false, message: englishDict.ex10.wrong_answer };
  }

  lightTheTorches(cond1, cond2) {
    this.torches.forEach((t) => {
      let key1 = Object.keys(englishDict.ex10).find(key => englishDict.ex10[key] === cond1.var_name);
      let key2 = Object.keys(englishDict.ex10).find(key => englishDict.ex10[key] === cond2.var_name);
      if (t[key1] === cond1.val || t[key2] === cond2.val) {
        t.light = true;
      } else {
        t.light = false;
      }
    });
  }

  validate({ inputs }) {
    const conditions = this.extractInputs(inputs);
    if (!conditions || conditions.length !== 2 || conditions.some(c => c === null)) {
      return {valid: false, message: englishDict.general_error_message};
    }

    for (const cond of conditions) {
      if (cond.var_name == englishDict.ex10.color) {
        if (!this.isValidColor(cond.val)) {
          return { valid: false, message: englishDict.ex10.failure_wrong_color };
        }
      } else if (cond.var_name == englishDict.ex10.size) {
        if (!this.isValidSize(cond.val)) {
          return { valid: false, message: englishDict.ex10.failure_wrong_size };
        }
      } else if (cond.var_name == englishDict.ex10.shape) {
        if (!this.isValidShape(cond.val)) {
          return { valid: false, message: englishDict.ex10.failure_wrong_shape };
        }
      } else {
        return { valid: false, message: englishDict.ex10.failure_var_doesnt_exist };
      }
    }

    this.lightTheTorches(conditions[0], conditions[1]);
    
    return { valid: true, message: ""};
  }

  isValidColor(color) { 
    return this.validColors.includes(color);
  }

  isValidSize(size) { 
    return this.validSizes.includes(size);
  }

  isValidShape(shape) { 
    return this.validShapes.includes(shape);
  }
}

export default new Exercise10();
