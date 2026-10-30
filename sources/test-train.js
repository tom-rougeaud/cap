const { MCVT } = require('./shared/train.js');
let bad = 0, n = 0;
const chkItem = (where, it) => {
  if (it.qcm) { if (!(it.qcm.ok >= 0 && it.qcm.ok < it.qcm.choices.length) || new Set(it.qcm.choices).size !== it.qcm.choices.length) { console.log('QCM', where, it); bad++; } return; }
  if (!Number.isFinite(it.v)) { console.log('v', where, it); bad++; return; }
  if (!MCVT.verdict(it, String(it.v).replace('.', ',')).ok) { console.log('refus', where, it); bad++; }
  (it.err || []).forEach(e => { if (Math.abs(e.v - it.v) <= (it.tol || 1e-6)) { console.log('erreur = bonne réponse', where, it.a, e); bad++; } });
  if (/NaN|undefined|Infinity/.test(it.a)) { console.log('texte', where, it.a); bad++; }
};
for (const id of Object.keys(MCVT.TR)) for (let s = 1; s <= 1500; s++) { let e; try { e = MCVT.tr(id, s); } catch (err) { console.log(id, s, err.message); bad++; break; } n++;
  e.items.forEach(it => chkItem(id + ':' + s, it));
  const ks = e.items.map(i => i.k); if (new Set(ks).size !== ks.length) { console.log('lettres', id); bad++; }
  if (/NaN|undefined|Infinity/.test(e.support + e.consigne)) { console.log('support', id, s); bad++; if (bad > 10) process.exit(1); } }
for (const id of Object.keys(MCVT.DEP)) for (let s = 1; s <= 1500; s++) { let d; try { d = MCVT.dep(id, s); } catch (err) { console.log(id, s, err.message); bad++; break; } n++;
  if (d.qs.length !== 5) { console.log('5 questions', id); bad++; }
  d.qs.forEach((q, i) => { if (q.kind === 'qcm') chkItem(id + ':' + i, { qcm: { choices: q.choices, ok: q.ok }, a: q.a }); else chkItem(id + ':' + i, q); if (q.kind === 'tap' && !d.doc.includes(`data-cell="${q.cell}"`)) { console.log('case', id, q.cell); bad++; } });
  if (/NaN|undefined|Infinity/.test(d.doc)) { console.log('doc', id, s); bad++; } }
console.log(`${Object.keys(MCVT.TR).length} exercices visuels · ${Object.keys(MCVT.DEP).length} points de départ · ${n} tirages · erreurs : ${bad}`);
/* zones « Automatismes du brevet » : 10 questions, réponse affichée acceptée */
{
  const AU = require('./shared/auto3.js'), MC = require('./shared/gens.js').MCVG; let n2 = 0, b2 = 0;
  for (const c of Object.keys(AU.A)) for (let s = 1; s <= 1500; s++) { const qs = AU.gen(c, s, 10); if (qs.length !== 10 || new Set(qs.map(q => q.t)).size !== 10) b2++; for (const q of qs) { n2++; if (q.choices) { if (!(q.ok >= 0 && q.ok < q.choices.length) || new Set(q.choices).size !== q.choices.length || q.a !== q.choices[q.ok]) b2++; continue; } const x = MC.parse(q.a.replace(/\s*€/, '').replace(/\s*%/, '').replace(/\s/g, '')); if (!(Math.abs(x - q.v) <= q.tol)) b2++; } }
  console.log(`automatismes : ${Object.keys(AU.A).length} chapitres · ${n2} questions tirées · erreurs : ${b2}`);
  if (b2) process.exitCode = 1;
}
