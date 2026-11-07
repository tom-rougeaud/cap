/* Outils communs : nombres à la française, arrondis exacts, trous à compléter, blocs. */
'use strict';
const NB = ' '; // espace fine insécable (milliers, avant € et %)
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* arrondi décimal sans erreur binaire (2,675 → 2,68) */
function rnd(x, d = 2) {
  const s = Math.sign(x) || 1, a = Math.abs(x);
  return s * Number(Math.round(Number(a.toFixed(10) + 'e' + d)) + 'e-' + d);
}
/* écriture française : 1 234,5 ; d = nombre de décimales imposé (ou null = minimal) */
function fr(x, d = null) {
  let v = d == null ? rnd(x, 6) : rnd(x, d);
  let s = d == null ? String(v) : Math.abs(v).toFixed(d);
  if (d != null && v < 0) s = '-' + s;
  if (d == null && /e/.test(s)) s = v.toFixed(6).replace(/0+$/, '');
  let [i, f] = s.replace('-', '').split('.');
  i = i.replace(/\B(?=(\d{3})+(?!\d))/g, NB);
  return (v < 0 ? '−' : '') + i + (f ? ',' + f : '');
}
const eur = (x, d = 2) => fr(x, d) + '\u00A0€';
const pct = (x, d = null) => fr(x, d) + '\u00A0%';
/* coefficient : 1,2 ; 0,85 ; 1,055 */
const cm = x => fr(rnd(x, 6));

/* trou à compléter : largeur en mm, réponse (affichée en rouge dans la version professeur) */
/* version détaillée d’une réponse (manuel professeur calqué) : texte brut, fractions en a/b ; rien si elle ne dit pas plus que la réponse courte */
const plain = h => String(h).replace(/<span class="fn">([^<]*)<\/span><span class="fd">([^<]*)<\/span>/g, '$1/$2').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '\u00A0').replace(/\s+/g, ' ').trim();
const xat = (a, x, k) => (x && plain(x) !== plain(a) ? ` data-x="${esc(plain(x))}"${k ? ` data-xk="${esc(k)}"` : ''}` : '');
const bl = (w, a = '', x = '', k = '') => `<span class="bl" style="width:${w}mm"${a !== '' ? ` data-a="${esc(a)}"` : ''}${a !== '' ? xat(a, x, k) : ''}></span>`;
/* lignes d’écriture */
const lines = (n, a = '') => `<div class="lines">${Array.from({ length: n }, (_, i) => `<i${i === 0 && a ? ` data-a="${esc(a)}"` : ''}></i>`).join('')}</div>`;
/* zone de calcul (cadre pointillé) */
const work = (h = 13, a = '') => `<div class="work" style="height:${h}mm"${a ? ` data-a="${esc(a)}"` : ''}></div>`;
/* case à cocher (ok = bonne réponse) */
const opt = (t, ok = false) => `<span class="opt${ok ? ' ok' : ''}"><span class="box"></span><span class="ot">${t}</span></span>`;
/* fraction sur deux étages */
const frac = (n, d) => `<span class="fr"><span class="fn">${n}</span><span class="fd">${d}</span></span>`;
/* verbe de consigne souligné */
const V = t => `<strong class="v">${t}</strong>`;
/* mot du lexique (renvoi au vocabulaire) */
const K = t => `<b class="kc">${t}</b>`;
/* pastilles de compétences */
const COMP = { app: 'S’approprier', ana: 'Analyser', rea: 'Réaliser', val: 'Valider', com: 'Communiquer' };
const cp = k => `<span class="cp cp-${k}">${COMP[k]}</span>`;
/* paliers neutres */
const PAL = { 1: ['●', 'S’échauffer'], 2: ['●●', 'S’entraîner'], 3: ['●●●', 'Approfondir'] };
const pal = n => `<span class="pal pal-${n}" title="${PAL[n][1]}">${PAL[n][0]}</span>`;

module.exports = { xat, plain, NB, esc, rnd, fr, eur, pct, cm, bl, lines, work, opt, frac, V, K, COMP, cp, PAL, pal };
