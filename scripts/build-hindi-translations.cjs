const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const transPath = path.join(root, 'src', 'locales', 'translations.ts');
const transContent = fs.readFileSync(transPath, 'utf8');

// Read existing scratch_hi if present
let scratchHi = '';
const scratchPath = path.join(root, 'scratch_hi.txt');
if (fs.existsSync(scratchPath)) {
  scratchHi = fs.readFileSync(scratchPath, 'utf8')
    .replace(/\\n/g, '\n')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"');
}

// Extract existing Hindi map
const existingHi = {};
const hiRegex = /^\s*([a-zA-Z0-9_]+)\s*:\s*('(?:[^'\\]|\\.)*'|`[^`]*`)/gm;
let m;
while ((m = hiRegex.exec(scratchHi)) !== null) {
  let val = m[2];
  if (val.startsWith("'") && val.endsWith("'")) {
    val = val.slice(1, -1);
  }
  existingHi[m[1]] = val;
}

console.log('Existing Hindi keys loaded:', Object.keys(existingHi).length);

// Extract English keys
const enMatch = transContent.match(/en:\s*\{([\s\S]*?)\},\s*te:/);
if (!enMatch) {
  console.error('Could not match en block!');
  process.exit(1);
}

const enLines = enMatch[1].split('\n');
const enKeys = [];
for (const line of enLines) {
  const km = line.match(/^\s*([a-zA-Z0-9_]+)\s*:\s*('(?:[^'\\]|\\.)*'|`[^`]*`)/);
  if (km) {
    let val = km[2];
    if (val.startsWith("'") && val.endsWith("'")) {
      val = val.slice(1, -1);
    }
    enKeys.push({ key: km[1], val });
  }
}
console.log('Total English keys:', enKeys.length);

const missingInExisting = enKeys.filter(k => !existingHi[k.key]);
console.log('Missing in existing:', missingInExisting.length);
fs.writeFileSync(path.join(root, 'missing_hi_keys.json'), JSON.stringify(missingInExisting, null, 2));
