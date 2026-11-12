/* Contrôles du standard 2026-11 (voir STANDARD.md) sur les données du manuel : réponse présente dans l’énoncé, question qui donne la
   réponse d’une autre, nombre repris d’un exemple du cours, nombre à point, mots interdits, arrondi annoncé sur une valeur exacte. */
'use strict';
const path = require('path'); const S = path.join(__dirname, '..');
const ERR = []; const DATA = require(path.join(S, 'content/index.js'))((ok, m) => { if (!ok) ERR.push(m); });
const { MCVT } = require(path.join(S, 'shared/train.js')); require(path.join(S, 'shared/mech.js'));
const seedOf = s => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const strip = h => String(h || '').replace(/data-a="[^"]*"/g, '').replace(/<[^>]*>/g, ' ').replace(/\\\(|\\\)|\\[a-z]+|[{}]/g, ' ').replace(/&nbsp;/g, ' ');
const nums = t => (strip(t).replace(/(\d)[   ](?=\d{3}(\D|$))/g, '$1').match(/\d+(?:,\d+)?/g) || []).map(x => +x.replace(',', '.'));
const has = (arr, v) => arr.some(x => Math.abs(x - v) < 1e-9);
const big = v => Number.isFinite(v) && (!Number.isInteger(v) || Math.abs(v) > 12);
const out = []; const flag = (c, where, msg) => out.push(`${c} · ${where} · ${msg}`);
const words = (c, where, t) => { const x = strip(t); if (/\d\.\d/.test(x.replace(/arXiv:\S+/g, ''))) flag(c, where, 'nombre à point'); const m = x.match(/undefined|NaN|voir la case|Coup de pouce|\bde le \b|\bà le \b|d’une ticket/); if (m) flag(c, where, 'mot interdit : ' + m[0]); };
DATA.forEach(c => {
  const lesson = nums(c.notions.map(n => n.solution + ' ' + n.methode.join(' ')).join(' ')).filter(big);
  (c.probsManuel ? c.probs : []).forEach(p => { const intro = nums(String(p.intro).replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<p class="srcl">.*?<\/p>/g, '')), W = `problème ${p.id} « ${p.titre} »`; words(c.id, W, p.intro + p.qs.map(q => q.t).join(' '));
    p.qs.forEach((q, i) => { if (q.v == null || !big(q.v)) return;
      if (has(intro, q.v)) flag(c.id, W, `la réponse ${q.l} (${q.v}) est dans l’énoncé`);
      p.qs.forEach((r, j) => { if (j !== i && has(nums(r.t), q.v)) flag(c.id, W, `la question ${r.l} contient la réponse de ${q.l} (${q.v})`); });
    }); const re = p.qs.filter(q => q.v != null && big(q.v) && has(lesson, q.v)); if (re.length >= 2) flag(c.id, W, `${re.length} réponses sont des nombres de l’exemple du cours (${re.map(q => q.v).join(' ; ')})`); });
  c.entraine.filter(e => !e.niv).forEach(e => { if (c.court) return; const g = MCVT.tr(e.gen, seedOf(c.id + '-' + e.id)), W = `exercice ${e.id} « ${g.titre} »`, txt = g.consigne + ' ' + g.support, N = nums(String(txt).replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(e.gen === 'c6e1' ? /<table[\s\S]*?<\/table>/g : /$^/, ' ')); words(c.id, W, txt);
    g.items.forEach(it => { if (it.v != null && big(it.v) && has(N, it.v)) flag(c.id, W, `la réponse ${it.k} (${it.v}) est dans l’énoncé`); }); const re = g.items.filter(it => it.v != null && big(it.v) && has(lesson, it.v)); if (re.length >= 2) flag(c.id, W, `${re.length} réponses sont des nombres de l’exemple du cours (${re.map(q => q.v).join(' ; ')})`); });
  c.notions.forEach((n, i) => { if (!MCVT.MECH[c.id + '.' + (i + 1)]) return; const m = MCVT.mech(c.id, i + 1, seedOf(`${c.id}-m${i + 1}`));
    m.items.forEach(it => { words(c.id, `mécanique ${i + 1}`, it.t); if (it.tol < 1e-6 && /arrondi|l’unité près|au (dixième|centième|centime)/i.test(it.t)) flag(c.id, `mécanique ${i + 1}`, 'arrondi annoncé sur une valeur exacte : ' + it.t); }); });
});
console.log(out.join('\n')); console.log(`\nstandard 2026-11 : ${out.length} anomalie(s) · erreurs de calcul : ${ERR.length}`); if (process.argv.includes('--strict') && out.length) process.exit(1);
