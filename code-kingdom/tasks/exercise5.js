import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise5 extends Exercise {
  constructor() {
    super("ex5");
    this.input_sizes = { 'easy': 'small', 'hard': 'medium' };
    this.resultImgBg = '#d7e0eb';
  }
  defaultHeight = 100;
  inputHeight; // number

  getCodeParts() {
    if (this.level === 'easy') {
      return this.createFieldDisplayDetails({ pretext: `${hebrewDict.ex5.height} = ` });
    } else {
      return this.createFieldDisplayDetails({});
    }
  }

  composeImageHtml(vars) {
    const height = vars.height;

    let robiImg;
    if (height == 0) {
      // do nothing
    } else if (height < 100) {
      robiImg = this.path('robi_little.png');
    } else if (height == 100) {
      robiImg = this.path('robi_100.png');
    } else if (height < 200) {
      robiImg = this.path('robi_150.png');
    } else if (height < 301) {
      robiImg = this.path('robi_200.png');
    } else {
      robiImg = this.path('robi_long_legs.png');
    }
    const gateStatus = this.isGateOpen(height) ? 'open' : 'close';
    const gateImg = this.path(`gate_${gateStatus}.png`);

    return this.generateImageHTML([gateImg, robiImg]);
  }

  getDefaultHtml() {
    return this.composeImageHtml({ height: this.defaultHeight });
  }

  extractInputs(inputs) {
    let val, varName;
    if (this.level === 'easy') {
      [val] = Array.from(inputs).map(s => s.value.trim());
      varName = hebrewDict.ex5.height;
    }
    else {
      const [input] = Array.from(inputs).map(i => i.value.trim());
      [varName, val] = this.extractSingleInput(input);
    }
    return { varName, val };
  }

  extractSingleInput(input) {
    const regex = /^\s*([\u0590-\u05FF]+)\s*=\s*(\S+)$/;

    const match = input.match(regex);
    if (!match) {
      return [null, null];
    }
    const varName = match[1].trim();
    const val = match[2].trim();
    return [varName, val];
  }

  handleRun() {
    return this.composeImageHtml({ height: this.inputHeight });
  }


  isCorrect() {
    if (this.inputHeight == 0) {
      return {valid: true, message: hebrewDict.ex5.success_zero_height};
    }
    return {
      valid: true,
      message: this.isGateOpen(this.inputHeight) ? hebrewDict.ex5.success_open : hebrewDict.ex5.success_closed
    };
  }

  validate({ inputs }) {
    const { varName, val } = this.extractInputs(inputs);
    if (!varName || !val) {
      return { valid: false, message: hebrewDict.general_error_message };
    }

    if (varName !== hebrewDict.ex5.height) {
      return { valid: false, message: hebrewDict.ex5.failure_var_doesnt_exist };
    }

    // we should check the value it's all numbers and signs, not letters
    if (!/^[\d.\s\+\-]+$/.test(val)) {
      return { valid: false, message: hebrewDict.ex5.height_error  };
    }

    const calc_result = this.calculateResultFromString(val);
    if (isNaN(calc_result) || calc_result < 0) {
      return { valid: false, message: hebrewDict.ex5.height_error };
    }

    // set the values
    this.inputHeight = calc_result;

    return { valid: true, message: "" };
  }

  isGateOpen(height) {
    return height < 200;
  }
}

export default new Exercise5();
