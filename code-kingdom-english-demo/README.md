# Code Kingdom English Demo

This is an English demo version of the Code Kingdom educational coding platform.

## Features

- **No Authentication Required**: Demo mode runs without login/signup
- **Limited Access**: Only Tasks 1 and 10 are available
- **Fully Translated**: All UI and content translated to English
- **LTR Layout**: Adapted for left-to-right reading

## Available Tasks

1. **Task 1: Variables - Changing the Landscape**
   - Introduction to variables
   - Change tree colors, clouds, and rainbow
   - Easy and Hard difficulty levels

2. **Task 10: Conditions - Lighting Torches**
   - Introduction to conditional logic with "OR" operator
   - Light torches based on color, shape, and size properties
   - Easy and Hard difficulty levels

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
- `exercise1.js` - Task 1 implementation
- `exercise10.js` - Task 10 implementation
- `english-dict.js` - English translations
- `sideMenu.js` - Sidebar menu toggle
- `styles/` - CSS files (LTR adapted)

## Differences from Full Version

- No Firebase authentication
- No user progress tracking
- No completion saving
- Only 2 exercises available (1 and 10)
- All other tasks shown as disabled in menu

## Purpose

This demo is designed to showcase the Code Kingdom learning platform to English-speaking audiences without requiring full account setup or exposing all content.
