export default {
  title: 'הדפס חיבור',
  codeParts: [
    { type: 'text', value: 'print(' },
    { type: 'dropdown', options: ['2+3', '"2+3"', '5'], answer: '2+3' },
    { type: 'text', value: ')' }
  ],
  image: 'placeholder3.png',
  outcomes: {
    '2+3': 'placeholder3.png',
    '"2+3"': 'placeholder_wrong.png',
    '5': 'placeholder_wrong.png'
  }
};
