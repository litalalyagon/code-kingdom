export default {
  title: 'הדפס מחרוזת עם מספר',
  codeParts: [
    { type: 'text', value: 'הדפס("מספר: " +' },
    { type: 'dropdown', options: ['5', '"5"', 'חמש'], answer: '"5"' },
    { type: 'text', value: ')' }
  ],
  image: 'placeholder4.png',
  outcomes: {
    '"5"': 'placeholder4.png',
    '5': 'placeholder_wrong.png',
    'חמש': 'placeholder_wrong.png'
  }
};
