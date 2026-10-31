/* CAP Maths · chapitre 1 — Statistique à une variable : effectifs, classes, fréquences, diagrammes en bâtons et circulaires, moyenne.
   Chaque exercice « Je m’entraîne » existe en trois niveaux : courant (id), 🌱 guidé (id + 'a'), 🚀 défi (id + 'd'). Toutes les réponses sont calculées. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, tb, sb, T, svg, table, num, qcm, pick, int, xs, lv, shuffle, rnd, PIE } = H;
  const SIM = [13, 22, 24, 22, 22, 25, 25, 25, 25, 23, 22, 21, 22, 22, 22, 21, 22, 22, 20, 21, 23, 22, 22, 22, 22, 22, 22, 22, 21, 23, 22, 22, 22, 22, 18, 22];
  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const CNC = { 2025: [13.83, 14.30, 12.72, 11.83, 11.23, 11.37, 14.29, 9.94, 9.46, 12.84, 14.12, 20.73], 2024: [13.71, 15.06, 15.19, 11.92, 15.71, 14.14, 17.90, 14.13, 10.07, 15.34, 17.83, 20.54] };
  const sum = a => a.reduce((x, y) => x + y, 0);
  const tally = a => { const m = {}; a.forEach(v => { m[v] = (m[v] || 0) + 1; }); return Object.keys(m).map(Number).sort((x, y) => x - y).map(v => [v, m[v]]); };
  const f1 = x => fr(rnd(x, 1), 1), f2 = x => fr(rnd(x, 2), 2);
  /* un nombre d’effectifs aléatoires de somme N, chacun entre lo et hi */
  const compo = (R, k, N, lo, hi) => { for (let t = 0; t < 400; t++) { const a = Array.from({ length: k }, () => int(R, lo, hi)); a[k - 1] = N - sum(a.slice(0, k - 1)); if (a[k - 1] >= lo && a[k - 1] <= hi) return a; } const b = Array(k).fill(Math.floor(N / k)); b[k - 1] += N - sum(b); return b; };
  H.stat = { SIM, MOIS, CNC, sum, tally };

  /* point de départ : les entrées en salle en France, mois par mois (CNC) */
  DEP.c1 = R => {
    const an = pick(R, [2025, 2024]), V = CNC[an], seuil = pick(R, [14, 15]), k = int(R, 0, 11);
    const imax = V.indexOf(Math.max(...V)), imin = V.indexOf(Math.min(...V));
    const others = shuffle(R, [...Array(12).keys()].filter(i => i !== imax && i !== imin));
    const chMax = shuffle(R, [imax, others[0], others[1]]), chMin = shuffle(R, [imin, others[2], others[3]]);
    const nb = V.filter(v => v > seuil).length, ec = rnd(V[imax] - V[imin], 2);
    const doc = `<table class="dt tcx dt-sm"><thead><tr><th>Mois ${an}</th><th>Entrées (millions)</th></tr></thead><tbody>${V.map((v, i) => `<tr><th>${MOIS[i]}</th><td data-cell="${i}">${fr(v, 2)}</td></tr>`).join('')}</tbody></table><p class="srcl">Une « entrée », c’est un billet de cinéma vendu. Source : CNC, communiqués mensuels et bilan de l’année (estimations).</p>`;
    return { titre: `Le cinéma en France, mois par mois, en ${an}`, doc,
      qs: [{ t: `Combien d’entrées (en millions) en ${MOIS[k]} ${an} ?`, kind: 'tap', cell: String(k), v: V[k], tol: .001, a: fr(V[k], 2) },
        { t: 'Quel mois compte le plus d’entrées ?', kind: 'qcm', choices: chMax.map(i => MOIS[i]), ok: chMax.indexOf(imax), a: MOIS[imax] },
        { t: 'Quel mois compte le moins d’entrées ?', kind: 'qcm', choices: chMin.map(i => MOIS[i]), ok: chMin.indexOf(imin), a: MOIS[imin] },
        { t: `Combien de mois dépassent ${seuil} millions d’entrées ?`, kind: 'num', v: nb, tol: .01, a: String(nb), x: `les mois au-dessus de ${seuil} : ${V.map((v, i) => v > seuil ? MOIS[i] : null).filter(Boolean).join(', ')} → ${nb}` },
        { t: 'Quel est l’écart, en millions, entre le meilleur mois et le moins bon ?', kind: 'num', v: ec, tol: .006, a: fr(ec, 2), x: `${fr(V[imax], 2)} − ${fr(V[imin], 2)} = ${fr(ec, 2)}` }] };
  };

  /* e1 · tableau d’effectifs : effectif total, fréquence */
  const CTX = [['Une boutique de jeux vidéo a relevé le nombre de jeux achetés par client.', 'jeux achetés', 'clients'], ['Un club de cinéma a relevé le nombre de films vus par membre en un mois.', 'films vus', 'membres'], ['Une salle d’arcade a relevé le nombre de parties jouées par visiteur.', 'parties jouées', 'visiteurs']];
  lv('c1e1', (R, niv) => {
    const [txt, lab, qui] = pick(R, CTX);
    if (niv === 0) {
      const V = [1, 2, 3, 4, 5], n = compo(R, 5, int(R, 36, 48), 3, 14), N = sum(n), k = int(R, 1, 4);
      const mx = Math.max(...n), uniq = n.filter(x => x === mx).length === 1;
      if (!uniq) n[n.indexOf(mx)] += 1, n[(n.indexOf(mx) + 1) % 5] -= 1;
      const N2 = sum(n), m2 = Math.max(...n), vm = V[n.indexOf(m2)], sk = V[k], fk = Math.round(n[k] / N2 * 100);
      const tab = `<table class="dt tcx dt-sm"><thead><tr><th>${lab[0].toUpperCase() + lab.slice(1)}</th>${V.map(v => `<th>${v}</th>`).join('')}</tr></thead><tbody><tr><th>Effectif</th>${n.map(x => `<td>${x}</td>`).join('')}</tr></tbody></table>`;
      const items = [num('a', N2, 0, String(N2), [{ v: 5, m: 'Tu as compté les colonnes. L’effectif total est la somme des effectifs.' }, { v: sum(V), m: 'Tu as additionné les valeurs (1, 2, 3…). Il faut additionner les effectifs.' }]),
        num('b', n[0] + n[1], 0, String(n[0] + n[1])),
        num('c', fk, 0, String(fk), [{ v: n[k], m: 'C’est l’effectif. Pour la fréquence, divise par l’effectif total, puis multiplie par 100.' }, { v: rnd(n[k] / N2, 2), m: 'Tu as la fréquence en décimal. Multiplie par 100 pour avoir un pourcentage.' }]),
        qcm('d', V.map(String), V.indexOf(vm), String(vm))];
      xs(items, { a: n.join(' + ') + ' = ' + N2, b: `${n[0]} + ${n[1]} = ${n[0] + n[1]}`, c: `${n[k]} ÷ ${N2} = ${fr(n[k] / N2, 3)}, soit ${fk} %`, d: `le plus grand effectif est ${m2}, pour la valeur ${vm}` });
      return { titre: 'Un tableau d’effectifs', consigne: `${txt} Complète.`, support: tab + `<p class="tr-l">a. Effectif total : ${tb('a', String(N2), 14)} ${qui}</p><p class="tr-l">b. Nombre de ${qui} ayant ${lab} <b>1 ou 2</b> : ${tb('b', String(n[0] + n[1]), 14)}</p><p class="tr-l">c. Fréquence, en %, de la valeur <b>${sk}</b> (arrondie à l’unité) : ${tb('c', String(fk), 14)} %</p><p class="tr-l">d. Valeur la plus fréquente : voir la case en dessous</p>`, items,
        hints: ['L’effectif total : additionne tous les effectifs (la ligne du bas).', 'Fréquence = effectif ÷ effectif total, puis × 100 pour le pourcentage.', 'La valeur la plus fréquente est celle qui a le plus grand effectif.'] };
    }
    if (niv < 0) {
      const V = [1, 2, 3, 4], n = compo(R, 4, 20, 2, 9), k = int(R, 0, 3), N = 20;
      const tab = `<table class="dt tcx dt-sm"><thead><tr><th>${lab[0].toUpperCase() + lab.slice(1)}</th>${V.map(v => `<th>${v}</th>`).join('')}</tr></thead><tbody><tr><th>Effectif</th>${n.map(x => `<td>${x}</td>`).join('')}</tr></tbody></table>`;
      const items = [num('a', N, 0, String(N), [{ v: 4, m: 'Tu as compté les colonnes. Additionne les effectifs.' }]), num('b', rnd(n[k] / N, 2), 2, fr(n[k] / N, 2), [{ v: n[k], m: 'C’est l’effectif. Divise-le par 20.' }]), num('c', n[k] * 5, 0, String(n[k] * 5), [{ v: n[k], m: 'Un client sur 20, c’est 5 % : multiplie l’effectif par 5.' }])];
      xs(items, { a: n.join(' + ') + ' = 20', b: `${n[k]} ÷ 20 = ${fr(n[k] / N, 2)}`, c: `${fr(n[k] / N, 2)} × 100 = ${n[k] * 5} %, ou ${n[k]} × 5 = ${n[k] * 5}` });
      return { titre: 'Un tableau d’effectifs, pas à pas', consigne: `${txt} Dans ce tableau, l’effectif total vaut 20 : chaque ${qui.replace(/s$/, '')} compte donc pour 5 %.`, support: tab + `<p class="tr-l">Début du calcul : ${n[0]} + ${n[1]} + … = ?</p><p class="tr-l">a. Effectif total : ${tb('a', String(N), 14)} ${qui}</p><p class="tr-l">b. Fréquence de la valeur <b>${V[k]}</b> en décimal (${n[k]} ÷ 20) : ${tb('b', fr(n[k] / N, 2), 16)}</p><p class="tr-l">c. La même fréquence en % (${fr(n[k] / N, 2)} × 100) : ${tb('c', String(n[k] * 5), 14)} %</p>`, items,
        hints: ['Additionne les 4 effectifs.', 'Divise l’effectif de la valeur par 20.', 'Pour un pourcentage : multiplie le décimal par 100.'] };
    }
    const [Nt, pc] = pick(R, [[40, 10], [40, 15], [40, 25], [50, 10], [50, 20], [60, 10], [60, 15], [60, 20], [60, 25], [80, 10], [80, 15], [80, 25]]), nk = Nt * pc / 100, V = [1, 2, 3, 4];
    const rest = Nt - nk, a1 = int(R, Math.ceil(rest * .2), Math.floor(rest * .4)), a2 = int(R, Math.ceil(rest * .2), Math.floor(rest * .4)), a4 = rest - a1 - a2;
    const items = [num('a', Nt, 0, String(Nt), [{ v: nk, m: 'C’est l’effectif de la valeur 3. Cherche le total : si ' + pc + ' % correspondent à ' + nk + ', 100 % correspondent à plus.' }]), num('b', a4, 0, String(a4)), num('c', Math.round(a4 / Nt * 100), 0, String(Math.round(a4 / Nt * 100)))];
    xs(items, { a: `${pc} % correspondent à ${nk} ${qui}. Donc 1 % correspond à ${nk} ÷ ${pc} = ${fr(nk / pc)} et 100 % à ${fr(nk / pc)} × 100 = ${Nt}`, b: `${a1} + ${a2} + ${nk} = ${a1 + a2 + nk} ; ${Nt} − ${a1 + a2 + nk} = ${a4}`, c: `${a4} ÷ ${Nt} = ${fr(a4 / Nt, 3)}, soit ${Math.round(a4 / Nt * 100)} %` });
    return { titre: 'Retrouver les effectifs', consigne: `${txt} Cette fois, on connaît une fréquence : la valeur 3 a été relevée ${nk} fois et représente ${pc} % de l’ensemble.`, support: `<table class="dt tcx dt-sm"><thead><tr><th>${lab[0].toUpperCase() + lab.slice(1)}</th>${V.map(v => `<th>${v}</th>`).join('')}</tr></thead><tbody><tr><th>Effectif</th><td>${a1}</td><td>${a2}</td><td>${nk}</td><td>?</td></tr></tbody></table><p class="tr-l">a. Effectif total : ${tb('a', String(Nt), 14)} ${qui}</p><p class="tr-l">b. Effectif de la valeur 4 : ${tb('b', String(a4), 14)}</p><p class="tr-l">c. Fréquence de la valeur 4, en % (arrondie à l’unité) : ${tb('c', String(Math.round(a4 / Nt * 100)), 14)} %</p>`, items,
      hints: [`${pc} % correspondent à ${nk} : trouve d’abord ce que vaut 1 %.`, 'L’effectif manquant : effectif total moins les effectifs connus.', 'Fréquence = effectif ÷ effectif total × 100.'] };
  });

  /* e2 · diagrammes en bâtons et circulaires */
  const NSEC = [20, 24, 30, 36, 40, 45];
  /* diagramme en bâtons : graduation à chaque unité, ligne de lecture, valeur écrite au-dessus de chaque bâton */
  const barSvg = (V, n) => { const mx = Math.max(...n) + 1, u = Math.min(16, 150 / mx), bw = V.length > 6 ? 34 : 40, pitch = 500 / V.length, dense = u < 13, ticks = [], minor = []; for (let g = 0; g <= mx; g++) (!dense || g % 2 === 0 ? ticks : minor).push(g);
    return svg(600, 214, PIE.bars({ x0: 70, y0: 180, pitch, bw, u, vals: n, cats: V, ticks, minor, vmax: mx, fs: 12, vfs: 12, color: i => PIE.col(i), unit: 'effectif', labels: false }), 'Diagramme en bâtons avec une ligne de lecture à chaque effectif'); };
  /* diagramme circulaire : secteurs colorés à frontières noires, lettre + angle écrits dans le secteur, « ? » pour l’inconnu */
  const pieSvg = (labs, ang, unk) => svg(300, 200, PIE.sectors({ cx: 150, cy: 100, r: 84, fs: 13, minIn: 30, parts: ang.map((a, i) => ({ a, in: labs[i] + '\n' + (i === unk ? '?' : a + '°') })) }), 'Diagramme circulaire à quatre secteurs');
  lv('c1e2', (R, niv) => {
    const [txt, lab, qui] = pick(R, CTX);
    if (niv <= 0) {
      const N = niv < 0 ? 20 : pick(R, NSEC), V = niv < 0 ? [1, 2, 3, 4] : [1, 2, 3, 4, 5], n = compo(R, V.length, N, 2, Math.max(5, Math.min(12, Math.round(N / V.length * 1.8)))), k = int(R, 0, V.length - 1), coef = 360 / N;
      const ang = n[k] * coef, fk = Math.round(n[k] / N * 100);
      const items = [num('a', n[k], 0, String(n[k]), [{ v: V[k], m: 'Tu as lu la valeur sous le bâton. L’effectif se lit sur l’axe vertical.' }]), num('b', N, 0, String(N), [{ v: Math.max(...n), m: 'C’est le plus grand bâton. Pour l’effectif total, additionne tous les bâtons.' }]), num('c', ang, 0, String(ang), [{ v: fk, m: 'C’est un pourcentage. L’angle se calcule sur 360°.' }]), num('d', fk, 0, String(fk))];
      xs(items, { a: `le bâton de la valeur ${V[k]} monte jusqu’à ${n[k]}`, b: n.join(' + ') + ' = ' + N, c: `360° ÷ ${N} = ${fr(coef)}° par ${qui.replace(/s$/, '')}, donc ${n[k]} × ${fr(coef)} = ${ang}°`, d: `${n[k]} ÷ ${N} = ${fr(n[k] / N, 3)}, soit ${fk} %` });
      return { titre: niv < 0 ? 'Lire un diagramme en bâtons, pas à pas' : 'Du bâton au secteur', consigne: `${txt} Le diagramme en bâtons donne le nombre de ${qui} pour chaque valeur de « ${lab} ». On veut aussi construire le diagramme circulaire.`, support: barSvg(V, n) + (niv < 0 ? `<p class="tr-l">Aide : 360° ÷ 20 = 18° pour chaque client.</p>` : '') + `<p class="tr-l">a. Effectif de la valeur <b>${V[k]}</b> : ${tb('a', String(n[k]), 12)}</p><p class="tr-l">b. Effectif total : ${tb('b', String(N), 12)}</p><p class="tr-l">c. Angle du secteur de la valeur ${V[k]} : ${tb('c', String(ang), 12)} °</p><p class="tr-l">d. Fréquence de la valeur ${V[k]}, en % (à l’unité) : ${tb('d', String(fk), 12)} %</p>`, items,
        hints: ['L’effectif se lit sur l’axe vertical, à la hauteur du sommet du bâton.', 'Effectif total : additionne la hauteur de tous les bâtons.', 'Angle = effectif ÷ effectif total × 360°. Ici, chaque client compte pour ' + fr(coef) + '°.'] };
    }
    const N = pick(R, [40, 45, 60, 72]), coef = 360 / N, n = compo(R, 4, N, Math.ceil(N * .12), Math.floor(N * .4)), ang = n.map(x => x * coef), labs = ['A', 'B', 'C', 'D'];
    const k = int(R, 0, 2), j = (k + 1) % 4, last = 3;
    const items = [num('a', rnd(ang[k] / 360 * 100, 1), 1, f1(ang[k] / 360 * 100)), num('b', N, 0, String(N), [{ v: n[k], m: 'C’est l’effectif du secteur ' + labs[k] + '. Cherche le total : l’angle de ce secteur est une partie de 360°.' }]), num('c', n[j], 0, String(n[j])), num('d', ang[last], 0, String(ang[last]))];
    xs(items, { a: `${ang[k]} ÷ 360 = ${fr(ang[k] / 360, 3)}, soit ${f1(ang[k] / 360 * 100)} %`, b: `${ang[k]}° correspondent à ${n[k]} ${qui}. 360° correspondent à ${n[k]} × 360 ÷ ${ang[k]} = ${N}`, c: `${ang[j]}° ÷ ${fr(coef)}° = ${n[j]} ${qui}`, d: `360 − (${ang.slice(0, 3).join(' + ')}) = ${ang[last]}°` });
    return { titre: 'Retrouver les effectifs à partir des angles', consigne: `${txt} Le diagramme circulaire a quatre secteurs. Le secteur ${labs[k]} mesure ${ang[k]}° et correspond à ${n[k]} ${qui}. Les secteurs ${labs[0]}, ${labs[1]}, ${labs[2]} mesurent ${ang.slice(0, 3).join('°, ')}°.`, support: pieSvg(labs, ang, last) + `<p class="tr-l">a. Fréquence du secteur ${labs[k]}, en % (au dixième) : ${tb('a', f1(ang[k] / 360 * 100), 14)} %</p><p class="tr-l">b. Effectif total : ${tb('b', String(N), 12)}</p><p class="tr-l">c. Effectif du secteur ${labs[j]} (${ang[j]}°) : ${tb('c', String(n[j]), 12)}</p><p class="tr-l">d. Angle du secteur ${labs[last]} : ${tb('d', String(ang[last]), 12)} °</p>`, items,
      hints: ['360° correspondent à tout le monde : ' + ang[k] + '° correspondent à ' + n[k] + ' ' + qui + '.', 'Une fois l’effectif total connu, chaque angle se traduit en effectif.', 'La somme des 4 angles vaut 360°.'] };
  });

  /* e3 · la moyenne */
  lv('c1e3', (R, niv) => {
    const cap = w => w.charAt(0).toUpperCase() + w.slice(1);
    const unit = pick(R, [['points marqués', 'parties'], ['minutes de jeu', 'séances'], ['épisodes vus', 'semaines']]);
    if (niv < 0) {
      const k = 4, m = int(R, 8, 16); let v; do { v = Array.from({ length: k }, () => m + int(R, -4, 4)); v[k - 1] = m * k - sum(v.slice(0, k - 1)); } while (v[k - 1] < 1);
      const items = [num('a', sum(v), 0, String(sum(v))), num('b', m, 0, String(m), [{ v: sum(v), m: 'C’est la somme. Divise-la par le nombre de valeurs (4).' }])]; xs(items, { a: v.join(' + ') + ' = ' + sum(v), b: `${sum(v)} ÷ ${k} = ${m}` });
      return { titre: 'Une moyenne de tête', consigne: `Voici les ${unit[0]} sur ${k} ${unit[1]} : ${v.join(' ; ')}. On calcule la moyenne en deux étapes.`, support: table([cap(unit[1]), ...v.map((_, i) => i + 1)], [[cap(unit[0]), ...v]]) + `<p class="tr-l">a. Somme des ${k} valeurs : ${tb('a', String(sum(v)), 14)}</p><p class="tr-l">b. Moyenne (somme ÷ ${k}) : ${tb('b', String(m), 14)}</p><p class="tr-l">La moyenne est-elle comprise entre ${Math.min(...v)} et ${Math.max(...v)} ? Si oui, c’est cohérent.</p>`, items, hints: ['Additionne les 4 valeurs.', 'Divise la somme par 4.', 'Une moyenne est toujours entre la plus petite et la plus grande valeur.'] };
    }
    if (niv === 0) {
      const V = [10, 11, 12, 13, 14].map(x => x + int(R, 0, 4)), n = compo(R, 5, int(R, 20, 30), 2, 9), N = sum(n), S = sum(V.map((x, i) => x * n[i])), mo = S / N;
      const items = [num('a', N, 0, String(N)), num('b', S, 0, String(S), [{ v: sum(V), m: 'Tu as additionné les valeurs sans les multiplier par leurs effectifs.' }]), num('c', rnd(mo, 1), 1, f1(mo), [{ v: rnd(S / 5, 1), m: 'Tu as divisé par 5 (le nombre de valeurs). Il faut diviser par l’effectif total.' }]), qcm('d', ['oui', 'non'], V.some(x => Math.abs(x - rnd(mo, 1)) < 1e-9) ? 0 : 1, V.some(x => Math.abs(x - rnd(mo, 1)) < 1e-9) ? 'oui' : 'non')];
      xs(items, { a: n.join(' + ') + ' = ' + N, b: V.map((x, i) => `${x} × ${n[i]}`).join(' + ') + ' = ' + S, c: `${S} ÷ ${N} = ${fr(mo, 3)}, soit ${f1(mo)} en arrondissant au dixième`, d: `${f1(mo)} ${V.includes(rnd(mo, 1)) ? 'est' : 'n’est pas'} une des valeurs ${V.join(', ')}` });
      return { titre: 'Une moyenne avec des effectifs', consigne: `Un jeu en ligne a relevé ses ${unit[0]} : chaque valeur est répétée selon son effectif.`, support: `<table class="dt tcx dt-sm"><thead><tr><th>Valeur</th>${V.map(v => `<th>${v}</th>`).join('')}</tr></thead><tbody><tr><th>Effectif</th>${n.map(x => `<td>${x}</td>`).join('')}</tr></tbody></table><p class="tr-l">a. Effectif total : ${tb('a', String(N), 12)}</p><p class="tr-l">b. Somme de (valeur × effectif) : ${tb('b', String(S), 14)}</p><p class="tr-l">c. Moyenne (arrondie au dixième) : ${tb('c', f1(mo), 14)}</p><p class="tr-l">d. La moyenne est-elle l’une des valeurs de la série ?</p>`, items,
        hints: ['Effectif total : additionne la ligne des effectifs.', 'Multiplie chaque valeur par son effectif, puis additionne.', 'Moyenne = somme ÷ effectif total.'] };
    }
    const k = 5, m = int(R, 9, 14); let v; do { v = Array.from({ length: k - 1 }, () => m + int(R, -5, 5)); } while (m * k - sum(v) < 0 || m * k - sum(v) > 20);
    const x5 = m * k - sum(v), cible = m + 1, x6 = cible * (k + 1) - m * k;
    const items = [num('a', m * k, 0, String(m * k)), num('b', x5, 0, String(x5), [{ v: m, m: 'C’est la moyenne cherchée. Le 5e score se trouve avec la somme totale.' }]), num('c', x6, 0, String(x6))];
    xs(items, { a: `moyenne × nombre de valeurs : ${m} × ${k} = ${m * k}`, b: `${m * k} − (${v.join(' + ')}) = ${m * k} − ${sum(v)} = ${x5}`, c: `pour une moyenne de ${cible} sur ${k + 1} valeurs, la somme vaut ${cible} × ${k + 1} = ${cible * (k + 1)} ; ${cible * (k + 1)} − ${m * k} = ${x6}` });
    return { titre: 'La valeur qui manque', consigne: `Sur ${k} ${unit[1]}, la moyenne est de ${m} ${unit[0]}. Les ${k - 1} premières valeurs sont : ${v.join(' ; ')}. On cherche la dernière.`, support: table([cap(unit[1]), ...Array.from({ length: k }, (_, i) => i + 1)], [[cap(unit[0]), ...v, '?']]) + `<p class="tr-l">a. Somme des ${k} valeurs (moyenne × ${k}) : ${tb('a', String(m * k), 14)}</p><p class="tr-l">b. La ${k}e valeur : ${tb('b', String(x5), 14)}</p><p class="tr-l">c. Quelle ${k + 1}e valeur faut-il pour que la moyenne monte à ${cible} ? ${tb('c', String(x6), 14)}</p>`, items,
      hints: ['La somme de toutes les valeurs, c’est la moyenne multipliée par leur nombre.', 'La valeur manquante : la somme moins les valeurs connues.', 'Pour la question c, la nouvelle somme vaut ' + cible + ' × ' + (k + 1) + '.'] };
  });
  if (typeof module !== 'undefined') module.exports = { SIM, CNC, MOIS, tally, sum };
  /* ===== exercice ajouté (3 niveaux) : notion 1 (effectifs, effectif total et classes) ===== */
  {
    const { fr, rnd, pick, int, shuffle, table, tb, svg, T, num, qcm, ln, tabXY, lv, eur, L } = H;
    /* trame d’un exercice : rows { lab, v, d, a, x, err, w, un } ou { lab, qcm, ok, x } ; aide : ligne d’aide du niveau guidé */
    const QC = (titre, consigne, rows, hints, pre = '', aide = '') => {
      const items = rows.map((r, i) => { const k = L[i], d = r.d == null ? 2 : r.d; const it = r.qcm ? qcm(k, r.qcm, r.ok, r.a) : num(k, r.v, d, r.a != null ? r.a : (Number.isInteger(rnd(r.v, d)) ? fr(r.v, 0) : d === 2 ? fr(r.v, 2) : fr(rnd(r.v, d))), r.err || []); if (r.x) it.x = r.x; return it; });
      return { titre, consigne, support: pre + (aide ? `<p class="tr-l">Aide : ${aide}</p>` : '') + rows.map((r, i) => r.qcm ? `<p class="tr-l">${L[i]}. ${r.lab}</p>` : ln(L[i], r.lab, items[i].a, r.w || 14, r.un || '')).join(''), items, hints };
    };
    lv('c1e4', (R, niv) => {
      const s = pick(R, [10, 20, 30]), nv = niv < 0 ? 4 : 6, V = Array.from({ length: nv }, (_, i) => s + i), n = V.map(() => int(R, 1, niv < 0 ? 6 : 9)), N = n.reduce((a, b) => a + b, 0);
      const k = int(R, 0, nv - 1), w = niv > 0 ? 3 : 2, i0 = int(R, 0, Math.floor(nv / w) - 1) * w, cl = [V[i0], V[i0 + w - 1]], ec = n.slice(i0, i0 + w).reduce((a, b) => a + b, 0), ctx = pick(R, [['livraisons par jour', 'jours'], ['pièces défectueuses par lot', 'lots'], ['clients par heure', 'heures']]);
      const rows = [
        { lab: `Effectif de la valeur ${V[k]}`, v: n[k], d: 0, w: 12, x: `Dans le tableau, la valeur ${V[k]} a pour effectif ${n[k]}.`, err: [{ v: V[k], m: 'L’effectif est dans la ligne du bas, pas la valeur elle-même.' }] },
        { lab: 'Effectif total', v: N, d: 0, w: 12, x: `${n.join(' + ')} = ${N}`, err: [{ v: Math.max(...n), m: 'Additionne tous les effectifs pour trouver l’effectif total.' }] },
        { lab: `Effectif de la classe [${cl[0]} ; ${cl[1]}]`, v: ec, d: 0, w: 12, x: `La classe [${cl[0]} ; ${cl[1]}] contient ${V.slice(i0, i0 + w).join(', ')} : ${n.slice(i0, i0 + w).join(' + ')} = ${ec}`, err: [{ v: n[i0], m: 'Additionne les effectifs de toutes les valeurs de la classe.' }] },
        { lab: `La valeur ${cl[1]} appartient-elle à la classe [${cl[0]} ; ${cl[1]}] ?`, qcm: ['oui', 'non'], ok: 0, x: `Les bornes comptent : la classe [${cl[0]} ; ${cl[1]}] contient tous les nombres x tels que ${cl[0]} ≤ x ≤ ${cl[1]}.` }];
      if (niv > 0) rows.push({ lab: `Part de cette classe dans l’effectif total, en % (au dixième)`, v: rnd(ec / N * 100, 1), d: 1, w: 14, x: `${ec} ÷ ${N} = ${fr(ec / N, 3)} soit ${fr(rnd(ec / N * 100, 1), 1)} %` });
      return QC(niv < 0 ? 'Effectifs et classes, pas à pas' : niv > 0 ? 'Effectifs, classes et part d’une classe' : 'Effectifs, effectif total et classes', `On a relevé le nombre de ${ctx[0]} sur ${ctx[1] === 'jours' ? 'plusieurs jours' : 'une période'}.`, rows,
        ['L’effectif total est la somme de tous les effectifs.', 'Une classe [a ; b] contient a, b et tous les nombres entre a et b.', 'Pour l’effectif d’une classe, additionne les effectifs de ses valeurs.'],
        tabXY(`Nombre de ${ctx[0]}`, `Effectif (${ctx[1]})`, V, n), niv < 0 ? 'effectif total = somme de tous les effectifs.' : '');
    });
  }
})(typeof module !== 'undefined' ? module.exports : window);
