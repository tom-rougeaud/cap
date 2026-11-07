/* Tolérances des réponses numériques des évaluations et des CCF blancs (appli).
   Règle commune au manuel : une valeur exacte n’est acceptée qu’exacte (1e-9) ; une valeur arrondie n’est acceptée que si l’énoncé annonce l’arrondi,
   et seulement à la demi-unité du rang demandé. Les tolérances ne sont jamais écrites à la main. */
'use strict';
const strip = t => String(t || '').replace(/<[^>]*>/g, ' ');
const RANK = [[/à l[’']unité|à l[’']entier/i, 0], [/au dixième/i, 1], [/au centième|au centime/i, 2], [/au millième/i, 3]];
const rk = t => { for (const [r, d] of RANK) if (r.test(t)) return d; return null; };
const fix = (q, ctx, chk, where) => {
  if (q.v == null) return q;
  const t = strip(q.t), d = rk(t);
  const dec = Math.abs(q.v * 1000 - Math.round(q.v * 1000)) < 1e-6;
  if (d != null) q.tol = 0.5 * Math.pow(10, -d) + 1e-9;
  else {
    /* fraction irréductible attendue : la vérification compare les valeurs, à 1e-9 près */
    if (!dec && !/irréductible/i.test(t)) chk(false, `${where} : réponse non décimale sans arrondi annoncé : ${t.slice(0, 60)}`);
    q.tol = 1e-9;
  }
  return q;
};
const all = (E, chk, where) => { [...E.auto, ...E.exos.flatMap(x => x.qs)].forEach(q => fix(q, '', chk, where)); return E; };
module.exports = { fix, all };
