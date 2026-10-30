/* CAP Maths — scènes d’ouverture (une par chapitre) : objets de pop culture au trait, jamais de personnage ni de logo.
   viewBox 600 × 230. Et les 5 compétences du CAP, illustrées par un geste. */
'use strict';
const { Sketch, esc } = require('./visu');
const SV = (w, h, body, lab) => `<svg viewBox="0 0 ${w} ${h}" class="pic scene" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(lab)}">${body}</svg>`;
const tint = (x, y, w, h, op = .9, rx = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="k2" opacity="${op}"/>`;
const acc = (x, y, w, h, op = .85, rx = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="k" opacity="${op}"/>`;
const SC = {};

const CNC = [13.83, 14.30, 12.72, 11.83, 11.23, 11.37, 14.29, 9.94, 9.46, 12.84, 14.12, 20.73];
/* 1 · statistique : les entrées en salle en France, mois par mois (CNC, 2025), un billet de cinéma, un seau de pop-corn */
SC.c1 = () => { const K = Sketch(511); let s = K.P(K.line(30, 205, 420, 205), { w: 2.6 });
  CNC.forEach((v, i) => { const h = Math.round(v * 7.2), x = 44 + i * 31; s += (i === 11 ? acc(x, 205 - h, 24, h, .9, 2) : tint(x, 205 - h, 24, h, .95, 2)) + K.P(K.rect(x, 205 - h, 24, h), { w: 1.4 }) + K.tx(x + 12, 222, 'JFMAMJJASOND'[i], 11); });
  s += K.tx(232, 22, 'Entrées en salle, France, 2025', 13) + K.tx(232, 38, 'chaque barre = un mois', 11);
  s += tint(452, 70, 120, 70, .5, 8) + K.P(K.rect(452, 70, 120, 70)) + K.P(K.line(500, 70, 500, 140), { w: 1.6, op: .7 }) + K.tx(476, 100, 'CINÉ', 13) + K.tx(476, 120, '1 place', 11) + K.tx(536, 112, '★', 22);
  s += tint(470, 150, 60, 54, .9, 3) + K.P(K.poly([[466, 150], [474, 204], [526, 204], [534, 150]], true)) + [0, 1, 2, 3].map(i => `<circle cx="${478 + i * 14}" cy="${146 - (i % 2) * 7}" r="9" class="wh ks" stroke-width="1.6"/>`).join('');
  return SV(600, 230, s, 'Un diagramme en barres des entrées au cinéma mois par mois, un billet de cinéma et un seau de pop-corn'); };
/* 2 · probabilités : deux dés, une grille de Loto (5 numéros parmi 49 et un numéro Chance) */
SC.c2 = () => { const K = Sketch(512); let s = K.P(K.line(30, 205, 570, 205), { w: 2.6 });
  const die = (x, y, n, hl) => { const pts = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]] }[n]; return (hl ? acc(x, y, 80, 80, .75, 12) : tint(x, y, 80, 80, .95, 12)) + K.P(K.rect(x, y, 80, 80), { w: 2.4 }) + pts.map(([a, b]) => `<circle cx="${x + 18 + a * 22}" cy="${y + 18 + b * 22}" r="7" fill="${hl ? '#fff' : '#2B2D7C'}"/>`).join(''); };
  s += die(40, 100, 3, false) + die(140, 76, 4, true) + K.tx(130, 40, '2 dés', 15) + K.tx(130, 62, '3 + 4 = 7', 13, { c: '#C2332A' });
  const picked = [4, 11, 19, 27, 38];
  for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) { const n = r * 7 + c + 1, on = picked.includes(n); s += (on ? acc(300 + c * 34, 36 + r * 24, 30, 20, .9, 3) : tint(300 + c * 34, 36 + r * 24, 30, 20, .9, 3)) + `<text x="${315 + c * 34}" y="${51 + r * 24}" font-family="Inter" font-size="10" font-weight="800" text-anchor="middle" fill="${on ? '#fff' : '#2B2D7C'}">${n}</text>`; }
  s += K.tx(420, 22, 'Loto : 5 numéros parmi 49', 13) + K.P(K.circ(572, 140, 16), { w: 2.4 }) + tint(556, 124, 32, 32, .7, 16) + K.tx(572, 146, '7', 14) + K.tx(572, 178, 'n° Chance', 10.5);
  return SV(600, 230, s, 'Deux dés et une grille de Loto avec cinq numéros cochés et un numéro Chance'); };
