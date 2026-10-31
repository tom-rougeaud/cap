/* Chapitre 8 · Calculs commerciaux — CAP Maths (programme de mathématiques des classes préparant au CAP, BOEN spécial n° 5 du 11 avril 2019, groupement 2). */
'use strict';
const K = require('./kit3e');
const { H, FM, R, Q, BQ, PB, ENT, tab, S, T, Rc, Ar, st, SN, cell } = K;
const { SK } = require('./sk3');
const { MCVG } = require('../shared/gens.js');
const fr = (x, d) => MCVG.fr(x, d);
const r2 = x => Math.round(x * 100) / 100;
const srcTVA = 'Source : Fiducial, « Quels sont les taux de TVA en France métropolitaine ? » (page mise à jour le 28/07/2019). Les taux peuvent changer : un énoncé donne toujours le taux.';

module.exports = function (chk) {
  const c = { id: 'c8', n: 8, col: 'nombre', icone: '🧾', dom: 'Nombres et calculs · calculs commerciaux', plus: 'groupement 2', titre: 'Calculs commerciaux', sous: 'Prix HT et TTC, TVA, remise, marge, intérêts simples' };
  c.parties = [{ t: 'Du prix HT au prix TTC', n: [1, 2] }, { t: 'Marge et placement', n: [3, 4] }];
  c.travail = { question: `Un casque audio est affiché ${H('50 € HT')}. Avec ${H('20 %')} de TVA, combien paie le client ? Une boutique achète un jeu ${H('40 € HT')} et le revend ${H('52 € HT')} : quel est son taux de marge ? Tu sauras répondre aux notions 1 et 3.` };
  c.objectifs = ['Je saurai passer d’un prix HT à un prix TTC, et inversement.', 'Je saurai compléter une facture avec une remise et la TVA.', 'Je saurai calculer une marge et un taux de marge.', 'Je saurai calculer un intérêt simple et une valeur acquise.'];
  c.depart = 'c8';

  /* ---------- contrôles des nombres du chapitre ---------- */
  chk(r2(50 * .2) === 10 && 50 + 10 === 60 && r2(50 * 1.2) === 60 && r2(60 / 1.2) === 50 && r2(60 - 60 * .2) === 48 && r2(8 * 1.1) === 8.8 && r2(96 / 1.2) === 80, 'c8 TVA');
  chk(r2(80 * .15) === 12 && 80 - 12 === 68 && r2(68 * .2) === 13.6 && r2(68 + 13.6) === 81.6 && r2(68 * 1.2) === 81.6 && r2(80 * .2) === 16 && r2(60 * .1) === 6 && 60 - 6 === 54 && r2(54 * 1.2) === 64.8, 'c8 remise');
  chk(52 - 40 === 12 && r2(12 / 40) === .3 && r2(40 * 1.3) === 52 && 30 - 25 === 5 && r2(5 / 25) === .2 && r2(6 / 24) === .25, 'c8 marge');
  chk(r2(1200 * .03) === 36 && 36 * 2 === 72 && 1200 + 72 === 1272 && 1272 + 36 === 1308 && r2(2000 * .02 * 3) === 120 && r2(60 / 2 / 1000) === .03, 'c8 intérêts');
  chk(r2(90 * .2) === 18 && 90 - 18 === 72 && r2(72 * .2) === 14.4 && r2(72 * 1.2) === 86.4 && r2(50 * .1) === 5 && 50 - 5 === 45, 'c8 résolus et guidé');
  chk(9 - 6 === 3 && r2(3 / 6) === .5 && 8 - 5 === 3 && r2(3 / 5) === .6 && 26 - 20 === 6 && r2(6 / 20) === .3 && 6 > 3 && .3 < .5, 'c8 boutique');
  chk(r2(70 * .1) === 7 && 70 - 7 === 63 && r2(63 * .2) === 12.6 && r2(63 + 12.6) === 75.6 && r2(70 * 1.2) === 84 && r2(84 - 75.6) === 8.4 && r2(8.4 / 84) === .1 && r2(2500 * .02 * 3) === 150, 'c8 salon');
  chk(r2(91.2 / 1.2) === 76 && r2(76 / .95) === 80 && r2(2500 * .02) === 50 && 200 / 50 === 4 && r2(108 / (1800 * 2)) === .03 && r2(2500 * .02 * 10) === 500 && 500 < 2500, 'c8 défis');

  /* ---------- figures de la leçon ---------- */
  const vtva = S(600, 200, st(1, SN(1, 22, 24) + T(44, 29, 'TTC = HT + TVA : le prix à payer contient la taxe', { fs: 13, a: 'start', c: 'kt' }))
    + st(2, SN(2, 22, 63) + cell(44, 44, 110, 38, 'HT : 50 €') + T(172, 69, '+', { fs: 20 }) + cell(190, 44, 140, 38, 'TVA : 10 €') + T(348, 69, '=', { fs: 20 }) + cell(366, 44, 130, 38, 'TTC : 60 €', { k: true }) + T(516, 68, 'j’additionne', { fs: 13, a: 'start' }))
    + st(3, SN(3, 22, 112) + T(44, 117, 'TVA = HT × 0,20 = 50 × 0,20 = 10 €      (20 % s’écrit 0,20)', { fs: 13, a: 'start' }))
    + st(4, SN(4, 22, 150) + T(44, 155, 'directement : TTC = HT × 1,20 = 50 × 1,20 = 60 €', { fs: 13, a: 'start' }) + T(44, 184, 'retrouver le HT : HT = TTC ÷ 1,20 = 60 ÷ 1,20 = 50 €', { fs: 13, a: 'start', c: 'kt' })),
  'Un prix hors taxes de 50 euros plus 10 euros de TVA donne 60 euros toutes taxes comprises');
  const vfac = S(600, 200, st(1, cell(24, 14, 230, 30, 'Prix brut HT') + cell(258, 14, 130, 30, '80,00 €') + SN(1, 414, 29) + T(434, 34, 'je pars du prix brut', { fs: 12.5, a: 'start' }))
    + st(2, cell(24, 50, 230, 30, 'Remise de 15 %') + cell(258, 50, 130, 30, '− 12,00 €') + SN(2, 414, 65) + T(434, 70, '80 × 0,15 = 12', { fs: 12.5, a: 'start' }) + cell(24, 86, 230, 30, 'Net commercial HT', { k: true }) + cell(258, 86, 130, 30, '68,00 €', { k: true }) + T(434, 106, '80 − 12 = 68', { fs: 12.5, a: 'start' }))
    + st(3, cell(24, 122, 230, 30, 'TVA de 20 %') + cell(258, 122, 130, 30, '+ 13,60 €') + SN(3, 414, 137) + T(434, 142, '68 × 0,20 = 13,6', { fs: 12.5, a: 'start' }))
    + st(4, cell(24, 158, 230, 30, 'Total TTC', { k: true }) + cell(258, 158, 130, 30, '81,60 €', { k: true }) + SN(4, 414, 173) + T(434, 178, '68 + 13,60 = 81,60', { fs: 12.5, a: 'start' })),
  'Une facture : prix brut 80 euros, remise 12 euros, net commercial 68 euros, TVA 13,60 euros, total TTC 81,60 euros');
  const vmar = S(600, 200, st(1, SN(1, 22, 24) + T(44, 29, 'marge = prix de vente HT − prix d’achat HT', { fs: 13, a: 'start', c: 'kt' }))
    + st(2, SN(2, 22, 63) + cell(44, 44, 140, 38, 'achat HT : 40 €') + T(202, 69, '+', { fs: 20 }) + cell(220, 44, 120, 38, 'marge : 12 €', { k: true }) + T(358, 69, '=', { fs: 20 }) + cell(376, 44, 150, 38, 'vente HT : 52 €'))
    + st(3, SN(3, 22, 112) + T(44, 117, 'marge = 52 − 40 = 12 €      vérification : 40 + 12 = 52 ✓', { fs: 13, a: 'start' }))
    + st(4, SN(4, 22, 150) + T(44, 155, 'taux de marge = marge ÷ prix d’achat = 12 ÷ 40 = 0,30 = 30 %', { fs: 13, a: 'start' }) + T(44, 184, 'prix de vente = prix d’achat × 1,30 = 40 × 1,30 = 52 €', { fs: 13, a: 'start', c: 'kt' })),
  'Un prix d’achat de 40 euros plus une marge de 12 euros donne un prix de vente de 52 euros : le taux de marge est 30 pour cent');
  const vint = S(600, 200, st(1, SN(1, 22, 24) + T(44, 29, 'I = C × t × n : capital C = 1 200 €, taux t = 3 % par an, durée n en années', { fs: 13, a: 'start', c: 'kt' }))
    + st(2, SN(2, 22, 76) + cell(44, 44, 130, 30, 'années n', { fs: 12.5 }) + [0, 1, 2, 3].map(i => cell(180 + i * 100, 44, 90, 30, String(i), { fs: 13 })).join('') + cell(44, 78, 130, 30, 'valeur acquise (€)', { fs: 12.5 }) + ['1 200', '1 236', '1 272', '1 308'].map((v, i) => cell(180 + i * 100, 78, 90, 30, v, { fs: 13, k: i === 2 })).join('') + [0, 1, 2].map(i => T(180 + i * 100 + 95, 124, '+ 36', { fs: 12, c: 'kt' })).join(''))
    + st(3, SN(3, 22, 150) + T(44, 155, 'intérêts de 2 ans : I = 1 200 × 0,03 × 2 = 72 €', { fs: 13, a: 'start' }))
    + st(4, SN(4, 22, 184) + T(44, 189, 'valeur acquise : V = C + I = 1 200 + 72 = 1 272 €', { fs: 13, a: 'start', c: 'kt' })),
  'Un capital de 1 200 euros placé à 3 pour cent : la valeur acquise augmente de 36 euros par an et vaut 1 272 euros après 2 ans');

  c.notions = [
    { titre: 'Prix HT, TVA et prix TTC', decouvre: { txt: `Un casque audio est affiché ${H('50 € HT')}. La TVA est de ${H('20 %')}. Quelle est la taxe à payer ? Combien le client paie-t-il en tout ?`, img: SK.tva() },
      methode: ['Je repère le prix HT (hors taxes) et le taux de TVA : 50 € et 20 %.', 'Je calcule la TVA : 50 × 0,20 = 10 €.', 'J’additionne : TTC = 50 + 10 = 60 €. Ou directement : 50 × 1,20 = 60 €.', 'Pour retrouver le HT, je divise : HT = TTC ÷ 1,20 = 60 ÷ 1,20 = 50 €.'],
      vois: vtva,
      solution: `<p>TVA = 50 × 0,20 = 10 €. Prix TTC = 50 + 10 = <b>60 €</b>.</p><p>Contrôle : 50 × 1,20 = 60 €. Le taux normal de TVA est 20 %.</p><p class="srcl">${srcTVA}</p>`,
      retiens: `<p>Le prix <b>TTC</b> (toutes taxes comprises) est égal au prix <b>HT</b> (hors taxes) plus la <b>TVA</b>.</p><p>Avec 20 % de TVA : ${FM(R`\mathrm{TTC}=\mathrm{HT}\times1{,}20`)}. Pour retrouver le HT : ${FM(R`\mathrm{HT}=\mathrm{TTC}\div1{,}20`)}.</p>`,
      attention: 'Pour retrouver le HT, on divise par 1,20 : on ne retire pas 20 % du TTC. Exemple : 60 − 20 % de 60 = 48, et ce n’est pas 50.',
      amoi: [['Un seau de pop-corn coûte 8 € HT, avec 10 % de TVA. Calcule le prix TTC.', '8 × 1,10 = 8,80 €'], ['Un article coûte 96 € TTC avec 20 % de TVA. Calcule le prix HT.', '96 ÷ 1,20 = 80 €']] },
    { titre: 'Remise commerciale et facture', decouvre: { txt: `Une manette est affichée ${H('80 € HT')}. Le magasin accorde une remise de ${H('15 %')}. Quel est le prix après remise ? Que paie le client avec ${H('20 %')} de TVA ?`, img: SK.remise() },
      methode: ['Je calcule la remise : 80 × 0,15 = 12 €.', 'Je retire la remise : net commercial HT = 80 − 12 = 68 €.', 'Je calcule la TVA sur le net : 68 × 0,20 = 13,60 €.', 'J’additionne : total TTC = 68 + 13,60 = 81,60 €.'],
      vois: vfac,
      solution: `<p>Remise : 80 × 0,15 = 12 €. Net commercial HT : 80 − 12 = <b>68 €</b>.</p><p>TVA : 68 × 0,20 = 13,60 €. Total TTC : 68 + 13,60 = <b>81,60 €</b>.</p><p>Contrôle : 68 × 1,20 = 81,60 €.</p>`,
      retiens: `<p>Sur une facture, on calcule dans l’ordre : <b>prix brut</b>, <b>remise</b>, <b>net commercial</b> HT, <b>TVA</b>, <b>total TTC</b>.</p><p>La remise s’applique <b>avant</b> la TVA. Remise, rabais et ristourne sont des réductions commerciales.</p>`,
      attention: 'La TVA se calcule sur le net commercial, après la remise. Calculer 20 % de 80 € donnerait 16 € de TVA : c’est faux.',
      amoi: [['Prix brut 60 € HT, remise 10 %. Quel est le net commercial ?', '60 × 0,10 = 6 ; 60 − 6 = 54 €'], ['Net commercial 54 € HT, TVA 20 %. Quel est le total TTC ?', '54 × 1,20 = 64,80 €']] },
    { titre: 'Marge et taux de marge', decouvre: { txt: `Une boutique de jeux achète un jeu ${H('40 € HT')} et le revend ${H('52 € HT')}. Quel est son bénéfice sur ce jeu ? Quelle part du prix d’achat cela représente-t-il ?`, img: SK.marge() },
      methode: ['Je repère le prix d’achat HT (40 €) et le prix de vente HT (52 €).', 'Je calcule la marge : 52 − 40 = 12 €.', 'Je calcule le taux de marge : marge ÷ prix d’achat = 12 ÷ 40 = 0,30, soit 30 %.', 'Je vérifie : 40 × 1,30 = 52 €.'],
      vois: vmar,
      solution: `<p>Marge : 52 − 40 = <b>12 €</b>. Taux de marge : 12 ÷ 40 = 0,30, soit <b>30 %</b>.</p><p>Contrôle : 40 × 1,30 = 52 €.</p>`,
      retiens: `<p>La <b>marge</b> est la différence entre le prix de vente HT et le prix d’achat HT.</p><p>Le <b>taux de marge</b> est la marge divisée par le prix d’achat HT, puis multipliée par 100 pour l’écrire en pourcentage.</p>`,
      attention: 'On calcule la marge avec des prix HT, jamais avec un prix TTC. Le taux de marge se calcule sur le prix d’achat, pas sur le prix de vente.',
      amoi: [['Un article acheté 25 € HT est vendu 30 € HT. Quelle est la marge ?', '30 − 25 = 5 €'], ['La marge est 6 €, le prix d’achat 24 € HT. Quel est le taux de marge ?', '6 ÷ 24 = 0,25 = 25 %']] },
    { titre: 'Intérêts simples et valeur acquise', decouvre: { txt: `Tu places ${H('1 200 €')} à ${H('3 %')} par an pendant ${H('2 ans')}. Chaque année, la banque ajoute les mêmes intérêts. Combien as-tu au bout de 2 ans ?`, img: SK.interet() },
      methode: ['Je repère le capital C = 1 200 €, le taux t = 3 % par an et la durée n = 2 ans.', 'Je calcule l’intérêt : I = C × t × n = 1 200 × 0,03 × 2 = 72 €.', 'J’ajoute au capital : valeur acquise V = 1 200 + 72 = 1 272 €.', 'Je vérifie : 36 € par an, soit 36 × 2 = 72 €.'],
      vois: vint,
      solution: `<p>Intérêt d’un an : 1 200 × 0,03 = 36 €. Sur 2 ans : 36 × 2 = <b>72 €</b>.</p><p>Valeur acquise : 1 200 + 72 = <b>1 272 €</b>.</p>`,
      retiens: `<p>Avec des <b>intérêts simples</b>, l’intérêt est le même chaque année : ${FM(R`I=C\times t\times n`)}.</p><p>La <b>valeur acquise</b> est le capital plus les intérêts : ${FM(R`V=C+I`)}.</p>`,
      attention: 'Le taux est donné par an : si la durée est en mois, on la convertit en années (6 mois = 0,5 an). Avec 3 %, on multiplie par 0,03 et non par 3.',
      amoi: [['C = 2 000 €, t = 2 % par an, n = 3 ans. Calcule l’intérêt.', '2 000 × 0,02 × 3 = 120 €'], ['Un capital de 1 000 € rapporte 60 € en 2 ans. Quel est le taux annuel ?', '60 ÷ 2 = 30 € par an ; 30 ÷ 1 000 = 0,03 = 3 %']] }];

  /* Je programme avec Scratch */
  c.scratch = [{ titre: 'calculer une valeur acquise', lc: 4, texte: 'Le programme ajoute les intérêts de chaque année au capital : 1 200 € placés à 3 % par an.',
    prog: [{ c: 'evt', t: 'quand ⚑ est cliqué' }, { c: 'var', t: 'mettre V à 1200' }, { c: 'ctl', t: 'répéter 2 fois', open: 1.625 }, { c: 'var', t: 'ajouter (1200 × 0,03) à V', d: 1 }, { c: 'ctl', t: '', end: true }, { c: 'look', t: 'dire V' }],
    qs: [['Que dit le lutin à la fin ?', '1272', 'V passe de 1 200 à 1 236, puis à 1 272.'], ['Que faut-il changer pour 3 ans ?', 'remplacer 2 par 3', 'Le nombre de répétitions est la durée en années.'], ['On remplace 2 par 3. Que dit le lutin ?', '1308', '1 272 + 36 = 1 308.']] }];
  chk(1200 + 36 === 1236 && 1236 + 36 === 1272 && 1272 + 36 === 1308, 'c8 Scratch');

  c.mots = [['prix HT', 'prix hors taxes, avant la TVA', 'le casque coûte 50 € HT.'], ['prix TTC', 'prix toutes taxes comprises : celui que paie le client', '50 € HT + 10 € de TVA = 60 € TTC.'], ['TVA', 'taxe sur la valeur ajoutée, calculée sur le prix HT', 'le taux normal est 20 %.'], ['remise', 'réduction commerciale sur le prix brut', 'une remise de 15 % sur 80 € est de 12 €.'], ['net commercial', 'prix après la remise, avant la TVA', '80 − 12 = 68 € HT.'], ['marge', 'prix de vente HT moins prix d’achat HT', '52 − 40 = 12 €.'], ['taux de marge', 'marge divisée par le prix d’achat HT', '12 ÷ 40 = 30 %.'], ['capital, intérêt, valeur acquise', 'somme placée ; somme versée par la banque ; capital plus intérêts', '1 200 € + 72 € = 1 272 €.']];

  /* ---------- exercices résolus ---------- */
  c.resolus = [
    { titre: 'Compléter une facture', outil: '🧮 calculatrice', enonce: `Un casque est facturé ${H('90 € HT')} avec une remise de ${H('20 %')} et ${H('20 %')} de TVA. Calcule le prix TTC.`,
      rows: [['Remise : 90 × 0,20 = <b>18</b> €', 'Je calcule le pourcentage du prix brut.'], ['Net commercial : 90 − 18 = <b>72</b> € HT', 'Je retire la remise avant la TVA.'], ['TVA : 72 × 0,20 = <b>14,40</b> €', 'La TVA se calcule sur le net commercial.'], ['TTC : 72 + 14,40 = <b>86,40</b> €', 'J’additionne le net et la TVA.']], verif: '72 × 1,20 = 86,40 ✓', rep: 'Le client paie 86,40 € TTC.', go: ['e2'] },
    { titre: 'À toi : marge et taux de marge', outil: '🧮 calculatrice', enonce: `Un porte-clés est acheté ${H('4 € HT')} et vendu ${H('6 € HT')}. Complète.`, trous: [0, 1, 2],
      rows: [['marge = 6 − 4 = ⟦2⟧ €', 'Je retire le prix d’achat du prix de vente.'], ['taux = ⟦2⟧ ÷ ⟦4⟧ = 0,5 = ⟦50⟧ %', 'Je divise la marge par le prix d’achat.'], ['4 × ⟦1,50⟧ = 6', 'Je vérifie avec le coefficient multiplicateur.']], verif: '4 + 2 = 6 ✓', rep: 'La marge est 2 € et le taux de marge 50 %.', go: ['e3'] }];
  c.entraine = ENT('c8', [1, 2, 3]);

  /* ---------- je résous ---------- */
  const tbA = tab(['Article', 'Achat HT (€)', 'Vente HT (€)'], [['Poster', '6', '9'], ['Mug', '5', '8'], ['Figurine', '20', '26']]);
  c.probs = [
    PB({ id: 'pa', niv: -1, base: 'p1', etape: 2, lc: 1, comps: ['app', 'rea'], titre: 'Le casque, pas à pas',
      intro: `<p>Un casque audio coûte ${H('50 € HT')}. La TVA est de ${H('20 %')}. Une remise de ${H('10 %')} est proposée sur le prix HT.</p>`,
      qs: [Q('a.', 'Calcule la TVA sur 50 € HT : 50 × 0,20, en euros.', 'TVA = 50 × 0,20 = 10 €', 10, { w: 18 }), Q('b.', 'Calcule le prix TTC : 50 + 10, en euros.', 'TTC = 50 + 10 = 60 €', 60, { w: 18 }), Q('c.', 'Calcule la remise de 10 % sur 50 €, en euros.', 'remise = 50 × 0,10 = 5 €', 5, { w: 18 }), Q('d.', 'Calcule le prix après remise : 50 − 5, en euros.', 'net = 50 − 5 = 45 € HT', 45, { w: 18 })],
      err: { 0: [{ v: 20, m: 'C’est le taux, pas la taxe. Calcule 20 % de 50 : 50 × 0,20.' }], 2: [{ v: 45, m: 'C’est le prix après remise. La remise, c’est 10 % de 50 : 50 × 0,10.' }] },
      hints: ['TVA = HT × 0,20.', 'TTC = HT + TVA.', 'Remise = prix × 0,10.', 'Net = prix − remise.'], pouce: '50 × 0,20 ; 50 + 10 ; 50 × 0,10 ; 50 − 5.',
      det: ['50 × 0,20 = 10 €.', '50 + 10 = 60 €.', '50 × 0,10 = 5 €.', '50 − 5 = 45 € HT.'], corr: 'a. 10 €. b. 60 €. c. 5 €. d. 45 € HT.' }),
    PB({ id: 'p1', etape: 2, lc: 2, comps: ['app', 'ana', 'rea', 'val'], titre: 'La facture de la manette',
      intro: `<p>Une boutique facture une manette ${H('60 € HT')}, avec une remise de ${H('10 %')} et ${H('20 %')} de TVA.</p>${tab(['Ligne de la facture', 'Montant'], [['Prix brut HT', '60,00 €'], ['Remise de 10 %', '?'], ['Net commercial HT', '?'], ['TVA de 20 %', '?'], ['Total TTC', '?']])}`,
      qs: [Q('a.', 'Calcule la remise, en euros.', 'remise = 60 × 0,10 = 6 €', 6, { w: 18 }), Q('b.', 'Calcule le net commercial HT, en euros.', 'net = 60 − 6 = 54 €', 54, { w: 18 }), Q('c.', 'Calcule la TVA sur le net commercial, en euros.', 'TVA = 54 × 0,20 = 10,80 €', 10.8, { w: 18 }), Q('d.', 'Calcule le total TTC, en euros.', 'TTC = 54 + 10,80 = 64,80 €', 64.8, { w: 18 })],
      err: { 2: [{ v: 12, m: 'Tu as calculé 20 % de 60. La TVA se calcule sur le net commercial : 54 × 0,20.' }], 3: [{ v: 72, m: 'Tu as calculé 60 × 1,20 sans la remise. Utilise le net commercial : 54 + 10,80.' }] },
      hints: ['Remise = 60 × 0,10.', 'Net = 60 − remise.', 'TVA = net × 0,20.', 'TTC = net + TVA, ou net × 1,20.'], pouce: '60 × 0,10 ; 60 − 6 ; 54 × 0,20 ; 54 × 1,20.',
      det: ['60 × 0,10 = 6 €.', '60 − 6 = 54 € HT.', '54 × 0,20 = 10,80 €.', '54 + 10,80 = 64,80 €. Contrôle : 54 × 1,20 = 64,80 €.'], corr: 'a. 6 €. b. 54 €. c. 10,80 €. d. 64,80 €.' }),
    PB({ id: 'p2', etape: 3, lc: 3, defi: 5, bulle: 'Ce cas se fait en 5 étapes. Pour chaque article, calcule la marge puis le taux de marge. Compare les résultats avant de conclure.', autravail: { comp: 'val', txt: 'comparer la rentabilité de plusieurs produits vendus dans un commerce.' }, comps: ['app', 'ana', 'rea', 'val'], titre: 'La boutique de goodies',
      intro: `<p>Une boutique achète trois articles à un fournisseur et les revend. Tous les prix sont HT.</p>${tbA}`,
      qs: [Q('a.', 'Calcule la marge sur un poster, en euros.', 'marge = 9 − 6 = 3 €', 3, { w: 18 }), Q('b.', 'Calcule le taux de marge du poster, en pourcentage.', '3 ÷ 6 = 0,5 = 50 %', 50, { w: 18 }), Q('c.', 'Calcule la marge sur une figurine, en euros.', 'marge = 26 − 20 = 6 €', 6, { w: 18 }), Q('d.', 'Calcule le taux de marge de la figurine, en pourcentage.', '6 ÷ 20 = 0,30 = 30 %', 30, { w: 18 }), Q('e.', 'Un employé dit : « La figurine est le meilleur article, elle rapporte le plus. » A-t-il raison ? Justifie.', 'En euros, oui : 6 € contre 3 €. Mais le taux de marge est plus faible : 30 % contre 50 %.', null, { lines: 3 })],
      err: { 0: [{ v: 9, m: 'C’est le prix de vente. La marge est la différence : vente − achat.' }], 1: [{ v: 0.5, m: 'Tu as oublié de multiplier par 100 : 0,5 s’écrit 50 %.' }, { v: 33.3, m: 'Tu as divisé par le prix de vente. On divise par le prix d’achat : 3 ÷ 6.' }], 3: [{ v: 23.1, m: 'Tu as divisé par le prix de vente. On divise par le prix d’achat : 6 ÷ 20.' }] },
      hints: ['Marge = prix de vente − prix d’achat.', 'Taux = marge ÷ prix d’achat, puis × 100.', 'Même calcul pour la figurine.', 'Même méthode : 6 ÷ 20.', 'Compare les marges en euros, puis les taux.'], pouce: '9 − 6 ; 3 ÷ 6 ; 26 − 20 ; 6 ÷ 20 ; comparer 3 et 6, puis 50 % et 30 %.',
      det: ['9 − 6 = 3 €.', '3 ÷ 6 = 0,5, soit 50 %.', '26 − 20 = 6 €.', '6 ÷ 20 = 0,30, soit 30 %.', 'La figurine rapporte plus d’euros par article (6 € contre 3 €), mais son taux de marge est plus faible (30 % contre 50 %). L’employé a raison en euros, pas en taux.'], corr: 'a. 3 €. b. 50 %. c. 6 €. d. 30 %. e. Oui en euros, non en taux.' }),
    PB({ id: 'p3', etape: 4, lc: 2, cls: 'bac', defi: 5, bulle: 'Voici une question « vers le CCF » : calcule une facture complète, puis un placement. Rédige une phrase de conclusion.', autravail: { comp: 'val', txt: 'compléter une facture, vérifier un total et calculer un placement.' }, comps: ['app', 'ana', 'rea', 'val', 'com'], titre: 'Le salon de coiffure',
      intro: `<p>Un salon facture une coloration et un soin pour ${H('70 € HT')}. Il accorde une remise de fidélité de ${H('10 %')}. La TVA est de ${H('20 %')}. Le salon place aussi ${H('2 500 €')} à ${H('2 %')} par an pendant ${H('3 ans')} (intérêts simples).</p>${tab(['Ligne de la facture', 'Montant'], [['Prix brut HT', '70,00 €'], ['Remise de 10 %', '?'], ['Net commercial HT', '?'], ['TVA de 20 %', '?'], ['Total TTC', '?']])}`,
      qs: [BQ('1', 'Calculer la remise, en euros.', 'rea', '70 × 0,10 = 7 €', 7, { w: 22 }), BQ('2', 'Calculer le net commercial HT, en euros.', 'rea', '70 − 7 = 63 €', 63, { w: 22 }), BQ('3', 'Calculer le total TTC, en euros.', 'rea', 'TVA = 63 × 0,20 = 12,60 € ; TTC = 63 + 12,60 = 75,60 €', 75.6, { w: 22 }), BQ('4', 'Calculer l’intérêt rapporté par le placement du salon, en euros.', 'ana', 'I = 2 500 × 0,02 × 3 = 150 €', 150, { w: 22 }), BQ('5', 'Une cliente dit : « La remise me fait économiser 10 % sur le prix TTC. » A-t-elle raison ? Justifier.', 'com', 'Oui : sans remise, 70 × 1,20 = 84 € TTC ; 84 − 75,60 = 8,40 € ; 8,40 ÷ 84 = 0,10 = 10 %.', null, { lines: 3 })],
      err: { 1: [{ v: 7, m: 'C’est la remise. Le net commercial est le prix après la remise : 70 − 7.' }], 2: [{ v: 84, m: 'Tu as oublié la remise. La TVA se calcule sur le net commercial : 63 × 1,20.' }], 3: [{ v: 50, m: 'C’est l’intérêt d’une seule année. Multiplie par 3 ans.' }] },
      hints: ['Remise = 70 × 0,10.', 'Net = 70 − remise.', 'TTC = net × 1,20.', 'I = C × t × n avec t = 0,02.', 'Calcule le TTC sans remise, puis compare avec 75,60 €.'], pouce: '70 × 0,10 ; 70 − 7 ; 63 × 1,20 ; 2 500 × 0,02 × 3 ; 70 × 1,20.',
      det: ['70 × 0,10 = 7 €.', '70 − 7 = 63 € HT.', '63 × 0,20 = 12,60 € de TVA ; 63 + 12,60 = 75,60 € TTC.', '2 500 × 0,02 = 50 € par an ; 50 × 3 = 150 €.', 'Sans remise : 70 × 1,20 = 84 € TTC. La remise fait économiser 84 − 75,60 = 8,40 €. 8,40 ÷ 84 = 0,10 : 10 %. La cliente a raison.'], corr: '1. 7 €. 2. 63 €. 3. 75,60 €. 4. 150 €. 5. Oui, 10 %.' }),
    PB({ id: 'pd', niv: 1, base: 'p3', etape: 3, lc: 4, autravail: { comp: 'ana', txt: 'retrouver un prix HT à partir d’un prix TTC, une durée ou un taux de placement.' }, comps: ['ana', 'rea', 'val', 'com'], titre: 'La facture et le placement dans les deux sens',
      intro: `<p>Une facture indique un total de ${H('91,20 € TTC')} avec ${H('20 %')} de TVA, après une remise de ${H('5 %')} sur le prix brut HT. Un capital de ${H('2 500 €')} est placé à ${H('2 %')} par an (intérêts simples).</p>`,
      qs: [Q('a.', 'Retrouve le net commercial HT : 91,20 ÷ 1,20, en euros.', '91,20 ÷ 1,20 = 76 € HT', 76, { w: 20 }), Q('b.', 'Retrouve le prix brut HT avant la remise de 5 % : 76 ÷ 0,95, en euros.', '76 ÷ 0,95 = 80 € HT', 80, { w: 20 }), Q('c.', 'Combien d’années faut-il pour obtenir 200 € d’intérêts avec 2 500 € à 2 % ?', 'intérêt par an : 2 500 × 0,02 = 50 € ; 200 ÷ 50 = 4 ans', 4, { w: 20 }), Q('d.', 'Un capital de 1 800 € rapporte 108 € en 2 ans. Quel est le taux annuel, en pourcentage ?', '108 ÷ (1 800 × 2) = 108 ÷ 3 600 = 0,03, soit 3 %', 3, { w: 20 }), Q('e.', 'Un ami dit : « Avec 2 %, mon capital double en 10 ans. » A-t-il raison ? Justifie avec 2 500 €.', 'Non : en 10 ans, l’intérêt est 2 500 × 0,02 × 10 = 500 €. Le capital passe à 3 000 €, il ne double pas (5 000 €).', null, { lines: 3 })],
      err: { 0: [{ v: 72.96, m: 'Tu as retiré 20 % du TTC. Pour retrouver le HT, divise par 1,20.' }], 1: [{ v: 72.2, m: 'Tu as multiplié par 0,95 au lieu de diviser. Le net est 95 % du brut : brut = net ÷ 0,95.' }], 2: [{ v: 0.08, m: 'Tu as divisé 200 par 2 500 : c’est un taux, pas une durée. Calcule d’abord l’intérêt d’une année : 2 500 × 0,02.' }] },
      hints: ['Divise le TTC par 1,20.', 'Le net est 95 % du brut : divise par 0,95.', 'Calcule l’intérêt d’une année, puis divise 200 par ce nombre.', 'Taux = intérêt ÷ (capital × durée).', 'Calcule l’intérêt sur 10 ans, puis compare avec le capital.'], pouce: '91,20 ÷ 1,20 ; 76 ÷ 0,95 ; 2 500 × 0,02 ; 108 ÷ 3 600 ; 2 500 × 0,02 × 10.',
      det: ['91,20 ÷ 1,20 = 76 € HT. Contrôle : 76 × 1,20 = 91,20 €.', '76 ÷ 0,95 = 80 € HT. Contrôle : 80 × 0,95 = 76 €.', '2 500 × 0,02 = 50 € par an ; 200 ÷ 50 = 4 ans.', '1 800 × 2 = 3 600 ; 108 ÷ 3 600 = 0,03, soit 3 %.', 'En 10 ans : 2 500 × 0,02 × 10 = 500 €. Valeur acquise : 3 000 €, loin de 5 000 € : l’ami a tort.'], corr: 'a. 76 €. b. 80 €. c. 4 ans. d. 3 %. e. Non.' })];

  c.bilan = [['Je sais passer d’un prix HT à un prix TTC.', ['e1', 'pa']], ['Je sais compléter une facture avec une remise.', ['e2', 'p1', 'p3']], ['Je sais calculer une marge et un taux de marge.', ['e3', 'p2']], ['Je sais calculer un intérêt simple.', ['p3', 'pd']]];
  c.fiche = {
    essentiel: ['<b>TTC</b> = HT + TVA. Avec 20 % de TVA : TTC = HT × 1,20 et HT = TTC ÷ 1,20.', '<b>Facture</b> : prix brut, remise, net commercial HT, TVA (sur le net), total TTC.', '<b>Marge</b> = prix de vente HT − prix d’achat HT.', '<b>Taux de marge</b> = marge ÷ prix d’achat HT (× 100 pour des %).', '<b>Intérêt simple</b> : I = C × t × n. <b>Valeur acquise</b> : V = C + I.'],
    methode: ['Je repère le prix HT, le taux et la durée.', 'Je calcule dans l’ordre : remise, net, TVA, TTC.', 'Je calcule la marge, puis le taux de marge.', 'Je convertis le taux en nombre : 3 % = 0,03.', 'Je vérifie avec le coefficient multiplicateur.'],
    exemple: `<p>Casque : 90 € HT, remise 20 %, TVA 20 % : net 72 €, TVA 14,40 €, TTC 86,40 €.</p><p>Jeu acheté 40 € HT, vendu 52 € HT : marge 12 €, taux de marge 30 %.</p>`,
    pieges: ['Calculer la TVA sur le prix brut au lieu du net commercial.', 'Retirer 20 % du TTC pour retrouver le HT.', 'Diviser la marge par le prix de vente.', 'Oublier de convertir le taux : 3 % = 0,03.'],
    flash: [['TVA de 20 % sur 50 € HT : TTC ?', '60 €'], ['TTC de 120 €, TVA de 20 % : HT ?', '100 €'], ['Acheté 20 €, vendu 25 € : taux de marge ?', '25 %'], ['1 000 € à 3 % pendant 2 ans : intérêt ?', '60 €']]
  };
  chk(r2(50 * 1.2) === 60 && r2(120 / 1.2) === 100 && 25 - 20 === 5 && r2(5 / 20) === .25 && r2(1000 * .03 * 2) === 60, 'c8 fiche');
  c.words = require('./gl3')('c8');
  /* ajout-e4 : un exercice d’entraînement (3 niveaux) pour chaque notion qui n’en avait pas */
  c.entraine.push({ id: 'e4', gen: 'c8e4', lc: 4, niv: 0 }, { id: 'e4a', gen: 'c8e4a', lc: 4, niv: -1, base: 'e4' }, { id: 'e4d', gen: 'c8e4d', lc: 4, niv: 1, base: 'e4' });
  c.bilan[3][1].push('e4');
  return c;
};
