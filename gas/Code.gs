/* Travel Plan — Google Apps Script server (Phase 2c).
 *
 * Deploy as web app: Execute as = Me, Who has access = Anyone.
 * Everyone can read the plan; only a caller that sends the right edit key can write.
 * The edit key lives in Script Properties (EDIT_KEY) — never in this file, the page or the repo.
 *
 * Public functions (callable from the page via google.script.run): doGet, doPost, getTrip, checkKey, saveTrip, setup.
 * Every helper ends with "_" so the page cannot call it.
 *
 * JSON API for the GitHub Pages front end (dist/pages, a normal top-level page, so iPhone keeps its storage):
 *   POST /exec   body (Content-Type text/plain, avoids a CORS preflight) = {"fn": "getTrip"|"checkKey"|"saveTrip", "args": [...]}
 *   GET  /exec?api=getTrip   viewer copy only (a GET never carries the edit key: URLs end up in logs)
 *   Answer: {"ok": <result>} or {"error": "BAD_KEY" | "LOCKED" | ...} — same results and errors as google.script.run.
 *
 * Script Properties:
 *   EDIT_KEY          set by the owner (Project Settings → Script properties). Long random text.
 *   TRIP_FILE_ID      written by setup(): the Drive file that holds the plan (.md)
 *   BACKUP_FOLDER_ID  written by setup(): Drive folder that receives a copy before every save
 *
 * Built by tools/build.py: SEED_MD below is replaced with data/seed/*.md (used once by setup()).
 */
var SEED_MD = /*@@SEED_MD@@*/null;

var MAX_MD = 600000;          // characters; the Taiwan plan is ~57k
var FAIL_LIMIT = 10;          // wrong keys allowed per window, for all callers together
var FAIL_WINDOW = 600;        // seconds
var PLAN_HEAD = 'วางแผน';     // "# วางแผน" section is owner-only

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.api) return apiOut_(p.api === 'getTrip' ? getTrip : null, ['']);
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Trip Plans - วางแผนเที่ยว')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

function doPost(e) {
  var req = null;
  try { req = JSON.parse(e.postData.contents); } catch (err) { req = null; }
  var fns = { getTrip: getTrip, checkKey: checkKey, saveTrip: saveTrip };
  var ok = req && typeof req.fn === 'string' && fns.hasOwnProperty(req.fn) && Array.isArray(req.args || []) && (req.args || []).length <= 4;
  return apiOut_(ok ? fns[req.fn] : null, ok ? req.args || [] : []);
}

/* Read the plan. Without a valid key the owner-only parts are removed. */
function getTrip(editKey) {
  var file = tripFile_();
  var md = readMd_(file);
  var owner = false;
  if (editKey) { try { owner = keyOk_(editKey); } catch (e) { owner = false; } }   // a locked-out key never blocks reading
  // size = raw characters in the Drive file (0 = the file is empty: the page says so instead of loading forever)
  return { ok: true, md: owner ? md : viewerMd_(md), version: versionOf_(file), owner: owner, name: file.getName(), size: md.length };
}

/* Lets the page confirm a key before storing it. */
function checkKey(editKey) {
  return { ok: !!editKey && keyOk_(editKey) };
}

