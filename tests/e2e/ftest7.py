# v2.6.0 clip links per place (field "video"): buttons in the item detail + "next" card, badge on the row, edit form, export — Artifact build
import pathlib, json, sys
ROOT = pathlib.Path(__file__).resolve().parents[2]
PAGE = 'file://' + str(ROOT / 'dist/travel-plan.html')
MARKED = str(ROOT / 'vendor/marked.min.js')
from playwright.sync_api import sync_playwright
TW = '#taiwan-trip-2026-11-12'
TT = 'https://www.tiktok.com/@someone/video/7300000000000000000'
YT1, YT2 = 'https://youtu.be/abc123', 'https://www.youtube.com/watch?v=def456'
errs = []; ok = True
def check(name, cond):
    global ok; print(('PASS ' if cond else 'FAIL ') + name); ok = ok and bool(cond)

# Day 1 of the seed: give Huashan (next item at 15:00 Taipei) two clips, Longshan two YouTube clips + junk, Ningxia only a bad link
SETUP = """(v) => { var t = JSON.parse(localStorage.getItem('tp1.trips')); var d = t[0].days[0];
  function find(s) { return d.items.filter(function (it) { return it.title.indexOf(s) >= 0 || (it.en || '').indexOf(s) >= 0; })[0]; }
  find('Huashan').video = v.tt + ' | ' + v.yt1;
  find('Longshan').video = v.yt1 + ' · ' + v.yt2 + ' | ftp://nope https://example.com/x';
  find('Ningxia').video = 'javascript:alert(1)';
  t[0].localEdited = true; localStorage.setItem('tp1.trips', JSON.stringify(t));
  localStorage.setItem('tp1.settings', JSON.stringify(v.settings)); localStorage.setItem = function () {}; }"""

def page(b, lang='th', owner=False, clock='2026-11-12T07:00:00Z'):
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, accept_downloads=True)
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.route('https://cdn.jsdelivr.net/**', lambda r: r.fulfill(path=MARKED, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.clock.install(time=clock)
    pg.goto(PAGE); pg.wait_for_timeout(300)
    pg.evaluate(SETUP, {'tt': TT, 'yt1': YT1, 'yt2': YT2, 'settings': {'theme': 'dark', 'planning': owner, 'owner': owner, 'lang': lang}})
    pg.goto(PAGE + TW + '--d1'); pg.reload(); pg.wait_for_timeout(600)
    return pg
def item(pg, s): return pg.locator('li.it', has_text=s).first

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = page(b)
    hu = item(pg, 'Huashan')
    check('row: clip badge with text on items that have clips', hu.locator('.it-tags .badge.vid').inner_text().strip() == 'คลิป')
    hu.locator('[data-act=toggle]').click(); pg.wait_for_timeout(300)
    links = hu.locator('.it-detail .it-links a.vidlink')
    check('detail: one button per clip, labelled by platform', links.count() == 2 and [links.nth(i).inner_text().strip() for i in range(2)] == ['TikTok', 'YouTube'])
    check('detail: buttons link to the clips', links.nth(0).get_attribute('href') == TT and links.nth(1).get_attribute('href') == YT1)
    check('detail: clips open in a new tab (noopener)', hu.locator('.it-links a.vidlink[target=_blank][rel=noopener]').count() == 2)
    check('detail: map button still there, next to the clips', hu.locator('.it-links a.maplink').count() == 1)
    ls = item(pg, 'Longshan'); ls.locator('[data-act=toggle]').click(); pg.wait_for_timeout(300)
    lbl = [x.strip() for x in ls.locator('a.vidlink').all_inner_texts()]
    check('detail: same platform numbered, " · " separator ok, ftp dropped, other site = "ลิงก์"', lbl == ['YouTube 1', 'YouTube 2', 'ลิงก์'])
    nx = item(pg, 'Ningxia')
    check('bad link (javascript:) shows no button and no badge', nx.locator('a.vidlink').count() == 0 and nx.locator('.badge.vid').count() == 0 and pg.locator('a[href^="javascript"]').count() == 0)
    card = pg.locator('section.nowcard')
    check('next card: clip buttons for the next item', card.count() == 1 and 'Huashan' in card.inner_text() and card.locator('a.vidlink.nc-vid[target=_blank][rel=noopener]').count() == 2)
    check('next card: map button kept', card.locator('a.nc-map').count() == 1)
    pg.context.close()

    # EN
    pg = page(b, lang='en')
    check('EN: badge "Clips"', item(pg, 'Huashan').locator('.badge.vid').inner_text().strip() == 'Clips')
    ls = item(pg, 'Longshan'); ls.locator('[data-act=toggle]').click(); pg.wait_for_timeout(300)
    check('EN: other site = "Link"', [x.strip() for x in ls.locator('a.vidlink').all_inner_texts()][-1] == 'Link')
    pg.context.close()

    # owner: edit form field, render, export
    pg = page(b, owner=True)
    pg.click('[data-act=edit-toggle]'); pg.wait_for_timeout(300)
    f = pg.locator('[data-b="days.0.items.0.video"]')
    check('edit form: clip link field per item', f.count() == 1 and 'TikTok' in pg.locator('label', has=f).first.inner_text())
    f.fill('https://www.instagram.com/reel/xyz | https://vt.tiktok.com/AbC/'); pg.wait_for_timeout(400)
    pg.click('[data-act=edit-toggle]'); pg.wait_for_timeout(300)
    first = pg.locator('li.it').first; first.locator('[data-act=toggle]').click(); pg.wait_for_timeout(300)
    check('edited clips render (Instagram, TikTok short link)', [x.strip() for x in first.locator('a.vidlink').all_inner_texts()] == ['Instagram', 'TikTok'])
    pg.goto(PAGE + TW); pg.wait_for_timeout(400)
    with pg.expect_download() as d: pg.click('[data-act=export-md]')
    md = pathlib.Path(d.value.path()).read_text()
    check('export .md keeps the clip links (- video: a | b)', '- video: https://www.instagram.com/reel/xyz | https://vt.tiktok.com/AbC/' in md and ('- video: ' + TT + ' | ' + YT1) in md)
    pg.context.close()
    b.close()
print('errors:', errs or 'none')
print('ALL PASS' if ok and not errs else 'SOME FAILED')
sys.exit(0 if ok and not errs else 1)
