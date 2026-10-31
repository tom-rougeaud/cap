/* CAP Maths · chapitre 5 — Équations et formules : valeur d’une formule, x + a = b, a × x = b, a × x + b = c, isoler une grandeur.
   Chaque exercice « Je m’entraîne » existe en trois niveaux : courant (id), 🌱 guidé (id + 'a'), 🚀 défi (id + 'd'). Toutes les réponses sont calculées. */
(function (root) {
  'use strict';
  const { DEP, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, tb, T, svg, table, num, qcm, pick, int, xs, lv, shuffle, rnd, ln, tabXY, f1, f2 } = H;
  const eu = x => fr(x, Number.isInteger(rnd(x, 2)) ? 0 : 2);
  /* abonnements d’un club de jeux : [offre, inscription (€), prix par séance (€)] */
  const CLUB = [['Sprint', 5, 2.5], ['Duo', 8, 2], ['Max', 12, 1.5]];

  DEP.c5 = R => {
    const k = int(R, 0, 2), j = (k + 1 + int(R, 0, 1)) % 3, m = int(R, 0, 2), nj = pick(R, [4, 6, 8, 10]), nm = pick(R, [6, 8, 10, 12]);
    const Pj = rnd(CLUB[j][2] * nj + CLUB[j][1], 2), Bm = rnd(CLUB[m][2] * nm + CLUB[m][1], 2);
    const doc = `<table class="dt tcx dt-sm"><thead><tr><th>Offre du club</th><th>Inscription (€)</th><th>Prix par séance (€)</th></tr></thead><tbody>${CLUB.map((x, i) => `<tr><th>${x[0]}</th><td>${eu(x[1])}</td><td data-cell="${i + 1}">${eu(x[2])}</td></tr>`).join('')}</tbody></table><p class="tr-l">Pour n séances, le prix est P = (prix par séance) × n + (inscription).</p>`;
    const ch = shuffle(R, ['retirer 5 des deux côtés', 'diviser par 2,5 des deux côtés', 'ajouter 5 des deux côtés']);
    return { titre: 'Un club de jeux : les abonnements', doc,
      qs: [{ t: `Quel est le prix par séance de l’offre « ${CLUB[k][0]} », en euros ?`, kind: 'tap', cell: String(k + 1), v: CLUB[k][2], tol: .001, a: eu(CLUB[k][2]) },
        { t: `Calcule le prix de ${nj} séances avec l’offre « ${CLUB[j][0]} », en euros.`, kind: 'num', v: Pj, tol: .006, a: eu(Pj), x: `${eu(CLUB[j][2])} × ${nj} + ${eu(CLUB[j][1])} = ${eu(rnd(CLUB[j][2] * nj, 2))} + ${eu(CLUB[j][1])} = ${eu(Pj)}` },
        { t: `Avec l’offre « ${CLUB[m][0]} », on a payé ${eu(Bm)} €. Combien de séances a-t-on faites ?`, kind: 'num', v: nm, tol: .001, a: String(nm), x: `${eu(Bm)} − ${eu(CLUB[m][1])} = ${eu(rnd(Bm - CLUB[m][1], 2))} ; ${eu(rnd(Bm - CLUB[m][1], 2))} ÷ ${eu(CLUB[m][2])} = ${nm}` },
        { t: 'Pour résoudre 2,5x + 5 = 30, la première étape est de :', kind: 'qcm', choices: ch, ok: ch.indexOf('retirer 5 des deux côtés'), a: 'retirer 5 des deux côtés', x: 'on défait d’abord le nombre ajouté, puis la multiplication' },
        { t: 'Dans P = 2,5 × n + 5, que représente le nombre 5 ?', kind: 'qcm', choices: ['l’inscription, payée une seule fois', 'le prix de chaque séance'], ok: 0, a: 'l’inscription, payée une seule fois', x: 'le nombre 2,5 multiplie n : c’est le prix par séance' }] };
  };

  /* e1 · valeur d’une formule */
  lv('c5e1', (R, niv) => {
    const n1 = pick(R, [3, 4, 5, 6, 8]), L = pick(R, [4, 5, 6, 8, 9]), l = pick(R, [2, 3, 5, 7]), j = pick(R, [2, 3, 4, 5]);
    const P1 = rnd(7.5 * n1 + 2, 2), Pe = 2 * (L + l), Cj = rnd(12 + 4.5 * j, 2);
    if (niv === 0) {
      const items = [num('a', P1, 2, eu(P1), [{ v: rnd(7.5 * (n1 + 2), 2), m: 'Tu as additionné avant de multiplier. On multiplie 7,5 par n, puis on ajoute 2.' }]), num('b', Pe, 0, String(Pe), [{ v: L + l, m: 'C’est la somme L + l. Multiplie-la par 2.' }, { v: 2 * L + l, m: 'Tu n’as multiplié que L par 2. La parenthèse (L + l) est multipliée en entier.' }]), num('c', Cj, 2, eu(Cj), [{ v: rnd(16.5 * j, 2), m: 'Tu as additionné 12 et 4,5 avant de multiplier. On multiplie 4,5 par j, puis on ajoute 12.' }])];
      xs(items, { a: `7,5 × ${n1} + 2 = ${eu(rnd(7.5 * n1, 2))} + 2 = ${eu(P1)} €`, b: `2 × (${L} + ${l}) = 2 × ${L + l} = ${Pe} cm`, c: `12 + 4,5 × ${j} = 12 + ${eu(rnd(4.5 * j, 2))} = ${eu(Cj)} €` });
      return { titre: 'Calculer avec une formule', consigne: 'Pour chaque formule, remplace la lettre par sa valeur, puis calcule en respectant les priorités : parenthèses, puis × et ÷, puis + et −.',
        support: table(['Situation', 'Formule'], [['Cinéma : prix de n places (€)', 'P = 7,5 × n + 2'], ['Rectangle : périmètre (cm)', 'P = 2 × (L + l)'], ['Location : prix de j jours (€)', 'C = 12 + 4,5 × j']]) + `<p class="tr-l">Cinéma : le prix de n places est P = 7,5 × n + 2 (en €).</p>` + ln('a', `Prix de ${n1} places`, eu(P1), 14, '€') + `<p class="tr-l">Périmètre d’un rectangle de longueur ${L} cm et de largeur ${l} cm : P = 2 × (L + l).</p>` + ln('b', 'Périmètre', String(Pe), 14, 'cm') + `<p class="tr-l">Location de matériel : le prix pour j jours est C = 12 + 4,5 × j (en €).</p>` + ln('c', `Prix de ${j} jours`, eu(Cj), 14, '€'), items,
        hints: ['Remplace n par sa valeur, multiplie, puis ajoute.', 'Calcule d’abord la parenthèse L + l, puis multiplie par 2.', 'Multiplie 4,5 par j avant d’ajouter 12.'] };
    }
    if (niv < 0) {
      const m = rnd(7.5 * n1, 2), items = [num('a', m, 2, eu(m), [{ v: n1, m: 'C’est le nombre de places. Multiplie-le par 7,5.' }]), num('b', P1, 2, eu(P1), [{ v: m, m: 'C’est 7,5 × n. N’oublie pas d’ajouter 2.' }]), qcm('c', ['la multiplication', 'l’addition'], 0, 'la multiplication')];
      xs(items, { a: `7,5 × ${n1} = ${eu(m)}`, b: `${eu(m)} + 2 = ${eu(P1)} €`, c: 'on fait la multiplication avant l’addition' });
      return { titre: 'Une formule, pas à pas', consigne: `Un cinéma calcule le prix de n places avec P = 7,5 × n + 2. On calcule le prix de ${n1} places en deux étapes.`,
        support: tabXY('n', 'P (€)', [String(n1)], ['?']) + `<p class="tr-l">Début du calcul : P = 7,5 × ${n1} + 2</p>` + ln('a', `7,5 × ${n1}`, eu(m), 14) + ln('b', 'Prix P, en euros', eu(P1), 14, '€') + `<p class="tr-l">c. Quelle opération fait-on en premier ? (voir la case en dessous)</p>`, items,
        hints: ['On remplace n par la valeur donnée.', 'On multiplie 7,5 par n.', 'Puis on ajoute 2.'] };
    }
    const a = pick(R, [2.5, 3, 4, 4.5]), b = pick(R, [3, 5, 8, 12]), nA = pick(R, [4, 6, 8]), nB = nA + pick(R, [2, 3]), fA = rnd(a * nA + b, 2), fB = rnd(a * nB + b, 2), ec = rnd(fB - fA, 2), nn = pick(R, [5, 7, 9, 10]), tgt = rnd(a * nn + b, 2);
    const items = [num('a', fA, 2, eu(fA), [{ v: rnd(a * (nA + b), 2), m: 'Tu as additionné avant de multiplier.' }]), num('b', fB, 2, eu(fB)), num('c', ec, 2, eu(ec), [{ v: rnd(a * nB, 2), m: 'C’est le prix sans la partie fixe. Fais la différence des deux prix.' }]), num('d', nn, 0, String(nn), [{ v: rnd(tgt / a, 2), m: 'Tu as divisé le prix par ' + eu(a) + ' sans retirer d’abord ' + eu(b) + '.' }])];
    xs(items, { a: `${eu(a)} × ${nA} + ${eu(b)} = ${eu(fA)} €`, b: `${eu(a)} × ${nB} + ${eu(b)} = ${eu(fB)} €`, c: `${eu(fB)} − ${eu(fA)} = ${eu(ec)} € (= ${eu(a)} × ${nB - nA})`, d: `${eu(tgt)} − ${eu(b)} = ${eu(rnd(tgt - b, 2))} ; ${eu(rnd(tgt - b, 2))} ÷ ${eu(a)} = ${nn}` });
    return { titre: 'Une formule dans les deux sens', consigne: `Une salle d’escape game calcule le prix de n personnes avec P = ${eu(a)} × n + ${eu(b)} (en €). Observe comment le prix change, puis retrouve n.`,
      support: tabXY('n', 'P (€)', [String(nA), String(nB)], ['?', '?']) + ln('a', `Prix pour ${nA} personnes`, eu(fA), 14, '€') + ln('b', `Prix pour ${nB} personnes`, eu(fB), 14, '€') + ln('c', 'Écart entre les deux prix', eu(ec), 14, '€') + `<p class="tr-l">Un groupe a payé ${eu(tgt)} €.</p>` + ln('d', 'Nombre de personnes du groupe', String(nn), 14), items,
      hints: ['Remplace n, multiplie, puis ajoute la partie fixe.', 'Même calcul avec la deuxième valeur de n.', 'Écart = deuxième prix − premier prix.', 'Retire la partie fixe, puis divise par le prix d’une personne.'] };
  });

  /* e2 · équations x + a = b, a × x = b, a × x + b = c */
  lv('c5e2', (R, niv) => {
    if (niv === 0) {
      const x1 = int(R, 5, 30), p = int(R, 4, 25), q = x1 + p, m = pick(R, [2, 3, 4, 5, 6, 8]), x2 = int(R, 3, 15), r = m * x2, a = pick(R, [2, 3, 4, 5, 2.5]), x3 = pick(R, [3, 4, 5, 6, 8, 10, 12]), b = pick(R, [3, 5, 6, 8, 12]), c = rnd(a * x3 + b, 2);
      const items = [num('a', x1, 0, String(x1), [{ v: q + p, m: 'Tu as additionné. Pour défaire « + ' + p + ' », on soustrait ' + p + '.' }]), num('b', x2, 0, String(x2), [{ v: r * m, m: 'Tu as multiplié. Pour défaire « × ' + m + ' », on divise par ' + m + '.' }]), num('c', x3, 0, String(x3), [{ v: rnd(c / a, 2), m: 'Tu as divisé avant de retirer ' + b + '. Retire d’abord ' + b + ', puis divise par ' + eu(a) + '.' }, { v: rnd((c + b) / a, 2), m: 'Tu as ajouté ' + b + '. Dans l’équation, ' + b + ' est ajouté à a × x : on le retire.' }])];
      xs(items, { a: `x = ${q} − ${p} = ${x1}`, b: `x = ${r} ÷ ${m} = ${x2}`, c: `${eu(a)}x = ${eu(c)} − ${b} = ${eu(rnd(c - b, 2))} ; x = ${eu(rnd(c - b, 2))} ÷ ${eu(a)} = ${x3}` });
      return { titre: 'Résoudre des équations', consigne: 'Pour chaque équation, fais la même opération des deux côtés du signe égal. Vérifie ensuite chaque solution dans l’équation de départ.',
        support: table(['Équation', 'Ce qui est fait à x', 'Pour le défaire'], [[`x + ${p} = ${q}`, `on ajoute ${p}`, `on soustrait ${p}`], [`${m}x = ${r}`, `on multiplie par ${m}`, `on divise par ${m}`], [`${eu(a)}x + ${b} = ${eu(c)}`, `on multiplie par ${eu(a)}, puis on ajoute ${b}`, `on soustrait ${b}, puis on divise par ${eu(a)}`]]) + `<p class="tr-l">a. Résous x + ${p} = ${q}.</p>` + ln('a', 'x', String(x1), 14) + `<p class="tr-l">b. Résous ${m}x = ${r}.</p>` + ln('b', 'x', String(x2), 14) + `<p class="tr-l">c. Résous ${eu(a)}x + ${b} = ${eu(c)}.</p>` + ln('c', 'x', String(x3), 14), items,
        hints: ['Pour défaire une addition, on soustrait.', 'Pour défaire une multiplication, on divise.', 'Retire d’abord le nombre seul, puis divise par le nombre devant x.'] };
    }
    if (niv < 0) {
      const a = pick(R, [2, 3, 4, 5]), x = int(R, 3, 9), b = pick(R, [3, 4, 5, 6, 7]), c = a * x + b, items = [num('a', c - b, 0, String(c - b), [{ v: c + b, m: 'Tu as additionné. Pour défaire « + ' + b + ' », on retire ' + b + '.' }]), num('b', x, 0, String(x), [{ v: a * (c - b), m: 'Tu as multiplié. Pour trouver x, divise par ' + a + '.' }]), num('c', c, 0, String(c), [{ v: x, m: 'C’est la solution. Remplace x par ' + x + ' dans ' + a + 'x + ' + b + ' et calcule.' }])];
      xs(items, { a: `${c} − ${b} = ${c - b}`, b: `${c - b} ÷ ${a} = ${x}`, c: `${a} × ${x} + ${b} = ${a * x} + ${b} = ${c} ✓` });
      return { titre: 'Une équation, pas à pas', consigne: `Résous ${a}x + ${b} = ${c}. On retire d’abord ${b} des deux côtés, puis on divise par ${a}.`,
        support: table(['Étape', 'Équation'], [['Départ', `${a}x + ${b} = ${c}`], [`On retire ${b} des deux côtés`, `${a}x = ?`], [`On divise par ${a} des deux côtés`, 'x = ?']]) + `<p class="tr-l">Début du calcul : ${a}x + ${b} − ${b} = ${c} − ${b}</p>` + ln('a', `Calcule ${a}x`, String(c - b), 14) + ln('b', 'Calcule x', String(x), 14) + ln('c', `Vérification : ${a} × ${x} + ${b} =`, String(c), 14), items,
        hints: [`Retire ${b} des deux côtés.`, `Divise par ${a} des deux côtés.`, 'Remplace x par la solution.'] };
    }
    const a = pick(R, [3, 4, 5, 6]), x = int(R, 4, 12), b = pick(R, [4, 6, 8, 10]), c = a * x - b, f = pick(R, [5, 8, 10]), pr = pick(R, [2.5, 3, 4]), nmax = pick(R, [6, 7, 9]), B = rnd(pr * nmax + f + pick(R, [0.5, 1]), 2), A1 = rnd(9 * 4, 2), B1 = rnd(7 * 4 + 12, 2);
    const items = [num('a', x, 0, String(x), [{ v: (c - b) / a, m: 'Ici on soustrait b dans l’équation : pour le défaire, on ajoute ' + b + ' des deux côtés.' }]), num('b', nmax, 0, String(nmax), [{ v: Math.ceil((B - f) / pr), m: 'Une séance incomplète ne se paie pas : garde seulement les séances complètes.' }, { v: rnd((B - f) / pr, 2), m: 'Le nombre de séances est entier : arrondis à l’entier inférieur.' }]), num('c', rnd(B1 - A1, 2), 0, eu(B1 - A1)), qcm('d', ['la formule B', 'la formule A'], 1, 'la formule A')];
    xs(items, { a: `${a}x = ${c} + ${b} = ${c + b} ; x = ${c + b} ÷ ${a} = ${x}`, b: `(${eu(B)} − ${f}) ÷ ${eu(pr)} = ${fr(rnd((B - f) / pr, 2))} : ${nmax} séances complètes`, c: `A : 9 × 4 = ${A1} € ; B : 7 × 4 + 12 = ${B1} € ; écart ${B1} − ${A1} = ${eu(B1 - A1)} €`, d: `${A1} < ${B1} : la formule A est moins chère pour 4 séances` });
    return { titre: 'Équations et choix d’une formule', consigne: 'Attention : dans la première équation, on soustrait un nombre. Dans la deuxième question, on ne paie que des séances entières.',
      support: table(['Formule', 'Prix de x séances'], [['A', '9 × x'], ['B', '7 × x + 12']]) + `<p class="tr-l">a. Résous ${a}x − ${b} = ${c}.</p>` + ln('a', 'x', String(x), 14) + `<p class="tr-l">Un club demande ${f} € d’inscription puis ${eu(pr)} € par séance. Un joueur dispose de ${eu(B)} €.</p>` + ln('b', 'Nombre de séances complètes qu’il peut payer', String(nmax), 14) + `<p class="tr-l">Formule A : 9 € la séance. Formule B : 12 € de carte puis 7 € la séance. On prend 4 séances.</p>` + ln('c', 'Écart entre les deux prix (le plus grand moins le plus petit)', eu(B1 - A1), 14, '€') + `<p class="tr-l">d. Quelle formule est la moins chère pour 4 séances ? (voir la case en dessous)</p>`, items,
      hints: ['Pour défaire une soustraction, on ajoute le même nombre des deux côtés.', 'Retire l’inscription, puis divise par le prix d’une séance et garde l’entier inférieur.', 'Calcule les deux prix pour 4 séances.', 'La formule la moins chère a le prix le plus petit.'] };
  });

  /* e3 · isoler une grandeur dans une formule */
  lv('c5e3', (R, niv) => {
    const IU = pick(R, [[2, 460], [5, 1150], [6, 1380], [8, 1840], [10, 2300], [15, 3450]]), v = pick(R, [60, 80, 90, 120]), tt = pick(R, [1.5, 2.5, 3]), d = rnd(v * tt, 2), Ll = pick(R, [4, 5, 6, 8]), ll = pick(R, [3, 5, 7]), A = Ll * ll;
    if (niv === 0) {
      const items = [num('a', IU[0], 0, String(IU[0]), [{ v: IU[1] * 230, m: 'Tu as multiplié. Pour trouver I dans P = U × I, divise P par U.' }]), num('b', tt, 2, fr(tt), [{ v: d * v, m: 'Tu as multiplié. Pour trouver t dans d = v × t, divise d par v.' }]), num('c', ll, 0, String(ll), [{ v: A * Ll, m: 'Tu as multiplié. Pour trouver l dans A = L × l, divise A par L.' }])];
      xs(items, { a: `${IU[1]} = 230 × I ; I = ${IU[1]} ÷ 230 = ${IU[0]} A`, b: `${eu(d)} = ${v} × t ; t = ${eu(d)} ÷ ${v} = ${fr(tt)} h`, c: `${A} = ${Ll} × l ; l = ${A} ÷ ${Ll} = ${ll} cm` });
      return { titre: 'Isoler une grandeur', consigne: 'Écris la formule, remplace les grandeurs connues, puis résous l’équation obtenue. Garde des unités cohérentes.',
        support: table(['Formule', 'Unités'], [['P = U × I', 'P en W, U en V, I en A'], ['d = v × t', 'd en km, v en km/h, t en h'], ['A = L × l', 'A en cm², L et l en cm']]) + `<p class="tr-l">Un appareil de ${fr(IU[1], 0)} W est branché sur 230 V. Formule : P = U × I (W, V, A).</p>` + ln('a', 'Intensité I', String(IU[0]), 14, 'A') + `<p class="tr-l">Un train roule à ${v} km/h et parcourt ${eu(d)} km. Formule : d = v × t (km, km/h, h).</p>` + ln('b', 'Durée t', fr(tt), 14, 'h') + `<p class="tr-l">Un rectangle a une aire de ${A} cm² et une longueur de ${Ll} cm. Formule : A = L × l.</p>` + ln('c', 'Largeur l', String(ll), 14, 'cm'), items,
        hints: ['P = U × I donne I = P ÷ U.', 'd = v × t donne t = d ÷ v.', 'A = L × l donne l = A ÷ L.'] };
    }
    if (niv < 0) {
      const items = [num('a', IU[1], 0, fr(IU[1], 0), [{ v: 230, m: 'C’est la tension. Dans l’équation, P est le nombre connu : 230 × I = ' + fr(IU[1], 0) + '.' }]), num('b', IU[0], 0, String(IU[0]), [{ v: IU[1] * 230, m: 'Tu as multiplié. Pour trouver I, divise P par U.' }]), qcm('c', ['des ampères (A)', 'des volts (V)', 'des watts (W)'], 0, 'des ampères (A)')];
      xs(items, { a: `P = ${fr(IU[1], 0)} W, donc ${fr(IU[1], 0)} = 230 × I`, b: `I = ${fr(IU[1], 0)} ÷ 230 = ${IU[0]}`, c: 'l’intensité se mesure en ampères' });
      return { titre: 'Une formule, pas à pas', consigne: `Un appareil de ${fr(IU[1], 0)} W fonctionne sous 230 V. On cherche l’intensité I avec P = U × I.`,
        support: table(['P (W)', 'U (V)', 'I (A)'], [[fr(IU[1], 0), '230', '?']]) + `<p class="tr-l">Début du calcul : ${fr(IU[1], 0)} = 230 × I</p>` + ln('a', 'Quelle valeur est égale à 230 × I ?', fr(IU[1], 0), 14) + ln('b', 'Intensité I, en ampères', String(IU[0]), 14, 'A') + `<p class="tr-l">c. L’intensité s’exprime en quelle unité ? (voir la case en dessous)</p>`, items,
        hints: ['On remplace P et U par leurs valeurs.', 'Pour trouver I, on divise P par U.', 'L’intensité se mesure en ampères.'] };
    }
    const I1 = pick(R, [4, 5, 8, 10]), I2 = pick(R, [3, 5, 6]), U = 230, T1 = rnd(I1 * U, 0), T2 = I2 * U, tot = I1 + I2, lim = pick(R, [10, 16, 20]), vv = pick(R, [80, 90, 120]), dd = pick(R, [60, 90, 150, 210]), th = dd / vv, mn = rnd(th * 60, 0);
    const items = [num('a', tot, 0, String(tot), [{ v: rnd((T1 + T2) / U / 2, 1), m: 'Calcule chaque intensité avec P ÷ U, puis additionne-les.' }]), qcm('b', ['non', 'oui'], tot > lim ? 0 : 1, tot > lim ? 'non' : 'oui'), num('c', th, 2, fr(th), [{ v: dd * vv, m: 'Tu as multiplié. Pour trouver t, divise d par v.' }]), num('d', mn, 0, String(mn), [{ v: th, m: 'C’est la durée en heures. Multiplie par 60 pour avoir des minutes.' }])];
    xs(items, { a: `${fr(T1, 0)} ÷ 230 = ${I1} A ; ${fr(T2, 0)} ÷ 230 = ${I2} A ; ${I1} + ${I2} = ${tot} A`, b: `${tot} A ${tot > lim ? 'dépasse' : 'ne dépasse pas'} ${lim} A`, c: `${dd} ÷ ${vv} = ${fr(th)} h`, d: `${fr(th)} × 60 = ${mn} min` });
    return { titre: 'Électricité et trajet', consigne: 'Deux appareils sont branchés sur la même prise sous 230 V (P = U × I). Puis un trajet à vitesse constante (d = v × t).',
      support: table(['Appareil', 'Puissance (W)', 'Tension (V)'], [['Appareil 1', fr(T1, 0), '230'], ['Appareil 2', fr(T2, 0), '230']]) + `<p class="tr-l">La prise supporte ${lim} A au maximum.</p>` + ln('a', 'Intensité totale', String(tot), 14, 'A') + `<p class="tr-l">b. Peut-on brancher les deux appareils en même temps ? (voir la case en dessous)</p><p class="tr-l">Un trajet de ${dd} km est parcouru à ${vv} km/h.</p>` + ln('c', 'Durée, en heures', fr(th), 14, 'h') + ln('d', 'Durée, en minutes', String(mn), 14, 'min'), items,
      hints: ['I = P ÷ U pour chaque appareil, puis on additionne.', 'Compare l’intensité totale à la limite.', 't = d ÷ v.', '1 h = 60 min.'] };
  });
  if (typeof module !== 'undefined') module.exports = { CLUB };
  /* ===== exercice ajouté (3 niveaux) : notion 2 (résoudre x + a = b et a × x = b) ===== */
  {
    const { fr, rnd, pick, int, shuffle, table, tb, svg, T, num, qcm, ln, tabXY, lv, eur, L } = H;
    /* trame d’un exercice : rows { lab, v, d, a, x, err, w, un } ou { lab, qcm, ok, x } ; aide : ligne d’aide du niveau guidé */
    const QC = (titre, consigne, rows, hints, pre = '', aide = '') => {
      const items = rows.map((r, i) => { const k = L[i], d = r.d == null ? 2 : r.d; const it = r.qcm ? qcm(k, r.qcm, r.ok, r.a) : num(k, r.v, d, r.a != null ? r.a : (Number.isInteger(rnd(r.v, d)) ? fr(r.v, 0) : d === 2 ? fr(r.v, 2) : fr(rnd(r.v, d))), r.err || []); if (r.x) it.x = r.x; return it; });
      return { titre, consigne, support: pre + (aide ? `<p class="tr-l">Aide : ${aide}</p>` : '') + rows.map((r, i) => r.qcm ? `<p class="tr-l">${L[i]}. ${r.lab}</p>` : ln(L[i], r.lab, items[i].a, r.w || 14, r.un || '')).join(''), items, hints };
    };
    lv('c5e4', (R, niv) => {
      const eqt = t => table(['Équation'], t.map(x => [x]));
      if (niv < 0) {
        const a = int(R, 3, 12), b = a + int(R, 4, 20), c = pick(R, [2, 3, 4, 5]), x = int(R, 3, 9), p = c * x, u3 = pick(R, [4.5, 6, 7.5, 12]), t3 = 3 * u3;
        return QC('Équations, pas à pas', 'Résous chaque équation : fais la même opération des deux côtés.', [
          { lab: `x + ${a} = ${b} : x =`, v: b - a, d: 0, w: 12, x: `On soustrait ${a} des deux côtés : x = ${b} − ${a} = ${b - a}`, err: [{ v: a + b, m: 'Pour défaire une addition, on soustrait.' }] },
          { lab: `${c} × x = ${p} : x =`, v: x, d: 0, w: 12, x: `On divise par ${c} des deux côtés : x = ${p} ÷ ${c} = ${x}`, err: [{ v: p * c, m: 'Pour défaire une multiplication, on divise.' }] },
          { lab: 'Pour résoudre x + a = b, on…', qcm: ['soustrait a des deux côtés', 'ajoute a des deux côtés'], ok: 0, x: 'L’addition se défait par la soustraction : on soustrait a des deux côtés.' },
          { lab: `Trois articles identiques coûtent ${fr(t3)} € : prix d’un article`, v: u3, d: 2, w: 12, un: '€', x: `3 × x = ${fr(t3)} donne x = ${fr(t3)} ÷ 3 = ${fr(u3)} €` }],
          ['On fait la même opération des deux côtés de l’égalité.', 'x + a = b : on soustrait a. a × x = b : on divise par a.', 'Vérifie en remplaçant x par ta solution.'], eqt([`x + ${a} = ${b}`, `${c} × x = ${p}`]), 'l’addition se défait par une soustraction, la multiplication par une division.');
      }
      if (niv === 0) {
        const a = pick(R, [2.5, 3.5, 4.5, 12.5]), b = rnd(a + pick(R, [7.5, 10, 15.5, 20]), 2), c = pick(R, [2.5, 4, 1.5, 0.5]), x = pick(R, [4, 6, 8, 12]), p = rnd(c * x, 2), fr_ = pick(R, [15, 20, 25]), tot = fr_ + pick(R, [45, 60, 120]);
        return QC('Résoudre x + a = b et a × x = b', 'Résous chaque équation, puis réponds à la question.', [
          { lab: `x + ${fr(a)} = ${fr(b)} : x =`, v: rnd(b - a, 2), d: 2, w: 12, x: `x = ${fr(b)} − ${fr(a)} = ${fr(b - a)}`, err: [{ v: rnd(a + b, 2), m: 'Pour défaire une addition, on soustrait.' }] },
          { lab: `${fr(c)} × x = ${fr(p)} : x =`, v: x, d: 2, w: 12, x: `x = ${fr(p)} ÷ ${fr(c)} = ${fr(x, 0)}`, err: [{ v: rnd(p * c, 2), m: 'Pour défaire une multiplication, on divise.' }] },
          { lab: `Une facture de ${fr(tot, 0)} € comprend ${fr_} € de frais de port. Prix des articles, x + ${fr_} = ${fr(tot, 0)} :`, v: tot - fr_, d: 2, w: 12, un: '€', x: `x = ${fr(tot, 0)} − ${fr_} = ${fr(tot - fr_, 0)} €` },
          { lab: `Vérification : pour x = ${fr(x, 0)}, ${fr(c)} × x vaut`, v: p, d: 2, w: 12, x: `${fr(c)} × ${fr(x, 0)} = ${fr(p)}, ce qui est bien ${fr(p)} : la solution est juste.` }],
          ['Même opération des deux côtés.', 'Addition → soustraction. Multiplication → division.', 'On vérifie en remplaçant x.'], eqt([`x + ${fr(a)} = ${fr(b)}`, `${fr(c)} × x = ${fr(p)}`]));
      }
      const a = pick(R, [4.5, 7.5, 12, 18]), b = rnd(pick(R, [10, 14.5, 20, 35]), 2), c = pick(R, [2, 4, 5, 8]), x = pick(R, [3.5, 4.5, 7.5, 12]), p = rnd(x / c, 2) , d = pick(R, [1.2, 2.5, 6]), x2 = pick(R, [5, 8, 12]), q = rnd(d * x2, 2);
      return QC('Équations : x − a = b, x ÷ a = b et a × x = b', 'Résous chaque équation et vérifie ton résultat.', [
        { lab: `x − ${fr(a)} = ${fr(b)} : x =`, v: rnd(b + a, 2), d: 2, w: 12, x: `On ajoute ${fr(a)} des deux côtés : x = ${fr(b)} + ${fr(a)} = ${fr(b + a)}`, err: [{ v: rnd(b - a, 2), m: 'Pour défaire une soustraction, on ajoute.' }] },
        { lab: `x ÷ ${c} = ${fr(p)} : x =`, v: x, d: 2, w: 12, x: `On multiplie par ${c} des deux côtés : x = ${fr(p)} × ${c} = ${fr(x)}`, err: [{ v: rnd(p / c, 2), m: 'Pour défaire une division, on multiplie.' }] },
        { lab: `${fr(d)} × x = ${fr(q)} : x =`, v: x2, d: 2, w: 12, x: `x = ${fr(q)} ÷ ${fr(d)} = ${fr(x2, 0)}`, err: [{ v: rnd(q * d, 2), m: 'Divise ' + fr(q) + ' par ' + fr(d) + '.' }] },
        { lab: `Pour x = ${fr(x2, 0)}, ${fr(d)} × x + ${fr(a)} vaut`, v: rnd(q + a, 2), d: 2, w: 12, x: `${fr(d)} × ${fr(x2, 0)} + ${fr(a)} = ${fr(q)} + ${fr(a)} = ${fr(q + a)}` },
        { lab: 'Pour défaire une division par c, on…', qcm: ['multiplie par c', 'divise par c'], ok: 0, x: 'La division se défait par la multiplication : on multiplie par c des deux côtés.' }],
        ['Soustraction → addition. Division → multiplication.', 'a × x = b : x = b ÷ a.', 'Remplace x par ta solution pour vérifier.'], eqt([`x − ${fr(a)} = ${fr(b)}`, `x ÷ ${c} = ${fr(p)}`, `${fr(d)} × x = ${fr(q)}`]));
    });
  }
})(typeof module !== 'undefined' ? module.exports : window);
