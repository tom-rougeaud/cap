/* Documents réalistes : ticket de caisse, étiquette de rayon, extrait de catalogue,
   feuille de tableur, message, affiche. Toutes les valeurs viennent du contenu (calculées). */
'use strict';
const { esc, eur, fr, NB } = require('./util');

/* doc : cadre « Document n » avec titre et source */
const doc = (n, titre, html, o = {}) => `<div class="docx${o.cls ? ' ' + o.cls : ''}"><div class="docx-h"><span class="docx-n">${n === '' ? 'Document' : 'Document ' + n}</span><span class="docx-t">${titre}</span></div><div class="docx-b">${html}</div>${o.src ? `<div class="docx-s">${o.src}</div>` : ''}</div>`;

/* ticket de caisse. lignes : [libellé, montant, code TVA, détail éventuel] ; tva : [[code, taux, ht, tva, ttc] …] (cellules '' → à compléter) */
function ticket(o) {
  const L = o.lignes.map(l => `<div class="tk-l"><span>${esc(l[0])}${l[3] ? `<small>${esc(l[3])}</small>` : ''}</span><span>${l[1] === null ? '' : fr(l[1], 2)}</span><span>${l[2]}</span></div>`).join('');
  const cell = v => typeof v === 'string' ? v : fr(v, 2);
  const tv = o.tva ? `<table class="tk-t"><tr><th>Code</th><th>Taux</th><th>HT</th><th>TVA</th><th>TTC</th></tr>${o.tva.map(r => `<tr>${r.map((v, i) => `<td>${i === 1 ? v : cell(v)}</td>`).join('')}</tr>`).join('')}</table>` : '';
  return `<div class="tk"><div class="tk-head"><b>${esc(o.mag)}</b><span>${o.adr.map(esc).join('<br>')}</span></div><div class="tk-sep"></div>${L}<div class="tk-sep"></div><div class="tk-tot"><span>TOTAL TTC</span><span>${o.total === null ? '' : fr(o.total, 2)} EUR</span></div>${o.pay ? `<div class="tk-l"><span>${esc(o.pay)}</span><span>${o.total === null ? '' : fr(o.total, 2)}</span><span></span></div>` : ''}<div class="tk-sep"></div>${tv}<div class="tk-foot">${o.foot.map(esc).join('<br>')}</div></div>`;
}

/* étiquette de rayon */
const etiq = o => `<div class="et"><div class="et-n">${esc(o.nom)}</div><div class="et-d">${esc(o.det)}</div><div class="et-p">${o.prix}</div><div class="et-k">${o.unit}</div>${o.badge ? `<div class="et-b">${o.badge}</div>` : ''}</div>`;

/* tableau « catalogue » ou tableau de données ; head : en-têtes ; rows : lignes (cellules HTML) */
const table = (head, rows, cls = '') => `<table class="dt ${cls}"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

/* feuille de tableur : cols = lettres ; rows = [[…cellules]] ; sel = 'D2' et formule affichée */
function sheet(o) {
  const cols = o.cols;
  const bar = o.fx != null ? `<div class="sh-fx"><span class="sh-ref">${o.sel || ''}</span><span class="sh-f">fx</span><span class="sh-v">${o.fx}</span></div>` : '';
  return `<div class="sh">${bar}<table class="sh-t"><tr><th></th>${cols.map(c => `<th>${c}</th>`).join('')}</tr>${o.rows.map((r, i) => `<tr><th>${i + 1}</th>${r.map((c, j) => `<td class="${(o.sel === cols[j] + (i + 1)) ? 'sh-sel ' : ''}${i === 0 && o.head !== false ? 'sh-h' : (typeof c === 'string' && /^[A-Za-zÀ-ÿ]/.test(c.replace(/<[^>]+>/g, '')) && !c.startsWith('<') ? 'sh-txt' : '')}">${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
}

/* message (SMS, messagerie interne) */
const msg = o => `<div class="ms"><div class="ms-h"><span class="ms-av">${esc(o.ini)}</span><span><b>${esc(o.de)}</b><small>${esc(o.quand)}</small></span></div><div class="ms-b">${o.txt}</div></div>`;

/* affiche de promotion */
const promo = o => `<div class="pr"><div class="pr-k">${o.k}</div><div class="pr-t">${o.t}</div><div class="pr-p">${o.p}</div>${o.old ? `<div class="pr-o">${o.old}</div>` : ''}${o.s ? `<div class="pr-s">${o.s}</div>` : ''}</div>`;

/* code Python */
const py = s => `<pre class="code py">${esc(s).replace(/\b(def|return|for|in|range|if|else|elif|while|print|round)\b/g, '<b>$1</b>').replace(/(#[^\n]*)/g, '<i>$1</i>')}</pre>`;

module.exports = { doc, ticket, etiq, table, sheet, msg, promo, py };
