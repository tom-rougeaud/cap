#!/usr/bin/env python3
"""Fabrique les fichiers d’installation d’une appli (PWA) : manifest.webmanifest, sw.js, icônes PNG.
   python3 make-pwa.py <dossier de l’appli> "<nom>" "<nom court>" <couleur de l’icône> <couleur du Σ> <couleur du thème> ["<description>"]"""
import sys, json, pathlib, shutil, asyncio
from playwright.async_api import async_playwright

out = pathlib.Path(sys.argv[1]); name, short, bg, ink, theme = sys.argv[2:7]
desc = sys.argv[7] if len(sys.argv) > 7 else 'Mathématiques : leçons, exercices corrigés et fiches de révision.'
HERE = pathlib.Path(__file__).parent
out.mkdir(parents=True, exist_ok=True)
shutil.copy2(HERE / 'sw.js', out / 'sw.js')

def svg(size, maskable):
    rx = 0 if maskable else round(size * 0.22)
    fs = round(size * (0.50 if maskable else 0.69)); y = round(size * (0.64 if maskable else 0.73))
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}"><rect width="{size}" height="{size}" rx="{rx}" fill="{bg}"/><text x="{size/2}" y="{y}" font-family="Arial,Helvetica,sans-serif" font-size="{fs}" font-weight="700" fill="{ink}" text-anchor="middle">Σ</text></svg>'

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        for size, maskable, fn in [(192, False, 'icon-192.png'), (512, False, 'icon-512.png'), (512, True, 'icon-maskable-512.png'), (180, True, 'apple-touch-icon.png')]:
            await pg.set_viewport_size({'width': size, 'height': size})
            await pg.set_content(f'<html><body style="margin:0;background:transparent">{svg(size, maskable)}</body></html>')
            await pg.screenshot(path=str(out / fn), omit_background=True, clip={'x': 0, 'y': 0, 'width': size, 'height': size})
        await b.close()
asyncio.run(main())

man = {'name': name, 'short_name': short, 'description': desc, 'lang': 'fr', 'start_url': './', 'scope': './', 'display': 'standalone',
       'orientation': 'any', 'background_color': '#FFFFFF', 'theme_color': theme,
       'icons': [{'src': 'icon-192.png', 'sizes': '192x192', 'type': 'image/png', 'purpose': 'any'}, {'src': 'icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any'}, {'src': 'icon-maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'}]}
(out / 'manifest.webmanifest').write_text(json.dumps(man, ensure_ascii=False, indent=1), encoding='utf-8')
print('PWA →', out)
