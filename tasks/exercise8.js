import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise8 extends Exercise {
  constructor() {
    super(hebrewDict.ex8.title);
  }
  levelFieldTypes = {'easy': 'input', 'hard': 'input'};
  validCrowns = ['0', '1', '2', '3', '4', '5', '6', '7'];
  defaultCrowns = 3;
  validFlowers = ['0', '1', '2', '3', '4', '5', '6'];
  defaultFlowers = 2;

  inputFlowers = '';
  inputCrowns = '';

  getCodeParts() {
    let crown_field, flower_field;
    if (this.level === 'easy') {
      crown_field = this.createFieldDisplayDetails({
        pretext: `${hebrewDict.ex8.crowns} = `, 
        valid_values: this.validCrowns
      });
      flower_field = this.createFieldDisplayDetails({
        pretext: `${hebrewDict.ex8.flowers} = `, 
        valid_values: this.validFlowers
      }); 
    }
    else {
      crown_field = this.createFieldDisplayDetails({});
      flower_field = this.createFieldDisplayDetails({});
    }
    const combined = crown_field.concat(flower_field);

    return combined;
  }

  composeImageHtml() {
    const crowns = parseInt(this.inputCrowns, 10); 
    const flowers = parseInt(this.inputFlowers, 10); 

    const fire = (crowns > 4 && flowers < 2) ? 'off' : 'on';
    const backgroundImg = "ex8/fire_" + fire + ".png";

    const crownsImg = crowns ? `ex8/crown_${crowns}.png` : null;
    const flowersImg = flowers ? `ex8/flower_${flowers}.png` : null;

    return this.generateImageHTML([backgroundImg, crownsImg, flowersImg]);
  }

  getDefaultHtml() {
    const backgroundImg = 'ex8/fire_on.png';  
    const crownsImg = `ex8/crown_${this.defaultCrowns}.png`;
    const flowersImg = `ex8/flower_${this.defaultFlowers}.png`;
    return this.generateImageHTML([backgroundImg, crownsImg, flowersImg]);
  }

  extractInputs(inputs, only_values=false) {
    let input1, input2, val1, val2, varName1, varName2;
    if (this.level === 'easy') {
      [val1, val2] = Array.from(inputs).map(s => s.value.trim());
      varName1 = hebrewDict.ex8.crowns;
      varName2 = hebrewDict.ex8.flowers;      
    }
    else {
      [input1, input2] = Array.from(inputs).map(i => i.value.trim());
      [varName1, val1]  = this.extractSingleInput(input1);
      [varName2, val2]  = this.extractSingleInput(input2);
    }
    return {varName1, val1, varName2, val2};
  }

  extractSingleInput(input) {
    const regex = /^\s*([\u0590-\u05FF]+)\s*=\s*([0-9]+)\s*$/;
      
      const match = input.match(regex);
      if (!match) {
        return null;
      }
      const varName = match[1].trim();
      const val = match[2].trim();
      return [ varName, val ];
  }

  handleRun({ selects, inputs }) {
    return this.composeImageHtml();
  }

  isCorrect() {
    if (parseInt(this.inputCrowns, 10) > 4 && parseInt(this.inputFlowers, 10) < 2){
      return { valid: true, message: hebrewDict.ex8.success };
    } else {
      return { valid: false, message: hebrewDict.ex8.wrong_answer };
    }
  }

  isValid(crowns, flowers) {
    return (
      this.validCrowns.includes(crowns) &&
      this.validFlowers.includes(flowers)
    );
  }

  validate({ inputs }) {
    let crowns, flowers;
    const {varName1, val1, varName2, val2} = this.extractInputs(inputs);
     if (!varName1 || !val1 || !varName2 || !val2) {
        return { valid: false, message: hebrewDict.ex8.failure };
     }

      // analyze the first input
      if (varName1 === hebrewDict.ex8.crowns) {
        crowns = val1;
      } else if (varName1 === hebrewDict.ex8.flowers) {
        flowers = val1;
      } else {
        return { valid: false, message: hebrewDict.ex8.failure_var_doesnt_exist };
      }
      // analyze the second input
      if (varName2 === hebrewDict.ex8.crowns) {
        crowns = val2;
      } else if (varName2 === hebrewDict.ex8.flowers) {
        flowers = val2;
      } else {
        return { valid: false, message: hebrewDict.ex8.failure_var_doesnt_exist };
      }

      if (varName1 === varName2) {
        return { valid: false, message: hebrewDict.ex8.failure_var_is_missing };
      }
    
    // check if the values are valid
     if (!this.isValid(crowns, flowers)) {
        return { valid: false, message: this.getErrorMessage(crowns, flowers) };
    }    

    // set the values
    this.inputCrowns = crowns;
    this.inputFlowers = flowers;

    return { valid: true, message: ""};
  }

  getErrorMessage(crowns, flowers) {
    let message = [];
    if (!this.validCrowns.includes(crowns)) {
      message.push(hebrewDict.ex8.crowns_error);
    }
    if (!this.validFlowers.includes(flowers)) {
      message.push(hebrewDict.ex8.flowers_error);
    }
    return message.join('<br>');
  }
}

export default new Exercise8();
