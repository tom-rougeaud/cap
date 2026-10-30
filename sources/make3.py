#!/usr/bin/env python3
"""Construit le manuel « Maths · CAP » : node gen3.js, puis pagination et PDF (élève et professeur).
   python3 make3.py          → build/maths-cap-eleve.pdf et build/maths-cap-professeur.pdf, puis les PDF par chapitre, les CCF blancs et les fiches de révision
   python3 make3.py --html   → seulement les HTML
La version professeur n’est jamais publiée."""
import asyncio, json, subprocess, sys, pathlib, shutil
from playwright.async_api import async_playwright
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject

HERE = pathlib.Path(__file__).parent
B = HERE / 'build'

async def render(name, pdf):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 794, 'height': 1123})
        await pg.goto((B / f'{name}.html').as_uri())
        await pg.wait_for_function('window.__result', timeout=900000)
        res = await pg.evaluate('window.__result')
        await pg.pdf(path=str(pdf), prefer_css_page_size=True, print_background=True, tagged=True)
        await b.close()
    return res

def meta(path, title, res, log, prof):
    r = PdfReader(str(path)); w = PdfWriter(clone_from=r)
    S = res['secs']
    def add(t, k, parent=None):
        p = S.get(k) if isinstance(k, str) else k
        return w.add_outline_item(t, p - 1, parent=parent) if p else None
    add('Couverture', 1); add('Ton manuel : comment ça marche ?', 'guide'); add('Les 5 compétences, au travail', 'competences'); add('Sommaire', 'sommaire'); add('Ce que tu sais déjà', 'pont')
    for c in log['chapitres']:
        top = add(f"Chapitre {c['n']} · {c['titre']}", c['id'])
        for k, t in [('-dep', 'Point de départ'), ('-cours', 'La leçon'), ('-meth', 'Méthodes'), ('-x', 'Je m’entraîne, je résous'), ('-ev', 'S’évaluer')]:
            add(t, c['id'] + k, top)
    top = add('Trois CCF blancs', 'dnb')
    for k in 'ABC': add(f'CCF blanc {k}', f'dnb-{k}', top)
    add('Fiches de révision', 'fiches'); add('Réponses de « Je m’entraîne »', 'rep'); add('Glossaire visuel', 'glo')
    w.page_mode = '/UseOutlines'
    w._root_object[NameObject('/Lang')] = TextStringObject('fr-FR')
    w.add_metadata({'/Title': title, '/Author': 'Tom Rougeaud', '/Subject': 'Maths · CAP — CC BY-NC 4.0'})
    w.compress_identical_objects(remove_identicals=True, remove_orphans=True)
    with open(path, 'wb') as f: w.write(f)
    if shutil.which('qpdf'):
        tmp = path.with_suffix('.tmp.pdf')
        subprocess.run(['qpdf', '--object-streams=generate', '--recompress-flate', '--compression-level=9', str(path), str(tmp)], check=True)
        tmp.replace(path)

def split(pdf, res, log):
    """un PDF par chapitre, les CCF blancs et les fiches de révision (version élève), pour l’export depuis l’appli"""
    out = B / 'chapitres'; out.mkdir(exist_ok=True)
    r = PdfReader(str(pdf)); S = res['secs']; ids = [c['id'] for c in log['chapitres']]
    def cut(a, b, title, dst):
        w = PdfWriter()
        for k in range(a - 1, b): w.add_page(r.pages[k])
        w.add_metadata({'/Title': title, '/Author': 'Tom Rougeaud', '/Subject': 'CC BY-NC 4.0'})
        w._root_object[NameObject('/Lang')] = TextStringObject('fr-FR')
        w.compress_identical_objects(remove_identicals=True, remove_orphans=True)
        with open(dst, 'wb') as f: w.write(f)
        print(f"  pages {a} à {b} → {dst.name}")
    for i, c in enumerate(log['chapitres']):
        a = S[c['id']]; b = (S[ids[i + 1]] - 1) if i + 1 < len(ids) else S.get('dnb', S['fiches']) - 1
        cut(a, b, f"Maths · CAP — chapitre {c['n']} · {c['titre']}", out / f"maths-cap-chapitre-{c['n']}.pdf")
    if 'dnb' in S: cut(S['dnb'], S['fiches'] - 1, 'Maths · CAP — trois CCF blancs', out / 'maths-cap-ccf-blancs.pdf')
    cut(S.get('fiche-' + ids[0], S['fiches']), S['rep'] - 1, 'Maths · CAP — fiches de révision', B / 'fiches-de-revision-maths-cap.pdf')

async def main():
    subprocess.run(['node', 'gen3.js'], check=True, cwd=HERE)
    if '--html' in sys.argv: return
    log = json.loads((B / 'log.json').read_text(encoding='utf-8'))
    ok = True
    for kind, pdf, title in [('eleve', B / 'maths-cap-eleve.pdf', 'Maths · CAP — manuel'),
                             ('prof', B / 'maths-cap-professeur.pdf', 'Maths · CAP — version professeur')]:
        if '--eleve' in sys.argv and kind == 'prof': continue
        res = await render(kind, pdf)
        (B / f'{kind}.result.json').write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding='utf-8')
        print(f"{kind} : {res['pages']} pages · {res['notes']} zones de notes · {res['fits']} textes réduits · {res.get('pouces', 0)} coups de pouce")
        for e in res['errors'][:40]: print('  ✗', e); ok = False
        for e in res['warnings'][:20]: print('  ⚠', e)
        meta(pdf, title, res, log, kind == 'prof')
        if kind == 'eleve': split(pdf, res, log)
    sys.exit(0 if ok else 1)

asyncio.run(main())
