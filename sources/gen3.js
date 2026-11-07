/* Construit le manuel « Maths · CAP » (classes préparant au CAP), version 3 (HTML à paginer), version élève et version professeur.
   Usage : node gen3.js → build/eleve.html, build/prof.html, build/log.json */
'use strict';
const fs = require('fs'), path = require('path');
const { esc, bl, opt, lines, cp, xat } = require('./lib/util');
const { cover } = require('./lib/cover2');
const TEX = require('./lib/tex');
const { SC, CP } = require('./lib/scenes3e');
const { S, T, Rc, Ar } = require('./lib/visu');
const K3 = require('./content/kit3e');
const HERE = __dirname, B = path.join(HERE, 'build');
fs.mkdirSync(B, { recursive: true });

const { MCVT } = require('./shared/train.js'); require('./shared/mech.js');
const AUTO = require('./shared/auto3.js');
const QR = JSON.parse(fs.readFileSync(path.join(HERE, 'lib', 'qr.json'), 'utf8'));
const ERR = [];
const chk = (ok, msg) => { if (!ok) ERR.push(msg); };
const DATA = require('./content')(chk);
if (ERR.length) { console.error('Contrôles de calcul en échec :', ERR); process.exit(1); }
/* corrigés détaillés (version professeur) : calcul posé et phrase de réponse, question par question */
const DET = require('./content/det3'), DETUSED = new Set();
Object.keys(DET).filter(k => /^c10\./.test(k)).forEach(k => delete DET[k]); /* le chapitre 10 n’est plus au manuel */
const attach = (key, qs) => { const d = DET[key]; if (!d) return; DETUSED.add(key); chk(d.length === qs.length, `détails ${key} : ${d.length} textes pour ${qs.length} questions`); qs.forEach((q, i) => { if (d[i]) q.x = d[i]; }); };
DATA.forEach(c => { c.probs.forEach(p => attach(`${c.id}.${p.id}`, p.qs)); attach(`${c.id}.au`, c.eval.auto); c.eval.exos.forEach((x, j) => attach(`${c.id}.ev${j}`, x.qs)); });
const Psub = h => String(h).replace(/P_([A-Z][\u0304]?)\(/g, 'P<sub>$1</sub>(');
/* une entrée de corrigé détaillé : titre, puis une ligne par question (calcul et phrase, sinon la réponse courte) */
const DETS = [];
const detBlock = (id, titre, items) => { const h = `<div class="dz-e" data-did="${id}"><p class="dz-t">${titre}</p><ol class="dz-l">${items.map(([l, t, extra]) => `<li><b>${l}</b> ${Psub(t)}${extra ? ` <i>${extra}</i>` : ''}</li>`).join('')}</ol></div>`; DETS.push({ id, h }); return h; };
const seedOf = s => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

// pastille de compétence sur chaque question des problèmes « vers le CCF » et des défis
const qComp = t => /Justifie|Explique|Pourquoi|Conclus|Vérifie|Peut-on|Que signifie|Interprète|est-il|est-elle|est-ce|raison/i.test(t) ? 'val'
  : /Repère|Relève|Lis |Cherche|Quelles? données|Complète le tableau/i.test(t) ? 'app'
  : /Quel calcul|Quelle formule|Choisis|Modélise|Traduis|Écris (une|la|l’) ?(formule|expression|équation)/i.test(t) ? 'ana' : 'rea';
const pastQ = body => body.replace(/(<p class="q"><span class="qn">[^<]*<\/span>)([\s\S]*?)(<\/p>)/g, (m, a, b, c) => `${a}${b}<span class="cp cp-${qComp(b.replace(/<[^>]*>/g, ''))} cpq">${CPS[qComp(b.replace(/<[^>]*>/g, ''))]}</span>${c}`);
const L = 'abcdefghijklmnop';
const CPS = { app: 'S’approprier', ana: 'Analyser', rea: 'Réaliser', val: 'Valider', com: 'Communiquer' };
const ORD = ['app', 'ana', 'rea', 'val', 'com'];
const ptsTxt = p => `${String(p).replace('.', ',')} pt${p > 1 ? 's' : ''}`;
const AST = { vite: ['⚡', 'Calculer vite'], og: ['🎯', 'Estimer'], sens: ['💡', 'Donner du sens'], verif: ['✅', 'Vérifier'] };
/* case vide d’un exercice résolu à compléter : ⟦réponse⟧ */
const trou = h => h.replace(/⟦([^⟧]+)⟧/g, (m, a) => `<span class="bl tr3" style="width:${Math.max(14, Math.min(46, a.replace(/<[^>]+>/g, '').length * 2.4 + 6))}mm" data-a="${esc(a)}"></span>`);
const trouTxt = h => h.replace(/⟦([^⟧]+)⟧/g, '<b>$1</b>');
const qcmOpts = it => `<span class="opts">${it.qcm.choices.map((c, j) => opt(c, j === it.qcm.ok)).join('')}</span>`;
/* QCM : les choix se placent sur la ligne de la question (à droite) ; en dessous seulement si la question n’a pas de ligne propre */
const stk = g => { const m = /<svg[^>]*viewBox="0 0 (\d+)/.exec(g.support); return m && +m[1] >= 400 ? ' stk' : ''; };
/* cadre de réponse : de la place pour les calculs, puis une phrase de conclusion */
const FRAME = {};
/* « Mes calculs » seulement s’il y a quelque chose à calculer ; « Ma réponse en une phrase » seulement si l’exercice demande une conclusion */
const calc = key => { const f = Array.isArray(key) ? key : FRAME[key]; if (!f) return ''; return `<div class="calc" style="height:${f[0]}mm"><span class="calc-t">✍️ Mes calculs</span></div>` + (f[1] ? '<div class="conc"><span>Ma réponse en une phrase :</span><i></i></div>' : ''); };
const trParts = g => {
  /* 1. une question par ligne : « a. … · b. … » est scindé */
  let sup = g.support.replace(/<p class="tr-l">((?:(?!<\/p>)[\s\S])*)<\/p>/g, (m, inner) => { const parts = inner.split(/\s·\s(?=[a-h]\. )/); return parts.length > 1 ? parts.map(x => `<p class="tr-l">${x}</p>`).join('') : m; });
  sup = sup.replace(/<span class="tb" data-k="([^"]+)" data-a="([^"]*)"/g, (m, k) => { const it = g.items.find(i => i.k === k); return m + (it ? xat(it.a, it.x, k + '.') : ''); });
  const out = [];
  g.items.forEach(it => {
    if (sup.includes(`data-k="${it.k}"`) || new RegExp(`class="sbk"[^>]*>${it.k}<`).test(sup)) return;
    const re = new RegExp(`<p class="tr-l">(${it.k}\\. (?:(?!</p>)[\\s\\S])*)</p>`);
    if (re.test(sup)) {
      /* la question a sa ligne : réponse courte à droite, réponse longue sur des lignes pleine largeur, dessous */
      if (it.qcm) { sup = sup.replace(re, (m, inner) => `<p class="tr-l tr-lq"><span class="tr-lt">${inner}</span>${qcmOpts(it)}</p>`); return; }
      const short = String(it.a).replace(/<[^>]+>/g, '').length <= 14 && !/\s\S+\s\S+\s\S+/.test(String(it.a).replace(/<[^>]+>/g, ''));
      sup = sup.replace(re, (m, inner) => short ? `<p class="tr-l tr-lq"><span class="tr-lt">${inner}</span><span class="bl tr3 tr-bx" data-k="${it.k}" data-a="${esc(it.a)}"${xat(it.a, it.x, it.k + '.')}></span></p>` : `<p class="tr-l">${inner}</p><div class="alines"><span class="bl aln" data-a="${esc(it.a)}"${xat(it.a, it.x, it.k + '.')}></span><span class="bl aln"></span></div>`);
      return;
    }
    out.push(it);
  });
  return { support: sup, extra: out.length ? `<div class="tr-q">${out.map(it => `<div class="tr-qi"><span class="mg-l">${it.k}.</span>${it.qcm ? qcmOpts(it) : bl(40, it.a, it.x, it.k + '.')}</div>`).join('')}</div>` : '' };
};

/* ---------- « Ce que tu sais déjà » : du collège au CAP ---------- */
const pontBox = c => `<div class="blk pont3 c-${c.col}"><div class="pont3-h">🔗 Ce que tu sais déjà : ce que tu peux réutiliser, et ce qui est nouveau au CAP</div><div class="pont3-g"><div class="pont3-a"><span class="pont3-k">Avant le CAP, tu as déjà appris</span><ul>${c.pont.de.map(x => `<li><b class="pont3-n">${x.niv}</b> <i>${esc(x.titre)}</i> : ${x.sais}</li>`).join('')}</ul><p class="pont3-ex"><b>Exemple du collège</b> · ${c.pont.ex2}</p></div><div class="pont3-b"><span class="pont3-k">Au CAP, on reprend la même situation et on va plus loin</span><p class="pont3-ex">${c.pont.ex1}</p></div></div><div class="pont3-g3"><div><span class="pont3-k">✅ Ce que tu peux réutiliser tel quel</span><ul>${c.pont.reste.map(x => `<li>${x}</li>`).join('')}</ul></div><div><span class="pont3-k">➕ Ce qui est nouveau au CAP</span><ul>${c.pont.change.map(x => `<li>${x}</li>`).join('')}</ul></div><div><span class="pont3-k">🎯 À quoi ça sert dans la vie ?</span><p>${c.pont.pourquoi}</p></div></div></div>`;
/* ---------- un chapitre ---------- */
const FLASH = [];
function chapter(c) {
  const col = c.col, R = id => `<b data-numof="${c.id}-${id}">·</b>`;
  const nivB = e => e.niv ? `<span class="niv niv-${e.niv > 0 ? 'd' : 'a'}">${e.niv > 0 ? '🚀 Défi' : '🌱 Guidé'}</span>` : '';
  const nivNote = e => e.niv ? `<p class="niv-n">${e.niv > 0 ? `Tu as réussi l’exercice ${R(e.base)} ? Voici le même thème, avec un défi en plus.` : `Si l’exercice ${R(e.base)} te résiste, commence ici : même thème, nombres plus simples, début déjà fait.`}</p>` : '';
  const nivT = e => e.niv ? (e.niv > 0 ? '🚀 ' : '🌱 ') : '';
  const fixed = [], ex = [], key = [], rep = [];
  /* 1. ouverture : une référence de la pop culture */
  fixed.push(`<div class="blk op3 c-${col}"><div class="op3-h"><div><div class="ch-k">Chapitre ${c.n} · ${esc(c.dom)}</div><h2 class="fit">${c.titre}</h2><div class="op3-sous">${esc(c.sous)}</div></div><div class="qrbox">${QR[c.id].svg}<span>Ce chapitre<br>dans l’appli</span></div></div>
    <div class="op3-sc">${SC[c.id]()}</div>
    <div class="op3-q"><span class="op3-k">🎬 La référence</span><span class="mt-r">${c.metier.roles.map(r => `<span>${r}</span>`).join('')}</span><p>${c.travail.question}</p></div>
    <div class="op3-o"><b>Dans ce chapitre</b><ul>${c.objectifs.map(o => `<li>${o}</li>`).join('')}</ul></div></div>`);
  /* 2. point de départ : un document du métier, 5 questions */
  const dp = MCVT.dep(c.depart, seedOf(c.id + '-dep'));
  fixed.push(`<div class="blk dep3 c-${col}" data-sec="${c.id}-dep" data-det="${c.id}-dep"><div class="dep3-h"><span class="ic">🚀</span>Point de départ<span class="sec-sub">un document · 5 questions · sans calculatrice</span></div><div class="dep3-g"><div class="dep3-doc"><div class="dep3-t">${dp.titre}</div>${dp.doc}</div><ol class="dep3-q">${dp.qs.map((q, qi) => `<li><span class="dq-t">${q.t}</span>${q.kind === 'qcm' ? `<span class="opts">${q.choices.map((x, j) => opt(x, j === q.ok)).join('')}</span>` : bl(24, q.a, q.x, (qi + 1) + '.')}</li>`).join('')}</ol></div></div>`);
  key.push({ k: 'dep', det: detBlock(`${c.id}-dep`, `🚀 Point de départ · ${dp.titre}`, dp.qs.map((q, i) => [`${i + 1}.`, q.x || q.a])) });
  /* 3. la leçon : une notion par page, dans l’ordre logique : je découvre → la méthode → la solution → je retiens → à moi */
  const ntB = [];
  c.notions.forEach((nt, i) => {
    const pi = c.parties.findIndex(p => p.n.includes(i + 1));
    ntB.push(`<div class="blk nt4 c-${col}" data-lcn="${i + 1}" data-pgid="${c.id}-n${i + 1}"${i ? '' : ` data-sec="${c.id}-cours"`}><div class="nt3-h"><span class="lc-n">${i + 1}</span><span class="nt3-t">${nt.titre}</span><span class="nt3-ch">Chapitre ${c.n} · ${esc(c.titre)}</span></div>
<div class="nt4-d"><div><span class="t3">🔎 Je découvre</span><p>${nt.decouvre.txt}</p></div><div class="nt4-img">${nt.decouvre.img}</div></div>
<div class="nt4-m"><span class="t3">🧭 La méthode, pas à pas</span><ol class="nt4-s">${nt.methode.map(m => `<li><div>${m}</div></li>`).join('')}</ol><div class="nt4-v">${nt.vois}</div></div>
<div class="nt4-sa"><div class="nt4-sol"><span class="nt4-sk">✅ La solution</span><div>${nt.solution}</div></div><div class="att">⚠️ <b>Attention</b> · ${nt.attention}</div></div><div class="lc-r nt4-ret"><span class="lc-t">📌 Je retiens</span>${nt.retiens}</div></div>`);
  });
  /* 5. je m’entraîne : 3 exercices à support visuel (tirage fixe ; d’autres nombres dans l’appli) */
  const byLc = {};
  c.entraine.forEach(e => {
    if (e.niv || c.court) return; /* un seul exercice par notion (plus les 4 calculs) : les variantes guidées et les défis ne sont plus proposés ; les problèmes du chapitre jouent le rôle de défi */
    const g = MCVT.tr(e.gen, seedOf(c.id + '-' + e.id)), eid = c.id + '-' + e.id;
    const tp = trParts(g), extra = tp.extra;
    key.push({ eid, titre: g.titre, det: detBlock(eid, `<b class="cn" data-numof="${eid}">·</b> ${nivT(e)}${g.titre}`, g.items.map(it => [`${it.k}.`, it.x || it.a])) });
    (byLc[e.lc] = byLc[e.lc] || []).push(`<div class="blk ex tr3 c-${col}" data-inl="1" data-lcn="${e.lc}" data-eid="${eid}" data-det="${eid}" data-stage="1"><div class="exh"><span class="num">·</span>${nivB(e)}<span class="ext">${g.titre}</span><span class="cps"><span class="lcref">notion ${e.lc}</span></span></div><div class="exb">${nivNote(e)}<p class="tr-c">${g.consigne}</p><div class="tr-s">${tp.support}</div>${extra}${calc(e.niv > 0 ? [18, 1] : c.id + '.' + e.id)}</div></div>`);
    rep.push({ eid, titre: nivT(e) + g.titre, txt: g.items.map(it => `${it.k}. ${it.a}`).join(' ; ') });
  });

  /* 5 bis. la mécanique : quatre petits calculs sans contexte, avant les exercices contextualisés de la notion */
  c.notions.forEach((nt, i) => {
    const k = i + 1; if (!MCVT.MECH[c.id + '.' + k]) return;
    const eid = `${c.id}-m${k}`, m = MCVT.mech(c.id, k, seedOf(eid));
    key.push({ eid, titre: 'Mécanique · ' + m.titre, det: detBlock(eid, `<b class="cn" data-numof="${eid}">·</b> Mécanique · ${m.titre}`, [['💡', `<i>Méthode :</i> ${(MCVT.MECH_REGLE || {})[c.id + '.' + k] || ''}`]].concat(m.items.map(it => [`${it.k}.`, it.a]))) });
    rep.push({ eid, titre: '🔧 ' + m.titre, txt: m.items.map(it => `${it.k}. ${it.a}`).join(' ; ') });
    (byLc[k] = byLc[k] || []).unshift(`<div class="blk ex mech c-${col}" data-inl="1" data-lcn="${k}" data-eid="${eid}" data-det="${eid}" data-stage="1"><div class="exh"><span class="num">·</span><span class="mech-b">🔧 Mécanique</span><span class="ext">${m.titre}</span><span class="cps"><span class="lcref">notion ${k}</span><span class="outil">4 calculs · sans contexte</span></span></div><div class="exb"><p class="tr-c">${m.consigne}</p><ol class="mech-l${m.items.every(it => it.t.replace(/<[^>]+>/g, '').length < 38 && String(it.a).length < 22) ? ' m3c' : ''}">${m.items.map(it => `<li><span class="mq"><b>${it.k}.</b> ${it.t}</span><span class="bl mech-a" data-a="${esc(it.s || it.a)}"></span></li>`).join('')}</ol></div></div>`);
  });

  /* réserve : d’autres tirages des exercices « Je m’entraîne ». La mise en page ne les pose que dans la place restée vide d’une page (jamais de page en plus). */
  const evPool = [];
  if (false) {
   const base = c.entraine.filter(e => !e.niv), cnt = {}; base.forEach(e => { cnt[e.lc] = (cnt[e.lc] || 0) + 1; });
    const sig = g => g.support + '|' + g.items.map(it => it.a).join(';');
    base.slice().sort((a, b) => cnt[a.lc] - cnt[b.lc]).forEach(e => {
      const seen = new Set([sig(MCVT.tr(e.gen, seedOf(c.id + '-' + e.id)))]);
      ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].forEach(sfx => {
        const rid = e.id + sfx, eid = c.id + '-' + rid, g = MCVT.tr(e.gen, seedOf(c.id + '-' + rid)), isEv = sfx === 'r4';
        if (seen.has(sig(g))) return; seen.add(sig(g));
        const tp = trParts(g), extra = tp.extra;
        detBlock(eid, `<b class="cn" data-numof="${eid}">·</b> ${g.titre}`, g.items.map(it => [`${it.k}.`, it.x || it.a]));
        const html = `<div class="blk ex tr3 pool${stk(g)}${isEv ? ' evb' : ''} c-${col}" data-eid="${eid}" data-det="${eid}" data-stage="1" data-src="${c.id}-${e.id}" data-lc="${e.lc}"><div class="exh"><span class="num">·</span><span class="ext">${g.titre}</span><span class="cps"><span class="optn optn-s">autres nombres · comme l’exercice <b data-numof="${c.id}-${e.id}">·</b></span><span class="optn optn-l">à toi, tout de suite</span><span class="optn optn-g">encore une fois · autres nombres</span><span class="optn optn-e">pour t’entraîner encore · hors barème</span><span class="lcref">notion ${e.lc}</span></span></div><div class="exb"><p class="tr-c">${g.consigne}</p><div class="tr-s">${tp.support}</div>${extra}${calc(c.id + '.' + e.id)}</div></div>`;
        (isEv ? evPool : ex).push(html);
        rep.push({ eid, titre: g.titre, txt: g.items.map(it => `${it.k}. ${it.a}`).join(' ; '), opt: 1 });
      });
    });
  }
  /* rappel : des exercices d’avant (autres nombres). Au « Point de départ » : ceux du chapitre précédent ; ailleurs, seulement si une page garde de la place vide (jamais de page en plus). */
 if (false) {
    const ci = DATA.indexOf(c), prev = ci > 0 ? DATA[ci - 1] : null; let nr = 0, ne = 0;
    const addRap = (g, eid, srcId, titre, dep, free, isEv) => {
      const tp = trParts(g), extra = tp.extra;
      detBlock(eid, `<b class="cn" data-numof="${eid}">·</b> ${g.titre}`, g.items.map(it => [`${it.k}.`, it.x || it.a]));
      const html = `<div class="blk ex tr3 pool rap${stk(g)}${isEv ? ' evb' : ''} c-${col}" data-eid="${eid}" data-det="${eid}" data-stage="1"${dep ? ' data-dep="1"' : ''} data-rap="1"${free ? ' data-free="1"' : ''} data-src="${srcId}"><div class="exh"><span class="num">·</span><span class="ext">${g.titre}</span><span class="cps"><span class="optn optn-r">je me rappelle · ${titre}</span></span></div><div class="exb"><p class="tr-c">${g.consigne}</p><div class="tr-s">${tp.support}</div>${extra}</div></div>`;
      (isEv ? evPool : ex).push(html);
      rep.push({ eid, titre: g.titre, txt: g.items.map(it => `${it.k}. ${it.a}`).join(' ; '), opt: 1 });
    };
    const fromChap = (o, e, dep) => { const rid = 'rap' + (++nr), eid = c.id + '-' + rid; addRap(MCVT.tr(e.gen, seedOf(eid)), eid, o.id + '-' + e.id, o.titre, dep, false, false); };
    const fromChapEv = (o, e) => { const rid = 'rae' + (++ne), eid = c.id + '-' + rid; addRap(MCVT.tr(e.gen, seedOf(eid)), eid, o.id + '-' + e.id, o.titre, false, false, true); };
    if (prev) { const base = prev.entraine.filter(e => !e.niv), dp = [base[0], base[Math.floor(base.length / 2)], base[base.length - 1]].filter((e, i, a) => e && a.indexOf(e) === i); dp.forEach(e => fromChap(prev, e, true)); base.filter(e => !dp.includes(e)).forEach(e => fromChap(prev, e, false)); }
   for (let k = 2; k <= Math.min(ci, 6); k++) { const o = DATA[ci - k], base = o.entraine.filter(e => !e.niv); for (let j = 0; j < Math.min(4, base.length); j++) fromChap(o, base[(ci + k + j) % base.length], false); }
    /* évaluation : deux rappels « hors barème » du chapitre précédent et d’un chapitre plus ancien */
    if (prev) { const base = prev.entraine.filter(e => !e.niv); if (base.length) fromChapEv(prev, base[(ci + 1) % base.length]); if (base.length > 1) fromChapEv(prev, base[(ci + 2) % base.length]); }
    if (ci > 1) { const o = DATA[ci - 2], base = o.entraine.filter(e => !e.niv); if (base.length) fromChapEv(o, base[ci % base.length]); }
    /* chapitre 1 : rappels de l’année précédente */
    const CROSS = {}[c.id];
    if (CROSS) CROSS[1].forEach((gid, i) => { const eid = c.id + '-rax' + (i + 1); addRap(MCVT.tr(gid, seedOf(eid)), eid, 'x-' + gid, CROSS[0], true, true, false); });
  }
  c.notions.forEach((nt, i) => { fixed.push(ntB[i]); (byLc[i + 1] || []).forEach(h => fixed.push(h)); });
  /* Je programme avec Scratch : un programme à lire, une question */
  (c.scratch || []).forEach((sx, j) => {
    const eid = `${c.id}-s${j + 1}`;
    ex.push(`<div class="blk ex scr3 c-${col}" data-eid="${eid}" data-det="${eid}" data-stage="1"><div class="exh"><span class="num">·</span><span class="ext">🐱 Je programme · ${sx.titre}</span><span class="cps"><span class="lcref">notion ${sx.lc}</span><span class="outil">Scratch</span></span></div><div class="exb"><p class="tr-c">${sx.texte}</p><div class="scr4"><div class="scr-w">${K3.scratchSvg(sx.prog, sx.titre)}</div><ol class="scr4-q">${sx.qs.map(([q, a]) => `<li><span>${q}</span>${bl(34, a)}</li>`).join('')}</ol></div></div></div>`);
    key.push({ eid, titre: sx.titre, det: detBlock(eid, `<b class="cn" data-numof="${eid}">·</b> Scratch · ${sx.titre}`, sx.qs.map(([q, a, x], k) => [`${L[k]}.`, x || a])) });
    rep.push({ eid, titre: 'Scratch · ' + sx.titre, txt: sx.qs.map(([q, a], k) => `${L[k]}. ${a}`).join(' ; ') });
  });
  /* 6. je résous : 3 problèmes (dont un défi et un sujet « vers le bac ») */
  if (c.probs.length && !c.court) ex.push(`<div class="blk ex palh palh3 kwn keep" data-stage="2"><span class="ph-i">🧩</span><b>Je résous</b><span>Des situations de pop culture, avec de vraies données. Je lis tout l’énoncé, je surligne les données, je dis ce que je cherche.</span></div>`);
  const ET = { 2: 'Petit problème', 3: 'Cas pratique', 4: 'Vers le CCF' };
  (c.court ? [] : c.probs).forEach(p => {
    const eid = c.id + '-' + p.id;
    if (p.bulle) ex.push(`<div class="blk ex bulle kwn keep c-${col}" data-stage="${p.etape}"><span class="bl-i">💬</span><p>${p.bulle}</p></div>`);
    const badge = p.defi ? `<span class="defi">Défi · ${p.defi} étapes</span>` : `<span class="et3b">${ET[p.etape]}</span>`;
    const autr = p.autravail ? `<div class="autr"><span class="cp cp-${p.autravail.comp}">${CPS[p.autravail.comp]}</span><span>🧑‍🔧 <b>Dans un métier, cela sert à</b> ${p.autravail.txt}</span></div>` : '';
    const pouce = p.pouce ? `<div class="pouce-inv"><span>💡 Coup de pouce · exercice <b data-numof="${eid}">·</b> : ${p.pouce}</span></div>` : '';
    ex.push(`<div class="blk ex pb3${p.cls ? ' ' + p.cls : ''} c-${col}" data-eid="${eid}" data-det="${eid}" data-stage="${p.etape}"><div class="exh"><span class="num">·</span>${badge}<span class="ext">${p.titre}</span><span class="cps">${p.lc ? `<span class="lcref">notion ${Math.min(p.lc, c.notions.length)}</span>` : ''}${(p.comps || []).map(cp).join('')}</span></div><div class="exb">${p.etape === 4 || p.defi ? pastQ(p.body) : p.body}</div>${autr}${pouce}</div>`);
    key.push({ eid, titre: p.titre, det: detBlock(eid, `<b class="cn" data-numof="${eid}">·</b> ${p.titre}`, p.qs.map(q => [/[.)]$/.test(q.l) ? q.l : q.l + '.', q.x || q.a])) });
  });
  /* 7. les maths dans un contexte professionnel, et je sais faire */
  const m = c.metier.job;
  ex.push(`<div class="blk ex mt3 keep c-${col}" data-stage="9"><div class="mt3-h">🧑‍🔧 Les maths dans un contexte professionnel</div><div class="mt3-g"><div><b class="mt3-n">${m.nom}</b><p>${m.fait}</p><p class="mt3-m">📐 <b>Ses maths</b> · ${m.maths}</p></div><div class="mt3-a"><span class="mt3-k">Après le CAP</span><ul>${m.apres.map(x => `<li>${x}</li>`).join('')}</ul></div></div></div>`);
  const au = AUTO.gen(c.id, seedOf(c.id + '-auto'), 10);
  FLASH.push(`<template id="flash-${c.id}"><ol>${[1, 2, 3, 4, 5, 6, 7, 8].flatMap(k => AUTO.gen(c.id, seedOf(c.id + "-flash" + k), 40)).filter((q, i, a) => !au.some(z => z.t === q.t) && a.findIndex(z => z.t === q.t) === i).slice(0, 130).map(q => `<li><span class="fl-t">${q.t}</span>${q.choices ? `<span class="opts">${q.choices.map((x, j) => opt(x, j === q.ok)).join('')}</span>` : bl(24, q.a, q.x)}</li>`).join('')}</ol></template>`);
  ex.push(`<div class="blk ex sais3 keep c-${col}" data-stage="9" data-sec="${c.id}-auto" data-det="${c.id}-auto"><div class="exh"><span class="ext">✅ Je fais le point</span></div><div class="exb"><p class="small">Je coche quand je sais faire seul. L’appli coche aussi cette liste au fil des réussites.</p><table class="tbl bilan"><tr><th>Je sais…</th><th>Exercices</th><th>Oui</th><th>Presque</th><th>Pas encore</th></tr>${(c.court ? c.bilan.map(([t], i) => [t, ['m' + Math.min(i + 1, c.notions.length)]]) : c.bilan).map(([t, es]) => `<tr><td class="tl">${t.replace(/^Je sais /, '')}</td><td>${es.map(e => /^n\d/.test(e) ? `à moi, notion ${e.slice(1)}` : R(e)).join(', ')}</td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td></tr>`).join('')}</table>
<div class="auto4"><div class="auto3-h"><span class="ic">⚡</span>Automatismes<span class="sec-sub">10 questions · 10 minutes · sans calculatrice · comme la partie 1 du CCF</span></div><ol class="auto3-q">${au.map((q, i) => `<li><span>${q.t}</span>${q.choices ? `<span class="opts">${q.choices.map((x, j) => opt(x, j === q.ok)).join('')}</span>` : bl(26, q.a, q.x, (i + 1) + '.')}</li>`).join('')}</ol></div></div></div>`);
  key.push({ k: 'auto', det: detBlock(`${c.id}-auto`, '⚡ Automatismes', au.map((q, i) => [`${i + 1}.`, q.x || q.a])) });
  /* 8. s’évaluer au format du CCF */
  const e = c.eval; let k = 0;
  const per = {}; [...e.auto, ...e.exos.flatMap(x => x.qs)].forEach(q => { per[q.comp] = (per[q.comp] || 0) + q.pts; }); per.com = (per.com || 0) + e.redac;
  const evh = `<div class="blk evh c-${col}"><div class="evh-t"><span class="evh-k">🎯 S’évaluer au format du CCF · CAP</span><h2>${c.titre}</h2><p>${e.lieu} · durée : ${e.duree}</p></div><div class="evh-n"><span>Nom</span><i></i><span>Date</span><i></i><b>… / 10</b></div><p class="evccf">Comme au CCF : 45 minutes, sur 10 points. La partie 1 (automatismes) se fait sans calculatrice ; la partie 2 (situations professionnelles) avec la calculatrice. ${ptsTxt(e.redac)} pour la clarté de la rédaction.</p>
<table class="tbl evg evg3 evg6"><tr><th>Compétence</th><th>Ce que je sais faire</th><th>Points</th><th>Insuffisante</th><th>Fragile</th><th>Satisfaisante</th><th>Très bonne</th></tr>${ORD.filter(o => per[o]).map(o => `<tr><td class="tl"><span class="cp cp-${o}">${CPS[o]}</span></td><td class="tl gp">${e.grille[o]}</td><td>${ptsTxt(per[o])}</td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td></tr>`).join('')}</table></div>`;
  const qBlk = (q, det) => { k++; return `<div class="blk evq c-${col}" data-det="${det}"><div class="evq-h"><span class="evq-n">${k}</span><span class="evq-t">${q.t}</span><span class="cp cp-${q.comp}">${CPS[q.comp]}</span><span class="evq-p">${ptsTxt(q.pts)}</span></div>${q.choices ? `<p class="ans">${`<span class="opts">${q.choices.map((x, j) => opt(x, j === q.ok)).join('')}</span>`}</p>` : q.lines ? lines(q.lines, q.a) : ['val', 'com'].includes(q.comp) && !q.lab ? lines(2, q.a) : `<p class="ans ans-w"><span>${q.lab || ''}</span>${bl(q.w || 40, q.a)}</p>`}</div>`; };
  const evAuto = `<div class="blk evx kwn c-${col}" data-det="${c.id}-au"><div class="evx-h"><span class="evx-n">Partie 1</span><span class="evx-t">Automatismes · sans calculatrice · 10 min</span><span class="evx-p">${ptsTxt(e.auto.reduce((a, b) => a + b.pts, 0))}</span></div><p class="evccf">Réponds sans justifier.</p></div>` + e.auto.map(q => qBlk(q, `${c.id}-au`)).join('');
  const evx = e.exos.map((x, i) => `<div class="blk evx kwn c-${col}" data-det="${c.id}-ev${i}">${i === 0 ? `<p class="ev-p2">Partie 2 · Situations professionnelles · 35 min · calculatrice autorisée · justifie tes réponses</p>` : ''}<div class="evx-h"><span class="evx-n">Exercice ${i + 1}</span><span class="evx-t">${x.t}</span><span class="evx-p">${ptsTxt(x.qs.reduce((a, b) => a + b.pts, 0))}</span></div>${x.intro || ''}</div>` + x.qs.map(q => qBlk(q, `${c.id}-ev${i}`)).join(''));
  const evRed = `<div class="blk evred c-${col}">✍️ <b>Rédaction · ${ptsTxt(e.redac)}</b> · phrases complètes, calculs posés, unités, résultats encadrés.</div>`;
  let kq = 0;
  key.push({ k: 'ev', det: detBlock(`${c.id}-au`, '🎯 S’évaluer · partie 1 · automatismes', e.auto.map(q => [`${++kq}.`, q.x || q.a, `(${ptsTxt(q.pts)})`])) });
  e.exos.forEach((x, i) => key.push({ k: 'ev', det: detBlock(`${c.id}-ev${i}`, `🎯 S’évaluer · exercice ${i + 1} · ${x.t}`, x.qs.map(q => [`${++kq}.`, q.x || q.a, `(${ptsTxt(q.pts)})`])) }));
  const bilan = `<div class="blk optend c-${col}" data-opt="1"><div class="ob-h">🧭 Mon bilan du chapitre ${c.n}</div><table class="ob-t"><tr><th>Notion</th><th>Seul·e, sans hésiter</th><th>Avec mon cours</th><th>À retravailler</th></tr>${c.notions.map((nt, i) => `<tr><td><b>${i + 1}.</b> ${nt.titre}</td><td><i></i></td><td><i></i></td><td><i></i></td></tr>`).join('')}</table><p class="ob-q">Mes erreurs les plus fréquentes dans ce chapitre :</p><div class="lines"><i></i><i></i><i></i></div><p class="ob-q">Ce que je fais pour progresser (refaire un exercice, relire une méthode, demander de l’aide…) :</p><div class="lines"><i></i><i></i><i></i></div></div>`;
  return { c, fixed, ex, ev: evh + evRed + evAuto + evx.join(''), key, rep };
}
const CH = DATA.map(chapter);

