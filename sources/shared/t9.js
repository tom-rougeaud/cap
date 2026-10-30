/* CAP Maths · chapitre 9 — Périmètres, aires et volumes : rectangle, triangle, disque, pavé, cylindre, conversions, carrelage.
   Chaque exercice « Je m’entraîne » existe en trois niveaux : courant (id), 🌱 guidé (id + 'a'), 🚀 défi (id + 'd'). Toutes les réponses sont calculées. */
(function (root) {
  'use strict';
  const { DEP, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, T, svg, table, num, qcm, pick, int, xs, lv, shuffle, rnd, ln } = H;
  const PI = Math.PI;
  const SM = '<svg style="max-width:108mm;height:auto" ';
  const RED = '#C2332A';
  const ent = (k, v, a, err = [], x) => ({ k, v, tol: .001, a, err: err.filter(e => Number.isFinite(e.v) && Math.abs(e.v - v) > .001), ...(x ? { x } : {}) });
  const dl = (x1, y1, x2, y2, o = {}) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${o.c || '#1D2240'}" stroke-width="${o.w || 1.6}" fill="none"${o.d ? ` stroke-dasharray="${o.d}"` : ''}/>`;

  /* rectangle L × l, avec contour rouge en pointillés (périmètre) ou disque de rayon r (bassin) */
  const rectFig = (L, l, o = {}) => {
    const sc = Math.min(230 / L, 100 / l), w = rnd(L * sc, 1), h = rnd(l * sc, 1), x0 = 62, y0 = 34;
    let b = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="4" class="k2 ks" stroke-width="2.2"/>`;
    if (o.contour) b += `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="4" fill="none" stroke="${RED}" stroke-width="4" stroke-dasharray="9 6"/>`;
    b += T(x0 + w / 2, y0 - 10, `${fr(L)} m`, { fs: 13 }) + T(x0 - 8, y0 + h / 2 + 4, `${fr(l)} m`, { fs: 13, a: 'end' });
    if (o.r) { const cx = x0 + w / 2, cy = y0 + h / 2, rp = o.r * sc; b += `<circle cx="${rnd(cx, 1)}" cy="${rnd(cy, 1)}" r="${rnd(rp, 1)}" class="wh ks" stroke-width="2"/>` + dl(cx, cy, cx + rp, cy, { c: RED, w: 3 }) + dl(cx + rp, cy, x0 + w + 6, cy, { w: 1.2, d: '3 3' }) + T(x0 + w + 10, cy + 4, `r = ${fr(o.r)} m`, { fs: 13, a: 'start' }); }
    return svg(360, y0 + h + 16, b, `Un rectangle de ${fr(L)} mètres sur ${fr(l)} mètres` + (o.r ? ` contenant un bassin rond de rayon ${fr(o.r)} mètres` : '')).replace('<svg ', SM);
  };
  /* triangle de base b et de hauteur h (hauteur en pointillés rouges, angle droit marqué, cote à gauche) */
  const triFig = (b, h) => {
    const sc = Math.min(200 / b, 90 / h), bw = rnd(b * sc, 1), hh = rnd(h * sc, 1), xA = 96, yT = 28, yB = yT + hh, xp = rnd(xA + bw * .4, 1);
    const body = `<path d="M${xA} ${yB}L${rnd(xA + bw, 1)} ${yB}L${xp} ${yT}Z" class="k2 ks" stroke-width="2.2"/>` + dl(xp, yT, xp, yB, { c: RED, w: 3, d: '7 5' }) + `<path d="M${xp} ${yB - 9}h9v9" fill="none" stroke="#1D2240" stroke-width="1.6"/>`
      + dl(76, yT, 76, yB, { w: 1.6 }) + dl(71, yT, 81, yT, { w: 1.6 }) + dl(71, yB, 81, yB, { w: 1.6 }) + dl(81, yT, xp, yT, { w: 1.2, d: '3 3' }) + T(68, (yT + yB) / 2 + 4, `h = ${fr(h)} m`, { fs: 13, a: 'end' }) + T(xA + bw / 2, yB + 19, `b = ${fr(b)} m`, { fs: 13 });
    return svg(360, yB + 28, body, `Un triangle de base ${fr(b)} mètres et de hauteur ${fr(h)} mètres`).replace('<svg ', SM);
  };
  /* pavé droit L × l × h (cm) */
  const pavFig = (a, b, c) => svg(360, 150, `<path d="M90 50L120 26H260L230 50Z" class="k2 ks" stroke-width="2"/><path d="M230 50L260 26V96L230 120Z" class="k2 ks" stroke-width="2"/><rect x="90" y="50" width="140" height="70" class="k2 ks" stroke-width="2.2"/>`
    + T(160, 141, `L = ${fr(a)} cm`, { fs: 13 }) + T(82, 89, `h = ${fr(c)} cm`, { fs: 13, a: 'end' }) + T(268, 112, `l = ${fr(b)} cm`, { fs: 13, a: 'start' }), `Un pavé de ${fr(a)} centimètres de long, ${fr(b)} de large et ${fr(c)} de haut`).replace('<svg ', SM);
  /* cylindre de rayon r et de hauteur h (cm) */
  const cylFig = (r, h) => { const cx = 190, rp = 44;
    return svg(360, 125, `<path d="M${cx - rp} 30V100a${rp} 11 0 0 0 ${2 * rp} 0V30" class="k2 ks" stroke-width="2"/><ellipse cx="${cx}" cy="30" rx="${rp}" ry="11" class="k2 ks" stroke-width="2"/>` + dl(cx, 30, cx + rp, 30, { c: RED, w: 3 }) + T(cx + rp + 10, 34, `r = ${fr(r)} cm`, { fs: 13, a: 'start' })
      + dl(110, 30, 110, 100) + dl(105, 30, 115, 30) + dl(105, 100, 115, 100) + dl(115, 30, cx - rp, 30, { w: 1.2, d: '3 3' }) + dl(115, 100, cx - rp, 100, { w: 1.2, d: '3 3' }) + T(102, 69, `h = ${fr(h)} cm`, { fs: 13, a: 'end' }), `Un cylindre de rayon ${fr(r)} centimètres et de hauteur ${fr(h)} centimètres`).replace('<svg ', SM); };

  DEP.c9 = R => {
    const TER = [['A', 20, 12], ['B', 30, 15], ['C', 40, 20], ['D', 25, 10]];
    const k = int(R, 0, 3), j = (k + 1 + int(R, 0, 2)) % 4, m = (j + 1 + int(R, 0, 2)) % 4, V = pick(R, [[2, 3, 4], [3, 2, 5], [4, 5, 2]]);
    const doc = `<table class="dt tcx dt-sm"><thead><tr><th>Terrain (fictif)</th><th>Longueur (m)</th><th>Largeur (m)</th></tr></thead><tbody>${TER.map((x, i) => `<tr><th>${x[0]}</th><td data-cell="${i + 1}">${x[1]}</td><td>${x[2]}</td></tr>`).join('')}</tbody></table><p class="tr-l">Les terrains sont des rectangles.</p>`;
    const ch = shuffle(R, ['m', 'm²', 'm³']);
    const P = 2 * (TER[j][1] + TER[j][2]), A = TER[m][1] * TER[m][2], v = V[0] * V[1] * V[2];
    return { titre: 'Des terrains rectangulaires', doc,
      qs: [{ t: `Quelle est la longueur du terrain ${TER[k][0]}, en mètres ?`, kind: 'tap', cell: String(k + 1), v: TER[k][1], tol: .001, a: String(TER[k][1]) },
        { t: `Calcule le périmètre du terrain ${TER[j][0]}, en mètres.`, kind: 'num', v: P, tol: .001, a: String(P), x: `2 × (${TER[j][1]} + ${TER[j][2]}) = ${P}` },
        { t: `Calcule l’aire du terrain ${TER[m][0]}, en mètres carrés.`, kind: 'num', v: A, tol: .001, a: String(A), x: `${TER[m][1]} × ${TER[m][2]} = ${A}` },
        { t: 'Une aire s’exprime en :', kind: 'qcm', choices: ch, ok: ch.indexOf('m²'), a: 'm²', x: 'une aire mesure une surface : elle s’exprime en m²' },
        { t: `Un bac (fictif) est un pavé de ${V[0]} m, ${V[1]} m et ${V[2]} m. Calcule son volume, en mètres cubes.`, kind: 'num', v, tol: .001, a: String(v), x: `${V[0]} × ${V[1]} × ${V[2]} = ${v}` }] };
  };

  /* e1 · périmètre et aire */
  lv('c9e1', (R, niv) => {
    if (niv === 0) {
      const L = pick(R, [8, 10, 12, 15, 20, 25]), l = pick(R, [4, 5, 6, 8]), b = pick(R, [6, 8, 10, 12]), h = pick(R, [3, 4, 5]), P = 2 * (L + l), A = L * l, At = b * h / 2;
      const items = [num('a', P, 0, String(P), [{ v: A, m: 'C’est l’aire. Le périmètre est le tour de la figure : 2 × (L + l).' }, { v: L + l, m: 'C’est seulement L + l. Le périmètre est le double : 2 × (L + l).' }]), num('b', A, 0, String(A), [{ v: P, m: 'C’est le périmètre. L’aire est le produit : L × l.' }]), num('c', At, 0, String(At), [{ v: b * h, m: 'Tu as oublié de diviser par 2. L’aire d’un triangle est b × h ÷ 2.' }]), qcm('d', ['m', 'm²', 'm³'], 1, 'm²')];
      xs(items, { a: `P = 2 × (${L} + ${l}) = 2 × ${L + l} = ${P} m`, b: `A = ${L} × ${l} = ${A} m²`, c: `A = ${b} × ${h} ÷ 2 = ${b * h} ÷ 2 = ${At} m²`, d: 'une aire mesure une surface : on l’écrit en m²' });
      return { titre: 'Un terrain et un fronton', consigne: 'Un terrain (fictif) est un rectangle. Un fronton (fictif) est un triangle. Les mesures sont sur les figures.',
        support: rectFig(L, l, { contour: 1 }) + triFig(b, h) + ln('a', 'Périmètre du terrain', String(P), 14, 'm') + ln('b', 'Aire du terrain', String(A), 14, 'm²') + ln('c', 'Aire du fronton', String(At), 14, 'm²') + `<p class="tr-l">d. L’aire s’exprime en : (voir la case en dessous)</p>`, items,
        hints: ['P = 2 × (L + l).', 'A = L × l.', 'A = b × h ÷ 2.', 'Une surface se mesure en m².'] };
    }
    if (niv < 0) {
      const L = pick(R, [8, 10, 12, 15]), l = pick(R, [4, 5, 6]), P = 2 * (L + l), A = L * l;
      const items = [num('a', L + l, 0, String(L + l), [{ v: A, m: 'C’est le produit. Ici, on additionne la longueur et la largeur.' }]), num('b', P, 0, String(P), [{ v: L + l, m: 'C’est seulement L + l. Multiplie par 2.' }]), num('c', A, 0, String(A), [{ v: P, m: 'C’est le périmètre. L’aire est le produit L × l.' }]), qcm('d', ['m', 'm²'], 0, 'm')];
      xs(items, { a: `${L} + ${l} = ${L + l}`, b: `2 × ${L + l} = ${P} m`, c: `${L} × ${l} = ${A} m²`, d: 'un périmètre est une longueur : on l’écrit en m' });
      return { titre: 'Périmètre et aire, pas à pas', consigne: 'Un terrain (fictif) est un rectangle. Les mesures sont sur la figure.',
        support: rectFig(L, l, { contour: 1 }) + `<p class="tr-l">Début du calcul : P = 2 × (${L} + ${l})</p>` + ln('a', `${L} + ${l}`, String(L + l), 14, 'm') + ln('b', 'Périmètre', String(P), 14, 'm') + ln('c', 'Aire (L × l)', String(A), 14, 'm²') + `<p class="tr-l">d. Le périmètre s’écrit en : (voir la case en dessous)</p>`, items,
        hints: ['Additionne la longueur et la largeur.', 'Multiplie par 2.', 'Multiplie la longueur par la largeur.', 'Le périmètre est une longueur.'] };
    }
    const L = pick(R, [10, 12, 15]), l = pick(R, [8, 10]), r = pick(R, [1, 2, 3]), A = L * l, B = rnd(PI * r * r, 1), G = rnd(A - PI * r * r, 1);
    const items = [num('a', A, 0, String(A), [{ v: 2 * (L + l), m: 'C’est le périmètre. L’aire est le produit L × l.' }]), num('b', B, 1, fr(B, 1), [{ v: rnd(2 * PI * r, 1), m: 'C’est le périmètre du cercle. L’aire du disque est π × r².' }, { v: rnd(PI * r, 1), m: 'Tu as oublié le carré : π × r × r.' }]), num('c', G, 1, fr(G, 1), [{ v: A, m: 'C’est l’aire du jardin. Retire l’aire du bassin.' }, { v: rnd(A + PI * r * r, 1), m: 'Tu as additionné. Le bassin n’est pas du gazon : on le retire.' }]), qcm('d', ['aire du jardin − aire du bassin', 'aire du jardin + aire du bassin'], 0, 'aire du jardin − aire du bassin')];
    xs(items, { a: `${L} × ${l} = ${A} m²`, b: `π × ${r}² = π × ${r * r} ≈ ${fr(B, 1)} m²`, c: `${A} − ${fr(PI * r * r, 2)} ≈ ${fr(G, 1)} m²`, d: 'le gazon est le jardin privé du bassin : on soustrait' });
    return { titre: 'Un jardin avec un bassin rond', consigne: 'Un jardin (fictif) est un rectangle. Au centre, un bassin rond (fictif) de rayon r. Arrondis au dixième.',
      support: rectFig(L, l, { r }) + ln('a', 'Aire du jardin', String(A), 14, 'm²') + ln('b', 'Aire du bassin (π × r²)', fr(B, 1), 14, 'm²') + ln('c', 'Aire du gazon', fr(G, 1), 14, 'm²') + `<p class="tr-l">d. L’aire du gazon se calcule par : (voir la case en dessous)</p>`, items,
      hints: ['A = L × l.', 'A = π × r × r.', 'Aire du jardin moins aire du bassin.', 'Le gazon n’est pas sous l’eau.'] };
  });

  /* e2 · volumes */
  lv('c9e2', (R, niv) => {
    if (niv === 0) {
      const a = pick(R, [20, 30, 40]), b = pick(R, [10, 20]), c = pick(R, [5, 10, 15]), r = pick(R, [2, 3, 4, 5]), h = pick(R, [5, 8, 10, 12]), V = a * b * c, Vc = rnd(PI * r * r * h, 0);
      const items = [num('a', V, 0, String(V), [{ v: a * b, m: 'C’est l’aire de la base. Multiplie encore par la hauteur.' }]), num('b', V / 1000, 1, fr(V / 1000, 1), [{ v: V, m: 'C’est le volume en cm³. Pour passer en litres, divise par 1 000.' }]), num('c', Vc, 0, fr(Vc, 0), [{ v: rnd(PI * r * h, 0), m: 'Tu as oublié de mettre le rayon au carré : r² = r × r.' }, { v: rnd(PI * 4 * r * r * h, 0), m: 'Tu as utilisé le diamètre à la place du rayon.' }]), qcm('d', ['cm', 'cm²', 'cm³'], 2, 'cm³')];
      xs(items, { a: `V = ${a} × ${b} × ${c} = ${V} cm³`, b: `${V} ÷ 1 000 = ${fr(V / 1000, 1)} L`, c: `V = π × ${r}² × ${h} = π × ${r * r * h} ≈ ${fr(Vc, 0)} cm³`, d: 'un volume mesure l’espace occupé : on l’écrit en cm³' });
      return { titre: 'Un bac et un gobelet', consigne: 'Un bac (fictif) est un pavé. Un gobelet (fictif) est un cylindre. Les mesures sont sur les figures. Arrondis le volume du cylindre à l’unité.',
        support: pavFig(a, b, c) + cylFig(r, h) + ln('a', 'Volume du bac', String(V), 14, 'cm³') + ln('b', 'Volume du bac en litres (1 L = 1 000 cm³)', fr(V / 1000, 1), 14, 'L') + ln('c', 'Volume du gobelet', fr(Vc, 0), 14, 'cm³') + `<p class="tr-l">d. Un volume s’exprime en : (voir la case en dessous)</p>`, items,
        hints: ['V = L × l × h.', 'Divise par 1 000.', 'V = π × r × r × h.', 'Un volume est l’espace occupé.'] };
    }
    if (niv < 0) {
      const a = pick(R, [20, 30, 40]), b = pick(R, [10, 20]), c = pick(R, [5, 10]), B = a * b, V = a * b * c;
      const items = [num('a', B, 0, String(B), [{ v: V, m: 'C’est le volume. Ici, multiplie seulement L et l.' }]), num('b', V, 0, String(V), [{ v: B, m: 'C’est l’aire de la base. Multiplie-la par la hauteur.' }]), qcm('c', ['cm', 'cm²', 'cm³'], 2, 'cm³')];
      xs(items, { a: `${a} × ${b} = ${B} cm²`, b: `${B} × ${c} = ${V} cm³`, c: 'un volume s’exprime en cm³' });
      return { titre: 'Le volume d’un pavé, pas à pas', consigne: 'Un bac (fictif) est un pavé. Les mesures sont sur la figure.',
        support: pavFig(a, b, c) + `<p class="tr-l">Début du calcul : V = ${a} × ${b} × ${c}</p>` + ln('a', `Aire de la base (${a} × ${b})`, String(B), 14, 'cm²') + ln('b', 'Volume', String(V), 14, 'cm³') + `<p class="tr-l">c. Le volume s’exprime en : (voir la case en dessous)</p>`, items,
        hints: ['Multiplie la longueur par la largeur.', 'Multiplie le résultat par la hauteur.', 'Un volume est l’espace occupé.'] };
    }
    const r = pick(R, [3, 4, 5]), h = pick(R, [8, 10, 12]), N = pick(R, [2, 3]), V = PI * r * r * h, Vr = rnd(V, 0), n = Math.floor(N * 1000 / V), hh = rnd(500 / (PI * r * r), 1);
    const items = [num('a', Vr, 0, fr(Vr, 0), [{ v: rnd(PI * r * h, 0), m: 'Tu as oublié le carré du rayon : r × r.' }]), ent('b', n, String(n), [{ v: rnd(N * 1000 / V, 1), m: 'On ne peut remplir que des gobelets entiers : garde la partie entière.' }, { v: Math.round(N * 1000 / V), m: 'On arrondit à l’entier inférieur : un gobelet incomplet ne compte pas.' }]), num('c', hh, 1, fr(hh, 1), [{ v: rnd(500 / (PI * r), 1), m: 'Tu as divisé par r au lieu de r × r.' }]), qcm('d', ['2', '4', '8'], 1, '4')];
    xs(items, { a: `V = π × ${r}² × ${h} = π × ${r * r * h} ≈ ${fr(Vr, 0)} cm³`, b: `${N * 1000} ÷ ${fr(V, 1)} ≈ ${fr(N * 1000 / V, 1)} : ${n} gobelets entiers`, c: `h = 500 ÷ (π × ${r * r}) ≈ ${fr(hh, 1)} cm`, d: 'le rayon est au carré : 2² = 4' });
    return { titre: 'Le gobelet dans les deux sens', consigne: `Un gobelet (fictif) est un cylindre. Une bouteille contient ${N} L, soit ${fr(N * 1000)} cm³ (1 mL = 1 cm³).`,
      support: cylFig(r, h) + ln('a', 'Volume du gobelet (arrondi à l’unité)', fr(Vr, 0), 14, 'cm³') + ln('b', `Gobelets pleins avec ${N} L`, String(n), 14) + `<p class="tr-l">On veut un gobelet de 500 mL avec le même rayon.</p>` + ln('c', 'Hauteur (arrondie au dixième)', fr(hh, 1), 14, 'cm') + `<p class="tr-l">d. Si le rayon double et la hauteur ne change pas, le volume est multiplié par : (voir la case en dessous)</p>`, items,
      hints: ['V = π × r × r × h.', 'Divise le volume de la bouteille par celui du gobelet, garde la partie entière.', 'h = 500 ÷ (π × r × r).', 'Le rayon est au carré dans la formule.'] };
  });

  /* e3 · conversions et carrelage */
  const CARRE = [[4, 3.5, 50], [6, 4, 50], [5, 4, 50], [4, 2.5, 50], [4, 4, 40], [6, 4, 40], [5, 4, 40], [4, 3, 20], [5, 4, 20], [3, 3, 30], [6, 3, 30]];
  lv('c9e3', (R, niv) => {
    const pcFig = (L, l, c) => {
      const sc = Math.min(38, 230 / L, 100 / l), w = rnd(L * sc, 1), h = rnd(l * sc, 1), p = c / 100 * sc;
      let g = '';
      for (let i = 1; i * p < w - .5; i++) g += `<path d="M${rnd(62 + i * p, 1)} 34V${rnd(34 + h, 1)}" stroke="#1D2240" stroke-width=".8" stroke-opacity=".4" fill="none"/>`;
      for (let j = 1; j * p < h - .5; j++) g += `<path d="M62 ${rnd(34 + j * p, 1)}H${rnd(62 + w, 1)}" stroke="#1D2240" stroke-width=".8" stroke-opacity=".4" fill="none"/>`;
      return svg(360, rnd(34 + h + 32, 0), `<rect x="62" y="34" width="${w}" height="${h}" rx="3" class="k2 ks" stroke-width="2.2"/>${g}` + T(62 + w / 2, 24, `${fr(L)} m`, { fs: 13 }) + T(54, 34 + h / 2 + 4, `${fr(l)} m`, { fs: 13, a: 'end' }) + T(62 + w / 2, 34 + h + 21, `carreaux de ${c} cm de côté`, { fs: 13, c: 'ts' }), `Une pièce de ${fr(L)} mètres sur ${fr(l)} mètres carrelée avec des carreaux de ${c} centimètres de côté`).replace('<svg ', SM);
    };
    if (niv < 0) {
      const [L, l, c] = pick(R, CARRE), A = rnd(L * l, 2), q = rnd(c * c / 10000, 2), n = Math.round(A / q);
      const items = [num('a', A, 2, fr(A, 2), [{ v: rnd(2 * (L + l), 2), m: 'C’est le périmètre. L’aire est le produit L × l.' }]), num('b', q, 2, fr(q, 2), [{ v: c * c, m: 'C’est l’aire en cm². Divise par 10 000 pour passer en m².' }, { v: rnd(c / 100, 2), m: 'C’est le côté en m. L’aire est le côté multiplié par lui-même.' }]), ent('c', n, String(n), [{ v: rnd(A / (c / 100), 1), m: 'Tu as divisé par le côté. Divise l’aire de la pièce par l’aire d’un carreau.' }]), qcm('d', ['100', '10 000'], 1, '10 000')];
      xs(items, { a: `${fr(L)} × ${fr(l)} = ${fr(A, 2)} m²`, b: `${c} cm = ${fr(c / 100, 2)} m ; ${fr(c / 100, 2)} × ${fr(c / 100, 2)} = ${fr(q, 2)} m²`, c: `${fr(A, 2)} ÷ ${fr(q, 2)} = ${n}`, d: '1 m² = 10 000 cm²' });
      return { titre: 'Le carrelage, pas à pas', consigne: 'Un carreleur pose du carrelage dans une pièce (fictive) rectangulaire. Les mesures sont sur la figure.',
        support: pcFig(L, l, c) + ln('a', 'Aire de la pièce', fr(A, 2), 14, 'm²') + ln('b', `Aire d’un carreau (${c} cm = ${fr(c / 100, 2)} m)`, fr(q, 2), 14, 'm²') + ln('c', 'Nombre de carreaux', String(n), 14) + `<p class="tr-l">d. Pour passer de cm² à m², on divise par : (voir la case en dessous)</p>`, items,
        hints: ['Multiplie la longueur par la largeur.', 'Convertis le côté en mètres, puis multiplie-le par lui-même.', 'Divise l’aire de la pièce par l’aire d’un carreau.', '1 m = 100 cm, donc 1 m² = 100 × 100 cm².'] };
    }
    if (niv === 0) {
      const L = pick(R, [3, 4, 5, 6]), l = pick(R, [3, 3.5, 4]), c = pick(R, [30, 40, 50]), A = rnd(L * l, 2), q = rnd(c * c / 10000, 2), n = Math.ceil(Math.round(L * l * 10000) / (c * c) - 1e-9), n10 = Math.ceil(n * 11 / 10 - 1e-9);
      const items = [num('a', A, 2, fr(A, 2), [{ v: rnd(2 * (L + l), 2), m: 'C’est le périmètre. L’aire est le produit L × l.' }]), num('b', q, 2, fr(q, 2), [{ v: c * c, m: 'C’est l’aire en cm². Divise par 10 000 pour passer en m².' }]), ent('c', n, String(n), [{ v: rnd(A / q, 1), m: 'Le nombre de carreaux est un entier : arrondis au nombre entier supérieur.' }, { v: Math.floor(A / q + 1e-9), m: 'Un carreau incomplet est nécessaire : arrondis au nombre entier supérieur.' }]), ent('d', n10, String(n10), [{ v: rnd(n * 1.1, 1), m: 'Arrondis au nombre entier supérieur : on ne peut pas acheter une fraction de carreau.' }, { v: n + 10, m: 'Les chutes sont 10 % de ' + n + ', pas 10 carreaux.' }])];
      xs(items, { a: `${fr(L)} × ${fr(l)} = ${fr(A, 2)} m²`, b: `${fr(c / 100, 2)} × ${fr(c / 100, 2)} = ${fr(q, 2)} m²`, c: `${fr(A, 2)} ÷ ${fr(q, 2)} = ${fr(A / q, 1)}, arrondi au supérieur : ${n}`, d: `${n} × 1,10 = ${fr(n * 1.1, 1)}, arrondi au supérieur : ${n10}` });
      return { titre: 'Combien de carreaux ?', consigne: 'Un carreleur pose du carrelage dans une pièce (fictive) rectangulaire. Il prévoit 10 % de chutes. Arrondis au nombre entier supérieur.',
        support: pcFig(L, l, c) + ln('a', 'Aire de la pièce', fr(A, 2), 14, 'm²') + ln('b', 'Aire d’un carreau', fr(q, 2), 14, 'm²') + ln('c', 'Nombre de carreaux sans chutes', String(n), 14) + ln('d', 'Nombre de carreaux avec 10 % de chutes', String(n10), 14), items,
        hints: ['Longueur × largeur.', 'Convertis le côté en m, puis multiplie-le par lui-même.', 'Divise l’aire de la pièce par l’aire d’un carreau, puis arrondis au supérieur.', 'Multiplie par 1,10 et arrondis au supérieur.'] };
    }
    const L = pick(R, [3, 4, 5, 6]), l = pick(R, [3, 3.5, 4]), c = pick(R, [30, 40, 50]), k = pick(R, [6, 8, 10, 12]), p = pick(R, [24, 30, 36, 45]), Acm = Math.round(L * l * 10000), n = Math.ceil(Acm / (c * c) - 1e-9), n10 = Math.ceil(n * 11 / 10 - 1e-9), bx = Math.ceil(n10 / k - 1e-9), cost = bx * p;
    const items = [ent('a', Acm, String(Acm), [{ v: rnd(L * l, 2), m: 'C’est l’aire en m². Pour passer en cm², multiplie par 10 000.' }, { v: rnd(L * l * 100, 0), m: 'Tu as multiplié par 100. Pour une aire, 1 m² = 10 000 cm².' }]), ent('b', n10, String(n10), [{ v: n, m: 'Tu as oublié les 10 % de chutes : multiplie par 1,10.' }]), ent('c', bx, String(bx), [{ v: rnd(n10 / k, 1), m: 'On ne peut commander que des boîtes entières : arrondis au nombre entier supérieur.' }]), ent('d', cost, String(cost), [{ v: n10 * p, m: 'Le prix est celui d’une boîte, pas d’un carreau : multiplie le nombre de boîtes par ' + p + ' €.' }])];
    xs(items, { a: `${fr(L)} × ${fr(l)} = ${fr(L * l, 2)} m² ; ${fr(L * l, 2)} × 10 000 = ${fr(Acm)} cm²`, b: `${fr(Acm)} ÷ ${c * c} = ${fr(Acm / (c * c), 1)}, soit ${n} carreaux ; ${n} × 1,10 = ${fr(n * 1.1, 1)}, soit ${n10} carreaux`, c: `${n10} ÷ ${k} = ${fr(n10 / k, 1)}, arrondi au supérieur : ${bx} boîtes`, d: `${bx} × ${p} = ${cost} €` });
    return { titre: 'Le devis du carreleur', consigne: `Une pièce (fictive) est carrelée avec des carreaux de ${c} cm de côté. Il y a 10 % de chutes. Les carreaux sont vendus par boîtes de ${k} à ${p} € la boîte.`,
      support: pcFig(L, l, c) + ln('a', 'Aire de la pièce en cm²', String(Acm), 14, 'cm²') + ln('b', 'Carreaux avec 10 % de chutes', String(n10), 14) + ln('c', `Boîtes de ${k} à commander`, String(bx), 14) + ln('d', 'Coût total', String(cost), 14, '€'), items,
      hints: ['1 m² = 10 000 cm².', 'Divise par l’aire d’un carreau en cm², arrondis, puis ajoute 10 % et arrondis.', 'Divise par ' + k + ' et arrondis au supérieur.', 'Multiplie le nombre de boîtes par le prix d’une boîte.'] };
  });
  if (typeof module !== 'undefined') module.exports = {};
})(typeof module !== 'undefined' ? module.exports : window);
