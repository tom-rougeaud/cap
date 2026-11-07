#!/usr/bin/env python3
"""Relève, dans la pagination du manuel ÉLÈVE (déjà publié, jamais reconstruit), la page de chaque bloc et les blocs
« Pour garder la forme » : ref/eleve-ref.json (manuel) et ref/sujets-ref.json (sujets blancs).
Ces relevés servent au PDF professeur (pastilles « Page élève », mêmes blocs) et à l’appli."""
import asyncio, json, sys, pathlib
from playwright.async_api import async_playwright
HERE = pathlib.Path(__file__).parent; B = HERE / 'build'; R = HERE / 'ref'; R.mkdir(exist_ok=True)
JS = '''() => { const pages = {}, flash = {}, order = []; const K = window.__bkey, N = window.__normT;
  const lisOf = c => { const t = document.getElementById('flash-' + c); return t ? [...t.content.querySelectorAll('li')].map(l => N(l.textContent)) : []; };
  [...document.querySelectorAll('#out .page')].forEach((p, i) => { const inner = p.querySelector('.inner'); if (!inner) return;
    const bl = [...inner.querySelectorAll(':scope > .blk, :scope > .colbox > .blk')];
    bl.forEach((b, j) => { if (b.classList.contains('flash')) { const prev = bl[j - 1]; const ch = (prev && prev.dataset.chap) || b.dataset.chap || '';
        const qs = [...b.querySelectorAll('.fl-q > li')].map(l => N(l.textContent)); const pool = lisOf(ch); const idx = qs.map(q => pool.indexOf(q));
        flash[prev ? K(prev) : ''] = { pg: i + 1, chap: ch, qs, idx }; order.push(prev ? K(prev) : ''); return; }
      const k = K(b); if (k && !(k in pages)) pages[k] = i + 1; }); });
  return { pages, flash, order, total: document.querySelectorAll('#out .page').length }; }'''
async def one(name):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 794, 'height': 1123})
        await pg.goto((B / f'{name}.html').as_uri()); await pg.wait_for_function('window.__result', timeout=900000)
        d = await pg.evaluate(JS); res = await pg.evaluate('({pages: window.__result.pages, flash: window.__result.flash || 0, errors: window.__result.errors})'); await b.close(); return d, res
async def main():
    for name, dst in [('eleve', 'eleve-ref.json'), ('sujets', 'sujets-ref.json')]:
        d, res = await one(name)
        bad = [k for k, v in d['flash'].items() if any(i < 0 for i in v['idx'])]
        print(name, 'pages', res['pages'], 'blocs repérés', len(d['pages']), 'flash', len(d['flash']), 'erreurs', res['errors'][:3], 'idx<0', bad)
        (R / dst).write_text(json.dumps(d, ensure_ascii=False), encoding='utf-8')
asyncio.run(main())
