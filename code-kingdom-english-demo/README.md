# Code Kingdom English Demo

This is an English demo version of the Code Kingdom educational coding platform.

## Features

- **No Authentication Required**: Demo mode runs without login/signup
- **Full Access**: All 13 tasks are available
- **Fully Translated**: All UI and content translated to English
- **LTR Layout**: Adapted for left-to-right reading

## Available Tasks

All 13 tasks are available covering:

1. **Variables** (Tasks 1-4): Introduction to variables, changing values, calculations
2. **Conditions** (Tasks 5-10): If statements, boolean logic, AND/OR operators
3. **Summary** (Tasks 11-13): Combining concepts learned

## How to Run

1. Serve the parent directory with a local web server:
   ```
   python -m http.server 8000
   ```

2. Open in browser:
   ```
   http://localhost:8000/code-kingdom-english-demo/
   ```

## File Structure

- `index.html` - Main demo page
- `main.js` - Demo-specific logic (no auth)
- `menu.js` - Menu rendering
- `exercise.js` - Exercise base class
- `exercise1.js` through `exercise13.js`
- `english-dict.js` - English translations
- `sideMenu.js` - Sidebar menu toggle
- `styles/` - CSS files (LTR adapted)

## Differences from Full Version

- No Firebase authentication
- No user progress tracking
- No completion saving
- All exercises immediately available (no sequential unlocking)

## Purpose

This demo is designed to showcase the complete Code Kingdom learning platform to English-speaking audiences without requiring full account setup.
