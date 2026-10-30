/* Chapitre 4 · Pourcentages et échelles — CAP Maths (programme de mathématiques des classes préparant au CAP, BOEN spécial n° 5 du 11 avril 2019). */
'use strict';
const K = require('./kit3e');
const { H, FM, R, Q, BQ, PB, ENT, tab, S, T, Rc, Ar, st, SN, cell } = K;
const { SK, D } = require('./sk3');
const { MCVG } = require('../shared/gens.js');
const fr = (x, d) => MCVG.fr(x, d), rnd = MCVG.rnd, f1 = x => fr(rnd(x, 1), 1), f2 = x => fr(rnd(x, 2), 2), f3 = x => fr(rnd(x, 3), 3);

module.exports = function (chk) {
  const c = { id: 'c4', n: 4, col: 'nombre', icone: '💯', dom: 'Nombres et calculs · pourcentages', titre: 'Pourcentages et échelles', sous: 'Part, remise, hausse, taux d’évolution, échelle' };
  c.parties = [{ t: 'Calculer un pourcentage', n: [1] }, { t: 'Hausses, baisses et taux d’évolution', n: [2, 3] }, { t: 'Les échelles', n: [4] }];
  c.travail = { question: `Netflix a fait passer l’abonnement « Standard avec pub » de ${H('5,99 €')} à ${H('7,99 €')}. De combien de pour cent le prix a-t-il augmenté ? Et que représentent ${H('6 cm')} sur un plan à l’échelle 1/50 ? Tu sauras répondre aux notions 3 et 4.` };
  c.objectifs = ['Je saurai calculer un pourcentage d’une quantité et exprimer une part en pourcentage.', 'Je saurai calculer un prix après une hausse ou une baisse avec un coefficient multiplicateur.', 'Je saurai calculer un taux d’évolution à partir de deux valeurs.', 'Je saurai passer d’une longueur sur un plan à la longueur réelle, et inversement.'];
  c.depart = 'c4';

  /* ---------- contrôles des nombres du chapitre ---------- */
  const NF = D.netflix, ev = (a, b) => (b - a) / a, cn25 = D.cnc2025, cn24 = D.cnc2024;
  chk(NF.length === 3 && NF[0][1] === 7.99 && NF[0][2] === 5.99 && NF[2][1] === 21.99 && NF[2][2] === 19.99 && NF[1][1] === 14.99 && NF[1][2] === 13.49, 'c4 tarifs Netflix');
  chk(rnd(7.99 - 5.99, 2) === 2 && f3(ev(5.99, 7.99)) === '0,334' && f1(ev(5.99, 7.99) * 100) === '33,4' && f1(ev(13.49, 14.99) * 100) === '11,1' && f1(ev(19.99, 21.99) * 100) === '10,0' && f1(2 / 7.99 * 100) === '25,0' && rnd(14.99 - 13.49, 2) === 1.5 && rnd(1.5 * 12, 2) === 18, 'c4 hausses Netflix');
  chk(80 * 30 / 100 === 24 && 80 / 10 === 8 && 3 * 8 === 24 && 60 * 25 / 100 === 15 && 60 - 15 === 45 && 60 * .75 === 45 && 40 * 1.25 === 50 && 100 * 1.25 * .75 === 93.75 && 45 / 60 === .75 && 25 / 100 === .25, 'c4 remises');
  chk(rnd(cn25[6] - cn24[6], 2) === -3.61 && f1(ev(cn24[6], cn25[6]) * 100) === '−20,2' && f1(ev(cn24[7], cn25[7]) * 100) === '−29,7' && f1(ev(cn24[11], cn25[11]) * 100) === '0,9' && rnd(cn25.reduce((a, x) => a + x, 0), 2) === 156.66 && rnd(cn24.reduce((a, x) => a + x, 0), 2) === 181.54 && f1(ev(181.54, 156.66) * 100) === '−13,7', 'c4 cinéma 2025 et 2024');
  chk(6 * 50 === 300 && 300 / 100 === 3 && 5 * 200 === 1000 && 2 * 100 / 20 === 10 && rnd(19.7 * 100, 1) === 1970 && 1970 / 100 === 19.7 && rnd(1970 / 50, 1) === 39.4 && rnd(19.7 * 1.5, 2) === 29.55 && rnd(1970 / 20, 1) === 98.5, 'c4 échelles');
  chk(10 / 25 === .4 && 25 / 100 * 60 === 15 && rnd(50 * 1.1, 2) === 55 && 80 * .8 === 64 && (12 - 10) / 10 === .2 && (40 - 50) / 50 === -.2, 'c4 « À moi »');

  /* ---------- méthodes visuelles ---------- */
  const bg = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#DCE2F2" stroke-width="1.2" stroke-dasharray="4 3"/>`;
  // 1. pourcentage d’une quantité
  const pcs = S(600, 200, st(1, SN(1, 22, 24) + T(44, 29, '80 € = 100 % du prix', { fs: 13, a: 'start', c: 'kt' }) + Array.from({ length: 10 }, (_, i) => Rc(24 + i * 56, 44, 52, 34, { c: i < 3 ? 'k' : 'k2', rx: 4 }) + T(50 + i * 56, 66, '10 %', { fs: 11, c: i < 3 ? 'tw' : 'ts' })).join(''))
    + st(2, SN(2, 22, 110) + T(44, 115, 'une case : 10 % de 80 = 80 ÷ 10 = 8 €', { fs: 13, a: 'start' }))
    + st(3, `<path d="M24 86v7h164v-7" class="ks" fill="none" stroke-width="2.2"/>` + SN(3, 22, 140) + T(44, 145, '3 cases : 3 × 8 = 24 €', { fs: 13, a: 'start' }))
    + st(4, SN(4, 22, 178) + Rc(44, 162, 500, 30, { c: 'k', rx: 10 }) + T(294, 183, '30 % de 80 = 80 × 30 ÷ 100 = 24 €', { fs: 14, c: 'tw' })),
  'Une bande de dix cases de 10 % : trois cases sont colorées et valent 3 fois 8 euros, soit 24 euros');
  // 2. coefficient multiplicateur
  const coe = S(600, 200, st(1, SN(1, 22, 24) + T(44, 29, 'baisse de 25 % : 100 % − 25 % = 75 %, soit le coefficient 0,75', { fs: 13, a: 'start', c: 'kt' }))
    + st(2, cell(24, 44, 100, 40, '60 €') + Ar(130, 64, 250, 64, { w: 2.4, h: 8 }) + T(190, 56, '× 0,75', { fs: 13, c: 'kt' }) + cell(256, 44, 100, 40, '45 €', { k: true }) + SN(2, 394, 64) + T(414, 69, '60 × 0,75 = 45 €', { fs: 13, a: 'start' }))
    + st(3, SN(3, 22, 112) + T(44, 117, 'hausse de 25 % : 100 % + 25 % = 125 %, soit le coefficient 1,25', { fs: 13, a: 'start', c: 'kt' }) + cell(24, 128, 100, 40, '40 €') + Ar(130, 148, 250, 148, { w: 2.4, h: 8 }) + T(190, 140, '× 1,25', { fs: 13, c: 'kt' }) + cell(256, 128, 100, 40, '50 €', { k: true }) + T(414, 153, '40 × 1,25 = 50 €', { fs: 13, a: 'start' }))
    + st(4, SN(4, 22, 188) + T(44, 193, 'contrôle : une baisse donne un prix plus petit, une hausse un prix plus grand', { fs: 12.5, a: 'start' })),
  'Un prix de 60 euros multiplié par 0,75 devient 45 euros ; un prix de 40 euros multiplié par 1,25 devient 50 euros');
  // 3. taux d’évolution : deux barres avec graduations
  const bx = 14, by = 168;
  const tau = S(600, 200, st(1, [2, 4, 6, 8].map(v => bg(46, by - v * bx, 250, by - v * bx) + T(40, by - v * bx + 4, v, { fs: 10, a: 'end', c: 'ts' })).join('') + `<line x1="46" y1="${by}" x2="250" y2="${by}" class="ks" stroke-width="2.2"/><line x1="46" y1="${by}" x2="46" y2="40" class="ks" stroke-width="2.2"/>`
    + T(52, 28, 'prix en €', { fs: 10.5, a: 'start', c: 'ts' }) + Rc(72, by - 5.99 * bx, 60, 5.99 * bx, { c: 'k2', rx: 2 }) + Rc(162, by - 7.99 * bx, 60, 7.99 * bx, { c: 'k', rx: 2 }) + T(102, by - 5.99 * bx - 7, '5,99 €', { fs: 13 }) + T(192, by - 7.99 * bx - 7, '7,99 €', { fs: 13 }) + T(102, 184, 'avant', { fs: 11.5, c: 'ts' }) + T(192, 184, 'après', { fs: 11.5, c: 'ts' }) + SN(1, 290, 30) + T(312, 35, 'départ 5,99 €, arrivée 7,99 €', { fs: 13, a: 'start', c: 'kt' }))
    + st(2, SN(2, 290, 72) + T(312, 77, 'écart : 7,99 − 5,99 = 2,00 €', { fs: 13, a: 'start' }))
    + st(3, SN(3, 290, 112) + T(312, 117, '2,00 ÷ 5,99 ≈ 0,334', { fs: 13, a: 'start' }))
    + st(4, SN(4, 290, 152) + Rc(312, 136, 272, 40, { c: 'k', rx: 10 }) + T(448, 161, '× 100 : hausse de 33,4 %', { fs: 14, c: 'tw' })),
  'Deux barres, 5,99 euros avant et 7,99 euros après, avec les graduations 2, 4, 6 et 8 : l’écart de 2,00 euros divisé par 5,99 donne une hausse de 33,4 pour cent');
  // 4. échelle
  const ech = S(600, 200, st(1, SN(1, 22, 24) + T(44, 29, 'sur le plan, au 1/50 : 6 cm', { fs: 13, a: 'start', c: 'kt' }) + Array.from({ length: 6 }, (_, i) => cell(30 + i * 44, 40, 44, 28, i + 1, { fs: 13 })).join('') + T(302, 59, 'cm', { fs: 11.5, a: 'start', c: 'ts' }))
    + st(2, SN(2, 22, 92) + T(44, 97, '1 cm sur le plan = 50 cm en vrai', { fs: 13, a: 'start' }))
    + st(3, T(30, 114, 'en vrai (en cm)', { fs: 11.5, a: 'start', c: 'ts' }) + Array.from({ length: 6 }, (_, i) => cell(30 + i * 44, 120, 44, 28, 50 * (i + 1), { fs: 11.5, k: i === 5 })).join('') + SN(3, 22, 168) + T(44, 173, 'longueur réelle : 6 × 50 = 300 cm', { fs: 13, a: 'start' }))
    + st(4, SN(4, 352, 100) + T(372, 105, 'je convertis en mètres', { fs: 13, a: 'start', c: 'kt' }) + Rc(340, 118, 244, 48, { c: 'k', rx: 10 }) + T(462, 149, '300 cm = 3 m', { fs: 19, c: 'tw' })),
  'Une règle de 6 centimètres sur le plan et la règle correspondante en vrai graduée de 50 à 300 centimètres : 3 mètres');

  c.notions = [
    { titre: 'Calculer un pourcentage d’une quantité', decouvre: { txt: `Une boutique vend un jeu vidéo ${H('80 €')}. Pendant les soldes, la remise est de ${H('30 %')}. Quelle est la remise en euros ?`, img: SK.pct() },
      methode: ['J’écris la quantité de départ : 80 € représentent 100 %.', 'Je calcule 10 % : 80 ÷ 10 = 8 €.', 'Je compte les dizaines de pour cent : 30 % = 3 × 10 %, donc 3 × 8 = 24 €.', 'Je contrôle avec la formule : 80 × 30 ÷ 100 = 24 €.'],
      vois: pcs,
      solution: `<p>10 % de 80 € font 8 €. Comme 30 % = 3 × 10 %, la remise est de 3 × 8 = <b>24 €</b>.</p><p>Contrôle : ${FM(R`80\times\dfrac{30}{100}=24`)}.</p>`,
      retiens: `<p>Prendre <b>p %</b> d’une quantité, c’est la multiplier par ${FM(R`\dfrac{p}{100}`)}.</p><p>Pour exprimer une <b>part</b> en pourcentage : ${FM(R`\dfrac{\text{partie}}{\text{total}}\times100`)}</p>`,
      attention: 'Le pourcentage s’applique à la quantité de départ. Vérifie que le résultat est plus petit que cette quantité quand le pourcentage est inférieur à 100 %.',
      amoi: [['Calcule 25 % de 60 €.', '25 % = 1/4 ; 60 ÷ 4 = 15 €'], ['Dans une classe de 25 élèves, 10 jouent au basket. Quel pourcentage ?', '10 ÷ 25 = 0,4, soit 40 %']] },
    { titre: 'Hausse, baisse et coefficient multiplicateur', decouvre: { txt: `Un casque audio coûte ${H('60 €')}. Il est soldé de ${H('25 %')}. Un accessoire de ${H('40 €')} augmente de ${H('25 %')}. Quels sont les nouveaux prix ?`, img: SK.coefm() },
      methode: ['Pour une baisse de 25 %, je garde 100 % − 25 % = 75 % du prix : le coefficient est 0,75.', 'Je multiplie le prix de départ par le coefficient : 60 × 0,75 = 45 €.', 'Pour une hausse de 25 %, je paie 100 % + 25 % = 125 % : le coefficient est 1,25, et 40 × 1,25 = 50 €.', 'Je contrôle le sens : une baisse donne un prix plus petit, une hausse un prix plus grand.'],
      vois: coe,
      solution: `<p>Baisse de 25 % : ${FM(R`60\times0{,}75=45`)} €. Hausse de 25 % : ${FM(R`40\times1{,}25=50`)} €.</p><p>Le casque coûte maintenant <b>45 €</b> et l’accessoire <b>50 €</b>.</p>`,
      retiens: `<p>Une <b>baisse de t %</b> multiplie par ${FM(R`1-\dfrac{t}{100}`)}.</p><p>Une <b>hausse de t %</b> multiplie par ${FM(R`1+\dfrac{t}{100}`)}.</p><p>Ce nombre s’appelle le <b>coefficient multiplicateur</b>.</p>`,
      attention: 'Une hausse de 25 % puis une baisse de 25 % ne se compensent pas : 100 € → 125 € → 93,75 €. Chaque pourcentage s’applique au prix du moment.',
      amoi: [['Un prix de 50 € augmente de 10 %. Quel est le nouveau prix ?', 'coefficient 1,10 ; 50 × 1,10 = 55 €'], ['Un prix de 80 € baisse de 20 %. Quel est le nouveau prix ?', 'coefficient 0,80 ; 80 × 0,80 = 64 €']] },
    { titre: 'Calculer un taux d’évolution', decouvre: { txt: `En avril 2025, l’abonnement Netflix « Standard avec pub » est passé de ${H('5,99 €')} à ${H('7,99 €')} par mois. De combien de pour cent le prix a-t-il augmenté ?`, img: SK.evol() },
      methode: ['Je repère la valeur de départ (5,99 €) et la valeur d’arrivée (7,99 €).', 'Je calcule l’écart : 7,99 − 5,99 = 2,00 €.', 'Je divise l’écart par la valeur de départ : 2,00 ÷ 5,99 ≈ 0,334.', 'Je multiplie par 100 et j’écris le sens : hausse de 33,4 %.'],
      vois: tau,
      solution: `<p>L’écart est 7,99 − 5,99 = 2,00 €. Puis 2,00 ÷ 5,99 ≈ 0,334, soit une <b>hausse d’environ 33,4 %</b>.</p><p>Pour l’offre Premium : (21,99 − 19,99) ÷ 19,99 ≈ 0,100, soit environ 10,0 %.</p><p class="srcl">${D.srcNetflix}</p>`,
      retiens: `<p>${FM(R`\text{taux d'évolution}=\dfrac{\text{valeur d'arrivée}-\text{valeur de départ}}{\text{valeur de départ}}`)}</p><p>Un résultat positif est une <b>hausse</b>, un résultat négatif est une <b>baisse</b>. On multiplie par 100 pour l’écrire en pourcentage.</p>`,
      attention: 'On divise toujours par la valeur de départ, pas par la valeur d’arrivée : 2,00 ÷ 7,99 donnerait 25,0 %, ce qui est faux.',
      amoi: [['Un abonnement passe de 10 € à 12 €. Quelle est la hausse en pourcentage ?', '(12 − 10) ÷ 10 = 0,2, soit 20 %'], ['Un jeu passe de 50 € à 40 €. Quel est le taux d’évolution ?', '(40 − 50) ÷ 50 = −0,2 : une baisse de 20 %']] },
    { titre: 'Les échelles', decouvre: { txt: `Sur le plan d’une salle de jeux à l’échelle ${H('1/50')}, un mur mesure ${H('6 cm')}. Quelle est sa longueur réelle ? Et la statue de l’Unicorn Gundam (${H('19,7 m')}) dessinée au 1/100 ?`, img: SK.echelle() },
      methode: ['Je lis l’échelle : 1/50 veut dire que 1 cm sur le plan représente 50 cm en vrai.', 'Je multiplie la longueur du plan par 50 : 6 × 50 = 300 cm.', 'Je convertis dans l’unité utile : 300 cm = 3 m.', 'Je contrôle le sens : le plan est plus petit que la réalité, donc la longueur réelle est plus grande.'],
      vois: ech,
      solution: `<p>6 × 50 = 300 cm, soit <b>3 m</b>.</p><p>Statue : 19,7 m = 1 970 cm ; 1 970 ÷ 100 = <b>19,7 cm</b> sur l’affiche.</p><p class="srcl">${D.srcGundam}</p>`,
      retiens: `<p>À l’échelle ${FM(R`\dfrac{1}{e}`)}, <b>longueur réelle = longueur sur le plan × e</b>.</p><p>Pour dessiner : <b>longueur sur le plan = longueur réelle ÷ e</b>. L’échelle est un coefficient de proportionnalité.</p>`,
      attention: 'Écris les deux longueurs dans la même unité avant de calculer : 1 m = 100 cm. Du plan vers la réalité on multiplie, de la réalité vers le plan on divise.',
      amoi: [['Sur un plan au 1/200, une longueur mesure 5 cm. Quelle est sa longueur réelle ?', '5 × 200 = 1 000 cm, soit 10 m'], ['Une table de 2 m est dessinée au 1/20. Quelle est sa longueur sur le plan ?', '2 m = 200 cm ; 200 ÷ 20 = 10 cm']] }];

  /* Je programme avec Scratch */
  c.scratch = [{ titre: 'calculer un prix soldé', lc: 2, texte: 'Un programme peut appliquer un coefficient multiplicateur. Le lutin demande un prix et une remise en pourcentage, puis dit le nouveau prix.',
    prog: [{ c: 'evt', t: 'quand ⚑ est cliqué' }, { c: 'sns', t: 'demander « Prix en € ? » et attendre' }, { c: 'var', t: 'mettre prix à (réponse)' }, { c: 'sns', t: 'demander « Remise en % ? » et attendre' }, { c: 'var', t: 'mettre nouveau à (prix × (1 − (réponse ÷ 100)))' }, { c: 'look', t: 'dire (nouveau)' }],
    qs: [['On répond 60 puis 25. Que dit le lutin ?', '45', '1 − 25 ÷ 100 = 0,75 et 60 × 0,75 = 45 : le lutin dit 45 (euros).'], ['Quel est le coefficient multiplicateur quand la remise est 20 % ?', '0,8', '1 − 20 ÷ 100 = 1 − 0,2 = 0,8.'], ['Que dit le lutin si la remise vaut 0 ?', 'le prix de départ', 'Le coefficient vaut 1 − 0 = 1 : le prix ne change pas.']] }];
  chk(60 * (1 - 25 / 100) === 45 && 1 - 20 / 100 === .8, 'c4 Scratch');

  c.mots = [['pourcentage', 'nombre de parts sur 100', '30 % de 80 € : 30 parts sur 100 de 80 €, soit 24 €.'], ['remise', 'baisse de prix, en euros ou en pourcentage', 'une remise de 25 % sur 60 € fait 15 €.'], ['hausse', 'augmentation d’une valeur', 'de 5,99 € à 7,99 € : une hausse de 2,00 €.'], ['baisse', 'diminution d’une valeur', 'de 60 € à 45 € : une baisse de 25 %.'], ['coefficient multiplicateur', 'nombre par lequel on multiplie pour appliquer une hausse ou une baisse', 'hausse de 25 % : × 1,25 ; baisse de 25 % : × 0,75.'], ['taux d’évolution', 'écart divisé par la valeur de départ', '(7,99 − 5,99) ÷ 5,99 ≈ 0,334, soit 33,4 %.'], ['échelle', 'rapport entre une longueur sur le plan et la longueur réelle', 'à l’échelle 1/50, 6 cm sur le plan font 300 cm en vrai.']];

  /* ---------- exercices résolus ---------- */
  c.resolus = [
    { titre: 'Calculer un prix après une remise', outil: '🧮 calculatrice', enonce: `Une boutique solde un casque audio à ${H('60 €')} de ${H('25 %')}. Calcule la remise en euros, puis le nouveau prix.`,
      rows: [['25 % de 60 = 60 × 25 ÷ 100 = <b>15</b> €', 'Je calcule la remise en euros.'], ['60 − 15 = <b>45</b> €', 'Je retire la remise du prix de départ.'], ['Autre méthode : 60 × 0,75 = <b>45</b> €', 'Le coefficient 0,75 donne directement le prix soldé.']], verif: '45 ÷ 60 = 0,75 : on paie bien 75 % du prix ✓', rep: 'La remise est de 15 € et le nouveau prix est de 45 €.', go: ['e1', 'e2'] },
    { titre: 'À toi : retrouver un taux d’évolution', outil: '🧮 calculatrice', enonce: `L’abonnement Netflix « Premium » passe de ${H('19,99 €')} à ${H('21,99 €')} par mois. Calcule le taux d’évolution, arrondi à 0,1 %.`, trous: [0, 1, 2, 3],
      rows: [['21,99 − 19,99 = ⟦2⟧ €', 'Je calcule l’écart.'], ['2 ÷ 19,99 ≈ ⟦0,1⟧', 'Je divise l’écart par la valeur de départ.'], ['0,1 × 100 = ⟦10⟧ %', 'Je passe en pourcentage.'], ['Le résultat est positif : c’est une ⟦hausse⟧', 'Le signe donne le sens de l’évolution.']], verif: '19,99 × 1,10 = 21,989 ≈ 21,99 ✓', rep: 'Le prix de l’offre Premium a augmenté d’environ 10,0 %.', go: ['e2'] }];
  chk(21.99 - 19.99 === 2 || rnd(21.99 - 19.99, 2) === 2, 'c4 résolus');
  chk(rnd(19.99 * 1.1, 3) === 21.989, 'c4 résolu 2');
  c.entraine = ENT('c4', [1, 2, 4]);

  /* ---------- je résous ---------- */
  const tabSolde = rows => tab(['Article', 'Prix de départ', 'Remise'], rows);
  const tabNf = () => tab(['Offre', 'Avant (€/mois)', 'Après (€/mois)'], NF.map(([n, a, b]) => [n, fr(b, 2), fr(a, 2)]));
  c.probs = [
    PB({ id: 'pa', niv: -1, base: 'p1', etape: 2, lc: 1, comps: ['app', 'rea'], titre: 'Une remise, pas à pas',
      intro: `<p>Une boutique solde un casque de jeu vidéo : prix de départ ${H('80 €')}, remise de ${H('30 %')}.</p>`,
      qs: [Q('a.', 'Calcule 10 % de 80 €.', '80 ÷ 10 = 8 €', 8, { w: 18 }), Q('b.', 'Calcule la remise de 30 %, en euros.', '3 × 8 = 24 €', 24, { w: 18 }), Q('c.', 'Calcule le prix soldé.', '80 − 24 = 56 €', 56, { w: 18 }), Q('d.', 'Vérifie avec le coefficient 0,70 : 80 × 0,70.', '80 × 0,70 = 56 €', 56, { w: 18 })],
      err: { 1: [{ v: 8, m: 'C’est 10 %. Pour 30 %, multiplie par 3.' }], 2: [{ v: 24, m: 'C’est la remise. Retire-la du prix de départ.' }] },
      hints: ['10 % d’une quantité : on divise par 10.', '30 % = 3 × 10 %.', 'Prix soldé = prix de départ − remise.', 'Une remise de 30 % laisse 70 % du prix : coefficient 0,70.'], pouce: '80 ÷ 10 ; 3 × 8 ; 80 − 24 ; 80 × 0,70.',
      det: ['10 % = 1/10, donc 80 ÷ 10 = 8 €.', '30 % = 3 × 10 % : 3 × 8 = 24 €.', '80 − 24 = 56 €.', '100 % − 30 % = 70 % = 0,70 ; 80 × 0,70 = 56 €, le même résultat ✓.'], corr: 'a. 8 €. b. 24 €. c. 56 €. d. 56 €.' }),
    PB({ id: 'p1', etape: 2, lc: 2, comps: ['app', 'ana', 'rea', 'val'], titre: 'Les soldes de la boutique de goodies',
      intro: `<p>Une boutique de goodies affiche ses soldes.</p>${tabSolde([['Manette', '45 €', '20 %'], ['Casque', '80 €', '30 %'], ['Jeu', '60 €', '25 %']])}`,
      qs: [Q('a.', 'Calcule la remise sur la manette, en euros.', '45 × 20 ÷ 100 = 9 €', 9, { w: 18 }), Q('b.', 'Calcule le prix soldé du casque.', '80 × 0,70 = 56 €', 56, { w: 18 }), Q('c.', 'Calcule le prix soldé du jeu.', '60 × 0,75 = 45 €', 45, { w: 18 }), Q('d.', 'Combien paie-t-on les trois articles soldés ? (manette soldée : 36 €)', '36 + 56 + 45 = 137 €', 137, { w: 18 }), Q('e.', 'Quelle économie cela représente-t-il par rapport au prix de départ ? (185 € au total)', '185 − 137 = 48 €', 48, { w: 18 })],
      err: { 1: [{ v: 24, m: 'C’est la remise. Il faut le prix soldé : 80 − 24, ou 80 × 0,70.' }], 2: [{ v: 15, m: 'C’est la remise. Retire-la du prix de départ.' }], 4: [{ v: 137, m: 'C’est le prix payé. L’économie est la différence avec le prix de départ.' }] },
      hints: ['Remise = prix × pourcentage ÷ 100.', 'Prix soldé = prix × (1 − pourcentage ÷ 100).', 'Même méthode : 60 × 0,75.', 'Additionne les trois prix soldés.', 'Économie = prix de départ total − prix payé.'], pouce: '45 × 20 ÷ 100 ; 80 × 0,70 ; 60 × 0,75 ; 36 + 56 + 45.',
      det: ['45 × 20 ÷ 100 = 9 €.', '100 % − 30 % = 70 % : 80 × 0,70 = 56 €.', '100 % − 25 % = 75 % : 60 × 0,75 = 45 €.', '36 + 56 = 92 ; 92 + 45 = 137 €.', '45 + 80 + 60 = 185 € au départ ; 185 − 137 = 48 €.'], corr: 'a. 9 €. b. 56 €. c. 45 €. d. 137 €. e. 48 €.' }),
    PB({ id: 'p2', etape: 3, lc: 3, defi: 5, bulle: 'Ce cas se fait en 5 étapes avec de vrais tarifs. Pour chaque offre, trouve d’abord l’écart, puis divise par le prix d’avant.', autravail: { comp: 'rea', txt: 'calculer une hausse de tarif ou de fournitures et l’expliquer à un client.' }, comps: ['app', 'ana', 'rea', 'val'], titre: 'La hausse des abonnements Netflix',
      intro: `<p>En avril 2025, Netflix a augmenté ses abonnements mensuels en France.</p>${tab(['Offre', 'Avant (€/mois)', 'Après (€/mois)'], NF.map(([n, a, b]) => [n, fr(b, 2), fr(a, 2)]))}<p class="srcl">${D.srcNetflix}</p>`,
      qs: [Q('a.', 'Calcule l’écart de prix de l’offre « Standard » (14,99 − 13,49), en euros.', '14,99 − 13,49 = 1,50 €', 1.5, { w: 18, tol: .006 }), Q('b.', 'Calcule son taux d’évolution, en pourcentage (au dixième).', '1,50 ÷ 13,49 ≈ 0,111, soit 11,1 %', 11.1, { w: 18, tol: .06 }), Q('c.', 'Calcule le taux d’évolution de l’offre « Standard avec pub » (au dixième).', '2,00 ÷ 5,99 ≈ 0,334, soit 33,4 %', 33.4, { w: 18, tol: .06 }), Q('d.', 'Quelle offre a connu la plus forte hausse, en pourcentage ?', 'Standard avec pub (33,4 %, contre 11,1 % et 10,0 %)', null, { lines: 1 }), Q('e.', 'Un foyer garde l’offre « Standard » toute l’année. Combien paie-t-il de plus sur 12 mois qu’avant la hausse ?', '12 × 1,50 = 18 €', 18, { w: 18 })],
      err: { 1: [{ v: 1.5, m: 'C’est l’écart en euros. Divise-le par le prix de départ (13,49), puis multiplie par 100.' }, { v: 10, m: 'Tu as divisé par le prix d’arrivée. Il faut diviser par le prix de départ : 13,49.' }], 2: [{ v: 25, m: 'Tu as divisé par le prix d’arrivée (7,99). Il faut diviser par le prix de départ : 5,99.' }] },
      hints: ['Écart = prix après − prix avant.', 'Taux = écart ÷ prix avant, puis × 100.', 'Même méthode pour l’offre « Standard avec pub ».', 'Compare les trois taux d’évolution.', 'Écart par mois × 12.'], pouce: '1,50 ÷ 13,49 ; 2,00 ÷ 5,99 ; 12 × 1,50.',
      det: ['14,99 − 13,49 = 1,50 €.', '1,50 ÷ 13,49 ≈ 0,111, soit environ 11,1 %.', '7,99 − 5,99 = 2,00 € ; 2,00 ÷ 5,99 ≈ 0,334, soit environ 33,4 %.', 'L’offre Premium augmente de (21,99 − 19,99) ÷ 19,99 ≈ 10,0 %. Le plus fort taux est 33,4 % : « Standard avec pub ».', '12 × 1,50 = 18 € de plus sur l’année.'], corr: 'a. 1,50 €. b. 11,1 %. c. 33,4 %. d. Standard avec pub. e. 18 €.' }),
    PB({ id: 'p3', etape: 4, lc: 3, cls: 'bac', defi: 5, bulle: 'Voici une question « vers le CCF » avec des données du cinéma. Pour chaque mois, calcule l’écart, divise par la valeur de 2024, puis conclus avec une phrase.', autravail: { comp: 'val', txt: 'comparer deux années ou deux mois et vérifier une affirmation chiffrée.' }, comps: ['app', 'ana', 'rea', 'val', 'com'], titre: 'Le cinéma en 2025 et en 2024',
      intro: `<p>Voici les entrées dans les cinémas français, en millions, pour trois mois de 2024 et de 2025 (estimations).</p>${tab(['Mois', 'Juillet', 'Août', 'Décembre'], [['2024', '17,90', '14,13', '20,54'], ['2025', '14,29', '9,94', '20,73']])}<p class="srcl">${D.srcCnc}</p>`,
      qs: [BQ('1', 'Calculer l’écart d’entrées en juillet entre 2025 et 2024, en millions.', 'app', '14,29 − 17,90 = −3,61 millions', -3.61, { w: 22, tol: .006 }), BQ('2', 'Calculer le taux d’évolution entre juillet 2024 et juillet 2025, en pourcentage (au dixième).', 'rea', '−3,61 ÷ 17,90 ≈ −0,202 : −20,2 %', -20.2, { w: 22, tol: .06 }), BQ('3', 'Calculer le taux d’évolution entre août 2024 et août 2025 (au dixième).', 'rea', '(9,94 − 14,13) ÷ 14,13 ≈ −0,297 : −29,7 %', -29.7, { w: 22, tol: .06 }), BQ('4', 'Calculer le taux d’évolution en décembre (au dixième).', 'rea', '(20,73 − 20,54) ÷ 20,54 ≈ 0,009 : +0,9 %', 0.9, { w: 22, tol: .06 }), BQ('5', 'Un journaliste écrit : « Au mois d’août, le cinéma a perdu plus de 30 % de ses spectateurs. » A-t-il raison ? Justifier.', 'val', 'Non : la baisse est de 29,7 %, ce qui est un peu moins de 30 %.', null, { lines: 2 })],
      err: { 1: [{ v: 20.2, m: 'Il s’agit d’une baisse : le taux est négatif (−20,2 %).' }, { v: -25.3, m: 'Tu as divisé par la valeur de 2025. Divise par la valeur de départ (2024) : 17,90.' }], 2: [{ v: 29.7, m: 'Il s’agit d’une baisse : le taux est négatif (−29,7 %).' }] },
      hints: ['Écart = valeur de 2025 − valeur de 2024.', 'Taux = écart ÷ valeur de 2024, puis × 100.', 'Même méthode pour août : (9,94 − 14,13) ÷ 14,13.', 'Décembre : un très petit écart donne un taux proche de 0.', 'Compare le taux d’août avec −30 %.'], pouce: '(14,29 − 17,90) ÷ 17,90 ; (9,94 − 14,13) ÷ 14,13.',
      det: ['14,29 − 17,90 = −3,61 millions d’entrées.', '−3,61 ÷ 17,90 ≈ −0,2017, soit −20,2 % : une baisse.', '9,94 − 14,13 = −4,19 ; −4,19 ÷ 14,13 ≈ −0,2965, soit −29,7 %.', '20,73 − 20,54 = 0,19 ; 0,19 ÷ 20,54 ≈ 0,0093, soit +0,9 % : une très légère hausse.', 'La baisse d’août est de 29,7 %, donc inférieure à 30 % : le journaliste exagère un peu.'], corr: '1. −3,61. 2. −20,2 %. 3. −29,7 %. 4. +0,9 %. 5. Non, 29,7 % de baisse.' }),
    PB({ id: 'pd', niv: 1, base: 'p3', etape: 3, lc: 4, autravail: { comp: 'rea', txt: 'lire un plan, passer d’une longueur dessinée à une longueur réelle et choisir une échelle.' }, comps: ['ana', 'rea', 'val', 'com'], titre: 'La statue du Unicorn Gundam sur une affiche',
      intro: `<p>La statue de l’Unicorn Gundam mesure ${H('19,7 m')} de haut. Un magasin veut la dessiner sur une affiche.</p><p class="srcl">${D.srcGundam}</p>`,
      qs: [Q('a.', 'Convertis la hauteur de la statue en centimètres.', '19,7 m = 1 970 cm', 1970, { w: 22 }), Q('b.', 'Quelle hauteur a le dessin à l’échelle 1/100, en cm ?', '1 970 ÷ 100 = 19,7 cm', 19.7, { w: 22, tol: .06 }), Q('c.', 'Quelle hauteur a le dessin à l’échelle 1/50, en cm ?', '1 970 ÷ 50 = 39,4 cm', 39.4, { w: 22, tol: .06 }), Q('d.', 'On agrandit l’affiche au 1/100 de 50 %. Quelle est sa nouvelle hauteur, en cm ?', '19,7 × 1,5 = 29,55 cm', 29.55, { w: 22, tol: .006 }), Q('e.', 'On veut une statue de 20 cm de haut sur le dessin. Quelle échelle 1/… faut-il environ ? Justifier.', '1 970 ÷ 20 = 98,5 : environ 1/100.', null, { lines: 2 })],
      err: { 0: [{ v: 197, m: 'Tu as multiplié par 10. 1 m = 100 cm : multiplie par 100.' }], 1: [{ v: 197000, m: 'Tu as multiplié par l’échelle. Pour dessiner, on divise la longueur réelle par 100.' }], 3: [{ v: 9.85, m: 'Tu as pris la moitié. Agrandir de 50 %, c’est multiplier par 1,5.' }] },
      hints: ['1 m = 100 cm : on multiplie par 100.', 'Longueur sur le dessin = longueur réelle ÷ 100.', 'Même méthode avec 50.', 'Hausse de 50 % : coefficient 1,5.', 'Divise la hauteur réelle (1 970 cm) par la hauteur du dessin (20 cm).'], pouce: '19,7 × 100 ; 1 970 ÷ 100 ; 19,7 × 1,5.',
      det: ['19,7 × 100 = 1 970 cm.', '1 970 ÷ 100 = 19,7 cm.', '1 970 ÷ 50 = 39,4 cm.', '100 % + 50 % = 150 % : 19,7 × 1,5 = 29,55 cm.', '1 970 ÷ 20 = 98,5 : l’échelle 1/100 convient à peu près (le dessin mesure 19,7 cm).'], corr: 'a. 1 970 cm. b. 19,7 cm. c. 39,4 cm. d. 29,55 cm. e. Environ 1/100.' })];

  c.bilan = [['Je sais calculer un pourcentage d’une quantité.', ['e1', 'pa', 'p1']], ['Je sais calculer un prix après une hausse ou une baisse.', ['e2', 'pa', 'p1']], ['Je sais calculer un taux d’évolution.', ['e2', 'p2', 'p3']], ['Je sais utiliser une échelle.', ['e3', 'pd']]];
  c.fiche = {
    essentiel: ['<b>p % d’une quantité</b> : quantité × p ÷ 100. Une <b>part</b> en % : partie ÷ total × 100.', '<b>Baisse de t %</b> : × (1 − t ÷ 100). <b>Hausse de t %</b> : × (1 + t ÷ 100).', '<b>Taux d’évolution</b> = (arrivée − départ) ÷ départ, puis × 100. Positif : hausse ; négatif : baisse.', '<b>Échelle 1/e</b> : réel = plan × e ; plan = réel ÷ e.', 'Toujours : même unité, et un résultat vraisemblable.'],
    methode: ['Je repère la quantité de départ (100 %).', 'Je choisis : remise en euros, coefficient, taux ou échelle.', 'Je calcule et j’écris l’unité (€, %, cm, m).', 'Je contrôle le sens : une baisse diminue, une hausse augmente.', 'Je réponds avec une phrase.'],
    exemple: `<p>Casque à 60 €, remise de 25 % : 60 × 0,75 = 45 €.</p><p>Netflix : de 5,99 € à 7,99 € : 2,00 ÷ 5,99 ≈ 0,334, soit +33,4 %.</p><p>Plan au 1/50 : 6 cm × 50 = 300 cm = 3 m.</p>`,
    pieges: ['Diviser par la valeur d’arrivée au lieu de la valeur de départ.', 'Oublier le signe : une baisse donne un taux négatif.', 'Retirer 25 % puis rajouter 25 % : on ne retombe pas sur le prix de départ.', 'Mélanger cm et m dans le calcul d’une échelle.'],
    flash: [['25 % de 80 € ?', '20 €'], ['Coefficient d’une hausse de 10 % ?', '1,10'], ['De 50 € à 60 € : taux d’évolution ?', '+20 %'], ['Échelle 1/100 : 3 cm sur le plan ?', '300 cm = 3 m']]
  };
  chk(25 * 80 / 100 === 20 && (60 - 50) / 50 === .2 && 3 * 100 === 300, 'c4 fiche');
  c.words = require('./gl3')('c4');
  return c;
};
