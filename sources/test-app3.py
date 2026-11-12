"""Test de bout en bout de l’appli CAP Maths : 9 chapitres × 6 onglets, et les 2 CCF blancs, deux largeurs d’écran.
   On répond juste partout (départ, résolu à compléter, supports, problèmes, contrôle blanc) et on vérifie
   qu’une erreur fréquente reçoit bien son message d’explication."""
import asyncio, sys
from playwright.async_api import async_playwright

URL = 'file://' + (sys.argv[1] if len(sys.argv) > 1 else '/home/claude/cap-new/index.html')
SHOTS = sys.argv[2] if len(sys.argv) > 2 else None
TABS = ['depart', 'notions', 'methodes', 'problemes', 'evaluer']
problems = []
stats = {'dep': 0, 'tr': 0, 'trerr': 0, 'rs2': 0, 'pbq': 0, 'ev': 0, 'temps': 0, 'tap': 0}

def bad(msg):
    problems.append(msg); print('✗', msg)

import re
def irrans(q):
    if re.search('irréductible', q.get('t') or '') and q.get('v') is not None:
        f = re.findall(r'(\d+)/(\d+)', q.get('a') or '')
        if f: return f[-1][0] + '/' + f[-1][1]
    return None
FR = "(x, t) => { const d = (t != null && window.MCVG && MCVG.dmaxOf) ? MCVG.dmaxOf(t) : null; if (d != null) x = Math.round(x * Math.pow(10, d)) / Math.pow(10, d); let s = String(Math.round(x * 1e6) / 1e6); return s.replace('.', ','); }"

async def overflow(page, where):
    w = await page.evaluate("() => [document.documentElement.scrollWidth, innerWidth, [...document.querySelectorAll('#main *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 2 && !e.closest('.tscroll,.tabs,.sup,.dep-doc,.rs-doc,.evdoc'); }).slice(0,3).map(e => e.tagName + '.' + (e.className.baseVal ?? e.className))]")
    if w[0] > w[1] + 1:
        bad(f'{where}: défilement horizontal ({w[0]} > {w[1]}) {w[2]}')

async def fill_copy(page, e):
    """remplit une copie au format du CCF avec les bonnes réponses, la rend et s’attribue les points rédigés"""
    k = 0
    for q in e['auto'] + [q for x in e['exos'] for q in x['qs']]:
        if q.get('choices'): await page.click(f'.evq2[data-k="{k}"] .ch[data-k="{q["ok"]}"]')
        elif q.get('v') is not None: await page.fill(f'.evq2[data-k="{k}"] .inp', (irrans(q) or await page.evaluate(f"({FR})({q['v']}, {q.get('tol') if q.get('tol') is not None else 'null'})")))
        else: await page.fill(f'.evq2[data-k="{k}"] .inp', 'ma réponse')
        k += 1
    await page.click('[data-ev="rendre"]')
    for b2 in await page.query_selector_all('[data-self="1"]'): await b2.click()