/* ---------- pages d’ouverture ---------- */
const QV = s => ({ vb: s.match(/viewBox="([^"]+)"/)[1], body: s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') });
const pCover = `<div class="page cover2"><div class="cvfull">${cover({ qr: QV(QR.home.svg) })}</div></div>`;
const pCoverP = `<div class="page cover2"><div class="cvfull">${cover({ qr: QV(QR.home.svg), prof: true })}</div></div>`;
/* le schéma du chapitre */
const STEPS = [['🎬', 'La référence', 'de la pop culture|et une question'], ['🚀', 'Point de départ', 'un document|5 questions'], ['📘', 'La leçon', 'une notion|par page'], ['🧭', 'Méthodes', 'un résolu, puis|un à compléter'], ['✏️', 'Je m’entraîne', 'des supports|à compléter'], ['🧩', 'Je résous', 'des situations|du métier'], ['🎯', 'S’évaluer', 'au format du CCF|45 min, sur 10']];
const flow = S(600, 250, STEPS.map(([ic, t, s], i) => { const x = 10 + (i % 4) * 150, y = i < 4 ? 20 : 140, w = 130; return Rc(x, y, w, 86, { c: i === 2 ? 'k' : 'k2', rx: 14 }) + `<text x="${x + w / 2}" y="${y + 30}" font-size="22" text-anchor="middle">${ic}</text>` + T(x + w / 2, y + 50, t, { fs: 14, c: i === 2 ? 'tw' : 'tx' }) + s.split('|').map((l, j) => T(x + w / 2, y + 68 + j * 12, l, { fs: 10, c: i === 2 ? 'tw' : 'ts', w: 600 })).join('') + (i < 3 ? Ar(x + w + 2, y + 43, x + w + 18, y + 43, { w: 2.4, h: 8 }) : '') + (i >= 4 && i < 6 ? Ar(x + w + 2, y + 43, x + w + 18, y + 43, { w: 2.4, h: 8 }) : ''); }).join('') + `<path d="M535 106 C 560 125, 90 112, 75 134" fill="none" class="ks" stroke-width="2.4" stroke-dasharray="6 4"/><path d="M75 138 l-6 -10 h12 z" class="k"/>` + T(527, 196, 'Une notion, une page :', { fs: 12, c: 'kt', a: 'middle' }) + T(527, 214, 'je découvre → la méthode', { fs: 10.5, w: 600 }) + T(527, 229, '→ la solution → je retiens', { fs: 10.5, w: 600 }) + T(527, 244, '→ à moi', { fs: 10.5, w: 600 }), 'Le déroulé d’un chapitre');
const pGuide = `<div class="page c-nombre" data-recto="0"><div class="inner" data-sec="guide">
  <h1 class="pg-t">Ton manuel : comment ça marche ?</h1>
  <p class="pg-p">Chaque chapitre suit toujours le même chemin. On part d’une référence de la pop culture, avec de vraies données, on comprend, puis on s’entraîne et on résout.</p>
  <div class="flow3">${flow}</div>
  <h2 class="pg-s">Ma routine de lecture, en 3 étapes</h2>
  <div class="rout3"><div><span class="gn">1</span><b>Je lis tout</b><span>Je lis l’énoncé une fois en entier, sans calculer. Je regarde les documents.</span></div><div><span class="gn">2</span><b>Je surligne</b><span>Je repère les données utiles (elles sont souvent <mark class="hl">surlignées</mark>) et ce qu’on me demande.</span></div><div><span class="gn">3</span><b>Je dis ce que je cherche</b><span>Avec mes mots : « Je cherche le prix d’un paquet ». Puis je choisis la méthode.</span></div></div>
  <h2 class="pg-s">Les repères</h2>
  <div class="rep3"><div><span class="defi">Défi · 4 étapes</span><span>Un exercice plus long, annoncé avec son nombre d’étapes. Une bulle 💬 t’aide à démarrer.</span></div><div><span class="pouce-mini">💡 ∀</span><span>Les <b>coups de pouce</b> sont en bas de page, écrits à l’envers : tourne le manuel pour les lire.</span></div><div><span class="et3b">Réponses</span><span>Les réponses de « Je m’entraîne » sont en fin de manuel, pour vérifier seul.</span></div><div><span class="cp cp-rai">Raisonner</span><span>Chaque exercice indique les compétences qu’il fait travailler (pages suivantes).</span></div></div>
  <h2 class="pg-s">L’appli qui va avec</h2>
  <div class="qrhow"><div class="qrbox big">${QR.home.svg}<span>Maths · CAP</span></div><div><p class="pg-p">Sur téléphone ou ordinateur, sans compte : la leçon animée, les méthodes pas à pas, l’entraînement corrigé tout de suite avec de nouveaux nombres à chaque essai, les problèmes, les évaluations au format du CCF et les 2 CCF blancs chronométrés.</p><p class="pg-p small">tom-rougeaud.github.io/cap · Rien n’est envoyé sur Internet : la progression reste sur l’appareil.</p></div></div>
  <div class="owner"><span>Ce manuel appartient à</span><i></i><span>Classe</span><i></i></div>
  <p class="pg-p small lic">© Tom Rougeaud · Manuel et appli sous licence <b>CC BY-NC 4.0</b> : tu peux les partager et les adapter, sans usage commercial, en citant l’auteur.</p>
</div><div class="foot"></div></div>`;
/* les compétences, expliquées par le métier (une seule page) */
const COMPS = [
  ['app', 'Rechercher, extraire et organiser l’information ; traduire des informations.', 'Repérer sur un bon de commande la quantité, le prix et la remise.', 'Je surligne les données utiles et je dis avec mes mots ce que je cherche.'],
  ['ana', 'Choisir une méthode, un outil, des lois pertinentes ; raisonner.', 'Décider s’il faut utiliser un pourcentage, une échelle ou une règle de trois.', 'Je me demande : « Quelle méthode du chapitre répond à la question ? »'],
  ['rea', 'Mettre en œuvre la démarche : calculer, représenter, utiliser un modèle.', 'Calculer une quantité de matière, tracer un schéma, lire un tableau.', 'Je pose le calcul, j’écris l’unité, je complète le tableau ou le graphique.'],
  ['val', 'Critiquer un résultat, contrôler qu’il est vraisemblable, argumenter.', 'Vérifier qu’une mesure est plausible avant de couper une pièce.', 'Je me demande : « Ce résultat est-il possible ? » et je fais une vérification.'],
  ['com', 'Rendre compte à l’écrit comme à l’oral, expliquer sa démarche.', 'Expliquer à un client le détail d’une facture ou d’un devis.', 'Je réponds par une phrase complète, avec le résultat et l’unité.']];
const compCard = ([k, geste, metier, manuel]) => `<div class="cpc cpc7 cpc-${k}"><div class="cpc-i">${CP[k]()}</div><div><div class="cpc-h"><span class="cp cp-${k}">${CPS[k]}</span><p class="cpc-g">${geste}</p></div><p class="cpc-m">🧑‍🔧 <b>Dans un métier</b> · ${metier}</p><p class="cpc-x">✏️ <b>Dans le manuel</b> · ${manuel}</p></div></div>`;
const pComp = `<div class="page c-algo"><div class="inner cps6" data-sec="competences">
  <h1 class="pg-t">Les 5 compétences du CAP</h1>
  <p class="pg-p">Au CAP, en mathématiques comme en physique-chimie, on travaille et on évalue cinq compétences. Ce sont aussi des gestes de tous les métiers.</p>
  ${COMPS.map(compCard).join('')}
  <div class="cpbot"><div><h2 class="pg-s">Les consignes</h2><table class="tbl cons2"><tr><th>Consigne · Au CCF</th><th>Ce qu’on attend</th></tr>
  <tr><td><b>Calcule</b> · Calculer</td><td>un résultat chiffré, avec son unité</td></tr>
  <tr><td><b>Détermine</b> · Déterminer</td><td>un résultat, par le calcul ou par lecture</td></tr>
  <tr><td><b>Justifie</b> · Justifier, montrer</td><td>une raison : un calcul, une propriété, un document</td></tr>
  <tr><td><b>Vérifie</b> · Vérifier</td><td>un contrôle qui confirme le résultat</td></tr>
  <tr><td><b>Rédige</b> · Rédiger</td><td>des phrases complètes qui répondent à la question</td></tr></table><p class="rappel">📌 <b>Rappel</b> · Les données de pop culture viennent de sources réelles, indiquées sous chaque document avec leur date. Tout le reste (boutiques, prix, taux, enquêtes, personnages) est inventé pour les exercices. Les personnages ne sont jamais dessinés : seuls les chiffres comptent.</p></div><div><h2 class="pg-s">Mes outils</h2><div class="guide-g"><div class="gd"><span class="gi">🧮</span><div><b>Calculatrice</b><span>Pour les calculs longs : fractions, puissances (touche ^ ou xʸ), racine carrée, pourcentages. Les automatismes se font sans.</span></div></div><div class="gd"><span class="gi">📊</span><div><b>Tableur</b><span>Moyenne, effectifs, fréquences, formules recopiées vers le bas, graphiques.</span></div></div><div class="gd"><span class="gi">📐</span><div><b>GeoGebra</b><span>Tracer une droite ou une figure, vérifier une longueur, un angle, une transformation.</span></div></div><div class="gd"><span class="gi">🐱</span><div><b>Scratch</b><span>Lire et écrire des programmes avec des blocs : boucles, conditions, variables.</span></div></div></div></div></div>
</div><div class="foot"></div></div>`;
const pToc = `<div class="page" data-recto="0"><div class="inner" data-sec="sommaire">
  <h1 class="pg-t">Sommaire</h1>
  <div class="toc2"><div class="tc2 ann"><span class="tn2">🔗</span><div><b>Ce que tu sais déjà</b><span>Ce que chaque chapitre reprend du collège, et ce qu’il ajoute</span></div><span class="tp2"><span data-pageof="pont">…</span></span></div>${DATA.map(c => `<div class="tc2 c-${c.col}"><span class="tn2">${c.n}</span><div><b>${esc(c.titre)}</b><span>${c.parties.map((p, k) => `${'ABCDE'[k]}. ${p.t}`).join(' · ')}</span></div><span class="tp2"><span data-pageof="${c.id}">…</span></span></div>`).join('')}
  <div class="tc2 ann"><span class="tn2">🎓</span><div><b>Deux CCF blancs</b><span>45 minutes, sur 10 points, calculatrice autorisée</span></div><span class="tp2"><span data-pageof="dnb">…</span></span></div><div class="tc2 ann"><span class="tn2">✔️</span><div><b>Réponses de « Je m’entraîne »</b><span>Pour vérifier seul, chapitre par chapitre</span></div><span class="tp2"><span data-pageof="rep">…</span></span></div><div class="tc2 ann"><span class="tn2">🔤</span><div><b>Glossaire visuel</b><span>Les mots de chaque chapitre, avec un schéma</span></div><span class="tp2"><span data-pageof="glo">…</span></span></div></div>
  <p class="pg-p small" style="margin-top:4mm">Programme de mathématiques des classes préparant au CAP (Bulletin officiel de l’éducation nationale, numéro spécial n° 5 du 11 avril 2019). Le signe ➕ marque un domaine propre à un groupement de CAP.</p>
</div><div class="foot"></div></div>`;

/* ---------- « Ce que tu sais déjà » : vue d’ensemble (élève et professeur) ---------- */
const pontSec = `<section class="sec" data-key="pont" data-recto="0" data-cols="2" data-run="Ce que tu sais déjà" data-col="brand"><div class="blk chead kwn c-brand span"><div class="ch-txt"><div class="ch-k">Avant de commencer</div><h2>🔗 Ce que tu sais déjà</h2><p>Chaque chapitre du CAP part de ce que tu as appris au collège, puis va plus loin. Tu n’as pas tout retenu ? C’est normal : chaque chapitre commence par le rappeler.</p></div></div>`
  + DATA.map(c => `<div class="blk pontl c-${c.col}"><span class="pontl-n">${c.n}</span><div class="pontl-t"><b>${esc(c.titre)}</b><span class="pontl-d">${[...new Set(c.pont.de.map(x => x.niv))].join(' · ')}</span><span class="pontl-f">➜ ${c.pont.fil}</span></div></div>`).join('') + `</section>`;
/* ---------- continuité du cycle 4 : version professeur ---------- */
const pontProf = `<section class="sec" data-key="pontp" data-recto="0" data-run="Continuité collège → CAP · version professeur" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Version professeur</div><h2>🧭 Continuité collège → CAP, chapitre par chapitre</h2><p>Pour chaque chapitre : les capacités du programme de CAP couvertes et les parties du chapitre, les appuis du collège, les automatismes à réactiver (zone ⚡ Automatismes, page « Je fais le point ») et les points de vigilance repérés dans les erreurs fréquentes.</p><p><b>📖 Page élève</b> · la pagination de ce manuel n’est pas celle du manuel de l’élève. En tête de chaque exercice, de chaque leçon et de chaque bloc « ⚡ Pour garder la forme », la pastille « 📖 Page élève : N » donne la page où se trouve le même contenu dans le manuel de l’élève : les exercices et les données sont strictement les mêmes, seuls les corrigés en plus.</p></div></div>`
  + DATA.map(c => `<div class="blk pontp c-${c.col}"><h3><span class="pontl-n">${c.n}</span>${esc(c.titre)}</h3><p class="pontp-d"><b>Appuis</b> · ${c.pont.de.map(x => `${x.niv} « ${esc(x.titre)} »`).join(' · ')}</p><table class="pontp-t"><tr><th>Capacités du programme de CAP</th><th>À réactiver</th><th>Vigilance</th></tr><tr><td><ul>${c.pont.prog.map(x => `<li>${x}</li>`).join('')}</ul><p class="pontp-pl"><b>Parties</b> · ${c.parties.map((p, i) => `${'ABCDE'[i]}. ${p.t}`).join(' · ')}</p></td><td><ul>${c.pont.reac.map(x => `<li>${x}</li>`).join('')}</ul></td><td><ul>${c.pont.vig.map(x => `<li>${x}</li>`).join('')}</ul></td></tr></table></div>`).join('') + `</section>`;

/* ---------- chapitres ---------- */
const chapSecs = CH.map(({ c, fixed, ex, ev }) => {
  const run = `CAP Maths · Chapitre ${c.n}${c.plus ? ' ➕' : ''} · ${c.titre}`;
  return `<section class="sec" data-key="${c.id}" data-recto="0" data-fill="1" data-run="${esc(run)}" data-col="${c.col}">${fixed.join('')}${ex.join('')}</section>`
    + `<section class="sec" data-key="${c.id}-ev" data-recto="0" data-fill="1" data-run="${esc(run)} · s’évaluer" data-col="${c.col}">${ev}</section>`;
}).join('');

/* ---------- deux CCF blancs, série professionnelle (élève : sujets ; professeur : corrigés et barèmes) ---------- */
const DNB = require('./content/ccf3')(chk);
DNB.forEach(sj => { attach(`dnb.${sj.id}.au`, sj.auto); sj.exos.forEach((x, j) => attach(`dnb.${sj.id}.${j}`, x.qs)); });
Object.keys(DET).forEach(k => chk(DETUSED.has(k), `détails sans questions : ${k}`));
if (ERR.length) { console.error('Contrôles de calcul en échec :', ERR); process.exit(1); }
const dnbIntro = `<div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Se préparer au CCF</div><h2>🎓 Deux CCF blancs</h2><p>Au CAP, les mathématiques sont évaluées par un contrôle en cours de formation (CCF) : 45 minutes, noté sur 10. Il a deux parties, comme ces deux sujets.</p></div></div>
<div class="blk ccfhow c-brand"><div><b>⚡ Partie 1 · 3 points</b><span>des automatismes, en 10 minutes, sans calculatrice. Tu réponds sans justifier.</span></div><div><b>🧩 Partie 2 · 6 points</b><span>deux situations professionnelles, en 35 minutes, avec la calculatrice. Tu justifies tes réponses.</span></div><div><b>✍️ 1 point de rédaction</b><span>la clarté de la rédaction et la présentation des calculs.</span></div><div><b>🧮 Matériel</b><span>stylo, règle, équerre ; calculatrice pour la partie 2 seulement.</span></div></div>
<div class="blk ccfadv c-brand"><p><b>Un conseil</b> : dans la partie 2, les deux exercices sont indépendants. Commence par celui que tu préfères, et laisse une trace de tes essais : une démarche, même inachevée, rapporte des points.</p></div>`;
const dnbSec = (sj, i) => { let k = 0; const per = {}; [...sj.auto, ...sj.exos.flatMap(x => x.qs)].forEach(q => { per[q.comp] = (per[q.comp] || 0) + q.pts; }); per.com = (per.com || 0) + sj.redac;
  const qB = (q, det) => { k++; return `<div class="blk evq c-brand" data-det="${det}"><div class="evq-h"><span class="evq-n">${k}</span><span class="evq-t">${q.t}</span><span class="cp cp-${q.comp}">${CPS[q.comp]}</span><span class="evq-p">${ptsTxt(q.pts)}</span></div>${q.choices ? `<p class="ans"><span class="opts">${q.choices.map((x, j) => opt(x, j === q.ok)).join('')}</span></p>` : q.lines ? lines(q.lines, q.a) : ['val', 'com'].includes(q.comp) && !q.lab ? lines(2, q.a) : `<p class="ans ans-w"><span>${q.lab || ''}</span>${bl(q.w || 40, q.a)}</p>`}</div>`; };
  const head = `<div class="blk evh c-brand ccfh" data-sec="dnb-${sj.id}"><div class="evh-t"><span class="evh-k">🎓 CCF blanc ${sj.id} · CAP</span><h2>${sj.titre}</h2><p>Durée : 45 minutes · partie 1 sans calculatrice, partie 2 avec la calculatrice</p></div><div class="evh-n"><span>Nom</span><i></i><span>Date</span><i></i><b>… / 10</b></div>
<table class="tbl evg evg3 evg6"><tr><th>Compétence</th><th>Ce que je sais faire</th><th>Points</th><th>Insuffisante</th><th>Fragile</th><th>Satisfaisante</th><th>Très bonne</th></tr>${ORD.filter(o => per[o]).map(o => `<tr><td class="tl"><span class="cp cp-${o}">${CPS[o]}</span></td><td class="tl gp">${sj.grille[o]}</td><td>${ptsTxt(per[o])}</td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td></tr>`).join('')}</table></div>`;
  const p1 = `<div class="blk evx kwn c-brand" data-det="dnb-${sj.id}-au"><div class="evx-h"><span class="evx-n">Partie 1</span><span class="evx-t">Automatismes · 10 minutes · sans calculatrice</span><span class="evx-p">3 pts</span></div><p class="evccf">Réponds sans justifier.</p></div>` + sj.auto.map(q => qB(q, `dnb-${sj.id}-au`)).join('');
  const p2 = sj.exos.map((x, j) => `<div class="blk evx kwn c-brand" data-det="dnb-${sj.id}-${j}">${j === 0 ? `<p class="ev-p2">Partie 2 · Situations professionnelles · 35 minutes · calculatrice autorisée · justifie tes réponses</p>` : ''}<div class="evx-h"><span class="evx-n">Exercice ${j + 1}</span><span class="evx-t">${x.t}</span><span class="evx-p">${ptsTxt(x.qs.reduce((a, b) => a + b.pts, 0))}</span></div>${x.intro || ''}</div>` + x.qs.map(q => qB(q, `dnb-${sj.id}-${j}`)).join('')).join('');
  return `<section class="sec" data-key="dnb-${sj.id}" data-recto="1" data-run="CCF blanc ${sj.id} · ${esc(sj.titre)}" data-col="brand">${head}${p1}${p2}<div class="blk evred c-brand">✍️ <b>Rédaction · 1 pt</b> · clarté de la rédaction et présentation des calculs, sur l’ensemble de la partie 2.</div></section>`; };
const dnbSecs = DNB.map((sj, i) => { const h = dnbSec(sj, i); return i ? h.replace('data-recto="1"', 'data-recto="0"') : h.replace(/<section class="sec" data-key="dnb-A"([^>]*)>/, `<section class="sec" data-key="dnb"$1>${dnbIntro}`); }).join('');
const dnbCorr = `<div class="blk cc kwn c-brand"><h3>🎓 CCF blancs · corrigés et barèmes <small>(p. <span data-pageof="dnb">…</span>)</small></h3></div>` + DNB.map(sj => { let kq = 0; return `<div class="blk cc kx c-brand">${detBlock(`dnb-${sj.id}-au`, `🎓 CCF ${sj.id} · ${sj.titre} · partie 1 · automatismes`, sj.auto.map(q => [`${++kq}.`, q.x || q.a, `(${ptsTxt(q.pts)})`]))}</div>` + sj.exos.map((x, j) => `<div class="blk cc kx c-brand">${detBlock(`dnb-${sj.id}-${j}`, `🎓 CCF ${sj.id} · exercice ${j + 1} · ${x.t}`, x.qs.map(q => [`${++kq}.`, q.x || q.a, `(${ptsTxt(q.pts)})`]))}</div>`).join('') + `<div class="blk cc kx c-brand"><p class="small">Rédaction (1 pt) : clarté de la rédaction et présentation des calculs sur l’ensemble de la partie 2.</p></div>`; }).join('');

/* ---------- réponses de « Je m’entraîne » (élève et professeur) ---------- */
const repSec = `<section class="sec" data-key="rep" data-recto="0" data-run="Réponses de « Je m’entraîne »" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Fin de manuel</div><h2>✔️ Réponses de « Je m’entraîne »</h2><p>Fais l’exercice d’abord, puis vérifie ici. Une réponse différente ? Relis la notion indiquée, ou refais l’exercice dans l’appli avec d’autres nombres.</p></div></div>`
  + CH.map(({ c, rep }) => `<div class="blk rp3 c-${c.col}" data-sec="rep-${c.id}"><h3><span class="rp-n">${c.n}</span>${c.titre}</h3>${rep.map(r => `<p${r.opt ? ` data-optrep="${r.eid}"` : ''}><b class="cn" data-numof="${r.eid}">·</b> <b>${r.titre}</b> — ${r.txt}.</p>`).join('')}</div>`).join('') + `</section>`;

/* ---------- glossaire visuel ---------- */
const WORDS = 2;
const card = (w, m) => `<div class="blk gcard c-${m.col}" data-word="${esc(w.id)}"><div class="gc-ill">${w.pic}</div><div><div class="gc-h"><span class="gc-w">${w.mot}</span>${w.abr ? `<span class="sym">${w.abr}</span>` : ''}</div><p class="gc-def">${w.def}</p>${w.formule ? `<p class="gc-man">${w.formule}</p>` : ''}${w.sens ? `<p class="note">↔️ ${w.sens}</p>` : ''}<p class="gc-ph">« ${w.phrase} »</p></div></div>`;
const glo = `<section class="sec" data-key="glo" data-cols="2" data-run="Glossaire visuel" data-col="brand"><div class="blk chead kwn c-brand span"><div class="ch-txt"><div class="ch-k">Fin de manuel</div><h2>🔤 Glossaire visuel</h2><p>Les mots de chaque chapitre, avec un schéma, une définition et une phrase pour les réutiliser.</p></div></div>`
  + CH.map(({ c }) => `<div class="blk gh2 kwn c-${c.col}" data-sec="g-${c.id}"><span class="gh2-i">${c.n}</span><span class="gh2-t"><small>Chapitre ${c.n}</small>${c.titre}</span></div>` + c.words.slice(0, WORDS).map(w => card(w, c)).join('')).join('') + `</section>`;

/* ---------- corrigé complet (version professeur) ---------- */
const corr = `<section class="sec corr" data-key="corr" data-recto="1" data-run="Corrigé · version professeur" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Version professeur</div><h2>✔️ Corrigé complet</h2><p>Automatismes, point de départ, résolu à compléter, exercices, problèmes et évaluations : chaque réponse avec son calcul posé et, quand c’est utile, une phrase de réponse. Les pages des chapitres portent aussi les réponses en rouge, et ce corrigé détaillé là où il reste de la place. Tous les résultats sont calculés et contrôlés par programme.</p></div></div>`
  + CH.map(({ c, key }) => `<div class="blk cc kwn c-${c.col}"><h3>Chapitre ${c.n} · ${c.titre} <small>(p. <span data-pageof="${c.id}">…</span>)</small></h3></div>` + key.map(k => `<div class="blk cc ${k.eid ? "kq" : "kx"} c-${c.col}">${k.det}</div>`).join('')).join('') + dnbCorr + `</section>`;

/* ---------- annexe : détail des calculs (manuel professeur calqué sur le manuel élève) ---------- */
const REFP = (() => { try { return JSON.parse(fs.readFileSync(path.join(HERE, 'ref', 'eleve-ref.json'), 'utf8')).pages; } catch (e) { return {}; } })();
const pgOfDet = id => { const k = REFP['x|' + id] ? 'x|' + id : /-dep$/.test(id) ? 'dep|' + id.replace(/-dep$/, '') : /-auto$/.test(id) ? 'auto|' + id.replace(/-auto$/, '') : 'det|' + id; return REFP[k] || 0; };
const NUMS = (() => { try { return JSON.parse(fs.readFileSync(path.join(HERE, 'ref', 'eleve.result.json'), 'utf8')).num || {}; } catch (e) { return {}; } })();
const idOf1 = k => k.eid || ((k.det.match(/data-did="([^"]+)"/) || [])[1] || '');
const pgOf1 = k => pgOfDet(idOf1(k)) || 999, numOf1 = k => (NUMS[idOf1(k)] != null ? NUMS[idOf1(k)] : 0);
const withPg = h => h.replace(/<div class="dz-e" data-did="([^"]+)"><p class="dz-t">/g, (m, id) => m + (pgOfDet(id) ? `<span class="pgel">📖 p. ${pgOfDet(id)}</span>` : ''));
const annexe = `<section class="sec corr" data-key="corr" data-recto="1" data-run="Annexe · détail des calculs · version professeur" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Annexe · version professeur</div><h2>🧮 Détail des calculs</h2><p>Les pages 1 à ${'${N}'} de ce manuel sont les mêmes que celles du manuel de l’élève (même numérotation, mêmes exercices, mêmes données) : les réponses courtes y sont écrites en rouge dans les pointillés. Cette annexe donne le détail : chaque réponse avec son calcul posé. La pastille « 📖 p. N » renvoie à la page de l’exercice, identique dans les deux manuels. Les résultats sont calculés et contrôlés par programme.</p></div></div>`
  + CH.map(({ c, key }) => `<div class="blk cc kwn c-${c.col}"><h3>Chapitre ${c.n} · ${c.titre} <small>(p. <span data-pageof="${c.id}">…</span>)</small></h3></div>` + key.map((k, i) => [k, i]).sort((a, b) => (pgOf1(a[0]) - pgOf1(b[0])) || (numOf1(a[0]) - numOf1(b[0])) || (a[1] - b[1])).map(([k]) => `<div class="blk cc ${k.eid ? 'kq' : 'kx'} c-${c.col}">${withPg(k.det)}</div>`).join('')).join('') + withPg(dnbCorr) + `</section>`;

const AX = require('./annex3')({ DATA, COMPS, CPS, ORD, esc });
/* ---------- styles et document ---------- */
const SRC = path.join(HERE, 'style');
const FONTS = fs.readFileSync(path.join(SRC, 'fonts.css'), 'utf8');
const ROOT = `:root{--ink:#1D2240;--soft:#545B7A;--brand:#9A5B00;--accent:#F5A300;--c-pop:#B8336A;--t-pop:#FCE1EC;--c-ciel:#0E6BA8;--t-ciel:#DCEFFA;
--c-verbe:#1E7F45;--t-verbe:#DCF4E4;--c-algebre:#C2332A;--t-algebre:#FDE3E0;--c-nombre:#1D5FC2;--t-nombre:#E0EBFD;--c-fonction:#B05200;--t-fonction:#FFE7D1;
--c-geometrie:#7438C0;--t-geometrie:#EEE3FB;--c-mesure:#08767C;--t-mesure:#D6F2F2;--c-algo:#AA2272;--t-algo:#FBE0EF;--c-donnees:#755C00;--t-donnees:#FFF0B8}
${['verbe', 'algebre', 'nombre', 'fonction', 'geometrie', 'mesure', 'algo', 'donnees', 'pop', 'ciel'].map(c => `.c-${c}{--cc:var(--c-${c});--tt:var(--t-${c})}`).join('\n')}`;
const FALL = `'Noto Color Emoji','DejaVu Sans','DejaVu Math TeX Gyre',sans-serif`;
const CSS = ['print.css', 'n3.css', 'mcv.css', 'v3.css'].map(f => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n')
  .replace(/font-family:'Nunito Sans','Noto Color Emoji',sans-serif/g, `font-family:'Nunito Sans',${FALL}`)
  .replace(/font-family:'Nunito Sans','Noto Color Emoji',sans-serif/g, `font-family:'Nunito Sans',${FALL}`)
  .replace(/font-family:'Nunito Sans','Nunito Sans',sans-serif/g, `font-family:'Nunito Sans',${FALL}`)
  .replace(/'Nunito Sans'(?=\s*[;}])/g, `'Nunito Sans',${FALL}`)
  + `
.page.cover2{padding:0}.cvfull,.cvfull svg{width:210mm;height:297mm;display:block}
.cvsvg text{font-family:'Nunito Sans',${FALL}}
.niv{font:800 8.6pt 'Nunito Sans',${FALL};border-radius:99px;padding:.5mm 2.8mm;white-space:nowrap;border:1.6px solid #1D2240;color:#1D2240}.niv-a{background:#DCF4E4}.niv-d{background:#FDE3E0}.niv-n{margin:0 0 1.6mm;padding:1.2mm 3mm;border-left:5px solid var(--cc);background:var(--tt);border-radius:2mm;font-size:9.8pt}
.pool.stk{display:block;font-size:11pt}.pool.stk>.exh{margin-bottom:1.6mm}
.optn{font:800 8.4pt 'Nunito Sans',${FALL};color:var(--cc);background:var(--tt);border-radius:3mm;padding:.3mm 2.2mm;margin-right:2mm;white-space:nowrap}.pool .optn-e{display:none}.pool.evb .optn-s{display:none}.pool.evb .optn-e{display:inline}.pool .optn-r{display:none}.pool.rap .optn-s,.pool.rap .optn-e,.pool.rap .optn-l{display:none}.pool.rap .optn-r{display:inline}.pool .optn-l{display:none}.pool.vinl .optn-l{display:inline}.pool.vinl .optn-s{display:none}.pool .optn-g{display:none}.pool.vinl.again .optn-l{display:none}.pool.vinl.again .optn-g{display:inline}
.owner{display:grid;grid-template-columns:auto 1fr auto 40mm;gap:3mm;align-items:end;font:800 11pt 'Nunito Sans',${FALL};color:#1D2240;margin-top:4mm}.owner i{border-bottom:2px dashed #9aa3c7;height:8mm}
.ccfhow{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin:3mm 0}.ccfhow div{border:2px solid var(--cc);border-radius:4mm;padding:2.4mm 3.4mm;background:var(--tt)}.ccfhow b{display:block;font:800 12pt 'Nunito Sans',${FALL};color:#1D2240}.ccfhow span{font-size:10pt;line-height:1.3}.ccfadv{border-left:5px solid var(--cc);background:#FFFBEA;border-radius:3mm;padding:2mm 4mm;font-size:10.4pt}.ccfctx{font-size:10.6pt;margin:1mm 0 2mm}
.evccf{font-size:9.6pt;margin:1.4mm 0 0;color:#545B7A}.appel3{margin:1.6mm 0 .4mm;border:2px dashed var(--cc);border-radius:3mm;padding:1.4mm 3mm;font-size:9.8pt;background:#fff}.appel3 b{color:var(--cc)}
.tbl.cons2{width:100%;font-size:10.2pt}.tbl.cons2 td,.tbl.cons2 th{text-align:left;border:1px solid #C9D1EA;padding:1mm 2.4mm}.tbl.cons2 td:nth-child(2){font-weight:700}
.mt3{border:2px solid var(--cc);border-radius:5mm;background:var(--tt);padding:2.6mm 4mm;margin:2mm 0}.mt3-h{font:800 12pt 'Nunito Sans',${FALL};color:var(--cc);margin-bottom:1.4mm}.mt3-g{display:grid;grid-template-columns:1.5fr 1fr;gap:4mm}.mt3-n{font:800 11.5pt 'Nunito Sans',${FALL};color:#1D2240}.mt3 p{margin:.8mm 0;font-size:10.4pt;line-height:1.3}.mt3-m{color:#2d3356}.mt3-a{background:#fff;border-radius:3mm;padding:1.6mm 2.6mm;border:1.4px dashed var(--cc)}.mt3-k{display:block;font:800 9pt 'Nunito Sans',${FALL};text-transform:uppercase;letter-spacing:.04em;color:var(--cc);margin-bottom:.6mm}.mt3-a ul{margin:0;padding-left:4mm;font-size:10pt;line-height:1.3}
.ev-p2{margin:0 0 2mm;padding:1.6mm 3mm;border-radius:3mm;background:var(--tt);font:800 10.4pt 'Nunito Sans',${FALL};color:#1D2240}
.pgel{margin-left:auto;font:800 8pt 'Nunito Sans',${FALL};color:#1D2240;background:#fff;border:1.4px solid #8F98BD;border-radius:99px;padding:.1mm 2.2mm;white-space:nowrap;flex:none}.fl-h .pgel,.dep3-h .pgel,.nt3-h .pgel,.evx-h .pgel,.evh-t .pgel{margin-left:3mm;float:right}
.cp-app{background:#E0EBFD;color:#173F86}.cp-ana{background:#EEE3FB;color:#4F2390}.cp-rea{background:#DCF4E4;color:#14572F}.cp-val{background:#FFE7D1;color:#7A3A00}.cp-com{background:#FBE0EF;color:#7A1850}
.cpc-app{--tt:#E0EBFD}.cpc-ana{--tt:#EEE3FB}.cpc-rea{--tt:#DCF4E4}.cpc-val{--tt:#FFE7D1}.cpc-com{--tt:#FBE0EF}
.op3-sc svg{max-height:25mm!important}.op3-sc{margin:1.4mm 0!important;padding:.6mm 4mm!important}.op3-q p{font-size:11pt!important;margin-top:1mm!important}.op3-o{margin-top:1.6mm!important;font-size:10pt!important}
.evred{margin:2mm 0 0;border:2px dashed var(--cc);border-radius:3mm;padding:1.8mm 3.4mm;font-size:10.2pt;background:#FFFBE0}
`;
const CALQUE_KEEP = [...CSS.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(m => /^\s*\.prof\s/.test(m[1]) && /::after|\.ok\b|\btg-|\.cwl|\.pa\b/.test(m[1]) && !/\.(dq|dz|pb3|palh3|bulle|pouce|corrq|prof-only|el-only|ex)\b/.test(m[1])).map(m => m[0].replace(/\.prof(?![\w-])/g, '.calque')).join('\n');
const CSS_CALQUE = CSS.replace(/\.prof(?![\w-])/g, '.xprof') + '\n' + CALQUE_KEEP + '\n.pgel{margin-left:3mm}.dz-t .pgel{float:right;margin-left:3mm}\n' + fs.readFileSync(path.join(HERE, 'style', 'calque-fx.css'), 'utf8') + fs.readFileSync(path.join(HERE, 'style', 'annex3.css'), 'utf8');
const PAG = fs.readFileSync(path.join(HERE, 'lib', 'svgfit.js'), 'utf8') + '\n' + fs.readFileSync(path.join(HERE, 'lib', 'paginate.js'), 'utf8');
const TPL = `<template id="notesTpl"><div class="blk notes"><h3>📝 Mes notes</h3><div class="lines"></div></div></template>`;
const FOOT = 'Maths · CAP // T. Rougeaud';
const typo = h => h.split(/(<pre[\s\S]*?<\/pre>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>)/).map((part, i) => i % 2 ? part : part.replace(/>([^<]+)</g, (m, t) => '>' + t.replace(/ ([?!:;»])/g, ' $1').replace(/« /g, '« ').replace(/(\d) (%|€)/g, '$1 $2').replace(/([+−]) (\d)/g, '$1 $2') + '<')).join('');
const anchors = h => h.replace(/(<section [^>]*data-key="([^"]+)"[^>]*>)<div class="blk/g, '$1<div id="k-$2" class="blk').replace(/ data-sec="([^"]+)"/g, ' id="k-$1" data-sec="$1"');
const detsHtml = (pred = () => true) => `<div id="dets" hidden>${DETS.filter(pred).map(d => `<div class="dz-src" data-for="${d.id}">${d.h}</div>`).join('')}</div>`;

