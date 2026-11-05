"""Google Apps Script build (dist/gas/index.html): viewer reads from "Drive", owner saves with the edit key.

google.script.run is replaced by a bridge to tests/gas/call.js, which runs the real dist/gas/Code.gs
against fake Drive/Properties/Cache services. State is a JSON file shared by all browser contexts,
so separate contexts behave like separate devices looking at the same Drive.
What this does NOT cover: Google's real iframe sandbox, real Drive, Safari storage rules (see README checklist).
"""
import json, pathlib, subprocess, sys, tempfile
ROOT = pathlib.Path(__file__).resolve().parents[2]
PAGE = 'file://' + str(ROOT / 'dist/gas/index.html')
MARKED = str(ROOT / 'vendor/marked.min.js')
CALL = str(ROOT / 'tests/gas/call.js')
KEY = 'test-key-123'
from playwright.sync_api import sync_playwright

state = pathlib.Path(tempfile.mkdtemp()) / 'gas-state.json'
state.write_text(json.dumps({'props': {'EDIT_KEY': KEY}, 'files': {}, 'folders': {}, 'cache': {}, 'seq': 0,
                             'clock': 1793491200000, 'activeUser': 'owner@example.com', 'owner': 'owner@example.com'}))
def gas(fn, *args):
    r = json.loads(subprocess.run(['node', CALL, str(state), fn, json.dumps(list(args))], capture_output=True, text=True, check=True).stdout)
    if 'error' in r: raise RuntimeError(r['error'])
    return r['ok']
def drive_md():
    st = json.loads(state.read_text()); return st['files'][st['props']['TRIP_FILE_ID']]['content']
def backups():
    st = json.loads(state.read_text()); return [f for f in st['files'].values() if f.get('parent') == st['props'].get('BACKUP_FOLDER_ID')]

gas('setup')                                     # owner runs setup() once from the editor
s = json.loads(state.read_text()); s['activeUser'] = ''; state.write_text(json.dumps(s))   # from now on: anonymous web-app callers

BRIDGE = """(function () {
  function runner(ok, fail) {
    return new Proxy({}, { get: function (_, k) {
      if (k === 'withSuccessHandler') return function (f) { return runner(f, fail); };
      if (k === 'withFailureHandler') return function (f) { return runner(ok, f); };
      return function () {
        var a = Array.prototype.slice.call(arguments);
        window.__gasCalls = (window.__gasCalls || []).concat([k]);
        window.__gasCall(String(k), JSON.stringify(a)).then(function (r) { r = JSON.parse(r); if ('error' in r) { if (fail) fail(new Error(r.error)); } else if (ok) ok(r.ok); });
      };
    } });
  }
  window.google = { script: { run: runner(null, null),
    url: { getLocation: function (cb) { setTimeout(function () { cb({ hash: window.__topHash || '', parameter: {}, parameters: {} }); }, 0); } },
    history: { replace: function (s, p, h) { window.__mirrored = h; } } } };
})();"""

errs = []; ok = True
def check(name, cond):
    global ok; print(('PASS ' if cond else 'FAIL ') + name); ok = ok and bool(cond)
