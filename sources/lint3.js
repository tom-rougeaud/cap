/* Contrôles pédagogiques automatiques de la version 3 :
   longueur des phrases et des consignes, mots interdits, volumes, support visuel de chaque question.
   Usage : node lint3.js  (code de sortie 1 en cas d’erreur) */
'use strict';
const fs = require('fs'), path = require('path');
const { MCVT } = require('./shared/train.js');
const ERR = [], WARN = [];
const chk = (ok, m) => { if (!ok) ERR.push('calcul : ' + m); };
const err = m => ERR.push(m), warn = m => WARN.push(m);
const plain = h => String(h || '').replace(/<table[\s\S]*?<\/table>/g, ' ').replace(/\\\([\s\S]*?\\\)/g, ' formule ').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/⟦|⟧/g, '').replace(/\s+/g, ' ').trim();
const words = s => plain(s).split(' ').filter(w => /[\p{L}\d]/u.test(w));
const sentences = s => plain(s).split(/(?<=[.!?…])\s+(?=[«A-ZÀ-ÝÉ0-9])/u).filter(x => words(x).length);
const FORBID = /(^|[^\p{L}])(faciles?|difficiles?|difficultés?|niveaux?)(?![\p{L}])/iu;
const forbid = (where, s) => { const m = plain(s).match(FORBID); if (m) err(`${where} : mot interdit « ${m[2]} »`); };
const L = { methode: [30, 110], sent: 16, sentMax: 24, consigne: 22 };

