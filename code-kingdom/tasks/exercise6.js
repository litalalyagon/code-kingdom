import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise6 extends Exercise {
  constructor() {
    super("ex6");
    this.input_sizes = {'easy': 'small', 'hard': 'small'};
    this.resultImgBg = "#85d092"; 
 }

  validColors = [
    hebrewDict.colors.blue,
    hebrewDict.colors.yellow,
    hebrewDict.colors.red,
  ];

  validDirections = [
    hebrewDict.ex6.left,
    hebrewDict.ex6.right,
  ];

  colors_directions = {};

  getCodeParts() {
    let fields = [];
    if (this.level === 'easy') {
      fields = this.createFieldDisplayDetails({
        field_type: 'text',
        pretext: `${hebrewDict.if} ${hebrewDict.ex6.flag}==${hebrewDict.colors.blue}`, 
        posttext: ":",
      });
      fields = fields.concat(this.createFieldDisplayDetails({
        pretext: `${hebrewDict.ex6.turn} `, 
        indentation: true,
      })); 
      fields = fields.concat(this.createFieldDisplayDetails({
        field_type: 'text',
        pretext: `${hebrewDict.if} ${hebrewDict.ex6.flag}==${hebrewDict.colors.yellow}`, 
        posttext: ":",
      })); 
      fields = fields.concat(this.createFieldDisplayDetails({
        pretext: `${hebrewDict.ex6.turn} `, 
        indentation: true,
      })); 
      fields = fields.concat(this.createFieldDisplayDetails({
        field_type: 'text',
        pretext: `${hebrewDict.if} ${hebrewDict.ex6.flag}==${hebrewDict.colors.red}`, 
        posttext: ":",
      })); 
      fields = fields.concat(this.createFieldDisplayDetails({
        pretext: `${hebrewDict.ex6.turn} `, 
        indentation: true,
      })); 
    }
    else {
      fields = this.createFieldDisplayDetails({
        pretext: `${hebrewDict.if} ${hebrewDict.ex6.flag}==`, 
        posttext: ":",
      });
      fields = fields.concat(this.createFieldDisplayDetails({
        pretext: `${hebrewDict.ex6.turn} `, 
        indentation: true,
      })); 
      fields = fields.concat(this.createFieldDisplayDetails({
        pretext: `${hebrewDict.if} ${hebrewDict.ex6.flag}==`, 
        posttext: ":",
      })); 
      fields = fields.concat(this.createFieldDisplayDetails({
        pretext: `${hebrewDict.ex6.turn} `, 
        indentation: true,
      })); 
      fields = fields.concat(this.createFieldDisplayDetails({
        pretext: `${hebrewDict.if} ${hebrewDict.ex6.flag}==`, 
        posttext: ":",
      })); 
      fields = fields.concat(this.createFieldDisplayDetails({
        pretext: `${hebrewDict.ex6.turn} `, 
        indentation: true,
      })); 
    }  

    return fields;
  }

  composeImageHtml(colors_directions) {
    const blue_dir = this.getDirectionKey(colors_directions[hebrewDict.colors.blue]);
    const yellow_dir = this.getDirectionKey(colors_directions[hebrewDict.colors.yellow]);
    const red_dir = this.getDirectionKey(colors_directions[hebrewDict.colors.red]);

    const route_img = this.path(`b${blue_dir}_y${yellow_dir}_r${red_dir}.png`);
    
    return this.generateImageHTML([this.path("maze.png"), route_img]);
  }

  getDirectionKey(direction) {
    switch (direction) {
      case hebrewDict.ex6.left:
        return "l";
      case hebrewDict.ex6.right:
        return "r";
      default:
        return null;
    }
  }

  getDefaultHtml() {
    return this.generateImageHTML([this.path("maze.png")]);
  }

  extractInputs(inputs) {
    let colors_directions = [];
    if (this.level === 'easy') {
      let arr = Array.from(inputs).map(i => i.value.trim());
      colors_directions[0] = {color: hebrewDict.colors.blue, direction: arr[0]};
      colors_directions[1] = {color: hebrewDict.colors.yellow, direction: arr[1]};
      colors_directions[2] = {color: hebrewDict.colors.red, direction: arr[2]};
    }
    else {
      let arr = Array.from(inputs).map(i => i.value.trim());
      colors_directions[0] = {color: arr[0], direction: arr[1]};
      colors_directions[1] = {color: arr[2], direction: arr[3]};  
      colors_directions[2] = {color: arr[4], direction: arr[5]};
    }

    return colors_directions;
  }

  handleRun() {
    return this.composeImageHtml(this.colors_directions);
  }


  isCorrect() {
    if (this.colors_directions[hebrewDict.colors.blue] == hebrewDict.ex6.left
      && this.colors_directions[hebrewDict.colors.yellow] == hebrewDict.ex6.right
      && this.colors_directions[hebrewDict.colors.red] == hebrewDict.ex6.right) {
        return { valid: true, message: hebrewDict.ex6.success };
    }
    return { valid: false, message: hebrewDict.ex6.wrong_answer };
  }

  validate({ inputs }) {
    const colors_directions = this.extractInputs(inputs);
    if (!colors_directions || colors_directions.length !== 3 || colors_directions.some(c => !c.color || !c.direction)) {
      return { valid: false, message: hebrewDict.ex6.missing_fields_error };
    }

    // validation of the colors and directions
    for (const cond of colors_directions) {
      if (!this.isValidColor(cond.color)) {
        return { valid: false, message: hebrewDict.ex6.failure_wrong_color };
      }
      if (!this.isValidDirection(cond.direction)) {
        return { valid: false, message: hebrewDict.ex6.failure_wrong_direction };
      }
      this.colors_directions[cond.color] = cond.direction;

    }
    // check if there are two equals colors
    const colors = colors_directions.map(c => c.color);
    const uniqueColors = new Set(colors);
    if (uniqueColors.size !== colors.length) {
      return { valid: false, message: hebrewDict.ex6.failure_two_equals_colors };
    }

    return { valid: true, message: ""};
  }

  isValidColor(color) { 
    return this.validColors.includes(color);
  }

  isValidDirection(direction) {
    return this.validDirections.includes(direction);
  }

}

export default new Exercise6();