def device(b, name):
    ctx = b.new_context(viewport={'width': 390, 'height': 844})
    ctx.expose_function('__gasCall', lambda fn, args: subprocess.run(['node', CALL, str(state), fn, args], capture_output=True, text=True).stdout)
    ctx.add_init_script(BRIDGE)
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errs.append(name + ': ' + str(e)))
    pg.on('console', lambda m: errs.append(name + ': ' + m.text) if m.type == 'error' else None)
    pg.route('https://cdn.jsdelivr.net/**', lambda r: r.fulfill(path=MARKED, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    return pg
def ls_trip(pg): return pg.evaluate("(JSON.parse(localStorage.getItem('tp1.trips')) || []).filter(function (t) { return t.origin === 'server'; })[0] || null")
def settle(pg, ms=900): pg.wait_for_timeout(ms)

with sync_playwright() as p:
    b = p.chromium.launch()
    # ---------------- viewer (device B) ----------------
    vw = device(b, 'viewer')
    vw.goto(PAGE); settle(vw, 1500)
    t = ls_trip(vw)
    check('viewer: plan loaded from Drive (server trip in cache)', t is not None and len(t['days']) == 6)
    check('viewer: lands on the trip, not the empty dashboard', vw.evaluate('location.hash').startswith('#taiwan-trip-2026'))
    check('viewer: no planning section received', t is not None and t['plan'] == '' and t['remoteFull'] is False)
    check('viewer: no edit tools, no planning tab, no sync bar', vw.locator('.edbtn').count() == 0 and vw.locator('[data-syncbar]').count() == 0 and 'วางแผน' not in vw.inner_text('.tabs-in'))
    check('viewer: landing hash mirrored to the top frame', vw.evaluate('window.__mirrored') == vw.evaluate('location.hash.slice(1)'))
    vw.click('[data-act=settings]'); settle(vw, 200)
    note = vw.inner_text('.modal .note')
    check('viewer: settings explains the plan comes from Drive', 'Drive' in note and vw.locator('[data-set=key]').count() == 0)
    vw.click('[data-res=ok]'); settle(vw, 200)
    vw.goto(PAGE + '#' + t['id'] + '--pack'); settle(vw)
    check('viewer: tab change mirrored to the top frame', vw.evaluate('window.__mirrored') == t['id'] + '--pack')
    vw.click('label.ck >> nth=0'); settle(vw, 500)
    vw.reload(); settle(vw, 1500)
    check('viewer: own tick survives reload + server refresh', vw.locator('label.ck >> nth=0').locator('input').is_checked())

    # ---------------- shared deep link, first visit on a new device ----------------
    dl = device(b, 'deeplink')
    dl.add_init_script("window.__topHash = %s;" % json.dumps(t['id'] + '--ref'))
    dl.goto(PAGE); settle(dl, 1500)
    check('deep link (first visit, nothing cached): opens the linked tab', dl.evaluate('location.hash') == '#' + t['id'] + '--ref' and dl.locator('.tab[aria-current=page]').inner_text().strip() == 'ข้อมูลอ้างอิง')
    check('deep link: top-frame hash kept', dl.evaluate('window.__mirrored') == t['id'] + '--ref')
    dl.context.close()

    # ---------------- owner (device A) ----------------
    ow = device(b, 'owner')
    ow.goto(PAGE); ow.evaluate("localStorage.setItem('tp1.settings', JSON.stringify({theme:'dark',planning:true,owner:true,lang:'th'}))"); ow.reload(); settle(ow, 1500)
    tid = ls_trip(ow)['id']
    check('owner (no key yet): in sync bar shown', ow.locator('[data-syncbar]').count() == 1 and ow.locator('[data-syncbar].dirty').count() == 0)
    ow.goto(PAGE + '#' + tid + '--d1'); settle(ow)
    ow.click('[data-act=edit-toggle]'); settle(ow, 300)
    ow.fill('[data-b="days.0.theme"]', 'ธีมทดสอบจากเจ้าของ'); settle(ow, 400)
    check('owner: editing marks the bar dirty (live)', ow.locator('[data-syncbar].dirty').count() == 1)
    check('owner: edit bar says changes stay local until saved', 'บันทึกขึ้น Drive' in ow.inner_text('.editbar'))
    ow.click('[data-act=edit-toggle]'); settle(ow, 300)
    check('Drive unchanged before saving', 'ธีมทดสอบจากเจ้าของ' not in drive_md())
    ow.click('[data-act=save-remote]'); settle(ow, 300)
    check('save without key asks for the key', ow.locator('[data-key]').count() == 1)
    ow.fill('[data-key]', 'wrong-key'); ow.click('[data-key-ok]'); settle(ow)
    check('wrong key: error shown, modal stays, nothing saved', ow.locator('[data-key-err]').is_visible() and 'ธีมทดสอบจากเจ้าของ' not in drive_md())
    ow.fill('[data-key]', KEY); ow.click('[data-key-ok]'); settle(ow, 2500)
    md = drive_md()
    check('right key: saved to Drive', 'ธีมทดสอบจากเจ้าของ' in md)
    check('saved file still has the planning section (owner fetched the full plan first)', '# วางแผน' in md)
    check('saved file has no ticks from this device', '- [x]' not in md)
    check('a backup was written', len(backups()) == 1)
    check('owner: bar back in sync, key remembered', ow.locator('[data-syncbar].dirty').count() == 0 and ow.evaluate("JSON.parse(localStorage.getItem('tp1.key'))") == KEY)
    check('owner with key: planning section visible again', len((ls_trip(ow) or {}).get('plan', '')) > 0)

    # ---------------- viewer sees it ----------------
    vw.goto(PAGE + '#' + tid + '--d1'); vw.reload(); settle(vw, 1500)
    check('viewer: sees the owner\'s saved change after reload', 'ธีมทดสอบจากเจ้าของ' in vw.inner_text('#app'))
    vw.goto(PAGE + '#' + tid + '--pack'); settle(vw, 500)
    check('viewer: own tick still there after the plan changed', vw.locator('label.ck >> nth=0').locator('input').is_checked())
    check('viewer: still no planning section', ls_trip(vw)['plan'] == '')

    # ---------------- conflict: file changed elsewhere (e.g. edited in Drive) ----------------
    cur = gas('getTrip', KEY)
    gas('saveTrip', cur['md'].replace('ธีมทดสอบจากเจ้าของ', 'แก้จากที่อื่น'), KEY, cur['version'], False)
    ow.goto(PAGE + '#' + tid + '--d2'); settle(ow, 300)
    ow.click('[data-act=edit-toggle]'); settle(ow, 300)
    ow.fill('[data-b="days.1.theme"]', 'แก้วันสองในเครื่อง'); settle(ow, 300)
    ow.click('[data-act=edit-toggle]'); settle(ow, 300)
    ow.click('[data-act=save-remote]'); settle(ow, 1500)
    check('stale save: conflict dialog, Drive untouched', ow.locator('[data-res=force]').count() == 1 and 'แก้วันสองในเครื่อง' not in drive_md())
    ow.click('[data-res=force]'); settle(ow, 1500)
    check('force: local version written to Drive', 'แก้วันสองในเครื่อง' in drive_md())

    # ---------------- discard local edits ----------------
    ow.click('[data-act=edit-toggle]'); settle(ow, 300)
    ow.fill('[data-b="days.1.theme"]', 'จะทิ้ง'); settle(ow, 300)
    ow.click('[data-act=edit-toggle]'); settle(ow, 300)
    ow.click('[data-act=discard-local]'); settle(ow, 300); ow.click('[data-res=yes]'); settle(ow, 1500)
    check('discard: local edit gone, back in sync', 'จะทิ้ง' not in ow.inner_text('#app') and ow.locator('[data-syncbar].dirty').count() == 0)

    # ---------------- export on GAS always offers copy ----------------
    ow.goto(PAGE + '#' + tid); settle(ow, 400)
    ow.click('[data-act=export-md]'); settle(ow, 300)
    check('export: copy box with a download button', ow.locator('.copybox').count() == 1 and ow.locator('[data-dl]').count() == 1)
    ow.click('[data-res=x]'); settle(ow, 200)

    # ---------------- forget key / leave owner mode ----------------
    ow.click('[data-act=settings]'); settle(ow, 200)
    ow.click('[data-set=key-forget]'); settle(ow, 200)
    check('forget key: removed from this device', ow.evaluate("JSON.parse(localStorage.getItem('tp1.key'))") == '' and ow.locator('[data-set=key]').count() == 1)
    ow.click('[data-res=ok]'); settle(ow, 200)

    # ---------------- server down ----------------
    nd = b.new_context(viewport={'width': 390, 'height': 844}); pg = nd.new_page()
    pg.on('pageerror', lambda e: errs.append('noserver: ' + str(e)))
    pg.route('https://cdn.jsdelivr.net/**', lambda r: r.fulfill(path=MARKED, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.goto(PAGE); settle(pg, 800)
    check('no google.script: error card with retry, no crash', pg.locator('[data-act=reload-remote]').count() == 1)

    # ---------------- English ----------------
    vw.evaluate("var s=JSON.parse(localStorage.getItem('tp1.settings')||'{}'); s.lang='en'; localStorage.setItem('tp1.settings', JSON.stringify(s))")
    ow.evaluate("var s=JSON.parse(localStorage.getItem('tp1.settings')); s.lang='en'; localStorage.setItem('tp1.settings', JSON.stringify(s))")
    ow.goto(PAGE + '#' + tid + '--d1'); ow.reload(); settle(ow, 1500)
    ow.click('[data-act=edit-toggle]'); settle(ow, 300); ow.fill('[data-b="days.0.theme_en"]', 'x'); settle(ow, 300)
    bar = ow.inner_text('[data-syncbar]') + ow.inner_text('.editbar')
    check('EN: sync/edit bars translated (no Thai)', 'Save to Drive' in bar and not any('฀' <= c <= '๿' for c in bar))
    b.close()
print('errors:', errs or 'none'); print('ALL PASS' if ok and not errs else 'SOME FAILED'); sys.exit(0 if ok and not errs else 1)
