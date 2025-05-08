export default {
  levels: {
    easy: {
      codeParts: [
        { type: 'text', value: 'צבע עצים = ' },
        { type: 'dropdown', options: ['כחול', 'ירוק', 'אדום'], answer: 'כחול', default: 'כחול' },
        { type: 'text', value: '\n' },
        { type: 'text', value: 'עננים = ' },
        { type: 'dropdown', options: ['0', '2', '3'], answer: '3', default: '3' },
        { type: 'text', value: '\n' },
        { type: 'text', value: 'קשת = ' },
        { type: 'dropdown', options: ['כן', 'לא'], answer: 'לא', default: 'לא' }
      ],
      image: 'forest_blue_3.png',
      handleRun: function({ selects, imgDiv }) {
        const [color, clouds, rainbow] = Array.from(selects).map(s => s.value);
        let colorKey = '';
        if (color === 'כחול') colorKey = 'blue';
        else if (color === 'ירוק') colorKey = 'green';
        else if (color === 'אדום') colorKey = 'orange';
        else colorKey = color;
        let fileName = `forest_${colorKey}_${clouds}`;
        if (rainbow === 'כן') fileName += '_rb';
        fileName += '.png';
        imgDiv.innerHTML = `<img src="${fileName}" alt="Result" style="max-width:100%;max-height:100%;">`;
      }
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
      ],
      image: 'forest_blue_3.png',
      handleRun: function({ codeArea, imgDiv }) {
        const inputs = codeArea.querySelectorAll('input');
        const [color, clouds, rainbow] = Array.from(inputs).map(i => i.value.trim());
        let colorKey = '';
        if (color === 'כחול') colorKey = 'blue';
        else if (color === 'ירוק') colorKey = 'green';
        else if (color === 'כתום') colorKey = 'orange';
        else colorKey = color;
        let fileName = `forest_${colorKey}_${clouds}`;
        if (rainbow === 'כן') fileName += '_rb';
        fileName += '.png';
        imgDiv.innerHTML = `<img src="${fileName}" alt="Result" style="max-width:100%;max-height:100%;">`;
      }
    }
  }
};
