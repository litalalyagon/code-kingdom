import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise1 extends Exercise {
  constructor() {
    super("ex1");
    this.input_sizes = {'easy': 'small', 'hard': 'small'};
    this.resultImgBg = '#bfe5ef';
  }
  validColors = [
    hebrewDict.colors.blue,
    hebrewDict.colors.green,
    hebrewDict.colors.orange,
    hebrewDict.colors.black,
    hebrewDict.colors.pink,
    hebrewDict.colors.purple,
    hebrewDict.colors.grey,
    hebrewDict.colors.red,
    hebrewDict.colors.yellow,
    hebrewDict.colors.white
  ]
  validClouds = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  validRainbow = [hebrewDict.no, hebrewDict.yes];

  defaultColor = hebrewDict.colors.blue;
  defaultClouds = '3';
  defaultRainbow = hebrewDict.no;

  getCodeParts() {
    const field_type = this.level === 'easy' ? "dropdown" : "input";
    const color_field = this.createFieldDisplayDetails({
      pretext: `${hebrewDict.ex1.trees_color} = `,
      valid_values: this.validColors,
      default_value: this.defaultColor,
      field_type
    });
    const clouds_field = this.createFieldDisplayDetails({
      pretext: `${hebrewDict.ex1.clouds} = `,
      valid_values: this.validClouds,
      default_value: this.defaultClouds,
      field_type
    });
    const rainbow_field = this.createFieldDisplayDetails({
      pretext: `${hebrewDict.ex1.rainbow} = `,
      valid_values: this.validRainbow,
      default_value: this.defaultRainbow,
      field_type,
      new_line: false
    });
    const combined = color_field.concat(clouds_field, rainbow_field);
    return combined;
  }

  composeImageHtml(vars) {
    const {color, clouds, rainbow} = vars;
    const colorKey = Object.keys(hebrewDict.colors).find(key => hebrewDict.colors[key] === color);
    const rainbowImg = rainbow === hebrewDict.yes ? this.path('rainbow.png') : null;
    const forestImg = this.path(`forest_${colorKey}.png`);
    const cloudsImg = clouds !== '0' ? this.path(`clouds_${clouds}.png`) : null;
    return this.generateImageHTML([rainbowImg, forestImg, cloudsImg]);
  }

  getDefaultHtml() {
    return this.composeImageHtml({
      color: this.defaultColor,
      clouds: this.defaultClouds,
      rainbow: this.defaultRainbow
    });
  }

  handleRun({selects, inputs}) {
    let color, clouds, rainbow;
    if (this.level === 'easy') {
      [color, clouds, rainbow] = Array.from(selects).map(s => s.value);
    } else {
      [color, clouds, rainbow] = Array.from(inputs).map(i => i.value.trim());
    }
    return this.composeImageHtml({color, clouds, rainbow});
  }

  isValid(color, clouds, rainbow) {
    return (
      this.validColors.includes(color) &&
      this.isIntString(clouds) &&
      this.validClouds.includes(clouds) &&
      this.validRainbow.includes(rainbow)
    );
  }

  validate({ selects, inputs }) {
    let color, clouds, rainbow;
    if (this.level === 'easy') {
      [color, clouds, rainbow] = Array.from(selects).map(s => s.value);
    } else {
      [color, clouds, rainbow] = Array.from(inputs).map(i => i.value.trim());
    }
    if (this.isValid(color, clouds, rainbow)) {
      return { valid: true, message: ""};
    }
    return { valid: false, message: this.getErrorMessage(color, clouds, rainbow) };
  }

  isIntString(str) {
    // Checks if str is a string representing a positive integer (including zero)
    return /^\d+$/.test(str);
  }


  getErrorMessage(color, clouds, rainbow) {
    let message = [];
    if (!this.validColors.includes(color)) {
      message.push(hebrewDict.ex1.color_error);
    }
    if (!this.isIntString(clouds) || parseInt(clouds) < 0) {
      message.push(hebrewDict.ex1.clouds_not_number);
    } else if (!this.validClouds.includes(clouds)) {
      message.push(hebrewDict.ex1.clouds_error);
    }
    if (!this.validRainbow.includes(rainbow)) {
      message.push(hebrewDict.ex1.rainbow_error);
    }
    return message.join('<br>');
  }

  isCorrect() {
    return { valid: true, message: hebrewDict.ex1.success };
  }
}

export default new Exercise1();
