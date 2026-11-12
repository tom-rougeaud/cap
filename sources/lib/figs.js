/* Figures du cours au standard 2026-11 (voir STANDARD.md) : pleine largeur, aucun texte sous 8 pt (ici 12 unités au minimum
   pour une vue de 700 unités imprimée sur 170 mm), quadrillage fin et principal, axes nommés avec unité, deux couleurs
   distinguables par les daltoniens (vert, violet) toujours doublées d’un trait plein / pointillé ou d’une étiquette. */
'use strict';
const G = '#2E7D46', V = '#7A4FB3', INK = '#1F2A44', MUT = '#4F5870', GRID = '#B9C2D0', MIN = '#E1E6EE', HL = '#FFF3B0', SOFT = '#EEF6E3';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const fr = (x, d) => (d == null ? String(x) : x.toFixed(d)).replace('.', ',');
const FSMIN = 12;
const T = (x, y, s, o = {}) => { const fs = o.fs || 13; if (fs < FSMIN) throw new Error('figure : texte sous 8 pt : ' + s); return `<text x="${x}" y="${y}" font-size="${fs}" font-weight="${o.w || 600}" fill="${o.f || INK}" text-anchor="${o.a || 'start'}">${esc(s)}</text>`; };
const svg = (w, h, body, lab) => `<svg viewBox="0 0 ${w} ${h}" class="pic vis fig26" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(lab)}" font-family="Nunito Sans">${body}</svg>`;
const arc = (x1, x2, y, up, col, lab) => { const d = up ? -1 : 1, yc = y + d * 26; return `<path d="M${x1} ${y} C${x1 + 18} ${yc},${x2 - 18} ${yc},${x2 - 3} ${y + d * 2}" fill="none" stroke="${col}" stroke-width="2.5"/><path d="M${x2 - 1} ${y - d} l-11 ${d * 6} l9 ${d * 8}z" fill="${col}" transform="rotate(${up ? 0 : 0} ${x2} ${y})"/>` + T((x1 + x2) / 2, y + d * 26 + (up ? -2 : 14), lab, { fs: 15, w: 800, f: col, a: 'middle' }); };
/* tableau à deux lignes : cols = [[haut, bas, {hl, c}]] ; renvoie le dessin et l’abscisse du milieu de chaque colonne */
function table(x, y, labs, cols, o = {}) {
  const lw = o.lw || 170, cw = o.cw || 88, rh = o.rh || 46, W = lw + cw * cols.length;
  let s = `<rect x="${x}" y="${y}" width="${W}" height="${rh * 2}" rx="9" fill="#fff"/><rect x="${x}" y="${y}" width="${lw}" height="${rh * 2}" rx="9" fill="${SOFT}"/>`;
  cols.forEach((c, i) => { if (c[2] && c[2].hl) s += `<rect x="${x + lw + i * cw}" y="${y}" width="${cw}" height="${rh * 2}" fill="${HL}"/>`; });
  s += `<rect x="${x}" y="${y}" width="${W}" height="${rh * 2}" rx="9" fill="none" stroke="${INK}" stroke-width="1.5"/><line x1="${x}" y1="${y + rh}" x2="${x + W}" y2="${y + rh}" stroke="${INK}" stroke-width="1.5"/>`;
  s += T(x + 12, y + rh / 2 + 5, labs[0], { fs: 13.5, w: 700 }) + T(x + 12, y + rh * 1.5 + 5, labs[1], { fs: 13.5, w: 700 });
  const mid = [];
  cols.forEach((c, i) => { const cx = x + lw + i * cw + cw / 2; mid.push(cx);
    s += `<line x1="${x + lw + i * cw}" y1="${y}" x2="${x + lw + i * cw}" y2="${y + rh * 2}" stroke="${INK}" stroke-width="1.5"/>`;
    s += T(cx, y + rh / 2 + 6, c[0], { fs: 18, w: 800, a: 'middle' }) + T(cx, y + rh * 1.5 + 6, c[1], { fs: 18, w: 800, a: 'middle', f: (c[2] && c[2].c) || INK }); });
  return { s, mid, top: y, bot: y + rh * 2, right: x + W };
}
const pill = (x, y, w, txt, col) => `<rect x="${x}" y="${y}" width="${w}" height="30" rx="15" fill="${col}"/>` + T(x + w / 2, y + 20, txt, { fs: 13.5, w: 800, f: '#fff', a: 'middle' });

