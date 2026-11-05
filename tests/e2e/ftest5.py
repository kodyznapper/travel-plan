# Phase 4 "now + next" card (Taipei clock), renamed-trip links and seed matching — Artifact build (dist/travel-plan.html)
import pathlib, json
ROOT = pathlib.Path(__file__).resolve().parents[2]
PAGE = 'file://' + str(ROOT / 'dist/travel-plan.html')
MARKED = str(ROOT / 'vendor/marked.min.js')
from playwright.sync_api import sync_playwright
TW = '#taiwan-trip-2026-11-12'
errs = []; ok = True
def check(name, cond):
    global ok; print(('PASS ' if cond else 'FAIL ') + name); ok = ok and bool(cond)

def page(b, clock, lang='th', planning=False):
    ctx = b.new_context(viewport={'width': 390, 'height': 844})
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.route('https://cdn.jsdelivr.net/**', lambda r: r.fulfill(path=MARKED, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.clock.install(time=clock)
    pg.goto(PAGE)
    pg.evaluate("localStorage.setItem('tp1.settings', JSON.stringify(%s))" % json.dumps({'theme': 'dark', 'planning': planning, 'owner': planning, 'lang': lang}))
    return pg

def card(pg): return pg.locator('section.nowcard')
def open_(pg, h, ms=600): pg.goto(PAGE + h); pg.reload(); pg.wait_for_timeout(ms)

with sync_playwright() as p:
    b = p.chromium.launch()
    # 15:00 Taipei on Day 1: last started item 14:45 Longshan, next 16:15 Huashan 1914
    pg = page(b, '2026-11-12T07:00:00Z')
    open_(pg, TW, 600)
    check('overview: card shown during a trip day', card(pg).count() == 1)
    txt = card(pg).inner_text()
    check('card: local time + "now" item', '15:00' in txt and 'ตอนนี้: วัดหลงซาน' in txt)
    check('card: next item, time and countdown', 'ถัดไป' in txt and '16:15' in txt and 'Huashan 1914' in txt and 'อีก 1 ชม. 15 นาที' in txt)
    check('card: main transport + line chip + cost', 'Zhongxiao Xinsheng' in txt and card(pg).locator('.lchip').count() >= 1 and 'NT$20' in txt)
    check('card: map link opens in a new tab', card(pg).locator('a.nc-map[target=_blank][rel=noopener]').count() == 1)
    pg.clock.run_for(61000); pg.wait_for_timeout(200)
    check('card: countdown refreshes every minute', 'อีก 1 ชม. 14 นาที' in card(pg).inner_text())
    nid = card(pg).locator('[data-act=goto-item]').get_attribute('data-id')
    card(pg).locator('[data-act=goto-item]').click(); pg.wait_for_timeout(500)
    check('tap card: opens the day tab', pg.evaluate('location.hash') == TW + '--d1')
    check('tap card: item expanded', pg.locator('li.it.open[data-id="%s"]' % nid).count() == 1)
    check('day tab of today: card on top', card(pg).count() == 1 and pg.evaluate("document.querySelector('.wrap').firstElementChild.classList.contains('nowcard') || !!document.querySelector('.wrap > .nowcard')"))
    open_(pg, TW + '--d2', 400)
    check('other day tab: no card', card(pg).count() == 0)
    pg.context.close()

    # EN
    pg = page(b, '2026-11-12T07:00:00Z', lang='en')
    open_(pg, TW, 600)
    txt = card(pg).inner_text()
    check('EN card: Now / Next / countdown', 'Now: Longshan Temple' in txt and 'Next' in txt and 'in 1 h 15 min' in txt)
    pg.context.close()

    # 20:00 Taipei on Day 1: after the last item -> tomorrow's first item
    pg = page(b, '2026-11-12T12:00:00Z')
    open_(pg, TW, 600)
    txt = card(pg).inner_text()
    check('after last item: done + tomorrow first item', 'วันนี้ครบทุกรายการแล้ว' in txt and 'พรุ่งนี้ (Day 2) เริ่ม' in txt and '09:00' in txt and 'Fu Hang' in txt)
    card(pg).locator('[data-act=goto-item]').click(); pg.wait_for_timeout(500)
    check('tap tomorrow: opens Day 2', pg.evaluate('location.hash') == TW + '--d2' and pg.locator('li.it.open').count() == 1)
    pg.context.close()

    # last day after the last item, before and after the trip: nothing
    for name, clk in (('last day after its last item', '2026-11-17T11:00:00Z'), ('before the trip', '2026-11-10T03:00:00Z'), ('after the trip', '2026-11-20T03:00:00Z')):
        pg = page(b, clk)
        open_(pg, TW, 500)
        check(name + ': no card', card(pg).count() == 0)
        pg.context.close()

    # edit mode hides it
    pg = page(b, '2026-11-12T07:00:00Z', planning=True)
    open_(pg, TW, 500)
    check('owner view: card shown too', card(pg).count() == 1)
    pg.click('[data-act=edit-toggle]'); pg.wait_for_timeout(300)
    check('edit mode: no card', card(pg).count() == 0)
    pg.context.close()

    # trip ids + renamed seed
    pg = page(b, '2026-11-01T03:00:00Z')
    open_(pg, '#home', 500)
    tr = pg.evaluate("JSON.parse(localStorage.getItem('tp1.trips'))")
    check('id comes from the Latin title (Thai title -> title_en)', len(tr) == 1 and tr[0]['id'] == 'taiwan-trip-2026-11-12')
    open_(pg, '#taiwan-trip-2026-2026-11-12--d3', 400)
    check('old link (id from the old title) still opens the trip on that tab', 'D3' in pg.locator('.tab[aria-current=page]').inner_text())
    # a browser that still holds the old seed copy (old title + id, one tick) gets the renamed seed in place
    pg.evaluate("""() => { var t = JSON.parse(localStorage.getItem('tp1.trips')); t[0].meta.title = 'Taiwan Trip 2026'; t[0].id = 'taiwan-trip-2026-2026-11-12';
      var first = t[0].pack.filter(function (g) { return g.items.length; })[0]; first.items[0].done = true;
      localStorage.setItem('tp1.trips', JSON.stringify(t)); localStorage.setItem('tp1.seed', 'old');
      localStorage.setItem = function () {}; }""")   # keep the page's pagehide save from overwriting this
    pg.reload(); pg.wait_for_timeout(600)
    tr = pg.evaluate("JSON.parse(localStorage.getItem('tp1.trips'))")
    first = [g for g in tr[0]['pack'] if g['items']][0] if tr else None
    check('renamed seed replaces the old copy (no duplicate), keeps id + ticks', len(tr) == 1 and tr[0]['id'] == 'taiwan-trip-2026-2026-11-12' and tr[0]['meta']['title'] == 'เที่ยวไต้หวัน 2026' and first['items'][0]['done'])
    pg.context.close()
    b.close()
print('errors:', errs or 'none')
print('ALL PASS' if ok and not errs else 'SOME FAILED')
import sys; sys.exit(0 if ok and not errs else 1)
