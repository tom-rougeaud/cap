/* Version 3 — scènes « Au travail » (une par chapitre) et illustrations des 5 compétences.
   Dessin au trait, à main levée : lieux, objets et mains au travail, sans visage. */
'use strict';
const { Sketch, esc } = require('./visu');
const SV = (w, h, body, lab) => `<svg viewBox="0 0 ${w} ${h}" class="pic scene" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(lab)}">${body}</svg>`;
const tint = (x, y, w, h, op = .9, rx = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="k2" opacity="${op}"/>`;
const acc = (x, y, w, h, op = .85, rx = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="k" opacity="${op}"/>`;
/* main stylisée (contour de main qui tient ou montre) */
const hand = (K, x, y, s = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${K.P(K.poly([[0, 0], [34, -4], [52, -2], [56, 6], [36, 8], [40, 14], [62, 14], [64, 22], [40, 24], [42, 30], [60, 32], [58, 40], [30, 40], [0, 36]], false, .8), { w: 2.4 })}${K.P(K.line(-30, 4, 0, 0, .6) + K.line(-30, 34, 0, 36, .6), { w: 2.4 })}</g>`;

const SC = {
  c1: () => { const K = Sketch(11); let s = '';
    s += tint(40, 40, 330, 170, .55) + K.P(K.rect(40, 40, 330, 170) + K.line(40, 95, 370, 95) + K.line(40, 150, 370, 150));
    [[60, 62], [120, 58], [190, 64], [250, 60], [310, 62]].forEach(([x, y], i) => { s += K.P(K.rect(x, y, 40, 32)); });
    [[70, 116], [140, 112], [210, 118], [280, 114]].forEach(([x, y]) => { s += K.P(K.circ(x + 14, y + 16, 15)); });
    [[60, 168], [130, 170], [200, 166], [270, 170]].forEach(([x, y]) => { s += K.P(K.rect(x, y, 50, 36)); });
    [[78, 96], [168, 96], [258, 151], [128, 151]].forEach(([x, y], i) => { s += acc(x, y, 46, 22, .9) + K.P(K.rect(x, y, 46, 22), { w: 1.8 }) + K.tx(x + 23, y + 16, ['−30 %', '−50 %', '9,90 €', '−20 %'][i], 13, { c: '#fff' }); });
    s += acc(420, 40, 150, 56, .95, 10) + K.tx(495, 76, 'SOLDES', 28, { c: '#fff' }) + K.P(K.rect(420, 40, 150, 56));
    s += K.P(K.rect(440, 130, 110, 60)) + K.tx(495, 160, '89,90 €', 20) + K.tx(495, 182, '− 25 %', 16);
    return SV(600, 230, s, 'Un rayon en période de soldes, avec des étiquettes de remise'); },
  c2: () => { const K = Sketch(21); let s = '';
    s += tint(250, 120, 300, 90, .55) + K.P(K.rect(250, 120, 300, 90)) + K.P(K.rect(300, 60, 110, 60)) + tint(306, 66, 98, 48, .9) + K.tx(355, 96, '27,30 €', 18);
    s += K.P(K.rect(440, 80, 60, 40)) + K.P(K.poly([[455, 80], [455, 40], [485, 40], [485, 80]], false)) + K.P(K.line(462, 50, 478, 50) + K.line(462, 58, 478, 58) + K.line(462, 66, 474, 66), { w: 1.6 });
    [40, 110, 180].forEach(x => { s += K.P(K.line(x, 150, x, 210) + K.line(x - 12, 212, x + 12, 212) + K.circ(x, 146, 5)); });
    s += K.P(K.curve(x => 152 + Math.sin((x - 40) / 70 * Math.PI) * 10, 40, 110) + K.curve(x => 152 + Math.sin((x - 110) / 70 * Math.PI) * 10, 110, 180), { w: 4 }).replace('stroke="#2B2D7C"', 'class="ks"');
    s += K.tx(110, 196, 'file d’attente', 14) + K.tx(120, 40, '⏱ 4 min', 22) + K.P(K.circ(120, 90, 30) + K.line(120, 90, 120, 70) + K.line(120, 90, 136, 96));
    return SV(600, 230, s, 'Une caisse avec un ticket, une file d’attente et une horloge'); },
  c3: () => { const K = Sketch(31); let s = '';
    s += K.P(K.poly([[120, 70], [300, 20], [480, 70]], true)) + acc(124, 60, 352, 14, .6, 2);
    s += K.P(K.line(140, 72, 140, 210) + K.line(460, 72, 460, 210) + K.rect(150, 150, 300, 60));
    s += tint(150, 150, 300, 60, .55);
    [[180, 120], [230, 118], [280, 120], [330, 118]].forEach(([x, y]) => { s += K.P(K.rect(x, y, 34, 30) + K.line(x - 2, y, x + 36, y)) + acc(x + 4, y + 8, 26, 14, .7, 2); });
    s += K.P(K.rect(380, 96, 60, 46)) + K.tx(410, 118, 'miel', 14) + K.tx(410, 136, '8 €', 16);
    for (let i = 0; i < 9; i++) s += `<circle cx="${150 + i * 38}" cy="${86 + (i % 2) * 6}" r="5" class="k" opacity=".8"/>`;
    s += K.tx(300, 192, 'stand : 120 € la journée', 16);
    return SV(600, 230, s, 'Un stand de marché de Noël avec des pots de miel'); },
  c4: () => { const K = Sketch(41); let s = '';
    s += K.P(K.line(40, 200, 560, 200)) + K.P(K.rect(80, 50, 200, 130)) + tint(86, 56, 188, 118, .6);
    s += K.tx(180, 80, 'FACTURE', 18) + K.P(K.line(100, 100, 260, 100) + K.line(100, 120, 260, 120) + K.line(100, 140, 220, 140), { w: 1.6 }) + acc(200, 150, 64, 20, .85) + K.tx(232, 165, 'TTC', 13, { c: '#fff' });
    s += K.P(K.rect(320, 90, 90, 110)) + K.P(K.rect(332, 102, 66, 24)) + tint(334, 104, 62, 20, .9) + K.tx(365, 120, '− 10 %', 13);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s += K.P(K.rect(334 + c * 22, 136 + r * 20, 16, 14), { w: 1.6 });
    s += K.P(K.poly([[440, 120], [520, 110], [530, 190], [450, 198]], true)) + K.P(K.line(455, 140, 515, 133) + K.line(457, 158, 517, 151), { w: 1.6 });
    return SV(600, 230, s, 'Un bureau avec une facture, une calculatrice et un devis'); },
  c5: () => { const K = Sketch(51); let s = '';
    s += K.P(K.curve(x => 190 + Math.sin(x / 60) * 10, 20, 580)) + K.P(K.curve(x => 205 + Math.sin(x / 60) * 10, 20, 580), { w: 1.4 });
    s += tint(170, 100, 170, 70, .6) + K.P(K.rect(170, 100, 170, 70)) + K.P(K.poly([[340, 120], [395, 120], [415, 145], [415, 170], [340, 170]], true)) + K.P(K.circ(210, 176, 15) + K.circ(380, 176, 15));
    s += acc(190, 118, 90, 24, .9) + K.tx(235, 136, 'livraison', 14, { c: '#fff' }) + K.P(K.rect(355, 128, 34, 18), { w: 1.6 });
    [60, 470, 540].forEach((x, i) => { s += K.P(K.rect(x, 40, 40, 30) + K.line(x + 20, 70, x + 20, 100)) + K.tx(x + 20, 61, ['0', '10', '20'][i], 14); });
    s += K.tx(520, 30, 'km', 16) + K.tx(150, 62, '6 € + 0,40 € par km', 16, { a: 'start' });
    return SV(600, 230, s, 'Une camionnette de livraison sur une route avec des bornes kilométriques'); },
  c6: () => { const K = Sketch(61); let s = '';
    const cx = 160, cy = 110, r = 78; s += K.P(K.circ(cx, cy, r));
    for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; s += K.P(K.line(cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a)), { w: 1.6 }); }
    s += `<path d="M${cx} ${cy}L${cx + r * .97} ${cy}A${r * .97} ${r * .97} 0 0 1 ${(cx + r * .97 * Math.cos(.628)).toFixed(1)} ${(cy + r * .97 * Math.sin(.628)).toFixed(1)}Z" class="k" opacity=".85"/>`;
    s += K.P(K.line(cx, cy + r, cx, 218) + K.line(cx - 40, 218, cx + 40, 218)) + K.P(K.poly([[cx - 8, cy - r - 16], [cx + 8, cy - r - 16], [cx, cy - r + 2]], true));
    s += tint(330, 110, 110, 90, .6) + K.P(K.rect(330, 110, 110, 90) + K.line(360, 110, 410, 110)) + K.tx(385, 165, 'urne', 16) + K.P(K.rect(370, 80, 26, 34), { w: 1.8 });
    [[490, 60], [535, 90], [500, 120]].forEach(([x, y], i) => { s += `<ellipse cx="${x}" cy="${y}" rx="18" ry="22" class="${i === 1 ? 'k' : 'k2'}" opacity=".85"/>` + K.P(K.circ(x, y, 20) + K.line(x, y + 22, x - 10 + i * 6, 210), { w: 1.8 }); });
    return SV(600, 230, s, 'Une roue de jeu, une urne et des ballons dans un magasin'); },
  c7: () => { const K = Sketch(71); let s = '';
    s += K.P(K.rect(40, 30, 330, 180)) + tint(46, 36, 318, 168, .35) + K.P(K.line(40, 180, 370, 180));
    s += acc(80, 150, 90, 30, .85) + K.P(K.rect(80, 150, 90, 30)) + K.P(K.curve(x => 150 - Math.sqrt(Math.max(0, 400 - (x - 125) ** 2)) * 1.2, 105, 145) + K.line(125, 125, 125, 95)) + K.P(K.circ(125, 82, 14));
    s += K.P(K.rect(230, 120, 100, 60) + K.line(230, 120, 250, 100) + K.line(330, 120, 350, 100) + K.line(250, 100, 350, 100) + K.line(350, 100, 350, 160) + K.line(330, 180, 350, 160));
    s += K.P(K.poly([[410, 140], [470, 140], [470, 200], [410, 200]], true) + K.poly([[410, 140], [430, 120], [490, 120], [470, 140]], false) + K.line(490, 120, 490, 180) + K.line(470, 200, 490, 180)) + tint(412, 142, 56, 56, .7, 2);
    s += K.P(K.line(500, 200, 560, 200) + K.line(500, 200, 560, 160), { w: 2.2 }) + K.P(K.poly([[548, 200], [548, 188], [560, 188]], false), { w: 1.6 }) + K.tx(440, 228, 'colis', 14) + K.tx(530, 226, 'rampe', 14);
    s += K.tx(205, 24, 'vitrine 2,4 m × 1,8 m', 15);
    return SV(600, 240, s, 'Une vitrine avec un podium, un présentoir, des colis et une rampe'); },
  c8: () => { const K = Sketch(81); let s = '';
    s += tint(40, 120, 300, 90, .55) + K.P(K.rect(40, 120, 300, 90)) + acc(130, 70, 120, 34, .9, 8) + K.P(K.rect(130, 70, 120, 34)) + K.tx(190, 94, 'ACCUEIL', 18, { c: '#fff' });
    s += K.P(K.poly([[380, 60], [540, 60], [540, 200], [380, 200]], true)) + tint(386, 66, 148, 128, .5) + K.tx(460, 88, 'Votre avis ?', 16);
    [0, 1, 2].forEach(i => { s += K.P(K.rect(398, 104 + i * 30, 124, 22), { w: 1.6 }) + K.tx(410 + 0, 120 + i * 30, '★★★★☆'.slice(0, 5), 13, { a: 'start' }); });
    s += hand(K, 520, 180, .8, -20) + K.P(K.rect(80, 140, 90, 50) + K.line(80, 157, 170, 157) + K.line(80, 173, 170, 173) + K.line(110, 140, 110, 190) + K.line(140, 140, 140, 190), { w: 1.6 });
    return SV(600, 230, s, 'Un comptoir d’accueil et une tablette de questionnaire de satisfaction'); }
};

/* les 5 compétences, illustrées par un geste de travail */
const CP = {
  app: () => { const K = Sketch(101); return SV(200, 130, K.P(K.rect(30, 20, 110, 96)) + `<rect x="34" y="24" width="102" height="88" class="k2" opacity=".6"/>` + K.P(K.line(45, 45, 125, 45) + K.line(45, 65, 125, 65) + K.line(45, 85, 105, 85), { w: 1.6 }) + K.P(K.circ(130, 70, 24) + K.line(147, 87, 175, 115), { w: 3 }) + `<rect x="110" y="58" width="36" height="16" class="k" opacity=".5"/>`, 'Une loupe sur un bon de commande'); },
  ana: () => { const K = Sketch(102); return SV(200, 130, K.P(K.line(100, 20, 100, 70) + K.line(30, 70, 170, 70) + K.line(30, 70, 15, 100) + K.line(30, 70, 45, 100) + K.line(170, 70, 155, 100) + K.line(170, 70, 185, 100) + K.curve(x => 100 + (x - 30) ** 2 / 50 - 4.5, 15, 45) + K.curve(x => 100 + (x - 170) ** 2 / 50 - 4.5, 155, 185)) + `<rect x="14" y="74" width="32" height="20" class="k" opacity=".8"/><rect x="152" y="80" width="36" height="14" class="k2" opacity=".9"/>` + K.tx(100, 122, '?', 22), 'Une balance qui compare deux colis'); },
  rea: () => { const K = Sketch(103); let s = K.P(K.rect(30, 14, 80, 106)) + `<rect x="38" y="22" width="64" height="24" class="k2" opacity=".9"/>` + K.tx(70, 40, '67,43', 14); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s += K.P(K.rect(40 + c * 22, 56 + r * 20, 16, 14), { w: 1.4 }); s += `<rect x="124" y="50" width="62" height="32" rx="4" class="k" opacity=".85"/>` + K.P(K.rect(124, 50, 62, 32)) + K.tx(155, 71, '− 25 %', 13, { c: '#fff' }); return SV(200, 130, s, 'Une calculatrice et une étiquette'); },
  val: () => { const K = Sketch(104); return SV(200, 130, K.P(K.poly([[40, 14], [110, 14], [110, 110], [98, 118], [86, 110], [74, 118], [62, 110], [50, 118], [40, 110]], true)) + K.P(K.line(50, 34, 100, 34) + K.line(50, 50, 100, 50) + K.line(50, 66, 90, 66) + K.line(50, 86, 100, 86), { w: 1.4 }) + K.P(K.poly([[118, 70], [138, 92], [182, 40]], false), { w: 6, c: '#1E7F45' }), 'Un ticket vérifié avec une coche'); },
  com: () => { const K = Sketch(105); return SV(200, 130, `<rect x="18" y="16" width="110" height="52" rx="14" class="k2" opacity=".9"/>` + K.P(K.poly([[18, 16], [128, 16], [128, 68], [60, 68], [40, 86], [44, 68], [18, 68]], true)) + K.tx(73, 48, 'Vous économisez', 11) + `<rect x="82" y="64" width="102" height="46" rx="14" class="k" opacity=".85"/>` + K.P(K.poly([[82, 64], [184, 64], [184, 110], [160, 110], [170, 124], [140, 110], [82, 110]], true)) + K.tx(133, 92, '22,48 € !', 14, { c: '#fff' }), 'Deux bulles de dialogue entre un vendeur et un client'); }
};
module.exports = { SC, CP };