/* ---------- chapitre 3 · proportionnalité ---------- */
const c3 = {
  /* notion 1 : deux tableaux, les quotients sous chaque colonne, la conclusion */
  quotients() {
    const a = table(14, 40, ['Places', 'Prix (en €)'], [['2', '18'], ['3', '27'], ['5', '45']], { lw: 104, cw: 72 });
    const b = table(366, 40, ['Distance (en m)', 'Temps (en s)'], [['50', '5,47'], ['100', '9,58']], { lw: 132, cw: 96 });
    let s = T(14, 26, 'Places de cinéma', { fs: 14, w: 800 }) + a.s + T(366, 26, 'Usain Bolt, 100 m, Berlin 2009', { fs: 14, w: 800 }) + b.s;
    [['18 ÷ 2', '= 9'], ['27 ÷ 3', '= 9'], ['45 ÷ 5', '= 9']].forEach((q, i) => { s += T(a.mid[i], a.bot + 22, q[0], { fs: 13, a: 'middle' }) + T(a.mid[i], a.bot + 40, q[1], { fs: 15, w: 800, a: 'middle', f: G }); });
    [['5,47 ÷ 50', '≈ 0,109'], ['9,58 ÷ 100', '≈ 0,096']].forEach((q, i) => { s += T(b.mid[i], b.bot + 22, q[0], { fs: 13, a: 'middle' }) + T(b.mid[i], b.bot + 40, q[1], { fs: 15, w: 800, a: 'middle', f: V }); });
    s += pill(14, a.bot + 54, 320, 'Quotients tous égaux : proportionnel', G) + pill(366, b.bot + 54, 324, 'Quotients différents : pas proportionnel', V);
    s += `<line x1="350" y1="14" x2="350" y2="${a.bot + 84}" stroke="${GRID}" stroke-width="1.5" stroke-dasharray="4 5"/>`;
    return svg(700, a.bot + 92, s, 'À gauche, les trois quotients prix ÷ places valent 9 : proportionnel. À droite, les quotients temps ÷ distance valent 0,109 et 0,096 : pas proportionnel.');
  },
  /* notion 2 : le coefficient, et le contrôle par « deux fois plus » */
  coefficient() {
    const t = table(14, 56, ['Nombre de personnes', 'Nouilles (en g)'], [['2', '160', { hl: 1 }], ['4', '320', { c: G }], ['5', '400', { c: G }], ['8', '640', { c: G }]], { lw: 186, cw: 92 });
    let s = t.s + arc(t.mid[0], t.mid[1], t.top - 8, true, G, '× 2') + arc(t.mid[0], t.mid[1], t.bot + 8, false, G, '× 2');
    const xr = t.right + 14;
    s += `<path d="M${xr} ${t.top + 16} C${xr + 36} ${t.top + 30},${xr + 36} ${t.bot - 30},${xr + 4} ${t.bot - 16}" fill="none" stroke="${V}" stroke-width="2.5"/><path d="M${xr + 2} ${t.bot - 15} l11 -9 l1 12z" fill="${V}"/>`;
    s += T(xr + 36, t.top + 44, '× 80', { fs: 20, w: 800, f: V }) + T(xr + 36, t.top + 62, 'coefficient :', { fs: 12.5, f: MUT }) + T(xr + 36, t.top + 78, '160 ÷ 2 = 80', { fs: 12.5, f: MUT });
    s += T(14, t.bot + 62, 'La colonne connue est surlignée. Deux chemins donnent 320 g : 4 × 80 (avec le coefficient)', { fs: 12.5, f: MUT }) + T(14, t.bot + 79, 'ou 2 × 160 (deux fois plus de personnes).', { fs: 12.5, f: MUT });
    return svg(700, t.bot + 88, s, 'Tableau des quantités de nouilles pour 2, 4, 5 et 8 personnes : on multiplie le nombre de personnes par le coefficient 80 ; 4 personnes, c’est aussi deux fois 2 personnes.');
  },
  /* notion 3 : passage par l’unité, puis produit en croix */
  quatrieme() {
    const t = table(14, 62, ['Places', 'Prix (en €)'], [['3', '22,50', { hl: 1 }], ['1', '7,50', { c: G }], ['8', '60', { c: G }]], { lw: 112, cw: 86 });
    let s = T(14, 22, 'Passage par l’unité', { fs: 14, w: 800 }) + t.s;
    s += arc(t.mid[0], t.mid[1], t.top - 8, true, G, '÷ 3') + arc(t.mid[1], t.mid[2], t.top - 8, true, G, '× 8') + arc(t.mid[0], t.mid[1], t.bot + 8, false, G, '÷ 3') + arc(t.mid[1], t.mid[2], t.bot + 8, false, G, '× 8');
    const p = table(424, 62, ['Places', 'Prix (en €)'], [['3', '22,50'], ['8', '?', { c: V }]], { lw: 112, cw: 80 });
    s += T(424, 22, 'Produit en croix', { fs: 14, w: 800 }) + p.s;
    s += `<line x1="${p.mid[0] + 22}" y1="${p.bot - 30}" x2="${p.mid[1] - 22}" y2="${p.top + 30}" stroke="${V}" stroke-width="2.5"/><line x1="${p.mid[0] + 14}" y1="${p.top + 32}" x2="${p.mid[1] - 14}" y2="${p.bot - 32}" stroke="${V}" stroke-width="2.5" stroke-dasharray="6 5"/>`;
    s += T(424, p.bot + 28, 'Je multiplie en diagonale (trait plein),', { fs: 12.5, f: MUT }) + T(424, p.bot + 45, 'je divise par le troisième nombre :', { fs: 12.5, f: MUT }) + T(424, p.bot + 68, '8 × 22,50 ÷ 3 = 60 €', { fs: 16, w: 800, f: V });
    s += `<line x1="404" y1="10" x2="404" y2="${p.bot + 76}" stroke="${GRID}" stroke-width="1.5" stroke-dasharray="4 5"/>`;
    return svg(700, p.bot + 82, s, 'À gauche, le passage par l’unité : 3 places coûtent 22,50 €, donc 1 place 7,50 € et 8 places 60 €. À droite, le produit en croix : 8 × 22,50 ÷ 3 = 60 €.');
  },
  /* notion 4 : durée de chaque tranche de 10 m, avec quadrillage */
  tranches(dur) {
    const W = 700, H = 292, L = 64, R = 156, TP = 30, B = 54, bw = (W - L - R) / 10, sy = v => H - B - v / 2 * (H - TP - B);
    let s = '';
    for (let k = 0; k <= 20; k++) s += `<line x1="${L}" y1="${sy(k / 10)}" x2="${W - R}" y2="${sy(k / 10)}" stroke="${MIN}"/>`;
    for (let i = 0; i <= 10; i++) s += `<line x1="${L + i * bw}" y1="${TP}" x2="${L + i * bw}" y2="${H - B}" stroke="${MIN}"/>`;
    [0, 0.5, 1, 1.5, 2].forEach(v => { s += `<line x1="${L}" y1="${sy(v)}" x2="${W - R}" y2="${sy(v)}" stroke="${GRID}"/>` + T(L - 9, sy(v) + 4.5, fr(v, 1), { fs: 13, f: MUT, a: 'end' }); });
    dur.forEach((v, i) => { const x = L + i * bw + 5, w = bw - 10;
      s += `<path d="M${x} ${sy(0)} V${sy(v) + 4} q0 -4 4 -4 H${x + w - 4} q4 0 4 4 V${sy(0)}z" fill="${i === 0 ? V : G}"/>` + T(x + w / 2, sy(v) + 19, fr(v, 2), { fs: 12.5, w: 800, f: '#fff', a: 'middle' }) + T(x + w / 2, H - B + 18, `${i * 10}–${i * 10 + 10}`, { fs: 12, f: MUT, a: 'middle' }); });
    s += `<line x1="${L}" y1="${sy(0)}" x2="${W - R}" y2="${sy(0)}" stroke="${INK}" stroke-width="1.8"/><line x1="${L}" y1="${sy(.958)}" x2="${W - R + 6}" y2="${sy(.958)}" stroke="${INK}" stroke-width="2" stroke-dasharray="8 5"/>`;
    s += T(W - R + 12, sy(.958) - 4, '0,958 s', { fs: 15, w: 800 }) + T(W - R + 12, sy(.958) + 13, 'par tranche, si la', { fs: 12, f: MUT }) + T(W - R + 12, sy(.958) + 28, 'vitesse était constante', { fs: 12, f: MUT });
    s += T(L - 50, TP - 10, 'Durée de la tranche (en s)', { fs: 13, w: 700 }) + T((L + W - R) / 2, H - 10, 'Tranche de 10 m (en m)', { fs: 13, w: 700, a: 'middle' }) + T(L + bw + 12, sy(1.6), 'Départ : la tranche la plus lente', { fs: 12.5, w: 700 });
    return svg(W, H, s, 'Dix barres : durée de chaque tranche de 10 m de Bolt, de 1,89 s au départ à 0,81 s, comparée à la ligne de 0,958 s qui correspondrait à une vitesse constante.');
  }
};

