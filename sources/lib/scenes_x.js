/* CAP Maths — scènes d’ouverture des chapitres 4 à 10 (viewBox 600 × 230). */
'use strict';
module.exports = ({ SC, Sketch, SV, tint, acc, esc }) => {
  /* 4 · pourcentages et échelles : une étiquette « − 25 % », une bande de 10 cases, un plan à l’échelle 1/50 */
  SC.c4 = () => { const K = Sketch(514); let s = '';
    s += tint(30, 44, 150, 80, .9, 10) + K.P(K.rect(30, 44, 150, 80)) + `<circle cx="48" cy="62" r="5" class="wh ks" stroke-width="1.8"/>` + K.tx(112, 84, '60 €', 20) + K.P(K.line(86, 78, 140, 78), { w: 2.2, c: '#C2332A' }) + K.tx(105, 114, '45 €', 24, { c: '#C2332A' }) + acc(138, 28, 66, 30, .9, 15) + K.tx(171, 49, '− 25 %', 15, { c: '#fff' });
    for (let i = 0; i < 10; i++) s += (i < 3 ? acc(30 + i * 32, 154, 28, 30, .9, 3) : tint(30 + i * 32, 154, 28, 30, .9, 3)) + K.P(K.rect(30 + i * 32, 154, 28, 30), { w: 1.4 });
    s += K.tx(176, 146, '10 cases = 100 %', 12) + K.tx(176, 208, '3 cases = 30 %', 13, { c: '#C2332A' });
    s += tint(398, 40, 170, 100, .5, 6) + K.P(K.rect(398, 40, 170, 100)) + K.P(K.line(458, 40, 458, 140), { w: 1.4, op: .6 }) + K.tx(428, 96, 'salle', 14) + K.tx(513, 96, 'cuisine', 14) + K.tx(483, 28, 'échelle 1/50', 15, { c: '#C2332A' });
    s += K.P(K.line(398, 168, 568, 168), { w: 2.4 }) + K.P(K.line(398, 160, 398, 176), { w: 2 }) + K.P(K.line(568, 160, 568, 176), { w: 2 }) + K.tx(483, 192, '1 cm sur le plan = 50 cm en vrai', 12);
    return SV(600, 230, s, 'Une étiquette de prix à moins 25 pour cent, une bande de dix cases dont trois sont colorées et un plan de pièce à l’échelle 1 sur 50'); };
  /* 5 · équations et formules : une balance (2,5x + 5 = 30) et une formule avec son tableau de valeurs */
  SC.c5 = () => { const K = Sketch(515); let s = '';
    s += tint(40, 60, 100, 44, .9, 6) + K.P(K.rect(40, 60, 100, 44)) + K.tx(90, 88, '2,5x + 5', 17) + acc(160, 60, 100, 44, .9, 6) + K.P(K.rect(160, 60, 100, 44)) + K.tx(210, 88, '30', 20, { c: '#fff' }) + K.tx(150, 52, '=', 20);
    s += K.P(K.line(30, 112, 270, 112), { w: 3 }) + K.P(K.poly([[150, 112], [128, 170], [172, 170]], true)) + K.P(K.line(110, 170, 190, 170), { w: 3 });
    s += K.tx(150, 200, '2,5x + 5 = 30', 15) + K.tx(150, 222, 'x = 10', 16, { c: '#C2332A' });
    s += tint(330, 36, 240, 64, .55, 8) + K.P(K.rect(330, 36, 240, 64)) + K.tx(450, 66, 'P = 7,5 × n + 2', 19) + K.tx(450, 90, 'n = 4 → P = 32 €', 13, { c: '#C2332A' });
    s += K.tx(334, 138, 'n', 12) + K.tx(334, 178, 'P', 12);
    [[1, '9,50'], [2, '17'], [3, '24,50'], [4, '32']].forEach(([n, p], i) => { const x = 352 + i * 56; s += (n === 4 ? acc(x, 120, 50, 28, .9, 3) : tint(x, 120, 50, 28, .9, 3)) + K.P(K.rect(x, 120, 50, 28), { w: 1.4 }) + K.tx(x + 25, 140, String(n), 14, { c: n === 4 ? '#fff' : undefined }) + (n === 4 ? acc(x, 160, 50, 28, .9, 3) : tint(x, 160, 50, 28, .9, 3)) + K.P(K.rect(x, 160, 50, 28), { w: 1.4 }) + K.tx(x + 25, 180, p, 13, { c: n === 4 ? '#fff' : undefined }); });
    s += K.tx(450, 216, 'prix P de n places, en euros', 12);
    return SV(600, 230, s, 'Une balance en équilibre avec 2,5x plus 5 d’un côté et 30 de l’autre, puis la formule P égale 7,5 fois n plus 2 avec un tableau de valeurs'); };
  /* 6 · fonctions et graphiques : la courbe d’un saut et le tableau de Bolt */
  SC.c6 = () => { const K = Sketch(516); let s = '';
    const X = t => 50 + t * 110, Y = h => 190 - h * 66;
    [0, 1, 2].forEach(t => { s += K.P(K.line(X(t), 190, X(t), Y(2.5)), { w: 1, op: .35 }) + K.tx(X(t), 210, String(t), 12); }); [0, 1, 2].forEach(h => { s += K.P(K.line(50, Y(h), 270, Y(h)), { w: 1, op: .35 }) + K.tx(36, Y(h) + 4, String(h), 12); });
    s += K.P(K.line(50, 190, 276, 190), { w: 2.4 }) + K.P(K.line(50, 190, 50, Y(2.5)), { w: 2.4 });
    let d = []; for (let k = 0; k <= 20; k++) { const t = k / 10; d.push([X(t), Y(4 * t - 2 * t * t)]); } s += K.P(K.poly(d, false), { w: 3 });
    s += `<circle cx="${X(1)}" cy="${Y(2)}" r="6" class="k" stroke="#fff" stroke-width="1.6"/>` + K.tx(X(1) + 12, Y(2) - 8, 'maximum : 2 m', 12, { c: '#C2332A', a: 'start' }) + K.tx(160, 230, 't (s)', 11);
    [['d (m)', 0], ['t (s)', 1]].forEach(([l, r]) => { s += (r ? acc : tint)(330, 60 + r * 46, 62, 36, .9, 4) + K.P(K.rect(330, 60 + r * 46, 62, 36), { w: 1.4 }) + K.tx(361, 83 + r * 46, l, 13, r ? { c: '#fff' } : undefined); });
    [['50', '5,47'], ['80', '7,92'], ['100', '9,58']].forEach(([a, b], i) => { const x = 396 + i * 62; s += tint(x, 60, 58, 36, .9, 4) + K.P(K.rect(x, 60, 58, 36), { w: 1.4 }) + K.tx(x + 29, 83, a, 14) + tint(x, 106, 58, 36, .9, 4) + K.P(K.rect(x, 106, 58, 36), { w: 1.4 }) + K.tx(x + 29, 129, b, 14); });
    s += K.tx(461, 46, 'Bolt, Berlin 2009', 14) + K.tx(461, 170, 'à 80 m : 7,92 s', 14, { c: '#C2332A' }) + K.tx(461, 192, 'image de 80 → 7,92', 12);
    return SV(600, 230, s, 'La courbe de la hauteur d’un saut avec son maximum de 2 mètres, et un tableau des temps de passage de Bolt à 50, 80 et 100 mètres'); };
  /* 7 · fonctions linéaires et affines : deux droites qui se croisent (9x et 7x + 12) et deux formules de séances */
  SC.c7 = () => { const K = Sketch(517); let s = '';
    const X = x => 50 + x * 28, Y = y => 190 - y * 1.8;
    [0, 2, 4, 6, 8].forEach(x => { s += K.P(K.line(X(x), 190, X(x), Y(80)), { w: 1, op: .3 }) + K.tx(X(x), 208, String(x), 12); }); [0, 40, 80].forEach(y => { s += K.P(K.line(50, Y(y), 274, Y(y)), { w: 1, op: .3 }) + K.tx(38, Y(y) + 4, String(y), 12, { a: 'end' }); });
    s += K.P(K.line(50, 190, 280, 190), { w: 2.4 }) + K.P(K.line(50, 190, 50, Y(84)), { w: 2.4 });
    s += K.P(K.line(X(0), Y(0), X(8), Y(72)), { w: 3 }) + K.P(K.line(X(0), Y(12), X(8), Y(68)), { w: 3, c: '#C2332A' });
    s += K.P(K.line(X(6), 190, X(6), Y(54)), { w: 1.8, c: '#C2332A', op: .7 }) + K.P(K.line(50, Y(54), X(6), Y(54)), { w: 1.8, c: '#C2332A', op: .7 });
    s += `<circle cx="${X(6)}" cy="${Y(54)}" r="6" class="wh ks" stroke-width="2.2"/>` + K.tx(26, Y(54) - 8, '54', 12, { c: '#C2332A', a: 'end' });
    s += K.tx(X(8) + 8, Y(72) - 2, '9x', 13, { a: 'start' }) + K.tx(X(8) + 8, Y(68) + 18, '7x + 12', 13, { a: 'start', c: '#C2332A' }) + K.tx(162, 226, 'séances', 11);
    s += tint(350, 40, 220, 64, .6, 8) + K.P(K.rect(350, 40, 220, 64)) + K.tx(460, 66, 'A : 9 € la séance', 16) + K.tx(460, 90, 'A(x) = 9x', 14);
    s += acc(350, 120, 220, 64, .9, 8) + K.P(K.rect(350, 120, 220, 64)) + K.tx(460, 146, 'B : carte 12 € + 7 €', 16, { c: '#fff' }) + K.tx(460, 170, 'B(x) = 7x + 12', 14, { c: '#fff' });
    s += K.tx(460, 212, 'à 6 séances : 54 € pour les deux', 13, { c: '#C2332A' });
    return SV(600, 230, s, 'Deux droites qui se croisent au point de coordonnées 6 et 54, avec la formule A égale 9x et la formule B égale 7x plus 12'); };
  /* 8 · calculs commerciaux : une facture, une étiquette de remise et un placement */
  SC.c8 = () => { const K = Sketch(518); let s = '';
    s += K.P(K.rect(40, 24, 150, 176)) + tint(46, 30, 138, 164, .4, 6) + K.tx(115, 52, 'FACTURE', 15) + K.tx(56, 88, 'Prix HT', 13, { a: 'start' }) + K.tx(176, 88, '50 €', 13, { a: 'end' }) + K.tx(56, 114, 'TVA 20 %', 13, { a: 'start' }) + K.tx(176, 114, '10 €', 13, { a: 'end' }) + K.P(K.line(56, 128, 176, 128), { w: 1.6 }) + acc(50, 138, 134, 32, .9, 5) + K.tx(66, 160, 'TTC', 15, { a: 'start', c: '#fff' }) + K.tx(172, 160, '60 €', 15, { a: 'end', c: '#fff' });
    s += tint(240, 60, 120, 70, .6, 8) + K.P(K.rect(240, 60, 120, 70)) + acc(258, 34, 84, 28, .9, 8) + K.tx(300, 54, '− 15 %', 15, { c: '#fff' }) + K.tx(300, 92, 'avant : 80 €', 14) + K.tx(300, 120, 'après : 68 €', 16, { c: '#C2332A' });
    s += tint(240, 160, 90, 30, .9, 4) + K.P(K.rect(240, 160, 90, 30), { w: 1.4 }) + K.tx(285, 181, 'achat 40', 13) + acc(330, 160, 40, 30, .9, 4) + K.P(K.rect(330, 160, 40, 30), { w: 1.4 }) + K.tx(350, 181, '+ 12', 13, { c: '#fff' }) + K.tx(305, 212, 'taux de marge 30 %', 13, { c: '#C2332A' });
    s += tint(420, 50, 150, 40, .9, 6) + K.P(K.rect(420, 50, 150, 40)) + K.tx(495, 77, '1 200 €', 17) + K.P(K.line(495, 94, 495, 128), { w: 2.4 }) + K.P(K.poly([[487, 122], [495, 134], [503, 122]], true), { w: 2 }) + K.tx(510, 116, '3 % par an', 12, { a: 'start' }) + acc(420, 138, 150, 40, .9, 6) + K.P(K.rect(420, 138, 150, 40)) + K.tx(495, 165, '1 272 €', 17, { c: '#fff' }) + K.tx(495, 200, 'après 2 ans', 13);
    return SV(600, 230, s, 'Une facture avec un prix HT de 50 euros, 10 euros de TVA et 60 euros TTC, une étiquette de remise de 15 pour cent, un taux de marge de 30 pour cent et un placement de 1 200 euros qui devient 1 272 euros'); };
  /* 9 · périmètres, aires et volumes : un terrain (64 m de tour), une fresque (10 m²), un gobelet (603 cm³), un carrelage (62 carreaux) */
  SC.c9 = () => { const K = Sketch(519); let s = '';
    const ell = (cx, cy, rx, ry, up) => K.curve(x => cy + (up ? -1 : 1) * ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2)), cx - rx, cx + rx, 20);
    s += tint(60, 54, 100, 60, .8, 6) + K.P(K.rect(60, 54, 100, 60)) + K.P(K.rect(54, 48, 112, 72), { c: '#C2332A', w: 2.2 }) + K.tx(110, 40, '20 m', 14) + K.tx(48, 88, '12 m', 14, { a: 'end' }) + K.tx(110, 90, 'P = 64 m', 15, { c: '#C2332A' }) + K.tx(110, 146, 'tour du terrain', 12.5);
    s += tint(200, 54, 100, 60, .9, 6) + K.P(K.rect(200, 54, 100, 60)) + K.tx(250, 40, '4 m', 14) + K.tx(308, 88, '2,5 m', 14, { a: 'start' }) + K.tx(250, 90, 'A = 10 m²', 15) + K.tx(250, 146, '2 pots de 5 m²', 12.5, { c: '#C2332A' });
    s += tint(380, 54, 60, 78, .8, 4) + K.P(ell(410, 62, 30, 8, true) + ell(410, 62, 30, 8, false) + K.line(380, 62, 380, 132) + K.line(440, 62, 440, 132) + ell(410, 132, 30, 8, false)) + K.P(K.line(410, 62, 440, 62), { w: 2.6, c: '#C2332A' }) + K.tx(410, 38, 'r = 4 cm', 12.5) + K.tx(410, 110, 'h = 12 cm', 11.5) + K.tx(410, 160, 'V ≈ 603 cm³', 13.5, { c: '#C2332A' });
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) s += (i + j) % 2 ? acc(500 + i * 20, 54 + j * 20, 20, 20, .85, 1) : tint(500 + i * 20, 54 + j * 20, 20, 20, .95, 1);
    s += K.P(K.rect(500, 54, 80, 60)) + K.tx(540, 40, '56 carreaux', 13) + K.tx(540, 138, '+ 10 % de chutes', 12.5) + K.tx(540, 158, '= 62 carreaux', 13.5, { c: '#C2332A' });
    s += K.tx(300, 206, 'périmètre en m · aire en m² · volume en m³', 14.5);
    return SV(600, 230, s, 'Un terrain de 20 mètres sur 12 mètres dont le tour mesure 64 mètres, une fresque de 10 mètres carrés, un gobelet de 603 centimètres cubes et un carrelage de 62 carreaux'); };
  /* FIN */
};
