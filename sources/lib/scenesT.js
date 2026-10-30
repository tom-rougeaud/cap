/* Terminale — scènes « Au travail » (une par chapitre) : dessin au trait, sans visage. viewBox 600 × 230. */
'use strict';
const { Sketch, esc } = require('./visu');
const SV = (w, h, body, lab) => `<svg viewBox="0 0 ${w} ${h}" class="pic scene" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(lab)}">${body}</svg>`;
const tint = (x, y, w, h, op = .9, rx = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="k2" opacity="${op}"/>`;
const acc = (x, y, w, h, op = .85, rx = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="k" opacity="${op}"/>`;
const SC = {
  /* 1 · suites : un écran de suivi des abonnés, des colis d’abonnement */
  c1: () => { const K = Sketch(411); let s = K.P(K.line(30, 205, 570, 205));
    s += tint(40, 30, 300, 150, .5) + K.P(K.rect(40, 30, 300, 150)) + K.P(K.line(150, 180, 230, 180) + K.line(190, 180, 190, 205), { w: 2.6 });
    s += K.P(K.line(64, 160, 320, 160) + K.line(64, 160, 64, 48), { w: 2 });
    [0, 1, 2, 3, 4, 5, 6, 7].forEach(i => { const h = 14 * Math.pow(1.3, i); s += (i === 7 ? acc(76 + i * 30, 160 - h, 20, h, .85, 2) : tint(76 + i * 30, 160 - h, 20, h, .95, 2)) + K.P(K.rect(76 + i * 30, 160 - h, 20, h), { w: 1.4 }); });
    s += K.tx(120, 64, '× 1,3', 16);
    [[380, 130], [450, 130], [415, 80]].forEach(([x, y], i) => { s += (i === 2 ? acc(x, y, 60, 46, .8, 3) : tint(x, y, 60, 46, .9, 3)) + K.P(K.rect(x, y, 60, 46)) + K.P(K.line(x + 30, y, x + 30, y + 46), { w: 1.6 }); });
    s += K.P(K.rect(520, 150, 34, 55)) + K.P(K.rect(526, 158, 22, 34), { w: 1.4 }) + K.tx(537, 140, '+ %', 14);
    return SV(600, 230, s, 'Un écran avec des barres qui grandissent de plus en plus vite, des colis d’abonnement et un téléphone'); },
  /* 2 · calculs financiers : un bureau de conseiller, une plaquette d’épargne, un tableau d’amortissement */
  c2: () => { const K = Sketch(421); let s = K.P(K.line(30, 205, 570, 205)) + K.P(K.line(40, 150, 560, 150), { w: 3 }) + K.P(K.line(70, 150, 70, 205) + K.line(530, 150, 530, 205));
    s += tint(80, 40, 120, 104, .9) + K.P(K.rect(80, 40, 120, 104)) + K.tx(140, 70, 'LEP', 20) + K.tx(140, 98, '2,5 %', 18) + K.P(K.line(96, 116, 184, 116) + K.line(96, 128, 170, 128), { w: 1.6 });
    s += tint(230, 30, 190, 114, .5) + K.P(K.rect(230, 30, 190, 114));
    for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) s += K.P(K.rect(242 + c * 42, 42 + r * 19, 42, 19), { w: 1.2 });
    s += acc(242, 42, 168, 19, .75, 1) + K.tx(326, 56, 'tableau d’amortissement', 11, { c: '#fff' });
    s += K.P(K.rect(450, 70, 80, 74)) + tint(458, 78, 64, 18, .9, 2) + [0, 1, 2].map(r => [0, 1, 2].map(c => K.P(K.rect(460 + c * 21, 102 + r * 13, 17, 10), { w: 1.2 })).join('')).join('');
    s += K.P(K.circ(500, 40, 14)) + K.tx(500, 46, '€', 16);
    return SV(600, 230, s, 'Un bureau de conseiller : une plaquette LEP 2,5 %, un tableau d’amortissement, une calculatrice'); },
  /* 3 · polynômes de degré 3 : un atelier de coffrets, une courbe au tableau */
  c3: () => { const K = Sketch(431); let s = K.P(K.line(30, 205, 570, 205));
    s += tint(40, 26, 260, 150, .45) + K.P(K.rect(40, 26, 260, 150)) + K.P(K.line(60, 150, 280, 150) + K.line(60, 150, 60, 40), { w: 1.8 });
    s += K.P(K.curve(x => 150 - (-(Math.pow((x - 60) / 22, 3)) + 15 * Math.pow((x - 60) / 22, 2) - 48 * (x - 60) / 22 - 20 + 70) * .9, 60, 280), { w: 3 });
    s += `<circle cx="${60 + 8 * 22}" cy="${(150 - (44 + 70) * .9).toFixed(1)}" r="6" class="k"/>` + K.tx(236, 46, 'max', 14);
    [[340, 150], [400, 150], [460, 150], [370, 104], [430, 104]].forEach(([x, y], i) => { s += (i === 4 ? acc(x, y, 54, 46, .85, 3) : tint(x, y, 54, 46, .9, 3)) + K.P(K.rect(x, y, 54, 46)) + K.P(K.line(x, y + 14, x + 54, y + 14), { w: 1.4 }); });
    s += K.P(K.line(520, 205, 520, 120) + K.line(520, 120, 560, 120), { w: 2.2 }) + K.tx(540, 112, 'stock', 12);
    return SV(600, 230, s, 'Un tableau avec la courbe d’un bénéfice et son maximum, une pile de coffrets'); },
  /* 4 · exponentielles et logarithme : un écran de statistiques d’audience et une affiche « × 2 » */
  c4: () => { const K = Sketch(441); let s = K.P(K.line(30, 205, 570, 205));
    s += tint(50, 30, 250, 140, .45) + K.P(K.rect(50, 30, 250, 140)) + K.P(K.line(140, 170, 210, 170) + K.line(175, 170, 175, 205), { w: 2.6 });
    s += K.P(K.line(70, 150, 280, 150) + K.line(70, 150, 70, 44), { w: 1.8 }) + K.P(K.curve(x => 150 - 6 * Math.pow(1.32, (x - 70) / 21), 70, 280), { w: 3 });
    s += K.tx(120, 62, 'audience', 14);
    s += tint(340, 40, 110, 140, .9) + K.P(K.rect(340, 40, 110, 140)) + K.tx(395, 100, '× 2', 30) + K.tx(395, 140, 'en ? ans', 14);
    s += K.P(K.rect(480, 120, 60, 85)) + K.P(K.rect(488, 130, 44, 20), { w: 1.4 }) + K.tx(510, 145, 'log', 12) + [0, 1, 2].map(r => [0, 1].map(c => K.P(K.rect(490 + c * 22, 158 + r * 14, 18, 10), { w: 1.2 })).join('')).join('');
    return SV(600, 230, s, 'Un écran avec une courbe d’audience exponentielle, une affiche « × 2 » et une calculatrice avec la touche log'); },
  /* 5 · statistique à deux variables : une réunion devant un graphique de ventes */
  c5: () => { const K = Sketch(451); let s = K.P(K.line(30, 205, 570, 205));
    s += tint(60, 24, 320, 156, .4) + K.P(K.rect(60, 24, 320, 156)) + K.P(K.line(84, 160, 360, 160) + K.line(84, 160, 84, 40), { w: 1.8 });
    [[100, 140], [130, 132], [160, 125], [190, 120], [220, 108], [250, 96], [280, 86]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="5" class="k"/>`; });
    s += K.P(K.curve(x => 140 - 54 * (Math.pow(1.121, (x - 100) / 30) - 1) / (Math.pow(1.121, 6) - 1), 100, 350), { w: 2.6 }) + K.P(K.line(280, 30, 280, 160), { w: 1.4 }) + K.tx(330, 52, 'prévision ?', 13);
    s += K.P(K.rect(420, 120, 130, 70)) + tint(426, 126, 118, 58, .9) + K.tx(485, 150, 'R² = 0,997', 14) + K.tx(485, 172, 'tableur', 11);
    s += K.P(K.line(410, 205, 410, 190) + K.line(560, 205, 560, 190), { w: 2 });
    return SV(600, 230, s, 'Un écran avec un nuage de points de ventes, une courbe de tendance et un tableur affichant R²'); },
  /* 6 · probabilités : un comptoir de retrait de colis et un écran d’arbre */
  c6: () => { const K = Sketch(461); let s = K.P(K.line(30, 205, 570, 205)) + K.P(K.line(40, 130, 330, 130), { w: 3 }) + K.P(K.line(60, 130, 60, 205) + K.line(310, 130, 310, 205));
    [[60, 84], [118, 84], [176, 84], [90, 40], [148, 40]].forEach(([x, y], i) => { s += (i === 4 ? acc(x, y, 54, 44, .85, 3) : tint(x, y, 54, 44, .9, 3)) + K.P(K.rect(x, y, 54, 44)) + K.P(K.line(x, y + 14, x + 54, y + 14), { w: 1.4 }); });
    s += K.tx(275, 110, 'retrait', 14);
    s += tint(370, 30, 190, 150, .45) + K.P(K.rect(370, 30, 190, 150)) + `<circle cx="392" cy="105" r="5" fill="#2B2D7C"/>` + K.P(K.line(396, 103, 450, 64) + K.line(396, 107, 450, 146) + K.line(462, 64, 530, 44) + K.line(462, 64, 530, 84) + K.line(462, 146, 530, 126) + K.line(462, 146, 530, 166), { w: 2 });
    [[456, 64], [456, 146], [538, 44], [538, 84], [538, 126], [538, 166]].forEach(([x, y]) => { s += K.P(K.circ(x, y, 8), { w: 1.8 }); });
    return SV(600, 230, s, 'Un comptoir de retrait de colis et un écran affichant un arbre pondéré'); },
  /* 7 · poursuite d’études : une salle de BTS, un tableau avec e et ln */
  c7: () => { const K = Sketch(471); let s = K.P(K.line(30, 205, 570, 205));
    s += tint(40, 24, 330, 140, .4) + K.P(K.rect(40, 24, 330, 140)) + K.tx(110, 70, 'e ≈ 2,718', 22) + K.tx(110, 112, 'ln(e) = 1', 20) + K.P(K.line(220, 140, 350, 140) + K.line(230, 150, 230, 40), { w: 1.6 }) + K.P(K.curve(x => 140 - 6 * Math.exp((x - 230) / 50), 230, 345), { w: 2.6 });
    s += K.P(K.poly([[430, 70], [500, 92], [430, 114], [360, 92]], true)) + acc(392, 84, 76, 16, .8, 2) + K.P(K.line(500, 92, 500, 134), { w: 2 }) + `<circle cx="500" cy="138" r="5" class="k"/>`;
    s += K.P(K.rect(400, 150, 140, 55)) + K.tx(470, 182, 'BTS NDRC · MCO', 13);
    return SV(600, 230, s, 'Un tableau avec le nombre e et une courbe exponentielle, une toque et un panneau BTS'); },
};
module.exports = { SC };
