const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

console.log('Building production bundle in ./dist...');

// 1. Minify CSS
let css = fs.readFileSync(path.join(srcDir, 'Style.css'), 'utf8');
let minCss = css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ')             // Collapse whitespace
    .replace(/\s*([{}:;,>+~])\s*/g, '$1') // Remove spaces around delimiters
    .replace(/;}/g, '}')              // Remove trailing semicolons
    .trim();

fs.writeFileSync(path.join(distDir, 'style.min.css'), minCss);
console.log(`✓ Minified Style.css -> dist/style.min.css (${(minCss.length / 1024).toFixed(1)} KB)`);

// 2. Minify JS
let js = fs.readFileSync(path.join(srcDir, 'Script.js'), 'utf8');
let minJs = js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\/\/[^\n\r]*/g, '')     // Remove single-line comments
    .replace(/^\s+|\s+$/gm, '')       // Trim lines
    .replace(/\n{2,}/g, '\n');        // Collapse empty lines

fs.writeFileSync(path.join(distDir, 'script.min.js'), minJs);
console.log(`✓ Minified Script.js -> dist/script.min.js (${(minJs.length / 1024).toFixed(1)} KB)`);

// 3. Process Index.html
let html = fs.readFileSync(path.join(srcDir, 'Index.html'), 'utf8');
let distHtml = html
    .replace('href="Style.css"', 'href="style.min.css"')
    .replace('src="Script.js"', 'src="script.min.js"');

fs.writeFileSync(path.join(distDir, 'index.html'), distHtml);
console.log(`✓ Processed Index.html -> dist/index.html`);

console.log('Build completed successfully in ./dist ready for Vercel, Netlify, or GitHub Pages!');