/* diagramme en barres au standard : quadrillage fin et principal, valeurs dans les barres, ligne de repère en pointillés */
function barChart(o) {
  const W = 700, H = o.h || 300, L = 64, R = o.ref ? 156 : 20, TP = 30, B = 54, n = o.vals.length, bw = (W - L - R) / n, sy = v => H - B - v / o.ymax * (H - TP - B);
  let s = '';
  for (let v = 0; v <= o.ymax + 1e-9; v += o.minor) s += `<line x1="${L}" y1="${sy(v)}" x2="${W - R}" y2="${sy(v)}" stroke="${MIN}"/>`;
  for (let i = 0; i <= n; i++) s += `<line x1="${L + i * bw}" y1="${TP}" x2="${L + i * bw}" y2="${H - B}" stroke="${MIN}"/>`;
  for (let v = 0; v <= o.ymax + 1e-9; v += o.major) s += `<line x1="${L}" y1="${sy(v)}" x2="${W - R}" y2="${sy(v)}" stroke="${GRID}"/>` + T(L - 9, sy(v) + 4.5, fr(v, o.ydec || 0), { fs: 13, f: MUT, a: 'end' });
  o.vals.forEach((v, i) => { const x = L + i * bw + 4, w = bw - 8, hi = (o.hi || []).includes(i);
    s += `<path d="M${x} ${sy(0)} V${sy(v) + 4} q0 -4 4 -4 H${x + w - 4} q4 0 4 4 V${sy(0)}z" fill="${hi ? V : G}"/>` + T(x + w / 2, sy(v) + 18, fr(v, o.dec), { fs: 12, w: 800, f: '#fff', a: 'middle' }) + T(x + w / 2, H - B + 18, o.labs[i], { fs: 12, f: MUT, a: 'middle' }); });
  s += `<line x1="${L}" y1="${sy(0)}" x2="${W - R}" y2="${sy(0)}" stroke="${INK}" stroke-width="1.8"/>`;
  if (o.ref) { s += `<line x1="${L}" y1="${sy(o.ref.v)}" x2="${W - R + 6}" y2="${sy(o.ref.v)}" stroke="${INK}" stroke-width="2" stroke-dasharray="8 5"/>` + T(W - R + 12, sy(o.ref.v) - 4, o.ref.t, { fs: 15, w: 800 }) + o.ref.sub.map((x, k) => T(W - R + 12, sy(o.ref.v) + 13 + 15 * k, x, { fs: 12, f: MUT })).join(''); }
  s += T(L - 50, TP - 10, o.yl, { fs: 13, w: 700 }) + T((L + W - R) / 2, H - 10, o.xl, { fs: 13, w: 700, a: 'middle' });
  if (o.note) s += T(o.note.x, sy(o.note.y), o.note.t, { fs: 12.5, w: 700 });
  return svg(W, H, s, o.alt);
}
const c1 = {
  /* notion 4 : les entrées de chaque mois et la ligne de la moyenne */
  mois(vals) { return barChart({ vals, labs: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'], dec: 2, ymax: 22, minor: 1, major: 5, hi: [11], yl: 'Entrées (en millions)', xl: 'Mois de l’année 2025',
    ref: { v: 13.055, t: '13,055', sub: ['millions par mois :', 'la moyenne'] }, alt: 'Douze barres : les entrées au cinéma de chaque mois de 2025, de 9,46 millions en septembre à 20,73 millions en décembre, et la ligne de la moyenne à 13,055 millions.' }); }
};

