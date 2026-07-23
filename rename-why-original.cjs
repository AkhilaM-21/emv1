const fs = require('fs');
const cp = require('child_process');

// 1. Get original WhyEmvive.jsx from git
let jsx = cp.execSync('git show main:src/components/WhyEmvive.jsx').toString('utf8');

// Replace class prefixes to avoid conflicts
jsx = jsx.replace(/\.why-/g, '.why-original-');
jsx = jsx.replace(/className=\"why-/g, 'className=\"why-original-');
jsx = jsx.replace(/WhyEmvive/g, 'WhyEmviveOriginal');
jsx = jsx.replace(/WhyEmvive\.css/g, 'WhyEmviveOriginal.css');

fs.writeFileSync('src/components/WhyEmviveOriginal.jsx', jsx, 'utf8');

// 2. Read the CSS we saved earlier
let css = fs.readFileSync('src/components/WhyEmviveOriginal.css', 'utf8');

// Replace class prefixes and animations to avoid conflicts
css = css.replace(/\.why-/g, '.why-original-');
css = css.replace(/why-sweep/g, 'why-original-sweep');
css = css.replace(/why-point-dart/g, 'why-original-point-dart');

fs.writeFileSync('src/components/WhyEmviveOriginal.css', css, 'utf8');