/* 3 · proportionnalité : la piste des 100 m, un chronomètre */
SC.c3 = () => { const K = Sketch(513); let s = '';
  for (let i = 0; i < 3; i++) s += K.P(K.line(30, 120 + i * 26, 570, 120 + i * 26), { w: 1.6, op: .6 });
  for (let m = 0; m <= 100; m += 10) { const x = 40 + m * 5.2; s += K.P(K.line(x, 104, x, 190), { w: m % 50 ? 1.2 : 2.4, op: m % 50 ? .45 : .9 }) + K.tx(x, 208, m + '', 11); }
  s += tint(40, 104, 10, 86, .9, 2) + acc(552, 104, 10, 86, .85, 2) + K.tx(40, 96, 'départ', 12) + K.tx(557, 96, 'arrivée', 12) + K.tx(300, 24, '100 mètres', 16);
  s += K.P(K.circ(300, 62, 26), { w: 2.8 }) + K.P(K.line(300, 62, 300, 46) + K.line(300, 62, 312, 66), { w: 2.4 }) + K.P(K.line(294, 32, 306, 32), { w: 3 }) + tint(268, 40, 64, 44, .35, 22) + K.tx(380, 70, '9,58 s', 20, { c: '#C2332A' }) + K.tx(380, 90, 'record du monde', 11);
  return SV(600, 230, s, 'Une piste de 100 mètres graduée de 10 en 10 et un chronomètre qui affiche 9,58 secondes'); };

/* les 5 compétences du CAP, illustrées par un geste */
const CP = {
  app: () => { const K = Sketch(601); return SV(200, 130, tint(28, 18, 112, 96, .6) + K.P(K.rect(28, 18, 112, 96)) + K.P(K.line(40, 40, 128, 40) + K.line(40, 60, 128, 60) + K.line(40, 80, 110, 80) + K.line(40, 100, 120, 100), { w: 1.4 }) + acc(104, 52, 40, 16, .5) + K.P(K.circ(128, 62, 24) + K.line(145, 79, 175, 112), { w: 3 }), 'Une loupe sur un document'); },
  ana: () => { const K = Sketch(602); return SV(200, 130, tint(14, 14, 80, 40, .9, 8) + K.tx(54, 40, 'Pourcentage ?', 11) + tint(14, 76, 80, 40, .9, 8) + K.tx(54, 102, 'Règle de 3 ?', 11) + K.P(K.line(98, 34, 122, 62) + K.line(98, 96, 122, 68), { w: 2.4 }) + acc(124, 42, 62, 44, .85, 10) + K.tx(155, 70, 'Je choisis', 12, { c: '#fff' }), 'Choisir une méthode parmi plusieurs'); },
  rea: () => { const K = Sketch(605); let s = K.P(K.rect(56, 10, 88, 112)) + tint(64, 18, 72, 24, .95) + K.tx(100, 36, '7,99 × 12', 12); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s += K.P(K.rect(66 + c * 24, 52 + r * 22, 18, 16), { w: 1.4 }); s += acc(66, 52, 18, 16, .6, 2); return SV(200, 130, s, 'Une calculatrice'); },
  val: () => { const K = Sketch(604); return SV(200, 130, tint(14, 16, 172, 30, .9, 6) + K.tx(100, 37, 'Résultat : 250 °C', 13) + tint(14, 56, 172, 30, .7, 6) + K.tx(100, 77, 'Possible pour un four ?', 12) + acc(14, 94, 172, 28, .85, 6) + K.tx(100, 113, 'Oui, c’est plausible ✓', 13, { c: '#fff' }), 'Contrôler qu’un résultat est vraisemblable'); },
  com: () => { const K = Sketch(606); return SV(200, 130, tint(14, 14, 122, 54, .9, 14) + K.P(K.poly([[14, 14], [136, 14], [136, 68], [64, 68], [44, 88], [48, 68], [14, 68]], true)) + K.tx(75, 46, 'Donc l’offre B…', 12) + acc(76, 72, 110, 44, .85, 14) + K.tx(131, 99, 'coûte 12 € de moins', 11, { c: '#fff' }), 'Deux bulles : une explication et sa conclusion'); }
};
require('./scenes_x')({ SC, Sketch, SV, tint, acc, esc });
module.exports = { SC, CP };