const c2 = {
  /* notion 2 : la fréquence de « 20 » se rapproche de la probabilité 0,05 quand le nombre de lancers augmente */
  stabilisation() {
    const N = ['10', '50', '200', '1 000', '5 000'], F = [.2, .12, .07, .052, .0502], lab = ['0,2', '0,12', '0,07', '0,052', '0,0502'];
    const W = 700, H = 300, L = 70, R = 150, TP = 34, B = 56, sx = i => L + 40 + i * (W - L - R - 80) / 4, sy = v => H - B - v / .25 * (H - TP - B);
    let s = '';
    for (let k = 0; k <= 25; k++) s += `<line x1="${L}" y1="${sy(k / 100)}" x2="${W - R}" y2="${sy(k / 100)}" stroke="${MIN}"/>`;
    N.forEach((_, i) => { s += `<line x1="${sx(i)}" y1="${TP}" x2="${sx(i)}" y2="${H - B}" stroke="${MIN}"/>` + T(sx(i), H - B + 19, N[i], { fs: 13, f: MUT, a: 'middle' }); });
    [0, .05, .1, .15, .2, .25].forEach(v => { s += `<line x1="${L}" y1="${sy(v)}" x2="${W - R}" y2="${sy(v)}" stroke="${GRID}"/>` + T(L - 9, sy(v) + 4.5, fr(v, 2), { fs: 13, f: MUT, a: 'end' }); });
    s += `<line x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}" stroke="${INK}" stroke-width="1.8"/><line x1="${L}" y1="${TP}" x2="${L}" y2="${H - B}" stroke="${INK}" stroke-width="1.8"/>`;
    s += `<line x1="${L}" y1="${sy(.05)}" x2="${W - R + 6}" y2="${sy(.05)}" stroke="${V}" stroke-width="2.5" stroke-dasharray="9 6"/>` + T(W - R + 12, sy(.05) - 4, '0,05', { fs: 15, w: 800 }) + T(W - R + 12, sy(.05) + 13, 'la probabilité', { fs: 12, f: MUT }) + T(W - R + 12, sy(.05) + 28, 'd’obtenir « 20 »', { fs: 12, f: MUT });
    s += `<polyline points="${F.map((v, i) => `${sx(i)},${sy(v)}`).join(' ')}" fill="none" stroke="${G}" stroke-width="2.5"/>`;
    F.forEach((v, i) => { s += `<circle cx="${sx(i)}" cy="${sy(v)}" r="5" fill="${G}" stroke="#fff" stroke-width="2"/>` + T(sx(i) + 9, sy(v) - 9, lab[i], { fs: 13, w: 800 }); });
    s += T(L - 56, TP - 12, 'Fréquence de « 20 »', { fs: 13, w: 700 }) + T((L + W - R) / 2, H - 10, 'Nombre de lancers', { fs: 13, w: 700, a: 'middle' });
    return svg(W, H, s, 'La fréquence de « 20 » vaut 0,2 pour 10 lancers, puis 0,12, 0,07, 0,052 et 0,0502 pour 5 000 lancers : elle se rapproche de la probabilité 0,05.');
  }
};
module.exports = { c2, c1, barChart, c3, table, arc, pill, T, svg, G, V, INK, MUT, GRID, MIN };
