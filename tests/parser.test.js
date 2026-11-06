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
// video: clip links separated by | (also " · " / spaces), only http(s), platform from the host
const V = TP.videoLinks('https://www.tiktok.com/@a/video/1 | https://youtu.be/x · https://m.youtube.com/watch?v=y javascript:alert(1) | ftp://x | https://vt.tiktok.com/Z/ https://tiktok.com.evil.example/x https://www.instagram.com/reel/q https://fb.watch/z https://example.com/a?b=1');
check('video: only http(s) links kept', V.length === 8 && V.every(v => /^https?:\/\//.test(v.url)));
check('video: platform from the host', V.map(v => v.kind).join() === 'tiktok,youtube,youtube,tiktok,link,instagram,facebook,link');   // tiktok.com.evil.example is not TikTok
const vt = TP.parse('---\ntitle: x\nstart: 2027-01-01\nend: 2027-01-01\ntimezone: Asia/Taipei\n---\n# Day 1 — 2027-01-01 · t\nroute: a → b\n### 09:00 · x\n- video: https://youtu.be/a | https://www.tiktok.com/@b/video/2\n');
check('video: parsed as a known field (no warning, not in extra)', vt.warnings.length === 0 && vt.trip.days[0].items[0].video === 'https://youtu.be/a | https://www.tiktok.com/@b/video/2' && !Object.keys(vt.trip.days[0].items[0].extra).length);
check('video: written back after map', /- video: https:\/\/youtu\.be\/a \| https:\/\/www\.tiktok\.com\/@b\/video\/2/.test(TP.toMarkdown(vt.trip)));
process.exit(fail ? 1 : 0);
