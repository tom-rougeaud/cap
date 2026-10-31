/* Maths · CAP — documents « Point de départ » et exercices « Je m’entraîne » à support visuel.
   Commun au manuel (tirage fixe) et à l’appli (nouveau tirage à chaque essai).
   Un exercice = { titre, consigne, support (HTML ou SVG avec des cases lettrées), items:[{k, a, v, tol, err:[{v, m}], qcm?}], hints:[…] }.
   Un point de départ = { titre, doc (HTML), qs:[{t, a, v, tol, kind:'num'|'qcm'|'tap', choices, ok, cell}] }.
   Toutes les réponses sont calculées, jamais écrites à la main. Les générateurs de chaque chapitre sont dans t1.js … t10.js. */
(function (root) {
  'use strict';
  const MC = typeof module !== 'undefined' ? require('./gens.js').MCVG : root.MCVG;
  const P = typeof module !== 'undefined' ? require('./g1.js').MCVP : root.MCVP;
  const { fr, rnd, rng } = MC;
  const PIE = typeof module !== 'undefined' ? require('./pie.js') : root.MCVPIE;
  const NB = ' ';
  const eur = (x, d) => (d == null ? (Number.isInteger(rnd(x, 2)) ? fr(x, 0) : fr(x, 2)) : fr(x, d)) + NB + '€', pct = (x, d = null) => fr(x, d) + NB + '%';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const TOL = d => 0.5 * Math.pow(10, -d) + 1e-9;
  const L = 'abcdefghijklmnop';
  /* case à compléter dans un texte ou un tableau */
  const tb = (k, a, w = 16) => `<span class="tb" data-k="${k}" data-a="${esc(a)}" style="min-width:${w}mm"><i>${k}</i></span>`;
  /* case à compléter dans un dessin */
  const sbw = (w, a) => Math.max(w, Math.ceil(String(a).length * 7.6) + 12);
  const sb = (x, y, w, k, a, h = 26) => { const W2 = sbw(w, a), X0 = x - (W2 - w) / 2; return `<g class="sb"><rect x="${X0}" y="${y}" width="${W2}" height="${h}" rx="5" class="sbr"/><text x="${X0 + 3}" y="${y - 3}" font-size="10" class="sbk" style="paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round">${k}</text><text x="${X0 + W2 / 2}" y="${y + h / 2 + 6}" font-size="15" text-anchor="middle" class="pa">${esc(a)}</text></g>`; };
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 14}" text-anchor="${o.a || 'middle'}" font-weight="${o.w || 700}" class="${o.c || 'tx'}"${o.r ? ` transform="rotate(${o.r} ${x} ${y})"` : ''}>${s}</text>`;
  const svg = (w, h, body, lab = '') => `<svg viewBox="0 0 ${w} ${h}" class="pic vis trs" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(lab)}">${body}</svg>`;
  const table = (head, rows, cls = '') => `<table class="dt tcx dt-sm ${cls}"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, j) => j === 0 ? `<th>${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const num = (k, v, d, a, err = [], x) => ({ k, v, tol: TOL(d), a, err: err.filter(e => Number.isFinite(e.v) && Math.abs(e.v - v) > TOL(d)), ...(x ? { x } : {}) });
  const qcm = (k, choices, ok, a, x) => ({ k, qcm: { choices, ok }, a: a || choices[ok], v: null, ...(x ? { x } : {}) });
  const pick = (R, arr) => arr[Math.floor(R() * arr.length)];
  const int = (R, lo, hi) => lo + Math.floor(R() * (hi - lo + 1));
  const shuffle = (R, arr) => { const b = arr.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  /* ligne de réponse « a. consigne : [case] unité » et tableau à deux lignes */
  const ln = (k, lab, a, w = 14, un = '') => `<p class="tr-l">${k}. ${lab} : ${tb(k, a, w)}${un ? ' ' + un : ''}</p>`;
  const tabXY = (xl, yl, X, Y) => `<table class="dt tcx dt-sm"><thead><tr><th>${xl}</th>${X.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody><tr><th>${yl}</th>${Y.map(y => `<td>${y}</td>`).join('')}</tr></tbody></table>`;
  const f1 = x => fr(rnd(x, 1), 1), f2 = x => fr(rnd(x, 2), 2);

  const DEP = {}, TR = {};
  /* calculs détaillés (version professeur) : xs(items, { a: '…', b: '…' }) */
  const xs = (items, m) => { items.forEach(it => { if (m[it.k]) it.x = m[it.k]; }); return items; };
  /* un exercice à trois niveaux : f(R, niv) avec niv = 0 (courant), -1 (🌱 guidé), +1 (🚀 défi) ; ids id, id + 'a', id + 'd' */
  const lv = (id, f) => { TR[id] = R => f(R, 0); TR[id + 'a'] = R => f(R, -1); TR[id + 'd'] = R => f(R, 1); };
  const H = { lv, ln, tabXY, f1, f2, MC, P, PIE, fr, rnd, eur, pct, esc, TOL, L, tb, sb, T, svg, table, num, qcm, pick, int, shuffle, NB, xs };

  /* vérification d’une réponse, avec l’erreur fréquente reconnue */
  function verdict(it, s) {
    if (it.qcm) return { ok: +s === it.qcm.ok };
    const x = MC.parse(s); if (!Number.isFinite(x)) return { ok: false, empty: String(s).trim() === '' };
    if (Math.abs(x - it.v) <= (it.tol == null ? 1e-6 : it.tol)) return { ok: true };
    const e = (it.err || []).find(e => Math.abs(x - e.v) <= Math.max(it.tol || 0, 1e-6)); return { ok: false, msg: e ? e.m : null };
  }
  const make = (tab, id, seed) => { const g = tab[id]; if (!g) throw new Error('générateur inconnu : ' + id); return g(rng(seed)); };
  root.MCVT = { DEP, TR, verdict, dep: (id, s) => make(DEP, id, s), tr: (id, s) => make(TR, id, s), L, H };
  /* générateurs de chaque chapitre (dans le navigateur, les fichiers t1.js … t10.js sont chargés à la suite) */
  if (typeof module !== 'undefined') for (let i = 1; i <= 10; i++) { try { require('./t' + i + '.js'); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND' || !String(e.message).includes('t' + i + '.js')) throw e; } }
})(typeof module !== 'undefined' ? module.exports : window);
