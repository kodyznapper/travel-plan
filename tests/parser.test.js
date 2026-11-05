// node tests/parser.test.js — parse -> serialize -> parse must be lossless for every md in data/
const TP = require('../src/parser.js'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const files = fs.readdirSync(path.join(root, 'data/seed')).map(f => 'data/seed/' + f).concat(['data/travel-plan-template.md']);
const strip = o => JSON.parse(JSON.stringify(o, (k, v) => (k === 'id' ? undefined : v)));   // ids are random per parse
let fail = 0;
function check(name, cond) { console.log((cond ? 'PASS ' : 'FAIL ') + name); if (!cond) fail++; }
files.forEach(f => {
  const r = TP.parse(fs.readFileSync(path.join(root, f), 'utf8'));
  check(f + ' has no parse warnings', r.warnings.length === 0);
  if (r.warnings.length) console.log('   ', r.warnings);
  const r2 = TP.parse(TP.toMarkdown(r.trip));
  check(f + ' round-trips losslessly', JSON.stringify(strip(r.trip)) === JSON.stringify(strip(r2.trip)));
  check(f + ' round-trip adds no warnings', r2.warnings.length === 0);
});
const L = TP.parseLines('BL, G, airport, Yamanote#80c241, nope');
check('known line codes resolve', L[0].hex === '#0070BD' && L[2].code === 'AIRPORT');
check('custom Name#hex works', L[3].known && L[3].hex === '#80C241');
check('unknown code is flagged', L[4].known === false);
const bad = TP.parse('---\ntitle: x\nstart: 2027-01-01\nend: 2027-01-01\n---\n# Day 1 — 2027-01-01 · t\nroute: a → b\n### 09:00 · x\n- line: ZZZ\n');
check('unknown line code gives a warning', bad.warnings.some(w => /ZZZ/.test(w)));
process.exit(fail ? 1 : 0);
