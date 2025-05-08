export default {
  title: 'הדפס מספר',
  codeParts: [
    { type: 'text', value: 'print(' },
    { type: 'dropdown', options: ['5', '"5"', 'חמש'], answer: '5' },
    { type: 'text', value: ')' }
  ],
  image: 'placeholder2.png',
  outcomes: {
    '5': 'placeholder2.png',
    '"5"': 'placeholder_wrong.png',
    'חמש': 'placeholder_wrong.png'
  }
};
