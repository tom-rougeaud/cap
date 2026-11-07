import asyncio, sys, pathlib
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 430, 'height': 900})
        await pg.goto(pathlib.Path(sys.argv[1]).resolve().as_uri()); await pg.wait_for_timeout(800)
        tot = bad = 0
        for cid, n in [('c1', 4), ('c2', 1), ('c2', 2), ('c7', 1), ('c7', 2)]:
            await pg.goto(sys.argv[1].replace('\\','/') if sys.argv[1].startswith('http') else pathlib.Path(sys.argv[1]).resolve().as_uri() + f'#/{cid}/notions'); await pg.wait_for_timeout(600)
            card = f'.mech3[data-c="{cid}"][data-n="{n}"]'
            if not await pg.query_selector(card): print('absent', cid, n); continue
            for rounds in range(6):
                items = await pg.evaluate("""(c) => [...document.querySelectorAll(c + ' .mq3')].map(li => li.querySelector('.mq').textContent)""", card)
                data = await pg.evaluate("""([cid,n,card]) => { const h = s => { let x = 2166136261; for (const ch of s) { x ^= ch.charCodeAt(0); x = Math.imul(x, 16777619); } return x >>> 0; };
                  const art = document.querySelector(card); return window.MCVT.mech(cid, n, window.__seedOf ? 0 : h(`${cid}-m${n}`)).items.map(i => ({a: i.a, irr: !!i.irr, v: i.v})); }""", [cid, n, card])
                inputs = await pg.query_selector_all(f'{card} .mq3 .inp')
                for it, inp in zip(data, inputs):
                    if not it['irr']: await inp.fill(it['a']); continue
                    pn, pd = it['a'].replace('−', '-').split('/'); await inp.fill(f"{int(pn)*2}/{int(pd)*2}")
                await pg.click(f'{card} [data-mech-check]')
                res = await pg.evaluate("""(c) => [...document.querySelectorAll(c + ' .mq3')].map(li => li.className + '|' + li.querySelector('.mfb').textContent)""", card)
                for it, r in zip(data, res):
                    tot += 1
                    if it['irr'] and 'ok' in r.split('|')[0].split(): bad += 1; print('ACCEPTÉ À TORT', cid, n, it['a'], r)
                    if it['irr'] and 'irréductible' not in r: print('pas de message', r)
                # puis les bonnes réponses
                for it, inp in zip(data, inputs): await inp.fill(it['a'])
                await pg.click(f'{card} [data-mech-check]')
                sc = await pg.inner_text(f'{card} .score'); print(cid, n, 'irr:', sum(1 for d in data if d['irr']), res[:0], 'bonnes réponses ->', sc)
                await pg.click(f'{card} [data-mech-new]'); break
        print('items', tot, 'acceptés à tort', bad); await b.close()
asyncio.run(main())
