/* eslint-env node */
/* eslint-disable no-undef */  // eslint comprend mal require ici, on disable
const fs = require('fs');
const { globSync } = require('glob');

const BAD = /[\u00A0\u1680\u180E\u2000-\u200F\u2028-\u202F\u205F\u3000\uFEFF]/g;

const files = globSync('src/**/*.{js,jsx,ts,tsx}', { nodir: true });

files.forEach((file) => {
  const text = fs.readFileSync(file, 'utf8');
  if (!BAD.test(text)) return;
  fs.writeFileSync(file, text.replace(BAD, ' '), 'utf8');
  console.log('✅ cleaned', file);
});
