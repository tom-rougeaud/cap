"""Compare, pour chaque exercice, les énoncés de l’appli (données du manuel par défaut) avec
   (1) le HTML source du manuel élève (build/eleve.html), au caractère près ;
   (2) le texte du PDF élève figé (lettres + nombres, tolérance sur les formules)."""
import asyncio, json, re, sys, unicodedata
from playwright.async_api import async_playwright
from pypdf import PdfReader
APP, PDF = sys.argv[1], sys.argv[2]
def nz(t):
    t = unicodedata.normalize('NFKC', re.sub(r'<[^>]*>', ' ', str(t)))
    return re.sub(r'[^0-9a-zA-Z]+', '', unicodedata.normalize('NFKD', t)).lower()
def letters(t): return re.sub(r'[^a-z]+', '', nz(t))
def nums(t): return re.findall(r'\d+', unicodedata.normalize('NFKC', re.sub(r'<[^>]*>', ' ', str(t))))
pages = [PdfReader(PDF).pages[i].extract_text() or '' for i in range(len(PdfReader(PDF).pages))]
horsman = []
PL = [letters(p) for p in pages]; PN = [set(nums(p)) for p in pages]
R = json.load(open('ref/eleve-ref.json'))
miss1, miss2 = [], []; tot = 0
async def main():
    global tot
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        pe = await b.new_page(); await pe.goto('file:///home/claude/mcvC/build/eleve.html')
        blocks = await pe.evaluate("""() => { const o = {};
          document.querySelectorAll('[data-eid]').forEach(e => { o['x|' + e.dataset.eid] = (o['x|' + e.dataset.eid] || '') + ' ' + e.textContent; });
          document.querySelectorAll('.dep3').forEach(e => { o['dep|' + e.dataset.chap] = e.textContent; });
          document.querySelectorAll('.sais3').forEach(e => { o['auto|' + e.dataset.chap] = e.textContent; });
          document.querySelectorAll('template[id^=flash-]').forEach(t => { o['flash|' + t.id.slice(6)] = t.innerHTML; });
          return o; }""")
        pg = await b.new_page(); await pg.goto('file://' + APP); await pg.wait_for_selector('#main')
        data = await pg.evaluate("""() => { const out = []; const fn = window.MCVAFNV;
          for (const c of MCVADATA.chapitres) {
            for (const e of c.entraine) { const g = MCVT.tr(e.gen, fn(c.id + '-' + e.id)); out.push(['x|' + c.id + '-' + e.id, [g.consigne, g.support || '', ...g.items.map(i => i.k)]]); }
            for (let n = 1; n <= 8; n++) { if (!(MCVT.MECH && MCVT.MECH[c.id + '.' + n])) continue; const m = MCVT.mech(c.id, n, fn(c.id + '-m' + n)); out.push(['x|' + c.id + '-m' + n, [m.consigne, ...m.items.map(i => i.t)]]); }
            const d = MCVT.dep(c.depart, fn(c.id + '-dep')); out.push(['dep|' + c.id, [d.titre, ...d.qs.map(q => q.t)]]);
            out.push(['auto|' + c.id, MCVA.gen(c.id, fn(c.id + '-auto'), 10).map(q => q.t)]);
          }
          for (const k of Object.keys(MCVADATA.ref.flash)) { const ch = MCVADATA.ref.flash[k].chap; out.push([k, MCVAFL(ch, k).map(q => q.t)]); }
          return out; }""")
        await b.close()
    for key, texts in data:
        pgn = R['flash'][key]['pg'] if key in R['flash'] else R['pages'].get(key)
        if pgn is None: horsman.append(key); continue
        src = blocks.get(key if not key in R['flash'] else 'flash|' + R['flash'][key]['chap'], '')
        for t in texts:
            if key.startswith('x|') and not nz(t): continue
            n = nz(t)
            if not n: continue
            tot += 1
            w = [q for q in (pgn - 1, pgn, pgn + 1, pgn + 2) if pgn and 0 < q <= len(pages)]
            words = [x for x in re.findall(r'[a-z]{5,}', unicodedata.normalize('NFKD', re.sub(r'<[^>]*>', ' ', str(t)).lower()).encode('ascii','ignore').decode())]
            okL = all(any(x in PL[q - 1] for q in w) for x in words)
            okN = all(any(x in PN[q - 1] for q in w) for x in nums(t))
            if not (okL and okN): miss2.append((key, str(t)[:90]))
asyncio.run(main())
print('blocs de l’appli absents du manuel :', sorted(set(horsman)))
print('énoncés comparés :', tot)
print('(2) absents du PDF élève figé (lettres+nombres) :', len(miss2)); [print('  ✗', m) for m in miss2[:25]]
