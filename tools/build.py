#!/usr/bin/env python3
"""Assemble dist/travel-plan.html (one self-contained file) from src/, data/seed/*.md and the template."""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
def js(s): return json.dumps(s, ensure_ascii=False).replace('<', '\\u003c')   # never emit a raw "<" inside <script>
rd = lambda p: (ROOT / p).read_text(encoding='utf8')
seeds = [p.read_text(encoding='utf8') for p in sorted((ROOT / 'data/seed').glob('*.md'))]
html = f'''<!doctype html>
<html lang="th" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0E1116">
<title>แผนเที่ยว</title>
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
<script>window.TP_SEED={js(seeds)};window.TP_TEMPLATE={js(rd('data/travel-plan-template.md'))};</script>
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
out = ROOT / 'dist/travel-plan.html'
out.write_text(html, encoding='utf8')
print(f'built {out.relative_to(ROOT)}  {len(html)//1024} KB  seeds={len(seeds)}')
