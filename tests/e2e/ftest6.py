"""GitHub Pages build (dist/pages/index.html): a normal top-level page that talks to Code.gs through fetch(/exec).

The page is served over http://localhost (like github.io, a first-party origin) and every request to the /exec URL is
routed to tests/gas/call.js, which runs the real dist/gas/Code.gs doGet/doPost against the fake Drive/Properties/Cache.
"Kill the app" = close the browser context without pagehide, then open a new one with the saved storage.
What this does NOT cover: real Google CORS/redirects (checked by hand), Safari storage rules (README checklist).
"""
import json, pathlib, subprocess, sys, tempfile, threading, functools, http.server, urllib.parse
ROOT = pathlib.Path(__file__).resolve().parents[2]
MARKED = str(ROOT / 'vendor/marked.min.js')
CALL = str(ROOT / 'tests/gas/call.js')
API = json.loads((ROOT / 'pages/config.json').read_text())['api']
KEY = 'test-key-123'
from playwright.sync_api import sync_playwright

# ---- static server for dist/pages (first-party origin, like https://<user>.github.io) ----
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist/pages')))
threading.Thread(target=srv.serve_forever, daemon=True).start()
PAGE = 'http://127.0.0.1:%d/index.html' % srv.server_address[1]

# ---- fake Drive ----
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
gas('setup')
s = json.loads(state.read_text()); s['activeUser'] = ''; state.write_text(json.dumps(s))

calls = []; server_down = {'on': False}
def exec_route(route):
    req = route.request
    if server_down['on']: return route.abort('connectionrefused')
    if req.method == 'POST':
        fn, arg = 'doPost', {'postData': {'contents': req.post_data or ''}}
        try: calls.append(json.loads(req.post_data)['fn'])
        except Exception: calls.append('?')
    else:
        q = dict(urllib.parse.parse_qsl(urllib.parse.urlparse(req.url).query))
        fn, arg = 'doGet', {'parameter': q}; calls.append('GET ' + q.get('api', ''))
    out = json.loads(subprocess.run(['node', CALL, str(state), fn, json.dumps([arg])], capture_output=True, text=True).stdout)
    route.fulfill(status=200, body=out.get('raw', json.dumps({'error': out.get('error', 'no raw answer')})),
                  headers={'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*'})

errs = []; ok = True
def check(name, cond):
    global ok; print(('PASS ' if cond else 'FAIL ') + name); ok = ok and bool(cond)
