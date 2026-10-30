/* Version 3 — outils communs aux chapitres : formules, tutoiement, reprise des problèmes de la version 2. */
'use strict';
const K = require('./kit');
const M = s => `\\(${s}\\)`;                                     // formule KaTeX dans le texte
const FM = s => `<span class="fx fxm">\\(${s}\\)</span>`;          // formule encadrée
const R = String.raw;
/* consignes au tutoiement (les sujets « vers le bac » gardent l’infinitif) */
const VERBES = [['Calculez', 'Calcule'], ['Lisez', 'Lis'], ['Donnez', 'Donne'], ['Écrivez', 'Écris'], ['Déterminez', 'Détermine'], ['Complétez', 'Complète'], ['Justifiez', 'Justifie'], ['Expliquez', 'Explique'], ['Indiquez', 'Indique'], ['Vérifiez', 'Vérifie'], ['Comparez', 'Compare'], ['Rédigez', 'Rédige'], ['Retrouvez', 'Retrouve'], ['Cochez', 'Coche'], ['Convertissez', 'Convertis'], ['Déduisez-en', 'Déduis-en'], ['Choisissez', 'Choisis'], ['Faites', 'Fais'], ['Résolvez', 'Résous'], ['Construisez', 'Construis'], ['Exprimez', 'Exprime'], ['Trouvez', 'Trouve'], ['Estimez', 'Estime'], ['Placez', 'Place'], ['Proposez', 'Propose'], ['Repérez', 'Repère'], ['Interprétez', 'Interprète'], ['Observez', 'Observe'], ['Utilisez', 'Utilise'], ['Écrivez-la', 'Écris-la'], ['Retrouvez-la', 'Retrouve-la'], ['Multipliez', 'Multiplie'], ['Divisez', 'Divise'], ['Comptez', 'Compte'], ['Essayez', 'Essaie'], ['Ajustez', 'Ajuste'], ['Critiquez', 'Critique'], ['Remplacez', 'Remplace'], ['Rangez', 'Range'], ['Cherchez', 'Cherche'], ['Partez', 'Pars'], ['Allez', 'Va'], ['Descendez', 'Descends'], ['Tracez', 'Trace'], ['Décrivez', 'Décris'], ['Commencez', 'Commence'], ['Additionnez', 'Additionne'], ['Soustrayez', 'Soustrais'], ['Pensez', 'Pense'], ['Regardez', 'Regarde'], ['Notez', 'Note'], ['Surlignez', 'Surligne'], ['Prenez', 'Prends'], ['Mettez', 'Mets'], ['Ajoutez', 'Ajoute'], ['Retirez', 'Retire'], ['Arrondissez', 'Arrondis'], ['Testez', 'Teste'], ['Relisez', 'Relis'], ['Identifiez', 'Identifie'], ['Associez', 'Associe'], ['Reliez', 'Relie'], ['Simulez', 'Simule'], ['Tapez', 'Tape'], ['Saisissez', 'Saisis'], ['Entourez', 'Entoure'], ['Reportez', 'Reporte']];
function tu(s) {
  if (typeof s !== 'string') return s;
  let o = s;
  const W = w => new RegExp(`(?<![\\p{L}’-])${w}(?![\\p{L}])`, 'gu');
  for (const [a, b] of VERBES) { o = o.replace(W(a), b).replace(W(a.toLowerCase()), b.toLowerCase()); }
  return o.replace(/N’oubliez/g, 'N’oublie').replace(/n’oubliez/g, 'n’oublie').replace(/conseillez-vous/g, 'conseilles-tu').replace(/Conseillez-vous/g, 'Conseilles-tu').replace(/(?<!-)\bvous\b/g, 'tu').replace(/\bVous\b/g, 'Tu').replace(/\bvotre\b/g, 'ta').replace(/\bVotre\b/g, 'Ta').replace(/\bVos\b/g, 'Tes').replace(/\bvos\b/g, 'tes');
}
/* reprend un problème de la version 2 et lui ajoute ce que demande la version 3 */
function adapt(p, o) {
  const keepInf = p.cls === 'bac';
  const f = keepInf ? (x => x) : tu;
  const q = { ...p, etape: o.etape, defi: o.defi || 0, bulle: o.bulle || '', autravail: o.autravail || null, hints: o.hints || [], pouce: o.pouce || p.pouce, titre: o.titre || p.titre,
    intro: f(p.intro), outro: f(p.outro), body: f(p.body), seq: p.seq.map(s => s.x != null ? { x: f(s.x) } : s), qs: p.qs.map((x, i) => ({ ...x, t: f(x.t), err: (o.err || {})[i] || [] })) };
  return q;
}
module.exports = { ...K, M, FM, R, tu, adapt };
