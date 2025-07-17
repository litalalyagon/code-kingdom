import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise12 extends Exercise {
    constructor() {
        super("ex12");
        this.input_sizes = { 'easy': 'small', 'hard': 'xlarge' };
        this.resultImgBg = '#d9f4fe';
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
            full_string = this.createFieldDisplayDetails({ posttext: ":" });
        }
        combined = full_string.concat(this.createFieldDisplayDetails({ pretext: ` ${hebrewDict.ex12.detach}`, indentation: true, field_type: 'text' }))
        return combined;
    }

    composeImageHtml(vars) {
        const { sign, weightLimit } = vars;
        let bagImg;
        let images = [];
        const backgroundImg = this.path("balloon.png");
        images.push(backgroundImg);
        for (const weight of this.bagWeights) {
            if (this.evaluateCondition(weight, sign, parseInt(weightLimit, 10))) {
                bagImg = this.path(`bag_${weight}_off.png`);
            } else {
                bagImg = this.path(`bag_${weight}.png`);
            }
            images.push(bagImg);
        }
        return this.generateImageHTML(images);
    }

    getDefaultHtml() {
        return this.composeImageHtml({ sign: ">", weightLimit: 100 });
    }

    extractInputs(inputs) {
        let ifWord, weightWord, sign, weightValue, fullString;
        if (this.level === 'easy') {
            [weightWord, weightValue] = Array.from(inputs).map(s => s.value.trim());
            ifWord = hebrewDict.if;
            sign = '>';
        } else {
            [fullString] = Array.from(inputs).map(i => i.value.trim());
            if (fullString.startsWith(hebrewDict.if)) {
                fullString = fullString.slice(hebrewDict.if.length).trim();
                ifWord = hebrewDict.if;
            }
            const match = fullString.match(/^(\S+)\s*([<>=!]+)\s*(\S+)$/);
            if (match) {
                weightWord = match[1].trim();     // "משקל"
                sign = match[2].trim();           // "<"
                weightValue = match[3].trim();    // "14"
            }
        }
        return { ifWord, weightWord, sign, weightValue };
    }

    handleRun() {
        return this.composeImageHtml({ sign: this.inputSign, weightLimit: this.inputWeightLimit });
    }

    isCorrect() {
        let weightLimit = parseInt(this.inputWeightLimit, 10);
        if (this.inputSign !== '>') {
            return { valid: false, message: hebrewDict.ex12.signError };
        }
        if (weightLimit < 40) {
            return { valid: false, message: hebrewDict.ex12.weightLimitTooLowError };
        } else if (weightLimit >= 55) {
            return { valid: false, message: hebrewDict.ex12.weightLimitTooHighError };
        }
        return { valid: true, message: hebrewDict.ex12.success };
    }

    validate({ inputs }) {
        const { ifWord, weightWord, sign, weightValue } = this.extractInputs(inputs);
        this.inputIfWord = ifWord;
        this.inputWeightWord = weightWord;
        this.inputSign = sign;
        this.inputWeightLimit = weightValue;

        if (this.inputIfWord !== hebrewDict.if) {
            return { valid: false, message: hebrewDict.ex12.ifError };
        }
        if (!this.inputWeightLimit && !this.inputSign && !this.inputWeightWord) {
            return { valid: false, message: hebrewDict.ex12.error_message };
        }
        if (this.inputWeightWord !== hebrewDict.ex12.weight) {
            return { valid: false, message: hebrewDict.ex12.weightWordError };
        }
        if (this.inputSign !== '>' && this.inputSign !== '<') {
            return { valid: false, message: hebrewDict.ex12.signError };
        }
        // check if the value is a number
        if (!this.inputWeightLimit || isNaN(this.inputWeightLimit)) {
            return { valid: false, message: hebrewDict.ex12.weightError };
        }
        return { valid: true, message: '' };
    }
}

export default new Exercise12();