def device(b, name, storage=None):
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, storage_state=storage, accept_downloads=True)
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errs.append(name + ': ' + str(e)))
    pg.on('console', lambda m: errs.append(name + ': ' + m.text) if m.type == 'error' and not server_down['on'] else None)
    pg.route('https://cdn.jsdelivr.net/**', lambda r: r.fulfill(path=MARKED, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.route(API + '*', exec_route)
    return pg
def ls_trip(pg): return pg.evaluate("(JSON.parse(localStorage.getItem('tp1.trips')) || []).filter(function (t) { return t.origin === 'server'; })[0] || null")
def settle(pg, ms=900): pg.wait_for_timeout(ms)
def kill_and_reopen(b, pg, name, h=''):
    st = pg.context.storage_state(); pg.context.close()        # no pagehide: like swiping the app away
    np = device(b, name, st); np.goto(PAGE + h); settle(np, 1500); return np

with sync_playwright() as p:
    b = p.chromium.launch()
    # ---------------- viewer ----------------
    vw = device(b, 'viewer')
    vw.goto(PAGE); settle(vw, 1500)
    t = ls_trip(vw)
    check('viewer: plan loaded from Drive through the /exec API', t is not None and len(t['days']) == 6 and 'getTrip' in calls)
    check('viewer: no google.script on the page, robots noindex', vw.evaluate('typeof google') == 'undefined' and vw.locator('meta[name=robots][content*=noindex]').count() == 1)
    check('viewer: lands on the trip', vw.evaluate('location.hash').startswith('#' + t['id']))
    check('viewer: no planning section, no edit tools, no sync bar', t['plan'] == '' and t['remoteFull'] is False and vw.locator('.edbtn').count() == 0 and vw.locator('[data-syncbar]').count() == 0)
    vw.click('.tab:has-text("เตรียมของ")'); settle(vw, 400)
    check('tab change is a normal hash on the page URL', vw.evaluate('location.hash') == '#' + t['id'] + '--pack')
    vw.click('label.ck >> nth=0'); settle(vw, 600)
    vw.click('.tab >> nth=0'); settle(vw, 400)
    vw = kill_and_reopen(b, vw, 'viewer-2')
    vw.goto(PAGE + '#' + t['id'] + '--pack'); settle(vw, 500)
    check('tick survives killing the app and reopening (first-party storage)', vw.locator('label.ck >> nth=0').locator('input').is_checked())
    check('server ticks never sent: Drive has no [x]', '- [x]' not in drive_md())

    # ---------------- deep links ----------------
    dl = device(b, 'deeplink'); dl.goto(PAGE + '#' + t['id'] + '--ref'); settle(dl, 1500)
    check('deep link (first visit): opens the linked tab', dl.evaluate('location.hash') == '#' + t['id'] + '--ref' and dl.locator('.tab[aria-current=page]').inner_text().strip() == 'ข้อมูลอ้างอิง')
    dl.context.close()
    dl = device(b, 'deeplink2'); dl.goto(PAGE + '#old-trip-name-1999-01-01--d3'); settle(dl, 1500)
    check('deep link with another trip id: opens the Drive plan on that tab', dl.locator('.tab[aria-current=page]').count() == 1 and 'D3' in dl.locator('.tab[aria-current=page]').inner_text())
    dl.context.close()

    # ---------------- owner ----------------
    ow = device(b, 'owner')
    ow.goto(PAGE); ow.evaluate("localStorage.setItem('tp1.settings', JSON.stringify({theme:'dark',planning:true,owner:true,lang:'th'}))"); ow.reload(); settle(ow, 1500)
    tid = ls_trip(ow)['id']
    ow.goto(PAGE + '#' + tid + '--d1'); settle(ow, 300)
    ow.click('[data-act=edit-toggle]'); settle(ow, 300)
    ow.fill('[data-b="days.0.theme"]', 'ธีมจาก Pages'); settle(ow, 400)
    ow.click('[data-act=edit-toggle]'); settle(ow, 300)
    check('owner: edit is local until saved', ow.locator('[data-syncbar].dirty').count() == 1 and 'ธีมจาก Pages' not in drive_md())
    ow.click('[data-act=save-remote]'); settle(ow, 300)
    check('save without key asks for the key', ow.locator('[data-key]').count() == 1)
    ow.fill('[data-key]', 'wrong-key'); ow.click('[data-key-ok]'); settle(ow)
    check('wrong key: error shown, nothing saved', ow.locator('[data-key-err]').is_visible() and 'ธีมจาก Pages' not in drive_md())
    n_calls = len(calls)
    ow.fill('[data-key]', KEY); ow.click('[data-key-ok]'); settle(ow, 2500)
    md = drive_md()
    check('right key: saved to Drive through POST saveTrip', 'ธีมจาก Pages' in md and 'saveTrip' in calls[n_calls:] and len(backups()) == 1)
    check('saved file keeps the planning section, no ticks', '# วางแผน' in md and '- [x]' not in md)
    check('the key travels only in POST bodies (never in a GET URL)', not any(c.startswith('GET') and c != 'GET getTrip' for c in calls))
    ow = kill_and_reopen(b, ow, 'owner-2', '#' + tid + '--d1')
    check('key + owner mode survive killing the app', ow.evaluate("JSON.parse(localStorage.getItem('tp1.key'))") == KEY and ow.locator('[data-syncbar]').count() == 1 and ow.locator('[data-syncbar].dirty').count() == 0)

    # ---------------- conflict ----------------
    cur = gas('getTrip', KEY)
    gas('saveTrip', cur['md'].replace('ธีมจาก Pages', 'แก้จากที่อื่น'), KEY, cur['version'], False)
    ow.goto(PAGE + '#' + tid + '--d2'); settle(ow, 300)
    ow.click('[data-act=edit-toggle]'); settle(ow, 300)
    ow.fill('[data-b="days.1.theme"]', 'แก้วันสองบน Pages'); settle(ow, 300)
    ow.click('[data-act=edit-toggle]'); settle(ow, 300)
    ow.click('[data-act=save-remote]'); settle(ow, 1500)
    check('stale save: conflict dialog, Drive untouched', ow.locator('[data-res=force]').count() == 1 and 'แก้วันสองบน Pages' not in drive_md())
    ow.click('[data-res=force]'); settle(ow, 1500)
    check('force: local version written to Drive', 'แก้วันสองบน Pages' in drive_md())

    # ---------------- export is a normal download here ----------------
    ow.goto(PAGE + '#' + tid); settle(ow, 400)
    with ow.expect_download() as d: ow.click('[data-act=export-md]')
    check('export .md downloads directly (no copy box needed outside the Google iframe)', d.value.suggested_filename.endswith('.md') and ow.locator('.copybox').count() == 0)

    # ---------------- viewer sees the save ----------------
    vw.goto(PAGE + '#' + tid + '--d2'); vw.reload(); settle(vw, 1500)
    check('viewer: sees the owner\'s saved change after reload', 'แก้วันสองบน Pages' in vw.inner_text('#app'))

    # ---------------- server unreachable ----------------
    server_down['on'] = True
    nd = device(b, 'offline-new'); nd.goto(PAGE); settle(nd, 1200)
    check('server down, nothing cached: error card with retry, no crash', nd.locator('[data-act=reload-remote]').count() == 1)
    vw.reload(); settle(vw, 1500)
    check('server down, cached copy: plan still shown', 'แก้วันสองบน Pages' in vw.inner_text('#app'))
    server_down['on'] = False
    nd.click('[data-act=reload-remote]'); settle(nd, 1500)
    check('retry after the server is back: plan loads', ls_trip(nd) is not None)
    b.close()
srv.shutdown()
print('errors:', errs or 'none')
print('ALL PASS' if ok and not errs else 'SOME FAILED')
sys.exit(0 if ok and not errs else 1)
