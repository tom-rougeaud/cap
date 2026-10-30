/* CAP Maths · chapitre 8 — Calculs commerciaux : prix HT et TTC, remise et facture, marge et taux de marge.
   Chaque exercice « Je m’entraîne » existe en trois niveaux : courant (id), 🌱 guidé (id + 'a'), 🚀 défi (id + 'd'). Toutes les réponses sont calculées. */
(function (root) {
  'use strict';
  const { DEP, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, tb, T, svg, table, num, qcm, pick, int, xs, lv, shuffle, rnd, ln, tabXY, f1, f2 } = H;
  const eu = x => fr(x, Number.isInteger(rnd(x, 2)) ? 0 : 2);
  const ART = [['la manette', 60], ['le casque', 50], ['le jeu', 40], ['le sac', 25]];

  DEP.c8 = R => {
    const k = int(R, 0, 3), j = (k + 1 + int(R, 0, 2)) % 4, m = (j + 1 + int(R, 0, 2)) % 4, A = pick(R, [20, 25, 30, 40]), G = pick(R, [6, 8, 10, 12]);
    const doc = `<table class="dt tcx dt-sm"><thead><tr><th>Article (fictif)</th><th>Prix HT (€)</th></tr></thead><tbody>${ART.map((x, i) => `<tr><th>${x[0].replace(/^l[ea] /, '')}</th><td data-cell="${i + 1}">${x[1]}</td></tr>`).join('')}</tbody></table><p class="tr-l">La TVA est de 20 %.</p>`;
    const ch = shuffle(R, ['1,20', '0,20', '0,80']);
    return { titre: 'La boutique : prix HT et TTC', doc,
      qs: [{ t: `Quel est le prix HT de ${ART[k][0]}, en euros ?`, kind: 'tap', cell: String(k + 1), v: ART[k][1], tol: .001, a: String(ART[k][1]) },
        { t: `Calcule le prix TTC de ${ART[j][0]}, en euros.`, kind: 'num', v: rnd(ART[j][1] * 1.2, 2), tol: .006, a: eu(ART[j][1] * 1.2), x: `${ART[j][1]} × 1,20 = ${eu(ART[j][1] * 1.2)}` },
        { t: `Calcule la TVA sur ${ART[m][0]}, en euros.`, kind: 'num', v: rnd(ART[m][1] * .2, 2), tol: .006, a: eu(ART[m][1] * .2), x: `${ART[m][1]} × 0,20 = ${eu(ART[m][1] * .2)}` },
        { t: 'Pour passer du prix HT au prix TTC avec 20 % de TVA, on multiplie par :', kind: 'qcm', choices: ch, ok: ch.indexOf('1,20'), a: '1,20', x: '100 % + 20 % = 120 % = 1,20' },
        { t: `Un article acheté ${A} € HT est vendu ${A + G} € HT. Quelle est la marge, en euros ?`, kind: 'num', v: G, tol: .001, a: String(G), x: `${A + G} − ${A} = ${G}` }] };
  };

  /* e1 · prix HT, TVA, prix TTC */
  lv('c8e1', (R, niv) => {
    const HT = pick(R, [40, 50, 60, 80, 120, 150]), TVA = rnd(HT * .2, 2), TTC = rnd(HT * 1.2, 2), H2 = pick(R, [50, 75, 90, 150, 200]), T2 = rnd(H2 * 1.2, 2);
    if (niv === 0) {
      const items = [num('a', TVA, 2, eu(TVA), [{ v: HT, m: 'C’est le prix HT. La TVA est 20 % de ce prix : multiplie par 0,20.' }]), num('b', TTC, 2, eu(TTC), [{ v: TVA, m: 'C’est la TVA seule. Le prix TTC est le prix HT plus la TVA.' }]), num('c', H2, 2, eu(H2), [{ v: rnd(T2 * .8, 2), m: 'Tu as retiré 20 % du TTC. Pour retrouver le HT, divise par 1,20.' }, { v: rnd(T2 * 1.2, 2), m: 'Tu as multiplié par 1,20. Pour retrouver le HT, on divise.' }])];
      xs(items, { a: `TVA = ${HT} × 0,20 = ${eu(TVA)} €`, b: `TTC = ${HT} + ${eu(TVA)} = ${eu(TTC)} €`, c: `HT = ${eu(T2)} ÷ 1,20 = ${eu(H2)} €` });
      return { titre: 'Du prix HT au prix TTC', consigne: `Une boutique (fictive) vend un article ${HT} € HT. La TVA est de 20 %.`,
        support: table(['Ligne', 'Montant'], [['Prix HT', `${HT} €`], ['TVA de 20 %', '?'], ['Prix TTC', '?']]) + ln('a', 'TVA', eu(TVA), 14, '€') + ln('b', 'Prix TTC', eu(TTC), 14, '€') + `<p class="tr-l">Un autre article coûte ${eu(T2)} € TTC (TVA de 20 %).</p>` + ln('c', 'Prix HT de cet article', eu(H2), 14, '€'), items,
        hints: ['TVA = prix HT × 0,20.', 'TTC = HT + TVA.', 'HT = TTC ÷ 1,20.'] };
    }
    if (niv < 0) {
      const items = [num('a', TVA, 2, eu(TVA), [{ v: HT, m: 'C’est le prix HT. Multiplie-le par 0,20.' }]), num('b', TTC, 2, eu(TTC), [{ v: TVA, m: 'C’est la TVA. Ajoute-la au prix HT.' }]), qcm('c', ['on ajoute la TVA au prix HT', 'on retire la TVA du prix HT'], 0, 'on ajoute la TVA au prix HT')];
      xs(items, { a: `${HT} × 0,20 = ${eu(TVA)}`, b: `${HT} + ${eu(TVA)} = ${eu(TTC)} €`, c: 'le prix TTC est plus grand que le prix HT' });
      return { titre: 'Le prix TTC, pas à pas', consigne: `Un article (fictif) coûte ${HT} € HT. La TVA est de 20 %.`,
        support: table(['Ligne', 'Montant'], [['Prix HT', `${HT} €`], ['TVA de 20 %', '?'], ['Prix TTC', '?']]) + `<p class="tr-l">Début du calcul : TVA = ${HT} × 0,20</p>` + ln('a', 'TVA', eu(TVA), 14, '€') + ln('b', 'Prix TTC', eu(TTC), 14, '€') + `<p class="tr-l">c. Pour trouver le TTC, que fait-on ? (voir la case en dessous)</p>`, items,
        hints: ['Multiplie le prix HT par 0,20.', 'Additionne le prix HT et la TVA.', 'Le TTC est plus grand que le HT.'] };
    }
    const hA = pick(R, [40, 60, 80, 100]), hB = pick(R, [40, 50, 60, 75]), tA = rnd(hA * 1.1, 2), tB = rnd(hB * 1.2, 2), cheap = tA < tB ? 0 : 1, T3 = rnd(H2 * 1.2, 2);
    const items = [num('a', tA, 2, eu(tA), [{ v: rnd(hA * 1.2, 2), m: 'Pour ce produit, la TVA est de 10 % : multiplie par 1,10.' }]), num('b', tB, 2, eu(tB)), qcm('c', ['le produit A', 'le produit B'], cheap, cheap ? 'le produit B' : 'le produit A'), num('d', H2, 2, eu(H2), [{ v: rnd(T3 * .8, 2), m: 'Tu as retiré 20 % du TTC. Pour retrouver le HT, divise par 1,20.' }])];
    xs(items, { a: `${hA} × 1,10 = ${eu(tA)} €`, b: `${hB} × 1,20 = ${eu(tB)} €`, c: `${eu(Math.min(tA, tB))} < ${eu(Math.max(tA, tB))} : ${cheap ? 'B' : 'A'} est moins cher TTC`, d: `${eu(T3)} ÷ 1,20 = ${eu(H2)} €` });
    return { titre: 'Deux produits, deux taux', consigne: `Le produit A (fictif) coûte ${hA} € HT avec 10 % de TVA. Le produit B (fictif) coûte ${hB} € HT avec 20 % de TVA.`,
      support: table(['Produit', 'Prix HT', 'TVA'], [['A', `${hA} €`, '10 %'], ['B', `${hB} €`, '20 %']]) + ln('a', 'Prix TTC de A', eu(tA), 14, '€') + ln('b', 'Prix TTC de B', eu(tB), 14, '€') + `<p class="tr-l">c. Quel produit est le moins cher en TTC ? (voir la case en dessous)</p><p class="tr-l">Un produit C coûte ${eu(T3)} € TTC avec 20 % de TVA.</p>` + ln('d', 'Prix HT de C', eu(H2), 14, '€'), items,
      hints: ['A : multiplie par 1,10. B : multiplie par 1,20.', 'Calcule chaque prix TTC.', 'Compare les deux prix TTC.', 'Divise le TTC par 1,20.'] };
  });

  /* e2 · remise et facture */
  lv('c8e2', (R, niv) => {
    const brut = pick(R, [50, 60, 80, 100, 120, 150]), rp = pick(R, [10, 15, 20, 25]), rem = rnd(brut * rp / 100, 2), net = rnd(brut - rem, 2), tva = rnd(net * .2, 2), ttc = rnd(net + tva, 2);
    if (niv === 0) {
      const items = [num('a', rem, 2, eu(rem), [{ v: brut, m: 'C’est le prix brut. La remise est ' + rp + ' % de ce prix : multiplie par ' + fr(rp / 100, 2) + '.' }]), num('b', net, 2, eu(net), [{ v: rem, m: 'C’est la remise. Le net commercial est le prix brut moins la remise.' }]), num('c', tva, 2, eu(tva), [{ v: rnd(brut * .2, 2), m: 'Tu as calculé 20 % du prix brut. La TVA se calcule sur le net commercial.' }]), num('d', ttc, 2, eu(ttc), [{ v: rnd(brut * 1.2, 2), m: 'Tu as oublié la remise. Utilise le net commercial : net × 1,20.' }])];
      xs(items, { a: `${brut} × ${fr(rp / 100, 2)} = ${eu(rem)} €`, b: `${brut} − ${eu(rem)} = ${eu(net)} € HT`, c: `${eu(net)} × 0,20 = ${eu(tva)} €`, d: `${eu(net)} + ${eu(tva)} = ${eu(ttc)} €` });
      return { titre: 'Compléter une facture', consigne: `Un magasin (fictif) vend un article ${brut} € HT avec une remise de ${rp} %. La TVA est de 20 %.`,
        support: table(['Ligne de la facture', 'Montant'], [['Prix brut HT', `${eu(brut)} €`], [`Remise de ${rp} %`, '?'], ['Net commercial HT', '?'], ['TVA de 20 %', '?'], ['Total TTC', '?']]) + ln('a', 'Remise', eu(rem), 14, '€') + ln('b', 'Net commercial HT', eu(net), 14, '€') + ln('c', 'TVA', eu(tva), 14, '€') + ln('d', 'Total TTC', eu(ttc), 14, '€'), items,
        hints: ['Remise = prix brut × taux.', 'Net = prix brut − remise.', 'TVA = net × 0,20.', 'TTC = net + TVA.'] };
    }
    if (niv < 0) {
      const b2 = pick(R, [50, 60, 80, 100]), r2p = pick(R, [10, 20]), rm = rnd(b2 * r2p / 100, 2), nt = rnd(b2 - rm, 2), tt = rnd(nt * 1.2, 2);
      const items = [num('a', rm, 2, eu(rm), [{ v: b2, m: 'C’est le prix brut. Multiplie-le par ' + fr(r2p / 100, 2) + '.' }]), num('b', nt, 2, eu(nt), [{ v: rm, m: 'C’est la remise. Retire-la du prix brut.' }]), num('c', tt, 2, eu(tt), [{ v: rnd(b2 * 1.2, 2), m: 'Tu as oublié la remise. Multiplie le net commercial par 1,20.' }])];
      xs(items, { a: `${b2} × ${fr(r2p / 100, 2)} = ${eu(rm)} €`, b: `${b2} − ${eu(rm)} = ${eu(nt)} €`, c: `${eu(nt)} × 1,20 = ${eu(tt)} €` });
      return { titre: 'Une facture, pas à pas', consigne: `Un article (fictif) coûte ${b2} € HT. Remise de ${r2p} %, puis TVA de 20 %.`,
        support: table(['Ligne', 'Montant'], [['Prix brut HT', `${b2} €`], [`Remise de ${r2p} %`, '?'], ['Net commercial HT', '?'], ['Total TTC', '?']]) + `<p class="tr-l">Début du calcul : remise = ${b2} × ${fr(r2p / 100, 2)}</p>` + ln('a', 'Remise', eu(rm), 14, '€') + ln('b', 'Net commercial HT', eu(nt), 14, '€') + ln('c', 'Total TTC (net × 1,20)', eu(tt), 14, '€'), items,
        hints: ['Multiplie le prix brut par le taux.', 'Retire la remise du prix brut.', 'Multiplie le net par 1,20.'] };
    }
    const B2 = pick(R, [80, 100, 120, 200]), pr = pick(R, [10, 20, 25]), N2 = rnd(B2 * (1 - pr / 100), 2), TT = rnd(N2 * 1.2, 2);
    const items = [num('a', N2, 2, eu(N2), [{ v: rnd(TT * .8, 2), m: 'Tu as retiré 20 % du TTC. Pour retrouver le HT, divise par 1,20.' }]), num('b', B2, 2, eu(B2), [{ v: rnd(N2 * (1 + pr / 100), 2), m: 'Tu as ajouté ' + pr + ' % au net. Le net est ' + (100 - pr) + ' % du brut : divise par ' + fr(1 - pr / 100, 2) + '.' }]), num('c', rnd(B2 - N2, 2), 2, eu(B2 - N2)), qcm('d', ['le net commercial', 'le prix brut', 'le total TTC'], 0, 'le net commercial')];
    xs(items, { a: `${eu(TT)} ÷ 1,20 = ${eu(N2)} € HT`, b: `${eu(N2)} ÷ ${fr(1 - pr / 100, 2)} = ${eu(B2)} € HT`, c: `${eu(B2)} − ${eu(N2)} = ${eu(B2 - N2)} €`, d: 'la remise s’applique avant la TVA, et la TVA se calcule sur le net commercial' });
    return { titre: 'La facture à l’envers', consigne: `Une facture (fictive) indique ${eu(TT)} € TTC (TVA de 20 %), après une remise de ${pr} % sur le prix brut HT.`,
      support: table(['Ligne de la facture', 'Montant'], [['Prix brut HT', '?'], [`Remise de ${pr} %`, '?'], ['Net commercial HT', '?'], ['TVA de 20 %', '—'], ['Total TTC', `${eu(TT)} €`]]) + ln('a', 'Net commercial HT', eu(N2), 14, '€') + ln('b', 'Prix brut HT', eu(B2), 14, '€') + ln('c', 'Montant de la remise', eu(B2 - N2), 14, '€') + `<p class="tr-l">d. La TVA se calcule sur : (voir la case en dessous)</p>`, items,
      hints: ['Divise le TTC par 1,20.', 'Le net est ' + (100 - pr) + ' % du brut : divise par ' + fr(1 - pr / 100, 2) + '.', 'Brut − net.', 'La remise est faite avant la TVA.'] };
  });

  /* e3 · marge et taux de marge */
  lv('c8e3', (R, niv) => {
    const A = pick(R, [20, 25, 40, 50, 80]), p = pick(R, [20, 25, 30, 40, 50]), V = rnd(A * (1 + p / 100), 2), M = rnd(V - A, 2), A2 = pick(R, [20, 40, 60, 80]), p2 = pick(R, [10, 25, 50]), V2 = rnd(A2 * (1 + p2 / 100), 2);
    if (niv === 0) {
      const items = [num('a', M, 2, eu(M), [{ v: V, m: 'C’est le prix de vente. La marge est la différence entre vente et achat.' }]), num('b', p, 1, String(p), [{ v: rnd(M / V * 100, 1), m: 'Tu as divisé par le prix de vente. On divise la marge par le prix d’achat.' }, { v: rnd(M / A, 3), m: 'Tu as oublié de multiplier par 100 pour écrire un pourcentage.' }]), num('c', V2, 2, eu(V2), [{ v: rnd(A2 * p2 / 100, 2), m: 'C’est seulement la marge. Le prix de vente est le prix d’achat plus la marge.' }])];
      xs(items, { a: `${eu(V)} − ${eu(A)} = ${eu(M)} €`, b: `${eu(M)} ÷ ${eu(A)} = ${fr(rnd(M / A, 3), 2)}, soit ${p} %`, c: `${eu(A2)} × ${fr(1 + p2 / 100, 2)} = ${eu(V2)} €` });
      return { titre: 'La marge d’un commerçant', consigne: `Une boutique (fictive) achète un article ${eu(A)} € HT et le vend ${eu(V)} € HT.`,
        support: table(['Prix d’achat HT', 'Prix de vente HT'], [[`${eu(A)} €`, `${eu(V)} €`]]) + ln('a', 'Marge', eu(M), 14, '€') + ln('b', 'Taux de marge', String(p), 14, '%') + `<p class="tr-l">Un autre article est acheté ${eu(A2)} € HT. Le commerçant veut un taux de marge de ${p2} %.</p>` + ln('c', 'Prix de vente HT', eu(V2), 14, '€'), items,
        hints: ['Marge = prix de vente − prix d’achat.', 'Taux = marge ÷ prix d’achat, puis × 100.', 'Prix de vente = prix d’achat × (1 + taux).'] };
    }
    if (niv < 0) {
      const items = [num('a', M, 2, eu(M), [{ v: V, m: 'C’est le prix de vente. Retire le prix d’achat.' }]), num('b', rnd(M / A, 3), 3, fr(rnd(M / A, 3), 2), [{ v: rnd(M / V, 3), m: 'Tu as divisé par le prix de vente. Divise par le prix d’achat.' }]), num('c', p, 1, String(p), [{ v: rnd(M / A, 3), m: 'Multiplie par 100 pour écrire un pourcentage.' }])];
      xs(items, { a: `${eu(V)} − ${eu(A)} = ${eu(M)} €`, b: `${eu(M)} ÷ ${eu(A)} = ${fr(rnd(M / A, 3), 2)}`, c: `${fr(rnd(M / A, 3), 2)} × 100 = ${p} %` });
      return { titre: 'Le taux de marge, pas à pas', consigne: `Un article (fictif) est acheté ${eu(A)} € HT et vendu ${eu(V)} € HT.`,
        support: table(['Prix d’achat HT', 'Prix de vente HT'], [[`${eu(A)} €`, `${eu(V)} €`]]) + `<p class="tr-l">Début du calcul : marge = ${eu(V)} − ${eu(A)}</p>` + ln('a', 'Marge', eu(M), 14, '€') + ln('b', 'Marge ÷ prix d’achat', fr(rnd(M / A, 3), 2), 14) + ln('c', 'Taux de marge', String(p), 14, '%'), items,
        hints: ['Soustrais le prix d’achat du prix de vente.', 'Divise la marge par le prix d’achat.', 'Multiplie par 100.'] };
    }
    const a1 = pick(R, [6, 8, 10, 20]), m1 = pick(R, [3, 4, 5, 6]), a2 = pick(R, [20, 40, 50, 80]);
    let m2 = pick(R, [8, 10, 12, 20]); if (rnd(m1 / a1 * 100, 1) === rnd(m2 / a2 * 100, 1)) m2 += a2 / 10;
    const t1 = rnd(m1 / a1 * 100, 1), t2 = rnd(m2 / a2 * 100, 1);
    const better = t1 > t2 ? 0 : 1, vTTC = rnd((a1 + m1) * 1.2, 2);
    const items = [num('a', t1, 1, f1(t1), [{ v: rnd(m1 / (a1 + m1) * 100, 1), m: 'Tu as divisé par le prix de vente. Divise par le prix d’achat.' }]), num('b', t2, 1, f1(t2), [{ v: rnd(m2 / (a2 + m2) * 100, 1), m: 'Tu as divisé par le prix de vente. Divise par le prix d’achat.' }]), qcm('c', ['l’article 1', 'l’article 2'], better, better ? 'l’article 2' : 'l’article 1'), num('d', vTTC, 2, eu(vTTC), [{ v: a1 + m1, m: 'C’est le prix HT. Ajoute la TVA : multiplie par 1,20.' }])];
    xs(items, { a: `${m1} ÷ ${a1} = ${fr(rnd(m1 / a1, 3), 2)}, soit ${f1(t1)} %`, b: `${m2} ÷ ${a2} = ${fr(rnd(m2 / a2, 3), 2)}, soit ${f1(t2)} %`, c: `${f1(Math.max(t1, t2))} % > ${f1(Math.min(t1, t2))} % : ${better ? 'l’article 2' : 'l’article 1'} a le meilleur taux`, d: `${a1 + m1} × 1,20 = ${eu(vTTC)} €` });
    return { titre: 'Quel article rapporte le mieux ?', consigne: 'Une boutique (fictive) compare deux articles. Les prix sont HT.',
      support: table(['Article', 'Achat HT (€)', 'Marge (€)'], [['1', String(a1), String(m1)], ['2', String(a2), String(m2)]]) + ln('a', 'Taux de marge de l’article 1', f1(t1), 14, '%') + ln('b', 'Taux de marge de l’article 2', f1(t2), 14, '%') + `<p class="tr-l">c. Quel article a le meilleur taux de marge ? (voir la case en dessous)</p>` + ln('d', 'Prix de vente TTC de l’article 1 (TVA de 20 %)', eu(vTTC), 14, '€'), items,
      hints: ['Divise la marge par le prix d’achat, puis multiplie par 100.', 'Même méthode pour l’article 2.', 'Compare les deux taux.', 'Prix de vente = achat + marge ; puis × 1,20.'] };
  });
  if (typeof module !== 'undefined') module.exports = {};
})(typeof module !== 'undefined' ? module.exports : window);
