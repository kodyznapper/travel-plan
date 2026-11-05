import pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parents[2]
PAGE = 'file://' + str(ROOT / 'dist/travel-plan.html')
MARKED = str(ROOT / 'vendor/marked.min.js')          # stands in for the jsdelivr CDN so tests run offline
TEMPLATE = str(ROOT / 'data/travel-plan-template.md')
import sys, datetime
from playwright.sync_api import sync_playwright
errs=[]
def run(p, name, w, h, hashv='', theme=None, planning=False, clock=None, actions=None, full=True, lang='th'):
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':w,'height':h}, device_scale_factor=1)
    pg=ctx.new_page()
    pg.on('console', lambda m: errs.append(f'{name}: {m.type}: {m.text}') if m.type in ('error','warning') else None)
    pg.on('pageerror', lambda e: errs.append(f'{name}: PAGEERR {e}'))
    pg.route('https://cdn.jsdelivr.net/**', lambda r: r.fulfill(path=MARKED, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    if clock: pg.clock.install(time=clock)
    init="localStorage.clear();"
    if planning or theme or lang!='th':
        init+=f"localStorage.setItem('tp1.settings', JSON.stringify({{theme:'{theme or 'dark'}',planning:{str(planning).lower()},owner:{str(planning).lower()},lang:'{lang}'}}));"
    pg.goto(PAGE)
    pg.evaluate(init); pg.goto(PAGE+hashv); pg.reload(); pg.wait_for_timeout(1500)
    if actions: actions(pg)
    pg.wait_for_timeout(400)
    pathlib.Path('/tmp/tp-shots').mkdir(exist_ok=True); pg.screenshot(path=f'/tmp/tp-shots/{name}.png', full_page=full)
    b.close()
with sync_playwright() as p:
    for a in sys.argv[1:]:
        exec(a)
print('\n'.join(errs) or 'no console errors'); print('screenshots in /tmp/tp-shots/')
