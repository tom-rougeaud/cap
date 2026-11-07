/* Couverture « Maths · 3ème Prépa-Métiers » : page jaune (#FFEC73), motifs dessinés à main levée, peu opaques,
   qui évoquent la pop culture et les 10 chapitres de 3e (cartes, dé, clap de cinéma, bulle, écran, figurine…). Jamais de personnage ni de logo.
   Titre, nom de l’auteur en bas, QR code vers l’appli. viewBox 840 × 1188 (1 unité = 0,25 mm). */
'use strict';
const YEL = '#E9F797', W = '#FFFFFF', MOT = '#5A4700';
/* tirage reproductible pour le tremblé du trait */
function rng(seed) { let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let R = rng(7);
const j = (k = 1) => (R() - .5) * 2 * k;
const f1 = n => n.toFixed(1);
/* trait à main levée : deux passages légèrement décalés */
function line(x1, y1, x2, y2, k = 2.2) {
  let s = '';
  for (let p = 0; p < 2; p++) { const mx = (x1 + x2) / 2 + j(k * 1.6), my = (y1 + y2) / 2 + j(k * 1.6); s += `M${f1(x1 + j(k))} ${f1(y1 + j(k))}Q${f1(mx)} ${f1(my)} ${f1(x2 + j(k))} ${f1(y2 + j(k))}`; }
  return s;
}
const poly = (pts, closed = false, k) => { let s = ''; const P = closed ? [...pts, pts[0]] : pts; for (let i = 0; i < P.length - 1; i++) s += line(P[i][0], P[i][1], P[i + 1][0], P[i + 1][1], k); return s; };
const rect = (x, y, w, h, k) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true, k);
function circle(cx, cy, r, k = 1.6) {
  let s = ''; for (let p = 0; p < 2; p++) { const n = 26, a0 = R() * 6.28; let d = '';
    for (let i = 0; i <= n + 2; i++) { const a = a0 + i / n * 6.283, rr = r + j(k); d += (i ? 'L' : 'M') + f1(cx + rr * Math.cos(a)) + ' ' + f1(cy + rr * Math.sin(a)); } s += d; }
  return s;
}
const curve = (fn, x1, x2, n = 30) => { let d = ''; for (let i = 0; i <= n; i++) { const x = x1 + (x2 - x1) * i / n, y = fn(x) + j(.8); d += (i ? 'L' : 'M') + f1(x) + ' ' + f1(y); } return d; };
const P = (d, o = {}) => `<path d="${d}" fill="none" stroke="${o.c || MOT}" stroke-width="${o.w || 4}" stroke-linecap="round" stroke-linejoin="round"/>`;
const TX = (x, y, s, fs, o = {}) => `<text x="${x}" y="${y}" font-family="Nunito Sans" font-size="${fs}" font-weight="700" fill="${o.c || MOT}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.r ? ` transform="rotate(${o.r} ${x} ${y})"` : ''}>${s}</text>`;
const G = (x, y, rot, sc, op, body) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})" opacity="${op}">${body}</g>`;

