import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise12 extends Exercise {
    constructor() {
    super("ex12");
    this.input_sizes = {'easy': 'medium', 'hard': 'xlarge'};
  }
  bagWeights = [30, 40, 55, 90];
  inputIfWord;
  inputWeightWord;
  inputSign;
  inputWeightLimit;
  getCodeParts() {
    let weight_field, value_field, full_string, combined;
    if (this.level === 'easy') {
    weight_field = this.createFieldDisplayDetails({
        pretext: `${hebrewDict.if} `, 
        new_line: false
    });
    value_field = this.createFieldDisplayDetails({
        pretext: ` > `, 
        posttext: ":",
    }); 
    full_string = weight_field.concat(value_field);
    } else {
        full_string = this.createFieldDisplayDetails({posttext: ":"});
    }
    combined = full_string.concat(this.createFieldDisplayDetails({pretext: ` ${hebrewDict.ex12.detach}`, indentation: true, field_type: 'text'}))
    return combined;
}
    composeImageHtml(vars) {
    const {weightLimit} = vars;
    let bagImg;
    let images = [];
    const backgroundImg = this.path("balloon.png");
    images.push(backgroundImg);
    let colorImages = [];
    for (const weight of this.bagWeights) {
    if(weight > parseInt(weightLimit, 10)) {
    bagImg = this.path(`bag_${weight}_off.png`);
    } else {
        bagImg = this.path(`bag_${weight}.png`);
    }
    images.push(bagImg);
    }
    return this.generateImageHTML(images);    
}
    getDefaultHtml() {
        return this.composeImageHtml({weightLimit: 100});

}
    extractInputs(inputs) {
    let ifWord, weightWord, sign, weightValue, fullString;
    if (this.level === 'easy') {
        [weightWord, weightValue] = Array.from(inputs).map(s => s.value.trim());
        ifWord = hebrewDict.if;
        sign = '>';
    } else {
        [fullString] = Array.from(inputs).map(i => i.value.trim());
        const match = fullString.match(/^(\S+)\s+(\S+)\s*([<>=!]+)\s*(\S+)$/);
        if (match) {
            ifWord = match[1].trim();         // "אם"
            weightWord = match[2].trim();     // "משקל"
            sign = match[3].trim();           // "<"
            weightValue = match[4].trim();    // "14"
        }
    }
    return {ifWord, weightWord, sign, weightValue};
    }
    handleRun() {
        return this.composeImageHtml({weightLimit: this.inputWeightLimit});
    }
    isCorrect() {
        let weightLimit = parseInt(this.inputWeightLimit, 10);
        if (weightLimit < 40) {
            return { valid: false, message: hebrewDict.ex12.weightLimitTooLowError };
        } else if (weightLimit > 55) {
            return { valid: false, message: hebrewDict.ex12.weightLimitTooHighError };
        }
        return { valid: true, message: hebrewDict.ex12.success};
    }
    validate({ inputs }) {
        const { ifWord, weightWord, sign, weightValue } = this.extractInputs(inputs);
        this.inputIfWord = ifWord;
        this.inputWeightWord = weightWord;
        this.inputSign = sign;
        this.inputWeightLimit = weightValue;
        if (this.inputIfWord !== hebrewDict.if) {
            return {valid:false, message: hebrewDict.ex12.ifError};
        }
        if (this.inputWeightWord !== hebrewDict.ex12.weight) {
            return {valid:false, message: hebrewDict.ex12.weightWordError};
        }
        if (this.inputSign !== '>') {
            return {valid:false, message: hebrewDict.ex12.signError};
        }
        return {valid:true, message: ''};
    }
}

export default new Exercise12();
