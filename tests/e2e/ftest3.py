import pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parents[2]
PAGE = 'file://' + str(ROOT / 'dist/travel-plan.html')
MARKED = str(ROOT / 'vendor/marked.min.js')
from playwright.sync_api import sync_playwright
TW = '#taiwan-trip-2026-2026-11-12'
errs = []; ok = True
def check(name, cond):
    global ok; print(('PASS ' if cond else 'FAIL ') + name); ok = ok and bool(cond)
def fresh(pg, settings=None):
    pg.goto(PAGE); pg.evaluate("localStorage.clear()")
    if settings is not None: pg.evaluate("localStorage.setItem('tp1.settings', JSON.stringify(%s))" % settings)
    pg.goto(PAGE + TW); pg.reload(); pg.wait_for_timeout(600)
def open_settings(pg): pg.click('[data-act=settings]'); pg.wait_for_timeout(200)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_context(viewport={'width': 1200, 'height': 900}).new_page()
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.route('https://cdn.jsdelivr.net/**', lambda r: r.fulfill(path=MARKED, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    # ---- viewer (fresh visitor) ----
    fresh(pg)
    check('viewer: no edit button', pg.locator('.edbtn').count() == 0)
    check('viewer: no planning tab', 'วางแผน' not in pg.inner_text('.tabs-in'))
    open_settings(pg)
    check('viewer: settings has no planning switch / owner row', pg.locator('[data-set=planning]').count() == 0 and pg.locator('[data-set=owner-off]').count() == 0)
    for _ in range(6): pg.click('[data-ver]')
    check('viewer: 6 taps do not unlock', pg.locator('[data-set=planning]').count() == 0)
    # ---- locked even if storage claims planning (owner explicitly false) ----
    fresh(pg, "{theme:'dark',planning:true,owner:false,lang:'th'}")
    check('owner=false forces planning off', pg.locator('.edbtn').count() == 0 and 'วางแผน' not in pg.inner_text('.tabs-in'))
    # ---- 7 taps unlock ----
    open_settings(pg)
    for _ in range(7): pg.click('[data-ver]')
    pg.wait_for_timeout(200)
    check('7 taps unlock owner mode', pg.locator('[data-set=planning]').count() == 1 and pg.locator('[data-set=owner-off]').count() == 1)
    check('owner flag persisted', pg.evaluate("JSON.parse(localStorage.getItem('tp1.settings')).owner") is True)
    pg.click('[data-set=planning]'); pg.wait_for_timeout(200); pg.click('[data-res=ok]'); pg.wait_for_timeout(200)
    check('owner can turn planning on -> edit button', pg.locator('.edbtn').count() == 1)
    open_settings(pg); pg.click('[data-set=owner-off]'); pg.wait_for_timeout(200); pg.click('[data-res=ok]'); pg.wait_for_timeout(200)
    check('leaving owner mode hides tools again', pg.locator('.edbtn').count() == 0 and pg.locator('[data-set=planning]').count() == 0)
    # ---- migration: existing user who had planning on becomes owner ----
    fresh(pg, "{theme:'dark',planning:true,lang:'th'}")
    check('migration: old planning user keeps edit access', pg.locator('.edbtn').count() == 1)
    # ---- checkbox: check mark is drawn inside the box, centred ----
    fresh(pg, "{theme:'dark',planning:false,owner:false,lang:'th'}")
    pg.goto(PAGE + TW + '--todo'); pg.wait_for_timeout(400)
    pg.click('label.ck >> nth=1'); pg.wait_for_timeout(300)
    box = pg.locator('.ck >> nth=1').locator('.cb').bounding_box(); svg = pg.locator('.ck >> nth=1').locator('.cb svg').bounding_box()
    opacity = pg.evaluate("getComputedStyle(document.querySelectorAll('.ck')[1].querySelector('.cb svg')).opacity")
    check('checked: mark visible', opacity == '1')
    cx = abs((box['x'] + box['width'] / 2) - (svg['x'] + svg['width'] / 2)); cy = abs((box['y'] + box['height'] / 2) - (svg['y'] + svg['height'] / 2))
    check('checked: mark centred in box (±1px)', cx <= 1 and cy <= 1)
    check('unchecked boxes show no mark', pg.evaluate("getComputedStyle(document.querySelectorAll('.ck')[2].querySelector('.cb svg')).opacity") == '0')
    pg.click('label.ck >> nth=1'); pg.wait_for_timeout(200)
    check('toggle back off hides mark', pg.evaluate("getComputedStyle(document.querySelectorAll('.ck')[1].querySelector('.cb svg')).opacity") == '0')
    b.close()
print('errors:', errs or 'none'); print('ALL PASS' if ok and not errs else 'SOME FAILED'); sys.exit(0 if ok and not errs else 1)
