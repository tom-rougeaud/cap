/* Version 3 — outils pour dessiner les méthodes visuelles (grandes, annotées) et les scènes au trait.
   Les couleurs suivent le chapitre (classes .k, .k2, .ks, .kt de la feuille de style). */
'use strict';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
/* ---------- méthodes visuelles ---------- */
const S = (w, h, body, lab = '') => `<svg viewBox="0 0 ${w} ${h}" class="pic vis" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(lab)}">${body}</svg>`;
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 15}" text-anchor="${o.a || 'middle'}" font-weight="${o.w || 700}" class="${o.c || 'tx'}"${o.r ? ` transform="rotate(${o.r} ${x} ${y})"` : ''}>${s}</text>`;
const Rc = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx == null ? 6 : o.rx}" class="${o.c || 'k2'}${o.s === false ? '' : ' ks'}" stroke-width="${o.sw || 2}"${o.op ? ` opacity="${o.op}"` : ''}${o.fill ? ` fill="${o.fill}"` : ''}/>`;
const Ln = (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${o.c || 'ks'}" stroke-width="${o.w || 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.stroke ? ` stroke="${o.stroke}"` : ''}/>`;
function Ar(x1, y1, x2, y2, o = {}) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = o.h || 11, w = o.w || 3, bx = x2 - h * Math.cos(a), by = y2 - h * Math.sin(a);
  const p1 = [bx + h * .55 * Math.sin(a), by - h * .55 * Math.cos(a)], p2 = [bx - h * .55 * Math.sin(a), by + h * .55 * Math.cos(a)];
  return `<path d="M${x1} ${y1}L${bx.toFixed(1)} ${by.toFixed(1)}" class="${o.c || 'ks'}" stroke-width="${w}" fill="none"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/><path d="M${x2} ${y2}L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}Z" class="${o.f || 'k'}"/>` + (o.lab ? T((x1 + x2) / 2 + (o.dx || 0), (y1 + y2) / 2 + (o.dy == null ? -8 : o.dy), o.lab, { fs: o.fs || 14, c: o.lc || 'kt' }) : '');
}
/* accolade horizontale (up : au-dessus) */
const Br = (x1, x2, y, lab, o = {}) => { const d = o.up ? -1 : 1, m = (x1 + x2) / 2; return `<path d="M${x1} ${y}q0 ${6 * d} 8 ${6 * d}H${m - 8}q8 0 8 ${6 * d}q0 ${-6 * d} 8 ${-6 * d}H${x2 - 8}q8 0 8 ${-6 * d}" fill="none" class="ks" stroke-width="2"/>` + T(m, y + d * 26 - (o.up ? -4 : 2), lab, { fs: o.fs || 14, c: o.c || 'kt' }); };
const st = (i, body) => `<g class="st st${i}">${body}</g>`;   // étape d’apparition (animée dans l’appli)

/* ---------- trait à main levée (scènes « Au travail », compétences) ---------- */
function rng(seed) { let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function Sketch(seed = 3, ink = '#2B2D7C') {
  const R = rng(seed), j = (k = 1) => (R() - .5) * 2 * k, f = n => n.toFixed(1);
  const line = (x1, y1, x2, y2, k = 1.4) => { let s = ''; for (let p = 0; p < 2; p++) { const mx = (x1 + x2) / 2 + j(k * 1.3), my = (y1 + y2) / 2 + j(k * 1.3); s += `M${f(x1 + j(k))} ${f(y1 + j(k))}Q${f(mx)} ${f(my)} ${f(x2 + j(k))} ${f(y2 + j(k))}`; } return s; };
  const poly = (pts, closed, k) => { let s = ''; const P = closed ? [...pts, pts[0]] : pts; for (let i = 0; i < P.length - 1; i++) s += line(P[i][0], P[i][1], P[i + 1][0], P[i + 1][1], k); return s; };
  const rect = (x, y, w, h, k) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true, k);
  const circ = (cx, cy, r, k = 1) => { let s = ''; for (let p = 0; p < 2; p++) { const n = 22, a0 = R() * 6.28; let d = ''; for (let i = 0; i <= n + 2; i++) { const a = a0 + i / n * 6.283, rr = r + j(k); d += (i ? 'L' : 'M') + f(cx + rr * Math.cos(a)) + ' ' + f(cy + rr * Math.sin(a)); } s += d; } return s; };
  const curve = (fn, x1, x2, n = 24) => { let d = ''; for (let i = 0; i <= n; i++) { const x = x1 + (x2 - x1) * i / n; d += (i ? 'L' : 'M') + f(x) + ' ' + f(fn(x) + j(.6)); } return d; };
  const P = (d, o = {}) => `<path d="${d}" fill="${o.fill || 'none'}" stroke="${o.c || ink}" stroke-width="${o.w || 2.6}" stroke-linecap="round" stroke-linejoin="round"${o.op ? ` opacity="${o.op}"` : ''}/>`;
  const fillR = (x, y, w, h, col, op = 1) => `<rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="3" fill="${col}" opacity="${op}"/>`;
  const tx = (x, y, s, fs = 16, o = {}) => `<text x="${x}" y="${y}" font-family="Andika" font-size="${fs}" font-weight="700" fill="${o.c || ink}" text-anchor="${o.a || 'middle'}"${o.r ? ` transform="rotate(${o.r} ${x} ${y})"` : ''}>${s}</text>`;
  return { line, poly, rect, circ, curve, P, fillR, tx, j };
}
module.exports = { S, T, Rc, Ln, Ar, Br, st, Sketch, esc };
