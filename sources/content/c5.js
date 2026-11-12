/* Chapitre 5 · Équations et formules — CAP Maths (programme de mathématiques des classes préparant au CAP, BOEN spécial n° 5 du 11 avril 2019). */
'use strict';
const K = require('./kit3e');
const { H, FM, R, Q, BQ, PB, ENT, tab, S, T, Rc, Ar, st, SN, cell } = K;
const { SK } = require('./sk3');
const { MCVG } = require('../shared/gens.js');
const fr = (x, d) => MCVG.fr(x, d), rnd = MCVG.rnd;

module.exports = function (chk) {
  const c = { id: 'c5', n: 5, col: 'algebre', icone: '🧩', dom: 'Algèbre et analyse · équations et formules', titre: 'Équations et formules', sous: 'Calculer avec une formule, résoudre ax + b = c, isoler une grandeur' };
  c.parties = [{ t: 'Utiliser une formule', n: [1] }, { t: 'Résoudre une équation', n: [2, 3] }, { t: 'Isoler une grandeur', n: [4] }];
  c.travail = { question: `Une salle de cinéma facture ${H('7,50 €')} la place plus ${H('2 €')} de réservation. Combien coûtent 4 places ? Et avec 47 €, combien de places peut-on réserver ? Tu sauras répondre aux notions 1 et 3.` };
  c.objectifs = ['Je saurai calculer la valeur d’une formule en remplaçant les lettres par des nombres.', 'Je saurai résoudre une équation du type x + a = b ou a × x = b.', 'Je saurai résoudre une équation du type a × x + b = c et vérifier la solution.', 'Je saurai isoler une grandeur dans une formule (puissance, vitesse, aire).'];
  c.depart = 'c5';

  /* ---------- contrôles des nombres du chapitre ---------- */
  const P = n => rnd(7.5 * n + 2, 2);
  chk(P(4) === 32 && P(6) === 47 && P(1) === 9.5 && P(2) === 17 && P(3) === 24.5 && rnd(7.5 * (4 + 2), 2) === 45 && P(8) === 62 && P(10) === 77, 'c5 formule du cinéma');
  chk(4 * 24 === 96 && 96 / 4 === 24 && 28 - 12 === 16 && 40 - 12 === 28 && 60 / 5 === 12, 'c5 équations simples');
  chk(2.5 * 10 + 5 === 30 && 30 - 5 === 25 && 25 / 2.5 === 10 && 3 * 7 + 7 === 28 && 28 - 7 === 21 && 21 / 3 === 7 && 4 * 8 + 6 === 38 && 38 - 6 === 32 && 3 * 5 + 4 === 19 && (19 - 4) / 3 === 5 && (10 + 6) / 2 === 8, 'c5 ax + b = c');
  chk(230 * 10 === 2300 && 2300 / 230 === 10 && 12 / 3 === 4 && 90 / 60 === 1.5 && 8 * 5 === 40 && 1840 / 230 === 8 && 5 * 2 === 10 && 8 + 10 === 18 && 18 > 16 && 12 * 3 === 36, 'c5 formules');
  chk(rnd(2.5 * 8 + 5, 2) === 25 && rnd(2.5 * 14 + 5, 2) === 40 && Math.floor((28 - 5) / 2.5) === 9 && rnd(2.5 * 4 + 5, 2) === 15 && 7 * 5 + 12 === 47 && 7 * 7 + 12 === 61 && 9 * 7 === 63 && 63 - 61 === 2 && 9 * 4 === 36 && 7 * 4 + 12 === 40, 'c5 problèmes');
  chk(240 * 2.5 === 600 && 450 / 180 === 2.5 && 300 / 1.5 === 200 && 2.5 * 60 === 150, 'c5 trajet');

  /* ---------- méthodes visuelles ---------- */
  const mini = (x, y) => cell(x, y, 36, 26, 'n', { fs: 12, c: 'ts' }) + cell(x, y + 30, 36, 26, 'P (€)', { fs: 10.5, c: 'ts' }) + [1, 2, 3, 4].map((n, i) => cell(x + 40 + i * 46, y, 42, 26, n, { fs: 13, k: n === 4 }) + cell(x + 40 + i * 46, y + 30, 42, 26, fr(P(n), Number.isInteger(P(n)) ? 0 : 2), { fs: 12, k: n === 4 })).join('');
  // 1. valeur d’une formule
  const frm = S(600, 200, st(1, SN(1, 22, 24) + T(44, 29, 'formule : P = 7,5 × n + 2   (n est le nombre de places)', { fs: 13, a: 'start', c: 'kt' }) + mini(372, 44))
    + st(2, SN(2, 22, 72) + T(44, 77, 'je remplace n par 4 : P = 7,5 × 4 + 2', { fs: 13, a: 'start' }))
    + st(3, SN(3, 22, 112) + T(44, 117, 'je multiplie d’abord : P = 30 + 2', { fs: 13, a: 'start' }))
    + st(4, SN(4, 22, 164) + Rc(44, 144, 300, 40, { c: 'k', rx: 10 }) + T(194, 171, 'P = 32 €', { fs: 18, c: 'tw' })),
  'Formule du prix P égale 7,5 fois n plus 2 : pour 4 places on calcule 7,5 fois 4 plus 2, soit 32 euros');
  // 2. a × x = b
  const eq1 = S(600, 200, st(1, SN(1, 22, 24) + T(44, 29, '4 coffres identiques contiennent 96 pièces : 4 × x = 96', { fs: 13, a: 'start', c: 'kt' }))
    + st(2, cell(24, 44, 120, 40, '4 × x') + T(160, 71, '=', { fs: 20 }) + cell(176, 44, 120, 40, '96') + SN(2, 334, 64) + T(354, 69, 'x est multiplié par 4', { fs: 13, a: 'start' }))
    + st(3, Ar(84, 90, 84, 118, { w: 2.4, h: 8 }) + T(106, 108, '÷ 4', { fs: 13, a: 'start', c: 'kt' }) + Ar(236, 90, 236, 118, { w: 2.4, h: 8 }) + T(258, 108, '÷ 4', { fs: 13, a: 'start', c: 'kt' }) + cell(24, 122, 120, 40, 'x', { k: true }) + T(160, 149, '=', { fs: 20 }) + cell(176, 122, 120, 40, '24', { k: true }) + SN(3, 334, 142) + T(354, 147, 'je divise les deux côtés par 4', { fs: 13, a: 'start' }))
    + st(4, SN(4, 22, 188) + T(44, 193, 'vérification : 4 × 24 = 96 ✓', { fs: 13, a: 'start' })),
  'L’équation 4 fois x égale 96 : on divise les deux côtés par 4 et on trouve x égal 24');
  // 3. a × x + b = c
  const eq2 = S(600, 200, st(1, SN(1, 22, 57) + cell(44, 40, 230, 34, '2,5x + 5 = 30', { fs: 16 }))
    + st(2, SN(2, 22, 115) + Ar(159, 78, 159, 96, { w: 2.4, h: 7 }) + T(190, 92, '− 5 des deux côtés', { fs: 12.5, a: 'start', c: 'kt' }) + cell(44, 98, 230, 34, '2,5x = 25', { fs: 16 }))
    + st(3, SN(3, 22, 175) + Ar(159, 136, 159, 154, { w: 2.4, h: 7 }) + T(190, 150, '÷ 2,5 des deux côtés', { fs: 12.5, a: 'start', c: 'kt' }) + cell(44, 158, 230, 34, 'x = 10', { fs: 16, k: true }))
    + st(4, SN(4, 372, 56) + T(394, 61, 'je vérifie en remplaçant :', { fs: 13, a: 'start', c: 'kt' }) + T(394, 90, '2,5 × 10 + 5', { fs: 15, a: 'start' }) + T(394, 114, '= 25 + 5 = 30 ✓', { fs: 15, a: 'start' })),
  'L’équation 2,5x plus 5 égale 30 : on retire 5 des deux côtés, puis on divise par 2,5 pour trouver x égal 10');
  // 4. isoler une grandeur : le triangle de la puissance
  const tri = S(600, 200, st(1, SN(1, 22, 24) + `<path d="M130 22L40 156H220Z" class="k2 ks" stroke-width="2.2" stroke-linejoin="round"/><line x1="78.6" y1="98" x2="181.4" y2="98" class="ks" stroke-width="2"/>` + T(130, 78, 'P', { fs: 24 }) + T(98, 138, 'U', { fs: 24 }) + T(130, 136, '×', { fs: 20, c: 'ts' }) + T(162, 138, 'I', { fs: 24 }) + T(130, 184, 'P = U × I  (W = V × A)', { fs: 12.5, c: 'kt' }))
    + st(2, SN(2, 300, 32) + T(322, 37, 'je connais P et U, je cherche I', { fs: 13, a: 'start', c: 'kt' }))
    + st(3, SN(3, 300, 80) + T(322, 85, 'je remplace : 2 300 = 230 × I', { fs: 13, a: 'start' }))
    + st(4, SN(4, 300, 140) + Rc(322, 118, 262, 44, { c: 'k', rx: 10 }) + T(453, 146, 'I = 2 300 ÷ 230 = 10 A', { fs: 15, c: 'tw' })),
  'Le triangle de la puissance P égale U fois I : avec P égal 2 300 watts et U égal 230 volts, I est égal à 2 300 divisé par 230, soit 10 ampères');

  c.notions = [
    { titre: 'Calculer avec une formule', decouvre: { txt: `Une salle de cinéma facture ${H('7,50 €')} par place plus ${H('2 €')} de réservation. Avec ${H('n')} places, le prix est ${H('P = 7,5 × n + 2')}. Combien coûtent 4 places ?`, img: '' },
      methode: ['Je repère la formule et la lettre : P = 7,5 × n + 2, avec n le nombre de places.', 'Je remplace la lettre par sa valeur : n = 4, donc P = 7,5 × 4 + 2.', 'Je calcule en respectant les priorités : je multiplie avant d’additionner, 30 + 2.', 'J’écris le résultat avec son unité : 32 €.'],
      vois: frm,
      solution: `<p>Pour 4 places : ${FM(R`P=7{,}5\times4+2=30+2=32`)}.</p><p>Les 4 places coûtent <b>32 €</b>.</p>`,
      retiens: `<p>Une <b>formule</b> relie des grandeurs écrites avec des lettres.</p><p>Pour la calculer, on <b>remplace chaque lettre par sa valeur</b>.</p><p>Puis on calcule dans l’ordre : parenthèses, puis × et ÷, puis + et −.</p>`,
      attention: 'On multiplie avant d’additionner : 7,5 × 4 + 2 = 32. Si on additionnait d’abord, on calculerait 7,5 × 6 = 45, ce qui est faux.',
      amoi: [['Avec P = 7,5 × n + 2, calcule P pour n = 6.', '7,5 × 6 = 45 ; 45 + 2 = 47 €'], ['L’aire d’un rectangle est A = L × l. Calcule A pour L = 8 m et l = 5 m.', '8 × 5 = 40 m²']] },
    { titre: 'Résoudre x + a = b et a × x = b', decouvre: { txt: `Dans un jeu vidéo, ${H('4 coffres')} identiques contiennent ${H('96 pièces')} en tout. Combien de pièces y a-t-il dans un coffre ? On note x ce nombre : ${H('4 × x = 96')}.`, img: '' },
      methode: ['J’écris l’équation : 4 × x = 96. L’inconnue est x.', 'Je repère l’opération faite sur x : x est multiplié par 4.', 'Je fais l’opération inverse des deux côtés : je divise par 4, donc x = 96 ÷ 4 = 24.', 'Je vérifie en remplaçant x : 4 × 24 = 96 ✓.'],
      vois: eq1,
      solution: `<p>${FM(R`4\times x=96`)} donne ${FM(R`x=96\div4=24`)}.</p><p>Chaque coffre contient <b>24 pièces</b>. Vérification : 4 × 24 = 96.</p>`,
      retiens: `<p>Une <b>équation</b> est une égalité avec une <b>inconnue</b>. La <b>solution</b> est la valeur de l’inconnue qui rend l’égalité vraie.</p><p>Pour la résoudre, on fait la <b>même opération des deux côtés</b> : l’addition se défait par la soustraction, la multiplication par la division.</p>`,
      attention: 'On fait toujours la même opération des deux côtés du signe égal. Vérifie la solution en remplaçant x dans l’équation de départ.',
      amoi: [['Résous x + 12 = 40.', 'x = 40 − 12 = 28'], ['Résous 5x = 60.', 'x = 60 ÷ 5 = 12']] },
    { titre: 'Résoudre a × x + b = c', decouvre: { txt: `Un club de jeux demande ${H('5 €')} d’inscription puis ${H('2,50 €')} par séance. Avec ${H('30 €')}, combien de séances peut-on payer ? On note x le nombre de séances : ${H('2,5 × x + 5 = 30')}.`, img: '' },
      methode: ['J’écris l’équation : 2,5 × x + 5 = 30.', 'Je retire 5 des deux côtés pour isoler le terme en x : 2,5 × x = 25.', 'Je divise les deux côtés par 2,5 : x = 25 ÷ 2,5 = 10.', 'Je vérifie : 2,5 × 10 + 5 = 30 ✓.'],
      vois: eq2,
      solution: `<p>${FM(R`2{,}5x+5=30`)} donne ${FM(R`2{,}5x=25`)}, puis ${FM(R`x=25\div2{,}5=10`)}.</p><p>On peut payer <b>10 séances</b>. Vérification : 2,5 × 10 + 5 = 30.</p>`,
      retiens: `<p>Pour résoudre ${FM(R`a\times x+b=c`)} :</p><p>1. je retire <b>b</b> des deux côtés : ${FM(R`a\times x=c-b`)} ;</p><p>2. je divise par <b>a</b> : ${FM(R`x=\dfrac{c-b}{a}`)}.</p>`,
      attention: 'On défait d’abord l’addition ou la soustraction (le nombre seul), puis la multiplication. Si l’équation est a × x − b = c, on ajoute b des deux côtés.',
      amoi: [['Résous 3x + 4 = 19.', '3x = 19 − 4 = 15 ; x = 15 ÷ 3 = 5'], ['Résous 2x − 6 = 10.', '2x = 10 + 6 = 16 ; x = 16 ÷ 2 = 8']] },
    { titre: 'Isoler une grandeur dans une formule', decouvre: { txt: `En électricité, la puissance est ${H('P = U × I')} (P en watts, U en volts, I en ampères). Un four de ${H('2 300 W')} fonctionne sous ${H('230 V')}. Quelle est l’intensité I ?`, img: '' },
      methode: ['J’écris la formule : P = U × I.', 'Je remplace les grandeurs connues : 2 300 = 230 × I.', 'Je résous l’équation en divisant par 230 : I = 2 300 ÷ 230 = 10.', 'J’écris le résultat avec son unité : 10 A.'],
      vois: tri,
      solution: `<p>${FM(R`P=U\times I`)} donne ${FM(R`I=\dfrac{P}{U}=\dfrac{2300}{230}=10`)}.</p><p>Le four consomme <b>10 A</b>.</p>`,
      retiens: `<p>Pour trouver une grandeur, on <b>remplace</b> les grandeurs connues.</p><p>Puis on <b>résout l’équation</b> obtenue.</p><p>${FM(R`P=U\times I\ \Rightarrow\ I=\dfrac{P}{U}`)}</p><p>${FM(R`d=v\times t\ \Rightarrow\ t=\dfrac{d}{v}`)}</p>`,
      attention: 'Garde des unités cohérentes : des watts avec des volts et des ampères, des kilomètres avec des km/h et des heures.',
      amoi: [['U = R × I. Avec U = 12 V et I = 3 A, calcule R.', 'R = 12 ÷ 3 = 4 Ω'], ['d = v × t. Avec d = 90 km et v = 60 km/h, calcule t.', 't = 90 ÷ 60 = 1,5 h']] }];

  /* Je programme avec Scratch */
  c.scratch = [{ titre: 'résoudre a × x + b = c', lc: 3, texte: 'Un programme peut résoudre une équation du type a × x + b = c. Ici a = 2,5, b = 5 et c = 30.',
    prog: [{ c: 'evt', t: 'quand ⚑ est cliqué' }, { c: 'var', t: 'mettre c à 30' }, { c: 'var', t: 'mettre x à ((c − 5) ÷ 2,5)' }, { c: 'look', t: 'dire (x)' }],
    qs: [['Que dit le lutin ?', '10', '(30 − 5) ÷ 2,5 = 25 ÷ 2,5 = 10.'], ['On met c à 40. Que dit le lutin ?', '14', '(40 − 5) ÷ 2,5 = 35 ÷ 2,5 = 14.'], ['Quelle opération défait l’addition de 5 ?', 'la soustraction de 5', 'On retire 5 des deux côtés : c’est le bloc « c − 5 ».']] }];
  chk((30 - 5) / 2.5 === 10 && (40 - 5) / 2.5 === 14, 'c5 Scratch');

  c.mots = [['formule', 'égalité qui relie des grandeurs écrites avec des lettres', 'P = U × I relie puissance, tension et intensité.'], ['inconnue', 'lettre qui représente un nombre à trouver', 'dans 4x = 96, l’inconnue est x.'], ['équation', 'égalité qui contient une inconnue', '2,5x + 5 = 30.'], ['solution', 'valeur de l’inconnue qui rend l’égalité vraie', 'x = 10 est la solution de 2,5x + 5 = 30.'], ['opération inverse', 'opération qui défait une autre opération', 'la division défait la multiplication.'], ['isoler', 'laisser l’inconnue seule d’un côté du signe égal', 'de 2,5x = 25 on isole x : x = 10.'], ['vérifier', 'remplacer l’inconnue par la solution pour contrôler', '2,5 × 10 + 5 = 30 ✓.']];

  /* ---------- exercices résolus ---------- */
  c.resolus = [
    { titre: 'Résoudre une équation a × x + b = c', outil: '🧮 calculatrice', enonce: `Un abonnement coûte ${H('7 €')} d’inscription plus ${H('3 €')} par séance. Avec ${H('28 €')}, combien de séances peut-on payer ?`,
      rows: [['3 × x + 7 = 28', 'J’écris l’équation : x est le nombre de séances.'], ['3 × x = 28 − 7 = <b>21</b>', 'Je retire 7 des deux côtés.'], ['x = 21 ÷ 3 = <b>7</b>', 'Je divise par 3 des deux côtés.']], verif: '3 × 7 + 7 = 21 + 7 = 28 ✓', rep: 'On peut payer 7 séances.', go: ['e2'] },
    { titre: 'À toi : résoudre 4x + 6 = 38', outil: '🧮 calculatrice', enonce: `Résous l’équation ${H('4x + 6 = 38')}, puis vérifie la solution.`, trous: [0, 1, 2, 3],
      rows: [['4x + 6 − ⟦6⟧ = 38 − ⟦6⟧', 'Je retire 6 des deux côtés.'], ['4x = ⟦32⟧', 'Je calcule le côté droit.'], ['x = 32 ÷ ⟦4⟧ = ⟦8⟧', 'Je divise par 4 des deux côtés.'], ['4 × ⟦8⟧ + 6 = ⟦38⟧', 'Je remplace x par la solution.']], verif: 'On retrouve bien 38 ✓', rep: 'La solution est x = 8.', go: ['e2'] }];
  c.entraine = ENT('c5', [1, 3, 4]);

  /* ---------- je résous ---------- */
  const clubQ = `<p>Un club de jeux demande ${H('5 €')} d’inscription puis ${H('2,50 €')} par séance.</p>`;
  c.probs = [
    PB({ id: 'pa', niv: -1, base: 'p1', etape: 2, lc: 3, comps: ['app', 'rea'], titre: 'Le club de jeux, pas à pas',
      intro: clubQ + `<p>On note x le nombre de séances : le prix est 2,5 × x + 5.</p>`,
      qs: [Q('a.', 'Calcule le prix pour 4 séances.', '2,5 × 4 + 5 = 15 €', 15, { w: 18 }), Q('b.', 'Avec 30 €, on a 2,5 × x + 5 = 30. Calcule 30 − 5.', '30 − 5 = 25', 25, { w: 18 }), Q('c.', 'Calcule x, le nombre de séances : 25 ÷ 2,5.', '25 ÷ 2,5 = 10 séances', 10, { w: 18 }), Q('d.', 'Vérifie : calcule 2,5 × 10 + 5.', '2,5 × 10 + 5 = 30 €', 30, { w: 18 })],
      err: { 0: [{ v: 21.5, m: 'Tu as additionné 4 + 2,5 + 5 ou multiplié autrement. Multiplie 2,5 par 4, puis ajoute 5.' }], 2: [{ v: 62.5, m: 'Tu as multiplié. Pour trouver x, divise 25 par 2,5.' }] },
      hints: ['Prix = 2,5 × nombre de séances + 5.', 'On retire 5 des deux côtés.', 'On divise par 2,5 des deux côtés.', 'Remplace x par 10 dans la formule.'], pouce: '2,5 × 4 + 5 ; 30 − 5 ; 25 ÷ 2,5 ; 2,5 × 10 + 5.',
      det: ['2,5 × 4 = 10 ; 10 + 5 = 15 €.', '30 − 5 = 25.', '25 ÷ 2,5 = 10 séances.', '2,5 × 10 = 25 ; 25 + 5 = 30 € ✓.'], corr: 'a. 15 €. b. 25. c. 10 séances. d. 30 €.' }),
    PB({ id: 'p1', etape: 2, lc: 3, comps: ['app', 'ana', 'rea', 'val'], titre: 'Le club de jeux',
      intro: clubQ,
      qs: [Q('a.', 'Calcule le prix de 8 séances.', '2,5 × 8 + 5 = 25 €', 25, { w: 18 }), Q('b.', 'Avec 40 €, combien de séances peut-on payer ? Résous 2,5 × x + 5 = 40.', '2,5x = 35 ; x = 14 séances', 14, { w: 18 }), Q('c.', 'Avec 28 €, combien de séances complètes peut-on payer ?', '(28 − 5) ÷ 2,5 = 9,2 : 9 séances complètes', 9, { w: 18 }), Q('d.', 'Vérifie ta réponse à la question b : calcule 2,5 × 14 + 5.', '2,5 × 14 + 5 = 40 €', 40, { w: 18 })],
      err: { 1: [{ v: 3.5, m: 'Tu as divisé 40 par 2,5 puis retiré 5 sans respecter l’ordre. Retire d’abord 5 (35), puis divise par 2,5.' }, { v: 16, m: 'Tu as divisé 40 par 2,5 sans retirer d’abord 5.' }], 2: [{ v: 9.2, m: 'Un nombre de séances est entier : on ne paie pas une séance incomplète. Garde 9.' }, { v: 10, m: 'Tu as arrondi à l’entier supérieur. Une 10e séance coûterait plus que 28 €.' }] },
      hints: ['Prix = 2,5 × nombre de séances + 5.', 'Retire 5, puis divise par 2,5.', 'Calcule (28 − 5) ÷ 2,5 : le résultat n’est pas entier.', 'Remplace x par 14.'], pouce: '2,5 × 8 + 5 ; (40 − 5) ÷ 2,5 ; (28 − 5) ÷ 2,5.',
      det: ['2,5 × 8 = 20 ; 20 + 5 = 25 €.', '2,5x + 5 = 40 donne 2,5x = 35, puis x = 35 ÷ 2,5 = 14.', '(28 − 5) ÷ 2,5 = 23 ÷ 2,5 = 9,2 : 9 séances complètes (9 × 2,5 + 5 = 27,50 €).', '2,5 × 14 = 35 ; 35 + 5 = 40 € ✓.'], corr: 'a. 25 €. b. 14 séances. c. 9 séances. d. 40 €.' }),
    PB({ id: 'p2', etape: 3, lc: 4, defi: 5, bulle: 'Ce cas se fait en 5 étapes. Pour chaque appareil, écris la formule P = U × I, remplace ce que tu connais, puis résous.', autravail: { comp: 'rea', txt: 'calculer l’intensité d’un appareil pour choisir un câble et un disjoncteur adaptés.' }, comps: ['app', 'ana', 'rea', 'val'], titre: 'Les appareils d’une prise',
      intro: `<p>La tension du secteur est ${H('230 V')}. Dans une cuisine, on branche des appareils sur une prise limitée à ${H('16 A')}. La puissance est P = U × I (P en W, U en V, I en A).</p>${tab(['Appareil', 'Puissance (W)'], [['Four', '2 300'], ['Bouilloire', '1 840'], ['Chargeur', '10']])}`,
      qs: [Q('a.', 'Calcule l’intensité du four, en ampères.', 'I = 2 300 ÷ 230 = 10 A', 10, { w: 18 }), Q('b.', 'Calcule l’intensité de la bouilloire, en ampères.', 'I = 1 840 ÷ 230 = 8 A', 8, { w: 18 }), Q('c.', 'Quelle est l’intensité totale si on branche le four et la bouilloire ?', '10 + 8 = 18 A', 18, { w: 18 }), Q('d.', 'La prise supporte 16 A. Peut-on brancher les deux appareils en même temps ? Justifie.', 'Non : 18 A est supérieur à 16 A.', null, { lines: 2 }), Q('e.', 'Le chargeur fonctionne sous 5 V. Calcule son intensité, en ampères.', 'I = 10 ÷ 5 = 2 A', 2, { w: 18 })],
      err: { 0: [{ v: 529000, m: 'Tu as multiplié 2 300 par 230. Pour trouver I, divise P par U.' }], 1: [{ v: 423200, m: 'Tu as multiplié. Pour trouver I, divise P par U.' }], 4: [{ v: 50, m: 'Tu as multiplié 10 par 5. Pour trouver I, divise P par U : 10 ÷ 5.' }] },
      hints: ['P = U × I donne I = P ÷ U.', 'Même formule avec 1 840 W.', 'Additionne les deux intensités.', 'Compare 18 A et 16 A.', 'Le chargeur : U = 5 V et P = 10 W.'], pouce: '2 300 ÷ 230 ; 1 840 ÷ 230 ; 10 + 8 ; 10 ÷ 5.',
      det: ['2 300 = 230 × I donne I = 2 300 ÷ 230 = 10 A.', '1 840 = 230 × I donne I = 1 840 ÷ 230 = 8 A.', '10 + 8 = 18 A.', '18 A est supérieur à 16 A : la prise serait surchargée, on ne branche pas les deux appareils ensemble.', '10 = 5 × I donne I = 10 ÷ 5 = 2 A.'], corr: 'a. 10 A. b. 8 A. c. 18 A. d. Non. e. 2 A.' }),
    PB({ id: 'p3', etape: 4, lc: 3, cls: 'bac', defi: 5, bulle: 'Voici une question « vers le CCF » : compare deux formules. Écris chaque équation, résous-la, puis conclus avec une phrase.', autravail: { comp: 'val', txt: 'comparer deux tarifs ou deux devis et choisir le plus avantageux.' }, comps: ['app', 'ana', 'rea', 'val', 'com'], titre: 'Deux formules de cinéma',
      intro: `<p>Un cinéma propose deux formules. Formule A : ${H('9 €')} la séance. Formule B : une carte à ${H('12 €')} puis ${H('7 €')} la séance. On note x le nombre de séances.</p>${tab(['Formule', 'Prix de x séances'], [['A', '9 × x'], ['B', '7 × x + 12']])}`,
      qs: [BQ('1', 'Calculer le prix de 5 séances avec la formule B.', 'rea', '7 × 5 + 12 = 47 €', 47, { w: 22 }), BQ('2', 'Léa dispose de 61 € pour la formule B. Résoudre 7x + 12 = 61 pour trouver le nombre de séances.', 'rea', '7x = 49 ; x = 7 séances', 7, { w: 22 }), BQ('3', 'Vérifier la solution de la question 2 en calculant 7 × 7 + 12.', 'val', '7 × 7 + 12 = 61 €', 61, { w: 22 }), BQ('4', 'Calculer le prix de 7 séances avec la formule A. Quelle formule est la moins chère pour 7 séances, et de combien ?', 'ana', '9 × 7 = 63 € : la formule B est moins chère de 63 − 61 = 2 €.', null, { lines: 2 }), BQ('5', 'Pour 4 séances, quelle formule choisir ? Justifier avec les deux prix.', 'com', 'Formule A : 9 × 4 = 36 €, formule B : 7 × 4 + 12 = 40 €. La formule A est moins chère.', null, { lines: 3 })],
      err: { 0: [{ v: 54, m: 'Tu as calculé 7 × (5 + 12 ÷ 2) ou additionné d’abord. Multiplie 7 par 5, puis ajoute 12.' }, { v: 119, m: 'Tu as additionné 5 et 12 avant de multiplier. On multiplie avant d’additionner.' }], 1: [{ v: 61, m: 'C’est le budget. Il faut le nombre de séances : retire 12, puis divise par 7.' }, { v: 8.7, m: 'Tu as divisé 61 par 7 sans retirer d’abord 12.' }] },
      hints: ['Prix de la formule B = 7 × nombre de séances + 12.', 'Retire 12 des deux côtés, puis divise par 7.', 'Remplace x par 7 dans 7x + 12.', 'Calcule le prix de la formule A pour 7 séances et compare avec 61 €.', 'Calcule les deux prix pour 4 séances.'], pouce: '7 × 5 + 12 ; (61 − 12) ÷ 7 ; 9 × 7.',
      det: ['7 × 5 = 35 ; 35 + 12 = 47 €.', '7x + 12 = 61 donne 7x = 61 − 12 = 49, puis x = 49 ÷ 7 = 7 séances.', '7 × 7 = 49 ; 49 + 12 = 61 € ✓.', 'Formule A : 9 × 7 = 63 €. 63 − 61 = 2 : la formule B est moins chère de 2 €.', 'Formule A : 9 × 4 = 36 €. Formule B : 7 × 4 + 12 = 40 €. 36 < 40 : la formule A est plus avantageuse pour 4 séances.'], corr: '1. 47 €. 2. 7 séances. 3. 61 €. 4. B moins chère de 2 €. 5. Formule A.' }),
    PB({ id: 'pd', niv: 1, base: 'p3', etape: 3, lc: 4, autravail: { comp: 'ana', txt: 'calculer une durée ou une vitesse à partir d’une formule, et la convertir en heures et minutes.' }, comps: ['ana', 'rea', 'val', 'com'], titre: 'Un trajet en train',
      intro: `<p>Un train roule à ${H('240 km/h')} sur une ligne. La formule est ${H('d = v × t')} : d en kilomètres, v en km/h, t en heures.</p>`,
      qs: [Q('a.', 'Quelle distance parcourt-il en 2,5 h ?', 'd = 240 × 2,5 = 600 km', 600, { w: 20 }), Q('b.', 'Un autre trajet de 450 km est parcouru à 180 km/h. Calcule la durée, en heures.', 't = 450 ÷ 180 = 2,5 h', 2.5, { w: 20, tol: .006 }), Q('c.', 'Convertis 2,5 h en minutes.', '2,5 × 60 = 150 min', 150, { w: 20 }), Q('d.', 'Un train parcourt 300 km en 1,5 h. Calcule sa vitesse, en km/h.', 'v = 300 ÷ 1,5 = 200 km/h', 200, { w: 20 }), Q('e.', 'Le train de la question b part à 8 h 45. À quelle heure arrive-t-il ? Justifie.', '2,5 h = 2 h 30 min ; 8 h 45 + 2 h 30 = 11 h 15.', null, { lines: 2 })],
      err: { 0: [{ v: 96, m: 'Tu as divisé. La distance est vitesse × temps : multiplie 240 par 2,5.' }], 1: [{ v: 81000, m: 'Tu as multiplié. Pour trouver t, divise la distance par la vitesse.' }], 3: [{ v: 450, m: 'Tu as multiplié 300 par 1,5. Pour trouver v, divise d par t.' }] },
      hints: ['d = v × t : multiplie la vitesse par le temps.', 't = d ÷ v.', '1 h = 60 min : multiplie par 60.', 'v = d ÷ t.', '0,5 h = 30 min : 2,5 h = 2 h 30 min.'], pouce: '240 × 2,5 ; 450 ÷ 180 ; 2,5 × 60 ; 300 ÷ 1,5.',
      det: ['240 × 2,5 = 600 km.', '450 ÷ 180 = 2,5 h.', '2,5 × 60 = 150 min.', '300 ÷ 1,5 = 200 km/h.', '2,5 h = 2 h + 0,5 h = 2 h 30 min. 8 h 45 + 2 h = 10 h 45 ; 10 h 45 + 30 min = 11 h 15.'], corr: 'a. 600 km. b. 2,5 h. c. 150 min. d. 200 km/h. e. 11 h 15.' })];


  /* ---------- problèmes du manuel, standard 2026-11 ---------- */
  c.probs.push(
    PB({ id: 'q1', etape: 3, lc: 3, comps: ['app', 'ana', 'rea', 'val'], titre: 'La trottinette en libre-service',
      intro: `<p>Une trottinette électrique en libre-service coûte ${H('1 € de déblocage')}, puis ${H('0,20 € par minute')}. Ces tarifs ont été inventés pour l’exercice. Pour un trajet de x minutes, le prix en euros est P = 0,2 × x + 1.</p>`,
      qs: [Q('a.', 'Calcule le prix d’un trajet de 15 minutes, en euros.', '0,2 × 15 + 1 = 4 €', 4), Q('b.', 'Un trajet a coûté 6,40 €. Écris l’équation qui donne sa durée x, puis résous-la.', '0,2x + 1 = 6,4 ; 0,2x = 5,4 ; x = 27 min', 27, { lines: 3 }), Q('c.', 'Avec 10 €, pendant combien de minutes peut-on rouler ?', '(10 − 1) ÷ 0,2 = 45 min', 45, { lines: 3 }), Q('d.', 'Samia affirme : « Un trajet de 30 minutes coûte le double d’un trajet de 15 minutes. » A-t-elle raison ? Justifie ta réponse par un calcul.', 'Non : 0,2 × 30 + 1 = 7 €, alors que le double de 4 € est 8 €.', null, { lines: 3 })],
      hints: ['Remplace x par 15 dans la formule.', 'Retire 1 des deux côtés, puis divise par 0,2.', 'Résous 0,2x + 1 = 10.', 'Calcule le prix de 30 minutes et compare.'],
      det: ['P = 0,2 × 15 + 1 = 3 + 1 = 4 €.', '0,2x + 1 = 6,4 ; 0,2x = 5,4 ; x = 5,4 ÷ 0,2 = 27 minutes. Vérification : 0,2 × 27 + 1 = 6,4.', '0,2x + 1 = 10 ; 0,2x = 9 ; x = 9 ÷ 0,2 = 45 minutes.', '0,2 × 30 + 1 = 7 €. Le double de 4 € est 8 €. Comme 7 ≠ 8, Samia a tort : le déblocage n’est payé qu’une fois.'], corr: 'a. 4 €. b. 27 min. c. 45 min. d. Non.' }),
    PB({ id: 'q2', etape: 3, lc: 4, comps: ['app', 'rea', 'val', 'com'], titre: 'Les appareils de la cuisine', autravail: { comp: 'val', txt: 'vérifier qu’un circuit ou une prise supporte les appareils branchés.' },
      intro: `<p>La tension du secteur est ${H('230 V')}. La puissance d’un appareil est P = U × I, avec P en watts, U en volts et I en ampères. Une prise de cuisine supporte au maximum ${H('16 A')}.</p>${tab(['Appareil', 'Micro-ondes', 'Bouilloire', 'Grille-pain'], [['Puissance (en W)', '920', '1 840', '1 380']])}`,
      qs: [Q('a.', 'Calcule l’intensité du courant dans le micro-ondes, en ampères.', '920 ÷ 230 = 4 A', 4), Q('b.', 'Calcule l’intensité du courant dans la bouilloire, en ampères.', '1 840 ÷ 230 = 8 A', 8), Q('c.', 'Calcule l’intensité du courant dans le grille-pain, en ampères.', '1 380 ÷ 230 = 6 A', 6), Q('d.', 'Peut-on brancher les trois appareils en même temps sur cette prise ? Justifie ta réponse.', 'Non : 4 + 8 + 6 = 18 A, et 18 A > 16 A.', null, { lines: 3 }), Q('e.', 'Calcule la puissance maximale que cette prise peut fournir, en watts.', '230 × 16 = 3 680 W', 3680)],
      hints: ['I = P ÷ U.', 'Même formule avec 1 840 W.', 'Même formule avec 1 380 W.', 'Additionne les trois intensités et compare à 16 A.', 'P = U × I avec I = 16 A.'],
      det: ['I = 920 ÷ 230 = 4 A.', 'I = 1 840 ÷ 230 = 8 A.', 'I = 1 380 ÷ 230 = 6 A.', '4 + 8 + 6 = 18 A. Comme 18 A > 16 A, on ne peut pas brancher les trois appareils en même temps.', 'P = 230 × 16 = 3 680 W.'], corr: 'a. 4 A. b. 8 A. c. 6 A. d. Non. e. 3 680 W.' }),
    PB({ id: 'q3', etape: 3, lc: 4, comps: ['app', 'rea', 'com'], titre: 'Des trajets en train',
      intro: `<p>Pour un train qui roule à vitesse constante, la distance est d = v × t, avec d en kilomètres, v en kilomètres par heure et t en heures.</p>`,
      qs: [Q('a.', 'Un train roule à 240 km/h pendant 1,5 h. Calcule la distance parcourue, en kilomètres.', '240 × 1,5 = 360 km', 360), Q('b.', 'Un trajet de 450 km est parcouru à 180 km/h. Calcule sa durée, en heures.', '450 ÷ 180 = 2,5 h', 2.5), Q('c.', 'Un autre trajet dure 1,75 h. Écris cette durée en heures et minutes.', '1,75 h = 1 h 45 min', null), Q('d.', 'Un train parcourt 330 km en 1,5 h. Calcule sa vitesse, en kilomètres par heure.', '330 ÷ 1,5 = 220 km/h', 220), Q('e.', 'Un train part à 8 h 45 et roule pendant 2 h 30. À quelle heure arrive-t-il ? Justifie ta réponse.', '8 h 45 + 2 h 30 = 11 h 15', null, { lines: 3 })],
      hints: ['d = v × t.', 't = d ÷ v.', 'Un quart d’heure, c’est 15 minutes : 0,75 h = 3 quarts d’heure.', 'v = d ÷ t.', 'Ajoute la durée du trajet à l’heure de départ.'],
      det: ['d = 240 × 1,5 = 360 km.', 't = 450 ÷ 180 = 2,5 h.', '0,75 h = 45 min, donc 1,75 h = 1 h 45 min.', 'v = 330 ÷ 1,5 = 220 km/h.', '8 h 45 + 2 h 30 = 10 h 75, soit 11 h 15.'], corr: 'a. 360 km. b. 2,5 h. c. 1 h 45 min. d. 220 km/h. e. 11 h 15.' }));
  chk(rnd(.2 * 15 + 1, 2) === 4 && rnd((6.4 - 1) / .2, 6) === 27 && rnd((10 - 1) / .2, 6) === 45 && rnd(.2 * 30 + 1, 2) === 7 && 920 / 230 === 4 && 1840 / 230 === 8 && 1380 / 230 === 6 && 230 * 16 === 3680 && 240 * 1.5 === 360 && 450 / 180 === 2.5 && 330 / 1.5 === 220, 'c5 problèmes du manuel (standard 2026-11)');
  c.probsManuel = ['q1', 'q2', 'q3'];
  c.bilan = [['Je sais calculer la valeur d’une formule.', ['e1', 'p2']], ['Je sais résoudre x + a = b et a × x = b.', ['e2', 'pa']], ['Je sais résoudre a × x + b = c.', ['e2', 'p1', 'p3']], ['Je sais isoler une grandeur dans une formule.', ['e3', 'p2', 'pd']]];
  c.fiche = {
    essentiel: ['<b>Formule</b> : on remplace les lettres par les valeurs, puis on calcule (× et ÷ avant + et −).', '<b>Équation</b> : on fait la même opération des deux côtés du signe égal.', '<b>a × x + b = c</b> : x = (c − b) ÷ a.', '<b>Formules à retenir</b> : P = U × I ; U = R × I ; d = v × t ; A = L × l.', 'Toujours : <b>vérifier</b> en remplaçant x par la solution.'],
    methode: ['J’écris la formule ou l’équation.', 'Je remplace par les valeurs connues.', 'Je retire le nombre seul, puis je divise.', 'Je vérifie la solution.', 'Je réponds avec une phrase et l’unité.'],
    exemple: `<p>2,5x + 5 = 30 : 2,5x = 25, donc x = 25 ÷ 2,5 = 10 séances.</p><p>P = U × I : 2 300 = 230 × I, donc I = 10 A.</p>`,
    pieges: ['Additionner avant de multiplier : 7,5 × 4 + 2 n’est pas 7,5 × 6.', 'Diviser avant de retirer le nombre seul.', 'Ne faire l’opération que d’un seul côté du signe égal.', 'Mélanger les unités (W, V, A ; km, km/h, h).'],
    flash: [['Résous 3x = 21.', 'x = 7'], ['Résous x + 8 = 20.', 'x = 12'], ['P = U × I : U = 230 V, I = 2 A. P ?', '460 W'], ['Résous 2x + 1 = 9.', 'x = 4']]
  };
  chk(21 / 3 === 7 && 20 - 8 === 12 && 230 * 2 === 460 && (9 - 1) / 2 === 4, 'c5 fiche');
  c.words = require('./gl3')('c5');
  /* ajout-e4 : un exercice d’entraînement (3 niveaux) pour chaque notion qui n’en avait pas */
  c.entraine.push({ id: 'e4', gen: 'c5e4', lc: 2, niv: 0 }, { id: 'e4a', gen: 'c5e4a', lc: 2, niv: -1, base: 'e4' }, { id: 'e4d', gen: 'c5e4d', lc: 2, niv: 1, base: 'e4' });
  c.bilan[1][1].push('e4');
  return c;
};
