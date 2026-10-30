/* Chapitre 9 · Périmètres, aires et volumes — CAP Maths (programme de mathématiques des classes préparant au CAP, BOEN spécial n° 5 du 11 avril 2019, groupement 1). */
'use strict';
const K = require('./kit3e');
const { H, FM, R, Q, BQ, PB, ENT, tab, S, T, Rc, Ln, Ar, st, SN, cell } = K;
const { SK, D } = require('./sk3');
const { MCVG } = require('../shared/gens.js');
const fr = (x, d) => MCVG.fr(x, d);
const rr = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
const PI = Math.PI;
const srcFoot = 'Source : IFAB, Lois du jeu, Loi 1 « Le terrain de jeu » : terrain de référence de 105 m sur 68 m ; cercle central de rayon 9,15 m.';

module.exports = function (chk) {
  const c = { id: 'c9', n: 9, col: 'mesure', icone: '📏', dom: 'Géométrie · mesures', plus: 'groupement 1', titre: 'Périmètres, aires et volumes', sous: 'Périmètre, aire, volume, conversions d’unités' };
  c.parties = [{ t: 'Périmètre et aire', n: [1, 2] }, { t: 'Volume et unités', n: [3, 4] }];
  c.travail = { question: `Un terrain de jeu mesure ${H('20 m')} sur ${H('12 m')}. Quelle longueur de grillage faut-il pour en faire le tour ? Un gobelet de cinéma est un cylindre de rayon ${H('4 cm')} et de hauteur ${H('12 cm')} : quel volume contient-il ? Tu sauras répondre aux notions 1 et 3.` };
  c.objectifs = ['Je saurai calculer le périmètre d’un rectangle, d’un carré et d’un cercle.', 'Je saurai calculer l’aire d’un rectangle, d’un triangle et d’un disque.', 'Je saurai calculer le volume d’un pavé et d’un cylindre.', 'Je saurai convertir des longueurs, des aires et des volumes.'];
  c.depart = 'c9';

  /* ---------- contrôles des nombres du chapitre ---------- */
  chk(2 * (20 + 12) === 64 && rr(PI * 6, 2) === 18.85 && rr(PI * 6, 1) === 18.8 && 20 * 12 === 240 && 4 * 2.5 === 10 && 10 / 5 === 2 && 4 * 3 / 2 === 6 && rr(PI * 9, 2) === 28.27 && rr(PI * 9, 1) === 28.3, 'c9 périmètre et aire');
  chk(rr(PI * 16 * 12, 2) === 603.19 && Math.round(PI * 16 * 12) === 603 && 30 * 20 * 10 === 6000 && 6000 / 1000 === 6 && rr(PI * 16 * 12 / 1000, 1) === 0.6, 'c9 volumes');
  chk(3.5 * 4 === 14 && .5 * .5 === .25 && 14 / .25 === 56 && rr(56 * 1.1, 1) === 61.6 && Math.ceil(61.6) === 62 && 2500 / 10000 === .25 && 0.06 * 1000 === 60, 'c9 carreaux et conversions');
  chk(4 * 7 === 28 && rr(PI * 10, 1) === 31.4 && 8 * 5 === 40 && 10 * 6 / 2 === 30 && Math.round(PI * 9 * 10) === 283 && 3 * 20 === 60, 'c9 à moi');
  chk(2 * (105 + 68) === 346 && 105 * 68 === 7140 && 7140 / 1785 === 4 && rr(2 * PI * 9.15, 1) === 57.5 && rr(PI * 9.15 * 9.15, 1) === 263 && PI * 9.15 * 9.15 / 7140 < .05 && rr(PI * 9.15 * 9.15 / 7140 * 100, 1) === 3.7, 'c9 terrain de football');
  chk(rr(3.2 * 2.5, 2) === 8 && rr(.4 * .4, 2) === .16 && rr(8 / .16, 0) === 50 && rr(50 * 1.1, 0) === 55 && 4 * 12 < 55 && 5 * 12 >= 55, 'c9 salle de bains');
  chk(Math.round(PI * 16 * 12) === 603 && Math.floor(2000 / (PI * 16 * 12)) === 3 && rr(500 / (PI * 16), 1) === 9.9 && rr(PI * 64 * 12 / (PI * 16 * 12), 6) === 4, 'c9 défi gobelet');
  chk(rr(PI * 9 * 10, 0) === 283 && Math.floor(1000 / (PI * 9 * 10)) === 3 && PI * 9 * 10 > 250 && 2 * 20 === 40 && 8 * 5 === 40 && 2 * 10000 === 20000 && 2 * (8 + 5) === 26, 'c9 résolus et guidé');

  /* ---------- figures de la leçon ---------- */
  const contour = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="#C2332A" stroke-width="4.5" stroke-dasharray="9 6"/>`;
  const vper = S(600, 200, st(1, Rc(50, 40, 200, 120, { c: 'k2', rx: 6 }) + T(150, 31, '20 m', { fs: 14, c: 'kt' }) + T(38, 106, '12 m', { fs: 14, c: 'kt', a: 'end' }) + SN(1, 310, 50) + T(332, 55, 'je repère : 20 m et 12 m', { fs: 13, a: 'start' }))
    + st(2, SN(2, 310, 90) + T(332, 95, 'formule : P = 2 × (L + l)', { fs: 13, a: 'start' }))
    + st(3, contour(50, 40, 200, 120) + SN(3, 310, 130) + T(332, 135, 'P = 2 × (20 + 12) = 64 m', { fs: 13, a: 'start', c: 'kt' }))
    + st(4, SN(4, 310, 170) + T(332, 175, 'cercle (d = 6 m) : π × 6 ≈ 18,85 m', { fs: 12, a: 'start' })),
  'Un rectangle de 20 mètres sur 12 mètres : le périmètre est le tour de la figure, 64 mètres');
  const vaire = S(600, 200, st(1, Rc(50, 44, 200, 112, { c: 'k2', rx: 6 }) + T(150, 34, '4 m', { fs: 14, c: 'kt' }) + T(38, 104, '2,5 m', { fs: 14, c: 'kt', a: 'end' }) + SN(1, 310, 50) + T(332, 55, 'je repère : 4 m et 2,5 m', { fs: 13, a: 'start' }))
    + st(2, SN(2, 310, 90) + T(332, 95, 'L × l   ·   b × h ÷ 2   ·   π × r²', { fs: 13, a: 'start' }))
    + st(3, T(150, 108, 'A = 10 m²', { fs: 20, c: 'kt' }) + SN(3, 310, 130) + T(332, 135, 'A = 4 × 2,5 = 10 m²', { fs: 13, a: 'start', c: 'kt' }))
    + st(4, SN(4, 310, 170) + T(332, 175, 'pots de 5 m² : 10 ÷ 5 = 2 pots', { fs: 13, a: 'start' })),
  'Une fresque rectangulaire de 4 mètres sur 2,5 mètres : l’aire est 10 mètres carrés');
  const vvol = S(600, 200, st(1, `<path d="M110 56V150a50 14 0 0 0 100 0V56" class="k2 ks" stroke-width="2"/><ellipse cx="160" cy="56" rx="50" ry="14" class="k2 ks" stroke-width="2"/>` + Ln(160, 56, 210, 56, { w: 2.6 }) + T(220, 61, 'r = 4 cm', { fs: 13, a: 'start', c: 'kt' }) + Ln(94, 56, 94, 150, { w: 2 }) + Ln(89, 56, 99, 56, { w: 2 }) + Ln(89, 150, 99, 150, { w: 2 }) + T(84, 108, 'h = 12 cm', { fs: 13, c: 'kt', a: 'end' }) + SN(1, 310, 50) + T(332, 55, 'je repère : r = 4 cm et h = 12 cm', { fs: 13, a: 'start' }))
    + st(2, SN(2, 310, 90) + T(332, 95, 'cylindre : V = π × r² × h', { fs: 13, a: 'start' }))
    + st(3, SN(3, 310, 130) + T(332, 135, 'V = π × 4² × 12 ≈ 603,19 cm³', { fs: 13, a: 'start', c: 'kt' }))
    + st(4, SN(4, 310, 170) + T(332, 175, '1 cm³ = 1 mL : environ 0,6 L', { fs: 13, a: 'start' })),
  'Un cylindre de rayon 4 centimètres et de hauteur 12 centimètres : le volume est environ 603 centimètres cubes');
  const grille = (() => { let g = ''; for (let i = 1; i < 8; i++) g += Ln(40 + i * 19, 36, 40 + i * 19, 169, { w: 1, c: 'ks' }); for (let j = 1; j < 7; j++) g += Ln(40, 36 + j * 19, 192, 36 + j * 19, { w: 1, c: 'ks' }); return g; })();
  const vconv = S(600, 200, st(1, Rc(40, 36, 152, 133, { c: 'k2', rx: 3 }) + grille + T(116, 28, '4 m', { fs: 13, c: 'kt' }) + T(34, 106, '3,5 m', { fs: 13, c: 'kt', a: 'end' }) + SN(1, 270, 50) + T(292, 55, 'aire de la pièce : 3,5 × 4 = 14 m²', { fs: 13, a: 'start' }))
    + st(2, SN(2, 270, 90) + T(292, 95, 'un carreau : 0,5 × 0,5 = 0,25 m²', { fs: 13, a: 'start' }))
    + st(3, SN(3, 270, 130) + T(292, 135, 'carreaux : 14 ÷ 0,25 = 56', { fs: 13, a: 'start', c: 'kt' }))
    + st(4, SN(4, 270, 170) + T(292, 175, '+ 10 % de chutes : 61,6 → 62 carreaux', { fs: 12.5, a: 'start' })),
  'Une pièce de 4 mètres sur 3,5 mètres carrelée avec 56 carreaux de 50 centimètres, soit 62 carreaux avec 10 pour cent de chutes');

  c.notions = [
    { titre: 'Le périmètre', decouvre: { txt: `Un terrain de jeu mesure ${H('20 m')} sur ${H('12 m')}. On pose un grillage tout autour. Quelle longueur de grillage faut-il ? Et pour le tour d’un cercle de diamètre ${H('6 m')} ?`, img: SK.terrain() },
      methode: ['Je repère la figure et ses mesures : un rectangle de 20 m sur 12 m.', 'J’écris la formule : P = 2 × (L + l).', 'Je calcule : P = 2 × (20 + 12) = 2 × 32 = 64 m.', 'Pour un cercle, P = π × d = π × 6 ≈ 18,85 m (arrondi au centième).'],
      vois: vper,
      solution: `<p>Le grillage fait le tour du terrain : P = 2 × (20 + 12) = <b>64 m</b>.</p><p>Le cercle de diamètre 6 m a un périmètre de π × 6 ≈ <b>18,85 m</b>.</p>`,
      retiens: `<p>Le <b>périmètre</b> est la longueur du tour d’une figure. Il s’exprime en <b>m</b>, en <b>cm</b>…</p><p>Rectangle : ${FM(R`P=2\times(L+l)`)}. Carré : ${FM(R`P=4\times c`)}. Cercle : ${FM(R`P=\pi\times d`)}, avec ${FM(R`d=2\times r`)}.</p>`,
      attention: 'Un périmètre est une longueur : on l’écrit en m ou en cm, jamais en m². Pour un cercle, on utilise le diamètre d = 2 × r.',
      amoi: [['Un carré a un côté de 7 m. Calcule son périmètre.', '4 × 7 = 28 m'], ['Un cercle a un diamètre de 10 m. Calcule son périmètre, arrondi au dixième.', 'π × 10 ≈ 31,4 m']] },
    { titre: 'L’aire', decouvre: { txt: `Une fresque rectangulaire mesure ${H('4 m')} sur ${H('2,5 m')}. Un pot de peinture couvre ${H('5 m²')}. Combien de pots faut-il ? Un fronton triangulaire (base 4 m, hauteur 3 m) a-t-il une aire plus grande ou plus petite ?`, img: SK.fresque() },
      methode: ['Je repère la figure et ses mesures : un rectangle de 4 m sur 2,5 m.', 'J’écris la formule : A = L × l (rectangle), A = b × h ÷ 2 (triangle), A = π × r² (disque).', 'Je calcule : A = 4 × 2,5 = 10 m².', 'Je donne l’unité de l’aire : des m². Pots : 10 ÷ 5 = 2.'],
      vois: vaire,
      solution: `<p>Aire de la fresque : 4 × 2,5 = <b>10 m²</b>. Il faut 10 ÷ 5 = <b>2 pots</b>.</p><p>Aire du fronton : 4 × 3 ÷ 2 = <b>6 m²</b>, plus petite que celle de la fresque.</p>`,
      retiens: `<p>L’<b>aire</b> mesure la surface d’une figure. Elle s’exprime en <b>m²</b>, en <b>cm²</b>…</p><p>Rectangle : ${FM(R`A=L\times l`)}. Triangle : ${FM(R`A=\dfrac{b\times h}{2}`)}. Disque : ${FM(R`A=\pi\times r^2`)}.</p>`,
      attention: 'Dans un triangle, la hauteur est perpendiculaire à la base : ce n’est pas toujours un côté. Pour un disque, on utilise le rayon r = d ÷ 2, et non le diamètre.',
      amoi: [['Un rectangle mesure 8 m sur 5 m. Calcule son aire.', '8 × 5 = 40 m²'], ['Un triangle a pour base 10 cm et pour hauteur 6 cm. Calcule son aire.', '10 × 6 ÷ 2 = 30 cm²']] },
    { titre: 'Le volume d’un solide', decouvre: { txt: `Un gobelet de cinéma est un cylindre de rayon ${H('4 cm')} et de hauteur ${H('12 cm')}. Quel volume de boisson contient-il, en millilitres ?`, img: SK.gobelet() },
      methode: ['Je repère le solide et ses mesures : un cylindre, r = 4 cm et h = 12 cm.', 'J’écris la formule : V = π × r² × h (cylindre) ou V = L × l × h (pavé).', 'Je calcule : V = π × 4² × 12 = π × 192 ≈ 603,19 cm³.', 'Je convertis : 1 cm³ = 1 mL, donc environ 603 mL, soit 0,6 L.'],
      vois: vvol,
      solution: `<p>${FM(R`V=\pi\times4^2\times12=\pi\times192\approx603{,}19\ \text{cm}^3`)}.</p><p>Le gobelet contient environ <b>603 mL</b>, soit environ <b>0,6 L</b>.</p>`,
      retiens: `<p>Le <b>volume</b> mesure l’espace occupé par un solide. Il s’exprime en <b>cm³</b>, en <b>m³</b>…</p><p>Pavé : ${FM(R`V=L\times l\times h`)}. Cylindre : ${FM(R`V=\pi\times r^2\times h`)}. Cône : ${FM(R`V=\dfrac{\pi\times r^2\times h}{3}`)}. Boule : ${FM(R`V=\dfrac{4\times\pi\times r^3}{3}`)}.</p>`,
      attention: 'Pour un cylindre, on calcule d’abord r² (le rayon fois lui-même), puis on multiplie par h. Toutes les mesures doivent être dans la même unité avant de calculer.',
      amoi: [['Un pavé mesure 30 cm, 20 cm et 10 cm. Calcule son volume.', '30 × 20 × 10 = 6 000 cm³'], ['Un cylindre a un rayon de 3 cm et une hauteur de 10 cm. Calcule son volume, arrondi à l’unité.', 'π × 3² × 10 ≈ 283 cm³']] },
    { titre: 'Les conversions d’unités', decouvre: { txt: `Un carreleur pose du carrelage dans une pièce de ${H('3,5 m')} sur ${H('4 m')}. Chaque carreau mesure ${H('50 cm')} sur ${H('50 cm')}. Combien de carreaux faut-il, avec ${H('10 %')} de chutes ?`, img: SK.carreaux() },
      methode: ['Je calcule l’aire de la pièce : 3,5 × 4 = 14 m².', 'Je convertis l’aire d’un carreau : 50 cm = 0,5 m, donc 0,5 × 0,5 = 0,25 m².', 'Je divise : 14 ÷ 0,25 = 56 carreaux.', 'J’ajoute 10 % de chutes : 56 × 1,10 = 61,6, soit 62 carreaux (j’arrondis au carreau entier supérieur).'],
      vois: vconv,
      solution: `<p>Aire de la pièce : 3,5 × 4 = 14 m². Aire d’un carreau : 0,5 × 0,5 = 0,25 m² (soit 2 500 cm²).</p><p>Carreaux : 14 ÷ 0,25 = 56. Avec 10 % de chutes : 56 × 1,10 = 61,6, donc <b>62 carreaux</b>.</p>`,
      retiens: `<p><b>Longueur</b> : 1 m = 100 cm. <b>Aire</b> : 1 m² = 10 000 cm². <b>Volume</b> : 1 m³ = 1 000 L ; 1 dm³ = 1 L ; 1 cm³ = 1 mL.</p><p>On convertit les mesures <b>avant</b> de calculer, pour travailler dans une seule unité.</p>`,
      attention: 'Pour passer de cm² à m², on divise par 10 000, et non par 100. Un nombre de carreaux se compte en entiers : on arrondit toujours au nombre entier supérieur.',
      amoi: [['Convertis 2 500 cm² en m².', '2 500 ÷ 10 000 = 0,25 m²'], ['Un aquarium contient 0,06 m³. Combien de litres ?', '0,06 × 1 000 = 60 L']] }];

  /* Je programme avec Scratch */
  c.scratch = [{ titre: 'calculer un volume', lc: 3, texte: 'Le programme calcule le volume d’un gobelet cylindrique : V = 3,14 × r × r × h, avec π arrondi à 3,14.',
    prog: [{ c: 'evt', t: 'quand ⚑ est cliqué' }, { c: 'var', t: 'mettre r à 4' }, { c: 'var', t: 'mettre h à 12' }, { c: 'var', t: 'mettre V à (((3,14 × r) × r) × h)' }, { c: 'look', t: 'dire V' }],
    qs: [['Que dit le lutin ?', '602.88', '3,14 × 4 × 4 × 12 = 602,88.'], ['On met h à 10. Que dit le lutin ?', '502.4', '3,14 × 4 × 4 × 10 = 502,4.'], ['Pourquoi le résultat est-il un peu différent de 603,19 ?', 'π est arrondi à 3,14', 'Le programme utilise 3,14 au lieu de la valeur exacte de π.']] }];
  chk(rr(3.14 * 4 * 4 * 12, 2) === 602.88 && rr(3.14 * 4 * 4 * 10, 2) === 502.4, 'c9 Scratch');

  c.mots = [['périmètre', 'longueur du tour d’une figure', 'le grillage du terrain mesure 64 m.'], ['aire', 'mesure de la surface d’une figure, en m² ou cm²', 'la fresque a une aire de 10 m².'], ['volume', 'mesure de l’espace occupé par un solide, en cm³ ou m³', 'le gobelet contient environ 603 cm³.'], ['rayon et diamètre', 'le rayon va du centre au bord ; le diamètre vaut deux rayons', 'd = 2 × r.'], ['hauteur', 'segment perpendiculaire à la base, qui va au sommet opposé', 'pour un triangle : A = b × h ÷ 2.'], ['conversion', 'changement d’unité sans changer la grandeur', '2 500 cm² = 0,25 m².']];

  /* ---------- exercices résolus ---------- */
  c.resolus = [
    { titre: 'Calculer un périmètre et une aire', outil: '🧮 calculatrice', enonce: `Une salle de jeux est un rectangle de ${H('8 m')} sur ${H('5 m')}. Calcule son périmètre et son aire.`,
      rows: [['P = 2 × (8 + 5) = 2 × 13 = <b>26</b> m', 'Je calcule la longueur du tour de la salle.'], ['A = 8 × 5 = <b>40</b> m²', 'Je multiplie la longueur par la largeur.'], ['Plinthes sur 26 m ; peinture sur 40 m²', 'Je distingue longueur (m) et surface (m²).']], verif: '8 + 5 + 8 + 5 = 26 ✓', rep: 'Le périmètre est 26 m et l’aire est 40 m².', go: ['e1'] },
    { titre: 'À toi : le volume d’un gobelet', outil: '🧮 calculatrice', enonce: `Un gobelet est un cylindre de rayon ${H('3 cm')} et de hauteur ${H('10 cm')}. Complète.`, trous: [0, 1, 2],
      rows: [['V = π × ⟦3⟧² × 10 = π × ⟦90⟧', 'Je remplace r par 3 et h par 10.'], ['V ≈ ⟦282,74⟧ cm³', 'Je calcule avec la touche π de la calculatrice.'], ['V ≈ ⟦283⟧ mL', 'Je convertis : 1 cm³ = 1 mL.']], verif: 'π × 90 ≈ 282,74 ✓', rep: 'Le gobelet contient environ 283 mL.', go: ['e2'] }];
  c.entraine = ENT('c9', [1, 3, 4]);

  /* ---------- je résous ---------- */
  const tbT = tab(['Mesure', 'Valeur'], [['Longueur du terrain', '20 m'], ['Largeur du terrain', '12 m'], ['Diamètre du cercle central', '6 m']]);
  c.probs = [
    PB({ id: 'pa', niv: -1, base: 'p1', etape: 2, lc: 1, comps: ['app', 'rea'], titre: 'Le terrain de jeu, pas à pas',
      intro: `<p>Un terrain de jeu est un rectangle. Il mesure 20 m de long et 12 m de large. Son cercle central a un diamètre de 6 m.</p>${tbT}`,
      qs: [Q('a.', 'Calcule 20 + 12, en mètres.', '20 + 12 = 32 m', 32, { w: 18 }), Q('b.', 'Calcule le périmètre du terrain : 2 × 32, en mètres.', 'P = 2 × 32 = 64 m', 64, { w: 18 }), Q('c.', 'Calcule l’aire du terrain : 20 × 12, en mètres carrés.', 'A = 20 × 12 = 240 m²', 240, { w: 18 }), Q('d.', 'Calcule le périmètre du cercle central, arrondi au dixième, en mètres.', 'P = π × 6 ≈ 18,8 m', 18.8, { w: 18, tol: .06 })],
      err: { 1: [{ v: 32, m: 'C’est seulement la longueur plus la largeur. Le périmètre est le double : 2 × (L + l).' }], 2: [{ v: 64, m: 'C’est le périmètre. L’aire est le produit : 20 × 12.' }], 3: [{ v: 9.4, m: 'Tu as utilisé le rayon. Pour le périmètre, on utilise le diamètre : π × 6.' }] },
      hints: ['Additionne la longueur et la largeur.', 'Multiplie par 2.', 'Multiplie la longueur par la largeur.', 'P = π × d avec d = 6.'], pouce: '20 + 12 ; 2 × 32 ; 20 × 12 ; π × 6.',
      det: ['20 + 12 = 32 m.', '2 × 32 = 64 m.', '20 × 12 = 240 m².', 'π × 6 ≈ 18,85 : environ 18,8 m au dixième.'], corr: 'a. 32 m. b. 64 m. c. 240 m². d. 18,8 m.' }),
    PB({ id: 'p1', etape: 2, lc: 2, comps: ['app', 'ana', 'rea', 'val'], titre: 'La fresque et le fronton',
      intro: `<p>Une fresque rectangulaire mesure ${H('4 m')} sur ${H('2,5 m')}. Un fronton triangulaire a pour base ${H('4 m')} et pour hauteur ${H('3 m')}. Un pot de peinture couvre ${H('5 m²')}.</p>`,
      qs: [Q('a.', 'Calcule l’aire de la fresque, en mètres carrés.', 'A = 4 × 2,5 = 10 m²', 10, { w: 18 }), Q('b.', 'Combien de pots de peinture faut-il pour la fresque ?', '10 ÷ 5 = 2 pots', 2, { w: 18 }), Q('c.', 'Calcule l’aire du fronton triangulaire, en mètres carrés.', 'A = 4 × 3 ÷ 2 = 6 m²', 6, { w: 18 }), Q('d.', 'Calcule l’aire totale à peindre (fresque et fronton), en mètres carrés.', '10 + 6 = 16 m²', 16, { w: 18 })],
      err: { 0: [{ v: 13, m: 'C’est le périmètre : 2 × (4 + 2,5). L’aire est le produit 4 × 2,5.' }], 2: [{ v: 12, m: 'Tu as oublié de diviser par 2. L’aire d’un triangle est b × h ÷ 2.' }] },
      hints: ['Multiplie la longueur par la largeur.', 'Divise l’aire par 5 m².', 'Multiplie la base par la hauteur, puis divise par 2.', 'Additionne les deux aires.'], pouce: '4 × 2,5 ; 10 ÷ 5 ; 4 × 3 ÷ 2 ; 10 + 6.',
      det: ['4 × 2,5 = 10 m².', '10 ÷ 5 = 2 pots.', '4 × 3 = 12 ; 12 ÷ 2 = 6 m².', '10 + 6 = 16 m².'], corr: 'a. 10 m². b. 2 pots. c. 6 m². d. 16 m².' }),
    PB({ id: 'p2', etape: 3, lc: 2, defi: 5, bulle: 'Ce cas se fait en 5 étapes, avec de vraies dimensions. Distingue bien le périmètre (en m), l’aire (en m²) et le volume (en m³).', autravail: { comp: 'val', txt: 'calculer une longueur, une surface et un temps de travail pour un chantier d’entretien.' }, comps: ['app', 'ana', 'rea', 'val'], titre: 'Le terrain de football',
      intro: `<p>Un terrain de football de référence mesure ${H('105 m')} sur ${H('68 m')}. Son cercle central a un rayon de ${H('9,15 m')}. Une tondeuse tond ${H('1 785 m²')} par heure.</p><p class="srcl">${srcFoot}</p>`,
      qs: [Q('a.', 'Calcule le périmètre du terrain, en mètres.', 'P = 2 × (105 + 68) = 346 m', 346, { w: 18 }), Q('b.', 'Calcule l’aire du terrain, en mètres carrés.', 'A = 105 × 68 = 7 140 m²', 7140, { w: 18 }), Q('c.', 'Combien d’heures faut-il pour tondre tout le terrain ?', '7 140 ÷ 1 785 = 4 h', 4, { w: 18 }), Q('d.', 'Calcule le périmètre du cercle central, arrondi au dixième, en mètres.', 'P = 2 × π × 9,15 ≈ 57,5 m', 57.5, { w: 18, tol: .06 }), Q('e.', 'Un entraîneur dit : « Le cercle central couvre moins de 5 % du terrain. » A-t-il raison ? Justifie.', 'A = π × 9,15² ≈ 263,0 m² ; 263,0 ÷ 7 140 ≈ 0,037, soit 3,7 %. Oui : 3,7 % est inférieur à 5 %.', null, { lines: 3 })],
      err: { 0: [{ v: 173, m: 'C’est seulement 105 + 68. Le périmètre est le double.' }], 1: [{ v: 346, m: 'C’est le périmètre. L’aire est le produit 105 × 68.' }], 3: [{ v: 28.7, m: 'Tu as calculé π × 9,15 : c’est la moitié du périmètre. P = 2 × π × r.' }] },
      hints: ['P = 2 × (L + l).', 'A = L × l.', 'Divise l’aire par 1 785.', 'P = 2 × π × r avec r = 9,15.', 'Calcule l’aire du disque π × r², puis divise par 7 140.'], pouce: '2 × (105 + 68) ; 105 × 68 ; 7 140 ÷ 1 785 ; 2 × π × 9,15 ; π × 9,15².',
      det: ['105 + 68 = 173 ; 2 × 173 = 346 m.', '105 × 68 = 7 140 m².', '7 140 ÷ 1 785 = 4 heures.', '2 × π × 9,15 ≈ 57,49 : environ 57,5 m.', 'Aire du cercle : π × 9,15 × 9,15 ≈ 263,0 m². 263,0 ÷ 7 140 ≈ 0,037, soit 3,7 %. L’entraîneur a raison.'], corr: 'a. 346 m. b. 7 140 m². c. 4 h. d. 57,5 m. e. Oui, 3,7 %.' }),
    PB({ id: 'p3', etape: 4, lc: 4, cls: 'bac', defi: 5, bulle: 'Voici une question « vers le CCF » : convertis, calcule des aires, arrondis le nombre de carreaux au nombre entier supérieur et justifie la commande.', autravail: { comp: 'val', txt: 'calculer une quantité de matériaux (carreaux, peinture) à partir de surfaces et d’un taux de chutes.' }, comps: ['app', 'ana', 'rea', 'val', 'com'], titre: 'La salle de bains du carreleur',
      intro: `<p>Un carreleur doit carreler le sol d’une salle de bains rectangulaire de ${H('3,2 m')} sur ${H('2,5 m')}. Les carreaux mesurent ${H('40 cm')} sur ${H('40 cm')}. Il prévoit ${H('10 %')} de chutes. Les carreaux sont vendus par boîtes de ${H('12')}.</p>`,
      qs: [BQ('1', 'Calculer l’aire de la salle de bains, en mètres carrés.', 'rea', '3,2 × 2,5 = 8 m²', 8, { w: 22 }), BQ('2', 'Calculer l’aire d’un carreau, en mètres carrés.', 'ana', '40 cm = 0,4 m ; 0,4 × 0,4 = 0,16 m²', 0.16, { w: 22, tol: .006 }), BQ('3', 'Calculer le nombre de carreaux nécessaires, sans chutes.', 'rea', '8 ÷ 0,16 = 50 carreaux', 50, { w: 22 }), BQ('4', 'Calculer le nombre de carreaux à prévoir avec 10 % de chutes.', 'rea', '50 × 1,10 = 55 carreaux', 55, { w: 22 }), BQ('5', 'Combien de boîtes de 12 carreaux faut-il commander ? Justifier.', 'com', '55 ÷ 12 ≈ 4,6 : 4 boîtes donnent 48 carreaux, c’est trop peu ; il faut commander 5 boîtes (60 carreaux).', null, { lines: 3 })],
      err: { 1: [{ v: 0.4, m: 'C’est le côté d’un carreau. L’aire est le côté multiplié par lui-même : 0,4 × 0,4.' }, { v: 1600, m: 'Tu as multiplié des centimètres : 1 600 cm². Convertis en m² : 1 600 ÷ 10 000.' }], 2: [{ v: 20, m: 'Tu as divisé par 0,4 au lieu de 0,16. Divise l’aire de la pièce par l’aire d’un carreau.' }], 3: [{ v: 5, m: 'Tu as calculé 10 % de 50 seulement. Ajoute-les : 50 + 5.' }] },
      hints: ['Longueur × largeur.', 'Convertis 40 cm en m, puis multiplie le côté par lui-même.', 'Divise l’aire de la pièce par l’aire d’un carreau.', 'Multiplie par 1,10.', 'Divise 55 par 12 et arrondis au nombre entier supérieur.'], pouce: '3,2 × 2,5 ; 0,4 × 0,4 ; 8 ÷ 0,16 ; 50 × 1,10 ; 55 ÷ 12.',
      det: ['3,2 × 2,5 = 8 m².', '40 cm = 0,4 m ; 0,4 × 0,4 = 0,16 m².', '8 ÷ 0,16 = 50 carreaux.', '50 × 1,10 = 55 carreaux.', '55 ÷ 12 ≈ 4,58. 4 boîtes contiennent 4 × 12 = 48 carreaux : trop peu. 5 boîtes contiennent 60 carreaux : c’est suffisant.'], corr: '1. 8 m². 2. 0,16 m². 3. 50. 4. 55. 5. 5 boîtes.' }),
    PB({ id: 'pd', niv: 1, base: 'p3', etape: 3, lc: 3, autravail: { comp: 'ana', txt: 'passer d’un volume à une dimension et vérifier l’effet d’un changement de dimensions.' }, comps: ['ana', 'rea', 'val', 'com'], titre: 'Le gobelet dans les deux sens',
      intro: `<p>Un gobelet de cinéma est un cylindre de rayon ${H('4 cm')} et de hauteur ${H('12 cm')}. Une bouteille contient ${H('2 L')}.</p>`,
      qs: [Q('a.', 'Calcule le volume du gobelet, arrondi à l’unité, en cm³.', 'V = π × 4² × 12 ≈ 603 cm³', 603, { w: 20, tol: 1 }), Q('b.', 'Combien de gobelets pleins peut-on remplir avec la bouteille de 2 L ? (2 L = 2 000 cm³)', '2 000 ÷ 603,19 ≈ 3,3 : 3 gobelets pleins', 3, { w: 20 }), Q('c.', 'On veut un gobelet de 500 mL avec un rayon de 4 cm. Calcule la hauteur, arrondie au dixième, en centimètres.', 'h = 500 ÷ (π × 4²) ≈ 9,9 cm', 9.9, { w: 20, tol: .06 }), Q('d.', 'Le rayon passe de 4 cm à 8 cm, la hauteur reste 12 cm. Par combien le volume est-il multiplié ?', 'V = π × 8² × 12 = π × 768, soit 4 fois π × 192 : le volume est multiplié par 4', 4, { w: 20 }), Q('e.', 'Un ami dit : « Si on double le rayon, le volume double. » A-t-il raison ? Justifie.', 'Non : le rayon est au carré. Doubler le rayon multiplie le volume par 2² = 4.', null, { lines: 3 })],
      err: { 0: [{ v: 151, m: 'Tu as multiplié par 2 au lieu de calculer r². Calcule 4² = 16, puis π × 16 × 12.' }], 1: [{ v: 3.3, m: 'On ne peut remplir que des gobelets entiers : garde la partie entière.' }], 2: [{ v: 41.7, m: 'Tu as divisé par r au lieu de r². Divise 500 par π × 4 × 4.' }], 3: [{ v: 2, m: 'Le rayon est au carré dans la formule : le volume est multiplié par 2², soit 4.' }] },
      hints: ['V = π × r² × h.', 'Divise 2 000 par le volume d’un gobelet.', 'h = V ÷ (π × r²).', 'Calcule le nouveau volume et compare.', 'Le rayon est au carré dans la formule.'], pouce: 'π × 16 × 12 ; 2 000 ÷ 603 ; 500 ÷ (π × 16) ; π × 64 × 12.',
      det: ['π × 4² × 12 = π × 192 ≈ 603,19 : 603 cm³.', '2 000 ÷ 603,19 ≈ 3,3 : on remplit 3 gobelets entiers.', 'π × 4² = 50,27 ; 500 ÷ 50,27 ≈ 9,9 cm.', 'π × 8² × 12 = π × 768 ≈ 2 412,7 cm³ ; 2 412,7 ÷ 603,19 = 4.', 'Le rayon est élevé au carré : doubler le rayon multiplie le volume par 4, pas par 2. L’ami a tort.'], corr: 'a. 603 cm³. b. 3. c. 9,9 cm. d. 4. e. Non.' })];

  c.bilan = [['Je sais calculer un périmètre.', ['e1', 'pa', 'p2']], ['Je sais calculer une aire.', ['e1', 'p1', 'p2']], ['Je sais calculer un volume.', ['e2', 'pd']], ['Je sais convertir des unités.', ['e3', 'p3']]];
  c.fiche = {
    essentiel: ['<b>Périmètre</b> : rectangle 2 × (L + l) ; cercle π × d.', '<b>Aire</b> : rectangle L × l ; triangle b × h ÷ 2 ; disque π × r².', '<b>Volume</b> : pavé L × l × h ; cylindre π × r² × h ; cône ⅓ × π × r² × h ; boule 4 ⁄ 3 × π × r³.', '<b>Conversions</b> : 1 m = 100 cm ; 1 m² = 10 000 cm² ; 1 m³ = 1 000 L ; 1 cm³ = 1 mL.', '<b>Quantité de matériaux</b> : aire de la pièce ÷ aire d’une pièce, plus les chutes, arrondie à l’entier supérieur.'],
    methode: ['Je repère la figure ou le solide et ses mesures.', 'Je convertis toutes les mesures dans la même unité.', 'J’écris la formule, puis je calcule.', 'Je donne l’unité : m, m² ou m³.', 'Je vérifie que le résultat est vraisemblable.'],
    exemple: `<p>Pièce de 3,5 m sur 4 m, carreaux de 50 cm : 14 ÷ 0,25 = 56 carreaux, soit 62 avec 10 % de chutes.</p><p>Gobelet r = 4 cm, h = 12 cm : V = π × 16 × 12 ≈ 603 cm³ ≈ 0,6 L.</p>`,
    pieges: ['Confondre périmètre (m) et aire (m²).', 'Oublier de diviser par 2 pour un triangle.', 'Utiliser le diamètre à la place du rayon dans π × r².', 'Convertir cm² en m² en divisant par 100 au lieu de 10 000.'],
    flash: [['Périmètre d’un rectangle 8 m sur 5 m ?', '26 m'], ['Aire d’un triangle de base 10 cm et de hauteur 6 cm ?', '30 cm²'], ['1 m² = … cm²', '10 000'], ['Volume d’un pavé 30 × 20 × 10 cm ?', '6 000 cm³']]
  };
  chk(2 * (8 + 5) === 26 && 10 * 6 / 2 === 30 && 30 * 20 * 10 === 6000, 'c9 fiche');
  c.words = require('./gl3')('c9');
  return c;
};
