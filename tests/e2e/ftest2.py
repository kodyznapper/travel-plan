import pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parents[2]
PAGE = 'file://' + str(ROOT / 'dist/travel-plan.html')
MARKED = str(ROOT / 'vendor/marked.min.js')          # stands in for the jsdelivr CDN so tests run offline
TEMPLATE = str(ROOT / 'data/travel-plan-template.md')
from playwright.sync_api import sync_playwright
U=PAGE; H='#taiwan-trip-2026-2026-11-12'
errs=[]; ok=True
def check(name,cond):
    global ok; print(('PASS ' if cond else 'FAIL ')+name); ok = ok and bool(cond)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_context(viewport={'width':1200,'height':900}).new_page()
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.route('https://cdn.jsdelivr.net/**', lambda r: r.fulfill(path=MARKED, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.goto(U); pg.evaluate("localStorage.clear()"); pg.goto(U+H+'--d5'); pg.reload(); pg.wait_for_timeout(700)
    check('default lang th', pg.evaluate("document.documentElement.lang")=='th')
    check('TH tab label', 'ภาพรวม' in pg.inner_text('.tabs-in'))
    pg.click('[data-act=lang]'); pg.wait_for_timeout(300)
    check('EN html lang', pg.evaluate("document.documentElement.lang")=='en')
    check('EN tab label', 'Overview' in pg.inner_text('.tabs-in') and 'Packing' in pg.inner_text('.tabs-in'))
    check('EN persisted', pg.evaluate("JSON.parse(localStorage.getItem('tp1.settings')).lang")=='en')
    check('EN no Thai in chrome', not __import__('re').search(r'[\u0E00-\u0E7F]', pg.inner_text('#topbar')+pg.inner_text('.tabs-in')))
    check('hash kept on toggle', pg.evaluate('location.hash').endswith('--d5'))
    pg.reload(); pg.wait_for_timeout(500); check('EN survives reload', pg.evaluate("document.documentElement.lang")=='en')
    # line legend + chips
    check('legend has 3 lines', pg.locator('.llegend .lchip').count()==3)
    pg.click('[data-act=expand-all]'); pg.wait_for_timeout(200)
    check('multi-line block (G,R)', pg.locator('.lblk .lchip').count()>=5)
    # singular/plural
    pg.goto(U+'#home'); pg.wait_for_timeout(300); check('dashboard EN count', '1 plan' in pg.inner_text('.dash-head'))
    # edit: line field changes chips, unknown code gets neutral chip
    pg.evaluate("localStorage.setItem('tp1.settings',JSON.stringify({theme:'dark',planning:true,owner:true,lang:'th'}))"); pg.goto(U+H+'--d1'); pg.reload(); pg.wait_for_timeout(500)
    pg.click('[data-act=edit-toggle]'); pg.wait_for_timeout(300)
    check('line field in editor', pg.locator('[data-b="days.0.items.3.line"]').count()==1)
    pg.fill('[data-b="days.0.items.3.line"]','BL, Foo, Yamanote#80C241'); pg.wait_for_timeout(300)
    pg.click('[data-act=edit-toggle]'); pg.wait_for_timeout(300)
    pg.click('[data-act=expand-all]'); pg.wait_for_timeout(200)
    check('custom + unknown chips', pg.locator('.lblk .lchip', has_text='Yamanote').count()>=1 and pg.locator('.lblk .lchip', has_text='Foo').count()>=1)
    # EN field editing -> EN mode shows it
    pg.click('[data-act=edit-toggle]'); pg.wait_for_timeout(300)
    pg.locator('.en-fields summary').nth(3).click(); pg.fill('[data-b="days.0.items.3.transport_en"]','Take MRT Blue line one stop'); pg.wait_for_timeout(300)
    pg.click('[data-act=edit-toggle]'); pg.click('[data-act=lang]'); pg.wait_for_timeout(300)
    pg.click('[data-act=expand-all]'); pg.wait_for_timeout(200)
    check('transport_en shown in EN', 'Take MRT Blue line one stop' in pg.inner_text('.tl'))
    pg.click('[data-act=lang]'); pg.wait_for_timeout(300); pg.click('[data-act=expand-all]'); pg.wait_for_timeout(200)
    check('TH notes label: สถานที่น่าสนใจรอบๆ / หมายเหตุ', 'สถานที่น่าสนใจรอบๆ / หมายเหตุ' in pg.inner_text('.tl'))
    pg.click('[data-act=lang]'); pg.wait_for_timeout(300)
    check('EN notes label: Nearby places / notes', 'Nearby places / notes' in pg.inner_text('.tl'))
    check('page title (EN too)', pg.title() == 'Trip Plans - วางแผนเที่ยว')
    pg.click('[data-act=lang]'); pg.wait_for_timeout(300)
    check('page title', pg.title() == 'Trip Plans - วางแผนเที่ยว')
    # time zone: every zone the browser knows, labelled with the UTC offset on the trip's start date
    pg.goto(U+H); pg.wait_for_timeout(300); pg.click('[data-act=edit-toggle]'); pg.wait_for_timeout(300)
    tz = pg.evaluate("[].map.call(document.querySelectorAll('#tzlist option'), function (o) { return [o.value, o.label]; })")
    tzd = dict(tz)
    check('time zone list: whole world (>300 zones), sorted, no duplicates', len(tz) > 300 and [z for z, _ in tz] == sorted(set(z for z, _ in tz)))
    check('time zone list: UTC offsets', tzd.get('Asia/Taipei') == 'UTC+8' and 'UTC+5:45' in tzd.values() and 'UTC+5:30' in tzd.values() and tzd.get('America/New_York') == 'UTC-5' and tzd.get('Europe/London') == 'UTC+0')
    check('time zone field uses the list', pg.locator('input[list=tzlist]').count() == 1)
    b.close()
print('errors:', errs or 'none'); print('ALL PASS' if ok and not errs else 'SOME FAILED'); sys.exit(0 if ok and not errs else 1)
