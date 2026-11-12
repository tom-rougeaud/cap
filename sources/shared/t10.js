/* CAP Maths · chapitre 10 — Pythagore, Thalès et trigonométrie : hypoténuse, côté, réciproque, longueurs proportionnelles, sinus, cosinus, tangente.
   Chaque exercice « Je m’entraîne » existe en trois niveaux : courant (id), 🌱 guidé (id + 'a'), 🚀 défi (id + 'd'). Toutes les réponses sont calculées. */
(function (root) {
  'use strict';
  const { DEP, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, T, svg, table, num, qcm, pick, int, xs, lv, shuffle, rnd, ln } = H;
  const DG = Math.PI / 180, SM = '<svg style="max-width:108mm;height:auto" ';
  const sinD = a => Math.sin(a * DG), cosD = a => Math.cos(a * DG), tanInv = x => Math.atan(x) / DG;
  const TRI = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [20, 21, 29]];
  const dl = (x1, y1, x2, y2, o = {}) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${o.c || '#1D2240'}" stroke-width="${o.w || 1.6}" fill="none"${o.d ? ` stroke-dasharray="${o.d}"` : ''}/>`;

  /* triangle rectangle (angle droit en bas à gauche) : jambes a (horizontale) et b (verticale), hypoténuse c ; unk = 'a', 'b' ou 'c' (inconnue) */
  const rtFig = (a, b, c, unk, u = 'cm') => {
    const s = Math.min(190 / a, 100 / b), w = rnd(a * s, 1), h = rnd(b * s, 1), x0 = 74, y0 = 22, yb = y0 + h, L = Math.hypot(w, h), mx = x0 + w / 2, my = y0 + h / 2;
    const lab = (v, k, nm) => unk === k ? `${nm} = ?` : `${fr(v)} ${u}`;
    const body = `<path d="M${x0} ${yb}H${rnd(x0 + w, 1)}L${x0} ${y0}Z" class="k2 ks" stroke-width="2.2"/><path d="M${x0} ${yb - 10}h10v10" fill="none" class="ks" stroke-width="2"/>`
      + T(mx, yb + 19, lab(a, 'a', 'x'), { fs: 13, c: unk === 'a' ? 'kt' : 'tx' }) + T(x0 - 8, my + 4, lab(b, 'b', 'y'), { fs: 13, a: 'end', c: unk === 'b' ? 'kt' : 'tx' })
      + T(rnd(mx + 16 * h / L, 1), rnd(my - 16 * w / L + 4, 1), lab(c, 'c', 'd'), { fs: 13, a: 'start', c: unk === 'c' ? 'kt' : 'tx' });
    return svg(360, yb + 30, body, `Un triangle rectangle de côtés ${fr(a)} et ${fr(b)} et d’hypoténuse ${fr(c)} ${u}`).replace('<svg ', SM);
  };
  /* configuration de Thalès : sommet A, M sur [AB], N sur [AC], (MN) // (BC) ; f = AM ÷ AB */
  const thFig = f => {
    const A = [180, 22], B = [95, 150], C = [265, 150], M = [rnd(A[0] + f * (B[0] - A[0]), 1), rnd(A[1] + f * (B[1] - A[1]), 1)], N = [rnd(A[0] + f * (C[0] - A[0]), 1), M[1]];
    return svg(360, 196, `<path d="M${A} L${B} H${C[0]} Z" class="k2 ks" stroke-width="2.2"/>` + dl(M[0], M[1], N[0], N[1], { c: '#C2332A', w: 3 })
      + T(A[0], 14, 'A', { fs: 15, c: 'kt' }) + T(B[0] - 8, B[1] + 14, 'B', { fs: 15, c: 'kt', a: 'end' }) + T(C[0] + 8, C[1] + 14, 'C', { fs: 15, c: 'kt', a: 'start' }) + T(M[0] - 9, M[1] + 5, 'M', { fs: 15, c: 'kt', a: 'end' }) + T(N[0] + 9, N[1] + 5, 'N', { fs: 15, c: 'kt', a: 'start' }) + T(180, 190, '(MN) est parallèle à (BC)', { fs: 12.5, c: 'ts' }),
      'Un triangle ABC coupé par une droite MN parallèle à BC').replace('<svg ', SM);
  };
  /* triangle rectangle avec l’angle α (angle droit en bas à droite) ; les nombres opp et adj ne servent qu’à la forme du dessin */
  const trFig = (opp, adj, labs) => {
    const w0 = Math.min(150, 100 * adj / opp), w = rnd(w0, 1), h = rnd(w0 * opp / adj, 1), x0 = 100, yb = 28 + h, th = Math.atan(h / w), L = Math.hypot(w, h), mx = x0 + w / 2, my = yb - h / 2, r = th / DG < 30 ? 56 : 46;
    const body = `<path d="M${x0} ${yb}H${rnd(x0 + w, 1)}V${rnd(yb - h, 1)}Z" class="k2 ks" stroke-width="2.2"/><path d="M${rnd(x0 + w - 10, 1)} ${yb}V${yb - 10}H${rnd(x0 + w, 1)}" fill="none" class="ks" stroke-width="2"/>`
      + `<path d="M${x0 + 28} ${yb}A28 28 0 0 0 ${rnd(x0 + 28 * Math.cos(th), 1)} ${rnd(yb - 28 * Math.sin(th), 1)}" fill="none" class="ks" stroke-width="2"/>` + (th / DG < 25 ? T(x0 - 7, yb + 5, 'α', { fs: 15, c: 'kt', a: 'end' }) : T(rnd(x0 + r * Math.cos(th / 2), 1), rnd(yb - r * Math.sin(th / 2) + 5, 1), 'α', { fs: 15, c: 'kt' }))
      + T(mx, yb + 19, labs.a, { fs: 13 }) + (labs.cap ? T(mx, yb + 38, labs.cap, { fs: 13.5, c: 'kt' }) : '') + T(x0 + w + 10, my + 4, labs.o, { fs: 13, a: 'start' }) + T(rnd(mx - 14 * h / L, 1), rnd(my - 14 * w / L + 4, 1), labs.h, { fs: 13, a: 'end' });
    return svg(400, yb + 30 + (labs.cap ? 18 : 0), body, 'Un triangle rectangle avec un angle alpha, un côté opposé, un côté adjacent et une hypoténuse').replace('<svg ', SM.replace('360', '400'));
  };

  DEP.c10 = R => {
    const T4 = [['A', 3, 4, 5], ['B', 5, 12, 13], ['C', 6, 8, 10], ['D', 8, 15, 17]];
    const k = int(R, 0, 3), j = (k + 1 + int(R, 0, 2)) % 4, n = pick(R, [5, 10, 13, 17]), s2 = pick(R, [4, 6, 8, 10]);
    const doc = `<table class="dt tcx dt-sm"><thead><tr><th>Triangle</th><th>Côté 1 (cm)</th><th>Côté 2 (cm)</th><th>Plus grand côté (cm)</th></tr></thead><tbody>${T4.map((x, i) => `<tr><th>${x[0]}</th><td>${x[1]}</td><td>${x[2]}</td><td data-cell="${i + 1}">${x[3]}</td></tr>`).join('')}</tbody></table><p class="tr-l">Ces triangles sont rectangles.</p>`;
    const ch = shuffle(R, ['le carré du plus grand côté est égal à la somme des carrés des deux autres', 'le plus grand côté est égal à la somme des deux autres', 'les trois côtés sont égaux']);
    const sm = T4[j][1] * T4[j][1] + T4[j][2] * T4[j][2];
    return { titre: 'Des triangles rectangles', doc,
      qs: [{ t: `Quel est le plus grand côté du triangle ${T4[k][0]}, en centimètres ?`, kind: 'tap', cell: String(k + 1), v: T4[k][3], tol: .001, a: String(T4[k][3]) },
        { t: `Pour le triangle ${T4[j][0]}, calcule (côté 1)² + (côté 2)².`, kind: 'num', v: sm, tol: .001, a: String(sm), x: `${T4[j][1]}² + ${T4[j][2]}² = ${T4[j][1] * T4[j][1]} + ${T4[j][2] * T4[j][2]} = ${sm}` },
        { t: `Calcule la racine carrée de ${n * n}.`, kind: 'num', v: n, tol: .001, a: String(n), x: `${n} × ${n} = ${n * n}, donc √${n * n} = ${n}` },
        { t: 'Un triangle est rectangle si :', kind: 'qcm', choices: ch, ok: ch.indexOf('le carré du plus grand côté est égal à la somme des carrés des deux autres'), a: 'le carré du plus grand côté est égal à la somme des carrés des deux autres', x: 'c’est la réciproque du théorème de Pythagore' },
        { t: `Bâton de 1 m : ombre de 0,5 m. Tour : ombre de ${s2} m. Quelle est la hauteur de la tour ?`, kind: 'num', v: 2 * s2, tol: .001, a: String(2 * s2), x: `${s2} ÷ 0,5 = ${2 * s2}` }] };
  };

  /* e1 · Pythagore et réciproque */
  lv('c10e1', (R, niv) => {
    if (niv === 0) {
      const t1 = pick(R, TRI.slice(0, 4)), t2 = pick(R, TRI.slice(4)), sw = int(R, 0, 1), a = sw ? t1[1] : t1[0], b = sw ? t1[0] : t1[1], c = t1[2];
      const [p, q] = pick(R, [[4, 5], [3, 6], [5, 7], [2, 5], [6, 7], [4, 9]]), r3 = rnd(Math.sqrt(p * p + q * q), 1);
      const ok = int(R, 0, 1), S3 = ok ? pick(R, TRI.slice(0, 4)) : pick(R, [[5, 6, 8], [4, 5, 7], [6, 7, 10], [3, 4, 6]]);
      const items = [num('a', c, 0, String(c), [{ v: a + b, m: 'Tu as additionné les côtés. Utilise Pythagore : d² = x² + y², puis la racine carrée.' }, { v: a * a + b * b, m: 'C’est d². Prends la racine carrée.' }]),
        num('b', t2[0], 0, String(t2[0]), [{ v: t2[2] - t2[1], m: 'Tu as soustrait les longueurs. On soustrait les carrés : y² = d² − x², puis la racine carrée.' }, { v: t2[2] * t2[2] - t2[1] * t2[1], m: 'C’est y². Prends la racine carrée.' }, { v: t2[1] + t2[2], m: 'On cherche un côté de l’angle droit : on soustrait les carrés, on n’additionne pas.' }]),
        num('c', r3, 1, fr(r3, 1), [{ v: p + q, m: 'Tu as additionné les côtés. Calcule √(p² + q²).' }, { v: p * p + q * q, m: 'C’est le carré de la longueur. Prends la racine carrée.' }]),
        qcm('d', ['oui', 'non'], ok ? 0 : 1, ok ? 'oui' : 'non')];
      const big = Math.max(...S3), others = S3.filter(x => x !== big);
      xs(items, { a: `d² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b} ; d = √${c * c} = ${c} cm`, b: `y² = ${t2[2]}² − ${t2[1]}² = ${t2[2] * t2[2]} − ${t2[1] * t2[1]} = ${t2[0] * t2[0]} ; y = ${t2[0]} cm`, c: `√(${p}² + ${q}²) = √${p * p + q * q} ≈ ${fr(r3, 1)} cm`, d: `${others[0]}² + ${others[1]}² = ${others[0] * others[0] + others[1] * others[1]} et ${big}² = ${big * big} : ${ok ? 'égalité vraie, le triangle est rectangle' : 'les deux nombres sont différents, le triangle n’est pas rectangle'}` });
      return { titre: 'Pythagore : hypoténuse, côté et réciproque', consigne: 'Les triangles sont rectangles (sauf pour la question d). Les longueurs sont en centimètres.',
        support: rtFig(a, b, c, 'c') + rtFig(t2[0], t2[1], t2[2], 'a') + ln('a', 'Longueur d de l’hypoténuse', String(c), 14, 'cm') + ln('b', 'Longueur du côté manquant (les mesures sont sur la deuxième figure : x = ' + t2[0] + ' est la base)', String(t2[0]), 14, 'cm').replace(/\(les mesures.*?\) ?/, '') + `<p class="tr-l">Un triangle a pour côtés ${p} cm et ${q} cm autour de l’angle droit.</p>` + ln('c', 'Hypoténuse, arrondie au dixième', fr(r3, 1), 14, 'cm') + `<p class="tr-l">d. Un triangle a pour côtés ${S3.join(' cm, ')} cm. Est-il rectangle ?</p>`, items,
        hints: ['d² = x² + y², puis la racine carrée.', 'On cherche un côté : y² = d² − x², puis la racine carrée.', 'Calcule p² + q², puis prends la racine carrée.', 'Compare le carré du plus grand côté et la somme des deux autres carrés.'] };
    }
    if (niv < 0) {
      const [a, b] = pick(R, [[3, 4], [6, 8], [5, 12], [8, 6], [9, 12]]), c = Math.round(Math.hypot(a, b));
      const items = [num('a', a * a, 0, String(a * a), [{ v: 2 * a, m: 'Tu as multiplié par 2. Le carré de ' + a + ' est ' + a + ' × ' + a + '.' }]), num('b', b * b, 0, String(b * b), [{ v: 2 * b, m: 'Tu as multiplié par 2. Le carré de ' + b + ' est ' + b + ' × ' + b + '.' }]), num('c', a * a + b * b, 0, String(a * a + b * b), [{ v: a + b, m: 'Tu as additionné les longueurs. On additionne les carrés.' }]), num('d', c, 0, String(c), [{ v: a * a + b * b, m: 'C’est d². Prends la racine carrée.' }])];
      xs(items, { a: `${a} × ${a} = ${a * a}`, b: `${b} × ${b} = ${b * b}`, c: `${a * a} + ${b * b} = ${a * a + b * b}`, d: `√${a * a + b * b} = ${c}, car ${c} × ${c} = ${c * c}` });
      return { titre: 'L’hypoténuse, pas à pas', consigne: 'Un triangle est rectangle. Les côtés de l’angle droit mesurent ' + a + ' cm et ' + b + ' cm. Calcule l’hypoténuse.',
        support: rtFig(a, b, c, 'c') + `<p class="tr-l">Début du calcul : d² = ${a}² + ${b}²</p>` + ln('a', `${a}²`, String(a * a), 14) + ln('b', `${b}²`, String(b * b), 14) + ln('c', `d² = ${a}² + ${b}²`, String(a * a + b * b), 14) + ln('d', 'Hypoténuse d (racine carrée)', String(c), 14, 'cm'), items,
        hints: ['Multiplie ' + a + ' par lui-même.', 'Multiplie ' + b + ' par lui-même.', 'Additionne les deux carrés.', 'Cherche le nombre qui, multiplié par lui-même, donne ce résultat.'] };
    }
    const [L, Hh] = pick(R, [[80, 45], [100, 56], [60, 34], [120, 68]]), dd = rnd(Math.hypot(L, Hh), 1), inch = rnd(Math.hypot(L, Hh) / 2.54, 1), [e, f] = pick(R, [[5, 1.5], [4, 1.2], [6, 2], [3, 1]]), hh = rnd(Math.sqrt(e * e - f * f), 2), ok2 = int(R, 0, 1), S4 = ok2 ? pick(R, [[30, 40, 50], [60, 80, 100], [50, 120, 130]]) : pick(R, [[30, 40, 60], [50, 100, 120], [40, 50, 70]]);
    const items = [num('a', dd, 1, fr(dd, 1), [{ v: L + Hh, m: 'Tu as additionné les côtés. Utilise Pythagore : d = √(L² + H²).' }, { v: L * L + Hh * Hh, m: 'C’est d². Prends la racine carrée.' }]), num('b', inch, 1, fr(inch, 1), [{ v: rnd(dd * 2.54, 1), m: 'Tu as multiplié par 2,54. Pour passer de cm en pouces, on divise.' }]), qcm('c', ['oui', 'non'], ok2 ? 0 : 1, ok2 ? 'oui' : 'non'), num('d', hh, 2, fr(hh, 2), [{ v: rnd(Math.sqrt(e * e + f * f), 2), m: 'Tu as additionné. L’échelle est l’hypoténuse : on soustrait le carré de l’autre côté.' }, { v: rnd(e * e - f * f, 2), m: 'C’est h². Prends la racine carrée.' }])];
    const bg = Math.max(...S4), ot = S4.filter(x => x !== bg);
    xs(items, { a: `√(${L}² + ${Hh}²) = √${L * L + Hh * Hh} ≈ ${fr(dd, 1)} cm`, b: `${fr(dd, 1)} ÷ 2,54 ≈ ${fr(inch, 1)} pouces`, c: `${ot[0]}² + ${ot[1]}² = ${ot[0] * ot[0] + ot[1] * ot[1]} et ${bg}² = ${bg * bg} : ${ok2 ? 'égaux, le triangle est rectangle' : 'différents, le triangle n’est pas rectangle'}`, d: `h² = ${fr(e)}² − ${fr(f)}² = ${fr(rnd(e * e, 2))} − ${fr(rnd(f * f, 2))} = ${fr(rnd(e * e - f * f, 2))} ; h = √${fr(rnd(e * e - f * f, 2))} ≈ ${fr(hh, 2)} m` });
    return { titre: 'Écran, équerre et échelle', consigne: `Un écran mesure ${L} cm de large et ${Hh} cm de haut (1 pouce = 2,54 cm). Un charpentier contrôle un angle droit. Une échelle de ${fr(e)} m est posée à ${fr(f)} m d’un mur.`,
      support: rtFig(L, Hh, dd, 'c') + ln('a', 'Diagonale de l’écran, arrondie au dixième', fr(dd, 1), 14, 'cm') + ln('b', 'Diagonale en pouces, arrondie au dixième', fr(inch, 1), 14, 'pouces') + `<p class="tr-l">c. Un charpentier mesure ${S4.join(' cm, ')} cm. L’angle est-il droit ?</p>` + ln('d', 'Hauteur atteinte par l’échelle, arrondie au centième', fr(hh, 2), 14, 'm'), items,
      hints: ['d = √(L² + H²).', 'Divise par 2,54.', 'Compare le carré du plus grand côté et la somme des deux autres carrés.', 'h² = d² − pied², puis la racine carrée.'] };
  });

  /* e2 · Thalès : ombres et longueurs proportionnelles */
  lv('c10e2', (R, niv) => {
    const SH = [[1.5, 1, [6, 8, 10]], [1, .5, [3, 4, 5]], [2, 1.6, [8, 12, 16]], [1, .8, [4, 6, 8]]];
    const mk = () => { const [h1, s1, ss] = pick(R, SH), s2 = pick(R, ss); return { h1, s1, s2, k: rnd(s2 / s1, 2), H: rnd(h1 * s2 / s1, 2) }; };
    const eu = x => fr(x, Number.isInteger(rnd(x, 2)) ? 0 : 2);
    if (niv === 0) {
      const { h1, s1, s2, k, H: Ht } = mk(), am = pick(R, [2, 3, 4]), m = pick(R, [2, 3, 4]), ab = am * m, mn = pick(R, [2, 3, 4, 5]), bc = mn * m;
      const ch = shuffle(R, ['AM ÷ AB = MN ÷ BC', 'AM ÷ MB = MN ÷ BC', 'AM ÷ AB = BC ÷ MN']);
      const items = [num('a', k, 2, eu(k), [{ v: rnd(s2 - s1, 2), m: 'Tu as soustrait les ombres. Pour trouver le rapport, on divise : ombre de l’arbre ÷ ombre du bâton.' }]), num('b', Ht, 2, eu(Ht), [{ v: s2, m: 'C’est l’ombre de l’arbre. La hauteur est la hauteur du bâton multipliée par le rapport.' }, { v: rnd(s2 / k, 2), m: 'Tu as divisé par le rapport. Pour retrouver la hauteur, multiplie.' }]), num('c', bc, 0, String(bc), [{ v: ab - am, m: 'Tu as calculé MB. On cherche BC avec Thalès : BC = MN × AB ÷ AM.' }, { v: rnd(mn * am / ab, 2), m: 'Tu as inversé le rapport. BC est plus grand que MN.' }]), qcm('d', ch, ch.indexOf('AM ÷ AB = MN ÷ BC'), 'AM ÷ AB = MN ÷ BC')];
      xs(items, { a: `${eu(s2)} ÷ ${eu(s1)} = ${eu(k)}`, b: `${eu(h1)} × ${eu(k)} = ${eu(Ht)} m`, c: `${am} ÷ ${ab} = ${mn} ÷ BC donne BC = ${mn} × ${ab} ÷ ${am} = ${bc} cm`, d: 'on met les longueurs du petit triangle en haut, celles du grand en bas, depuis le sommet A' });
      return { titre: 'Thalès : ombres et longueurs', consigne: 'Au même moment, les ombres sont proportionnelles aux hauteurs. Dans la figure, (MN) est parallèle à (BC).',
        support: table(['Objet', 'Hauteur (m)', 'Ombre (m)'], [['Bâton', eu(h1), eu(s1)], ['Arbre', '?', eu(s2)]]) + ln('a', 'Rapport des ombres (ombre de l’arbre ÷ ombre du bâton)', eu(k), 14) + ln('b', 'Hauteur de l’arbre', eu(Ht), 14, 'm') + thFig(am / ab) + table(['Longueur', 'Valeur (cm)'], [['AM', String(am)], ['AB', String(ab)], ['MN', String(mn)], ['BC', '?']]) + ln('c', 'BC', String(bc), 14, 'cm') + `<p class="tr-l">d. Quelle égalité de Thalès est vraie ?</p>`, items,
        hints: ['Divise l’ombre de l’arbre par l’ombre du bâton.', 'Multiplie la hauteur du bâton par le rapport.', 'BC = MN × AB ÷ AM.', 'Pars du sommet A : AM sur AB, MN sur BC.'] };
    }
    if (niv < 0) {
      const { h1, s1, s2, k, H: Ht } = mk();
      const items = [num('a', k, 2, eu(k), [{ v: rnd(s2 - s1, 2), m: 'Tu as soustrait. Pour trouver le rapport, on divise.' }]), num('b', Ht, 2, eu(Ht), [{ v: s2, m: 'C’est l’ombre de l’arbre. Multiplie la hauteur du bâton par le rapport.' }]), qcm('c', ['parallèles', 'perpendiculaires'], 0, 'parallèles')];
      xs(items, { a: `${eu(s2)} ÷ ${eu(s1)} = ${eu(k)}`, b: `${eu(h1)} × ${eu(k)} = ${eu(Ht)} m`, c: 'les rayons du soleil sont parallèles : c’est ce qui permet d’utiliser Thalès' });
      return { titre: 'Les ombres, pas à pas', consigne: 'Au même moment, un bâton et un arbre donnent des ombres proportionnelles à leurs hauteurs.',
        support: table(['Objet', 'Hauteur (m)', 'Ombre (m)'], [['Bâton', eu(h1), eu(s1)], ['Arbre', '?', eu(s2)]]) + `<p class="tr-l">Début du calcul : rapport = ${eu(s2)} ÷ ${eu(s1)}</p>` + ln('a', 'Rapport des ombres', eu(k), 14) + ln('b', `Hauteur de l’arbre (${eu(h1)} × rapport)`, eu(Ht), 14, 'm') + `<p class="tr-l">c. Les rayons du soleil sont :</p>`, items,
        hints: ['Divise l’ombre de l’arbre par l’ombre du bâton.', 'Multiplie la hauteur du bâton par le rapport.', 'Les rayons du soleil ne se croisent pas.'] };
    }
    const ST = pick(R, [[2, 1.6, 15.76, 19.7], [1, .8, 8, 10], [1.5, 1.2, 9.6, 12], [2, 1.5, 12.75, 17], [1.8, 1.2, 8, 12]]), [h1, s1, s2, Ht] = ST, k = rnd(s2 / s1, 2);
    const am = pick(R, [2, 3, 4]), m = pick(R, [2, 3, 4]), ab = am * m, q = pick(R, [3, 4, 5]), ac = m * q, mn = pick(R, [2, 3, 4, 5]), bc = mn * m;
    const items = [num('a', k, 2, eu(k), [{ v: rnd(s2 - s1, 2), m: 'Tu as soustrait les ombres. On divise : ombre de la statue ÷ ombre du bâton.' }]), num('b', Ht, 1, fr(Ht, 1), [{ v: s2, m: 'C’est l’ombre de la statue. Multiplie la hauteur du bâton par le rapport.' }]), num('c', q, 0, String(q), [{ v: ac - q, m: 'Tu as calculé NC. On cherche AN : AN = AC × AM ÷ AB.' }, { v: ac * ab / am, m: 'Tu as inversé le rapport. AN est plus petit que AC.' }]), num('d', bc, 0, String(bc), [{ v: rnd(mn * am / ab, 2), m: 'Tu as inversé le rapport. BC est plus grand que MN.' }])];
    xs(items, { a: `${eu(s2)} ÷ ${eu(s1)} = ${eu(k)}`, b: `${eu(h1)} × ${eu(k)} = ${fr(Ht, 1)} m`, c: `AN ÷ ${ac} = ${am} ÷ ${ab} donne AN = ${ac} × ${am} ÷ ${ab} = ${q} cm`, d: `${am} ÷ ${ab} = ${mn} ÷ BC donne BC = ${mn} × ${ab} ÷ ${am} = ${bc} cm` });
    return { titre: 'La statue et la figure de Thalès', consigne: 'Une statue et un bâton ont des ombres proportionnelles. Dans la figure, (MN) est parallèle à (BC) et M est sur [AB].',
      support: table(['Objet', 'Hauteur (m)', 'Ombre (m)'], [['Bâton', eu(h1), eu(s1)], ['Statue', '?', eu(s2)]]) + ln('a', 'Rapport des ombres', eu(k), 14) + ln('b', 'Hauteur de la statue, arrondie au dixième', fr(Ht, 1), 14, 'm') + thFig(am / ab) + table(['Longueur', 'Valeur (cm)'], [['AM', String(am)], ['AB', String(ab)], ['AC', String(ac)], ['MN', String(mn)]]) + ln('c', 'AN', String(q), 14, 'cm') + ln('d', 'BC', String(bc), 14, 'cm'), items,
      hints: ['Divise l’ombre de la statue par l’ombre du bâton.', 'Multiplie la hauteur du bâton par le rapport.', 'AN ÷ AC = AM ÷ AB.', 'MN ÷ BC = AM ÷ AB.'] };
  });

  /* e3 · sinus, cosinus, tangente */
  lv('c10e3', (R, niv) => {
    if (niv === 0) {
      const Hy = pick(R, [4, 5, 6, 8, 10]), al = pick(R, [25, 30, 35, 40]), op = rnd(Hy * sinD(al), 2), ad = rnd(Hy * cosD(al), 2), [o2, a2] = pick(R, [[2.5, 4], [3, 5], [3, 4], [5, 6], [2, 3]]), be = rnd(tanInv(o2 / a2), 1);
      const ch = shuffle(R, ['le sinus', 'le cosinus', 'la tangente']);
      const items = [num('a', op, 2, fr(op, 2), [{ v: ad, m: 'C’est le côté adjacent (cosinus). Le côté opposé à α se calcule avec le sinus.' }, { v: rnd(Hy * Math.tan(al * DG), 2), m: 'Tu as utilisé la tangente. On connaît l’hypoténuse : utilise le sinus.' }]), num('b', ad, 2, fr(ad, 2), [{ v: op, m: 'C’est le côté opposé (sinus). Le côté adjacent se calcule avec le cosinus.' }]), num('c', be, 1, fr(be, 1), [{ v: rnd(tanInv(a2 / o2), 1), m: 'Tu as inversé le rapport. tan α = opposé ÷ adjacent.' }, { v: rnd(o2 / a2, 3), m: 'C’est la valeur de tan α. L’angle est tan⁻¹ de cette valeur.' }]), qcm('d', ch, ch.indexOf('le sinus'), 'le sinus')];
      xs(items, { a: `opposé = ${Hy} × sin ${al}° ≈ ${fr(op, 2)} cm`, b: `adjacent = ${Hy} × cos ${al}° ≈ ${fr(ad, 2)} cm`, c: `tan α = ${fr(o2)} ÷ ${fr(a2)} = ${fr(rnd(o2 / a2, 3), 3)} ; α = tan⁻¹(${fr(rnd(o2 / a2, 3), 3)}) ≈ ${fr(be, 1)}°`, d: 'sin α = opposé ÷ hypoténuse : on connaît l’hypoténuse et on cherche l’opposé' });
      return { titre: 'Sinus, cosinus et tangente', consigne: 'Les triangles sont rectangles. La calculatrice est en mode degrés. Arrondis comme demandé.',
        support: trFig(Hy * sinD(al), Hy * cosD(al), { a: 'adjacent : ?', o: 'opposé : ?', h: `hypoténuse : ${Hy} cm`, cap: `α = ${al}°` }) + ln('a', 'Côté opposé, arrondi au centième', fr(op, 2), 14, 'cm') + ln('b', 'Côté adjacent, arrondi au centième', fr(ad, 2), 14, 'cm') + trFig(o2, a2, { a: `adjacent : ${fr(a2)} cm`, o: `opposé : ${fr(o2)} cm`, h: 'hypoténuse' }) + ln('c', 'Angle α, arrondi au dixième', fr(be, 1), 14, '°') + `<p class="tr-l">d. Pour calculer l’opposé connaissant l’hypoténuse, on utilise :</p>`, items,
        hints: ['opposé = hypoténuse × sin α.', 'adjacent = hypoténuse × cos α.', 'tan α = opposé ÷ adjacent, puis tan⁻¹.', 'Quel rapport relie l’opposé et l’hypoténuse ?'] };
    }
    if (niv < 0) {
      const Hy = pick(R, [6, 8, 10, 12]), op = Hy / 2;
      const items = [num('a', .5, 1, '0,5', [{ v: 1, m: 'Vérifie que ta calculatrice est en mode degrés (DEG) : sin 30° = 0,5.' }]), num('b', op, 1, fr(op, 1), [{ v: Hy, m: 'C’est l’hypoténuse. Multiplie-la par sin 30°.' }]), qcm('c', ['degrés', 'radians'], 0, 'degrés')];
      xs(items, { a: 'sin 30° = 0,5', b: `${Hy} × 0,5 = ${fr(op, 1)} cm`, c: 'les angles du triangle sont en degrés : la calculatrice doit être en mode DEG' });
      return { titre: 'Le côté opposé, pas à pas', consigne: `Un triangle est rectangle. L’hypoténuse mesure ${Hy} cm et l’angle α mesure 30°.`,
        support: trFig(Hy * .5, Hy * cosD(30), { a: 'adjacent', o: 'opposé : ?', h: `hypoténuse : ${Hy} cm`, cap: 'α = 30°' }) + `<p class="tr-l">Début du calcul : opposé = ${Hy} × sin 30°</p>` + ln('a', 'sin 30°', '0,5', 14) + ln('b', 'Côté opposé', fr(op, 1), 14, 'cm') + `<p class="tr-l">c. La calculatrice doit être en mode :</p>`, items,
        hints: ['Tape sin 30 sur la calculatrice en mode degrés.', 'Multiplie l’hypoténuse par sin 30°.', 'Un angle de 30° se mesure en degrés.'] };
    }
    const [Lr, al] = pick(R, [[4, 10], [5, 12], [3, 15], [6, 8]]), h = rnd(Lr * sinD(al), 2), d = rnd(Lr * cosD(al), 2), [h2, d2] = pick(R, [[.5, 3.5], [.6, 4], [.9, 4.5], [1.2, 6]]), be = rnd(tanInv(h2 / d2), 1);
    const items = [num('a', h, 2, fr(h, 2), [{ v: d, m: 'C’est la distance au sol (cosinus). La hauteur est le côté opposé à l’angle : sinus.' }, { v: rnd(Lr * Math.tan(al * DG), 2), m: 'Tu as utilisé la tangente. On connaît l’hypoténuse : utilise le sinus.' }]), num('b', d, 2, fr(d, 2), [{ v: h, m: 'C’est la hauteur (sinus). La distance au sol est le côté adjacent : cosinus.' }]), num('c', Lr * Lr, 0, String(Lr * Lr), [{ v: Lr, m: 'C’est la longueur, pas son carré. Calcule h² + d².' }, { v: rnd(h + d, 1), m: 'Tu as additionné h et d. Il faut additionner leurs carrés.' }]), num('d', be, 1, fr(be, 1), [{ v: rnd(tanInv(d2 / h2), 1), m: 'Tu as inversé le rapport. tan α = opposé ÷ adjacent = hauteur ÷ distance.' }, { v: rnd(h2 / d2, 3), m: 'C’est tan α. L’angle est tan⁻¹ de cette valeur.' }])];
    xs(items, { a: `h = ${Lr} × sin ${al}° ≈ ${fr(h, 2)} m`, b: `d = ${Lr} × cos ${al}° ≈ ${fr(d, 2)} m`, c: `${fr(h, 2)}² + ${fr(d, 2)}² = ${fr(rnd(h * h, 4), 4)} + ${fr(rnd(d * d, 4), 4)} ≈ ${Lr * Lr} = ${Lr}²`, d: `tan α = ${fr(h2)} ÷ ${fr(d2)} = ${fr(rnd(h2 / d2, 3), 3)} ; α = tan⁻¹(${fr(rnd(h2 / d2, 3), 3)}) ≈ ${fr(be, 1)}°` });
    return { titre: 'La rampe de skate', consigne: `Une rampe de skate mesure ${Lr} m de long (hypoténuse) et fait un angle de ${al}° avec le sol. Une autre rampe monte de ${fr(h2)} m sur ${fr(d2)} m au sol.`,
      support: trFig(Lr * sinD(al), Lr * cosD(al), { a: 'distance d : ?', o: 'hauteur h : ?', h: `${Lr} m`, cap: `α = ${al}°` }) + ln('a', 'Hauteur h, arrondie au centième', fr(h, 2), 14, 'm') + ln('b', 'Distance d, arrondie au centième', fr(d, 2), 14, 'm') + ln('c', 'h² + d², arrondi à l’unité', String(Lr * Lr), 14) + trFig(h2, d2, { a: `d = ${fr(d2)} m`, o: `h = ${fr(h2)} m`, h: 'rampe' }) + ln('d', 'Angle α de la deuxième rampe, arrondi au dixième', fr(be, 1), 14, '°'), items,
      hints: ['h = longueur × sin α.', 'd = longueur × cos α.', 'Élève au carré, puis additionne.', 'tan α = h ÷ d, puis tan⁻¹.'] };
  });
  if (typeof module !== 'undefined') module.exports = {};
  /* ===== exercice ajouté (3 niveaux) : notion 2 (Pythagore : un côté et la réciproque) ===== */
  {
    const { fr, rnd, pick, int, shuffle, table, tb, svg, T, num, qcm, ln, tabXY, lv, eur, L } = H;
    /* trame d’un exercice : rows { lab, v, d, a, x, err, w, un } ou { lab, qcm, ok, x } ; aide : ligne d’aide du niveau guidé */
    const QC = (titre, consigne, rows, hints, pre = '', aide = '') => {
      const items = rows.map((r, i) => { const k = L[i], d = r.d == null ? 2 : r.d; const it = r.qcm ? qcm(k, r.qcm, r.ok, r.a) : num(k, r.v, d, r.a != null ? r.a : (Number.isInteger(rnd(r.v, d)) ? fr(r.v, 0) : d === 2 ? fr(r.v, 2) : fr(rnd(r.v, d))), r.err || []); if (r.x) it.x = r.x; return it; });
      return { titre, consigne, support: pre + (aide ? `<p class="tr-l">Aide : ${aide}</p>` : '') + rows.map((r, i) => r.qcm ? `<p class="tr-l">${L[i]}. ${r.lab}</p>` : ln(L[i], r.lab, items[i].a, r.w || 14, r.un || '')).join(''), items, hints };
    };
    lv('c10e4', (R, niv) => {
      const sq = x => x * x;
      const tri = (ab, ac, bc) => {
        const Wd = 200, Hd = Math.max(70, Math.min(130, Wd * ac / ab)), Ax = 80, Ay = 170, Bx = Ax + Wd, By = Ay, Cx = Ax, Cy = Ay - Hd;
        let g = `<polygon points="${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}" fill="#EEF2FB" stroke="#1D2240" stroke-width="2.4" stroke-linejoin="round"/><path d="M ${Ax + 14} ${Ay} L ${Ax + 14} ${Ay - 14} L ${Ax} ${Ay - 14}" fill="none" stroke="#1D2240" stroke-width="1.8"/>`;
        g += T(Ax - 14, Ay + 16, 'A', { fs: 15 }) + T(Bx + 14, By + 16, 'B', { fs: 15 }) + T(Cx - 14, Cy - 6, 'C', { fs: 15 });
        g += T((Ax + Bx) / 2, Ay + 22, 'AB = ?', { fs: 13 }) + T(Ax - 10, (Ay + Cy) / 2, `AC = ${fr(ac)} cm`, { fs: 13, a: 'end' });
        const nl = Math.hypot(Hd, Wd); g += T((Bx + Cx) / 2 + 17 * Hd / nl, (By + Cy) / 2 - 17 * Wd / nl + 4, `BC = ${fr(bc)} cm`, { fs: 13, r: Math.round(Math.atan(Hd / Wd) * 180 / Math.PI) });
        return svg(400, 200, g, `Triangle ABC rectangle en A : AC = ${ac} cm et BC = ${bc} cm`);
      };
      const T3 = pick(R, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), k = niv < 0 ? 1 : pick(R, [1, 2]), [p, q, h0] = T3, ab = p * k, ac = q * k, bc = h0 * k;
      if (niv <= 0) {
        const [ra, rb, rc] = pick(R, [[3, 4, 5], [5, 12, 13], [6, 8, 10], [9, 12, 15], [7, 8, 10]]), ok = ra * ra + rb * rb === rc * rc;
        const rows = [
          { lab: 'BC² (hypoténuse au carré)', v: sq(bc), d: 0, w: 12, x: `${bc} × ${bc} = ${fr(sq(bc), 0)}` },
          { lab: 'AC²', v: sq(ac), d: 0, w: 12, x: `${ac} × ${ac} = ${fr(sq(ac), 0)}` },
          { lab: 'AB² = BC² − AC²', v: sq(ab), d: 0, w: 12, x: `${fr(sq(bc), 0)} − ${fr(sq(ac), 0)} = ${fr(sq(ab), 0)}`, err: [{ v: sq(bc) + sq(ac), m: 'Pour un côté de l’angle droit, on soustrait : BC² − AC².' }] },
          { lab: 'AB, la longueur du côté (racine carrée)', v: ab, d: 0, w: 12, un: 'cm', x: `√${fr(sq(ab), 0)} = ${ab} cm`, err: [{ v: sq(ab), m: 'AB est la racine carrée de AB², pas AB² lui-même.' }] }];
        if (niv === 0) rows.push({ lab: `Un triangle a pour côtés ${ra} cm, ${rb} cm et ${rc} cm : est-il rectangle ?`, qcm: ['oui', 'non'], ok: ok ? 0 : 1, x: `${rc}² = ${rc * rc} ; ${ra}² + ${rb}² = ${ra * ra} + ${rb * rb} = ${ra * ra + rb * rb}. ${ok ? 'Les deux sont égaux : d’après la réciproque, le triangle est rectangle.' : 'Les deux sont différents : le triangle n’est pas rectangle.'}` });
        return QC(niv < 0 ? 'Pythagore : un côté, pas à pas' : 'Pythagore : un côté et la réciproque', 'Le triangle ABC est rectangle en A. On cherche la longueur AB.', rows,
          ['Pour un côté de l’angle droit : AB² = BC² − AC².', 'Ensuite, AB est la racine carrée de AB².', 'Réciproque : si le grand côté au carré = somme des deux autres carrés, le triangle est rectangle.'], tri(ab, ac, bc), niv < 0 ? 'on soustrait les carrés : AB² = BC² − AC² ; puis on prend la racine carrée.' : '');
      }
      const bc2 = pick(R, [13, 15, 17, 20, 25]), ac2 = pick(R, [7, 9, 10, 12]), ab2sq = sq(bc2) - sq(ac2), ab2 = Math.sqrt(ab2sq), [sa, sb, sc] = pick(R, [[5, 7, 9], [6, 8, 11], [4, 6, 8], [9, 12, 15], [8, 15, 17]]), ok = sa * sa + sb * sb === sc * sc;
      return QC('Pythagore : côté non entier et réciproque', 'Le triangle ABC est rectangle en A. Calcule la longueur AB, arrondie au centième.', [
        { lab: 'AB² = BC² − AC²', v: ab2sq, d: 0, w: 12, x: `${bc2}² − ${ac2}² = ${fr(sq(bc2), 0)} − ${fr(sq(ac2), 0)} = ${fr(ab2sq, 0)}`, err: [{ v: sq(bc2) + sq(ac2), m: 'On soustrait : BC² − AC².' }] },
        { lab: 'AB (racine carrée, au centième)', v: rnd(ab2, 2), d: 2, w: 12, un: 'cm', x: `AB = √${fr(ab2sq, 0)} ≈ ${fr(ab2, 3)} ≈ ${fr(rnd(ab2, 2))} cm`, err: [{ v: ab2sq, m: 'Utilise la touche √ à la fin.' }] },
        { lab: `Un triangle a pour côtés ${sa} cm, ${sb} cm et ${sc} cm. Le grand côté au carré vaut`, v: sq(sc), d: 0, w: 12, x: `${sc}² = ${fr(sq(sc), 0)}` },
        { lab: `La somme des carrés des deux autres côtés vaut`, v: sq(sa) + sq(sb), d: 0, w: 12, x: `${sa}² + ${sb}² = ${fr(sq(sa), 0)} + ${fr(sq(sb), 0)} = ${fr(sq(sa) + sq(sb), 0)}`, err: [{ v: sq(sa + sb), m: 'Calcule le carré de chaque côté, puis additionne.' }] },
        { lab: 'Ce triangle est-il rectangle ?', qcm: ['oui', 'non'], ok: ok ? 0 : 1, x: ok ? 'Les deux nombres sont égaux : d’après la réciproque de Pythagore, le triangle est rectangle.' : 'Les deux nombres sont différents : le triangle n’est pas rectangle.' }],
        ['AB² = BC² − AC² pour un côté de l’angle droit.', 'Touche √ de la calculatrice pour AB.', 'Réciproque : compare le carré du plus grand côté à la somme des deux autres carrés.'], tri(Math.round(ab2 * 10) / 10, ac2, bc2));
    });
  }
})(typeof module !== 'undefined' ? module.exports : window);
