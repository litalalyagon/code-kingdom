import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise5 extends Exercise {
  constructor() {
    super(hebrewDict.ex5.title);
    this.input_sizes = {'easy': 'small', 'hard': 'medium'};
  }
  defaultHeight = 100;
  inputHeight = '';
  
  getCodeParts() {
    if (this.level === 'easy') {
      return this.createFieldDisplayDetails({pretext: `${hebrewDict.ex5.height} = `}); 
    } else {
      return this.createFieldDisplayDetails({});
    }
  }

  composeImageHtml(vars) {
    const height = parseInt(vars.height, 10);
    
    let robiImg;
    if (height < 100) {
      robiImg = 'ex5/robi_little.png';
    } else if (height == 100) {
      robiImg = 'ex5/robi_100.png';
    } else if (height < 200) {
      robiImg = 'ex5/robi_150.png';
    } else if (height < 301) {
      robiImg = 'ex5/robi_200.png';
    } else {
      robiImg = 'ex5/robi_long_legs.png'; 
    }
    const gateStatus = this.isGateOpen(height) ? 'open' : 'close';
    const gateImg = `ex5/gate_${gateStatus}.png`;
  
    return this.generateImageHTML([gateImg, robiImg]);
  }

  getDefaultHtml() {
    return this.composeImageHtml({height: this.defaultHeight});
  }

  extractInputs(inputs) {
    let val, varName;
    if (this.level === 'easy') {
      [val] = Array.from(inputs).map(s => s.value.trim());
      varName = hebrewDict.ex5.height;
    }
    else {
      const [input] = Array.from(inputs).map(i => i.value.trim());
      [varName, val]  = this.extractSingleInput(input);
    }
    return {varName, val};
  }

  extractSingleInput(input) {
    const regex = /^\s*([\u0590-\u05FF]+)\s*=\s*([0-9]+)\s*$/;
      
      const match = input.match(regex);
      if (!match) {
        return [null, null];
      }
      const varName = match[1].trim();
      const val = match[2].trim();
      return [ varName, val ];
  }

  handleRun() {
    return this.composeImageHtml({height: this.inputHeight});
  }


  isCorrect() {
     return { 
      valid: true, 
      message: this.isGateOpen(this.inputHeight) ? hebrewDict.ex5.success_open : hebrewDict.ex5.success_closed 
    };
  }

  isValid(color, spots) {
    return (
      this.validColors.includes(color) &&
      this.validSpots.includes(spots)
    );
  }

  validate({ inputs }) {
    const {varName, val} = this.extractInputs(inputs);
     if (!varName || !val) {
        return { valid: false, message: hebrewDict.ex5.error_message };
     }

     if (varName !== hebrewDict.ex5.height) {
        return { valid: false, message: hebrewDict.ex5.failure_var_doesnt_exist };
      }

    // check if the value is a number
    if (isNaN(val) || val < 0) {
      return { valid: false, message: hebrewDict.ex5.height_error };
    }

    // set the values
    this.inputHeight = val;

    return { valid: true, message: ""};
  }

  isGateOpen(height) {
    return height < 200;
  } 
}

export default new Exercise5();
