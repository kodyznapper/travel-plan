import pathlib, sys, re
ROOT = pathlib.Path(__file__).resolve().parents[2]
PAGE = 'file://' + str(ROOT / 'dist/travel-plan.html')
MARKED = str(ROOT / 'vendor/marked.min.js')          # stands in for the jsdelivr CDN so tests run offline
TEMPLATE = str(ROOT / 'data/travel-plan-template.md')
from playwright.sync_api import sync_playwright
U = PAGE; TW = '#taiwan-trip-2026-2026-11-12'
errs = []; ok = True
def check(name, cond):
    global ok; print(('PASS ' if cond else 'FAIL ') + name); ok = ok and bool(cond)
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(viewport={'width': 1200, 'height': 900}, accept_downloads=True); pg = ctx.new_page()
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.route('https://cdn.jsdelivr.net/**', lambda r: r.fulfill(path=MARKED, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.goto(U); pg.evaluate("localStorage.clear();localStorage.setItem('tp1.settings',JSON.stringify({theme:'dark',planning:true,owner:true,lang:'th'}))"); pg.reload(); pg.wait_for_timeout(800)
    trips = lambda: pg.evaluate("JSON.parse(localStorage.getItem('tp1.trips')).length")
    check('seed trip loaded', trips() == 1)
    # import the template (valid md) -> new trip, then again -> duplicate dialog -> keep both
    pg.click('[data-act=import] >> nth=0'); pg.set_input_files('[data-imp=file]', TEMPLATE); pg.wait_for_timeout(400)
    check('import summary shows no problems', 'ไม่พบปัญหา' in pg.inner_text('[data-imp=out]'))
    pg.click('[data-imp=save]'); pg.wait_for_timeout(500); check('import adds a trip and opens it', trips() == 2 and pg.evaluate('location.hash') == '#trip-2027-01-01')
    pg.goto(U + '#home'); pg.wait_for_timeout(300)
    pg.click('[data-act=import] >> nth=0'); pg.set_input_files('[data-imp=file]', TEMPLATE); pg.wait_for_timeout(300); pg.click('[data-imp=save]'); pg.wait_for_timeout(300)
    check('duplicate import asks what to do', 'มีแผนนี้อยู่แล้ว' in pg.inner_text('.modal'))
    pg.click('[data-res=both]'); pg.wait_for_timeout(300); check('keep both -> 3 trips, id gets -2', trips() == 3 and pg.evaluate('location.hash') == '#trip-2027-01-01-2')
    # edit / move / delete / undo
    pg.goto(U + TW + '--d1'); pg.wait_for_timeout(300); pg.click('[data-act=edit-toggle]'); pg.wait_for_timeout(300)
    pg.fill('[data-b="days.0.items.0.title"]', 'ดอนเมือง → เถาหยวน (แก้)'); pg.wait_for_timeout(400)
    pg.click('[data-act=mv][data-list="days.0.items"][data-i="0"][data-d="1"]'); pg.wait_for_timeout(300)
    pg.click('[data-act=del][data-list="days.0.items"][data-i="8"]'); pg.wait_for_timeout(300)
    get = lambda: pg.evaluate("JSON.parse(localStorage.getItem('tp1.trips')).find(t=>t.meta.title.startsWith('Taiwan'))")
    check('delete removes an item', len(get()['days'][0]['items']) == 8)
    pg.click('.toast button'); pg.wait_for_timeout(300); t = get()
    check('undo restores it', len(t['days'][0]['items']) == 9)
    check('edit + move persisted, trip flagged localEdited', t['days'][0]['items'][1]['title'] == 'ดอนเมือง → เถาหยวน (แก้)' and t['localEdited'])
    pg.click('[data-act=add][data-list="days.0.items"]'); pg.wait_for_timeout(300)
    check('add focuses the new item title', pg.evaluate('document.activeElement.dataset.b') == 'days.0.items.9.title')
    pg.click('[data-act=edit-toggle]'); pg.wait_for_timeout(300)
    # checklist
    pg.goto(U + TW + '--pack'); pg.wait_for_timeout(300); pg.click('label.ck >> nth=0'); pg.wait_for_timeout(500)
    check('packing progress updates', pg.inner_text('[data-prog=pack]') == '1/28')
    # export md is re-importable
    pg.goto(U + TW); pg.wait_for_timeout(300)
    with pg.expect_download() as d: pg.click('[data-act=export-md]')
    md = open(d.value.path(), encoding='utf8').read(); open('/tmp/exported.md', 'w', encoding='utf8').write(md)
    check('export md downloads with slug name', d.value.suggested_filename == 'taiwan-trip-2026-2026-11-12.md' and len(md) > 20000)
    # seed update vs local edits -> conflict dialog
    pg.evaluate("localStorage.setItem('tp1.seed','old')"); pg.reload(); pg.wait_for_timeout(600)
    check('edited trip + new seed -> conflict dialog', pg.query_selector('.modal') is not None and 'เวอร์ชันใหม่' in pg.inner_text('.modal'))
    b.close()
print('errors:', errs or 'none'); print('ALL PASS' if ok and not errs else 'SOME FAILED'); sys.exit(0 if ok and not errs else 1)
