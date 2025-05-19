import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';

class Exercise12 extends Exercise {
  constructor() {
    super("ex12");
    this.input_sizes = {'easy': 'medium', 'hard': 'xlarge'};
  }
  bagWeights = [30, 40, 55, 90];
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
            full_string = this.createFieldDisplayDetails();
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
        return this.composeImageHtml({weightLimit: 0});

    }
    extractInputs(inputs) {
    let weightWord, weightValue, fullString;
    if (this.level === 'easy') {
        [weightWord, weightValue] = Array.from(inputs).map(s => s.value.trim());
    } else {
        let inputs_array = Array.from(inputs).map(i => i.value.trim());
        }
    }
}

export default new Exercise12();
