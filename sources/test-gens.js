const { MCVG } = require('./shared/gens.js');
let bad = 0, n = 0;
for (const id of Object.keys(MCVG.G)) {
  for (let s = 1; s <= 3000; s++) {
    let it; try { it = MCVG.make(id, s); } catch (e) { console.log(id, s, e.message); bad++; break; }
    n++;
    if (!it.q || it.a == null) { console.log('vide', id, s); bad++; continue; }
    if (it.choices) { if (!(it.ok >= 0 && it.ok < it.choices.length) || new Set(it.choices).size !== it.choices.length) { console.log('QCM', id, s, it); bad++; } continue; }
    if (!Number.isFinite(it.v)) { console.log('v', id, s, it); bad++; continue; }
    if (!MCVG.check(it, it.inp || it.a)) { console.log('réponse affichée refusée', id, s, it.a, it.v); bad++; if (bad > 20) process.exit(1); }
  }
}
console.log(`${Object.keys(MCVG.G).length} générateurs · ${n} tirages · erreurs : ${bad}`);
