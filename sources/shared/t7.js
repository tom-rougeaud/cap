/* CAP Maths · chapitre 7 — Fonctions linéaires et affines : f(x) = ax, f(x) = ax + b, droites, comparaison de deux formules.
   Chaque exercice « Je m’entraîne » existe en trois niveaux : courant (id), 🌱 guidé (id + 'a'), 🚀 défi (id + 'd'). Toutes les réponses sont calculées. */
(function (root) {
  'use strict';
  const { DEP, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, tb, T, svg, table, num, qcm, pick, int, xs, lv, shuffle, rnd, ln, tabXY, f1, f2, P } = H;
  const eu = x => fr(x, Number.isInteger(rnd(x, 2)) ? 0 : 2);
  const SM = '<svg style="max-width:108mm;height:auto" ';
  const gt = (x, y, s, col, a = 'start', fs = 12) => `<text x="${rnd(x, 1)}" y="${rnd(y, 1)}" font-family="Nunito Sans" font-size="${fs}" font-weight="800" text-anchor="${a}" fill="${col}">${s}</text>`;
  const RED = '#C2332A', BLUE = '#1D5FC2';

  DEP.c7 = R => {
    const a = pick(R, [3, 4, 5, 6]), xs5 = [1, 2, 3, 4, 5], k = int(R, 0, 4), n = pick(R, [4, 6, 7, 9]), n2 = pick(R, [6, 8, 10]);
    const doc = `<table class="dt tcx dt-sm"><thead><tr><th>Seaux de pop-corn x</th><th>Prix f(x) (€)</th></tr></thead><tbody>${xs5.map((x, i) => `<tr><th>${x}</th><td data-cell="${i + 1}">${a * x}</td></tr>`).join('')}</tbody></table><p class="tr-l">Un seau de pop-corn a un prix fixe : le prix est f(x) = a × x.</p>`;
    const ch = shuffle(R, ['l’origine (0 ; 0)', 'le point (0 ; 5)']);
    return { titre: 'Le prix des seaux de pop-corn', doc,
      qs: [{ t: `Quel est le prix de ${xs5[k]} seaux, en euros ?`, kind: 'tap', cell: String(k + 1), v: a * xs5[k], tol: .001, a: String(a * xs5[k]) },
        { t: 'Quel est le coefficient a de la fonction ?', kind: 'num', v: a, tol: .001, a: String(a), x: `${a * 2} ÷ 2 = ${a}` },
        { t: `Calcule f(${n}), le prix de ${n} seaux, en euros.`, kind: 'num', v: a * n, tol: .001, a: String(a * n), x: `${a} × ${n} = ${a * n}` },
        { t: 'La droite de cette fonction passe par :', kind: 'qcm', choices: ch, ok: ch.indexOf('l’origine (0 ; 0)'), a: 'l’origine (0 ; 0)', x: 'pour une fonction linéaire, f(0) = 0' },
        { t: `Avec ${a * n2} €, combien de seaux peut-on acheter ?`, kind: 'num', v: n2, tol: .001, a: String(n2), x: `${a * n2} ÷ ${a} = ${n2}` }] };
  };

  /* e1 · calculer avec f(x) = ax + b */
  lv('c7e1', (R, niv) => {
    const a = pick(R, [3, 4, 5, 6, 7, 8]), b = pick(R, [5, 8, 10, 12, 15]), x1 = pick(R, [2, 3, 4, 5, 6]), x2 = pick(R, [6, 7, 8, 9, 10]), v1 = a * x1 + b, v2 = a * x2 + b;
    if (niv === 0) {
      const items = [num('a', v1, 0, String(v1), [{ v: a * (x1 + b), m: 'Tu as additionné avant de multiplier. On multiplie a par x, puis on ajoute b.' }]), num('b', b, 0, String(b), [{ v: a, m: 'C’est le coefficient a. Le nombre b est celui qui est ajouté.' }]), num('c', x2, 0, String(x2), [{ v: rnd(v2 / a, 2), m: 'Tu as divisé sans retirer b. Retire d’abord ' + b + ', puis divise par ' + a + '.' }])];
      xs(items, { a: `P(${x1}) = ${a} × ${x1} + ${b} = ${a * x1} + ${b} = ${v1}`, b: `dans ${a}x + ${b}, le nombre ajouté est ${b}`, c: `${a}x + ${b} = ${v2} donne ${a}x = ${v2 - b}, puis x = ${v2 - b} ÷ ${a} = ${x2}` });
      return { titre: 'Une carte à prix fixe', consigne: `Un cinéma vend une carte puis un prix par séance. Le prix de x séances est P(x) = ${a}x + ${b}.`,
        support: table(['Nombre', 'Valeur', 'Rôle'], [['a', String(a), 'prix d’une séance'], ['b', String(b), 'prix de la carte']]) + ln('a', `Prix de ${x1} séances`, String(v1), 14, '€') + ln('b', 'Prix de la carte (le nombre b)', String(b), 14, '€') + `<p class="tr-l">Un client a payé ${v2} €.</p>` + ln('c', 'Nombre de séances', String(x2), 14), items,
        hints: ['Remplace x par la valeur, multiplie, puis ajoute b.', 'b est le nombre ajouté, le prix à 0 séance.', 'Retire b, puis divise par a.'] };
    }
    if (niv < 0) {
      const items = [num('a', a * x1, 0, String(a * x1), [{ v: x1, m: 'C’est le nombre de séances. Multiplie-le par ' + a + '.' }]), num('b', v1, 0, String(v1), [{ v: a * x1, m: 'C’est a × x. N’oublie pas d’ajouter ' + b + '.' }]), qcm('c', ['le prix fixe de la carte', 'le prix de chaque séance'], 0, 'le prix fixe de la carte')];
      xs(items, { a: `${a} × ${x1} = ${a * x1}`, b: `${a * x1} + ${b} = ${v1} €`, c: 'b est ajouté une seule fois : c’est le prix de la carte' });
      return { titre: 'Une formule, pas à pas', consigne: `Un cinéma vend une carte de ${b} € puis ${a} € par séance : P(x) = ${a}x + ${b}. On calcule le prix de ${x1} séances.`,
        support: tabXY('x', 'P (€)', [String(x1)], ['?']) + `<p class="tr-l">Début du calcul : P(${x1}) = ${a} × ${x1} + ${b}</p>` + ln('a', `${a} × ${x1}`, String(a * x1), 14) + ln('b', 'Prix P, en euros', String(v1), 14, '€') + `<p class="tr-l">c. Que représente le nombre ${b} ? (voir la case en dessous)</p>`, items,
        hints: ['Multiplie a par x.', 'Ajoute b au résultat.', 'b est ajouté une seule fois.'] };
    }
    const c = pick(R, [3, 4, 5]), d0 = pick(R, [2, 4, 6]), y1 = c * x1, g1 = d0 * x1 + 9, xx = pick(R, [4, 6, 8]), tg = d0 * xx + 9;
    const items = [num('a', y1, 0, String(y1)), num('b', g1, 0, String(g1), [{ v: d0 * (x1 + 9), m: 'Tu as additionné avant de multiplier.' }]), num('c', xx, 0, String(xx), [{ v: rnd(tg / d0, 2), m: 'Tu as divisé sans retirer 9. Retire 9 d’abord.' }]), qcm('d', ['f', 'g'], 0, 'f')];
    xs(items, { a: `f(${x1}) = ${c} × ${x1} = ${y1}`, b: `g(${x1}) = ${d0} × ${x1} + 9 = ${g1}`, c: `${d0}x + 9 = ${tg} donne ${d0}x = ${tg - 9}, puis x = ${xx}`, d: 'f(x) = c × x n’a pas de nombre ajouté : elle est linéaire' });
    return { titre: 'Linéaire ou affine ?', consigne: `Deux formules : f(x) = ${c}x et g(x) = ${d0}x + 9. Calcule, résous, puis classe-les.`,
      support: table(['Fonction', 'Formule'], [['f', `${c} × x`], ['g', `${d0} × x + 9`]]) + ln('a', `f(${x1})`, String(y1), 14) + ln('b', `g(${x1})`, String(g1), 14) + `<p class="tr-l">On sait que g(x) = ${tg}.</p>` + ln('c', 'x', String(xx), 14) + `<p class="tr-l">d. Laquelle est linéaire : f ou g ? (voir la case en dessous)</p>`, items,
      hints: ['Remplace x par la valeur dans chaque formule.', 'Multiplie avant d’additionner.', 'Retire 9, puis divise.', 'Une fonction linéaire n’a pas de nombre ajouté.'] };
  });

  /* e2 · lire une droite avec des lignes de lecture */
  const droite = (lines, o = {}) => {
    const g = P.plot({ W: 360, H: 220, x: [0, o.x1, 1], y: [0, o.y1, o.dy], ml: 36, mr: 26, mt: 16, mb: 34, fs: 10.5, lx: 1, ly: o.ly || 1, xl: o.xl || 'x', yl: o.yl || 'f(x)', lab: o.lab || 'La droite d’une fonction avec des lignes de lecture' });
    let b = g.base;
    lines.forEach(l => { b += g.line(l.a, l.b, { stroke: l.col || '#1D2240', w: 3 }); });
    if (o.pts) b += g.pts(o.pts, { r: 4 });
    lines.forEach(l => { if (l.lab) b += gt(g.X(o.x1) + 6, g.Y(l.a * o.x1 + l.b) + (l.dy || 4), l.lab, l.col || '#1D2240', 'start', 13); });
    if (o.inter) b += `<circle cx="${g.X(o.inter[0]).toFixed(1)}" cy="${g.Y(o.inter[1]).toFixed(1)}" r="5.5" fill="#fff" stroke="#1D2240" stroke-width="2.4"/>`;
    return g.wrap(b).replace('<svg ', SM);
  };
  lv('c7e2', (R, niv) => {
    if (niv === 0) {
      const a = pick(R, [1, 2, 3]), b = pick(R, [1, 2, 3, 4]), x1 = pick(R, [2, 3, 4]), y2 = a * pick(R, [3, 4, 5]) + b, x2 = (y2 - b) / a, y1 = Math.max(8, Math.ceil((5 * a + b + 1) / 2) * 2), dy = y1 <= 12 ? 1 : 2;
      const items = [num('a', a * x1 + b, 0, String(a * x1 + b), [{ v: x1, m: 'C’est l’abscisse donnée. L’image se lit sur l’axe vertical.' }]), num('b', b, 0, String(b), [{ v: a, m: 'C’est le coefficient a. Le nombre b est l’ordonnée du point où la droite coupe l’axe vertical.' }]), num('c', x2, 0, String(x2), [{ v: y2, m: 'C’est la hauteur donnée. L’antécédent se lit sur l’axe horizontal.' }]), num('d', a, 0, String(a), [{ v: b, m: 'Tu as lu le point de départ. On demande de combien la droite monte quand x augmente de 1.' }])];
      xs(items, { a: `au-dessus de ${x1}, la droite est à ${a * x1 + b}`, b: `la droite coupe l’axe vertical en ${b}`, c: `la ligne horizontale à ${y2} coupe la droite en x = ${x2}`, d: `de x = 0 à x = 1, f(x) passe de ${b} à ${a + b} : + ${a}` });
      return { titre: 'Lire une droite', consigne: 'Trace des lignes de lecture avec ta règle. Lis les valeurs sur la droite, avec leur unité.',
        support: droite([{ a, b }], { x1: 5, y1, dy, ly: y1 <= 12 ? 1 : 1, pts: [0, 1, 2, 3, 4, 5].map(x => [x, a * x + b]) }) + ln('a', `Image de ${x1}`, String(a * x1 + b), 14) + ln('b', 'Valeur où la droite coupe l’axe vertical', String(b), 14) + ln('c', `Antécédent de ${y2}`, String(x2), 14) + ln('d', 'De combien monte f(x) quand x augmente de 1', String(a), 14), items,
        hints: ['Pars de x sur l’axe horizontal, monte jusqu’à la droite.', 'Regarde où la droite touche l’axe vertical.', 'Pars de la hauteur sur l’axe vertical, va jusqu’à la droite, descends.', 'Compare f(0) et f(1).'] };
    }
    if (niv < 0) {
      const a = pick(R, [2, 3, 4]), x3 = pick(R, [2, 3]), y1 = a * 5 + 2, dy = 2, yM = Math.ceil(y1 / 2) * 2;
      const items = [num('a', a, 0, String(a), [{ v: 0, m: 'C’est f(0). Lis f(1), au-dessus de 1.' }]), num('b', a * x3, 0, String(a * x3), [{ v: x3, m: 'C’est l’abscisse donnée. L’image se lit sur l’axe vertical.' }]), qcm('c', ['oui', 'non'], 0, 'oui')];
      xs(items, { a: `au-dessus de 1, la droite est à ${a}`, b: `au-dessus de ${x3}, la droite est à ${a * x3}`, c: 'f(0) = 0 : la droite passe par l’origine' });
      return { titre: 'Une droite, pas à pas', consigne: 'Cette droite est celle d’une fonction linéaire. Les points sont marqués pour chaque valeur entière de x.',
        support: droite([{ a, b: 0 }], { x1: 5, y1: yM, dy, ly: 1, pts: [0, 1, 2, 3, 4, 5].map(x => [x, a * x]) }) + `<p class="tr-l">Début du calcul : au-dessus de 1, je lis la droite.</p>` + ln('a', 'Image de 1', String(a), 14) + ln('b', `Image de ${x3}`, String(a * x3), 14) + `<p class="tr-l">c. La droite passe-t-elle par l’origine ? (voir la case en dessous)</p>`, items,
        hints: ['Pars de 1 sur l’axe horizontal.', 'Même méthode avec la deuxième valeur.', 'Regarde le point (0 ; 0).'] };
    }
    const xs0 = pick(R, [3, 4, 5]), dd = pick(R, [2, 3, 4]), q = 10 - dd, r = dd * xs0, pr = 10 * xs0;
    const items = [num('a', xs0, 0, String(xs0), [{ v: pr, m: 'C’est le prix. Le nombre de séances se lit sur l’axe horizontal.' }]), num('b', pr, 0, String(pr), [{ v: xs0, m: 'C’est le nombre de séances. Le prix se lit sur l’axe vertical.' }]), qcm('c', ['A', 'B'], 0, 'A'), qcm('d', ['A', 'B'], 1, 'B')];
    xs(items, { a: `les deux droites se croisent en x = ${xs0}`, b: `à l’intersection, le prix est ${pr} €`, c: `avant ${xs0} séances, la droite A est sous la droite B`, d: `après ${xs0} séances, la droite B est sous la droite A` });
    return { titre: 'Deux droites qui se croisent', consigne: `Formule A : 10 € la séance. Formule B : ${r} € puis ${q} € la séance. L’intersection est marquée par un cercle blanc. Lis les valeurs avec des lignes de lecture.`,
      support: droite([{ a: 10, b: 0, col: BLUE, lab: 'A', dy: 4 }, { a: q, b: r, col: RED, lab: 'B', dy: 16 }], { x1: 8, y1: 80, dy: 10, ly: 1, inter: [xs0, pr], xl: 'nombre de séances x', yl: 'prix en €' }) + ln('a', 'Nombre de séances au croisement', String(xs0), 14) + ln('b', 'Prix au croisement', String(pr), 14, '€') + `<p class="tr-l">c. Avant le croisement, quelle formule est la moins chère ? (voir la case en dessous)</p><p class="tr-l">d. Après le croisement, quelle formule est la moins chère ? (voir la case en dessous)</p>`, items,
      hints: ['Cherche le cercle blanc : lis son abscisse.', 'Lis son ordonnée.', 'Avant, la droite la plus basse est la moins chère.', 'Après, regarde quelle droite est la plus basse.'] };
  });

  /* e3 · comparer deux formules par le calcul */
  lv('c7e3', (R, niv) => {
    const xstar = pick(R, [3, 4, 5, 6]), dd = pick(R, [2, 3, 4]), p = 10, q = p - dd, r = dd * xstar, x1 = pick(R, [1, 2, 3].filter(v => v < xstar)), x2 = xstar + pick(R, [1, 2, 3]);
    const A = x => p * x, B = x => q * x + r;
    if (niv === 0) {
      const items = [num('a', A(x1), 0, String(A(x1))), num('b', B(x1), 0, String(B(x1)), [{ v: q * (x1 + r), m: 'Tu as additionné avant de multiplier.' }]), num('c', xstar, 0, String(xstar), [{ v: r, m: 'Tu as pris le nombre ' + r + '. Il faut le diviser par l’écart des coefficients : ' + r + ' ÷ ' + dd + '.' }]), qcm('d', ['A', 'B'], A(x1) < B(x1) ? 0 : 1, A(x1) < B(x1) ? 'A' : 'B')];
      xs(items, { a: `A(${x1}) = ${p} × ${x1} = ${A(x1)} €`, b: `B(${x1}) = ${q} × ${x1} + ${r} = ${B(x1)} €`, c: `${p}x = ${q}x + ${r} donne ${dd}x = ${r}, puis x = ${xstar}`, d: `${A(x1)} ${A(x1) < B(x1) ? '<' : '>'} ${B(x1)} : ${A(x1) < B(x1) ? 'A' : 'B'} est moins chère` });
      return { titre: 'Deux formules de séances', consigne: `Un cinéma propose la formule A : A(x) = ${p}x, et la formule B : B(x) = ${q}x + ${r}. Compare-les pour ${x1} séance${x1 > 1 ? 's' : ''}.`,
        support: table(['Formule', 'Prix de x séances'], [['A', `${p} × x`], ['B', `${q} × x + ${r}`]]) + ln('a', `Prix de ${x1} séance${x1 > 1 ? 's' : ''} avec A`, String(A(x1)), 14, '€') + ln('b', `Prix de ${x1} séance${x1 > 1 ? 's' : ''} avec B`, String(B(x1)), 14, '€') + ln('c', 'Nombre de séances où les prix sont égaux (résous A = B)', String(xstar), 14) + `<p class="tr-l">d. Pour ${x1} séance${x1 > 1 ? 's' : ''}, quelle formule est la moins chère ? (voir la case en dessous)</p>`, items,
        hints: ['Remplace x par la valeur dans chaque formule.', 'Multiplie avant d’additionner.', 'Écris p x = q x + r, puis retire q x des deux côtés.', 'Compare les deux prix.'] };
    }
    if (niv < 0) {
      const items = [num('a', A(x2), 0, String(A(x2))), num('b', B(x2), 0, String(B(x2)), [{ v: q * x2, m: 'C’est q × x. N’oublie pas d’ajouter ' + r + '.' }]), qcm('c', ['A', 'B'], 1, 'B')];
      xs(items, { a: `A(${x2}) = ${p} × ${x2} = ${A(x2)} €`, b: `B(${x2}) = ${q} × ${x2} + ${r} = ${B(x2)} €`, c: `${B(x2)} < ${A(x2)} : B est moins chère` });
      return { titre: 'Comparer, pas à pas', consigne: `Formule A : A(x) = ${p}x. Formule B : B(x) = ${q}x + ${r}. On compare les prix pour ${x2} séances.`,
        support: table(['Formule', 'Prix de x séances'], [['A', `${p} × x`], ['B', `${q} × x + ${r}`]]) + `<p class="tr-l">Début du calcul : A(${x2}) = ${p} × ${x2}</p>` + ln('a', `Prix avec A`, String(A(x2)), 14, '€') + ln('b', `Prix avec B`, String(B(x2)), 14, '€') + `<p class="tr-l">c. Quelle formule est la moins chère pour ${x2} séances ? (voir la case en dessous)</p>`, items,
        hints: ['Multiplie ' + p + ' par ' + x2 + '.', 'Multiplie ' + q + ' par ' + x2 + ', puis ajoute ' + r + '.', 'Le plus petit prix est le moins cher.'] };
    }
    const Bd = pick(R, [60, 80, 100]) + 3, nA = Math.floor(Bd / p), nB = Math.floor((Bd - r) / q), better = nB > nA ? 'B' : (nA > nB ? 'A' : 'égal');
    const items = [num('a', nA, 0, String(nA), [{ v: rnd(Bd / p, 2), m: 'Le résultat doit être entier : on ne paie pas une séance incomplète.' }]), num('b', nB, 0, String(nB), [{ v: Math.floor(Bd / q), m: 'Tu as oublié de retirer ' + r + ' avant de diviser.' }, { v: rnd((Bd - r) / q, 2), m: 'Le résultat doit être entier : on ne paie pas une séance incomplète.' }]), qcm('c', ['A', 'B', 'autant avec les deux'], better === 'A' ? 0 : (better === 'B' ? 1 : 2), better === 'A' ? 'A' : (better === 'B' ? 'B' : 'autant avec les deux')), num('d', xstar, 0, String(xstar))];
    xs(items, { a: `${Bd} ÷ ${p} = ${fr(rnd(Bd / p, 2))} : ${nA} séances complètes`, b: `(${Bd} − ${r}) ÷ ${q} = ${fr(rnd((Bd - r) / q, 2))} : ${nB} séances complètes`, c: `${nB} ${nB > nA ? '>' : (nB < nA ? '<' : '=')} ${nA}`, d: `${p}x = ${q}x + ${r} donne ${dd}x = ${r}, puis x = ${xstar}` });
    return { titre: 'Un budget, deux formules', consigne: `Formule A : A(x) = ${p}x. Formule B : B(x) = ${q}x + ${r}. Un groupe a un budget de ${Bd} €. On ne paie que des séances entières.`,
      support: table(['Formule', 'Prix de x séances'], [['A', `${p} × x`], ['B', `${q} × x + ${r}`]]) + ln('a', 'Séances complètes avec A', String(nA), 14) + ln('b', 'Séances complètes avec B', String(nB), 14) + `<p class="tr-l">c. Avec quelle formule fait-on le plus de séances ? (voir la case en dessous)</p>` + ln('d', 'Nombre de séances où A et B coûtent pareil', String(xstar), 14), items,
      hints: ['A : divise le budget par ' + p + ' et garde l’entier.', 'B : retire ' + r + ', divise par ' + q + ', garde l’entier.', 'Compare les deux nombres.', 'Résous A = B.'] };
  });
  if (typeof module !== 'undefined') module.exports = {};
  /* ===== exercice ajouté (3 niveaux) : notion 3 (la fonction affine f(x) = a × x + b) ===== */
  {
    const { fr, rnd, pick, int, shuffle, table, tb, svg, T, num, qcm, ln, tabXY, lv, eur, L } = H;
    /* trame d’un exercice : rows { lab, v, d, a, x, err, w, un } ou { lab, qcm, ok, x } ; aide : ligne d’aide du niveau guidé */
    const QC = (titre, consigne, rows, hints, pre = '', aide = '') => {
      const items = rows.map((r, i) => { const k = L[i], d = r.d == null ? 2 : r.d; const it = r.qcm ? qcm(k, r.qcm, r.ok, r.a) : num(k, r.v, d, r.a != null ? r.a : (Number.isInteger(rnd(r.v, d)) ? fr(r.v, 0) : d === 2 ? fr(r.v, 2) : fr(rnd(r.v, d))), r.err || []); if (r.x) it.x = r.x; return it; });
      return { titre, consigne, support: pre + (aide ? `<p class="tr-l">Aide : ${aide}</p>` : '') + rows.map((r, i) => r.qcm ? `<p class="tr-l">${L[i]}. ${r.lab}</p>` : ln(L[i], r.lab, items[i].a, r.w || 14, r.un || '')).join(''), items, hints };
    };
    lv('c7e4', (R, niv) => {
      const a = niv < 0 ? pick(R, [2, 3, 4, 5]) : niv === 0 ? pick(R, [1.5, 2.5, 3, 4.5]) : pick(R, [-2, -3, -1.5, -4]), b = niv < 0 ? pick(R, [1, 2, 3, 5, 10]) : niv === 0 ? pick(R, [2.5, 4, 6, 8]) : pick(R, [20, 30, 36, 50]);
      const f = x => a * x + b, X = [0, 1, 2, 3], x0 = pick(R, [5, 6, 8, 10]), xs = pick(R, niv > 0 ? [4, 5, 6, 8] : [3, 4, 5, 6, 8]), ys = f(xs), neg = a < 0;
      const rows = [
        { lab: 'La valeur de b, c’est f(0)', v: b, d: 2, w: 12, x: `Pour x = 0, f(0) = a × 0 + b = b : on lit b = ${fr(b)} dans le tableau.` },
        { lab: 'Le coefficient a = f(1) − f(0)', v: a, d: 2, w: 12, x: `f(1) − f(0) = ${fr(f(1))} − ${fr(f(0))} = ${fr(a)}`, err: [{ v: -a, m: 'Soustrais dans le bon ordre : f(1) − f(0).' }] },
        { lab: `f(${x0})`, v: f(x0), d: 2, w: 12, x: `f(${x0}) = ${fr(a)} × ${x0} + ${fr(b)} = ${fr(a * x0)} + ${fr(b)} = ${fr(f(x0))}`, err: [{ v: rnd(a * x0, 2), m: 'N’oublie pas d’ajouter b.' }] },
        { lab: `Antécédent de ${fr(ys)} : on résout ${fr(a)} × x + ${fr(b)} = ${fr(ys)}`, v: xs, d: 2, w: 12, x: `${fr(a)} × x = ${fr(ys)} − ${fr(b)} = ${fr(ys - b)} donc x = ${fr(ys - b)} ÷ ${fr(a)} = ${fr(xs)}`, err: [{ v: rnd((ys + b) / a, 2), m: 'On commence par soustraire b des deux côtés.' }] }];
      if (niv > 0) rows.push({ lab: 'La droite de f est…', qcm: ['croissante', 'décroissante'], ok: neg ? 1 : 0, x: neg ? `a = ${fr(a)} est négatif : la droite descend, f est décroissante.` : 'a est positif : la droite monte.' });
      return QC(niv < 0 ? 'La fonction affine, pas à pas' : niv > 0 ? 'Fonction affine décroissante' : 'La fonction affine f(x) = a × x + b', `On donne la fonction affine f(x) = a × x + b par un tableau de valeurs${niv > 0 ? ' (une cuve qui se vide)' : ''}.`, rows,
        ['f(0) = b : lis-le dans le tableau.', 'a = f(1) − f(0) : l’écart quand x augmente de 1.', 'Pour un antécédent, résous l’équation a × x + b = y.'], tabXY('x', 'f(x)', X, X.map(x => fr(f(x)))), niv < 0 ? 'b est la valeur pour x = 0 ; a est l’écart entre deux valeurs qui se suivent.' : '');
    });
  }
})(typeof module !== 'undefined' ? module.exports : window);
