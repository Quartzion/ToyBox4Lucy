// contrast-checker-script.js
const fs = require('fs');
const css = require('css');
const ColorContrastChecker = require('color-contrast-checker');

const ccc = new ColorContrastChecker();
const cssFile = fs.readFileSync('./client/src/appStyle.css', 'utf8');
const parsed = css.parse(cssFile);

parsed.stylesheet.rules.forEach(rule => {
  const decls = rule.declarations || [];
  const color = decls.find(d => d.property === 'color')?.value;
  const bgColor = decls.find(d => d.property === 'background-color')?.value;
  
  if (color && bgColor) {
    const passes = ccc.isLevelAA(color, bgColor, 14);
    console.log(`${rule.selectors} - AA Contrast Pass? ${passes}`);
  }
});
