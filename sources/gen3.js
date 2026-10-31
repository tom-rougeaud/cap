/* Construit le manuel « Maths · CAP » (classes préparant au CAP), version 3 (HTML à paginer), version élève et version professeur.
   Usage : node gen3.js → build/eleve.html, build/prof.html, build/log.json */
'use strict';
const fs = require('fs'), path = require('path');
const { esc, bl, opt, lines, cp } = require('./lib/util');
const { cover } = require('./lib/cover2');
const TEX = require('./lib/tex');
const { SC, CP } = require('./lib/scenes3e');
const { S, T, Rc, Ar } = require('./lib/visu');
const K3 = require('./content/kit3e');
const HERE = __dirname, B = path.join(HERE, 'build');
fs.mkdirSync(B, { recursive: true });

const { MCVT } = require('./shared/train.js');
const AUTO = require('./shared/auto3.js');
const QR = JSON.parse(fs.readFileSync(path.join(HERE, 'lib', 'qr.json'), 'utf8'));
const ERR = [];
const chk = (ok, msg) => { if (!ok) ERR.push(msg); };
const DATA = require('./content')(chk);
if (ERR.length) { console.error('Contrôles de calcul en échec :', ERR); process.exit(1); }
/* corrigés détaillés (version professeur) : calcul posé et phrase de réponse, question par question */
const DET = require('./content/det3'), DETUSED = new Set();
const attach = (key, qs) => { const d = DET[key]; if (!d) return; DETUSED.add(key); chk(d.length === qs.length, `détails ${key} : ${d.length} textes pour ${qs.length} questions`); qs.forEach((q, i) => { if (d[i]) q.x = d[i]; }); };
DATA.forEach(c => { c.probs.forEach(p => attach(`${c.id}.${p.id}`, p.qs)); attach(`${c.id}.au`, c.eval.auto); c.eval.exos.forEach((x, j) => attach(`${c.id}.ev${j}`, x.qs)); });
const DNB = fs.existsSync(path.join(HERE, 'content', 'ccf3.js')) ? require('./content/ccf3')(chk) : [];
const Psub = h => String(h).replace(/P_([A-Z][\u0304]?)\(/g, 'P<sub>$1</sub>(');
/* une entrée de corrigé détaillé : titre, puis une ligne par question (calcul et phrase, sinon la réponse courte) */
const DETS = [];
const detBlock = (id, titre, items) => { const h = `<div class="dz-e"><p class="dz-t">${titre}</p><ol class="dz-l">${items.map(([l, t, extra]) => `<li><b>${l}</b> ${Psub(t)}${extra ? ` <i>${extra}</i>` : ''}</li>`).join('')}</ol></div>`; DETS.push({ id, h }); return h; };
const seedOf = s => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const L = 'abcdefghijklmnop';
const CPS = { app: 'S’approprier', ana: 'Analyser', rea: 'Réaliser', val: 'Valider', com: 'Communiquer' };
const ORD = ['app', 'ana', 'rea', 'val', 'com'];
const ptsTxt = p => `${String(p).replace('.', ',')} pt${p > 1 ? 's' : ''}`;
const AST = { vite: ['⚡', 'Calculer vite'], og: ['🎯', 'Estimer'], sens: ['💡', 'Donner du sens'], verif: ['✅', 'Vérifier'] };
/* case vide d’un exercice résolu à compléter : ⟦réponse⟧ */
const trou = h => h.replace(/⟦([^⟧]+)⟧/g, (m, a) => `<span class="bl tr3" style="width:${Math.max(14, Math.min(46, a.replace(/<[^>]+>/g, '').length * 2.4 + 6))}mm" data-a="${esc(a)}"></span>`);
const trouTxt = h => h.replace(/⟦([^⟧]+)⟧/g, '<b>$1</b>');
const qcmOpts = it => `<span class="opts">${it.qcm.choices.map((c, j) => opt(c, j === it.qcm.ok)).join('')}</span>`;

/* ---------- « Ce que tu sais déjà » : du collège au CAP ---------- */
const pontBox = c => `<div class="blk pont3 c-${c.col}"><div class="pont3-h">🔗 Ce que tu sais déjà : ce qui reste, ce qui change au CAP</div><div class="pont3-g"><div class="pont3-a"><span class="pont3-k">Avant le CAP, tu as appris</span><ul>${c.pont.de.map(x => `<li><b class="pont3-n">${x.niv}</b> <i>${esc(x.titre)}</i> : ${x.sais}</li>`).join('')}</ul><p class="pont3-ex"><b>Exemple du collège</b> · ${c.pont.ex2}</p></div><div class="pont3-b"><span class="pont3-k">Au CAP, la même situation va plus loin</span><p class="pont3-ex">${c.pont.ex1}</p></div></div><div class="pont3-g3"><div><span class="pont3-k">✅ Ce qui reste</span><ul>${c.pont.reste.map(x => `<li>${x}</li>`).join('')}</ul></div><div><span class="pont3-k">➕ Ce qui change</span><ul>${c.pont.change.map(x => `<li>${x}</li>`).join('')}</ul></div><div><span class="pont3-k">🎯 À quoi ça sert</span><p>${c.pont.pourquoi}</p></div></div></div>`;
/* ---------- un chapitre ---------- */
function chapter(c) {
  const col = c.col, R = id => `<b data-numof="${c.id}-${id}">·</b>`;
  const nivB = e => e.niv ? `<span class="niv niv-${e.niv > 0 ? 'd' : 'a'}">${e.niv > 0 ? '🚀 Défi' : '🌱 Guidé'}</span>` : '';
  const nivNote = e => e.niv ? `<p class="niv-n">${e.niv > 0 ? `Tu as réussi l’exercice ${R(e.base)} ? Voici le même thème, avec un défi en plus.` : `Si l’exercice ${R(e.base)} te résiste, commence ici : même thème, nombres plus simples, début déjà fait.`}</p>` : '';
  const nivT = e => e.niv ? (e.niv > 0 ? '🚀 ' : '🌱 ') : '';
  const fixed = [], ex = [], key = [], rep = [];
  /* 1. ouverture : la scène de pop culture */
  fixed.push(`<div class="blk op3 c-${col}"><div class="op3-h"><div><div class="ch-k">Chapitre ${c.n} · ${esc(c.dom)}</div><h2 class="fit">${c.titre}</h2><div class="op3-sous">${esc(c.sous)}</div></div><div class="qrbox">${QR[c.id].svg}<span>Ce chapitre<br>dans l’appli</span></div></div>
    <div class="op3-sc">${SC[c.id]()}</div>
    <div class="op3-q"><span class="op3-k">🎬 La scène</span><span class="mt-r">${c.metier.roles.map(r => `<span>${r}</span>`).join('')}</span><p>${c.travail.question}</p></div>
    <div class="op3-o"><b>Le plan du chapitre</b><div class="plan3">${c.parties.map((p, k) => `<div class="plan3-p${p.n.some(j => c.notions[j - 1].hp) ? ' hp' : ''}"><span class="plan3-l">${'ABCDE'[k]}</span><div><b>${p.t}</b><span>${p.n.map(j => `${j}. ${c.notions[j - 1].titre}`).join(' · ')}</span></div></div>`).join('')}</div><b>Dans ce chapitre</b><ul>${c.objectifs.map(o => `<li>${o}</li>`).join('')}</ul></div></div>`);
  fixed.push(pontBox(c));
  /* 2. point de départ : un document du métier, 5 questions */
  const dp = MCVT.dep(c.depart, seedOf(c.id + '-dep'));
  fixed.push(`<div class="blk dep3 c-${col}" data-sec="${c.id}-dep" data-det="${c.id}-dep"><div class="dep3-h"><span class="ic">🚀</span>Point de départ<span class="sec-sub">un document · 5 questions · sans calculatrice</span></div><div class="dep3-g"><div class="dep3-doc"><div class="dep3-t">${dp.titre}</div>${dp.doc}</div><ol class="dep3-q">${dp.qs.map(q => `<li><span class="dq-t">${q.t}</span>${q.kind === 'qcm' ? `<span class="opts">${q.choices.map((x, j) => opt(x, j === q.ok)).join('')}</span>` : bl(24, q.a)}</li>`).join('')}</ol></div></div>`);
  key.push({ k: 'dep', det: detBlock(`${c.id}-dep`, `🚀 Point de départ · ${dp.titre}`, dp.qs.map((q, i) => [`${i + 1}.`, q.x || q.a])) });
  /* 3. la leçon : une notion par page, dans l’ordre logique : je découvre → la méthode → la solution → je retiens → à moi */
  c.notions.forEach((nt, i) => {
    const pi = c.parties.findIndex(p => p.n.includes(i + 1));
    fixed.push(`<div class="blk nt4 pgb c-${col}"${i ? '' : ` data-sec="${c.id}-cours"`}><div class="nt3-k">📘 La leçon · notion ${i + 1} sur ${c.notions.length} · Partie ${'ABCDE'[pi]} · ${c.parties[pi].t}</div><div class="nt3-h"><span class="lc-n">${i + 1}</span>${nt.titre}</div>
<div class="nt4-d"><div><span class="t3">🔎 Je découvre</span><p>${nt.decouvre.txt}</p></div><div class="nt4-img">${nt.decouvre.img}</div></div>
<div class="nt4-m"><span class="t3">🧭 La méthode, pas à pas</span><ol class="nt4-s">${nt.methode.map(m => `<li>${m}</li>`).join('')}</ol><div class="nt4-v">${nt.vois}</div></div>
<div class="nt4-sol"><span class="nt4-sk">✅ La solution</span><div>${nt.solution}</div></div><div class="nt4r"><div class="nt4-rg"><div class="lc-r"><span class="lc-t">📌 Je retiens</span>${nt.retiens}</div><div class="att">⚠️ <b>Attention</b> · ${nt.attention}</div></div><div class="nt4-a"><span class="t3">✏️ À moi</span><ol>${nt.amoi.map(([q, a]) => `<li><span>${q}</span>${bl(30, a)}</li>`).join('')}</ol></div></div></div>`);
  });
  fixed.push(`<div class="blk mk3 c-${col}"><div class="lc-h"><span class="lc-n">🔤</span>Les mots à connaître</div><table class="tbl mkt3"><tr><th>Le mot</th><th>Ce qu’il veut dire</th><th>En exemple</th></tr>${c.mots.map(r => `<tr><td class="mk-w">${r[0]}</td><td>${r[1]}</td><td class="mk-x">« ${r[2]} »</td></tr>`).join('')}</table></div>`);
  /* 4. méthodes : un résolu complet, un résolu à compléter */
  fixed.push(`<div class="blk sec-h kwn" data-sec="${c.id}-meth"><span class="ic">🧭</span>Méthodes<span class="sec-sub">un exercice résolu, puis le même à compléter</span></div>`);
  c.resolus.forEach((r, i) => {
    const td = r.trous ? trou : (x => x);
    fixed.push(`<div class="blk rs${r.trous ? ' rs2' : ''} c-${col}"><div class="rs-h"><span class="rs-k">${r.trous ? '✍️ À toi' : 'Exercice résolu'}</span><span class="rs-t">${r.titre}</span>${r.outil ? `<span class="outil">${r.outil}</span>` : ''}</div><div class="rs-en">${r.enonce}${r.doc ? `<div class="rs-doc">${r.doc}</div>` : ''}</div><table class="rs-t2"><tr><th>Ce que j’écris</th><th>Pourquoi je le fais</th></tr>${r.rows.map((x, j) => `<tr><td class="rs-w"><span class="rs-s">${j + 1}</span><span>${td(x[0])}</span></td><td class="rs-x">${x[1]}</td></tr>`).join('')}</table><p class="rs-ver">🔁 <b>Je vérifie</b> · ${r.verif}</p><p class="rs-rep">✅ ${r.trous ? `<span class="prof-only inl">${r.rep}</span><span class="el-only">Ma réponse : ${bl(90)}</span>` : r.rep}</p><p class="rs-go">➜ Je m’entraîne : exercice${r.go.length > 1 ? 's' : ''} ${r.go.map(R).join(' et ')}</p></div>`);
    if (r.trous) key.push({ k: 'r2', det: detBlock(`${c.id}-r2`, `✍️ À toi (méthodes) · ${r.titre.replace(/^À toi : /, '')}`, [...r.rows.map((x, j) => [`${j + 1}.`, trouTxt(x[0]), x[1]]), ['✅', r.rep]]) });
  });
  /* 5. je m’entraîne : 3 exercices à support visuel (tirage fixe ; d’autres nombres dans l’appli) */
  ex.push(`<div class="blk ex palh palh3 kwn keep" data-stage="1" data-sec="${c.id}-x"><span class="ph-i">✏️</span><b>Je m’entraîne</b><span>Un support à compléter, des cases lettrées. Réponses p. <span data-pageof="rep-${c.id}">…</span> ; d’autres nombres dans l’appli.</span></div>`);
  c.entraine.forEach(e => {
    const g = MCVT.tr(e.gen, seedOf(c.id + '-' + e.id)), eid = c.id + '-' + e.id;
    const outside = g.items.filter(it => !g.support.includes(`data-k="${it.k}"`) && !g.support.includes(`class="sbk">${it.k}<`));
    const extra = outside.length ? `<div class="tr-q">${outside.map(it => `<div class="tr-qi"><span class="mg-l">${it.k}.</span>${it.qcm ? qcmOpts(it) : bl(30, it.a)}</div>`).join('')}</div>` : '';
    key.push({ eid, titre: g.titre, det: detBlock(eid, `<b class="cn" data-numof="${eid}">·</b> ${nivT(e)}${g.titre}`, g.items.map(it => [`${it.k}.`, it.x || it.a])) });
    ex.push(`<div class="blk ex tr3 c-${col}" data-eid="${eid}" data-det="${eid}" data-stage="1"><div class="exh"><span class="num">·</span>${nivB(e)}<span class="ext">${g.titre}</span><span class="cps"><span class="lcref">notion ${e.lc}</span></span></div><div class="exb">${nivNote(e)}<p class="tr-c">${g.consigne}</p><div class="tr-s">${g.support}</div>${extra}</div></div>`);
    rep.push({ eid, titre: nivT(e) + g.titre, txt: g.items.map(it => `${it.k}. ${it.a}`).join(' ; ') });
  });

  /* réserve : d’autres tirages des exercices « Je m’entraîne ». La mise en page ne les pose que dans la place restée vide d’une page (jamais de page en plus). */
  const evPool = [];
  {
    const base = c.entraine.filter(e => !e.niv), cnt = {}; base.forEach(e => { cnt[e.lc] = (cnt[e.lc] || 0) + 1; });
    const sig = g => g.support + '|' + g.items.map(it => it.a).join(';');
    base.slice().sort((a, b) => cnt[a.lc] - cnt[b.lc]).forEach(e => {
      const seen = new Set([sig(MCVT.tr(e.gen, seedOf(c.id + '-' + e.id)))]);
      ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].forEach(sfx => {
        const rid = e.id + sfx, eid = c.id + '-' + rid, g = MCVT.tr(e.gen, seedOf(c.id + '-' + rid)), isEv = sfx === 'r4';
        if (seen.has(sig(g))) return; seen.add(sig(g));
        const outside = g.items.filter(it => !g.support.includes(`data-k="${it.k}"`) && !g.support.includes(`class="sbk">${it.k}<`));
        const extra = outside.length ? `<div class="tr-q">${outside.map(it => `<div class="tr-qi"><span class="mg-l">${it.k}.</span>${it.qcm ? qcmOpts(it) : bl(30, it.a)}</div>`).join('')}</div>` : '';
        detBlock(eid, `<b class="cn" data-numof="${eid}">·</b> ${g.titre}`, g.items.map(it => [`${it.k}.`, it.x || it.a]));
        const html = `<div class="blk ex tr3 opt${isEv ? ' evb' : ''} c-${col}" data-eid="${eid}" data-det="${eid}" data-stage="1" data-src="${c.id}-${e.id}" data-lc="${e.lc}"><div class="exh"><span class="num">·</span><span class="ext">${g.titre}</span><span class="cps"><span class="optn optn-s">autres nombres · comme l’exercice <b data-numof="${c.id}-${e.id}">·</b></span><span class="optn optn-l">à toi, tout de suite</span><span class="optn optn-g">encore une fois · autres nombres</span><span class="optn optn-e">pour t’entraîner encore · hors barème</span><span class="lcref">notion ${e.lc}</span></span></div><div class="exb"><p class="tr-c">${g.consigne}</p><div class="tr-s">${g.support}</div>${extra}</div></div>`;
        (isEv ? evPool : ex).push(html);
        rep.push({ eid, titre: g.titre, txt: g.items.map(it => `${it.k}. ${it.a}`).join(' ; '), opt: 1 });
      });
    });
  }
  /* rappel : des exercices d’avant (autres nombres). Au « Point de départ » : ceux du chapitre précédent ; ailleurs, seulement si une page garde de la place vide (jamais de page en plus). */
  {
    const ci = DATA.indexOf(c), prev = ci > 0 ? DATA[ci - 1] : null; let nr = 0, ne = 0;
    const addRap = (g, eid, srcId, titre, dep, free, isEv) => {
      const outside = g.items.filter(it => !g.support.includes(`data-k="${it.k}"`) && !g.support.includes(`class="sbk">${it.k}<`));
      const extra = outside.length ? `<div class="tr-q">${outside.map(it => `<div class="tr-qi"><span class="mg-l">${it.k}.</span>${it.qcm ? qcmOpts(it) : bl(30, it.a)}</div>`).join('')}</div>` : '';
      detBlock(eid, `<b class="cn" data-numof="${eid}">·</b> ${g.titre}`, g.items.map(it => [`${it.k}.`, it.x || it.a]));
      const html = `<div class="blk ex tr3 opt rap${isEv ? ' evb' : ''} c-${col}" data-eid="${eid}" data-det="${eid}" data-stage="1"${dep ? ' data-dep="1"' : ''} data-rap="1"${free ? ' data-free="1"' : ''} data-src="${srcId}"><div class="exh"><span class="num">·</span><span class="ext">${g.titre}</span><span class="cps"><span class="optn optn-r">je me rappelle · ${titre}</span></span></div><div class="exb"><p class="tr-c">${g.consigne}</p><div class="tr-s">${g.support}</div>${extra}</div></div>`;
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
  /* Je programme avec Scratch : un programme à lire, une question */
  (c.scratch || []).forEach((sx, j) => {
    const eid = `${c.id}-s${j + 1}`;
    ex.push(`<div class="blk ex scr3 c-${col}" data-eid="${eid}" data-det="${eid}" data-stage="1"><div class="exh"><span class="num">·</span><span class="ext">🐱 Je programme · ${sx.titre}</span><span class="cps"><span class="lcref">notion ${sx.lc}</span><span class="outil">Scratch</span></span></div><div class="exb"><p class="tr-c">${sx.texte}</p><div class="scr4"><div class="scr-w">${K3.scratchSvg(sx.prog, sx.titre)}</div><ol class="scr4-q">${sx.qs.map(([q, a]) => `<li><span>${q}</span>${bl(34, a)}</li>`).join('')}</ol></div></div></div>`);
    key.push({ eid, titre: sx.titre, det: detBlock(eid, `<b class="cn" data-numof="${eid}">·</b> Scratch · ${sx.titre}`, sx.qs.map(([q, a, x], k) => [`${L[k]}.`, x || a])) });
    rep.push({ eid, titre: 'Scratch · ' + sx.titre, txt: sx.qs.map(([q, a], k) => `${L[k]}. ${a}`).join(' ; ') });
  });
  /* 6. je résous : 5 problèmes (un guidé, trois de niveau courant dont un « vers le CCF », un défi) */
  ex.push(`<div class="blk ex palh palh3 kwn keep" data-stage="2"><span class="ph-i">🧩</span><b>Je résous</b><span>Des situations de pop culture, avec de vraies données. Je lis tout l’énoncé, je surligne les données, je dis ce que je cherche.</span></div>`);
  const ET = { 2: 'Petit problème', 3: 'Cas pratique', 4: 'Vers le CCF' };
  c.probs.forEach(p => {
    const eid = c.id + '-' + p.id;
    if (p.bulle) ex.push(`<div class="blk ex bulle kwn keep c-${col}" data-stage="${p.etape}"><span class="bl-i">💬</span><p>${p.bulle}</p></div>`);
    const badge = (p.niv ? nivB(p) : '') + (p.defi ? `<span class="defi">Défi · ${p.defi} étapes</span>` : `<span class="et3b">${ET[p.etape]}</span>`);
    const autr = p.autravail ? `<div class="autr"><span class="cp cp-${p.autravail.comp}">${CPS[p.autravail.comp]}</span><span>🧑‍🔧 <b>Dans un métier, cela sert à</b> ${p.autravail.txt}</span></div>` : '';
    const pouce = p.pouce ? `<div class="pouce-inv"><span>💡 Coup de pouce · exercice <b data-numof="${eid}">·</b> : ${p.pouce}</span></div>` : '';
    ex.push(`<div class="blk ex pb3${p.cls ? ' ' + p.cls : ''} c-${col}" data-eid="${eid}" data-det="${eid}" data-stage="${p.etape}"><div class="exh"><span class="num">·</span>${badge}<span class="ext">${p.titre}</span><span class="cps">${p.lc ? `<span class="lcref">notion ${Math.min(p.lc, c.notions.length)}</span>` : ''}${(p.comps || []).map(cp).join('')}</span></div><div class="exb">${p.niv ? nivNote(p) : ''}${p.body}</div>${autr}${pouce}</div>`);
    key.push({ eid, titre: p.titre, det: detBlock(eid, `<b class="cn" data-numof="${eid}">·</b> ${p.titre}`, p.qs.map(q => [/[.)]$/.test(q.l) ? q.l : q.l + '.', q.x || q.a])) });
  });
  /* 7. le métier derrière la scène, et je sais faire */
  const m = c.metier.job;
  ex.push(`<div class="blk ex mt3 keep c-${col}" data-stage="9"><div class="mt3-h">🧑‍🔧 Le métier derrière la scène</div><div class="mt3-g"><div><b class="mt3-n">${m.nom}</b><p>${m.fait}</p><p class="mt3-m">📐 <b>Ses maths</b> · ${m.maths}</p></div><div class="mt3-a"><span class="mt3-k">Après le CAP</span><ul>${m.apres.map(x => `<li>${x}</li>`).join('')}</ul></div></div></div>`);
  const au = AUTO.gen(c.id, seedOf(c.id + '-auto'), 10);
  ex.push(`<div class="blk ex sais3 keep c-${col}" data-stage="9" data-sec="${c.id}-auto" data-det="${c.id}-auto"><div class="exh"><span class="ext">✅ Je fais le point</span></div><div class="exb"><p class="small">Je coche quand je sais faire seul. L’appli coche aussi cette liste au fil des réussites.</p><table class="tbl bilan"><tr><th>Je sais…</th><th>Exercices</th><th>Oui</th><th>Presque</th><th>Pas encore</th></tr>${c.bilan.map(([t, es]) => `<tr><td class="tl">${t.replace(/^Je sais /, '')}</td><td>${es.map(e => /^n\d/.test(e) ? `à moi, notion ${e.slice(1)}` : R(e)).join(', ')}</td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td></tr>`).join('')}</table>
<div class="auto4"><div class="auto3-h"><span class="ic">⚡</span>Automatismes<span class="sec-sub">10 questions · 10 minutes · sans calculatrice · pour garder les bons réflexes</span></div><ol class="auto3-q">${au.map(q => `<li><span>${q.t}</span>${q.choices ? `<span class="opts">${q.choices.map((x, j) => opt(x, j === q.ok)).join('')}</span>` : bl(26, q.a)}</li>`).join('')}</ol></div></div></div>`);
  key.push({ k: 'auto', det: detBlock(`${c.id}-auto`, '⚡ Automatismes', au.map((q, i) => [`${i + 1}.`, q.x || q.a])) });
  /* 8. s’évaluer au format du CCF : partie 1 automatismes, partie 2 situations, 1 point de rédaction */
  const e = c.eval; let k = 0;
  const per = {}; [...e.auto, ...e.exos.flatMap(x => x.qs)].forEach(q => { per[q.comp] = (per[q.comp] || 0) + q.pts; }); per.com = (per.com || 0) + e.redac;
  const evh = `<div class="blk evh c-${col}"><div class="evh-t"><span class="evh-k">🎯 S’évaluer au format du CCF · CAP</span><h2>${c.titre}</h2><p>${e.lieu} · durée : ${e.duree}</p></div><div class="evh-n"><span>Nom</span><i></i><span>Date</span><i></i><b>… / 10</b></div><p class="evccf">Comme au CCF : 45 minutes, sur 10 points. La partie 1 (automatismes) se fait sans calculatrice ; la partie 2 (situations professionnelles) avec la calculatrice. ${ptsTxt(e.redac)} pour la clarté de la rédaction.</p>
<table class="tbl evg evg3 evg6"><tr><th>Compétence</th><th>Ce que je sais faire</th><th>Points</th><th>Insuffisante</th><th>Fragile</th><th>Satisfaisante</th><th>Très bonne</th></tr>${ORD.filter(o => per[o]).map(o => `<tr><td class="tl"><span class="cp cp-${o}">${CPS[o]}</span></td><td class="tl gp">${e.grille[o]}</td><td>${ptsTxt(per[o])}</td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td></tr>`).join('')}</table></div>`;
  const qBlk = (q, det) => { k++; return `<div class="blk evq c-${col}" data-det="${det}"><div class="evq-h"><span class="evq-n">${k}</span><span class="evq-t">${q.t}</span><span class="cp cp-${q.comp}">${CPS[q.comp]}</span><span class="evq-p">${ptsTxt(q.pts)}</span></div>${q.choices ? `<p class="ans">${`<span class="opts">${q.choices.map((x, j) => opt(x, j === q.ok)).join('')}</span>`}</p>` : q.lines ? lines(q.lines, q.a) : `<p class="ans"><span>${q.lab || ''}</span>${bl(q.w || 40, q.a)}</p>`}</div>`; };
  const evAuto = `<div class="blk evx kwn c-${col}" data-det="${c.id}-au"><div class="evx-h"><span class="evx-n">Partie 1</span><span class="evx-t">Automatismes · sans calculatrice · 10 min</span><span class="evx-p">${ptsTxt(e.auto.reduce((a, b) => a + b.pts, 0))}</span></div><p class="evccf">Réponds sans justifier.</p></div>` + e.auto.map(q => qBlk(q, `${c.id}-au`)).join('');
  const evx = e.exos.map((x, i) => `<div class="blk evx kwn c-${col}" data-det="${c.id}-ev${i}">${i === 0 ? `<p class="ev-p2">Partie 2 · Situations professionnelles · 35 min · calculatrice autorisée · justifie tes réponses</p>` : ''}<div class="evx-h"><span class="evx-n">Exercice ${i + 1}</span><span class="evx-t">${x.t}</span><span class="evx-p">${ptsTxt(x.qs.reduce((a, b) => a + b.pts, 0))}</span></div>${x.intro || ''}</div>` + x.qs.map(q => qBlk(q, `${c.id}-ev${i}`)).join(''));
  const evRed = `<div class="blk evred c-${col}">✍️ <b>Rédaction · ${ptsTxt(e.redac)}</b> · phrases complètes, calculs posés, unités, résultats encadrés.</div>`;
  let kq = 0;
  key.push({ k: 'ev', det: detBlock(`${c.id}-au`, '🎯 S’évaluer · partie 1 · automatismes', e.auto.map(q => [`${++kq}.`, q.x || q.a, `(${ptsTxt(q.pts)})`])) });
  e.exos.forEach((x, i) => key.push({ k: 'ev', det: detBlock(`${c.id}-ev${i}`, `🎯 S’évaluer · exercice ${i + 1} · ${x.t}`, x.qs.map(q => [`${++kq}.`, q.x || q.a, `(${ptsTxt(q.pts)})`])) }));
  return { c, fixed, ex, ev: evh + evAuto + evx.join('') + evRed + evPool.join(''), key, rep, fiche: ficheHtml(c) };
}
/* ---------- fiche de révision : une page A4 par chapitre ---------- */
const ficheHtml = c => { const f = c.fiche; return `<div class="blk fiche pgb c-${c.col}" data-sec="fiche-${c.id}"><div class="fi-h"><span class="fi-n">${c.n}</span><div><span class="fi-k">📄 Fiche de révision${c.plus ? ' · ➕ ' + c.plus : ''}</span><h2>${c.titre}</h2></div></div>
<div class="fi-g"><div class="fi-b"><h3>📌 L’essentiel</h3><ul>${f.essentiel.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="fi-b"><h3>🧭 La méthode</h3><ol>${f.methode.map(x => `<li>${x}</li>`).join('')}</ol></div></div>
<div class="fi-ex"><h3>✏️ Un exemple résolu</h3>${f.exemple}</div>
<div class="fi-g"><div class="fi-b fi-att"><h3>⚠️ Les pièges</h3><ul>${f.pieges.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="fi-b"><h3>⚡ Je teste mes réflexes</h3><ol>${f.flash.map(([q, a]) => `<li>${q} ${bl(20, a)}</li>`).join('')}</ol></div></div>
<p class="fi-rep">Réponses : ${f.flash.map(([q, a], i) => `${L[i]}. ${a}`).join(' ; ')}</p></div>`; };
const CH = DATA.map(chapter);

/* ---------- pages d’ouverture ---------- */
const QV = s => ({ vb: s.match(/viewBox="([^"]+)"/)[1], body: s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') });
const pCover = `<div class="page cover2"><div class="cvfull">${cover({ qr: QV(QR.home.svg) })}</div></div>`;
/* le schéma du chapitre */
const STEPS = [['🎬', 'La scène', 'de la pop culture|et une question'], ['🚀', 'Point de départ', 'un document|5 questions'], ['📘', 'La leçon', 'une notion|par page'], ['🧭', 'Méthodes', 'un résolu, puis|un à compléter'], ['✏️', 'Je m’entraîne', 'des supports|à compléter'], ['🧩', 'Je résous', 'des situations|du métier'], ['🎯', 'S’évaluer', 'au format du CCF|45 min, sur 10']];
const flow = S(600, 250, STEPS.map(([ic, t, s], i) => { const x = 10 + (i % 4) * 150, y = i < 4 ? 20 : 140, w = 130; return Rc(x, y, w, 86, { c: i === 2 ? 'k' : 'k2', rx: 14 }) + `<text x="${x + w / 2}" y="${y + 30}" font-size="22" text-anchor="middle">${ic}</text>` + T(x + w / 2, y + 50, t, { fs: 14, c: i === 2 ? 'tw' : 'tx' }) + s.split('|').map((l, j) => T(x + w / 2, y + 68 + j * 12, l, { fs: 10, c: i === 2 ? 'tw' : 'ts', w: 600 })).join('') + (i < 3 ? Ar(x + w + 2, y + 43, x + w + 18, y + 43, { w: 2.4, h: 8 }) : '') + (i >= 4 && i < 6 ? Ar(x + w + 2, y + 43, x + w + 18, y + 43, { w: 2.4, h: 8 }) : ''); }).join('') + `<path d="M535 106 C 560 125, 90 112, 75 134" fill="none" class="ks" stroke-width="2.4" stroke-dasharray="6 4"/><path d="M75 138 l-6 -10 h12 z" class="k"/>` + T(527, 196, 'Une notion, une page :', { fs: 12, c: 'kt', a: 'middle' }) + T(527, 214, 'je découvre → la méthode', { fs: 10.5, w: 600 }) + T(527, 229, '→ la solution → je retiens', { fs: 10.5, w: 600 }) + T(527, 244, '→ à moi', { fs: 10.5, w: 600 }), 'Le déroulé d’un chapitre');
const pGuide = `<div class="page c-nombre" data-recto="0"><div class="inner" data-sec="guide">
  <h1 class="pg-t">Ton manuel : comment ça marche ?</h1>
  <p class="pg-p">Chaque chapitre suit le même chemin : une scène de pop culture avec de vraies données, la leçon, puis l’entraînement.</p>
  <div class="flow3">${flow}</div>
  <h2 class="pg-s">Ma routine de lecture, en 3 étapes</h2>
  <div class="rout3"><div><span class="gn">1</span><b>Je lis tout</b><span>Je lis l’énoncé en entier, sans calculer. Je regarde les documents.</span></div><div><span class="gn">2</span><b>Je surligne</b><span>Je repère les données utiles (elles sont souvent <mark class="hl">surlignées</mark>) et ce qu’on me demande.</span></div><div><span class="gn">3</span><b>Je dis ce que je cherche</b><span>Avec mes mots : « Je cherche le prix d’un paquet ». Puis je choisis la méthode.</span></div></div>
  <h2 class="pg-s">Les repères</h2>
  <div class="rep3"><div><span class="defi">Défi · 4 étapes</span><span>Un exercice plus long, annoncé avec son nombre d’étapes. Une bulle 💬 t’aide à démarrer.</span></div><div><span class="pouce-mini">💡 ∀</span><span>Les <b>coups de pouce</b> sont en bas de page, écrits à l’envers : tourne le manuel pour les lire.</span></div><div><span class="et3b">Réponses</span><span>Les réponses de « Je m’entraîne » sont en fin de manuel.</span></div><div><span class="niv niv-a">🌱 Guidé</span><span class="niv niv-d">🚀 Défi</span><span>Le même thème : plus guidé (début déjà fait) ou avec un défi en plus (plus d’étapes).</span></div></div>
  <h2 class="pg-s">L’appli qui va avec</h2>
  <div class="qrhow"><div class="qrbox big">${QR.home.svg}<span>Maths · CAP</span></div><div><p class="pg-p">Sur téléphone ou ordinateur, sans compte : la leçon animée, l’entraînement corrigé tout de suite, les fiches de révision et 3 CCF blancs chronométrés.</p><p class="pg-p small">tom-rougeaud.github.io/cap · Rien n’est envoyé sur Internet : la progression reste sur l’appareil.</p></div></div>
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
const pComp = `<div class="page c-algo"><div class="inner" data-sec="competences">
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
  ${DNB.length ? `<div class="tc2 ann"><span class="tn2">🎓</span><div><b>Trois CCF blancs</b><span>45 minutes, sur 10 points, calculatrice autorisée</span></div><span class="tp2"><span data-pageof="dnb">…</span></span></div>` : ''}<div class="tc2 ann"><span class="tn2">📄</span><div><b>Fiches de révision</b><span>Une fiche A4 par chapitre, à détacher</span></div><span class="tp2"><span data-pageof="fiches">…</span></span></div><div class="tc2 ann"><span class="tn2">✔️</span><div><b>Réponses de « Je m’entraîne »</b><span>Pour vérifier seul, chapitre par chapitre</span></div><span class="tp2"><span data-pageof="rep">…</span></span></div><div class="tc2 ann"><span class="tn2">🔤</span><div><b>Glossaire visuel</b><span>Les mots de chaque chapitre, avec un schéma</span></div><span class="tp2"><span data-pageof="glo">…</span></span></div></div>
  <p class="pg-p small" style="margin-top:4mm">Programme de mathématiques des classes préparant au CAP (Bulletin officiel de l’éducation nationale, numéro spécial n° 5 du 11 avril 2019). Le signe ➕ marque un domaine propre à un groupement de CAP : calculs commerciaux et financiers (groupement 2), géométrie (groupement 1), et les compléments du programme.</p>
</div><div class="foot"></div></div>`;

/* ---------- « Ce que tu sais déjà » : vue d’ensemble (élève et professeur) ---------- */
const pontSec = `<section class="sec" data-key="pont" data-recto="0" data-run="Ce que tu sais déjà" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Avant de commencer</div><h2>🔗 Ce que tu sais déjà</h2><p>Chaque chapitre du CAP part de ce que tu as appris au collège, puis va plus loin. Tu n’as pas tout retenu ? C’est normal : chaque chapitre commence par le rappeler.</p></div></div>`
  + DATA.map(c => `<div class="blk pontl c-${c.col}"><span class="pontl-n">${c.n}</span><div class="pontl-t"><b>${esc(c.titre)}</b><span class="pontl-d">S’appuie sur : ${c.pont.de.map(x => `${x.niv} <i>${esc(x.titre)}</i>`).join(' · ')}</span><span class="pontl-f">➜ ${c.pont.fil}</span></div></div>`).join('') + `</section>`;
/* ---------- continuité collège → CAP : version professeur ---------- */
const pontProf = `<section class="sec" data-key="pontp" data-recto="0" data-run="Continuité collège → CAP · version professeur" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Version professeur</div><h2>🧭 Continuité collège → CAP, chapitre par chapitre</h2><p>Pour chaque chapitre : les capacités du programme de CAP couvertes et les parties du chapitre, les appuis du collège, les automatismes à réactiver (zone ⚡ Automatismes, page « Je fais le point ») et les points de vigilance repérés dans les erreurs fréquentes.</p></div></div>`
  + DATA.map(c => `<div class="blk pontp c-${c.col}"><h3><span class="pontl-n">${c.n}</span>${esc(c.titre)}</h3><p class="pontp-d"><b>Appuis</b> · ${c.pont.de.map(x => `${x.niv} « ${esc(x.titre)} »`).join(' · ')}</p><table class="pontp-t"><tr><th>Capacités du programme de CAP</th><th>À réactiver</th><th>Vigilance</th></tr><tr><td><ul>${c.pont.prog.map(x => `<li>${x}</li>`).join('')}</ul><p class="pontp-pl"><b>Parties</b> · ${c.parties.map((p, i) => `${'ABCDE'[i]}. ${p.t}`).join(' · ')}</p></td><td><ul>${c.pont.reac.map(x => `<li>${x}</li>`).join('')}</ul></td><td><ul>${c.pont.vig.map(x => `<li>${x}</li>`).join('')}</ul></td></tr></table></div>`).join('') + `</section>`;

/* ---------- chapitres ---------- */
const chapSecs = CH.map(({ c, fixed, ex, ev }) => {
  const run = `CAP Maths · Chapitre ${c.n}${c.plus ? ' ➕' : ''} · ${c.titre}`;
  return `<section class="sec" data-key="${c.id}" data-recto="0" data-fill="1" data-run="${esc(run)}" data-col="${c.col}">${fixed.join('')}${ex.join('')}</section>`
    + `<section class="sec" data-key="${c.id}-ev" data-recto="0" data-fill="1" data-run="${esc(run)} · s’évaluer" data-col="${c.col}">${ev}</section>`;
}).join('');

/* ---------- trois sujets blancs du brevet, série professionnelle (élève : sujets ; professeur : corrigés et barèmes) ---------- */
DNB.forEach(sj => { attach(`dnb.${sj.id}.au`, sj.auto); sj.exos.forEach((x, j) => attach(`dnb.${sj.id}.${j}`, x.qs)); });
Object.keys(DET).forEach(k => chk(DETUSED.has(k), `détails sans questions : ${k}`));
if (ERR.length) { console.error('Contrôles de calcul en échec :', ERR); process.exit(1); }
const dnbIntro = `<div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Se préparer au CCF</div><h2>🎓 Trois CCF blancs</h2><p>Au CAP, les mathématiques sont évaluées en contrôle en cours de formation (CCF), à la fin d’une séquence. Ces trois sujets blancs ont le même format : 45 minutes, une note sur 10, deux parties.</p></div></div>
<div class="blk ccfhow c-brand"><div><b>⚡ Partie 1 · 3 points</b><span>des automatismes, en 10 minutes, sans calculatrice. Tu réponds sans justifier.</span></div><div><b>🧩 Partie 2 · 6 points</b><span>des situations professionnelles, en 35 minutes, avec la calculatrice. Tu justifies tes réponses.</span></div><div><b>✍️ 1 point de rédaction</b><span>compris dans la partie 2 : phrases complètes, unités, calculs posés.</span></div><div><b>🧮 Matériel</b><span>stylo, règle, équerre, compas, rapporteur ; calculatrice pour la partie 2 seulement.</span></div></div>
<div class="blk ccfadv c-brand"><p><b>Un conseil</b> : dans la partie 2, les exercices sont indépendants. Commence par celui que tu préfères, et laisse une trace de tes essais : une démarche, même inachevée, rapporte des points.</p></div>`;
const dnbSec = (sj, i) => { let k = 0; const per = {}; [...sj.auto, ...sj.exos.flatMap(x => x.qs)].forEach(q => { per[q.comp] = (per[q.comp] || 0) + q.pts; }); per.com = (per.com || 0) + sj.redac;
  const qB = (q, det) => { k++; return `<div class="blk evq c-brand" data-det="${det}"><div class="evq-h"><span class="evq-n">${k}</span><span class="evq-t">${q.t}</span><span class="cp cp-${q.comp}">${CPS[q.comp]}</span><span class="evq-p">${ptsTxt(q.pts)}</span></div>${q.choices ? `<p class="ans"><span class="opts">${q.choices.map((x, j) => opt(x, j === q.ok)).join('')}</span></p>` : q.lines ? lines(q.lines, q.a) : `<p class="ans"><span>${q.lab || ''}</span>${bl(q.w || 40, q.a)}</p>`}</div>`; };
  const head = `<div class="blk evh c-brand ccfh" data-sec="dnb-${sj.id}"><div class="evh-t"><span class="evh-k">🎓 CCF blanc ${sj.id} · CAP</span><h2>${sj.titre}</h2><p>Durée : 45 minutes · partie 1 sans calculatrice, partie 2 avec la calculatrice</p></div><div class="evh-n"><span>Nom</span><i></i><span>Date</span><i></i><b>… / 10</b></div>
<table class="tbl evg evg3 evg6"><tr><th>Compétence</th><th>Ce que je sais faire</th><th>Points</th><th>Insuffisante</th><th>Fragile</th><th>Satisfaisante</th><th>Très bonne</th></tr>${ORD.filter(o => per[o]).map(o => `<tr><td class="tl"><span class="cp cp-${o}">${CPS[o]}</span></td><td class="tl gp">${sj.grille[o]}</td><td>${ptsTxt(per[o])}</td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td></tr>`).join('')}</table></div>`;
  const p1 = `<div class="blk evx kwn c-brand" data-det="dnb-${sj.id}-au"><div class="evx-h"><span class="evx-n">Partie 1</span><span class="evx-t">Automatismes · 10 minutes · sans calculatrice</span><span class="evx-p">3 pts</span></div><p class="evccf">Réponds sans justifier. Cette partie est ramassée au bout de 10 minutes.</p></div>` + sj.auto.map(q => qB(q, `dnb-${sj.id}-au`)).join('');
  const p2 = sj.exos.map((x, j) => `<div class="blk evx kwn c-brand" data-det="dnb-${sj.id}-${j}">${j === 0 ? `<p class="ev-p2">Partie 2 · Situations professionnelles · 35 min · calculatrice autorisée · justifie tes réponses</p>` : ''}<div class="evx-h"><span class="evx-n">Exercice ${j + 1}</span><span class="evx-t">${x.t}</span><span class="evx-p">${ptsTxt(x.qs.reduce((a, b) => a + b.pts, 0))}</span></div>${x.intro || ''}</div>` + x.qs.map(q => qB(q, `dnb-${sj.id}-${j}`)).join('')).join('');
  return `<section class="sec" data-key="dnb-${sj.id}" data-recto="1" data-run="CCF blanc ${sj.id} · ${esc(sj.titre)}" data-col="brand">${head}${p1}${p2}<div class="blk evred c-brand">✍️ <b>Rédaction · 1 pt</b> · clarté, précision des raisonnements et rédaction, sur l’ensemble de la partie 2.</div></section>`; };
const dnbSecs = DNB.map((sj, i) => { const h = dnbSec(sj, i); return i ? h.replace('data-recto="1"', 'data-recto="0"') : h.replace(/<section class="sec" data-key="dnb-A"([^>]*)>/, `<section class="sec" data-key="dnb"$1>${dnbIntro}`); }).join('');
const dnbCorr = `<div class="blk cc kwn c-brand"><h3>🎓 CCF blancs · corrigés et barèmes <small>(p. <span data-pageof="dnb">…</span>)</small></h3></div>` + DNB.map(sj => { let kq = 0; return `<div class="blk cc kx c-brand">${detBlock(`dnb-${sj.id}-au`, `🎓 CCF blanc ${sj.id} · ${sj.titre} · partie 1 · automatismes`, sj.auto.map(q => [`${++kq}.`, q.x || q.a, `(${ptsTxt(q.pts)})`]))}</div>` + sj.exos.map((x, j) => `<div class="blk cc kx c-brand">${detBlock(`dnb-${sj.id}-${j}`, `🎓 CCF blanc ${sj.id} · exercice ${j + 1} · ${x.t}`, x.qs.map(q => [`${++kq}.`, q.x || q.a, `(${ptsTxt(q.pts)})`]))}</div>`).join('') + `<div class="blk cc kx c-brand"><p class="small">Rédaction (1 pt) : clarté et précision des raisonnements sur l’ensemble de la partie 2.</p></div>`; }).join('');

/* ---------- fiches de révision ---------- */
const fichesSec = `<section class="sec" data-key="fiches" data-recto="1" data-run="Fiches de révision" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Fin de manuel</div><h2>📄 Fiches de révision</h2><p>Une page par chapitre : l’essentiel, la méthode, un exemple résolu, les pièges et quatre réflexes à tester. Tu peux les détacher et les afficher.</p></div></div>${CH.map(x => x.fiche).join('')}</section>`;
/* ---------- réponses de « Je m’entraîne » (élève et professeur) ---------- */
const repSec = `<section class="sec" data-key="rep" data-recto="0" data-run="Réponses de « Je m’entraîne »" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Fin de manuel</div><h2>✔️ Réponses de « Je m’entraîne »</h2><p>Fais l’exercice d’abord, puis vérifie ici. Une réponse différente ? Relis la notion indiquée, ou refais l’exercice dans l’appli avec d’autres nombres.</p></div></div>`
  + CH.map(({ c, rep }) => `<div class="blk rp3 c-${c.col}" data-sec="rep-${c.id}"><h3><span class="rp-n">${c.n}</span>${c.titre}</h3>${rep.map(r => `<p${r.opt ? ` data-optrep="${r.eid}"` : ''}><b class="cn" data-numof="${r.eid}">·</b> <b>${r.titre}</b> — ${r.txt}.</p>`).join('')}</div>`).join('') + `</section>`;

/* ---------- glossaire visuel ---------- */
const card = (w, m) => `<div class="blk gcard c-${m.col}" data-word="${esc(w.id)}"><div class="gc-ill">${w.pic}</div><div><div class="gc-h"><span class="gc-w">${w.mot}</span>${w.abr ? `<span class="sym">${w.abr}</span>` : ''}</div><p class="gc-def">${w.def}</p>${w.formule ? `<p class="gc-man">${w.formule}</p>` : ''}${w.sens ? `<p class="note">↔️ ${w.sens}</p>` : ''}<p class="gc-ph">« ${w.phrase} »</p></div></div>`;
const glo = `<section class="sec" data-key="glo" data-cols="2" data-run="Glossaire visuel" data-col="brand"><div class="blk chead kwn c-brand span"><div class="ch-txt"><div class="ch-k">Fin de manuel</div><h2>🔤 Glossaire visuel</h2><p>Les mots de chaque chapitre, avec un schéma, une définition et une phrase pour les réutiliser.</p></div></div>`
  + CH.map(({ c }) => `<div class="blk gh2 kwn c-${c.col}" data-sec="g-${c.id}"><span class="gh2-i">${c.n}</span><span class="gh2-t"><small>Chapitre ${c.n}</small>${c.titre}</span></div>` + c.words.map(w => card(w, c)).join('')).join('') + `</section>`;

/* ---------- corrigé complet (version professeur) ---------- */
const corr = `<section class="sec corr" data-key="corr" data-recto="1" data-run="Corrigé · version professeur" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Version professeur</div><h2>✔️ Corrigé complet</h2><p>Automatismes, point de départ, résolu à compléter, exercices, problèmes et évaluations : chaque réponse avec son calcul posé et, quand c’est utile, une phrase de réponse. Les pages des chapitres portent aussi les réponses en rouge, et ce corrigé détaillé là où il reste de la place. Tous les résultats sont calculés et contrôlés par programme.</p></div></div>`
  + CH.map(({ c, key }) => `<div class="blk cc kwn c-${c.col}"><h3>Chapitre ${c.n} · ${c.titre} <small>(p. <span data-pageof="${c.id}">…</span>)</small></h3></div>` + key.map(k => `<div class="blk cc ${k.eid ? "kq" : "kx"} c-${c.col}">${k.det}</div>`).join('')).join('') + dnbCorr + `</section>`;

/* ---------- styles et document ---------- */
const SRC = path.join(HERE, 'style');
const FONTS = fs.readFileSync(path.join(SRC, 'fonts.css'), 'utf8');
const ROOT = `:root{--ink:#1D2240;--soft:#545B7A;--brand:#4F5E00;--accent:#E9F797;--c-pop:#B8336A;--t-pop:#FCE1EC;--c-ciel:#0E6BA8;--t-ciel:#DCEFFA;
--c-verbe:#1E7F45;--t-verbe:#DCF4E4;--c-algebre:#C2332A;--t-algebre:#FDE3E0;--c-nombre:#1D5FC2;--t-nombre:#E0EBFD;--c-fonction:#B05200;--t-fonction:#FFE7D1;
--c-geometrie:#7438C0;--t-geometrie:#EEE3FB;--c-mesure:#08767C;--t-mesure:#D6F2F2;--c-algo:#AA2272;--t-algo:#FBE0EF;--c-donnees:#755C00;--t-donnees:#FFF0B8}
${['verbe', 'algebre', 'nombre', 'fonction', 'geometrie', 'mesure', 'algo', 'donnees', 'pop', 'ciel'].map(c => `.c-${c}{--cc:var(--c-${c});--tt:var(--t-${c})}`).join('\n')}`;
const FALL = `'Noto Color Emoji','DejaVu Sans','DejaVu Math TeX Gyre',sans-serif`;
const CSS = ['print.css', 'n3.css', 'mcv.css', 'v3.css'].map(f => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n')
  .replace(/font-family:'Andika','Noto Color Emoji',sans-serif/g, `font-family:'Andika',${FALL}`)
  .replace(/font-family:'Inter','Noto Color Emoji',sans-serif/g, `font-family:'Inter',${FALL}`)
  .replace(/font-family:'Inter','Andika',sans-serif/g, `font-family:'Inter',${FALL}`)
  .replace(/'Inter'(?=\s*[;}])/g, `'Inter',${FALL}`)
  + `
.page.cover2{padding:0}.cvfull,.cvfull svg{width:210mm;height:297mm;display:block}
.cvsvg text{font-family:'Inter',${FALL}}
.optn{font:800 8.4pt 'Inter',${FALL};color:var(--cc);background:var(--tt);border-radius:3mm;padding:.3mm 2.2mm;margin-right:2mm;white-space:nowrap}.opt .optn-e{display:none}.opt.evb .optn-s{display:none}.opt.evb .optn-e{display:inline}.opt .optn-r{display:none}.opt.rap .optn-s,.opt.rap .optn-e,.opt.rap .optn-l{display:none}.opt.rap .optn-r{display:inline}.opt .optn-l{display:none}.opt.inl .optn-l{display:inline}.opt.inl .optn-s{display:none}.opt .optn-g{display:none}.opt.inl.again .optn-l{display:none}.opt.inl.again .optn-g{display:inline}
.owner{display:grid;grid-template-columns:auto 1fr auto 40mm;gap:3mm;align-items:end;font:800 11pt 'Inter',${FALL};color:#1D2240;margin-top:4mm}.owner i{border-bottom:2px dashed #9aa3c7;height:8mm}
.ccfhow{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin:3mm 0}.ccfhow div{border:2px solid var(--cc);border-radius:4mm;padding:2.4mm 3.4mm;background:var(--tt)}.ccfhow b{display:block;font:800 12pt 'Inter',${FALL};color:#1D2240}.ccfhow span{font-size:10pt;line-height:1.3}.ccfadv{border-left:5px solid var(--cc);background:#FFFBEA;border-radius:3mm;padding:2mm 4mm;font-size:10.4pt}.ccfctx{font-size:10.6pt;margin:1mm 0 2mm}
.evccf{font-size:9.6pt;margin:1.4mm 0 0;color:#545B7A}.appel3{margin:1.6mm 0 .4mm;border:2px dashed var(--cc);border-radius:3mm;padding:1.4mm 3mm;font-size:9.8pt;background:#fff}.appel3 b{color:var(--cc)}
.tbl.cons2{width:100%;font-size:10.2pt}.tbl.cons2 td,.tbl.cons2 th{text-align:left;border:1px solid #C9D1EA;padding:1mm 2.4mm}.tbl.cons2 td:nth-child(2){font-weight:700}
.cp-app{background:#E0EBFD;color:#173F86}.cp-ana{background:#EEE3FB;color:#4F2390}.cp-rea{background:#DCF4E4;color:#14572F}.cp-val{background:#FFE7D1;color:#7A3A00}.cp-com{background:#FBE0EF;color:#7A1850}
.cpc-app{--tt:#E0EBFD}.cpc-ana{--tt:#EEE3FB}.cpc-rea{--tt:#DCF4E4}.cpc-val{--tt:#FFE7D1}.cpc-com{--tt:#FBE0EF}
.mt3{border:2px solid var(--cc);border-radius:5mm;background:var(--tt);padding:2.6mm 4mm;margin:2mm 0}.mt3-h{font:800 12pt 'Inter',${FALL};color:var(--cc);margin-bottom:1.4mm}.mt3-g{display:grid;grid-template-columns:1.5fr 1fr;gap:4mm}.mt3-n{font:800 11.5pt 'Inter',${FALL};color:#1D2240}.mt3 p{margin:.8mm 0;font-size:10.4pt;line-height:1.3}.mt3-m{color:#2d3356}.mt3-a{background:#fff;border-radius:3mm;padding:1.6mm 2.6mm;border:1.4px dashed var(--cc)}.mt3-k{display:block;font:800 9pt 'Inter',${FALL};text-transform:uppercase;letter-spacing:.04em;color:var(--cc);margin-bottom:.6mm}.mt3-a ul{margin:0;padding-left:4mm;font-size:10pt;line-height:1.3}
.niv{font:800 8.6pt 'Inter',${FALL};border-radius:99px;padding:.5mm 2.8mm;white-space:nowrap;border:1.6px solid #1D2240;color:#1D2240}.niv-a{background:#DCF4E4}.niv-d{background:#FDE3E0}.niv-n{margin:0 0 1.6mm;padding:1.2mm 3mm;border-left:5px solid var(--cc);background:var(--tt);border-radius:2mm;font-size:9.8pt}
.fiche{border:2.4px solid var(--cc);border-radius:5mm;padding:4mm 5mm;background:#fff;min-height:250mm}.fi-h{display:flex;align-items:center;gap:4mm;border-bottom:2.4px solid var(--cc);padding-bottom:2.4mm;margin-bottom:3mm}.fi-n{display:flex;align-items:center;justify-content:center;width:13mm;height:13mm;border-radius:50%;background:var(--cc);color:#fff;font:800 17pt 'Inter',${FALL}}.fi-k{font:800 9.6pt 'Inter',${FALL};color:var(--cc);text-transform:uppercase;letter-spacing:.04em}.fi-h h2{margin:0;font:800 17pt 'Inter',${FALL};color:#1D2240}
.fi-g{display:grid;grid-template-columns:1fr 1fr;gap:3.4mm;margin-bottom:3mm}.fi-b{border:1.8px solid var(--cc);border-radius:3.4mm;background:var(--tt);padding:2.2mm 3.2mm}.fi-b h3,.fi-ex h3{margin:0 0 1.2mm;font:800 11pt 'Inter',${FALL};color:#1D2240}.fi-b ul,.fi-b ol{margin:0;padding-left:5mm;font-size:10pt;line-height:1.34}.fi-b li{margin:.8mm 0}
.fi-ex{border:1.8px dashed var(--cc);border-radius:3.4mm;padding:2.2mm 3.4mm;margin-bottom:3mm;font-size:10pt;line-height:1.36}.fi-att{background:#FFF6E5}.fi-rep{margin:3mm 0 0;font-size:8.6pt;color:#545B7A;transform:rotate(180deg);text-align:right}
.ev-p2{margin:0 0 2mm;padding:1.6mm 3mm;border-radius:3mm;background:var(--tt);font:800 10.4pt 'Inter',${FALL};color:#1D2240}
.evred{margin:2mm 0 0;border:2px dashed var(--cc);border-radius:3mm;padding:1.8mm 3.4mm;font-size:10.2pt;background:#FFFBE0}
`;
const PAG = fs.readFileSync(path.join(HERE, 'lib', 'svgfit.js'), 'utf8') + '\n' + fs.readFileSync(path.join(HERE, 'lib', 'paginate.js'), 'utf8');
const TPL = `<template id="notesTpl"><div class="blk notes"><h3>📝 Mes notes</h3><div class="lines"></div></div></template>`;
const FOOT = 'Maths · CAP // T. Rougeaud';
const typo = h => h.split(/(<pre[\s\S]*?<\/pre>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>)/).map((part, i) => i % 2 ? part : part.replace(/>([^<]+)</g, (m, t) => '>' + t.replace(/ ([?!:;»])/g, ' $1').replace(/« /g, '« ').replace(/(\d) (%|€)/g, '$1 $2').replace(/([+−]) (\d)/g, '$1 $2') + '<')).join('');
const anchors = h => h.replace(/(<section [^>]*data-key="([^"]+)"[^>]*>)<div class="blk/g, '$1<div id="k-$2" class="blk').replace(/ data-sec="([^"]+)"/g, ' id="k-$1" data-sec="$1"');
const detsHtml = () => `<div id="dets" hidden>${DETS.map(d => `<div class="dz-src" data-for="${d.id}">${d.h}</div>`).join('')}</div>`;
const doc = (title, body, cls) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${FONTS}\n${TEX.css()}\n${ROOT}\n${CSS}</style></head>
<body class="${cls}" data-foot="${esc(FOOT)}"><div id="flow">${anchors(typo(body))}</div><div id="out"></div>${cls === 'prof' ? typo(detsHtml()) : ''}${TPL}<script>${PAG}</script></body></html>`;
const pBlank = `<div class="page blank" data-recto="0"></div>`;
const front = pCover + pBlank + pGuide + pComp + pToc;
fs.writeFileSync(path.join(B, 'eleve.html'), doc('Maths · CAP — manuel', front + pontSec + chapSecs + dnbSecs + fichesSec + repSec + glo, 'eleve'));
fs.writeFileSync(path.join(B, 'prof.html'), doc('Maths · CAP — version professeur', front + pontSec + pontProf + chapSecs + dnbSecs + fichesSec + repSec + glo, 'prof'));
const nEx = CH.reduce((a, x) => a + x.rep.filter(r => !r.opt).length + x.c.probs.length, 0);
fs.writeFileSync(path.join(B, 'log.json'), JSON.stringify({ version: 3, chapitres: DATA.map(c => ({ id: c.id, n: c.n, titre: c.titre })), exercices: nEx, mots: DATA.reduce((a, c) => a + c.words.length, 0) }, null, 1));
console.log(`chapitres : ${DATA.length} · exercices du manuel : ${nEx} · contrôles de calcul : OK`);
