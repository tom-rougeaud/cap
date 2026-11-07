#!/usr/bin/env python3
"""Construit le manuel « CAP Maths » : node gen3.js, puis pagination et PDF (élève et professeur).
   python3 make.py          → build/maths-cap-eleve.pdf et build/maths-cap-professeur.pdf
   python3 make.py --html   → seulement les HTML
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
        if name == 'eleve':
            res['_blocks'] = await pg.evaluate('''() => { const o = []; [...document.querySelectorAll('#out .page')].forEach((p, i) => { p.querySelectorAll('.blk').forEach(b => {
                if (b.classList.contains('nt4') && b.dataset.lcn) o.push([i + 1, 'n', b.dataset.lcn]);
                if (b.dataset.eid) o.push([i + 1, 'x', b.dataset.eid]);
                if (b.classList.contains('evh')) o.push([i + 1, 'ev', '']);
                if (b.classList.contains('dep3')) o.push([i + 1, 'dep', '']);
            }); }); return o; }''')
        if name in ('prof', 'sujets-prof', 'calque'):
            res['_keys'] = await pg.evaluate('''() => { const o = {}; [...document.querySelectorAll('#out .page')].forEach((p, i) => { const inner = p.querySelector('.inner'); if (!inner) return;
                inner.querySelectorAll(':scope > .blk, :scope > .colbox > .blk').forEach(b => { const k = window.__bkey(b); if (k && !(k in o)) o[k] = i + 1; }); }); return o; }''')
        if name == 'calque':
            res['_annexe'] = await pg.evaluate('''() => { const o = {}; [...document.querySelectorAll('#out .page')].forEach((p, i) => { p.querySelectorAll('.dz-e[data-did]').forEach(e => { if (!(e.dataset.did in o)) o[e.dataset.did] = i + 1; }); }); return o; }''')
        await pg.pdf(path=str(pdf), prefer_css_page_size=True, print_background=True, tagged=True)
        await b.close()
    return res

def meta(path, title, res, log, prof):
    r = PdfReader(str(path)); w = PdfWriter(clone_from=r)
    S = res['secs']
    def add(t, k, parent=None):
        p = S.get(k) if isinstance(k, str) else k
        return w.add_outline_item(t, p - 1, parent=parent) if p else None
    add('Couverture', 1); add('Ton manuel : comment ça marche ?', 'guide'); add('Les 5 compétences du CAP', 'competences'); add('Sommaire', 'sommaire'); add('Ce que tu sais déjà', 'pont')
    for c in log['chapitres']:
        top = add(f"Chapitre {c['n']} · {c['titre']}", c['id'])
        for k, t in [('-dep', 'Point de départ'), ('-cours', 'La leçon'), ('-meth', 'Méthodes'), ('-x', 'Je m’entraîne, je résous'), ('-ev', 'S’évaluer')]:
            add(t, c['id'] + k, top)
    top = add('Trois CCF blancs', 'dnb')
    for k in 'ABC': add(f'CCF blanc {k}', f'dnb-{k}', top)
    add('Réponses de « Je m’entraîne »', 'rep'); add('Glossaire visuel', 'glo')
    if S.get('corr'): add('Annexe · détail des calculs', 'corr')
    if S.get('acomp'): add('Annexe · les compétences en détail', 'acomp')
    if S.get('adnb'): add('Annexe · passation du CCF', 'adnb')
    if S.get('aref'): add('Annexe · programme et capacités du CAP', 'aref')
    w.page_mode = '/UseOutlines'
    w._root_object[NameObject('/Lang')] = TextStringObject('fr-FR')
    w.add_metadata({'/Title': title, '/Author': 'Tom Rougeaud', '/Subject': 'Maths · CAP Maths — CC BY-NC 4.0'})
    w.compress_identical_objects(remove_identicals=True, remove_orphans=True)
    with open(path, 'wb') as f: w.write(f)
    if shutil.which('qpdf'):
        tmp = path.with_suffix('.tmp.pdf')
        subprocess.run(['qpdf', '--object-streams=generate', '--recompress-flate', '--compression-level=9', str(path), str(tmp)], check=True)
        tmp.replace(path)

def split(pdf, res, log):
    """un PDF par chapitre (version élève), pour l’export depuis l’appli"""
    out = B / 'chapitres'; out.mkdir(exist_ok=True)
    r = PdfReader(str(pdf)); S = res['secs']; ids = [c['id'] for c in log['chapitres']]
    for i, c in enumerate(log['chapitres']):
        a = S[c['id']]; b = (S[ids[i + 1]] - 1) if i + 1 < len(ids) else (S.get('dnb') or S['rep']) - 1
        w = PdfWriter()
        for k in range(a - 1, b): w.add_page(r.pages[k])
        w.add_metadata({'/Title': f"Maths · CAP Maths — chapitre {c['n']} · {c['titre']}", '/Author': 'Tom Rougeaud', '/Subject': 'CC BY-NC 4.0'})
        w._root_object[NameObject('/Lang')] = TextStringObject('fr-FR')
        w.compress_identical_objects(remove_identicals=True, remove_orphans=True)
        dst = out / f"maths-cap-chapitre-{c['n']}.pdf"
        with open(dst, 'wb') as f: w.write(f)
        print(f"  chapitre {c['n']} : pages {a} à {b} → {dst.name}")

async def main():
    subprocess.run(['node', 'gen3.js'], check=True, cwd=HERE)
    if '--html' in sys.argv: return
    log = json.loads((B / 'log.json').read_text(encoding='utf-8'))
    ok = True
    for kind, pdf, title in [('eleve', B / 'maths-cap-eleve.pdf', 'CAP Maths — manuel'),
                             ('prof', B / 'maths-cap-professeur-detaille.pdf', 'CAP Maths — version professeur (corrigés dans les pages)'),
                             ('calque', B / 'maths-cap-professeur.pdf', 'CAP Maths — version professeur (calquée sur le manuel élève)')]:
        if '--calque' in sys.argv and kind != 'calque': continue
        if kind == 'prof' and ('--calque' in sys.argv or '--eleve' in sys.argv): continue
        if '--eleve' in sys.argv and kind in ('prof', 'calque'): continue
        if '--prof' in sys.argv and kind in ('eleve', 'calque'): continue
        if '--calque' in sys.argv and kind != 'calque': continue
        if kind == 'eleve' and '--calque' in sys.argv: continue   # le PDF élève publié ne doit jamais être reconstruit
        res = await render(kind, pdf)
        (B / f'{kind}.result.json').write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding='utf-8')
        print(f"{kind} : {res['pages']} pages · {res['notes']} zones de notes · {res['fits']} textes réduits · {res.get('pouces', 0)} coups de pouce")
        for e in res['errors'][:40]: print('  ✗', e); ok = False
        for e in res['warnings'][:20]: print('  ⚠', e)
        meta(pdf, title, res, log, kind == 'prof')
        if kind == 'eleve': split(pdf, res, log)
    if '--calque' in sys.argv: sys.exit(0 if ok else 1)
    if '--eleve' not in sys.argv or True:
        for name, dst, title, prof in [('sujets', B / 'chapitres' / 'maths-cap-ccf-blancs.pdf', 'Trois CCF blancs', False),
                                       ('glossaire', B / 'glossaire-cap.pdf', 'Glossaire visuel', False),
                                       ('sujets-prof', B / 'maths-cap-ccf-blancs-professeur.pdf', 'Sujets blancs · version professeur', True)]:
            if prof and '--eleve' in sys.argv: continue
            if '--prof' in sys.argv and not prof: continue
            (B / 'chapitres').mkdir(exist_ok=True)
            res = await render(name, dst)
            print(f"{name} : {res['pages']} pages")
            for e in res['errors'][:20]: print('  ✗', e); ok = False
            r = PdfReader(str(dst)); w = PdfWriter(clone_from=r)
            w.add_metadata({'/Title': f'Maths · CAP Maths — {title}', '/Author': 'Tom Rougeaud', '/Subject': 'CC BY-NC 4.0'})
            w._root_object[NameObject('/Lang')] = TextStringObject('fr-FR')
            with open(dst, 'wb') as f: w.write(f)
    sys.exit(0 if ok else 1)

asyncio.run(main())