/* Write the plan. baseVersion = the version the page loaded; force = overwrite a newer file. */
function saveTrip(md, editKey, baseVersion, force) {
  if (!editKey || !keyOk_(editKey)) throw new Error('BAD_KEY');
  md = String(md == null ? '' : md);
  if (!md.trim()) throw new Error('EMPTY');
  if (md.length > MAX_MD) throw new Error('TOO_BIG');
  if (!/^#\s*Day\s+\d+/m.test(md)) throw new Error('NOT_A_PLAN');
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error('BUSY');
  try {
    var file = tripFile_();
    var cur = versionOf_(file);
    if (!force && String(baseVersion) !== cur) return { ok: false, conflict: true, version: cur };
    backup_(file);
    file.setContent(md);
    var back = DriveApp.getFileById(file.getId());
    if (!readMd_(back).length) throw new Error('WRITE_FAILED');   // never report success when Drive kept nothing
    return { ok: true, version: versionOf_(back) };
  } finally {
    lock.releaseLock();
  }
}

/* Run once from the Apps Script editor (Run ▶ setup). Creates the plan file and backup folder in your Drive. */
function setup() {
  var me = Session.getActiveUser().getEmail();
  if (!me || me !== Session.getEffectiveUser().getEmail()) throw new Error('Run setup() from the Apps Script editor as the owner.');
  var props = PropertiesService.getScriptProperties();
  var out = [];
  var id = props.getProperty('TRIP_FILE_ID');
  if (id && fileExists_(id)) {
    var cur = DriveApp.getFileById(id);
    var n = readMd_(cur).length;
    if (n === 0 && SEED_MD) { cur.setContent(SEED_MD); n = readMd_(DriveApp.getFileById(id)).length; out.push('Plan file was empty: filled it from the seed'); }
    out.push('Plan file already set: ' + cur.getName() + ' (' + id + ') · ' + n + ' characters');
  } else {
    if (!SEED_MD) throw new Error('No seed plan in this build. Create a .md file in Drive and put its id in TRIP_FILE_ID.');
    var f = DriveApp.createFile(Utilities.newBlob(SEED_MD, 'text/plain', 'travel-plan.md'));
    props.setProperty('TRIP_FILE_ID', f.getId());
    out.push('Created plan file: ' + f.getName() + ' (' + f.getId() + ') · ' + readMd_(DriveApp.getFileById(f.getId())).length + ' characters');
  }
  var bid = props.getProperty('BACKUP_FOLDER_ID');
  if (bid && folderExists_(bid)) out.push('Backup folder already set (' + bid + ')');
  else {
    var b = DriveApp.createFolder('travel-plan backups');
    props.setProperty('BACKUP_FOLDER_ID', b.getId());
    out.push('Created backup folder (' + b.getId() + ')');
  }
  if (!props.getProperty('EDIT_KEY')) out.push('ยังไม่ได้ตั้ง EDIT_KEY: ไปที่ Project Settings → Script properties แล้วเพิ่ม EDIT_KEY');
  else out.push('EDIT_KEY is set');
  Logger.log(out.join('\n'));
  return out.join('\n');
}

/* ---------------- helpers (private) ---------------- */
function apiOut_(fn, args) {
  var out;
  if (!fn) out = { error: 'BAD_REQUEST' };
  else {
    try { var r = fn.apply(null, args); out = { ok: r === undefined ? null : r }; }
    catch (err) { out = { error: String((err && err.message) || err) }; }
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
function tripFile_() {
  var id = PropertiesService.getScriptProperties().getProperty('TRIP_FILE_ID');
  if (!id) throw new Error('NOT_SET_UP');
  return DriveApp.getFileById(id);
}
function readMd_(file) { return file.getBlob().getDataAsString('UTF-8') || ''; }
function versionOf_(file) { return String(file.getLastUpdated().getTime()); }
function fileExists_(id) { try { DriveApp.getFileById(id).getName(); return true; } catch (e) { return false; } }
function folderExists_(id) { try { DriveApp.getFolderById(id).getName(); return true; } catch (e) { return false; } }

function backup_(file) {
  var old = readMd_(file);
  if (!old.trim()) return;   // nothing worth keeping (e.g. first save over an empty plan file)
  var props = PropertiesService.getScriptProperties();
  var bid = props.getProperty('BACKUP_FOLDER_ID');
  var folder = null;
  if (bid) { try { folder = DriveApp.getFolderById(bid); } catch (e) { folder = null; } }
  if (!folder) { folder = DriveApp.createFolder('travel-plan backups'); props.setProperty('BACKUP_FOLDER_ID', folder.getId()); }
  var stamp = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd_HHmmss');
  folder.createFile(Utilities.newBlob(old, 'text/plain', 'travel-plan_' + stamp + '.md'));
}

/* Constant-time compare + a global limit on wrong guesses (the web app is anonymous, so there is no per-user limit). */
function keyOk_(given) {
  var cache = CacheService.getScriptCache();
  var fails = +(cache.get('keyFails') || 0);
  if (fails >= FAIL_LIMIT) throw new Error('LOCKED');
  var real = PropertiesService.getScriptProperties().getProperty('EDIT_KEY') || '';
  given = String(given);
  var diff = real.length === given.length && real.length > 0 ? 0 : 1;
  var n = Math.max(real.length, given.length);
  for (var i = 0; i < n; i++) diff |= (real.charCodeAt(i) || 0) ^ (given.charCodeAt(i) || 0);
  if (diff !== 0) { cache.put('keyFails', String(fails + 1), FAIL_WINDOW); return false; }
  return true;
}

/* What viewers get: no HTML comments, no "# วางแผน" section. */
function viewerMd_(md) {
  var s = String(md).replace(/<!--[\s\S]*?-->/g, '');
  var lines = s.split(/\r?\n/), out = [], skip = false, fence = false;
  for (var i = 0; i < lines.length; i++) {
    var ln = lines[i];
    if (/^\s*(```|~~~)/.test(ln)) fence = !fence;
    if (!fence && /^#\s/.test(ln)) skip = ln.replace(/^#\s+/, '').trim() === PLAN_HEAD;
    if (!skip) out.push(ln);
  }
  return out.join('\n');
}
