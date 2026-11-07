/* Outils de rédaction des chapitres (contenu commun à l’appli et au manuel). */
'use strict';
const U = require('./util');
const D = require('./docs');
const G = require('./charts');
const P = require('./pics');
const { MCVG } = require('../shared/gens.js');
const { esc, bl, lines, opt, frac, V } = U;

const H = t => `<mark class="hl">${t}</mark>`;                  // donnée surlignée
const FX = t => `<span class="fx">${t}</span>`;                // formule encadrée
const q = (n, t) => `<p class="q"><span class="qn">${n}</span>${t}</p>`;
const rep = (lab, w, a, u = '') => `<p class="ans"><span>${lab}</span>${bl(w, a)}${u ? `<span class="u">${u}</span>` : ''}</p>`;
const ca = (a, w) => `<span class="cellans"${w ? ` style="min-width:${w}mm"` : ''} data-a="${esc(a)}"></span>`;
const L = 'abcdefghijkl';

/* question d’un problème : texte, réponse affichée, valeur attendue (null : réponse rédigée), largeur ou lignes */
function Q(n, t, a, v = null, o = {}) {
  const html = `<div class="qq">${q(n, t) + (o.lines ? lines(o.lines, a) : o.none ? '' : rep(o.lab || '', o.w || 34, a))}</div>`;
  return { html, app: { l: n, t, a, v, tol: o.tol != null ? o.tol : (v == null ? null : 0.006), lab: o.lab } };
}
/* problème : corps (HTML) + questions */
function prob(o) {
  const qs = o.qs || [];
  return { id: o.id, etape: o.etape, titre: o.titre, lc: o.lc, comps: o.comps || [], pouce: o.pouce, corr: o.corr, cls: o.cls,
    body: (o.intro || '') + qs.map(x => x.html).join('') + (o.outro || ''), qs: qs.map(x => x.app).filter(Boolean),
    /* pour l’appli : énoncé sans les pointillés, puis les questions dans l’ordre (consignes intercalées comprises) */
    intro: o.intro || '', outro: o.outro || '', seq: qs.map(x => x.app ? { q: qs.filter(y => y.app).indexOf(x) } : { x: x.html }) };
}
/* question type bac (consigne à l’infinitif) */
function BQ(n, t, comp, a, v = null, o = {}) {
  const cps = { che: 'Chercher', mod: 'Modéliser', rep: 'Représenter', rai: 'Raisonner', cal: 'Calculer', com: 'Communiquer' };
  const html = `<div class="pq"><div class="pq-h"><span class="pq-n">${n}</span><span class="pq-q">${t}</span><span class="cp cp-${comp}">${cps[comp]}</span></div>${o.lines ? lines(o.lines, a) : rep(o.lab || '', o.w || 34, a)}</div>`;
  return { html, app: { l: n + '.', t, a, v, tol: o.tol != null ? o.tol : (v == null ? null : 0.006) } };
}
const X = html => ({ html, app: null });
module.exports = { ...U, X, D, G, P, MCVG, H, FX, q, rep, ca, L, Q, BQ, prob };
