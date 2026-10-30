/* CAP Maths — outils de rédaction communs aux 10 chapitres. */
'use strict';
const K = require('../lib/kit3');
const { MCVP } = require('../shared/g1.js');
const { S, T, Rc, Ln, Ar, Br, st, Sketch, esc } = require('../lib/visu');

/* un problème : K.prob + ce que demande la version 3 (défi, bulle, au travail, indices, coup de pouce, erreurs fréquentes par question) */
function PB(o) {
  const p = K.prob(o);
  p.niv = o.niv || 0; p.base = o.base || ''; p.defi = o.defi || 0; p.bulle = o.bulle || ''; p.autravail = o.autravail || null; p.hints = o.hints || []; p.pouce = o.pouce || '';
  Object.entries(o.err || {}).forEach(([i, e]) => { if (p.qs[i]) p.qs[i].err = e; });
  p.qs.forEach(q => { q.err = q.err || []; });
  (o.det || []).forEach((x, i) => { if (p.qs[i] && x) p.qs[i].x = x; });
  return p;
}
/* trois exercices à trois niveaux : courant, 🌱 guidé (a), 🚀 défi (d) */
const ENT = (cid, lcs) => [1, 2, 3].flatMap(i => [{ id: `e${i}`, gen: `${cid}e${i}`, lc: lcs[i - 1], niv: 0 }, { id: `e${i}a`, gen: `${cid}e${i}a`, lc: lcs[i - 1], niv: -1, base: `e${i}` }, { id: `e${i}d`, gen: `${cid}e${i}d`, lc: lcs[i - 1], niv: 1, base: `e${i}` }]);
/* une question d’évaluation (CCF) */
const EQ = (t, comp, pts, a, v = null, o = {}) => ({ t, comp, pts, a, v, tol: o.tol != null ? o.tol : (v == null ? undefined : 0.006), ...(o.w ? { w: o.w } : {}), ...(o.lines ? { lines: o.lines } : {}), ...(o.lab ? { lab: o.lab } : {}), ...(o.choices ? { choices: o.choices, ok: o.ok } : {}), ...(o.x ? { x: o.x } : {}) });
/* encadré « Je programme » : code Python lisible, avec ce que l’on observe */
const prog = (titre, texte, code, suite = '') => `<div class="prog"><div class="prog-h">🐍 Je programme · ${titre}</div><p>${texte}</p><pre>${esc(code)}</pre>${suite}</div>`;
/* encadré « Je raisonne » : vocabulaire et logique */
const rais = (titre, texte) => `<div class="rais"><div class="rais-h">🧠 Je raisonne · ${titre}</div>${texte}</div>`;
/* encadré « Je programme avec Scratch » : des blocs dessinés (couleurs des catégories de Scratch).
   prog = [{ c: 'evt'|'ctl'|'op'|'var'|'mot'|'look'|'pen'|'sns', t: 'texte du bloc', d: profondeur, end: true pour la fin d’une boucle }] */
const SCOL = { evt: '#E6A800', ctl: '#E8901A', op: '#3E9E3E', var: '#E8730A', mot: '#3373CC', look: '#7A52CC', pen: '#0B9A72', sns: '#2E8EB8' };
function scratchSvg(prog, lab) {
  let y = 8, body = '', maxW = 0;
  prog.forEach(b => {
    const x = 10 + (b.d || 0) * 20, col = SCOL[b.c] || '#888';
    if (b.end) { body += `<path d="M${x} ${y}h60v12h-60z" fill="${col}"/>`; y += 16; return; }
    const w = Math.max(70, b.t.length * 7.1 + 24); maxW = Math.max(maxW, x + w);
    const hat = b.c === 'evt';
    body += hat ? `<path d="M${x} ${y + 10} q30 -14 60 0 h${w - 60} a4 4 0 0 1 4 4 v18 a4 4 0 0 1 -4 4 h-${w} a4 4 0 0 1 -4 -4 v-18 a4 4 0 0 1 4 -4z" fill="${col}"/>` : `<rect x="${x}" y="${y}" width="${w}" height="28" rx="5" fill="${col}"/><path d="M${x + 12} ${y}h16l-4 5h-8z" fill="#fff" opacity=".35"/>`;
    body += `<text x="${x + 10}" y="${y + (hat ? 27 : 19)}" font-size="13" font-weight="700" fill="#fff" font-family="Inter">${esc(b.t)}</text>`;
    if (b.c === 'ctl' && b.open) body += `<rect x="${x}" y="${y + 28}" width="10" height="${b.open * 32}" fill="${col}"/>`;
    y += hat ? 40 : 32;
  });
  return `<svg viewBox="0 0 ${Math.ceil(maxW + 12)} ${y + 6}" class="pic scr" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(lab || 'Programme Scratch')}" style="width:${Math.min(84, Math.ceil(maxW + 12) * 0.23).toFixed(1)}mm;max-width:100%;height:auto">${body}</svg>`;
}
const scratch = (titre, texte, prog, suite = '') => `<div class="prog prog-s"><div class="prog-h">🐱 Je programme avec Scratch · ${titre}</div><p>${texte}</p><div class="scr-w">${scratchSvg(prog, titre)}</div>${suite}</div>`;
/* petit tableau HTML de données */
const tab = (head, rows, cls = '') => `<table class="dt tcx dt-sm ${cls}"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, j) => j === 0 ? `<th>${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
/* tableau en deux colonnes de paires (pour une liste longue : top 10…) */
const tab2 = (head, rows) => { const h = Math.ceil(rows.length / 2); return `<table class="dt tcx dt-sm"><thead><tr>${[...head, ...head].map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.slice(0, h).map((r, i) => `<tr>${[...r, ...(rows[h + i] || ['', ''])].map((c, j) => j % 2 === 0 ? `<th>${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`; };
/* pictogramme simple : un objet du magasin au trait (sans visage) */
const pic = (w, h, body, lab) => S(w, h, body, lab).replace('class="pic vis"', 'class="pic vis dsc"');
/* pastille d’étape dans une méthode visuelle (même numéro que la liste « La méthode, pas à pas ») */
const SN = (n, x, y) => `<circle cx="${x}" cy="${y}" r="11" class="k"/><text x="${x}" y="${y + 5}" font-size="13" font-weight="800" text-anchor="middle" class="tw">${n}</text>`;
module.exports = { ...K, ENT, EQ, SN, tab2, PB, prog, rais, tab, pic, scratch, scratchSvg, MCVP, S, T, Rc, Ln, Ar, Br, st, Sketch, esc };
