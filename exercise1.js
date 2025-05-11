import { Exercise } from './exercise.js';

class Exercise1 extends Exercise {
  constructor() {
    super('משימה 1: משנים את הנוף', {
      easy: {
        codeParts: [
          { type: 'text', value: 'צבע עצים = ' },
          { type: 'dropdown', options: ['כחול', 'ירוק', 'כתום'], answer: 'כחול', default: 'כחול' },
          { type: 'text', value: '\n' },
          { type: 'text', value: 'עננים = ' },
          { type: 'dropdown', options: ['1', '2', '3'], answer: '3', default: '3' },
          { type: 'text', value: '\n' },
          { type: 'text', value: 'קשת = ' },
          { type: 'dropdown', options: ['כן', 'לא'], answer: 'לא', default: 'לא' }
        ]
      },
      hard: {
        codeParts: [
          { type: 'text', value: 'צבע עצים = ' },
          { type: 'input', answer: 'כחול', default: 'כחול' },
          { type: 'text', value: '\n' },
          { type: 'text', value: 'עננים = ' },
          { type: 'input', answer: '3', default: '3' },
          { type: 'text', value: '\n' },
          { type: 'text', value: 'קשת = ' },
          { type: 'input', answer: 'לא', default: 'לא' }
        ]
      }
    });
  }

  getDefaultHtml(level = 'easy') {
    const color = 'כחול';
    const clouds = '3';
    const rainbow = 'לא';
    let colorKey = '';
    if (color === 'כחול') colorKey = 'blue';
    else if (color === 'ירוק') colorKey = 'green';
    else if (color === 'כתום') colorKey = 'orange';
    else colorKey = color;
    const forestImg = `ex1/forest_${colorKey}.png`;
    const cloudsImg = `ex1/clouds_${clouds}.png`;
    const rainbowImg = rainbow === 'כן' ? 'ex1/rainbow.png' : null;
    let html = `<div style="position:relative;display:inline-block;">`;
    if (rainbowImg) {
      html += `<img src='${rainbowImg}' alt='rainbow' style='position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;'>`;
    }
    html += `<img src='${forestImg}' alt='forest' style='position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;'>`;
    html += `<img src='${cloudsImg}' alt='clouds' style='position:absolute;top:0;left:0;width:100%;height:100%;z-index:3;'>`;
    html += `<img src='${forestImg}' alt='' style='visibility:hidden;position:relative;width:100%;height:auto;'>`;
    html += '</div>';
    return html;
  }

  handleRun({ selects, codeArea, imgDiv, level = 'easy' }) {
    let color, clouds, rainbow;
    if (level === 'easy') {
      [color, clouds, rainbow] = Array.from(selects).map(s => s.value);
    } else {
      const inputs = codeArea.querySelectorAll('input');
      [color, clouds, rainbow] = Array.from(inputs).map(i => i.value.trim());
    }
    let colorKey = '';
    if (color === 'כחול') colorKey = 'blue';
    else if (color === 'ירוק') colorKey = 'green';
    else if (color === 'כתום') colorKey = 'orange';
    else colorKey = color;
    const forestImg = `ex1/forest_${colorKey}.png`;
    const cloudsImg = `ex1/clouds_${clouds}.png`;
    const rainbowImg = rainbow === 'כן' ? 'ex1/rainbow.png' : null;
    let html = `<div style="position:relative;display:inline-block;">`;
    if (rainbowImg) {
      html += `<img src='${rainbowImg}' alt='rainbow' style='position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;'>`;
    }
    html += `<img src='${forestImg}' alt='forest' style='position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;'>`;
    html += `<img src='${cloudsImg}' alt='clouds' style='position:absolute;top:0;left:0;width:100%;height:100%;z-index:3;'>`;
    html += `<img src='${forestImg}' alt='' style='visibility:hidden;position:relative;width:100%;height:auto;'>`;
    html += '</div>';
    imgDiv.innerHTML = html;
  }
}

export default new Exercise1();
