#!/usr/bin/env python3
"""Assemble the page from src/, data/seed/*.md and the template.

Outputs
  dist/travel-plan.html      one self-contained file (claude.ai Artifact / any static host). Plan comes from the embedded seed.
  dist/gas/index.html        same page for Google Apps Script. No embedded seed: the plan is read from Drive via google.script.run.
  dist/gas/Code.gs           server (gas/Code.gs) with the seed embedded for setup()
  dist/gas/appsscript.json   manifest (optional to paste; the deploy dialog sets the same options)
"""
import json, pathlib, shutil
ROOT = pathlib.Path(__file__).resolve().parent.parent
def js(s): return json.dumps(s, ensure_ascii=False).replace('<', '\\u003c')   # never emit a raw "<" inside <script>
rd = lambda p: (ROOT / p).read_text(encoding='utf8')
seeds = [p.read_text(encoding='utf8') for p in sorted((ROOT / 'data/seed').glob('*.md'))]

def page(seed_list, target):
    return f'''<!doctype html>
<html lang="th" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0E1116">
<title>Trip Plans - วางแผนเที่ยว</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">
<style>
{rd('src/styles.css')}
</style>
</head>
<body>
<header class="topbar" id="topbar"></header>
<main id="app"></main>
<div id="toasts" class="toasts" aria-live="polite"></div>
<script>window.TP_TARGET={js(target)};window.TP_SEED={js(seed_list)};window.TP_TEMPLATE={js(rd('data/travel-plan-template.md'))};</script>
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
<script>
{rd('src/parser.js')}
</script>
<script>
{rd('src/app.js')}
</script>
</body>
</html>
'''

def write(rel, text):
    out = ROOT / rel
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(text, encoding='utf8')
    return out

html = page(seeds, 'static')
write('dist/travel-plan.html', html)
print(f'built dist/travel-plan.html  {len(html)//1024} KB  seeds={len(seeds)}')

gas_html = page([], 'gas')
code = rd('gas/Code.gs')
assert '/*@@SEED_MD@@*/null' in code
code = code.replace('/*@@SEED_MD@@*/null', json.dumps(seeds[0] if seeds else None, ensure_ascii=False))
write('dist/gas/index.html', gas_html)
write('dist/gas/Code.gs', code)
shutil.copyfile(ROOT / 'gas/appsscript.json', ROOT / 'dist/gas/appsscript.json')
print(f'built dist/gas/  index.html {len(gas_html)//1024} KB · Code.gs {len(code)//1024} KB')