const raw = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(n => fs.existsSync(path.join(__dirname, `content/c${n}.js`))).map(n => require(`./content/c${n}.js`)(chk));
const full = require('./content')(chk);
const stat = { notions: 0, phrases: 0, consignes: 0, departs: 0, supports: 0 };
raw.forEach((c, i) => {
  const F = full[i], id = c.id;
  /* volumes */
  if (c.notions.length < 3 || c.notions.length > 6) err(`${id} : ${c.notions.length} notions (3 à 6 attendues)`);
  if (c.entraine.length < 9 || c.entraine.length % 3) err(`${id} : ${c.entraine.length} exercices « Je m’entraîne » (3 exercices × 3 variantes attendus)`);
  if (c.probs.length !== 5) err(`${id} : ${c.probs.length} problèmes (5 attendus)`);
  if (c.mots.length < 5) err(`${id} : seulement ${c.mots.length} mots à connaître`);
  if (c.resolus.length !== 2 || !c.resolus.every(r => r.verif)) err(`${id} : 2 résolus avec « Je vérifie » attendus`);
  const nq = F.eval.exos.reduce((a, x) => a + x.qs.length, 0), pts = F.eval.exos.reduce((a, x) => a + x.qs.reduce((b, q) => b + q.pts, 0), 0) + F.eval.auto.reduce((a, q) => a + q.pts, 0) + F.eval.redac;
  if (nq < 4 || nq > 10 || Math.abs(pts - 10) > 1e-9 || F.eval.auto.length !== 3) err(`${id} : évaluation CCF ${nq} questions, ${pts} points`);
  /* leçon : une notion = découvre → méthode (3 ou 4 étapes) → solution → retiens → à moi */
  c.notions.forEach((nt, k) => {
    stat.notions++;
    if (!(nt.methode.length >= 3 && nt.methode.length <= 4)) err(`${id} notion ${k + 1} : ${nt.methode.length} étapes de méthode`);
    if (!(nt.amoi && nt.amoi.length === 2)) err(`${id} notion ${k + 1} : « À moi » doit avoir 2 questions`);
    const w = words(nt.methode.join(' ')).length; if (w < L.methode[0] || w > L.methode[1]) err(`${id} notion ${k + 1} : méthode de ${w} mots`);
    const ss = sentences(nt.solution + ' ' + nt.retiens + ' ' + nt.decouvre.txt); stat.phrases += ss.length;
    ss.filter(s => words(s).length > L.sentMax).forEach(s => warn(`${id} notion ${k + 1} : phrase de ${words(s).length} mots : « ${s.slice(0, 60)}… »`));
    if (!nt.vois.includes('<svg') || !nt.decouvre.img.includes('<svg')) err(`${id} notion ${k + 1} : image ou méthode visuelle manquante`);
    if (!/class="st st1"/.test(nt.vois)) err(`${id} notion ${k + 1} : méthode visuelle sans étapes animées`);
    for (const key of ['solution', 'retiens', 'attention']) forbid(`${id} notion ${k + 1} ${key}`, nt[key]);
    forbid(`${id} notion ${k + 1} découvre`, nt.decouvre.txt); forbid(`${id} notion ${k + 1} méthode`, nt.methode.join(' ')); forbid(`${id} notion ${k + 1} à moi`, nt.amoi.flat().join(' '));
  });
  c.mots.forEach(m => forbid(`${id} mots`, m.join(' ')));
  c.resolus.forEach((r, k) => { forbid(`${id} résolu ${k + 1}`, r.enonce + r.rows.flat().join(' ') + r.verif + r.rep); if (words(r.enonce).length > 40) warn(`${id} résolu ${k + 1} : énoncé de ${words(r.enonce).length} mots`); });
  forbid(`${id} question du chapitre`, c.travail.question);
  /* problèmes : bulle avant chaque défi, ligne « Au travail » sur le cas pratique et le sujet bac, consignes courtes */
  F.probs.forEach(p => {
    if (p.defi && !p.bulle) err(`${id} ${p.id} : défi sans bulle d’encouragement`);
    if (p.etape >= 3 && !p.autravail) err(`${id} ${p.id} : ligne « Dans un métier, cela sert à » manquante`);
    if (!(p.hints || []).length) err(`${id} ${p.id} : pas d’indices pour l’appli`);
    forbid(`${id} ${p.id}`, p.body + (p.bulle || '') + (p.pouce || '') + (p.hints || []).join(' '));
    p.qs.forEach(q => { stat.consignes++; const w = words(q.t).length; if (w > L.consigne) warn(`${id} ${p.id} ${q.l} : consigne de ${w} mots`); });
  });
  forbid(`${id} automatismes`, F.eval.auto.map(q => q.t + ' ' + q.a).join(' '));
  F.eval.exos.forEach(x => { forbid(`${id} contrôle`, (x.intro || '') + x.qs.map(q => q.t + ' ' + q.a).join(' ')); x.qs.forEach(q => { stat.consignes++; if (words(q.t).length > L.consigne) warn(`${id} contrôle : consigne de ${words(q.t).length} mots « ${plain(q.t).slice(0, 50)}… »`); }); });
  Object.values(F.eval.grille).forEach(g => forbid(`${id} grille`, g));
  /* départ et entraînement : un support visuel pour chaque question, sur 50 tirages */
  for (let s = 1; s <= 50; s++) {
    const d = MCVT.dep(c.depart, s * 7919);
    if (d.qs.length !== 5) err(`${id} départ : ${d.qs.length} questions`);
    if (!/<table|<svg|class="et3|class="aff3/.test(d.doc)) err(`${id} départ (tirage ${s}) : pas de document visuel`);
    d.qs.forEach(q => { if (words(q.t).length > L.consigne) err(`${id} départ : question de ${words(q.t).length} mots`); forbid(`${id} départ`, q.t + ' ' + q.a); });
    stat.departs++;
    c.entraine.forEach(e => { const g = MCVT.tr(e.gen, s * 104729 + 3);
      if (!/<svg|<table/.test(g.consigne + g.support)) err(`${id} ${e.gen} : pas de support visuel`);
      if (g.items.length < (e.niv < 0 ? 2 : 3) || g.items.length > 6) err(`${id} ${e.gen} : ${g.items.length} items`);
      sentences(g.consigne).filter(x => words(x).length > L.sentMax).forEach(x => warn(`${id} ${e.gen} : phrase de consigne de ${words(x).length} mots`));
      if (g.hints.length < 3 || g.hints.length > 4) err(`${id} ${e.gen} : ${g.hints.length} indices`);
      forbid(`${id} ${e.gen}`, g.consigne + g.hints.join(' ') + g.items.map(it => (it.err || []).map(x => x.m).join(' ')).join(' '));
      stat.supports++; });
  }
});
/* textes de l’appli et du manuel */
for (const f of ['app/app3.js', 'gen3.js', 'content/evals3.js', 'content/pont3.js', 'content/metiers3.js', 'content/ccf3.js', 'app/widgets.js', 'shared/train.js', 'shared/auto3.js', ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `shared/t${n}.js`), ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `content/gl_c${n}.js`)]) {
  if (!fs.existsSync(path.join(__dirname, f))) continue;
  const s = fs.readFileSync(path.join(__dirname, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const m = s.match(/[^\n]{0,40}(?<![\p{L}])(faciles?|difficiles?|difficultés?|niveaux?)(?![\p{L}])[^\n]{0,40}/iu); if (m) err(`${f} : mot interdit dans « ${m[0].trim()} »`);
}
console.log(`Contrôles pédagogiques : ${stat.notions} notions · ${stat.phrases} phrases · ${stat.consignes} consignes · ${stat.departs} documents de départ · ${stat.supports} supports tirés`);
WARN.forEach(w => console.log('  ⚠', w));
ERR.forEach(e => console.log('  ✗', e));
console.log(ERR.length ? `${ERR.length} erreur(s)` : `OK (${WARN.length} remarque(s))`);
process.exit(ERR.length ? 1 : 0);
