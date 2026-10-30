/* CAP Maths · chapitre 4 — Pourcentages et échelles : pourcentage d’une quantité, hausse et baisse, taux d’évolution, échelle.
   Chaque exercice « Je m’entraîne » existe en trois niveaux : courant (id), 🌱 guidé (id + 'a'), 🚀 défi (id + 'd'). Toutes les réponses sont calculées. */
(function (root) {
  'use strict';
  const { DEP, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, tb, T, svg, table, num, qcm, pick, int, xs, lv, shuffle, rnd, ln, tabXY, f1, f2 } = H;
  /* tarifs Netflix France (JeChange ; hausse du 18 avril 2025) : [offre, avant, après] */
  const NFX = [['Standard avec pub', 5.99, 7.99], ['Standard', 13.49, 14.99], ['Premium', 19.99, 21.99]];

  DEP.c4 = R => {
    const k = int(R, 0, 2), j = (k + 1 + int(R, 0, 1)) % 3, m = int(R, 0, 2), ch = shuffle(R, ['le prix avant la hausse', 'le prix après la hausse', 'la somme des deux prix']);
    const doc = `<table class="dt tcx dt-sm"><thead><tr><th>Offre Netflix</th><th>Avant (€/mois)</th><th>Après (€/mois)</th></tr></thead><tbody>${NFX.map((x, i) => `<tr><th>${x[0]}</th><td>${fr(x[1], 2)}</td><td data-cell="${i + 1}">${fr(x[2], 2)}</td></tr>`).join('')}</tbody></table><p class="srcl">Tarifs mensuels en France avant et après la hausse d’avril 2025. Source : JeChange, « Tarifs Netflix », page mise à jour le 30 septembre 2026.</p>`;
    const ec = rnd(NFX[j][2] - NFX[j][1], 2), tx = (NFX[0][2] - NFX[0][1]) / NFX[0][1] * 100;
    return { titre: 'Netflix : la hausse de 2025', doc,
      qs: [{ t: `Quel est le prix de l’offre « ${NFX[k][0]} » après la hausse, en euros ?`, kind: 'tap', cell: String(k + 1), v: NFX[k][2], tol: .001, a: fr(NFX[k][2], 2) },
        { t: `De combien d’euros le prix de l’offre « ${NFX[j][0]} » a-t-il augmenté ?`, kind: 'num', v: ec, tol: .006, a: fr(ec, 2), x: `${fr(NFX[j][2], 2)} − ${fr(NFX[j][1], 2)} = ${fr(ec, 2)}` },
        { t: 'Pour calculer un taux d’évolution, on divise l’écart par :', kind: 'qcm', choices: ch, ok: ch.indexOf('le prix avant la hausse'), a: 'le prix avant la hausse', x: 'on divise toujours par la valeur de départ' },
        { t: `Calcule 10 % du prix de départ de l’offre « ${NFX[m][0]} », arrondi au centime.`, kind: 'num', v: rnd(NFX[m][1] / 10, 2), tol: .006, a: fr(rnd(NFX[m][1] / 10, 2), 2), x: `${fr(NFX[m][1], 2)} ÷ 10 = ${fr(NFX[m][1] / 10, 3)}, soit ${fr(rnd(NFX[m][1] / 10, 2), 2)} €` },
        { t: 'Le prix de l’offre « Standard avec pub » a-t-il augmenté de plus de 30 % ?', kind: 'qcm', choices: ['oui', 'non'], ok: 0, a: 'oui', x: `2,00 ÷ 5,99 ≈ ${fr(rnd(tx / 100, 3), 3)}, soit ${f1(tx)} %` }] };
  };

  /* e1 · pourcentage d’une quantité : remises et parts */
  const ART = [['la manette', [30, 45, 60]], ['le casque', [60, 80, 120]], ['le jeu', [40, 50, 60, 80]], ['le sac', [25, 40, 60]]];
  const SAL = [[28, 40], [35, 50], [60, 80], [30, 200], [42, 60], [18, 24]];
  lv('c4e1', (R, niv) => {
    const arts = shuffle(R, ART).slice(0, 3).map(([n, ps]) => [n, pick(R, ps)]), P = [10, 20, 25, 30, 50], ps = arts.map(() => pick(R, P)), [V, N] = pick(R, SAL);
    const rem = arts.map((a, i) => rnd(a[1] * ps[i] / 100, 2)), eu = x => fr(x, Number.isInteger(rnd(x, 2)) ? 0 : 2);
    const tab = table(['Article (fictif)', 'Prix de départ (€)', 'Remise (%)'], arts.map((a, i) => [a[0].replace(/^l[ea] /, ''), String(a[1]), String(ps[i])]));
    if (niv === 0) {
      const items = [num('a', rem[0], 2, eu(rem[0]), [{ v: arts[0][1], m: 'C’est le prix de départ. Calcule le pourcentage de ce prix : prix × remise ÷ 100.' }]), num('b', rnd(arts[1][1] - rem[1], 2), 2, eu(arts[1][1] - rem[1]), [{ v: rem[1], m: 'C’est la remise. Retire-la du prix de départ.' }]), num('c', V * 100 / N, 1, fr(V * 100 / N), [{ v: V / N, m: 'Multiplie par 100 pour avoir un pourcentage.' }])];
      xs(items, { a: `${arts[0][1]} × ${ps[0]} ÷ 100 = ${eu(rem[0])} €`, b: `${arts[1][1]} × ${ps[1]} ÷ 100 = ${eu(rem[1])} € de remise ; ${arts[1][1]} − ${eu(rem[1])} = ${eu(arts[1][1] - rem[1])} €`, c: `${V} ÷ ${N} = ${fr(V / N)} ; × 100 = ${fr(V * 100 / N)} %` });
      return { titre: 'Soldes et parts', consigne: `Une boutique (fictive) affiche ses soldes. Une remise de p % sur un prix, c’est le prix × p ÷ 100.`,
        support: tab + ln('a', `Remise sur ${arts[0][0]}, en euros`, eu(rem[0]), 14, '€') + ln('b', `Prix soldé de ${arts[1][0]}, en euros`, eu(arts[1][1] - rem[1]), 14, '€') + `<p class="tr-l">Une salle de cinéma (fictive) a ${N} places. Elle en a vendu ${V}.</p>` + ln('c', 'Pourcentage de places vendues', fr(V * 100 / N), 14, '%'), items,
        hints: ['Remise = prix de départ × pourcentage ÷ 100.', 'Prix soldé = prix de départ − remise.', 'Part en % = nombre de places vendues ÷ nombre de places × 100.'] };
    }
    const P0 = arts[0][1], u = rnd(P0 / 10, 2);
    if (niv < 0) {
      const p3 = pick(R, [20, 30, 40]), k = p3 / 10, items = [num('a', u, 2, fr(u), [{ v: P0, m: 'C’est le prix. Pour 10 %, divise-le par 10.' }]), num('b', rnd(u * k, 2), 2, fr(rnd(u * k, 2)), [{ v: u, m: `C’est 10 %. Pour ${p3} %, multiplie par ${k}.` }]), num('c', rnd(P0 - u * k, 2), 2, fr(rnd(P0 - u * k, 2)), [{ v: rnd(u * k, 2), m: 'C’est la remise. Retire-la du prix de départ.' }])];
      xs(items, { a: `${P0} ÷ 10 = ${fr(u)} €`, b: `${k} × ${fr(u)} = ${fr(rnd(u * k, 2))} €`, c: `${P0} − ${fr(rnd(u * k, 2))} = ${fr(rnd(P0 - u * k, 2))} €` });
      return { titre: 'Une remise, pas à pas', consigne: `Une boutique (fictive) solde ${arts[0][0]} : prix de départ ${P0} €, remise de ${p3} %. On calcule d’abord 10 %, puis la remise.`,
        support: table(['Prix de départ (€)', '10 % du prix (€)', `${p3} % du prix (€)`, 'Prix soldé (€)'], [[String(P0), '?', '?', '?']]) + `<p class="tr-l">Début du calcul : 10 % de ${P0} = ${P0} ÷ 10</p>` + ln('a', '10 % du prix', fr(u), 14, '€') + ln('b', `${p3} % du prix (la remise)`, fr(rnd(u * k, 2)), 14, '€') + ln('c', 'Prix soldé', fr(rnd(P0 - u * k, 2)), 14, '€'), items,
        hints: ['10 % d’une quantité : on divise par 10.', `${p3} % = ${k} fois 10 %.`, 'Prix soldé = prix de départ − remise.'] };
    }
    const P1 = pick(R, [40, 48, 60, 64, 80]), P0b = rnd(P1 / .8, 2), items = [num('a', rem[0], 2, eu(rem[0])), num('b', rnd(arts[1][1] * (1 - ps[1] / 100), 2), 2, eu(arts[1][1] * (1 - ps[1] / 100)), [{ v: rem[1], m: 'C’est la remise. Le prix soldé se calcule avec le coefficient 1 − remise ÷ 100.' }]), num('c', V * 100 / N, 1, fr(V * 100 / N)), num('d', P0b, 2, eu(P0b), [{ v: rnd(P1 * 1.2, 2), m: 'On ne rajoute pas 20 % au prix soldé. Le prix soldé représente 80 % du prix de départ : divise par 0,80.' }])];
    xs(items, { a: `${arts[0][1]} × ${ps[0]} ÷ 100 = ${eu(rem[0])} €`, b: `coefficient ${fr(1 - ps[1] / 100)} : ${arts[1][1]} × ${fr(1 - ps[1] / 100)} = ${eu(arts[1][1] * (1 - ps[1] / 100))} €`, c: `${V} ÷ ${N} × 100 = ${fr(V * 100 / N)} %`, d: `${P1} ÷ 0,80 = ${eu(P0b)} €` });
    return { titre: 'Soldes, parts et prix de départ', consigne: 'Une boutique (fictive) affiche ses soldes. Attention à la dernière question : on part du prix soldé et on cherche le prix de départ.',
      support: tab + ln('a', `Remise sur ${arts[0][0]}, en euros`, eu(rem[0]), 14, '€') + ln('b', `Prix soldé de ${arts[1][0]} (avec le coefficient)`, eu(arts[1][1] * (1 - ps[1] / 100)), 14, '€') + `<p class="tr-l">Une salle de cinéma (fictive) a ${N} places. Elle en a vendu ${V}.</p>` + ln('c', 'Pourcentage de places vendues', fr(V * 100 / N), 14, '%') + `<p class="tr-l">Un article soldé de 20 % coûte ${P1} €.</p>` + ln('d', 'Son prix de départ', eu(P0b), 14, '€'), items,
      hints: ['Remise = prix × pourcentage ÷ 100.', 'Prix soldé = prix × (1 − pourcentage ÷ 100).', 'Part en % = partie ÷ total × 100.', 'Le prix soldé représente 80 % du prix de départ : prix de départ = prix soldé ÷ 0,80.'] };
  });

  /* e2 · hausse, baisse et taux d’évolution */
  lv('c4e2', (R, niv) => {
    if (niv === 0) {
      const [A, B] = pick(R, [[8, 10], [10, 12], [12, 15], [15, 18], [20, 25], [16, 20]]), t = pick(R, [10, 20, 25, 50]), tx = (B - A) / A * 100, fin = rnd(B * (1 - t / 100), 2);
      const items = [num('a', B - A, 2, fr(B - A), [{ v: B, m: 'C’est le prix d’arrivée. L’écart est la différence entre les deux prix.' }]), num('b', rnd(tx, 1), 1, f1(tx), [{ v: B - A, m: 'C’est l’écart en euros. Divise-le par le prix de départ, puis multiplie par 100.' }, { v: rnd((B - A) / B * 100, 1), m: 'Tu as divisé par le prix d’arrivée. Il faut diviser par le prix de départ.' }]), num('c', fin, 2, fr(fin), [{ v: rnd(B * (1 + t / 100), 2), m: 'Tu as appliqué une hausse. Une baisse multiplie par 1 − pourcentage ÷ 100.' }, { v: rnd(B * t / 100, 2), m: 'C’est la remise en euros. Retire-la du prix, ou multiplie par le coefficient.' }])];
      xs(items, { a: `${B} − ${A} = ${B - A} €`, b: `${B - A} ÷ ${A} = ${fr(rnd((B - A) / A, 3))} ; × 100 = ${f1(tx)} %`, c: `coefficient ${fr(1 - t / 100)} : ${B} × ${fr(1 - t / 100)} = ${fr(fin)} €` });
      return { titre: 'Un abonnement qui change de prix', consigne: `Un abonnement de streaming (fictif) passe de ${A} € à ${B} € par mois. Le mois suivant, une promotion le fait baisser de ${t} %.`,
        support: tabXY('Prix', 'en €', ['Avant', 'Après', 'Promotion'], [String(A), String(B), '?']) + ln('a', 'Écart entre les deux premiers prix', fr(B - A), 14, '€') + ln('b', 'Taux d’évolution (au dixième)', f1(tx), 14, '%') + ln('c', `Prix après la baisse de ${t} %`, fr(fin), 14, '€'), items,
        hints: ['Écart = prix d’arrivée − prix de départ.', 'Taux = écart ÷ prix de départ, puis × 100.', `Baisse de ${t} % : coefficient ${fr(1 - t / 100)}.`] };
    }
    if (niv < 0) {
      const P = pick(R, [40, 60, 80, 120]), t = pick(R, [10, 20, 25, 50]), co = 1 + t / 100, fin = rnd(P * co, 2);
      const items = [num('a', co, 2, fr(co), [{ v: t / 100, m: `C’est ${t} % écrit en nombre. Pour une hausse, ajoute-le à 1.` }]), num('b', fin, 2, fr(fin), [{ v: rnd(P * t / 100, 2), m: 'C’est la hausse en euros. Le nouveau prix est le prix de départ plus la hausse, ou prix × coefficient.' }]), qcm('c', ['plus grand', 'plus petit'], 0, 'plus grand')];
      xs(items, { a: `1 + ${t} ÷ 100 = ${fr(co)}`, b: `${P} × ${fr(co)} = ${fr(fin)} €`, c: 'une hausse donne un prix plus grand' });
      return { titre: 'Une hausse, pas à pas', consigne: `Le prix d’un jeu (fictif) est de ${P} €. Il augmente de ${t} %. Une hausse de ${t} % multiplie le prix par 1 + ${t} ÷ 100.`,
        support: tabXY('Prix', 'en €', ['Avant', 'Après'], [String(P), '?']) + `<p class="tr-l">Début du calcul : coefficient = 1 + ${t} ÷ 100</p>` + ln('a', 'Coefficient multiplicateur', fr(co), 14) + ln('b', 'Nouveau prix', fr(fin), 14, '€') + `<p class="tr-l">c. Le nouveau prix est-il plus grand ou plus petit que ${P} € ? (voir la case en dessous)</p>`, items,
        hints: ['Hausse de t % : coefficient = 1 + t ÷ 100.', 'Nouveau prix = prix de départ × coefficient.', 'Une hausse augmente le prix.'] };
    }
    const P = pick(R, [80, 100, 200]), t = pick(R, [10, 20, 25, 50]), h = rnd(P * (1 + t / 100), 2), b = rnd(h * (1 - t / 100), 2), d = rnd(P - b, 2);
    const items = [num('a', h, 2, fr(h), [{ v: rnd(P * t / 100, 2), m: 'C’est la hausse en euros. Le prix après la hausse est le prix de départ × coefficient.' }]), num('b', b, 2, fr(b), [{ v: P, m: 'Une baisse de pourcentage s’applique au prix du moment (celui après la hausse), pas au prix de départ.' }]), num('c', d, 2, fr(d)), qcm('d', ['oui', 'non'], 1, 'non')];
    xs(items, { a: `${P} × ${fr(1 + t / 100)} = ${fr(h)} €`, b: `${fr(h)} × ${fr(1 - t / 100)} = ${fr(b)} €`, c: `${P} − ${fr(b)} = ${fr(d)} €`, d: 'le prix final est différent du prix de départ' });
    return { titre: 'Une hausse puis une baisse', consigne: `Un accessoire (fictif) coûte ${P} €. Son prix augmente de ${t} %, puis il baisse de ${t} %. Attention : chaque pourcentage s’applique au prix du moment.`,
      support: tabXY('Étape', 'Prix (€)', ['Départ', `Hausse de ${t} %`, `Baisse de ${t} %`], [String(P), '?', '?']) + ln('a', 'Prix après la hausse', fr(h), 14, '€') + ln('b', 'Prix après la baisse', fr(b), 14, '€') + ln('c', 'Écart avec le prix de départ', fr(d), 14, '€') + `<p class="tr-l">d. Retrouve-t-on le prix de départ ? (voir la case en dessous)</p>`, items,
      hints: [`Hausse de ${t} % : coefficient ${fr(1 + t / 100)}.`, `Baisse de ${t} % : coefficient ${fr(1 - t / 100)}, appliqué au prix après la hausse.`, 'Écart = prix de départ − prix final.', 'Compare le prix final et le prix de départ.'] };
  });

  /* e3 · échelles */
  const plan = (L, l, e) => { const w = L * 28, h = l * 28; return svg(360, 190, `<rect x="40" y="40" width="${w}" height="${h}" rx="4" class="k2 ks" stroke-width="2.2"/>${T(40 + w / 2, 30, `${fr(L)} cm`, { fs: 13 })}${T(40 + w + 8, 40 + h / 2 + 4, `${fr(l)} cm`, { fs: 13, a: 'start' })}${T(40 + w / 2, 40 + h / 2 + 5, 'salle', { fs: 14, c: 'ts' })}${T(320, 24, `échelle 1/${e}`, { fs: 14, a: 'end', c: 'kt' })}`, `Plan d’une salle de ${fr(L)} cm sur ${fr(l)} cm à l’échelle 1 sur ${e}`).replace('<svg ', '<svg style="max-width:96mm;height:auto" '); };
  lv('c4e3', (R, niv) => {
    if (niv === 0) {
      const e = pick(R, [50, 100, 200]), L = pick(R, [4, 5, 6, 7.5, 8]), l = pick(R, [3, 4, 5]), X = pick(R, [1.2, 1.5, 2, 2.4]), rL = L * e / 100, rl = l * e / 100, xp = rnd(X * 100 / e, 2);
      const items = [num('a', rL, 2, fr(rL), [{ v: L * e, m: 'C’est la longueur en centimètres. On demande des mètres : divise par 100.' }, { v: rnd(L / e, 3), m: 'Tu as divisé. Du plan vers la réalité, on multiplie par l’échelle.' }]), num('b', rl, 2, fr(rl), [{ v: l * e, m: 'C’est la longueur en centimètres. On demande des mètres : divise par 100.' }]), num('c', xp, 2, fr(xp), [{ v: X * e, m: 'Tu as multiplié. Pour dessiner, on divise la longueur réelle par l’échelle (en cm).' }, { v: X / e, m: 'Convertis d’abord 1 m = 100 cm, puis divise par ' + e + '.' }])];
      xs(items, { a: `${fr(L)} × ${e} = ${fr(L * e)} cm, soit ${fr(rL)} m`, b: `${fr(l)} × ${e} = ${fr(l * e)} cm, soit ${fr(rl)} m`, c: `${fr(X)} m = ${fr(X * 100)} cm ; ${fr(X * 100)} ÷ ${e} = ${fr(xp)} cm` });
      return { titre: 'Le plan d’une salle', consigne: `Voici le plan d’une salle de jeux (fictive) à l’échelle 1/${e} : 1 cm sur le plan représente ${e} cm en vrai.`,
        support: plan(L, l, e) + ln('a', 'Longueur réelle de la salle, en mètres', fr(rL), 14, 'm') + ln('b', 'Largeur réelle de la salle, en mètres', fr(rl), 14, 'm') + ln('c', `Longueur sur le plan d’une table de ${fr(X)} m, en cm`, fr(xp), 14, 'cm'), items,
        hints: ['Longueur réelle = longueur sur le plan × échelle (en cm).', '1 m = 100 cm : pour passer des cm aux m, divise par 100.', 'Sur le plan : longueur réelle en cm ÷ échelle.'] };
    }
    if (niv < 0) {
      const L = pick(R, [3, 4, 5, 6]), items = [num('a', 100, 0, '100', [{ v: 1, m: 'À l’échelle 1/100, 1 cm sur le plan représente 100 cm en vrai.' }]), num('b', L * 100, 0, String(L * 100)), num('c', L, 0, String(L), [{ v: L * 100, m: 'C’est la longueur en cm. Divise par 100 pour avoir des mètres.' }])];
      xs(items, { a: 'échelle 1/100 : 1 cm → 100 cm', b: `${L} × 100 = ${L * 100} cm`, c: `${L * 100} cm = ${L} m` });
      return { titre: 'Une échelle, pas à pas', consigne: `Sur le plan d’une salle (fictive) à l’échelle 1/100, un mur mesure ${L} cm. On calcule la longueur réelle.`,
        support: plan(L, 3, 100) + `<p class="tr-l">Début du calcul : ${L} × 100 = ?</p>` + ln('a', '1 cm sur le plan représente combien de cm en vrai', '100', 14, 'cm') + ln('b', 'Longueur réelle du mur, en cm', String(L * 100), 14, 'cm') + ln('c', 'Longueur réelle du mur, en m', String(L), 14, 'm'), items,
        hints: ['Échelle 1/100 : 1 cm sur le plan, 100 cm en vrai.', 'Longueur réelle = longueur sur le plan × 100.', '1 m = 100 cm.'] };
    }
    const e = pick(R, [100000, 200000]), d = pick(R, [3.5, 4, 5, 6.5]), Rk = pick(R, [9, 12, 15]), cm = d * e, km = cm / 100000, rc = rnd(Rk * 100000 / e, 2);
    const items = [num('a', cm, 0, fr(cm, 0), [{ v: rnd(d / e, 8), m: 'Tu as divisé. Du plan vers la réalité, on multiplie par l’échelle.' }]), num('b', km, 2, fr(km), [{ v: cm / 100, m: 'Tu as converti en mètres. 1 km = 100 000 cm : divise par 100 000.' }]), num('c', rc, 2, fr(rc), [{ v: Rk * 1000, m: 'Tu as converti en mètres. Il faut passer en centimètres, puis diviser par l’échelle.' }])];
    xs(items, { a: `${fr(d)} × ${fr(e, 0)} = ${fr(cm, 0)} cm`, b: `${fr(cm, 0)} ÷ 100 000 = ${fr(km)} km`, c: `${Rk} km = ${fr(Rk * 100000, 0)} cm ; ${fr(Rk * 100000, 0)} ÷ ${fr(e, 0)} = ${fr(rc)} cm` });
    return { titre: 'Une carte routière', consigne: `Sur une carte routière à l’échelle 1/${fr(e, 0)}, deux villes sont distantes de ${fr(d)} cm. Rappel : 1 km = 100 000 cm.`,
      support: table(['Échelle de la carte', 'Distance sur la carte'], [[`1/${fr(e, 0)}`, `${fr(d)} cm`]]) + ln('a', 'Distance réelle, en cm', fr(cm, 0), 18, 'cm') + ln('b', 'Distance réelle, en km', fr(km), 14, 'km') + `<p class="tr-l">Une route de ${Rk} km est dessinée sur cette carte.</p>` + ln('c', 'Sa longueur sur la carte, en cm', fr(rc), 14, 'cm'), items,
      hints: ['Distance réelle = distance sur la carte × échelle.', '1 km = 100 000 cm : pour passer des cm aux km, divise par 100 000.', 'Passe la longueur réelle en cm, puis divise par l’échelle.'] };
  });
  if (typeof module !== 'undefined') module.exports = { NFX };
})(typeof module !== 'undefined' ? module.exports : window);
