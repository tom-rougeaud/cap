#!/usr/bin/env python3
"""Contrôle indépendant : recalcule chaque égalité numérique imprimée dans le manuel professeur (pages a à b, plus l’annexe filtrée par mot-clé)."""
import re, subprocess, sys
pdf, a, b, kw, ann = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4], int(sys.argv[5])
pages = subprocess.run(['pdftotext', '-layout', pdf, '-'], capture_output=True, text=True).stdout.split('\f')
num = r'\d+(?:[\u202f\u00a0]\d{3})*(?:,\d+)?'
pat = re.compile(rf'(?<![\d,+×÷−] )(?<![\d,])((?:{num})(?: ?[×÷+−] ?(?:{num}))+) ?(=|≈) ?({num})(?![\d,]| ?[×÷+−%°])')
val = lambda s: float(s.replace(' ', '').replace(' ', '').replace(',', '.'))
ev = lambda e: eval(re.sub(num, lambda m: str(val(m.group(0))), e).replace('×', '*').replace('÷', '/').replace('−', '-'))
src = '\n'.join(pages[a - 1:b]) + '\n' + '\n'.join(p for p in pages[ann:] if kw in p)
ok = bad = 0; seen = set()
for line in src.split('\n'):
    for m in pat.finditer(line):
        e, op, r = m.groups()
        if (e, r) in seen: continue
        seen.add((e, r)); v = ev(e); rv = val(r); dec = len(r.split(',')[1]) if ',' in r else 0
        if abs(v - rv) <= (1e-9 if op == '=' else 0.5 * 10 ** (-dec) + 1e-9): ok += 1
        else: bad += 1; print('  ✗', e, op, r, '→', round(v, 5), '|', line.strip()[:110])
print(f'pages {a}-{b} : {ok} égalités vérifiées · {bad} à examiner')
