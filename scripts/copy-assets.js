// کپی آیکون‌ها و فونت‌ها از node_modules به www تا بازی کاملاً آفلاین کار کند
const fs = require('fs'), path = require('path');
const nm = p => path.join('node_modules', p);
fs.mkdirSync('www/fonts', { recursive: true });
fs.copyFileSync(nm('lucide/dist/umd/lucide.min.js'), 'www/lucide.min.js');
const fonts = [
  ['@fontsource/orbitron/files/orbitron-latin-800-normal.woff2', 'Orbitron', 800],
  ['@fontsource/vazirmatn/files/vazirmatn-arabic-400-normal.woff2', 'Vazirmatn', 400],
  ['@fontsource/vazirmatn/files/vazirmatn-arabic-700-normal.woff2', 'Vazirmatn', 700],
  ['@fontsource/vazirmatn/files/vazirmatn-arabic-900-normal.woff2', 'Vazirmatn', 900],
];
let css = '';
for (const [f, fam, w] of fonts) {
  try {
    const name = path.basename(f);
    fs.copyFileSync(nm(f), 'www/fonts/' + name);
    css += `@font-face{font-family:${fam};font-weight:${w};font-display:swap;src:url(fonts/${name}) format('woff2')}\n`;
  } catch (e) { console.log('font skipped:', f); }
}
fs.writeFileSync('www/fonts.css', css);
console.log('assets ready');
