/* CAP Maths · chapitre 3 — Proportionnalité : reconnaître une situation (et une non-proportionnalité), coefficient, tableau, quatrième proportionnelle.
   Chaque exercice « Je m’entraîne » existe en trois niveaux : courant (id), 🌱 guidé (id + 'a'), 🚀 défi (id + 'd'). Toutes les réponses sont calculées. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, tb, T, svg, table, num, qcm, pick, int, xs, lv, shuffle, rnd } = H;
  const f1 = x => fr(rnd(x, 1), 1), f2 = x => fr(rnd(x, 2), 2);
  /* Usain Bolt, finale du 100 m, Berlin, 16 août 2009 : temps de passage (World Athletics ; arXiv:0911.1952, tableau I) */
  const BOLT = [[0, 0], [10, 1.89], [20, 2.88], [30, 3.78], [40, 4.64], [50, 5.47], [60, 6.29], [70, 7.10], [80, 7.92], [90, 8.75], [100, 9.58]];
  H.bolt = BOLT;
  const cent = x => Math.round(x * 100);
  const dtm = (a, b) => (cent(BOLT[b][1]) - cent(BOLT[a][1])) / 100;
  const CTXK = [['places de cinéma', 'Nombre de places', 'Prix (€)'], ['paquets de cartes', 'Nombre de paquets', 'Prix (€)'], ['séances de jeu', 'Nombre de séances', 'Prix (€)']];

  /* point de départ : les temps de passage de Usain Bolt */
  DEP.c3 = R => {
    const k = int(R, 3, 9), d = BOLT[k][0], t = BOLT[k][1], dl = BOLT.slice(1).map((x, i) => [i, dtm(i, i + 1)]), mn = Math.min(...dl.map(x => x[1])), jm = dl.find(x => x[1] === mn)[0];
    const lab = i => `de ${BOLT[i][0]} à ${BOLT[i + 1][0]} m`, others = shuffle(R, dl.map(x => x[0]).filter(i => i !== jm && dl[i][1] > mn + .02)), ch = shuffle(R, [jm, others[0], others[1]]);
    const a = pick(R, [3, 4]), b = a + pick(R, [3, 4]), td = dtm(a, b);
    const doc = `<table class="dt tcx dt-sm"><thead><tr><th>Distance (m)</th><th>Temps (s)</th></tr></thead><tbody>${BOLT.slice(1).map((x, i) => `<tr><th>${x[0]}</th><td data-cell="${i + 1}">${fr(x[1], 2)}</td></tr>`).join('')}</tbody></table><p class="srcl">Finale du 100 m des championnats du monde de Berlin, 16 août 2009 : temps de passage de Usain Bolt tous les 10 m. Sources : World Athletics ; arXiv:0911.1952, tableau I.</p>`;
    return { titre: 'Usain Bolt, Berlin 2009 : 9,58 s', doc,
      qs: [{ t: `Quel est le temps de passage de Usain Bolt à ${d} m, en secondes ?`, kind: 'tap', cell: String(k), v: t, tol: .001, a: fr(t, 2) },
        { t: `Combien de temps a-t-il mis pour aller de ${BOLT[a][0]} m à ${BOLT[b][0]} m, en secondes ?`, kind: 'num', v: td, tol: .006, a: fr(td, 2), x: `${fr(BOLT[b][1], 2)} − ${fr(BOLT[a][1], 2)} = ${fr(td, 2)}` },
        { t: 'Sur quelle section de 10 m a-t-il mis le moins de temps ?', kind: 'qcm', choices: ch.map(i => lab(i)), ok: ch.indexOf(jm), a: lab(jm), x: `c’est la section où la différence entre deux temps de passage est la plus petite : ${fr(mn, 2)} s` },
        { t: 'À 50 m, il a mis 5,47 s. À 100 m, a-t-il mis exactement le double de 5,47 s ?', kind: 'qcm', choices: ['oui', 'non'], ok: 1, a: 'non', x: `2 × 5,47 = 10,94 s, mais il a couru les 100 m en 9,58 s` },
        { t: 'Quelle est la différence entre 2 × 5,47 s et son temps final de 9,58 s, en secondes ?', kind: 'num', v: 1.36, tol: .006, a: '1,36', x: '2 × 5,47 = 10,94 ; 10,94 − 9,58 = 1,36' }] };
  };

  /* e1 · reconnaître une situation de proportionnalité */
  const tabXY = (xl, yl, X, Y) => `<table class="dt tcx dt-sm"><thead><tr><th>${xl}</th>${X.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody><tr><th>${yl}</th>${Y.map(y => `<td>${y}</td>`).join('')}</tr></tbody></table>`;
  lv('c3e1', (R, niv) => {
    const [nom, xl, yl] = pick(R, CTXK);
    if (niv === 0) {
      const k = pick(R, [2.5, 4, 6, 7.5, 9, 12]), X = [2, 3, 5, 8, 10], prop = R() < .5, Y = X.map(x => rnd(x * k, 2)), idx = int(R, 1, 3);
      let Yshow = Y.slice(), items, m, q0, q1;
      if (prop) { Yshow[4] = '?'; items = [qcm('a', ['oui', 'non'], 0, 'oui'), num('b', k, 2, fr(k), [{ v: rnd(X[0] * k, 2), m: 'C’est la valeur de la 2e ligne. Le coefficient se trouve en divisant la 2e ligne par la 1re.' }]), num('c', Y[4], 2, fr(Y[4]), [{ v: rnd(Y[4] - k, 2), m: 'Tu as retiré le coefficient. Il faut multiplier : 10 × ' + fr(k) + '.' }])];
        m = { a: `chaque colonne donne le même quotient : ${X.slice(0, 3).map((x, i) => `${fr(Y[i])} ÷ ${x}`).join(', ')} = ${fr(k)}`, b: `${fr(Y[0])} ÷ ${X[0]} = ${fr(k)}`, c: `10 × ${fr(k)} = ${fr(Y[4])}` }; }
      else { const dl = pick(R, [2, 3, -2, -3, 4]); Yshow[idx] = rnd(Y[idx] + dl, 2); q0 = Y[0] / X[0]; q1 = Yshow[idx] / X[idx];
        items = [qcm('a', ['oui', 'non'], 1, 'non'), num('b', rnd(q0, 2), 2, f2(q0)), num('c', rnd(q1, 2), 2, f2(q1))];
        m = { a: `les quotients ne sont pas tous égaux : ${f2(q0)} et ${f2(q1)}`, b: `${fr(Y[0])} ÷ ${X[0]} = ${f2(q0)}`, c: `${fr(Yshow[idx])} ÷ ${X[idx]} = ${f2(q1)}` }; }
      xs(items, m);
      return { titre: 'Proportionnel ou pas ?', consigne: `Un tableau relevé dans une boutique donne ${xl.toLowerCase()} et ${yl.toLowerCase()}. On veut savoir si c’est un tableau de proportionnalité : on calcule 2e ligne ÷ 1re ligne dans plusieurs colonnes.`,
        support: tabXY(xl, yl, X, Yshow) + `<p class="tr-l">a. Est-ce un tableau de proportionnalité ? (voir la case en dessous)</p>` + (prop ? `<p class="tr-l">b. Coefficient de proportionnalité : ${tb('b', fr(k), 16)}</p><p class="tr-l">c. Valeur à mettre à la place du « ? » : ${tb('c', fr(Y[4]), 16)}</p>` : `<p class="tr-l">b. Quotient 2e ligne ÷ 1re ligne, colonne ${X[0]} : ${tb('b', f2(q0), 16)}</p><p class="tr-l">c. Quotient 2e ligne ÷ 1re ligne, colonne ${X[idx]} (arrondi au centième) : ${tb('c', f2(q1), 16)}</p>`), items,
        hints: ['Dans un tableau de proportionnalité, tous les quotients 2e ligne ÷ 1re ligne sont égaux.', 'Calcule ce quotient pour deux colonnes et compare.', 'Si c’est proportionnel, on multiplie la 1re ligne par le coefficient pour trouver la 2e.'] };
    }
    if (niv < 0) {
      const k = pick(R, [3, 4, 5, 6, 8]), X = [1, 2, 3, 4], Y = X.map(x => x * k), Ys = Y.slice(); Ys[3] = '?';
      const items = [num('a', k, 0, String(k), [{ v: Y[1], m: 'C’est la valeur de la 2e ligne. Divise-la par celle de la 1re ligne.' }]), num('b', Y[3], 0, String(Y[3])), qcm('c', ['oui', 'non'], 0, 'oui')];
      xs(items, { a: `${Y[1]} ÷ ${X[1]} = ${k} (ou 1 ${nom.split(' ')[0].replace(/s$/, '')} coûte ${k} €)`, b: `4 × ${k} = ${Y[3]}`, c: `tous les quotients valent ${k}` });
      return { titre: 'Proportionnel ou pas ? Pas à pas', consigne: `Un tableau relevé dans une boutique donne ${xl.toLowerCase()} et ${yl.toLowerCase()}. On cherche le coefficient, puis on complète la case « ? ».`,
        support: tabXY(xl, yl, X, Ys) + `<p class="tr-l">Début du calcul : colonne 2 → ${Y[1]} ÷ 2 = ?</p><p class="tr-l">a. Coefficient de proportionnalité : ${tb('a', String(k), 14)}</p><p class="tr-l">b. Valeur à mettre à la place du « ? » (4 × coefficient) : ${tb('b', String(Y[3]), 14)}</p><p class="tr-l">c. Les quotients des colonnes 1, 2 et 3 sont égaux : est-ce proportionnel ? (voir la case en dessous)</p>`, items,
        hints: ['Coefficient = valeur de la 2e ligne ÷ valeur de la 1re ligne, dans une colonne.', 'Pour la case manquante : 1re ligne × coefficient.', 'Même quotient dans toutes les colonnes : proportionnel.'] };
    }
    const k = pick(R, [2.5, 4, 6, 7.5, 9]), X = [2, 4, 5, 8, 10], Y = X.map(x => rnd(x * k, 2)), idx = int(R, 0, 4), dl = pick(R, [3, 4, -3, -2, 5]), bad = rnd(Y[idx] + dl, 2), Ys = Y.slice(); Ys[idx] = bad;
    const ch = X.map(x => `colonne ${x}`);
    const items = [num('a', k, 2, fr(k), [{ v: rnd(bad / X[idx], 2), m: 'Cette colonne contient l’erreur. Prends le quotient d’une autre colonne.' }]), qcm('b', ch, idx, ch[idx]), num('c', Y[idx], 2, fr(Y[idx]), [{ v: bad, m: 'C’est la valeur fausse du tableau. Calcule la bonne : ' + X[idx] + ' × coefficient.' }]), qcm('d', ['oui', 'non'], 1, 'non')];
    xs(items, { a: `les colonnes ${X.filter((_, i) => i !== idx).slice(0, 2).join(' et ')} donnent ${fr(Y[X.indexOf(X.filter((_, i) => i !== idx)[0])])} ÷ ${X.filter((_, i) => i !== idx)[0]} = ${fr(k)}`, b: `${fr(bad)} ÷ ${X[idx]} = ${f2(bad / X[idx])}, qui n’est pas ${fr(k)}`, c: `${X[idx]} × ${fr(k)} = ${fr(Y[idx])}`, d: 'tant qu’une colonne ne suit pas le coefficient, le tableau n’est pas proportionnel' });
    return { titre: 'Trouver l’erreur', consigne: `Le tableau d’une boutique donne ${xl.toLowerCase()} et ${yl.toLowerCase()}. Il devrait être proportionnel, mais une seule valeur de la 2e ligne est fausse. À toi de la repérer et de la corriger.`,
      support: tabXY(xl, yl, X, Ys) + `<p class="tr-l">a. Coefficient de proportionnalité (celui des colonnes justes) : ${tb('a', fr(k), 16)}</p><p class="tr-l">b. Quelle colonne contient l’erreur ? (voir la case en dessous)</p><p class="tr-l">c. Valeur correcte à mettre dans cette colonne : ${tb('c', fr(Y[idx]), 16)}</p><p class="tr-l">d. Le tableau tel qu’il est écrit est-il proportionnel ? (voir la case en dessous)</p>`, items,
      hints: ['Calcule 2e ligne ÷ 1re ligne dans chaque colonne : le quotient qui revient le plus souvent est le coefficient.', 'La colonne dont le quotient est différent contient l’erreur.', 'La valeur correcte : 1re ligne × coefficient.'] };
  });

  /* e2 · coefficient et tableau : une recette */
  const REC = [['de nouilles', 'g', [80, 90, 110, 120]], ['de bouillon', 'cL', [25, 30, 35, 40]], ['de riz', 'g', [60, 70, 75, 80]]];
  lv('c3e2', (R, niv) => {
    const [ing, un, qs] = pick(R, REC), q = pick(R, qs);
    if (niv === 0) {
      const P = [2, 4, 6, 10], Q = P.map(p => p * q), Qs = Q.slice(), pers = 15, m = pick(R, [9, 12, 14]), M = q * m; Qs[2] = '?'; Qs[3] = '?';
      const items = [num('a', q, 0, String(q), [{ v: Q[1], m: 'C’est la quantité pour 4 personnes. Divise-la par 4 pour une personne.' }]), num('b', Q[2], 0, String(Q[2]), [{ v: q + 2, m: 'Ajouter 2 ne marche pas : en proportionnalité, on multiplie.' }]), num('c', q * pers, 0, String(q * pers)), num('d', m, 0, String(m), [{ v: M * q, m: 'Tu as multiplié. Pour trouver le nombre de personnes, divise la quantité totale par la quantité d’une personne.' }])];
      xs(items, { a: `${Q[1]} ${un} ÷ 4 = ${q} ${un} par personne`, b: `6 × ${q} = ${Q[2]} ${un}`, c: `${pers} × ${q} = ${q * pers} ${un}`, d: `${M} ÷ ${q} = ${m} personnes` });
      return { titre: 'Une recette pour tout le monde', consigne: `Une recette de ramen donne les quantités ${ing} selon le nombre de personnes. C’est une situation de proportionnalité. Les cases « ? » sont à compléter.`,
        support: tabXY('Personnes', `Quantité ${ing} (${un})`, P, Qs) + `<p class="tr-l">a. Quantité ${ing} pour une personne : ${tb('a', String(q), 14)} ${un}</p><p class="tr-l">b. Quantité pour 6 personnes (case « ? ») : ${tb('b', String(Q[2]), 14)} ${un}</p><p class="tr-l">c. Quantité pour ${pers} personnes : ${tb('c', String(q * pers), 14)} ${un}</p><p class="tr-l">d. Avec ${M} ${un}, pour combien de personnes peut-on préparer la recette ? ${tb('d', String(m), 14)}</p>`, items,
        hints: ['Quantité pour 1 personne : divise la quantité d’une colonne par le nombre de personnes de cette colonne.', 'Quantité pour n personnes : n × quantité d’une personne.', 'Nombre de personnes : quantité totale ÷ quantité d’une personne.'] };
    }
    if (niv < 0) {
      const P = [1, 2, 4], Q = P.map(p => p * q), items = [num('a', Q[1], 0, String(Q[1])), num('b', q * 3, 0, String(q * 3)), num('c', q * 5, 0, String(q * 5))];
      xs(items, { a: `2 × ${q} = ${Q[1]} ${un}`, b: `3 × ${q} = ${q * 3} ${un}`, c: `5 × ${q} = ${q * 5} ${un}` });
      return { titre: 'Une recette, pas à pas', consigne: `Une recette de ramen demande ${q} ${un} ${ing} par personne. C’est une situation de proportionnalité : pour 2 personnes, on multiplie par 2.`,
        support: tabXY('Personnes', `Quantité ${ing} (${un})`, [1, 2, 3, 5], [q, '?', '?', '?']) + `<p class="tr-l">Début du calcul : 2 × ${q} = ?</p><p class="tr-l">a. Pour 2 personnes : ${tb('a', String(Q[1]), 14)} ${un}</p><p class="tr-l">b. Pour 3 personnes : ${tb('b', String(q * 3), 14)} ${un}</p><p class="tr-l">c. Pour 5 personnes : ${tb('c', String(q * 5), 14)} ${un}</p>`, items,
        hints: ['Pour n personnes : n × quantité d’une personne.', 'La quantité d’une personne est donnée dans la 1re colonne.', 'Vérifie : plus il y a de personnes, plus il faut de quantité.'] };
    }
    const c = pick(R, [.15, .2, .25, .3]), conv = 12, S = c * pick(R, [18, 20, 24, 30]), nb = Math.round(S / c), pu = pick(R, [3.2, 4.5, 5.5]), tot = 30 * c, cout = rnd(tot * pu, 2);
    const items = [num('a', rnd(c * 1000, 0), 0, String(Math.round(c * 1000)), [{ v: c, m: 'C’est en kg. On te demande des grammes : 1 kg = 1 000 g.' }]), num('b', rnd(tot, 2), 2, fr(rnd(tot, 2)), [{ v: Math.round(c * 1000 * 30), m: 'C’est en grammes. On te demande des kilogrammes.' }]), num('c', nb, 0, String(nb)), num('d', cout, 2, fr(cout))];
    xs(items, { a: `${fr(c)} kg = ${fr(c)} × 1 000 = ${Math.round(c * 1000)} g`, b: `30 × ${fr(c)} = ${fr(rnd(tot, 2))} kg`, c: `${fr(S)} ÷ ${fr(c)} = ${nb} convives`, d: `${fr(rnd(tot, 2))} × ${fr(pu)} = ${fr(cout)} €` });
    return { titre: 'Buffet de ramen : les unités', consigne: `Pour un buffet de ramen, on prévoit ${fr(c)} kg de nouilles par convive. Les nouilles coûtent ${fr(pu)} € le kg. C’est une situation de proportionnalité : attention aux unités.`,
      support: table(['Convives', '1', '30', '?'], [['Nouilles (kg)', fr(c), '?', fr(S)]]) + `<p class="tr-l">a. Masse de nouilles par convive, en grammes : ${tb('a', String(Math.round(c * 1000)), 14)} g</p><p class="tr-l">b. Masse nécessaire pour 30 convives, en kg : ${tb('b', fr(rnd(tot, 2)), 14)} kg</p><p class="tr-l">c. Avec un stock de ${fr(S)} kg, pour combien de convives en a-t-on assez ? ${tb('c', String(nb), 14)}</p><p class="tr-l">d. Coût des nouilles pour 30 convives, en € : ${tb('d', fr(cout), 14)} €</p>`, items,
      hints: ['1 kg = 1 000 g : pour passer des kg aux g, multiplie par 1 000.', 'Masse totale = nombre de convives × masse par convive.', 'Nombre de convives = stock ÷ masse par convive.', 'Coût = masse en kg × prix d’un kg.'] };
  });

  /* e3 · quatrième proportionnelle : passage à l’unité et produit en croix */
  lv('c3e3', (R, niv) => {
    if (niv <= 0) {
      const [nom, un] = pick(R, [['places de cinéma', 'place'], ['tickets de manège', 'ticket'], ['paquets de cartes', 'paquet']]), u = pick(R, [4.5, 6, 7.5, 8, 9.5]), a = pick(R, [3, 4, 5, 6]), b = rnd(a * u, 2), c = pick(R, [7, 9, 10, 12]), m = pick(R, [11, 12, 15, 20]), D = rnd(u * m, 2);
      const items = niv < 0 ? [num('a', u, 2, fr(u), [{ v: a, m: 'C’est le nombre de ' + nom + '. Divise le prix par ce nombre.' }]), num('b', rnd(u * c, 2), 2, fr(rnd(u * c, 2)))] : [num('a', u, 2, fr(u), [{ v: a, m: 'C’est le nombre de ' + nom + '. Divise le prix par ce nombre.' }]), num('b', rnd(u * c, 2), 2, fr(rnd(u * c, 2)), [{ v: rnd(b + c, 2), m: 'Tu as additionné. En proportionnalité, on multiplie le prix d’une unité.' }]), num('c', m, 0, String(m), [{ v: rnd(D * u, 2), m: 'Tu as multiplié. Pour trouver un nombre de ' + nom + ', divise la somme par le prix d’une ' + un + '.' }]), qcm('d', [`${fr(D)} ÷ ${fr(u)}`, `${fr(D)} × ${fr(u)}`, `${fr(D)} − ${fr(u)}`], 0, `${fr(D)} ÷ ${fr(u)}`)];
      xs(items, niv < 0 ? { a: `${fr(b)} ÷ ${a} = ${fr(u)} €`, b: `${c} × ${fr(u)} = ${fr(rnd(u * c, 2))} €` } : { a: `${fr(b)} ÷ ${a} = ${fr(u)} € la ${un}`, b: `${c} × ${fr(u)} = ${fr(rnd(u * c, 2))} €`, c: `${fr(D)} ÷ ${fr(u)} = ${m}`, d: 'pour trouver combien de fois le prix d’une unité tient dans la somme, on divise' });
      const T3 = tabXY('Nombre', 'Prix (€)', [a, 1, c, '?'], [fr(b), '?', '?', fr(D)]);
      return { titre: niv < 0 ? 'Le prix d’une unité, pas à pas' : 'Passer par l’unité', consigne: `${a} ${nom} coûtent ${fr(b)} € (le même prix pour chaque ${un}). Pour calculer, on passe par le prix d’une ${un}.`,
        support: (niv < 0 ? tabXY('Nombre', 'Prix (€)', [a, 1, c], [fr(b), '?', '?']) : T3) + `<p class="tr-l">${niv < 0 ? 'Début du calcul : ' + fr(b) + ' ÷ ' + a + ' = ?' : ''}</p><p class="tr-l">a. Prix d’une ${un}, en € : ${tb('a', fr(u), 16)}</p><p class="tr-l">b. Prix de ${c} ${nom}, en € : ${tb('b', fr(rnd(u * c, 2)), 16)}</p>` + (niv < 0 ? '' : `<p class="tr-l">c. Avec ${fr(D)} €, combien de ${nom} peut-on acheter ? ${tb('c', String(m), 14)}</p><p class="tr-l">d. Quelle opération donne ce nombre de ${nom} ? (voir la case en dessous)</p>`), items,
        hints: [`Prix d’une ${un} = ${fr(b)} ÷ ${a}.`, `Prix de ${c} ${nom} = ${c} × prix d’une ${un}.`, `Nombre de ${nom} = somme ÷ prix d’une ${un}.`] };
    }
    /* défi : la vitesse moyenne de Usain Bolt, un coefficient de proportionnalité */
    const pairs = []; for (let i = 0; i < 10; i++) for (let j = i + 3; j <= 10; j++) { const d = BOLT[j][0] - BOLT[i][0], t = dtm(i, j), v = d / t, t100 = 100 / v, tt = rnd(t * 100 / d, 3); if (Math.abs(tt * 1000 - Math.round(tt * 1000)) < 1e-9 && Math.round(tt * 1000) % 10 === 5) continue; if (rnd(100 / rnd(v, 2), 2) !== rnd(t100, 2) || rnd(rnd(t100, 2) - 9.58, 2) !== rnd(t100 - 9.58, 2)) continue; pairs.push([i, j]); }
    const [i, j] = pick(R, pairs), d = BOLT[j][0] - BOLT[i][0], t = dtm(i, j), v = d / t, t100 = t * 100 / d, ec = rnd(rnd(t100, 2) - 9.58, 2);
    const items = [num('a', t, 2, fr(t, 2), [{ v: BOLT[j][1], m: 'C’est le temps de passage à l’arrivée de la section. Retire le temps du départ de la section.' }]), num('b', rnd(v, 2), 2, f2(v), [{ v: rnd(t / d, 3), m: 'Tu as divisé le temps par la distance. La vitesse, c’est la distance ÷ le temps.' }]), num('c', rnd(t100, 2), 2, f2(t100)), num('d', Math.abs(ec), 2, f2(Math.abs(ec)))];
    xs(items, { a: `${fr(BOLT[j][1], 2)} − ${fr(BOLT[i][1], 2)} = ${fr(t, 2)} s`, b: `${d} ÷ ${fr(t, 2)} ≈ ${f2(v)} m/s`, c: `100 ÷ ${f2(v)} ≈ ${f2(t100)} s (ou ${fr(t, 2)} × 100 ÷ ${d})`, d: `${f2(t100)} − 9,58 = ${fr(Math.abs(ec), 2)} s` });
    return { titre: 'La vitesse de Bolt, un coefficient', consigne: `Voici les temps de passage de Usain Bolt, finale du 100 m, Berlin 2009 (source : World Athletics ; arXiv:0911.1952). On suppose qu’il garde sur 100 m la vitesse moyenne de la section de ${BOLT[i][0]} m à ${BOLT[j][0]} m : la distance et le temps seraient alors proportionnels.`,
      support: table(['Distance (m)', ...BOLT.slice(1).map(x => String(x[0]))], [['Temps (s)', ...BOLT.slice(1).map(x => fr(x[1], 2))]]) + `<p class="tr-l">a. Durée de la section de ${BOLT[i][0]} m à ${BOLT[j][0]} m, en s : ${tb('a', fr(t, 2), 16)}</p><p class="tr-l">b. Vitesse moyenne sur cette section, en m/s (au centième) : ${tb('b', f2(v), 16)}</p><p class="tr-l">c. Temps pour 100 m à cette vitesse, en s (au centième) : ${tb('c', f2(t100), 16)}</p><p class="tr-l">d. Écart avec son vrai temps de 9,58 s, en s : ${tb('d', f2(Math.abs(ec)), 16)}</p>`, items,
      hints: ['Durée de la section : temps d’arrivée de la section − temps de départ.', 'Vitesse moyenne = distance ÷ durée.', 'Temps pour 100 m = 100 ÷ vitesse.', 'Écart = la différence entre les deux temps, sans signe.'] };
  });
  if (typeof module !== 'undefined') module.exports = { BOLT };
  /* ===== exercice ajouté (3 niveaux) : notion 4 (vitesse moyenne et proportionnalité) ===== */
  {
    const { fr, rnd, pick, int, shuffle, table, tb, svg, T, num, qcm, ln, tabXY, lv, eur, L } = H;
    /* trame d’un exercice : rows { lab, v, d, a, x, err, w, un } ou { lab, qcm, ok, x } ; aide : ligne d’aide du niveau guidé */
    const QC = (titre, consigne, rows, hints, pre = '', aide = '') => {
      const items = rows.map((r, i) => { const k = L[i], d = r.d == null ? 2 : r.d; const it = r.qcm ? qcm(k, r.qcm, r.ok, r.a) : num(k, r.v, d, r.a != null ? r.a : (Number.isInteger(rnd(r.v, d)) ? fr(r.v, 0) : d === 2 ? fr(r.v, 2) : fr(rnd(r.v, d))), r.err || []); if (r.x) it.x = r.x; return it; });
      return { titre, consigne, support: pre + (aide ? `<p class="tr-l">Aide : ${aide}</p>` : '') + rows.map((r, i) => r.qcm ? `<p class="tr-l">${L[i]}. ${r.lab}</p>` : ln(L[i], r.lab, items[i].a, r.w || 14, r.un || '')).join(''), items, hints };
    };
    lv('c3e4', (R, niv) => {
      const v = pick(R, niv > 0 ? [40, 60, 80, 100] : [30, 40, 50, 60, 80]);
      if (niv < 0) {
        const t = pick(R, [2, 3, 4]), d = v * t, t2 = pick(R, [5, 6]), ms = pick(R, [10, 20]);
        return QC('Vitesse moyenne, pas à pas', `Un camion parcourt ${fr(d, 0)} km en ${t} h à vitesse constante.`, [
          { lab: 'Sa vitesse moyenne (distance ÷ durée)', v, d: 0, w: 12, un: 'km/h', x: `${fr(d, 0)} ÷ ${t} = ${v} km/h`, err: [{ v: d * t, m: 'La vitesse est la distance divisée par la durée.' }] },
          { lab: `Distance parcourue en ${t2} h à la même vitesse`, v: v * t2, d: 0, w: 12, un: 'km', x: `${v} × ${t2} = ${fr(v * t2, 0)} km` },
          { lab: `Une vitesse de ${ms} m/s correspond à (× 3,6)`, v: ms * 3.6, d: 0, w: 12, un: 'km/h', x: `${ms} × 3,6 = ${fr(ms * 3.6, 0)} km/h` }],
          ['Vitesse = distance ÷ durée.', 'Distance = vitesse × durée.', 'Pour passer de m/s à km/h, on multiplie par 3,6.'],
          table(['Distance', 'Durée'], [[`${fr(d, 0)} km`, `${t} h`]]), 'vitesse = distance ÷ durée ; distance = vitesse × durée.');
      }
      if (niv === 0) {
        const t = pick(R, [1.5, 2.5, 3.5]), d = v * t, k = pick(R, [1.5, 2, 2.5, 3.5]), d2 = v * k, ms = pick(R, [5, 8, 12, 15, 25]);
        return QC('Vitesse moyenne et proportionnalité', `Un autocar parcourt ${fr(d)} km en ${fr(t)} h à vitesse constante. Distance et durée sont proportionnelles.`, [
          { lab: 'Sa vitesse moyenne', v, d: 0, w: 12, un: 'km/h', x: `${fr(d)} ÷ ${fr(t)} = ${v} km/h (coefficient de proportionnalité)`, err: [{ v: d * t, m: 'Divise la distance par la durée.' }] },
          { lab: `Distance parcourue en ${fr(k)} h`, v: d2, d: 1, w: 12, un: 'km', x: `${v} × ${fr(k)} = ${fr(d2)} km` },
          { lab: `Durée pour parcourir ${fr(d2)} km`, v: k, d: 2, w: 12, un: 'h', x: `${fr(d2)} ÷ ${v} = ${fr(k)} h`, err: [{ v: d2 * v, m: 'Durée = distance ÷ vitesse.' }] },
          { lab: `${ms} m/s en km/h (× 3,6)`, v: ms * 3.6, d: 1, w: 12, un: 'km/h', x: `${ms} × 3,6 = ${fr(ms * 3.6)} km/h` }],
          ['Vitesse = distance ÷ durée.', 'Durée = distance ÷ vitesse.', 'm/s → km/h : × 3,6.'],
          table(['Distance', 'Durée'], [[`${fr(d)} km`, `${fr(t)} h`]]));
      }
      const hh = pick(R, [1, 2, 3]), mi = pick(R, [15, 30, 45]), t = hh + mi / 60, d = v * t, kmh = pick(R, [36, 54, 72, 90, 108]), d2 = v * 1.5;
      return QC('Vitesse moyenne : heures et minutes', `Un train parcourt ${fr(d)} km en ${hh} h ${mi} min à vitesse constante.`, [
        { lab: `La durée ${hh} h ${mi} min, en heures`, v: t, d: 2, w: 12, un: 'h', x: `${mi} min = ${mi} ÷ 60 = ${fr(mi / 60)} h, donc ${hh} + ${fr(mi / 60)} = ${fr(t)} h`, err: [{ v: hh + mi / 100, m: 'Une heure compte 60 minutes : divise les minutes par 60.' }] },
        { lab: 'Sa vitesse moyenne', v, d: 0, w: 12, un: 'km/h', x: `${fr(d)} ÷ ${fr(t)} = ${v} km/h` },
        { lab: `Durée pour parcourir ${fr(d2, 0)} km à cette vitesse`, v: 1.5, d: 2, w: 12, un: 'h', x: `${fr(d2, 0)} ÷ ${v} = 1,5 h, soit 1 h 30 min` },
        { lab: `${kmh} km/h en m/s (÷ 3,6)`, v: kmh / 3.6, d: 0, w: 12, un: 'm/s', x: `${kmh} ÷ 3,6 = ${fr(kmh / 3.6, 0)} m/s`, err: [{ v: kmh * 3.6, m: 'Pour passer de km/h à m/s, on divise par 3,6.' }] }],
        ['Convertis d’abord les minutes en heures : minutes ÷ 60.', 'Vitesse = distance ÷ durée (durée en heures).', 'km/h → m/s : ÷ 3,6.'],
        table(['Distance', 'Durée'], [[`${fr(d)} km`, `${hh} h ${mi} min`]]));
    });
  }
})(typeof module !== 'undefined' ? module.exports : window);