async def run(p, vw, vh, label, full):
    b = await p.chromium.launch(**({'executable_path': __import__('os').environ['CHROME_BIN'], 'args': ['--no-sandbox']} if __import__('os').environ.get('CHROME_BIN') else {}))
    ctx = await b.new_context(viewport={'width': vw, 'height': vh}, device_scale_factor=1, has_touch=vw < 600, accept_downloads=True)
    page = await ctx.new_page()
    page.on('pageerror', lambda e: bad(f'{label} erreur JS : {e}'))
    page.on('console', lambda m: m.type == 'error' and bad(f'{label} console : {m.text}'))
    page.on('dialog', lambda d: asyncio.ensure_future(d.accept()))
    await page.goto(URL + '#/')
    data = await page.evaluate("JSON.parse(document.getElementById('mcv-data').textContent)")
    if SHOTS: await page.screenshot(path=f'{SHOTS}/{label}-accueil.png', full_page=True)
    await overflow(page, f'{label} accueil')
    import os
    for c in data['chapitres']:
        cid = c['id']
        if os.environ.get('CH') and cid not in os.environ['CH'].split(','): continue
        for t in TABS:
            await page.goto(f"{URL}#/{cid}/{t}")
            await page.wait_for_timeout(80)
            await overflow(page, f"{label} {cid}/{t}")
            if SHOTS and cid in ('c1', 'c5', 'c7'):
                await page.screenshot(path=f"{SHOTS}/{label}-{cid}-{t}.png", full_page=True)
            if not full: continue
            if t == 'depart':
                d = await page.evaluate("MCVAPP.dep()")
                for j, q in enumerate(d['qs']):
                    li = f'.dq[data-j="{j}"]'
                    if q['kind'] == 'tap':
                        await page.click(f'#dep-doc [data-cell="{q["cell"]}"]'); stats['tap'] += 1
                    elif q['kind'] == 'qcm':
                        await page.click(f'{li} .ch[data-dk="{q["ok"]}"]')
                    else:
                        v = (irrans(q) or await page.evaluate(f"({FR})({q['v']}, {q.get('tol') if q.get('tol') is not None else 'null'})"))
                        await page.fill(f'{li} .inp', v); await page.click(f'{li} [data-dv]')
                ok = await page.evaluate("document.querySelectorAll('.dq.ok').length")
                if ok != len(d['qs']): bad(f'{label} {cid} départ : {ok}/{len(d["qs"])} justes')
                else: stats['dep'] += 1
            if t == 'notions':
                for art in await page.query_selector_all('.nt'):
                    for _ in range(4):
                        bt = await art.query_selector('[data-temps]')
                        if await bt.is_enabled(): await bt.click()
                    txt = await (await art.query_selector('.tpc')).inner_text()
                    hid = await art.evaluate("a => [...a.querySelectorAll('.tp')].filter(x => x.hidden).length")
                    if txt != '5 / 5' or hid: bad(f'{label} {cid} leçon : {txt}, {hid} temps cachés')
                    else: stats['temps'] += 1
                    for b3 in await art.query_selector_all('[data-amoi]'): await b3.click()
                    if await art.evaluate("a => [...a.querySelectorAll('.amoi-a')].some(x => x.hidden)"): bad(f'{label} {cid} leçon : réponse « À moi » cachée')
            if t == 'methodes':
                rs = '#rs2'
                n = await page.evaluate(f"document.querySelectorAll('{rs} .rsi').length")
                for k in range(n):
                    a = await page.evaluate(f"document.querySelector('{rs} .rsi[data-k=\"{k}\"]').dataset.a")
                    await page.fill(f'{rs} .rsi[data-k="{k}"]', a)
                await page.click(f'{rs} [data-rs2]')
                good = await page.evaluate(f"document.querySelectorAll('{rs} .rsi.good').length")
                if good != n or n == 0: bad(f'{label} {cid} résolu à compléter : {good}/{n}')
                else: stats['rs2'] += 1
            if t == 'notions':
                aq = await page.evaluate(f"MCVAUTO('{cid}')")
                AS = '.auto:not(.flashc)'
                for j, q in enumerate(aq):
                    if q.get('choices'):
                        await page.click(f'{AS} .aq[data-j="{j}"] .ch[data-ak="{q["ok"]}"]'); continue
                    v = (irrans(q) or await page.evaluate(f"({FR})({q['v']}, {q.get('tol') if q.get('tol') is not None else 'null'})"))
                    await page.fill(f'{AS} .aq[data-j="{j}"] .inp', v)
                await page.click(f'{AS} [data-auto-check]')
                ok = await page.evaluate("document.querySelectorAll('.auto:not(.flashc) .aq.ok').length")
                if ok != 10: bad(f'{label} {cid} automatismes : {ok}/10 justes')
                else: stats['auto'] = stats.get('auto', 0) + 1
                # blocs « Pour garder la forme » : bonnes réponses partout, puis boutons Autres questions / Données du manuel
                for fk in await page.evaluate("[...document.querySelectorAll('.flashc')].map(a => a.dataset.fk)"):
                    sel = f'.flashc[data-fk="{fk}"]'
                    fq = await page.evaluate(f"MCVAFL('{cid}', '{fk}')")
                    if not fq: bad(f'{label} {cid} {fk} : bloc vide'); continue
                    for j, q in enumerate(fq):
                        if q.get('choices'): await page.click(f'{sel} .aq[data-j="{j}"] .ch[data-ak="{q["ok"]}"]'); continue
                        await page.fill(f'{sel} .aq[data-j="{j}"] .inp', (irrans(q) or await page.evaluate(f"({FR})({q['v']}, {q.get('tol') if q.get('tol') is not None else 'null'})")))
                    await page.click(f'{sel} [data-auto-check]')
                    okf = await page.evaluate(f"document.querySelectorAll('{sel} .aq.ok').length")
                    if okf != len(fq): bad(f'{label} {cid} {fk} : {okf}/{len(fq)} justes')
                    else: stats['flash'] = stats.get('flash', 0) + 1
                    t0 = await page.evaluate(f"[...document.querySelectorAll('{sel} .aq > p')].map(p => p.textContent).join('|')")
                    await page.click(f'{sel} [data-fl-new]')
                    t1 = await page.evaluate(f"[...document.querySelectorAll('{sel} .aq > p')].map(p => p.textContent).join('|')")
                    if t1 == t0: bad(f'{label} {cid} {fk} : « Autres questions » ne change rien')
                    await page.click(f'{sel} [data-fl-man]')
                    t2 = await page.evaluate(f"[...document.querySelectorAll('{sel} .aq > p')].map(p => p.textContent).join('|')")
                    if t2 != t0: bad(f'{label} {cid} {fk} : « Données du manuel » ne rétablit pas les questions')
                for e in c['entraine']:
                    card = f'#ex-{e["id"]}'
                    g = await page.evaluate(f"(() => {{ const s = MCVAPP.seeds['{cid}{e['id']}']; return MCVT.tr('{e['gen']}', s); }})()")
                    # 1. une erreur fréquente reçoit son explication
                    errit = next((it for it in g['items'] if it.get('err')), None)
                    if errit:
                        sel = f'{card} .inp[data-k="{errit["k"]}"], {card} .it3[data-k="{errit["k"]}"] .inp'
                        await page.fill(sel, await page.evaluate(f"({FR})({errit['err'][0]['v']})"))
                        await page.click(f'{card} [data-check]')
                        fb = await page.inner_text(f'{card} .fbs')
                        if errit['err'][0]['m'][:12] not in fb: bad(f'{label} {cid} {e["id"]} : message d’erreur absent ({fb[:60]})')
                        else: stats['trerr'] += 1
                    # 2. tout juste
                    for it in g['items']:
                        if it.get('qcm'):
                            await page.click(f'{card} .it3[data-k="{it["k"]}"] .ch[data-k="{it["qcm"]["ok"]}"]')
                        else:
                            sel = f'{card} .inp[data-k="{it["k"]}"], {card} .it3[data-k="{it["k"]}"] .inp'
                            await page.fill(sel, await page.evaluate(f"({FR})({it['v']}, {it.get('tol') if it.get('tol') is not None else 'null'})"))
                    await page.click(f'{card} [data-check]')
                    sc = await page.inner_text(f'{card} .score')
                    if sc.split(' ')[0] != f"{len(g['items'])}": bad(f'{label} {cid} {e["id"]} : {sc}')
                    else: stats['tr'] += 1
                    await page.click(f'{card} [data-hint]')
                    if not await page.query_selector(f'{card} .hint1'): bad(f'{label} {cid} {e["id"]} : pas d’indice')
            if t == 'notions':
                for n in range(1, len(c['notions']) + 1):
                    card = f'.mech3[data-c="{cid}"][data-n="{n}"]'
                    if not await page.query_selector(card): bad(f'{label} {cid} notion {n} : pas de mécanique'); continue
                    ans = await page.evaluate("""([cid, n]) => { const h = s => { let x = 2166136261; for (const ch of s) { x ^= ch.charCodeAt(0); x = Math.imul(x, 16777619); } return x >>> 0; };
                      return window.MCVT.mech(cid, n, h(`${cid}-m${n}`)).items.map(it => it.vs ? it.vs.join(" ; ") : it.irr ? it.a : it.v != null ? String(it.v).replace('.', ',') : it.a); }""", [cid, n])
                    inputs = await page.query_selector_all(f'{card} .mq3 .inp')
                    if len(inputs) != 4: bad(f'{label} {cid} notion {n} : {len(inputs)} cases'); continue
                    for inp, a in zip(inputs, ans): await inp.fill(a)
                    await page.click(f'{card} [data-mech-check]')
                    sc = await page.inner_text(f'{card} .score')
                    if sc.split(' ')[0] != '4': bad(f'{label} {cid} notion {n} mécanique : {sc}')
                    else: stats['mech'] = stats.get('mech', 0) + 1
                    await page.click(f'{card} [data-mech-new]')
                    if len(await page.query_selector_all(f'{card} .mq3')) != 4: bad(f'{label} {cid} notion {n} : autres calculs')
            if t == 'problemes':
                for pr in c['probs']:
                    card = f'#ex-{pr["id"]}'
                    for j, q in enumerate(pr['qs']):
                        if q.get('v') is None: continue
                        qa = f'{card} .qa[data-j="{j}"]'
                        await page.fill(f'{qa} .inp', (irrans(q) or await page.evaluate(f"({FR})({q['v']}, {q.get('tol') if q.get('tol') is not None else 'null'})")))
                        await page.click(f'{qa} [data-qv]')
                        if not await page.evaluate(f"document.querySelector('{qa}').classList.contains('ok')"): bad(f'{label} {cid} {pr["id"]} q{j} : réponse juste refusée')
                        else: stats['pbq'] += 1
                    if pr.get('hints'):
                        await page.click(f'{card} [data-phint]')
                        if not await page.query_selector(f'{card} .hint1'): bad(f'{label} {cid} {pr["id"]} : pas d’indice')
            if t == 'evaluer':
                await fill_copy(page, c['eval'])
                note = await page.inner_text('#ev-res .big3')
                if note.strip() != '10 / 10': bad(f'{label} {cid} évaluation CCF : {note}')
                else: stats['ev'] += 1
    # les deux CCF blancs : chrono 45 min, copie parfaite = 20 / 20
    for sj in data.get('ccf', []):
        await page.goto(f"{URL}#/ccf/{sj['id']}"); await page.wait_for_timeout(80); await overflow(page, f"{label} ccf {sj['id']}")
        if SHOTS: await page.screenshot(path=f"{SHOTS}/{label}-ccf-{sj['id']}.png", full_page=True)
        if not full: continue
        await page.click('[data-chrono]')
        if not await page.evaluate("!document.getElementById('ev-timer').hidden && /restantes/.test(document.getElementById('ev-timer').textContent)"): bad(f'{label} ccf {sj["id"]} : chrono')
        await fill_copy(page, sj)
        note = await page.inner_text('#ev-res .big3')
        if note.strip() != '10 / 10': bad(f'{label} ccf {sj["id"]} : {note}')
        else: stats['ccf'] = stats.get('ccf', 0) + 1
    # données : clés de stockage, export, effacement
    keys = await page.evaluate("Object.keys(localStorage)")
    if full and (not keys or any(not k.startswith('mcvcap.v1.') for k in keys)): bad(f'{label} clés de stockage : {keys}')
    await page.goto(URL + '#/donnees')
    async with page.expect_download() as dl:
        await page.click('[data-export]')
    d = await dl.value
    if 'progression' not in d.suggested_filename: bad('export : nom de fichier')
    await page.click('[data-clear]'); await page.wait_for_timeout(100)
    if await page.evaluate("Object.keys(localStorage).filter(k => k.startsWith('mcv3e.')).length"): bad('effacement incomplet')
    for r in ['#/glossaire', '#/college', '#/ccf', '#/a-propos', '#/confidentialite']:
        await page.goto(URL + r); await page.wait_for_timeout(50); await overflow(page, f'{label} {r}')
    await b.close()

async def main():
    async with async_playwright() as p:
        await run(p, 1280, 900, 'ordi', True)
        await run(p, 375, 740, 'mobile', True)
    print('Bilan :', stats)
    print('OK' if not problems else f'{len(problems)} problème(s)')
    sys.exit(1 if problems else 0)

asyncio.run(main())
