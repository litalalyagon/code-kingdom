//python -m http.server
//http://localhost:8000/
import { renderMenu, setActiveMenu } from './menu.js';
import { renderExercise } from './exercise.js';

const exerciseFiles = [
  './exercise1.js',
  './exercise2.js',
  './exercise3.js',
  './exercise4.js',
  './exercise5.js',
  './exercise6.js',
  './exercise7.js', 
  './exercise8.js',
  './exercise9.js',
  './exercise10.js',
  './exercise11.js',
  './exercise12.js',
  './exercise13.js',
  './exercise14.js',
  // Add more as needed
];

let loadedExercises = Array(exerciseFiles.length).fill(null);

async function loadExercise(idx) {
  if (!loadedExercises[idx]) {
    const module = await import(exerciseFiles[idx]);
    loadedExercises[idx] = module.default;
  }
  return loadedExercises[idx];
}

async function showExercise(idx) {
  setActiveMenu(idx);
  const ex = await loadExercise(idx);
  renderExercise(ex, idx);
}
renderMenu(Array(exerciseFiles.length).fill({}), showExercise);
showExercise(0);

