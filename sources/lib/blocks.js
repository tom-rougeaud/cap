/* Blocs de mise en page du manuel (charte des manuels Maths Allophones + style/mcv.css).
   Chaque bloc est un .blk insécable. */
'use strict';
const { esc, cp, pal } = require('./util');

function Chapter(meta) {
  const C = { meta, fixed: [], ex: [], key: [], pouces: [], words: [] };
  const push = (html, o = {}) => (o.ex ? C.ex : C.fixed).push(html);

  /* ouverture */
  C.head = o => push(`<div class="blk chead kwn c-${meta.col}"><div class="ch-txt"><div class="ch-k">Chapitre ${meta.n} · ${esc(meta.dom)}</div><h2 class="fit">${meta.titre}</h2><p>${o.intro}</p><ul class="obj">${o.obj.map(x => `<li>${x}</li>`).join('')}</ul></div>${o.qr ? `<div class="qrbox">${o.qr}<span>Ce chapitre<br>dans l’appli</span></div>` : `<div class="qrbox qrsoon"><span class="soon">Ce chapitre<br>dans l’appli<br><b>Maths et MCV</b></span></div>`}</div>`);
  C.sec = (ic, t, key, sub = '') => push(`<div class="blk sec-h kwn" data-sec="${meta.id}-${key}"><span class="ic">${ic}</span>${t}${sub ? `<span class="sec-sub">${sub}</span>` : ''}</div>`);
  C.auto = items => push(`<div class="blk jms"><div class="jms-h">⚡ Automatismes <span>Calcul mental · sans calculatrice · 5 minutes</span></div><div class="jms-g${items.some(it => it[0].replace(/<[^>]+>/g, '').length > 34) ? ' jms-1' : ''}">${items.map((it, i) => `<div class="jms-i"><span class="jms-n">${i + 1}</span><span class="jms-q">${it[0]}</span>${it[1]}</div>`).join('')}</div></div>`);

  /* leçon : une notion = une règle (Je retiens) + un exemple */
  C.lecon = o => push(`<div class="blk lc"><div class="lc-h"><span class="lc-n">${o.n}</span>${o.titre}</div><div class="lc-g${o.ill ? ' withill' : ''}"><div class="lc-r"><span class="lc-t">Je retiens</span>${o.rule}</div><div class="lc-e"><span class="lc-t2">Exemple</span>${o.ex}</div>${o.ill ? `<div class="lc-i">${o.ill}</div>` : ''}</div>${o.wide || ''}${o.att ? `<div class="att">⚠️ ${o.att}</div>` : ''}</div>`);
  C.motscles = rows => push(`<div class="blk mk"><div class="lc-h"><span class="lc-n">🔤</span>Les mots à connaître</div><table class="tbl mkt">${rows.map(r => `<tr><td class="mk-w">${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table></div>`);
  /* astuces */
  C.astuces = groups => push(`<div class="blk ast"><div class="ast-h">🛠️ Mes astuces <span>pour calculer plus vite, donner du sens, estimer et vérifier</span></div><div class="ast-g">${groups.map(g => `<div class="ast-b ast-${g.k}"><div class="ast-t">${g.ic} ${g.t}</div>${g.items.map(i => `<p>${i}</p>`).join('')}</div>`).join('')}</div></div>`);
  /* exercice résolu pas à pas : à gauche la copie qui se construit, à droite l’explication de chaque étape */
  C.resolu = o => push(`<div class="blk rs"><div class="rs-h"><span class="rs-k">Exercice résolu ${o.n}</span><span class="rs-t">${o.titre}</span>${o.outil ? `<span class="outil">${o.outil}</span>` : ''}</div><div class="rs-en">${o.enonce}</div><table class="rs-t2"><tr><th>Ce que j’écris</th><th>Pourquoi je le fais</th></tr>${o.rows.map((r, i) => `<tr><td class="rs-w"><span class="rs-s">${i + 1}</span><span>${r[0]}</span></td><td class="rs-x">${r[1]}</td></tr>`).join('')}</table><p class="rs-rep">✅ ${o.rep}</p>${o.go ? `<p class="rs-go">➜ ${o.go}</p>` : ''}</div>`);
  C.vcard = w => { C.words.push(w); };
  C.raw = (html, o = {}) => push(html, o);

  /* exercice : o = {id, pal, lc (numéro de leçon), comps, titre, body, corr, pouce, keep, cls} */
  C.exo = o => {
    const eid = meta.id + '-' + o.id;
    C.key.push({ eid, titre: o.titre, corr: o.corr });
    if (o.pouce) C.pouces.push({ eid, titre: o.titre, txt: o.pouce });
    push(`<div class="blk ex${o.keep ? ' keep' : ''}${o.cls ? ' ' + o.cls : ''}" data-eid="${eid}" data-stage="${o.pal}"><div class="exh"><span class="num">·</span>${pal(Math.min(o.pal, 3))}<span class="ext">${o.titre}</span><span class="cps">${o.lc ? `<span class="lcref">leçon ${o.lc}</span>` : ''}${(o.comps || []).map(cp).join('')}</span></div><div class="exb">${o.body}</div>${o.pouce ? `<div class="pouce-r">💡 Coup de pouce p. <span data-pageof="pouces-${meta.id}">…</span></div>` : ''}</div>`, { ex: true });
  };
  /* en-tête d’étape dans la file des exercices, collé à l’exercice suivant */
  C.etape = (n, titre, txt) => push(`<div class="blk ex palh kwn keep" data-stage="${n}"><span class="pal pal-${Math.min(n, 3)}">${'●'.repeat(Math.min(n, 3))}</span><b>${titre}</b><span>${txt}</span></div>`, { ex: true });
  return C;
}
module.exports = { Chapter };
