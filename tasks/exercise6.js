import { Exercise } from './exercise.js';
import { hebrewDict } from './hebrew-dict.js';
class Exercise6 extends Exercise {
  constructor() {
    super(hebrewDict.ex6.title);
    this.description = hebrewDict.ex6.description;
  }
getCodeParts() {
    let key_field, color_field, unlock_line, combined;
    if (this.level === 'easy') {
      key_field = this.createFieldDisplayDetails({pretext: `${hebrewDict.if} `, new_line: false}); 
      color_field = this.createFieldDisplayDetails({pretext: ` == `, posttext: ':'});
      unlock_line = this.createFieldDisplayDetails({pretext: `${hebrewDict.ex6.unlock_line}`, indentation: true, new_line: false, field_type: "text"});
      combined = key_field.concat(color_field, unlock_line);
      return combined;
    } else {
      return this.createFieldDisplayDetails({});
    }
  }

composeImageHtml(vars) {
    let doorImg;
    if (isCorrect()) {
        doorImg = 'ex6/door_open.png';
    }
    else {
        doorImg = 'ex6/door_close.png';
    }
    return this.generateImageHTML([doorImg]);
  }

isCorrect() {
    return true;
    }
}
export default new Exercise6();