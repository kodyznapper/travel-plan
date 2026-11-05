// node tests/i18n-coverage.js — every Thai UI string wrapped in T('...') must have an English translation
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '../src/app.js'), 'utf8');
const m = src.match(/var EXACT = (.*);\n  var PHR = (.*);\n/);
const EXACT = JSON.parse(m[1]), PHR = JSON.parse(m[2]);
const keys = Object.keys(PHR).sort((a, b) => b.length - a.length);
const TH = /[\u0E00-\u0E7F]/;
const tr = s => { if (s in EXACT) return EXACT[s]; let o = s; keys.forEach(k => { if (o.includes(k)) o = o.split(k).join(PHR[k]); }); return o; };
const lits = [...src.matchAll(/T\('((?:[^'\\\n]|\\.)*)'\)/g)].map(x => x[1]);
const bad = lits.filter(l => TH.test(tr(l)));
const unwrapped = [];
src.split('\n').forEach((ln, i) => {
  if (ln.includes('/*noT*/') || /^\s*var (EXACT|PHR)\b/.test(ln)) return;
  for (const x of ln.matchAll(/(T\()?'((?:[^'\\\n]|\\.)*)'/g)) if (!x[1] && TH.test(x[2])) unwrapped.push((i + 1) + ': ' + x[2].slice(0, 60));
});
console.log(`T() literals: ${lits.length} (unique ${new Set(lits).size}); untranslated: ${bad.length}; unwrapped Thai literals: ${unwrapped.length}`);
bad.forEach(b => console.log('  UNTRANSLATED:', b.slice(0, 100)));
unwrapped.forEach(b => console.log('  UNWRAPPED:', b));
process.exit(bad.length || unwrapped.length ? 1 : 0);