/* ---------- les motifs (dessinés autour de (0,0), environ 200 × 160) ---------- */
const M = {
  // 1 · prix, marges, TVA : étiquette − 30 % et × 1,2
  tag: () => P(poly([[-90, 0], [-50, -50], [100, -50], [100, 50], [-50, 50]], true) + circle(-50, 0, 10)) + TX(30, 18, '−30 %', 46, { a: 'middle' }) + P(line(-70, 60, -110, 110), { w: 3 }),
  coef: () => TX(0, 0, '× 1,2', 70, { a: 'middle' }) + P(line(-80, 22, 80, 18) + line(60, 8, 82, 18) + line(60, 30, 82, 18), { w: 3.5 }),
  // 2 · statistique : diagramme en barres et boîte à moustaches
  bars: () => P(line(-100, 70, 100, 70) + line(-100, 70, -100, -80) + [[-80, 30], [-40, -10], [0, 10], [40, -50]].map(([x, h]) => rect(x, h, 28, 70 - h)).join('') + curve(x => -40 - (x + 66) * .35, -66, 54)),
  box: () => P(line(-110, 0, -60, 0) + rect(-60, -30, 110, 60) + line(-10, -30, -10, 30) + line(50, 0, 120, 0) + line(-110, -14, -110, 14) + line(120, -14, 120, 14)),
  // 3 · premier degré : balance
  balance: () => P(line(0, -80, 0, 70) + line(-60, 70, 60, 70) + line(-100, -60, 100, -60) + line(-100, -60, -125, 0) + line(-100, -60, -75, 0) + line(100, -60, 75, 0) + line(100, -60, 125, 0) + curve(x => 0 + (x + 100) ** 2 / 200 - 12.5, -125, -75) + curve(x => (x - 100) ** 2 / 200 - 12.5, 75, 125)) + TX(-100, -12, 'x', 40, { a: 'middle' }) + TX(100, -12, '7', 40, { a: 'middle' }),
  // 4 · factures : ticket de caisse et pièces
  ticket: () => P(poly([[-60, -90], [60, -90], [60, 80], [45, 95], [30, 80], [15, 95], [0, 80], [-15, 95], [-30, 80], [-45, 95], [-60, 80]], true) + [-60, -40, -20, 0].map(y => line(-42, y, 42, y)).join('') + line(-42, 35, 42, 35, 1)) + TX(0, 66, 'TOTAL', 22, { a: 'middle' }),
  coins: () => P(circle(-30, 0, 34) + circle(-30, 0, 22) + circle(35, 15, 30)) + TX(-30, 12, '€', 34, { a: 'middle' }),
  // 5 · fonctions : axes, droite et parabole
  graph: () => P(line(-110, 80, 110, 80) + line(-90, 100, -90, -90) + line(100, 70, 110, 80) + line(100, 90, 110, 80) + line(-100, -80, -90, -90) + line(-80, -80, -90, -90) + line(-90, 50, 100, -60) + curve(x => 70 - (x + 10) ** 2 / 60, -75, 55)),
  // 6 · probabilités : dé et arbre
  die: () => P(poly([[-50, -20], [10, -50], [70, -25], [10, 5]], true) + poly([[-50, -20], [-50, 50], [10, 80], [10, 5]]) + poly([[10, 80], [70, 50], [70, -25]]) + circle(10, -22, 5, .8) + circle(-30, 15, 5, .8) + circle(-10, 45, 5, .8) + circle(40, 30, 5, .8)),
  tree: () => P(circle(-100, 0, 6, .8) + line(-94, 0, -20, -55) + line(-94, 0, -20, 55) + [[-20, -55], [-20, 55]].map(([x, y]) => line(x + 8, y, 90, y - 28) + line(x + 8, y, 90, y + 4) + line(x + 8, y, 90, y + 34)).join('')) + TX(-60, -40, '½', 30, { a: 'middle' }),
  // 7 · géométrie : cube et triangle rectangle
  cube: () => P(rect(-70, -30, 100, 100) + poly([[-70, -30], [-30, -70], [70, -70], [30, -30]]) + poly([[70, -70], [70, 30], [30, 70]])),
  tri: () => P(curve(x => -50 + x * x / 120, -90, 90) + line(-100, 90, 100, 90) + line(-90, 100, -90, -80) + line(-60, 60, 70, -20, 2.5)) + TX(10, 125, 'f ′(a)', 34, { a: 'middle' }),
  // 8 · croisement : tableau croisé
  table: () => P([-90, -45, 0, 45, 90].map(x => line(x, -70, x, 70)).join('') + [-70, -35, 0, 35, 70].map(y => line(-90, y, 90, y)).join('') + line(-90, -70, -45, -35)) + TX(22, 24, '✓', 30, { a: 'middle' }) + TX(68, 60, 'N', 30, { a: 'middle' }),
  // petits signes
  bag: () => P(poly([[-50, -20], [50, -20], [60, 70], [-60, 70]], true) + curve(x => -20 - Math.sqrt(Math.max(0, 900 - x * x)) * 1.2, -30, 30)),
  cart: () => P(poly([[-90, -50], [-60, -50], [-40, 30], [60, 30], [75, -25], [-50, -25]]) + circle(-30, 55, 12) + circle(50, 55, 12)),
  expo: () => P(line(-90, 70, 90, 70) + line(-90, 70, -90, -80)) + P(curve(x => 60 - 9 * Math.pow(1.5, (x + 90) / 30), -90, 90), { w: 5 }),
  cubic: () => P(line(-90, 0, 90, 0) + line(0, -80, 0, 80)) + P(curve(x => -((x / 40) ** 3 - 3 * (x / 40)) * 22, -85, 85), { w: 5 }),
  nuage: () => P(line(-90, 70, 90, 70) + line(-90, 70, -90, -80)) + [[-70, 50], [-50, 38], [-30, 30], [-10, 8], [10, 0], [30, -20], [50, -30], [70, -55]].map(([x, y]) => P(circle(x, y, 6, .8), { w: 3.4 })).join('') + P(line(-80, 60, 80, -55, 1), { w: 2.6 }),
  log: () => TX(0, 0, 'log', 70, { a: 'middle' }),
  qn: () => TX(0, 0, 'q<tspan font-size="50" dy="-30">n</tspan>', 90, { a: 'middle' }),
  pct: () => TX(0, 0, '%', 90, { a: 'middle' }),
  sigma: () => TX(0, 0, 'Σ', 110, { a: 'middle' }),
  pi: () => TX(0, 0, 'π', 80, { a: 'middle' }),
  card: () => P(rect(-55, -80, 110, 160) + rect(-42, -64, 84, 70) + line(-40, 26, 40, 26) + line(-40, 44, 30, 44) + circle(32, -76, 10)),
  d20: () => P(poly([[0, -90], [78, -45], [78, 45], [0, 90], [-78, 45], [-78, -45]], true) + poly([[0, -50], [44, 28], [-44, 28]], true) + line(0, -90, 0, -50) + line(78, 45, 44, 28) + line(-78, 45, -44, 28)) + TX(0, 16, '20', 34, { a: 'middle' }),
  clap: () => P(rect(-80, -20, 160, 100) + poly([[-80, -20], [-70, -70], [85, -70], [80, -20]]) + line(-40, -70, -55, -20) + line(10, -70, -5, -20) + line(60, -70, 45, -20)),
  bulle: () => P(poly([[-90, -60], [90, -60], [90, 40], [-10, 40], [-50, 80], [-40, 40], [-90, 40]], true)) + TX(0, 8, '!', 70, { a: 'middle' }),
  ecran: () => P(rect(-100, -60, 200, 112) + line(-30, 74, 30, 74) + line(0, 52, 0, 74) + poly([[-18, -24], [-18, 18], [22, -3]], true)) + TX(70, -70, '16:9', 30, { a: 'middle' }),
  pixel: () => [[-2, -1], [-1, -2], [1, -2], [2, -1], [-3, 0], [-2, 0], [-1, 0], [0, -1], [1, 0], [2, 0], [3, 0], [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1], [-1, 2], [0, 2], [1, 2], [0, 3]].map(([x, y]) => P(rect(x * 22 - 10, y * 22 - 10, 20, 20, 1), { w: 3 })).join(''),
  figurine: () => P(rect(-20, -90, 40, 40) + rect(-30, -46, 60, 70) + line(-14, 24, -18, 90) + line(14, 24, 18, 90) + line(-60, 96, 60, 96)) + TX(80, -40, '1/144', 30, { a: 'middle' }),
  facto: () => TX(0, 0, '2³ × 5', 64, { a: 'middle' }),
  sqrt: () => TX(0, 0, '√49', 70, { a: 'middle' }),
  star: () => P(line(-20, 0, 20, 0) + line(0, -20, 0, 20) + line(-12, -12, 12, 12, 1) + line(-12, 12, 12, -12, 1), { w: 3 })
};

