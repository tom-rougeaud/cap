/* CAP Maths — chargement des chapitres (contenu commun à l’appli et au manuel). */
'use strict';
const fs = require('fs'), path = require('path');
const METIERS = require('./metiers3');
const PONT = require('./pont3');
const TEX = require('../lib/tex');
const TOL = require('./tolfix');
module.exports = chk => {
  const EVALS = require('./evals3')(chk);
  /* ordre du manuel : neuf chapitres (la trigonométrie, c10, n’est plus au programme du manuel) */
  const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => fs.existsSync(path.join(__dirname, `c${n}.js`)));
  return ids.map(n => {
    const c = require(`./c${n}.js`)(chk);
    c.metier = METIERS[c.id]; c.eval = EVALS[c.id]; c.pont = PONT[c.id];
    chk(!!c.pont && c.pont.de.length >= 1 && c.pont.change.length >= 2, `${c.id} : encart « Ce que tu sais déjà »`);
    chk(!!c.metier && !!c.metier.job && c.metier.job.apres.length >= 1 && !!c.eval, `métier ou évaluation manquant : ${c.id}`);
    chk(c.notions.length >= 3 && c.notions.length <= 6, `${c.id} : 3 à 6 notions`);
    chk(!!c.parties && c.parties.flatMap(p => p.n).join() === c.notions.map((_, i) => i + 1).join(), `${c.id} : les parties couvrent toutes les notions, dans l’ordre`);
    chk(c.entraine.filter(e => !e.niv).length >= 3, `${c.id} : au moins 3 exercices`);
    /* un seul problème par chapitre : le sujet « vers le CCF » (p3) ; pas de Scratch dans le manuel */
    if (!c.probsManuel && c.id !== 'c9') c.probsManuel = ['p1', 'p2', 'pd'].filter(id => c.probs.some(p => p.id === id)); /* standard 2026-11 : le problème p3 refaisait l’exemple du cours */
    if (c.probsManuel) { c.probs = c.probs.filter(p => c.probsManuel.includes(p.id)); c.bilan = c.bilan.map(([t, es], i) => [t, es.filter(e => /^e\d$/.test(e)).concat(c.probs.filter(p => p.lc === i + 1 || (p.id === 'q3' && i === 0)).map(p => p.id))]); }
    else { c.probs = c.probs.filter(p => p.id === 'p3');
    c.bilan = c.bilan.map(([t, es]) => { const r = es.filter(e => !['p1', 'p2', 'pa', 'pd'].includes(e)); return [t, r.length ? r : ['p3']]; }); }
    c.scratch = [];
    if (c.id === 'c9') c.court = true; /* chapitre court du manuel : notions et mécaniques, sans exercices contextualisés ni problème (l’appli garde tout) */
    chk(c.resolus.length === 2 && !!c.resolus[1].trous, `${c.id} : un résolu complet et un à trous`);
    TOL.all(c.eval, chk, c.id + ' évaluation');
    const e = c.eval, tot = [...e.auto, ...e.exos.flatMap(x => x.qs)].reduce((a, q) => a + q.pts, 0) + e.redac;
    chk(Math.abs(tot - 10) < 1e-9 && Math.abs(e.auto.reduce((a, q) => a + q.pts, 0) - 3) < 1e-9, `${c.id} : l’évaluation vaut 10 points (3 de partie 1)`);
    return TEX.deep(c);
  });
};
