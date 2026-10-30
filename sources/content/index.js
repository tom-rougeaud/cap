/* CAP Maths — chargement des chapitres (contenu commun à l’appli et au manuel). */
'use strict';
const fs = require('fs'), path = require('path');
const METIERS = require('./metiers3');
const PONT = require('./pont3');
const TEX = require('../lib/tex');
module.exports = chk => {
  const EVALS = require('./evals3')(chk);
  const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(n => fs.existsSync(path.join(__dirname, `c${n}.js`)));
  return ids.map(n => {
    const c = require(`./c${n}.js`)(chk);
    c.metier = METIERS[c.id]; c.eval = EVALS[c.id]; c.pont = PONT[c.id];
    chk(!!c.pont && c.pont.de.length >= 1 && c.pont.change.length >= 2, `${c.id} : encart « Ce que tu sais déjà »`);
    chk(!!c.metier && !!c.metier.job && c.metier.job.apres.length >= 1 && !!c.eval, `métier ou évaluation manquant : ${c.id}`);
    chk(c.notions.length >= 3 && c.notions.length <= 6, `${c.id} : 3 à 6 notions`);
    chk(!!c.parties && c.parties.flatMap(p => p.n).join() === c.notions.map((_, i) => i + 1).join(), `${c.id} : les parties couvrent toutes les notions, dans l’ordre`);
    /* 3 exercices × 3 niveaux (courant, 🌱 guidé, 🚀 défi) et 5 problèmes (dont un 🌱 et un 🚀) */
    chk(c.entraine.length === 9 && c.entraine.filter(e => e.niv === 0).length === 3 && c.entraine.filter(e => e.niv < 0).length === 3 && c.entraine.filter(e => e.niv > 0).length === 3, `${c.id} : 3 exercices à 3 niveaux`);
    chk(c.entraine.filter(e => e.niv).every(e => c.entraine.some(b => b.id === e.base && b.niv === 0)), `${c.id} : chaque variante renvoie à un exercice courant`);
    chk(c.probs.length === 5 && c.probs.filter(p => p.niv < 0).length === 1 && c.probs.filter(p => p.niv > 0).length === 1, `${c.id} : 5 problèmes dont un guidé et un défi`);
    chk(c.resolus.length === 2 && !!c.resolus[1].trous, `${c.id} : un résolu complet et un à trous`);
    chk(!!c.fiche && c.fiche.essentiel.length >= 3 && c.fiche.methode.length >= 3 && c.fiche.pieges.length >= 2 && c.fiche.flash.length === 4 && !!c.fiche.exemple, `${c.id} : fiche de révision complète`);
    const e = c.eval, tot = [...e.auto, ...e.exos.flatMap(x => x.qs)].reduce((a, q) => a + q.pts, 0) + e.redac;
    chk(Math.abs(tot - 10) < 1e-9 && Math.abs(e.auto.reduce((a, q) => a + q.pts, 0) - 3) < 1e-9, `${c.id} : l’évaluation vaut 10 points (3 de partie 1)`);
    return TEX.deep(c);
  });
};