/* version « spécimen enseignant » : fond rouge brique sombre, bandeau discret, pastille aux couleurs du niveau */
const PR = { bg: '#9B2335', ink: '#3B0F18', cream: '#FFF1DC', rose: '#F6CFC6' };
function profLayer(book) { return ''; }

function cover(o = {}) {
  R = rng(7);
  const qr = o.qr || '';
  const NAVY = o.prof ? PR.ink : '#1D2240';
  let s = `<svg viewBox="0 0 840 1188" xmlns="http://www.w3.org/2000/svg" class="cvsvg"><rect width="840" height="1188" fill="${o.prof ? PR.bg : '#E9F797'}"/>`;
  // motifs : [nom, x, y, rotation, échelle, opacité]
  const L = [['card', 140, 160, -8, .95, .24], ['ecran', 640, 150, 5, .95, .22], ['facto', 400, 120, -4, .7, .18], ['star', 290, 50, 0, 1, .3],
    ['d20', 130, 360, 6, .85, .22], ['clap', 720, 370, -6, .9, .22], ['sqrt', 330, 320, -6, .7, .16], ['pct', 560, 300, 10, .8, .16],
    ['bulle', 120, 830, 6, .85, .22], ['figurine', 720, 830, -4, .95, .22], ['pixel', 330, 880, 0, .8, .2], ['tree', 500, 960, 6, .75, .18],
    ['bars', 200, 1000, -3, .7, .16], ['star', 760, 270, 0, .8, .3], ['star', 60, 560, 0, .7, .26], ['star', 560, 800, 0, .9, .24]];
  L.forEach(([k, x, y, r, sc, op]) => { s += G(x, y, r, sc, op, M[k]()); });
  if (o.prof && typeof MOT !== 'undefined') s = s.split(MOT).join(PR.rose);
  // titre
  s += `<g font-family="Nunito Sans">`;
  s += `<rect x="70" y="420" width="700" height="300" rx="40" fill="${NAVY}" opacity=".92"/>`;
  s += `<text x="110" y="492" style="font-family:'Outfit',sans-serif;font-style:italic" font-size="24" font-weight="800" fill="${YEL}" letter-spacing="3" textLength="660" lengthAdjust="spacingAndGlyphs">MATHÉMATIQUES · CLASSES PRÉPARANT AU CAP</text>`;
  s += `<text x="106" y="612" style="font-family:'Outfit',sans-serif;font-style:italic" font-size="124" font-weight="800" fill="${W}" letter-spacing="-2">CAP Maths</text>`;
  s += `</g>` + `<path d="${line(110, 628, 470, 622, 2.5)}" fill="none" stroke="${YEL}" stroke-width="9" stroke-linecap="round"/>`;
  s += `<g font-family="Nunito Sans"><text x="110" y="690" font-size="36" font-weight="700" fill="${W}">Programme officiel 2019</text></g>`;
  // bas de page : auteur et QR code
  s += `<rect x="0" y="1040" width="840" height="148" fill="${NAVY}" opacity=".9"/>`;
  s += `<rect x="70" y="748" width="${o.prof ? 330 : 290}" height="52" rx="26" fill="${o.prof ? '#E9F797' : NAVY}"/><text x="${o.prof ? 235 : 215}" y="783" font-family="Nunito Sans" font-size="24" font-weight="800" fill="${o.prof ? '#1D2240' : W}" text-anchor="middle">${o.prof ? 'Spécimen enseignant' : 'Manuel de l’élève'}</text>`;
  s += `<text x="70" y="1124" font-family="Nunito Sans" font-size="22" font-weight="700" fill="#E9F797">Tom Rougeaud</text>`;
  if (qr) { const Q = 214, bx = 840 - 56 - (Q + 28); s += `<rect x="${bx}" y="880" width="${Q + 28}" height="${Q + 78}" rx="22" fill="${W}"/><g transform="translate(${bx + 14} 894) scale(${(Q / +qr.vb.split(' ')[2]).toFixed(4)})">${qr.body}</g><text x="${bx + (Q + 28) / 2}" y="${894 + Q + 38}" font-family="Nunito Sans" font-size="23" font-weight="800" fill="#1D2240" text-anchor="middle">Ouvrir l’appli</text>`; }
  if (o.prof) s += profLayer('#E9F797');
  return s + '</svg>';
}
module.exports = { cover, M };
