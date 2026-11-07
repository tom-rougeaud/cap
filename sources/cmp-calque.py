"""Vérifie que le manuel professeur « calqué » a EXACTEMENT la mise en page du manuel élève (mêmes pages pour chaque bloc, mêmes blocs « Pour garder la forme »)."""
import asyncio, json, sys, pathlib, re
sys.argv=[sys.argv[0]]
src = pathlib.Path(__file__).with_name('ref-extract.py').read_text()
JS = re.search(r"JS = '''(.*?)'''", src, re.S).group(1)
from playwright.async_api import async_playwright
H = pathlib.Path(__file__).parent
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 794, 'height': 1123})
        await pg.goto((H/'build'/'calque.html').as_uri()); await pg.wait_for_function('window.__result', timeout=900000)
        d = await pg.evaluate(JS); res = await pg.evaluate('({pages: window.__result.pages, errors: window.__result.errors})'); await b.close()
    R = json.loads((H/'ref'/'eleve-ref.json').read_text())
    bad = 0
    for k, v in R['pages'].items():
        if d['pages'].get(k) != v: bad += 1; print('✗ page différente', k, 'élève', v, 'prof', d['pages'].get(k))
    extra = [k for k in d['pages'] if k not in R['pages'] and not k.startswith('det|') ]
    for k, v in R['flash'].items():
        w = d['flash'].get(k)
        if not w or w['pg'] != v['pg'] or w['qs'] != v['qs']: bad += 1; print('✗ bloc « garder la forme » différent', k, v['pg'], w and w['pg'])
    print(f"manuel professeur : {res['pages']} pages (élève : {R['total']} + annexe) · {len(R['pages'])} blocs et {len(R['flash'])} blocs « Pour garder la forme » comparés · {bad} différence(s) · erreurs de mise en page : {res['errors'][:5]}")
    print('blocs en plus dans le prof :', extra[:5])
    return bad
sys.exit(1 if asyncio.run(main()) else 0)
