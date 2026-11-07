/* Chapitre 7 · Fonctions linéaires et affines — CAP Maths (programme de mathématiques des classes préparant au CAP, BOEN spécial n° 5 du 11 avril 2019). */
'use strict';
const K = require('./kit3e');
const { H, FM, R, Q, BQ, PB, ENT, tab, S, T, Rc, Ar, st, SN, cell, MCVP: P } = K;
const { SK } = require('./sk3');
const { MCVG } = require('../shared/gens.js');
const fr = (x, d) => MCVG.fr(x, d), rnd = MCVG.rnd;
const RED = '#C2332A', BLUE = '#1D5FC2', INK = '#1D2240';
const SM = '<svg style="max-width:108mm;height:auto" ';
const gtxt = (x, y, str, col, an = 'start', fs = 11.5) => `<text x="${rnd(x, 1)}" y="${rnd(y, 1)}" font-family="Nunito Sans" font-size="${fs}" font-weight="800" text-anchor="${an}" fill="${col}">${str}</text>`;
const dsh = (d, col, w = 2) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="6 4"/>`;

module.exports = function (chk) {
  const c = { id: 'c7', n: 7, col: 'fonction', icone: '🍿', dom: 'Algèbre et analyse · fonctions', titre: 'Fonctions linéaires et affines', sous: 'f(x) = ax, f(x) = ax + b, droites, comparer deux tarifs' };
  c.parties = [{ t: 'La fonction linéaire', n: [1, 2] }, { t: 'La fonction affine', n: [3] }, { t: 'Comparer deux formules', n: [4] }];
  c.travail = { question: `Un seau de pop-corn coûte ${H('4 €')}. Combien coûtent 3 seaux ? Une carte de cinéma coûte ${H('12 €')} puis ${H('7 €')} la séance : à partir de combien de séances est-elle plus avantageuse que ${H('9 €')} la séance ? Tu sauras répondre aux notions 1 et 4.` };
  c.objectifs = ['Je saurai écrire et utiliser une fonction linéaire f(x) = a × x.', 'Je saurai tracer la droite d’une fonction linéaire et lire une image.', 'Je saurai utiliser une fonction affine f(x) = a × x + b, lire a et b.', 'Je saurai comparer deux formules avec un graphique et un calcul.'];
  c.depart = 'c7';

  /* ---------- contrôles des nombres du chapitre ---------- */
  const f = x => 4 * x, g = x => 7 * x + 12, A = x => 9 * x;
  chk(f(3) === 12 && f(5) === 20 && 20 / 5 === 4 && f(4) === 16 && f(2.5) === 10 && 28 / 4 === 7 && f(1) === 4 && f(2) === 8, 'c7 seaux');
  chk(g(0) === 12 && g(4) === 40 && g(1) === 19 && g(2) === 26 && g(6) === 54 && A(6) === 54 && A(4) === 36 && g(4) === 40 && A(8) === 72 && g(8) === 68 && 9 * 6 === 7 * 6 + 12 && 12 / 2 === 6, 'c7 carte et comparaison');
  chk(6 * 5 + 10 === 40 && (70 - 10) / 6 === 10 && 6 * 0 + 10 === 10 && 8 * 4 === 32 && 5 * 4 + 15 === 35 && 8 * 5 === 40 && 5 * 5 + 15 === 40 && 5 * 8 + 15 === 55 && 8 * 8 === 64, 'c7 problèmes');
  chk(6 * 7 + 15 === 57 && (63 - 15) / 6 === 8 && 10 * 3 === 30 && 6 * 3 + 15 === 33 && 10 * 4 === 40 && 6 * 4 + 15 === 39 && 3 * 5 + 6 === 21 && (33 - 6) / 3 === 9 && 4 * 6 === 3 * 6 + 6 && 4 * 4 === 16 && 3 * 4 + 6 === 18, 'c7 défis');

  /* ---------- graphiques à lignes de lecture ---------- */
  const lin = () => { const g0 = P.plot({ W: 360, H: 210, x: [0, 5, 1], y: [0, 20, 2], ml: 36, mr: 12, mt: 16, mb: 34, fs: 10.5, lx: 1, ly: 1, xl: 'nombre de seaux x', yl: 'prix f(x) en €', lab: 'La droite du prix de x seaux de pop-corn à 4 euros' }), X = g0.X, Y = g0.Y;
    const body = g0.base + g0.line(4, 0, { w: 3 }) + g0.pts([[0, 0], [1, 4], [2, 8], [3, 12], [4, 16], [5, 20]], { r: 4 });
    const rd = dsh(`M${X(3).toFixed(1)} ${Y(0).toFixed(1)}V${Y(12).toFixed(1)}H${X(0).toFixed(1)}`, RED) + gtxt(X(3) - 8, Y(12) - 8, '(3 ; 12)', RED, 'end', 12);
    const pente = `<path d="M${X(1).toFixed(1)} ${Y(4).toFixed(1)}H${X(2).toFixed(1)}V${Y(8).toFixed(1)}" fill="none" stroke="${BLUE}" stroke-width="2.4"/>` + gtxt((X(1) + X(2)) / 2, Y(4) + 14, '+ 1', BLUE, 'middle', 12) + gtxt(X(2) + 6, (Y(4) + Y(8)) / 2 + 4, '+ 4', BLUE, 'start', 12);
    return { g0, body, rd, pente }; };
  const tx = (n, y, l1, l2, col = INK) => SN(n, 396, y) + gtxt(414, y - 3, l1, col, 'start', 11.5) + (l2 ? gtxt(414, y + 13, l2, INK, 'start', 11) : '');
  const volin = (() => { const { g0, body, rd, pente } = lin();
    return S(600, 210, st(1, body + tx(1, 34, 'f(x) = 4 × x', 'j’écris la formule')) + st(2, tx(2, 80, 'deux points : (0 ; 0)', 'et (4 ; 16), puis la droite', RED))
      + st(3, rd + tx(3, 126, 'lecture : f(3) = 12', 'je monte de 3, puis à gauche', RED)) + st(4, pente + tx(4, 172, 'coefficient a = 4', '+ 1 en x : + 4 en y', BLUE)),
    'La droite du prix des seaux de pop-corn passe par l’origine ; 3 seaux coûtent 12 euros ; quand x augmente de 1, le prix augmente de 4'); })();
  const aff = () => { const g0 = P.plot({ W: 360, H: 210, x: [0, 8, 1], y: [0, 70, 5], ml: 36, mr: 12, mt: 16, mb: 34, fs: 10.5, lx: 1, ly: 2, xl: 'nombre de séances x', yl: 'prix P en €', lab: 'La droite du prix de x séances avec la carte à 12 euros puis 7 euros la séance' }), X = g0.X, Y = g0.Y;
    const body = g0.base + g0.line(7, 12, { w: 3 }) + g0.pts([[0, 12], [1, 19], [2, 26], [3, 33], [4, 40]], { r: 4 });
    const b0 = gtxt(X(0) + 10, Y(12) + 16, 'b = 12', RED, 'start', 12), rd = dsh(`M${X(4).toFixed(1)} ${Y(0).toFixed(1)}V${Y(40).toFixed(1)}H${X(0).toFixed(1)}`, RED) + gtxt(X(4) - 8, Y(40) - 8, '(4 ; 40)', RED, 'end', 12);
    const pente = `<path d="M${X(5).toFixed(1)} ${Y(47).toFixed(1)}H${X(6).toFixed(1)}V${Y(54).toFixed(1)}" fill="none" stroke="${BLUE}" stroke-width="2.4"/>` + gtxt((X(5) + X(6)) / 2, Y(47) + 14, '+ 1', BLUE, 'middle', 12) + gtxt(X(6) + 6, (Y(47) + Y(54)) / 2 + 4, '+ 7', BLUE, 'start', 12);
    return { g0, body, b0, rd, pente }; };
  const vaff = (() => { const { body, b0, rd, pente } = aff();
    return S(600, 210, st(1, body + tx(1, 34, 'P(x) = 7 × x + 12', 'a = 7 et b = 12')) + st(2, b0 + tx(2, 80, 'b : le prix à 0 séance', 'la droite coupe l’axe vertical en 12', RED))
      + st(3, rd + tx(3, 126, 'lecture : P(4) = 40', '7 × 4 + 12 = 40', RED)) + st(4, pente + tx(4, 172, 'coefficient a = 7', '+ 1 séance : + 7 €', BLUE)),
    'La droite du prix avec la carte : elle coupe l’axe vertical en 12 ; 4 séances coûtent 40 euros ; chaque séance ajoute 7 euros'); })();
  const cmp = () => { const g0 = P.plot({ W: 360, H: 210, x: [0, 10, 1], y: [0, 100, 10], ml: 36, mr: 26, mt: 16, mb: 34, fs: 10.5, lx: 1, ly: 1, xl: 'nombre de séances x', yl: 'prix en €', lab: 'Deux formules : A égale 9x et B égale 7x plus 12, qui se croisent au point de coordonnées 6 et 54' }), X = g0.X, Y = g0.Y;
    const lines = g0.line(9, 0, { stroke: BLUE, w: 3 }) + g0.line(7, 12, { stroke: RED, w: 3 });
    const pt = dsh(`M${X(6).toFixed(1)} ${Y(0).toFixed(1)}V${Y(54).toFixed(1)}H${X(0).toFixed(1)}`, INK, 1.8) + `<circle cx="${X(6).toFixed(1)}" cy="${Y(54).toFixed(1)}" r="5.5" fill="#fff" stroke="${INK}" stroke-width="2.4"/>` + gtxt(X(6) + 10, Y(54) + 18, '(6 ; 54)', INK, 'start', 12);
    const lab = gtxt(X(10) + 6, Y(90) - 1, 'A', BLUE, 'start', 13) + gtxt(X(10) + 6, Y(82) + 11, 'B', RED, 'start', 13) + gtxt(X(3.7), Y(8), 'A moins chère', BLUE, 'middle', 11.5) + gtxt(X(8), Y(8), 'B moins chère', RED, 'middle', 11.5);
    return { g0, body: g0.base + lines + lab, pt }; };
  const vcmp = (() => { const { body, pt } = cmp();
    return S(600, 210, st(1, body + tx(1, 34, 'A : 9x · B : 7x + 12', 'deux droites, deux points chacune', INK)) + st(2, pt + tx(2, 80, 'elles se croisent en', '(6 ; 54) : même prix', INK))
      + st(3, tx(3, 126, 'avant 6 séances : A', 'la droite A est sous la droite B', BLUE)) + st(4, tx(4, 172, 'après 6 séances : B', 'la droite B est sous la droite A', RED)),
    'Les droites A et B se croisent en 6 séances pour 54 euros ; avant, A est moins chère ; après, B est moins chère'); })();
  const pg = fig => fig.replace('<svg ', SM);

  c.notions = [
    { titre: 'La fonction linéaire f(x) = a × x', decouvre: { txt: `Un seau de pop-corn coûte ${H('4 €')}. Avec ${H('x')} seaux, on paie ${H('f(x) = 4 × x')}. Combien coûtent 3 seaux ? Par quel nombre multiplie-t-on x ?`, img: SK.seaux() },
      methode: ['J’écris la formule : f(x) = a × x. Ici a = 4.', 'Je trouve a avec un couple connu : a = f(x) ÷ x, par exemple 20 ÷ 5 = 4.', 'Je calcule l’image : f(3) = 4 × 3 = 12.', 'Je vérifie : f(x) ÷ x donne toujours le même nombre.'],
      vois: S(600, 200, st(1, SN(1, 22, 24) + T(44, 29, 'f(x) = a × x : le prix est proportionnel au nombre de seaux', { fs: 13, a: 'start', c: 'kt' }))
        + st(2, cell(24, 44, 90, 38, 'x = 3') + Ar(120, 63, 214, 63, { w: 2.4, h: 8 }) + T(167, 55, '× 4', { fs: 14, c: 'kt' }) + cell(220, 44, 110, 38, 'f(3) = 12', { k: true }) + SN(2, 370, 63) + T(390, 68, 'a = 4 : je multiplie x par 4', { fs: 13, a: 'start' }))
        + st(3, SN(3, 22, 112) + T(44, 117, 'je trouve a : 20 ÷ 5 = 4 et 12 ÷ 3 = 4', { fs: 13, a: 'start' }))
        + st(4, SN(4, 22, 160) + [[1, 4], [2, 8], [3, 12], [5, 20]].map(([x, y], i) => cell(44 + i * 110, 142, 46, 32, x, { fs: 13 }) + cell(94 + i * 110, 142, 54, 32, y, { fs: 13 }) + T(94 + i * 110 + 27, 192, `${y} ÷ ${x} = 4`, { fs: 11, c: 'ts' })).join('')),
      'La fonction linéaire f de x égale 4 fois x : 3 seaux coûtent 12 euros et le quotient f de x sur x vaut toujours 4'),
      solution: `<p>${FM(R`f(3)=4\times3=12`)}. Trois seaux coûtent <b>12 €</b>.</p><p>On multiplie x par ${H('a = 4')} : c’est le prix d’un seau.</p>`,
      retiens: `<p>Une <b>fonction linéaire</b> s’écrit ${FM(R`f(x)=a\times x`)}. Le nombre <b>a</b> est le <b>coefficient</b>.</p><p>Elle traduit une situation de <b>proportionnalité</b> : ${FM(R`a=\dfrac{f(x)}{x}`)}.</p>`,
      attention: 'Pour une fonction linéaire, l’image de 0 est toujours 0 : 0 seau coûte 0 €. Si l’image de 0 n’est pas 0, ce n’est pas une fonction linéaire.',
      amoi: [['f(x) = 5 × x. Calcule f(6).', '5 × 6 = 30'], ['Pour 7 seaux, on paie 28 €. Quel est le coefficient a ?', 'a = 28 ÷ 7 = 4']] },
    { titre: 'Tracer la droite d’une fonction linéaire', decouvre: { txt: `Les points du prix des seaux sont alignés. La droite passe par l’origine. Quel est le prix de ${H('3')} seaux sur le graphique ? Que représente le nombre ${H('4')} ?`, img: SK.droiteL() },
      methode: ['Je calcule deux points : f(0) = 0 et f(4) = 16, donc (0 ; 0) et (4 ; 16).', 'Je place les points et je trace la droite avec une règle.', 'Pour lire une image, je trace une ligne de lecture : f(3) = 12.', 'Je lis a : quand x augmente de 1, f(x) augmente de 4.'],
      vois: volin,
      solution: `<p>La droite passe par ${H('(0 ; 0)')} et ${H('(4 ; 16)')}. On lit ${H('f(3) = 12')} : 3 seaux coûtent 12 €.</p><p>Le coefficient ${H('a = 4')} : chaque seau de plus coûte 4 €.</p>`,
      retiens: `<p>La représentation d’une fonction linéaire est une <b>droite qui passe par l’origine</b>.</p><p>Le coefficient <b>a</b> indique de combien f(x) augmente quand x augmente de 1.</p>`,
      attention: 'Trace la droite avec une règle et prolonge-la sur tout le repère. Pour lire une image, utilise des lignes de lecture : ne lis jamais au jugé.',
      amoi: [['f(x) = 3 × x. Donne deux points de la droite.', '(0 ; 0) et (2 ; 6)'], ['La droite de f(x) = 4x passe-t-elle par (2,5 ; 10) ?', 'oui : f(2,5) = 4 × 2,5 = 10']] },
    { titre: 'La fonction affine f(x) = a × x + b', decouvre: { txt: `Un cinéma vend une carte ${H('12 €')} puis ${H('7 €')} par séance. Avec ${H('x')} séances, le prix est ${H('P(x) = 7 × x + 12')}. Quel est le prix de 4 séances ?`, img: SK.carte2() },
      methode: ['Je repère a (ce qui multiplie x) et b (le nombre ajouté) : a = 7 et b = 12.', 'Je calcule l’image : P(4) = 7 × 4 + 12 = 28 + 12 = 40.', 'Pour tracer, je prends deux points : (0 ; 12) et (4 ; 40).', 'Je vérifie : la droite coupe l’axe vertical en b = 12.'],
      vois: vaff,
      solution: `<p>${FM(R`P(4)=7\times4+12=28+12=40`)}. Quatre séances coûtent <b>40 €</b>.</p><p>Le nombre ${H('b = 12')} est le prix de la carte (0 séance).</p>`,
      retiens: `<p>Une <b>fonction affine</b> s’écrit ${FM(R`f(x)=a\times x+b`)}.</p><p>Sa représentation est une <b>droite</b>. Elle coupe l’axe vertical au point (0 ; <b>b</b>), et <b>a</b> est son coefficient.</p>`,
      attention: 'La fonction linéaire est une fonction affine avec b = 0. Une droite affine ne passe par l’origine que si b = 0.',
      amoi: [['P(x) = 6x + 10. Calcule P(5).', '6 × 5 + 10 = 40'], ['Dans f(x) = 2x + 9, que valent a et b ?', 'a = 2 et b = 9']] },
    { titre: 'Comparer deux formules', decouvre: { txt: `Formule A : ${H('9 €')} la séance, soit ${H('A(x) = 9x')}. Formule B : la carte, soit ${H('B(x) = 7x + 12')}. Pour quel nombre de séances les deux coûtent-elles pareil ?`, img: SK.croise() },
      methode: ['Je trace les deux droites avec deux points chacune.', 'Je repère le point où elles se croisent : (6 ; 54).', 'Je vérifie par le calcul : 9x = 7x + 12 donne 2x = 12, donc x = 6.', 'Je conclus : A est moins chère avant 6 séances, B après.'],
      vois: vcmp,
      solution: `<p>Les droites se croisent en ${H('(6 ; 54)')} : pour 6 séances, les deux formules coûtent <b>54 €</b>.</p><p>Calcul : 9 × 6 = 54 et 7 × 6 + 12 = 54. Avant 6 séances, A est moins chère (4 séances : 36 € contre 40 €). Après, B est moins chère (8 séances : 72 € contre 68 €).</p>`,
      retiens: `<p>Pour comparer deux formules, on trace les deux droites. Le point d’<b>intersection</b> donne le nombre de séances où les prix sont égaux.</p><p>La droite la plus basse est la formule la <b>moins chère</b>.</p>`,
      attention: 'Vérifie toujours par un calcul : remplace x dans les deux formules. Une intersection mal lue donne une mauvaise conclusion.',
      amoi: [['A(x) = 9x et B(x) = 7x + 12. Calcule A(4) et B(4). Quelle formule est la moins chère ?', 'A(4) = 36 et B(4) = 40 : A'], ['Résous 9x = 7x + 12.', '2x = 12 ; x = 6']] }];

  /* Je programme avec Scratch */
  c.scratch = [{ titre: 'comparer deux formules', lc: 4, texte: 'Le programme compare deux formules pour x séances : A = 9 × x et B = 7 × x + 12.',
    prog: [{ c: 'evt', t: 'quand ⚑ est cliqué' }, { c: 'var', t: 'mettre x à 4' }, { c: 'var', t: 'mettre A à (9 × x)' }, { c: 'var', t: 'mettre B à ((7 × x) + 12)' }, { c: 'look', t: 'dire (B − A)' }],
    qs: [['Que dit le lutin ?', '4', 'A = 36 ; B = 7 × 4 + 12 = 40 ; 40 − 36 = 4.'], ['On met x à 6. Que dit le lutin ?', '0', 'A = 54 ; B = 54 ; 54 − 54 = 0 : prix égaux.'], ['On met x à 8. Que dit le lutin ?', '-4', 'A = 72 ; B = 68 ; 68 − 72 = −4 : B est moins chère.']] }];
  chk(9 * 4 === 36 && 7 * 4 + 12 === 40 && 40 - 36 === 4 && 68 - 72 === -4, 'c7 Scratch');

  c.mots = [['fonction linéaire', 'fonction de la forme f(x) = a × x', 'f(x) = 4x donne le prix de x seaux à 4 €.'], ['fonction affine', 'fonction de la forme f(x) = a × x + b', 'P(x) = 7x + 12 pour la carte de cinéma.'], ['coefficient', 'nombre a par lequel on multiplie x', 'dans 7x + 12, le coefficient est 7.'], ['droite', 'représentation d’une fonction linéaire ou affine', 'les points du prix des seaux sont alignés.'], ['origine', 'point (0 ; 0) du repère', 'la droite de f(x) = 4x passe par l’origine.'], ['intersection', 'point commun à deux droites', 'les droites A et B se croisent en (6 ; 54).'], ['formule', 'écriture qui permet de calculer un prix', 'B(x) = 7x + 12.']];

  /* ---------- exercices résolus ---------- */
  c.resolus = [
    { titre: 'Calculer une image avec une fonction affine', outil: '🧮 calculatrice', enonce: `Une carte de cinéma coûte ${H('10 €')} puis ${H('6 €')} par séance : ${H('P(x) = 6x + 10')}. Combien coûtent 5 séances ? Combien de séances pour 70 € ?`,
      rows: [['P(5) = 6 × 5 + 10 = 30 + 10 = <b>40</b> €', 'Je remplace x par 5, je multiplie avant d’additionner.'], ['6x + 10 = 70 donne 6x = <b>60</b>', 'Je retire 10 des deux côtés.'], ['x = 60 ÷ 6 = <b>10</b>', 'Je divise par 6 des deux côtés.']], verif: 'P(10) = 6 × 10 + 10 = 70 ✓', rep: '5 séances coûtent 40 € ; avec 70 €, on fait 10 séances.', go: ['e1'] },
    { titre: 'À toi : lire a et b', outil: '🧮 calculatrice', enonce: `Une carte a pour formule ${H('P(x) = 8x + 15')}. Complète.`, trous: [0, 1, 2],
      rows: [['a = ⟦8⟧ (ce qui multiplie x) et b = ⟦15⟧', 'Je lis les deux nombres de la formule.'], ['P(0) = ⟦15⟧ €', 'C’est le prix de la carte, sans séance.'], ['P(3) = 8 × ⟦3⟧ + 15 = ⟦39⟧ €', 'Je remplace x par 3.']], verif: 'La droite coupe l’axe vertical en 15 ✓', rep: 'a = 8, b = 15 et 3 séances coûtent 39 €.', go: ['e1'] }];
  c.entraine = ENT('c7', [1, 2, 4]);

  /* ---------- je résous ---------- */
  const tb1 = tab(['Nombre de seaux x', '1', '2', '3', '5'], [['Prix f(x) (€)', '4', '8', '12', '20']]);
  const duo = (() => { const g0 = P.plot({ W: 360, H: 210, x: [0, 10, 1], y: [0, 80, 10], ml: 36, mr: 26, mt: 16, mb: 34, fs: 10.5, lx: 1, ly: 1, xl: 'nombre de séances x', yl: 'prix en €', lab: 'Deux formules de cinéma : A égale 8x et B égale 5x plus 15' }), X = g0.X, Y = g0.Y;
    return pg(g0.wrap(g0.base + g0.line(8, 0, { stroke: BLUE, w: 3 }) + g0.line(5, 15, { stroke: RED, w: 3 }) + gtxt(X(10) + 6, Y(80) + 2, 'A', BLUE, 'start', 13) + gtxt(X(10) + 6, Y(65) + 4, 'B', RED, 'start', 13))); })();
  const duo2 = (() => { const g0 = P.plot({ W: 360, H: 210, x: [0, 10, 1], y: [0, 40, 5], ml: 36, mr: 26, mt: 16, mb: 34, fs: 10.5, lx: 1, ly: 1, xl: 'nombre de seaux x', yl: 'prix en €', lab: 'Deux formules de pop-corn : f égale 4x et g égale 3x plus 6' }), X = g0.X, Y = g0.Y;
    return pg(g0.wrap(g0.base + g0.line(4, 0, { stroke: BLUE, w: 3 }) + g0.line(3, 6, { stroke: RED, w: 3 }) + gtxt(X(10) + 6, Y(40) + 2, 'f', BLUE, 'start', 13) + gtxt(X(10) + 6, Y(36) + 14, 'g', RED, 'start', 13))); })();
  c.probs = [
    PB({ id: 'pa', niv: -1, base: 'p1', etape: 2, lc: 1, comps: ['app', 'rea'], titre: 'Le pop-corn, pas à pas',
      intro: `<p>Un seau de pop-corn coûte 4 €. Avec x seaux, on paie f(x) = 4 × x.</p>${tb1}`,
      qs: [Q('a.', 'Calcule f(3), le prix de 3 seaux, en euros.', 'f(3) = 4 × 3 = 12 €', 12, { w: 18 }), Q('b.', 'Calcule le coefficient a avec 20 ÷ 5.', 'a = 20 ÷ 5 = 4', 4, { w: 18 }), Q('c.', 'Calcule f(8), le prix de 8 seaux, en euros.', 'f(8) = 4 × 8 = 32 €', 32, { w: 18 }), Q('d.', 'Avec 28 €, combien de seaux peut-on acheter ? Calcule 28 ÷ 4.', '28 ÷ 4 = 7 seaux', 7, { w: 18 })],
      err: { 0: [{ v: 7, m: 'Tu as additionné 4 et 3. f(x) = 4 × x : on multiplie.' }], 3: [{ v: 112, m: 'Tu as multiplié. Pour trouver x, divise le prix par 4.' }] },
      hints: ['f(3) = 4 × 3.', 'a = f(x) ÷ x.', 'f(8) = 4 × 8.', 'Nombre de seaux = prix ÷ 4.'], pouce: '4 × 3 ; 20 ÷ 5 ; 4 × 8 ; 28 ÷ 4.',
      det: ['4 × 3 = 12 €.', '20 ÷ 5 = 4.', '4 × 8 = 32 €.', '28 ÷ 4 = 7 seaux.'], corr: 'a. 12 €. b. 4. c. 32 €. d. 7 seaux.' }),
    PB({ id: 'p1', etape: 2, lc: 3, comps: ['app', 'ana', 'rea', 'val'], titre: 'La carte de cinéma',
      intro: `<p>Un cinéma vend une carte à ${H('10 €')}, puis ${H('6 €')} par séance. Avec x séances : P(x) = 6x + 10.</p>`,
      qs: [Q('a.', 'Calcule le prix de 5 séances, en euros.', 'P(5) = 6 × 5 + 10 = 40 €', 40, { w: 18 }), Q('b.', 'Donne le coefficient a de la fonction.', 'a = 6 (le prix d’une séance)', 6, { w: 18 }), Q('c.', 'Donne le nombre b : le prix de la carte seule, en euros.', 'b = P(0) = 10 €', 10, { w: 18 }), Q('d.', 'Avec 70 €, combien de séances ? Résous 6x + 10 = 70.', '6x = 60 ; x = 10 séances', 10, { w: 18 })],
      err: { 0: [{ v: 96, m: 'Tu as additionné avant de multiplier : 6 × 15. On multiplie 6 par 5, puis on ajoute 10.' }], 3: [{ v: 11.7, m: 'Tu as divisé 70 par 6 sans retirer 10. Retire d’abord 10, puis divise par 6.' }] },
      hints: ['P(5) = 6 × 5 + 10.', 'a est le nombre qui multiplie x.', 'b est le nombre ajouté, P(0).', 'Retire 10, puis divise par 6.'], pouce: '6 × 5 + 10 ; P(0) ; (70 − 10) ÷ 6.',
      det: ['6 × 5 = 30 ; 30 + 10 = 40 €.', 'Dans 6x + 10, le nombre devant x est 6.', 'P(0) = 6 × 0 + 10 = 10 €.', '6x + 10 = 70 donne 6x = 60, puis x = 10 séances.'], corr: 'a. 40 €. b. 6. c. 10 €. d. 10 séances.' }),
    PB({ id: 'p2', etape: 3, lc: 4, defi: 5, bulle: 'Ce cas se fait en 5 étapes. Pour chaque question, trace une ligne de lecture avec ta règle, puis vérifie par le calcul.', autravail: { comp: 'val', txt: 'comparer deux devis ou deux tarifs et choisir le plus avantageux.' }, comps: ['app', 'ana', 'rea', 'val'], titre: 'Deux formules de cinéma',
      intro: `<p>Formule A : ${H('8 €')} la séance, A(x) = 8x. Formule B : une carte à ${H('15 €')} puis ${H('5 €')} la séance, B(x) = 5x + 15.</p>${duo}`,
      qs: [Q('a.', 'Lis sur la droite A le prix de 4 séances, en euros.', 'A(4) = 32 €', 32, { w: 18, tol: .5 }), Q('b.', 'Lis sur la droite B le prix de 4 séances, en euros.', 'B(4) = 35 €', 35, { w: 18, tol: .5 }), Q('c.', 'Pour combien de séances les deux formules coûtent-elles pareil ?', 'les droites se croisent en x = 5', 5, { w: 18 }), Q('d.', 'Quel est ce prix commun, en euros ?', 'A(5) = 40 € et B(5) = 40 €', 40, { w: 18 }), Q('e.', 'Quelle formule choisir pour 8 séances ? Justifie avec les deux prix.', 'A(8) = 64 € et B(8) = 5 × 8 + 15 = 55 € : la formule B.', null, { lines: 2 })],
      err: { 0: [{ v: 4, m: 'C’est le nombre de séances. Le prix se lit sur l’axe vertical.' }], 2: [{ v: 40, m: 'C’est le prix commun. Le nombre de séances se lit sur l’axe horizontal.' }], 3: [{ v: 5, m: 'C’est le nombre de séances. Le prix se lit sur l’axe vertical.' }] },
      hints: ['Pars de 4 sur l’axe horizontal, monte jusqu’à la droite A.', 'Même chose avec la droite B.', 'Cherche le point où les deux droites se croisent.', 'Lis l’ordonnée de ce point.', 'Calcule A(8) et B(8).'], pouce: 'ligne verticale en x = 4 ; intersection des droites ; A(8) et B(8).',
      det: ['Au-dessus de 4, la droite A est à 32 €.', 'Au-dessus de 4, la droite B est à 35 €.', 'Les droites se croisent à l’abscisse 5.', 'Au point d’intersection, l’ordonnée est 40 €.', 'A(8) = 8 × 8 = 64 € ; B(8) = 5 × 8 + 15 = 55 € ; 55 < 64 : la formule B est moins chère.'], corr: 'a. 32 €. b. 35 €. c. 5 séances. d. 40 €. e. Formule B.' }),
    PB({ id: 'p3', etape: 4, lc: 3, cls: 'bac', defi: 5, bulle: 'Voici une question « vers le CCF » : identifie a et b, calcule, résous une équation, puis compare deux tarifs. Rédige une phrase de conclusion.', autravail: { comp: 'val', txt: 'comparer deux tarifs et justifier un choix avec des calculs.' }, comps: ['app', 'ana', 'rea', 'val', 'com'], titre: 'La carte ou la séance',
      intro: `<p>Un cinéma propose deux tarifs. Tarif plein : ${H('10 €')} la séance. Carte : ${H('15 €')} puis ${H('6 €')} la séance. Avec x séances : plein = 10x ; carte = 6x + 15.</p>${tab(['Tarif', 'Prix de x séances'], [['Plein', '10 × x'], ['Carte', '6 × x + 15']])}`,
      qs: [BQ('1', 'Donner le coefficient a de la formule de la carte.', 'app', 'a = 6 (le prix d’une séance)', 6, { w: 22 }), BQ('2', 'Calculer le prix de 7 séances avec la carte, en euros.', 'rea', '6 × 7 + 15 = 57 €', 57, { w: 22 }), BQ('3', 'Léa a payé 63 € avec la carte. Résoudre 6x + 15 = 63 pour trouver le nombre de séances.', 'rea', '6x = 48 ; x = 8 séances', 8, { w: 22 }), BQ('4', 'Calculer le prix de 4 séances avec la carte, en euros.', 'ana', '6 × 4 + 15 = 39 €', 39, { w: 22 }), BQ('5', 'Pour 3 séances, quel tarif choisir ? Même question pour 4 séances. Justifier.', 'com', '3 séances : plein 30 €, carte 33 € : le tarif plein. 4 séances : plein 40 €, carte 39 € : la carte.', null, { lines: 3 })],
      err: { 1: [{ v: 126, m: 'Tu as additionné avant de multiplier : 6 × 21. Multiplie 6 par 7, puis ajoute 15.' }], 2: [{ v: 10.5, m: 'Tu as divisé 63 par 6 sans retirer 15. Retire d’abord 15, puis divise par 6.' }] },
      hints: ['Dans 6x + 15, a est devant x.', '6 × 7 + 15.', 'Retire 15, puis divise par 6.', '6 × 4 + 15.', 'Compare les deux prix pour 3 puis pour 4 séances.'], pouce: '6 × 7 + 15 ; (63 − 15) ÷ 6 ; 6 × 4 + 15 ; 10 × 3 et 6 × 3 + 15.',
      det: ['Dans 6x + 15, le nombre devant x est a = 6.', '6 × 7 = 42 ; 42 + 15 = 57 €.', '6x + 15 = 63 donne 6x = 48, puis x = 48 ÷ 6 = 8 séances.', '6 × 4 = 24 ; 24 + 15 = 39 €.', 'Pour 3 séances : 10 × 3 = 30 € et 6 × 3 + 15 = 33 € : le plein est moins cher. Pour 4 séances : 10 × 4 = 40 € et 39 € : la carte est moins chère.'], corr: '1. a = 6. 2. 57 €. 3. 8 séances. 4. 39 €. 5. Plein pour 3, carte pour 4.' }),
    PB({ id: 'pd', niv: 1, base: 'p3', etape: 3, lc: 4, autravail: { comp: 'ana', txt: 'comparer deux tarifs de fournitures ou de pièces et trouver à partir de quelle quantité l’un devient plus avantageux.' }, comps: ['ana', 'rea', 'val', 'com'], titre: 'Le pop-corn dans les deux sens',
      intro: `<p>Un seau de pop-corn coûte ${H('4 €')} : f(x) = 4x. Une carte pop-corn coûte ${H('6 €')} puis ${H('3 €')} le seau : g(x) = 3x + 6.</p>${duo2}`,
      qs: [Q('a.', 'Calcule f(5), le prix de 5 seaux au prix normal, en euros.', 'f(5) = 4 × 5 = 20 €', 20, { w: 20 }), Q('b.', 'Calcule g(5), le prix de 5 seaux avec la carte, en euros.', 'g(5) = 3 × 5 + 6 = 21 €', 21, { w: 20 }), Q('c.', 'Avec la carte, on a payé 33 €. Résous 3x + 6 = 33 : combien de seaux ?', '3x = 27 ; x = 9 seaux', 9, { w: 20 }), Q('d.', 'Pour combien de seaux les deux prix sont-ils égaux ? Résous 4x = 3x + 6.', '4x − 3x = 6 ; x = 6 seaux', 6, { w: 20 }), Q('e.', 'Un ami dit : « La carte est toujours plus chère. » A-t-il raison ? Justifie avec 4 seaux et 8 seaux.', 'Non : pour 4 seaux, f = 16 € et g = 18 € (la carte coûte plus). Pour 8 seaux, f = 32 € et g = 30 € (la carte coûte moins).', null, { lines: 3 })],
      err: { 0: [{ v: 9, m: 'Tu as additionné 4 et 5. f(x) = 4 × x : on multiplie.' }], 2: [{ v: 11, m: 'Tu as divisé 33 par 3 sans retirer 6. Retire d’abord 6, puis divise par 3.' }], 3: [{ v: 3, m: 'Tu as divisé 6 par 2. Pour 4x = 3x + 6, retire 3x des deux côtés : x = 6.' }] },
      hints: ['f(5) = 4 × 5.', 'g(5) = 3 × 5 + 6.', 'Retire 6, puis divise par 3.', 'Retire 3x des deux côtés.', 'Calcule f et g pour 4 puis pour 8 seaux.'], pouce: '4 × 5 ; 3 × 5 + 6 ; (33 − 6) ÷ 3 ; 4x − 3x.',
      det: ['4 × 5 = 20 €.', '3 × 5 = 15 ; 15 + 6 = 21 €.', '3x + 6 = 33 donne 3x = 27, puis x = 9 seaux.', '4x = 3x + 6 donne x = 6 : prix égaux pour 6 seaux (24 €).', 'Pour 4 seaux : f = 16 €, g = 3 × 4 + 6 = 18 € ; pour 8 seaux : f = 32 €, g = 3 × 8 + 6 = 30 €. L’ami se trompe.'], corr: 'a. 20 €. b. 21 €. c. 9 seaux. d. 6 seaux. e. Non.' })];

  c.bilan = [['Je sais calculer avec f(x) = a × x.', ['e1', 'pa']], ['Je sais tracer la droite d’une fonction linéaire.', ['e2', 'p2']], ['Je sais lire a et b dans f(x) = a × x + b.', ['e1', 'p1', 'p3']], ['Je sais comparer deux formules.', ['e3', 'p2', 'p3', 'pd']]];
  c.fiche = {
    essentiel: ['<b>Fonction linéaire</b> : f(x) = a × x, droite passant par l’origine, a = f(x) ÷ x.', '<b>Fonction affine</b> : f(x) = a × x + b, droite coupant l’axe vertical en b.', '<b>Image</b> : on remplace x par sa valeur. <b>Antécédent</b> : on résout l’équation.', '<b>Comparer</b> : on trace les deux droites, on lit le point d’intersection, on vérifie par le calcul.', '<b>Tracé</b> : deux points suffisent, on utilise une règle.'],
    methode: ['Je repère a et b dans la formule.', 'Je calcule deux points.', 'Je place les points et je trace la droite.', 'Je lis avec des lignes de lecture.', 'Je vérifie par un calcul et je conclus.'],
    exemple: `<p>P(x) = 7x + 12 : P(4) = 7 × 4 + 12 = 40 €.</p><p>9x = 7x + 12 donne x = 6 : au-delà de 6 séances, la carte est plus avantageuse.</p>`,
    pieges: ['Additionner avant de multiplier.', 'Oublier b dans f(x) = a × x + b.', 'Lire une intersection au jugé.', 'Confondre le coefficient a et le nombre b.'],
    flash: [['f(x) = 5x. Calcule f(4).', '20'], ['Dans 7x + 12, que vaut b ?', '12'], ['La droite d’une fonction linéaire passe par…', 'l’origine (0 ; 0)'], ['Résous 2x + 1 = 9.', 'x = 4']]
  };
  chk(5 * 4 === 20 && 2 * 4 + 1 === 9, 'c7 fiche');
  c.words = require('./gl3')('c7');
  /* ajout-e4 : un exercice d’entraînement (3 niveaux) pour chaque notion qui n’en avait pas */
  c.entraine.push({ id: 'e4', gen: 'c7e4', lc: 3, niv: 0 }, { id: 'e4a', gen: 'c7e4a', lc: 3, niv: -1, base: 'e4' }, { id: 'e4d', gen: 'c7e4d', lc: 3, niv: 1, base: 'e4' });
  c.bilan[2][1].push('e4');
  return c;
};
