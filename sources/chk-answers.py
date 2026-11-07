"""Repère les réponses rouges (data-a) dont le texte risque de dépasser de son cadre dans le manuel professeur calqué."""
import asyncio, json, pathlib
from playwright.async_api import async_playwright
H = pathlib.Path(__file__).parent
JS = '''() => { const out = []; const pages = [...document.querySelectorAll('#out .page')];
 const host = document.createElement('div'); host.style.cssText = 'position:absolute;visibility:hidden;left:-9999px;top:0'; document.body.appendChild(host);
 pages.forEach((pg, pi) => { pg.querySelectorAll('[data-a]').forEach(e => { const cs = getComputedStyle(e, '::after'); if (!cs || cs.content === 'none') return;
   const txt = e.getAttribute('data-a'); const r = e.getBoundingClientRect(); if (!r.width && !r.height) return;
   let box = e; if (e.matches('.lines i')) box = e.parentElement; const R = box.getBoundingClientRect();
   const left = parseFloat(cs.left) || 0, right = isNaN(parseFloat(cs.right)) ? 0 : parseFloat(cs.right);
   const wrap = cs.whiteSpace !== 'nowrap';
   const m = document.createElement('span'); m.style.cssText = `display:block;font:${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily};white-space:${wrap ? 'normal' : 'nowrap'};width:${wrap ? Math.max(10, R.width - left - right) : 'auto'}px`; m.textContent = txt; host.appendChild(m);
   const need = m.getBoundingClientRect(), lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2; host.removeChild(m);
   const bottomAnch = cs.bottom !== 'auto' && !isNaN(parseFloat(cs.bottom));
   const lines = Math.round(need.height / lh);
   // espace disponible vers le haut/bas : on signale les réponses de plus d’une ligne dans un cadre qui n’en contient qu’une
   const avail = R.height; const over = need.height > avail + 3 && lines > 1;
   if (over || (!wrap && need.width > R.width - left + 2)) out.push({ p: pi + 1, a: txt.slice(0, 60), lines, need: Math.round(need.height), avail: Math.round(avail), cls: e.className || e.tagName }); }); });
 return out; }'''
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 794, 'height': 1123})
        await pg.goto((H/'build'/'calque.html').as_uri()); await pg.wait_for_function('window.__result', timeout=900000)
        out = await pg.evaluate(JS); await b.close()
    print(len(out), 'réponses à vérifier')
    for o in out: print(o)
asyncio.run(main())
