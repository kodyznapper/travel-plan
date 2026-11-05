// node tests/gas.test.js — server logic of dist/gas/Code.gs against fake Apps Script services (run `make build` first)
const fs = require('fs'), path = require('path');
const TP = require('../src/parser.js');
const { emptyState, load, publicNames } = require('./gas/fake-gas');
const SEED = fs.readFileSync(path.join(__dirname, '../data/seed/taiwan-2026.md'), 'utf8');
const KEY = 'test-key-123';
let ok = true;
function check(name, cond) { console.log((cond ? 'PASS ' : 'FAIL ') + name); ok = ok && !!cond; }
function throws(fn, code) { try { fn(); return false; } catch (e) { return String(e.message).indexOf(code) >= 0; } }

// ---- setup() ----
let st = emptyState({ props: { EDIT_KEY: KEY } });
let gs = load(st);
check('public functions are only doGet/getTrip/checkKey/saveTrip/setup', publicNames(gs).sort().join() === 'checkKey,doGet,getTrip,saveTrip,setup');
check('build embedded the seed in Code.gs', gs.SEED_MD === SEED);
check('getTrip before setup -> NOT_SET_UP', throws(() => gs.getTrip(''), 'NOT_SET_UP'));
check('setup refuses anonymous callers (web app visitors)', throws(() => gs.setup(), 'Run setup()'));
st.activeUser = st.owner;
const out1 = gs.setup();
const fid = st.props.TRIP_FILE_ID;
check('setup creates the plan file from the seed', fid && st.files[fid].content === SEED && /Created plan file/.test(out1));
check('setup creates the backup folder', st.props.BACKUP_FOLDER_ID && st.folders[st.props.BACKUP_FOLDER_ID]);
gs.setup();
check('setup is idempotent (no second plan file)', Object.keys(st.files).length === 1 && st.props.TRIP_FILE_ID === fid);
st.activeUser = '';

// ---- reading ----
const v = gs.getTrip('');
check('viewer read: owner=false', v.ok && v.owner === false);
check('viewer read: "# วางแผน" removed', SEED.indexOf('# วางแผน') >= 0 && v.md.indexOf('# วางแผน') < 0);
check('viewer read: HTML comments removed', gs.viewerMd_(SEED + '\n<!-- private note -->\n').indexOf('private note') < 0);
const pv = TP.parse(v.md).trip, pf = TP.parse(SEED).trip;
check('viewer read: rest of the plan intact (days/items/pack/todo/ref)', pv.days.length === pf.days.length && pv.days.every((d, i) => d.items.length === pf.days[i].items.length) && pv.pack.length === pf.pack.length && pv.todo.length === pf.todo.length && pv.ref.length === pf.ref.length && pv.plan === '' && pf.plan.length > 0);
const o = gs.getTrip(KEY);
check('owner read: full file + owner=true', o.owner === true && o.md === SEED);
check('wrong key read: falls back to viewer copy', gs.getTrip('nope').owner === false);
check('version is a string', typeof o.version === 'string' && o.version === v.version);
check('checkKey right/wrong', gs.checkKey(KEY).ok === true && gs.checkKey('x').ok === false && gs.checkKey('').ok === false);

// ---- saving ----
const md2 = SEED.replace('# Day 1', '# Day 1').replace(/(# Day 1[^\n]*· )([^\n]+)/, '$1TEST THEME');
check('test edit changes the md', md2 !== SEED);
check('save without key -> BAD_KEY', throws(() => gs.saveTrip(md2, '', o.version, false), 'BAD_KEY') && st.files[fid].content === SEED);
check('save with wrong key -> BAD_KEY, file unchanged', throws(() => gs.saveTrip(md2, 'wrong', o.version, false), 'BAD_KEY') && st.files[fid].content === SEED);
check('save junk -> NOT_A_PLAN', throws(() => gs.saveTrip('hello', KEY, o.version, false), 'NOT_A_PLAN'));
check('save empty -> EMPTY', throws(() => gs.saveTrip('  ', KEY, o.version, false), 'EMPTY'));
st.cache = {};   // reset the wrong-key counter used above
const s1 = gs.saveTrip(md2, KEY, o.version, false);
const backups = () => Object.values(st.files).filter(f => f.parent === st.props.BACKUP_FOLDER_ID);
check('save with key + current version -> ok, new version', s1.ok === true && s1.version !== o.version && st.files[fid].content === md2);
check('save backs up the previous content', backups().length === 1 && backups()[0].content === SEED);
const s2 = gs.saveTrip(SEED, KEY, o.version, false);
check('save on a stale version -> conflict, file unchanged', s2.ok === false && s2.conflict === true && s2.version === s1.version && st.files[fid].content === md2);
const s3 = gs.saveTrip(SEED, KEY, o.version, true);
check('force save overwrites + backs up', s3.ok === true && st.files[fid].content === SEED && backups().length === 2);
check('viewer sees the saved change', gs.getTrip('').version === s3.version);

// ---- wrong-key lockout ----
st.cache = {};
for (let i = 0; i < 10; i++) gs.checkKey('guess' + i);
check('10 wrong keys -> LOCKED (even the right key)', throws(() => gs.checkKey(KEY), 'LOCKED') && throws(() => gs.saveTrip(SEED, KEY, s3.version, false), 'LOCKED'));
check('lockout never blocks reading', gs.getTrip('').ok === true && gs.getTrip(KEY).owner === false);
st.clock += 601 * 1000;
check('lockout expires after the window', gs.checkKey(KEY).ok === true);

// ---- no key configured ----
const st2 = emptyState({ activeUser: 'owner@example.com' }); const g2 = load(st2); g2.setup(); st2.activeUser = '';
check('no EDIT_KEY set -> nobody can save, empty key never matches', g2.checkKey('').ok === false && throws(() => g2.saveTrip(SEED, 'anything', '', true), 'BAD_KEY'));

// ---- empty plan file (what happened on the first real deployment) ----
const st3 = emptyState({ props: { EDIT_KEY: KEY }, activeUser: 'owner@example.com' }); const g3 = load(st3); g3.setup(); st3.activeUser = '';
check('getTrip reports the raw size', g3.getTrip('').size === SEED.length);
st3.files[st3.props.TRIP_FILE_ID].content = '';
const e3 = g3.getTrip('');
check('empty Drive file: getTrip says size 0 (page can show an error)', e3.ok && e3.md === '' && e3.size === 0);
const s4 = g3.saveTrip(SEED, KEY, e3.version, false);
check('owner can save a plan over an empty file', s4.ok === true && st3.files[st3.props.TRIP_FILE_ID].content === SEED);
st3.files[st3.props.TRIP_FILE_ID].content = ''; st3.activeUser = st3.owner;
const out3 = g3.setup(); st3.activeUser = '';
check('setup refills an empty plan file from the seed', /was empty/.test(out3) && st3.files[st3.props.TRIP_FILE_ID].content === SEED && Object.keys(st3.files).filter(k => st3.files[k].parent === 'root').length === 1);

// ---- code fences keep "# " lines that are not headings ----
const fenced = SEED + '\n# ข้อมูลอ้างอิง\n\n```\n# วางแผน\n```\n';
check('viewerMd_: "# วางแผน" inside a code block is not treated as a heading', gs.viewerMd_(fenced).indexOf('```\n# วางแผน\n```') >= 0);

console.log(ok ? 'ALL PASS' : 'SOME FAILED'); process.exit(ok ? 0 : 1);
