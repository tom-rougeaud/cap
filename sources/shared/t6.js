/* CAP Maths · chapitre 6 — Fonctions et graphiques : tableau de valeurs, coordonnées, image, antécédent, variations.
   Chaque exercice « Je m’entraîne » existe en trois niveaux : courant (id), 🌱 guidé (id + 'a'), 🚀 défi (id + 'd'). Toutes les réponses sont calculées. */
(function (root) {
  'use strict';
  const { DEP, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, tb, T, svg, table, num, qcm, pick, int, xs, lv, shuffle, rnd, ln, tabXY, f1, f2, P } = H;
  const dec = x => { const r = rnd(x, 3); return Number.isInteger(r) ? 0 : (Number.isInteger(rnd(r * 100, 6)) ? 2 : 3); };
  const eu = x => fr(x, dec(x));
  const eh = x => fr(rnd(x, 3), Number.isInteger(rnd(x, 3)) ? 0 : (Number.isInteger(rnd(x * 10, 2)) ? 1 : (Number.isInteger(rnd(x * 100, 2)) ? 2 : 3)));
  /* temps de passage de Bolt, finale du 100 m, Berlin 2009 (World Athletics ; arXiv:0911.1952) : [distance (m), temps (s)] */
  const BOLT = [[10, 1.89], [20, 2.88], [30, 3.78], [40, 4.64], [50, 5.47], [60, 6.29], [70, 7.10], [80, 7.92], [90, 8.75], [100, 9.58]];
  const gt = (x, y, s, col, a = 'start', fs = 12) => `<text x="${rnd(x, 1)}" y="${rnd(y, 1)}" font-family="Inter" font-size="${fs}" font-weight="800" text-anchor="${a}" fill="${col}">${s}</text>`;

  DEP.c6 = R => {
    const rows = shuffle(R, BOLT.filter(r => [20, 30, 50, 60, 70, 80, 90, 100].includes(r[0]))).slice(0, 5).sort((a, b) => a[0] - b[0]);
    const k = int(R, 0, 4), j = (k + 1 + int(R, 0, 3)) % 5, a = rows[k], b = rows[j];
    const doc = `<table class="dt tcx dt-sm"><thead><tr><th>Distance (m)</th><th>Temps de passage (s)</th></tr></thead><tbody>${rows.map((r, i) => `<tr><th>${r[0]}</th><td data-cell="${i + 1}">${eu(r[1])}</td></tr>`).join('')}</tbody></table><p class="tr-l">Bolt, finale du 100 m, Berlin 2009.</p>`;
    const dt = rnd(Math.abs(b[1] - a[1]), 2), lo = a[0] < b[0] ? a : b, hi = a[0] < b[0] ? b : a;
    const ch = shuffle(R, ['l’image de 80', 'un antécédent de 80', 'l’abscisse de 7,92']);
    return { titre: 'Bolt : les temps de passage', doc,
      qs: [{ t: `Quel est le temps de passage à ${rows[k][0]} m, en secondes ?`, kind: 'tap', cell: String(k + 1), v: rows[k][1], tol: .001, a: eu(rows[k][1]) },
        { t: `À quelle distance en est-il à ${eu(rows[j][1])} s, en mètres ?`, kind: 'num', v: rows[j][0], tol: .001, a: String(rows[j][0]), x: `${eu(rows[j][1])} se lit en face de ${rows[j][0]}` },
        { t: 'Dans f(80) = 7,92, le nombre 7,92 est :', kind: 'qcm', choices: ch, ok: ch.indexOf('l’image de 80'), a: 'l’image de 80', x: 'on part de 80 et on lit 7,92 : c’est son image' },
        { t: `Combien de secondes entre ${lo[0]} m et ${hi[0]} m ?`, kind: 'num', v: dt, tol: .006, a: eu(dt), x: `${eu(hi[1])} − ${eu(lo[1])} = ${eu(dt)}` },
        { t: 'Quand la distance augmente, le temps de passage :', kind: 'qcm', choices: ['augmente', 'diminue'], ok: 0, a: 'augmente', x: 'les temps sont rangés du plus petit au plus grand' }] };
  };

  /* e1 · tableau de valeurs : image et antécédent */
  lv('c6e1', (R, niv) => {
    const cols = shuffle(R, BOLT.filter(r => r[0] % 10 === 0 && r[0] >= 20)).slice(0, 5).sort((a, b) => a[0] - b[0]), tab = tabXY('d (m)', 't (s)', cols.map(c => String(c[0])), cols.map(c => eu(c[1])));
    const A = cols[int(R, 0, 4)], Bc = cols[int(R, 0, 4)], C = cols.find(c => c !== A && c !== Bc) || cols[0], i1 = int(R, 0, 4), i2 = (i1 + 1 + int(R, 0, 2)) % 5, lo = cols[Math.min(i1, i2)], hi = cols[Math.max(i1, i2)], dt = rnd(hi[1] - lo[1], 2);
    if (niv === 0) {
      const items = [num('a', A[1], 2, eu(A[1]), [{ v: A[0], m: 'C’est la distance. L’image se lit dans la ligne du bas.' }]), num('b', Bc[0], 0, String(Bc[0]), [{ v: Bc[1], m: 'C’est le temps donné. L’antécédent se lit dans la ligne du haut.' }]), num('c', dt, 2, eu(dt), [{ v: rnd(hi[1] + lo[1], 2), m: 'Tu as additionné. Pour une durée, soustrais le plus petit temps du plus grand.' }])];
      xs(items, { a: `sous ${A[0]}, on lit ${eu(A[1])} s`, b: `${eu(Bc[1])} se lit au-dessus de ${Bc[0]} : ${Bc[0]} m`, c: `${eu(hi[1])} − ${eu(lo[1])} = ${eu(dt)} s` });
      return { titre: 'Lire un tableau de valeurs', consigne: 'Voici des temps de passage de Bolt (Berlin 2009). L’image se lit dans la ligne du bas, l’antécédent dans la ligne du haut.',
        support: tab + ln('a', `Image de ${A[0]} (temps à ${A[0]} m)`, eu(A[1]), 14, 's') + ln('b', `Antécédent de ${eu(Bc[1])} (distance)`, String(Bc[0]), 14, 'm') + ln('c', `Durée entre ${lo[0]} m et ${hi[0]} m`, eu(dt), 14, 's'), items,
        hints: ['Image : on part de la distance.', 'Antécédent : on part du temps.', 'Durée = grand temps − petit temps.'] };
    }
    if (niv < 0) {
      const items = [num('a', A[1], 2, eu(A[1]), [{ v: A[0], m: 'C’est la distance. Descends d’une ligne pour lire le temps.' }]), num('b', A[0], 0, String(A[0]), [{ v: A[1], m: 'C’est le temps. Monte d’une ligne pour lire la distance.' }]), qcm('c', ['l’image', 'l’antécédent'], 0, 'l’image')];
      xs(items, { a: `sous ${A[0]}, on lit ${eu(A[1])}`, b: `au-dessus de ${eu(A[1])}, on lit ${A[0]}`, c: 'on part de x et on lit f(x) : c’est l’image' });
      return { titre: 'Un tableau, pas à pas', consigne: `Dans le tableau, on s’intéresse à la colonne de ${A[0]} m. On lit d’abord vers le bas, puis vers le haut.`,
        support: tab + `<p class="tr-l">Début du calcul : je cherche ${A[0]} dans la ligne du haut.</p>` + ln('a', `Temps à ${A[0]} m`, eu(A[1]), 14, 's') + ln('b', `Distance quand le temps est ${eu(A[1])} s`, String(A[0]), 14, 'm') + `<p class="tr-l">c. Le temps à ${A[0]} m est-il l’image ou l’antécédent de ${A[0]} ? (voir la case en dessous)</p>`, items,
        hints: ['Pour le temps, descends dans la même colonne.', 'Pour la distance, remonte dans la même colonne.', 'Quand on part de x, on cherche son image.'] };
    }
    const a = pick(R, [2, 3, 4]), b = pick(R, [1, 2, 5]), xv = [0, 1, 2, 3, 4, 5], x5 = int(R, 1, 5), y5 = a * x5 + b, xa = int(R, 0, 5), x6 = (xa + 1 + int(R, 0, 4)) % 6;
    const tab2 = tabXY('x', 'f(x)', xv.map(String), xv.map(x => x === x6 ? '?' : String(a * x + b)));
    const items = [num('a', a * x5 + b, 0, String(a * x5 + b), [{ v: a * x5, m: 'Tu as oublié d’ajouter ' + b + '.' }]), num('b', xa, 0, String(xa), [{ v: a * xa + b, m: 'C’est l’image. On demande l’antécédent : le nombre dont l’image est ' + (a * xa + b) + '.' }]), num('c', a * x6 + b, 0, String(a * x6 + b), [{ v: a * x6, m: 'Tu as oublié d’ajouter ' + b + '.' }]), qcm('d', ['oui', 'non'], 0, 'oui')];
    xs(items, { a: `f(${x5}) = ${a} × ${x5} + ${b} = ${a * x5 + b}`, b: `${a * xa + b} se lit sous ${xa} : l’antécédent est ${xa}`, c: `f(${x6}) = ${a} × ${x6} + ${b} = ${a * x6 + b}`, d: `f(${x5}) = ${a * x5 + b} : ${x5} est bien un antécédent de ${a * x5 + b}` });
    return { titre: 'Tableau et formule', consigne: `Une fonction f est donnée par la formule f(x) = ${a} × x + ${b}. Une case du tableau est cachée : retrouve-la avec la formule.`,
      support: tab2 + ln('a', `Image de ${x5}`, String(a * x5 + b), 14) + ln('b', `Antécédent de ${a * xa + b}`, String(xa), 14) + ln('c', `Valeur cachée f(${x6})`, String(a * x6 + b), 14) + `<p class="tr-l">d. ${x5} est-il un antécédent de ${a * x5 + b} ? (voir la case en dessous)</p>`, items,
      hints: ['Image de x : calcule a × x + b.', 'Antécédent : cherche le nombre dont l’image est donnée.', 'Remplace x par la valeur cachée dans la formule.', 'Compare avec ta réponse à la question a.'] };
  });

  /* e2 · coordonnées */
  const repere = (pts, o = {}) => {
    const g = P.plot({ W: 360, H: 220, x: [0, 8, 1], y: [0, 6, 1], ml: 32, mr: 12, mt: 16, mb: 34, fs: 11, lx: 1, ly: 1, xl: 'axe horizontal', yl: 'axe vertical', lab: o.lab || 'Un repère quadrillé avec des points repérés par des lettres' });
    let b = g.base;
    pts.forEach(p => { if (p.guide) b += `<path d="M${g.X(p.x).toFixed(1)} ${g.Y(0).toFixed(1)}V${g.Y(p.y).toFixed(1)}H${g.X(0).toFixed(1)}" fill="none" stroke="#C2332A" stroke-width="1.8" stroke-dasharray="5 4"/>`; });
    b += g.pts(pts.map(p => [p.x, p.y]), { r: 5 });
    pts.forEach(p => { b += gt(g.X(p.x) + 8, g.Y(p.y) - 8, p.n, '#1D2240', 'start', 13); });
    return g.wrap(b).replace('<svg ', '<svg style="max-width:108mm;height:auto" ');
  };
  lv('c6e2', (R, niv) => {
    const mk = n => { for (let t = 0; t < 400; t++) { const L = 'ABCDEF'.slice(0, n).split(''), P2 = L.map(l => ({ n: l, x: int(R, 1, 7), y: int(R, 1, 5) })); let ok = true; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (Math.abs(P2[i].x - P2[j].x) + Math.abs(P2[i].y - P2[j].y) < 3 || P2[i].x === P2[j].x || P2[i].y === P2[j].y) ok = false; if (ok) return P2; } return [{ n: 'A', x: 2, y: 3 }, { n: 'B', x: 5, y: 1 }, { n: 'C', x: 7, y: 4 }]; };
    if (niv === 0) {
      const [A, B, C] = mk(3), items = [num('a', A.x, 0, String(A.x), [{ v: A.y, m: 'Tu as lu l’ordonnée. L’abscisse se lit sur l’axe horizontal.' }]), num('b', B.y, 0, String(B.y), [{ v: B.x, m: 'Tu as lu l’abscisse. L’ordonnée se lit sur l’axe vertical.' }]), num('c', C.x, 0, String(C.x), [{ v: C.y, m: 'Tu as lu l’ordonnée. L’abscisse se lit sur l’axe horizontal.' }]), num('d', C.y, 0, String(C.y), [{ v: C.x, m: 'Tu as lu l’abscisse. L’ordonnée se lit sur l’axe vertical.' }])];
      xs(items, { a: `A (${A.x} ; ${A.y}) : abscisse ${A.x}`, b: `B (${B.x} ; ${B.y}) : ordonnée ${B.y}`, c: `C (${C.x} ; ${C.y}) : abscisse ${C.x}`, d: `C (${C.x} ; ${C.y}) : ordonnée ${C.y}` });
      return { titre: 'Lire les coordonnées de points', consigne: 'Lis chaque coordonnée avec des lignes de lecture. L’abscisse se lit sur l’axe horizontal, l’ordonnée sur l’axe vertical.',
        support: repere([A, B, C]) + ln('a', 'Abscisse de A', String(A.x), 12) + ln('b', 'Ordonnée de B', String(B.y), 12) + ln('c', 'Abscisse de C', String(C.x), 12) + ln('d', 'Ordonnée de C', String(C.y), 12), items,
        hints: ['Descends du point jusqu’à l’axe horizontal.', 'Va du point jusqu’à l’axe vertical.', 'Même méthode pour C.', 'L’ordonnée de C se lit sur l’axe vertical.'] };
    }
    if (niv < 0) {
      const [A] = mk(1), items = [num('a', A.x, 0, String(A.x), [{ v: A.y, m: 'Tu as lu l’ordonnée. Suis la ligne pointillée verticale vers l’axe horizontal.' }]), num('b', A.y, 0, String(A.y), [{ v: A.x, m: 'Tu as lu l’abscisse. Suis la ligne pointillée horizontale vers l’axe vertical.' }]), qcm('c', ['(abscisse ; ordonnée)', '(ordonnée ; abscisse)'], 0, '(abscisse ; ordonnée)')];
      xs(items, { a: `la ligne verticale arrive sur ${A.x}`, b: `la ligne horizontale arrive sur ${A.y}`, c: 'on écrit toujours l’abscisse en premier' });
      return { titre: 'Des coordonnées, pas à pas', consigne: 'Les lignes pointillées partent du point A vers les deux axes. Lis la valeur où chaque ligne arrive.',
        support: repere([{ ...A, guide: true }]) + `<p class="tr-l">Début du calcul : la ligne verticale arrive sur l’axe horizontal.</p>` + ln('a', 'Abscisse de A', String(A.x), 12) + ln('b', 'Ordonnée de A', String(A.y), 12) + `<p class="tr-l">c. Comment écrit-on les coordonnées de A ? (voir la case en dessous)</p>`, items,
        hints: ['La ligne verticale arrive sur l’axe horizontal.', 'La ligne horizontale arrive sur l’axe vertical.', 'L’abscisse est écrite en premier.'] };
    }
    let A, B, C; for (let t = 0; t < 400; t++) { A = { n: 'A', x: int(R, 1, 4), y: int(R, 1, 3) }; B = { n: 'B', x: int(R, A.x + 2, 7), y: A.y }; C = { n: 'C', x: A.x, y: int(R, A.y + 2, 5) }; if (B.x !== C.x && B.y !== C.y) break; }
    const items = [num('a', B.x, 0, String(B.x), [{ v: B.y, m: 'Tu as lu l’ordonnée. L’abscisse se lit sur l’axe horizontal.' }]), num('b', B.x - A.x, 0, String(B.x - A.x), [{ v: B.x + A.x, m: 'Tu as additionné. Pour un écart, calcule la différence des abscisses.' }]), num('c', C.y, 0, String(C.y), [{ v: C.x, m: 'Tu as lu l’abscisse. L’ordonnée se lit sur l’axe vertical.' }]), num('d', C.y - A.y, 0, String(C.y - A.y), [{ v: C.y + A.y, m: 'Tu as additionné. Pour un écart, calcule la différence des ordonnées.' }])];
    xs(items, { a: `B (${B.x} ; ${B.y}) : abscisse ${B.x}`, b: `${B.x} − ${A.x} = ${B.x - A.x} carreaux`, c: `C (${C.x} ; ${C.y}) : ordonnée ${C.y}`, d: `${C.y} − ${A.y} = ${C.y - A.y} carreaux` });
    return { titre: 'Coordonnées et déplacements', consigne: 'A et B sont à la même hauteur. A et C sont l’un au-dessus de l’autre. Lis les coordonnées, puis compte les déplacements.',
      support: repere([A, B, C]) + ln('a', 'Abscisse de B', String(B.x), 12) + ln('b', 'Carreaux vers la droite de A à B', String(B.x - A.x), 12) + ln('c', 'Ordonnée de C', String(C.y), 12) + ln('d', 'Carreaux vers le haut de A à C', String(C.y - A.y), 12), items,
      hints: ['Lis l’abscisse de B sur l’axe horizontal.', 'Calcule abscisse de B − abscisse de A.', 'Lis l’ordonnée de C sur l’axe vertical.', 'Calcule ordonnée de C − ordonnée de A.'] };
  });

  /* e3 · courbe : image, antécédent, variations et maximum d’un saut h = c × t × (b − t) */
  const SAUTS = [{ b: 2, c: 2, tm: 2, hm: 2.5, dt: .5, dh: .5, pic: 2, tp: 1 }, { b: 4, c: 1, tm: 4, hm: 5, dt: 1, dh: 1, pic: 4, tp: 2 }, { b: 4, c: .5, tm: 4, hm: 2.5, dt: 1, dh: .5, pic: 2, tp: 2 }];
  const sautSvg = (s, marks = []) => {
    const g = P.plot({ W: 360, H: 220, x: [0, s.tm, s.dt / (s.tm > 2 ? 1 : 2)], y: [0, s.hm, s.dh], ml: 38, mr: 12, mt: 16, mb: 34, fs: 10.5, lx: s.tm > 2 ? 1 : 2, ly: 1, xl: 't (s)', yl: 'h (m)', lab: 'La hauteur du saut d’un personnage de jeu vidéo en fonction du temps' });
    const f = t => s.c * t * (s.b - t); let b = g.base + g.curve(f, { w: 3 }) + g.pts(Array.from({ length: Math.round(s.tm / s.dt) + 1 }, (_, i) => [i * s.dt, rnd(f(i * s.dt), 3)]), { r: 4 });
    marks.forEach(m => { b += g.guide(m.t, rnd(f(m.t), 3), { stroke: m.col || '#C2332A' }); });
    return g.wrap(b).replace('<svg ', '<svg style="max-width:108mm;height:auto" ');
  };
  lv('c6e3', (R, niv) => {
    const s = pick(R, SAUTS), f = t => rnd(s.c * t * (s.b - t), 3), n = Math.round(s.tm / s.dt), idx = int(R, 1, Math.floor(n / 2) - 1 + (s.tm > 2 ? 0 : 0)), t1 = idx * s.dt, h1 = f(t1), t2 = rnd(s.b - t1, 3);
    const tab = `<p class="tr-l">Un personnage de jeu vidéo saute. Sa hauteur h (en m) dépend du temps t (en s).</p>`;
    if (niv === 0) {
      const items = [num('a', h1, 3, eh(h1), [{ v: t1, m: 'C’est le temps donné. La hauteur se lit sur l’axe vertical.' }]), num('b', s.pic, 3, eh(s.pic), [{ v: s.tp, m: 'C’est l’instant du maximum. La hauteur maximale se lit sur l’axe vertical.' }]), num('c', s.tp, 3, eh(s.tp), [{ v: s.pic, m: 'C’est la hauteur du maximum. L’instant se lit sur l’axe horizontal.' }]), num('d', s.b, 3, eh(s.b), [{ v: s.tp, m: 'C’est la moitié du saut. Le personnage retombe à la fin : lis l’instant où h revient à 0.' }])];
      xs(items, { a: `au-dessus de t = ${eh(t1)}, on lit h = ${eh(h1)} m`, b: `le point le plus haut est à ${eh(s.pic)} m`, c: `ce point est au-dessus de t = ${eh(s.tp)} s`, d: `h revient à 0 à t = ${eh(s.b)} s : le saut dure ${eh(s.b)} s` });
      return { titre: 'Lire la courbe d’un saut', consigne: 'Trace des lignes de lecture avec ta règle. Lis les valeurs sur la courbe, avec leur unité.',
        support: tab + sautSvg(s) + ln('a', `Hauteur à t = ${eh(t1)} s`, eh(h1), 14, 'm') + ln('b', 'Hauteur maximale', eh(s.pic), 14, 'm') + ln('c', 'Instant du maximum', eh(s.tp), 14, 's') + ln('d', 'Durée du saut', eh(s.b), 14, 's'), items,
        hints: ['Pars de l’instant sur l’axe horizontal et monte jusqu’à la courbe.', 'Cherche le point le plus haut.', 'Lis l’abscisse de ce point.', 'La hauteur revient à 0 à la fin du saut.'] };
    }
    if (niv < 0) {
      const items = [num('a', s.pic, 3, eh(s.pic), [{ v: s.tp, m: 'C’est l’instant du maximum. La hauteur se lit sur l’axe vertical.' }]), qcm('b', ['croissante', 'décroissante'], 0, 'croissante'), qcm('c', ['croissante', 'décroissante'], 1, 'décroissante')];
      xs(items, { a: `le point le plus haut est à ${eh(s.pic)} m`, b: `de 0 à ${eh(s.tp)} s, la courbe monte`, c: `de ${eh(s.tp)} à ${eh(s.b)} s, la courbe descend` });
      return { titre: 'Les variations, pas à pas', consigne: 'Lis la courbe de gauche à droite. Quand elle monte, la fonction est croissante. Quand elle descend, elle est décroissante.',
        support: tab + sautSvg(s, [{ t: s.tp }]) + `<p class="tr-l">Début du calcul : le point le plus haut est marqué par la ligne pointillée.</p>` + ln('a', 'Hauteur maximale', eh(s.pic), 14, 'm') + `<p class="tr-l">b. De 0 à ${eh(s.tp)} s, la fonction est… ? (voir la case en dessous)</p><p class="tr-l">c. De ${eh(s.tp)} à ${eh(s.b)} s, la fonction est… ? (voir la case en dessous)</p>`, items,
        hints: ['Le maximum est le point le plus haut.', 'Avant le maximum, la courbe monte.', 'Après le maximum, la courbe descend.'] };
    }
    const items = [num('a', h1, 3, eh(h1)), num('b', t1, 3, eh(t1), [{ v: t2, m: 'C’est l’autre antécédent. On demande le plus petit.' }]), num('c', t2, 3, eh(t2), [{ v: t1, m: 'C’est l’autre antécédent. On demande le plus grand.' }]), num('d', rnd(t2 - t1, 3), 3, eh(t2 - t1), [{ v: rnd(t2 + t1, 3), m: 'Tu as additionné. Pour une durée, soustrais les deux instants.' }])];
    xs(items, { a: `au-dessus de t = ${eh(t1)}, on lit h = ${eh(h1)} m`, b: `la ligne à ${eh(h1)} m coupe la courbe en ${eh(t1)} et ${eh(t2)} : le plus petit est ${eh(t1)}`, c: `le plus grand est ${eh(t2)}`, d: `${eh(t2)} − ${eh(t1)} = ${eh(rnd(t2 - t1, 3))} s au-dessus de ${eh(h1)} m` });
    return { titre: 'Deux instants pour une même hauteur', consigne: 'Une même hauteur peut être atteinte deux fois : à la montée et à la descente. Trace une ligne horizontale pour trouver les deux antécédents.',
      support: tab + sautSvg(s) + ln('a', `Hauteur à t = ${eh(t1)} s`, eh(h1), 14, 'm') + ln('b', `Plus petit instant où h = ${eh(h1)} m`, eh(t1), 14, 's') + ln('c', `Plus grand instant où h = ${eh(h1)} m`, eh(t2), 14, 's') + ln('d', `Durée passée à ${eh(h1)} m ou plus`, eh(rnd(t2 - t1, 3)), 14, 's'), items,
      hints: ['Pars de l’instant et monte jusqu’à la courbe.', 'Trace la ligne horizontale à cette hauteur : elle coupe la courbe deux fois.', 'Lis le plus grand des deux instants.', 'Soustrais les deux instants.'] };
  });
  if (typeof module !== 'undefined') module.exports = { BOLT };
})(typeof module !== 'undefined' ? module.exports : window);