// surligne automatiquement les données chiffrées (nombre + unité, €, %, °) dans les énoncés d’exercices
const hlText = require('./lib/hl');
const hlAuto = h => h.replace(/(<p class="tr-c">)([\s\S]*?)(<\/p>)/g, (m, a, b, c) => a + hlText(b) + c);
const MH = h => require('./lib/mathify').html(h, t => { try { return TEX.kx(t); } catch (e) { return null; } });
const REFS = f => { try { return fs.readFileSync(path.join(HERE, 'ref', f), 'utf8'); } catch (e) { return ''; } };
const doc = (title, body, cls, dp, refFile) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${FONTS}\n${TEX.css()}\n${ROOT}\n${cls === 'calque' ? CSS_CALQUE : CSS}</style></head>
<body class="${cls}" data-foot="${esc(cls === 'prof' || cls === 'calque' ? FOOT + ' · Spécimen enseignant' : FOOT)}"><div id="flow">${anchors(MH(typo(hlAuto(body))))}</div><div id="out"></div>${cls === 'prof' && refFile && REFS(refFile) ? `<script>window.__REF=${REFS(refFile)}</script>` : ''}${cls === 'prof' ? MH(typo(detsHtml(dp))) : ''}${TPL}${MH(typo(FLASH.join('')))}<script>${cls === 'calque' ? fs.readFileSync(path.join(HERE, 'lib', 'calque.js'), 'utf8') + '\n' : ''}${PAG}</script></body></html>`;
const pBlank = `<div class="page blank" data-recto="0"></div>`;
const front = pCover + pBlank + pGuide + pComp + pToc;
const frontP = pCoverP + pBlank + pGuide + pComp + pToc;
const pTocC = pToc.replace(/(<span data-pageof="glo">…<\/span><\/span><\/div>)(<\/div>)/, '$1<div class="tc2 ann"><span class="tn2">🧮</span><div><b>Annexes · version professeur</b><span>Calculs p. <span data-pageof="corr">…</span> · Compétences p. <span data-pageof="acomp">…</span> · Passation du CCF p. <span data-pageof="adnb">…</span> · Référentiel p. <span data-pageof="aref">…</span></span></div><span class="tp2"><span data-pageof="corr">…</span></span></div>$2');
const pTocC2 = pTocC.replace('<p class="pg-p small" style="margin-top:4mm">', '<p class="pg-p small" style="margin-top:0">');
if (pTocC === pToc) throw new Error('sommaire : annexe non insérée');
const frontC = pCoverP + pBlank + pGuide + pComp + pTocC2;
fs.writeFileSync(path.join(B, 'eleve.html'), doc('Maths · CAP — manuel', front + pontSec + chapSecs + dnbSecs + repSec + glo, 'eleve'));
fs.writeFileSync(path.join(B, 'sujets.html'), doc('Maths · CAP — deux CCF blancs', dnbSecs, 'eleve'));
fs.writeFileSync(path.join(B, 'glossaire.html'), doc('Maths · CAP — glossaire visuel', glo, 'eleve'));
fs.writeFileSync(path.join(B, 'prof.html'), doc('Maths · CAP — version professeur', frontP + pontSec + pontProf + chapSecs + dnbSecs + repSec + glo, 'prof', undefined, 'eleve-ref.json'));
fs.writeFileSync(path.join(B, 'calque.html'), doc('Maths · CAP — version professeur (calquée sur le manuel élève)', frontC + pontSec + chapSecs + dnbSecs + repSec + glo + annexe.replace('${N}', String(REFP && Object.keys(REFP).length ? JSON.parse(fs.readFileSync(path.join(HERE, 'ref', 'eleve-ref.json'), 'utf8')).total : 166)) + AX.acomp + AX.adnb + AX.aref, 'calque'));
fs.writeFileSync(path.join(B, 'sujets-prof.html'), doc('Maths · CAP — CCF blancs · version professeur', dnbSecs, 'prof', d => /^dnb/.test(d.id), 'sujets-ref.json'));
const nEx = CH.reduce((a, x) => a + x.rep.filter(r => !r.opt).length + x.c.probs.length, 0);
fs.writeFileSync(path.join(B, 'log.json'), JSON.stringify({ version: 3, chapitres: DATA.map(c => ({ id: c.id, n: c.n, titre: c.titre })), exercices: nEx, mots: DATA.reduce((a, c) => a + c.words.length, 0) }, null, 1));
console.log(`chapitres : ${DATA.length} · exercices du manuel : ${nEx} · contrôles de calcul : OK`);
