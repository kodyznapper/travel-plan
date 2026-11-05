// node tests/gas/call.js <stateFile> <fn> <argsJSON>
// Runs one public Code.gs function against the fake services, saves state, prints {"ok": result} or {"error": message}.
// The e2e test (tests/e2e/ftest4.py) routes the page's google.script.run calls here.
const fs = require('fs');
const { emptyState, load, publicNames } = require('./fake-gas');
const [, , stateFile, fn, argsJson] = process.argv;
const st = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, 'utf8')) : emptyState();
const ctx = load(st);
let out;
try {
  if (!publicNames(ctx).includes(fn)) throw new Error('Script function not found: ' + fn);   // GAS refuses private (name_) functions
  out = { ok: ctx[fn].apply(null, JSON.parse(argsJson || '[]')) };
  if (out.ok === undefined) out.ok = null;
} catch (e) { out = { error: String(e && e.message || e) }; }
fs.writeFileSync(stateFile, JSON.stringify(st));
process.stdout.write(JSON.stringify(out));
