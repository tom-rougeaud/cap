/* Construit l’appli « Maths · CAP » en un seul fichier HTML (aucune ressource externe). */
'use strict';
const fs = require('fs'), path = require('path');
const HERE = __dirname, OUT = process.argv[2] || path.join(HERE, '..', 'cap', 'index.html');
const rd = f => fs.readFileSync(path.join(HERE, f), 'utf8');

let errs = 0;
const chk = (ok, msg) => { if (!ok) { errs++; console.error('✗ contrôle', msg); } };
const CH = require('./content')(chk);
const { SC } = require('./lib/scenes3e');
const K = require('./content/kit3e');
if (errs) { console.error(errs + ' erreur(s) de contenu'); process.exit(1); }

/* on n’embarque que ce dont l’appli a besoin */
const qv = q => ({ t: q.t, comp: q.comp, pts: q.pts, a: q.a, v: q.v, tol: q.tol, lab: q.lab, choices: q.choices, ok: q.ok });
const pr = p => ({ id: p.id, etape: p.etape, titre: p.titre, lc: p.lc, pouce: p.pouce, corr: p.corr, cls: p.cls, intro: p.intro, outro: p.outro, seq: p.seq, qs: p.qs, defi: p.defi || 0, bulle: p.bulle || '', autravail: p.autravail || null, hints: p.hints || [] });
const slim = c => ({ id: c.id, n: c.n, col: c.col, icone: c.icone, dom: c.dom, titre: c.titre, sous: c.sous, travail: c.travail, objectifs: c.objectifs, metier: c.metier, pont: c.pont, parties: c.parties, scene: SC[c.id](), depart: c.depart,
  notions: c.notions.map(n => ({ titre: n.titre, decouvre: n.decouvre, methode: n.methode, vois: n.vois, solution: n.solution, retiens: n.retiens, attention: n.attention, amoi: n.amoi })),
  mots: c.mots, resolus: c.resolus, entraine: c.entraine.filter(e => !e.niv), bilan: c.bilan, words: c.words,
  scratch: (c.scratch || []).map(sx => ({ titre: sx.titre, lc: sx.lc, texte: sx.texte, svg: K.scratchSvg(sx.prog, sx.titre), qs: sx.qs.map(([q, a]) => [q, a]) })),
  probs: c.probs.map(pr),
  eval: { lieu: c.eval.lieu, duree: c.eval.duree, grille: c.eval.grille, redac: c.eval.redac, auto: c.eval.auto.map(qv), exos: c.eval.exos.map(x => ({ t: x.t, intro: x.intro, qs: x.qs.map(qv) })) } });
const PDF = 'pdf/maths-cap.pdf', HASPDF = fs.existsSync(path.join(path.dirname(OUT), PDF));
const PDFCH = 'pdf/chapitres/maths-cap-chapitre-{n}.pdf', HASCH = fs.existsSync(path.join(path.dirname(OUT), PDFCH.replace('{n}', 1)));
/* décor de l’accueil : les motifs dessinés de la couverture */
const { M: MOT } = require('./lib/cover2');
const DECO = `<svg viewBox="0 0 840 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${[['d20', 700, 100, 6, .7, .22], ['card', 560, 230, -10, .6, .2], ['pixel', 790, 250, -4, .55, .2], ['bulle', 430, 90, -5, .55, .14], ['clap', 640, 30, 0, .7, .3], ['facto', 300, 250, 10, .5, .12], ['ecran', 520, 70, 8, .55, .16]].filter(([k]) => MOT[k]).map(([k, x, y, r, sc, op]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${sc})" opacity="${op}">${MOT[k]()}</g>`).join('')}</svg>`;
const CCF = require('./content/ccf3')(chk).map(sj => ({ id: sj.id, titre: sj.titre, grille: sj.grille, redac: sj.redac, lieu: '', auto: sj.auto.map(qv), exos: sj.exos.map(x => ({ t: x.t, intro: x.intro, qs: x.qs.map(qv) })) }));
if (errs) { console.error(errs + ' erreur(s) dans les CCF blancs'); process.exit(1); }
const PDFCCF = 'pdf/chapitres/maths-cap-ccf-blancs.pdf', HASCCF = fs.existsSync(path.join(path.dirname(OUT), PDFCCF));
/* pages du manuel imprimé : relevées pendant la pagination du PDF (make3.py) */
const PAGES = (() => { try {
  const R = JSON.parse(rd('build/eleve.result.json')), st = CH.map(c => R.secs[c.id]); const out = {};
  CH.forEach(c => { out[c.id] = { n: {}, x: {} }; });
  (R._blocks || []).forEach(([pg, k, id]) => { let ci = -1; st.forEach((s, i) => { if (s && pg >= s) ci = i; }); if (ci < 0) return; const o = out[CH[ci].id];
    if (k === 'n') o.n[id] = o.n[id] || pg; else if (k === 'x') { const m = id.match(/^c\d+-(.+)$/); if (m && !o.x[m[1]]) o.x[m[1]] = pg; } else if (!o[k]) o[k] = pg; });
  return out; } catch (e) { return {}; } })();
/* correspondance exacte avec les manuels : pages du PDF élève (référence figée), pages du PDF professeur, numéros d’exercices, blocs « Pour garder la forme » */
const REFS = (() => { try {
  const E = JSON.parse(rd('ref/eleve-ref.json')), N = JSON.parse(rd('ref/eleve.result.json')).num || {};
  const flash = {}; Object.entries(E.flash).forEach(([k, v]) => { flash[k] = { pg: v.pg, chap: v.chap, idx: v.idx }; });
  let AX = {}; try { AX = JSON.parse(rd('build/calque.result.json'))._annexe || {}; } catch (e) { console.error('annexe absente : ' + e.message); } const annexe = {};
  Object.entries(AX).forEach(([id, pg]) => { const k = E.pages['x|' + id] ? 'x|' + id : /-dep$/.test(id) ? 'dep|' + id.replace(/-dep$/, '') : /-auto$/.test(id) ? 'auto|' + id.replace(/-auto$/, '') : 'det|' + id; annexe[k] = pg; });
  return { pages: E.pages, annexe, num: N, flash }; } catch (e) { console.error('réf. manuel absente : ' + e.message); return { pages: {}, annexe: {}, num: {}, flash: {} }; } })();
const DATA = { version: '1.0 · octobre 2026', pdf: HASPDF ? PDF : '', pdfch: HASCH ? PDFCH : '', pdfccf: HASCCF ? PDFCCF : '', deco: DECO, pages: PAGES, ref: REFS, chapitres: CH.map(slim), ccf: CCF };

/* l’appli n’affiche pas les réponses dans les pointillés : on vide les attributs data-a */
const nb = t => t.replace(/>([^<]*)</g, (m, x) => '>' + x.replace(/(\d) (%|€)/g, '$1 $2') + '<');
const strip = v => typeof v === 'string' ? nb('>' + v.replace(/ data-a="[^"]*"/g, '') + '<').slice(1, -1) : Array.isArray(v) ? v.map(strip) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, strip(x)])) : v;
let json = JSON.stringify(strip(DATA));
json = json.replace(/<\//g, '<\\/').replace(/<!--/g, '\\u003c!--').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

const FONTS = rd('style/fonts.css');
const CSS = ['print.css', 'n3.css', 'mcv.css'].map(f => rd('style/' + f)).join('\n')
  .replace(/@page\{[^}]*\}/g, '').replace(/html,body\{margin:0;padding:0;background:#fff\}/, 'html,body{margin:0;padding:0}');
const APPCSS = rd('app/app.css') + '\n' + rd('app/app3.css');
const js = s => s.replace(/<\/script/gi, '<\\/script');
const FAV = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#E9F797"/><text x="32" y="47" font-family="Arial,sans-serif" font-size="44" font-weight="700" fill="#1D2240" text-anchor="middle">Σ</text></svg>`);

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Maths · CAP</title>
<meta name="description" content="Mathématiques de CAP : des références de la pop culture avec de vraies données, des leçons pas à pas, de l’entraînement corrigé, un problème par chapitre, des évaluations au format du CCF et deux CCF blancs.">
<meta name="theme-color" content="#E9F797">
<meta name="author" content="Tom Rougeaud">
<link rel="icon" href="${FAV}">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Maths CAP">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<style>${FONTS}</style>
<style>${require('./lib/tex').css()}</style>
<style>${CSS}</style>
<style>${APPCSS}</style>
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
<header class="top"><div class="top-in"><a class="logo" href="#/"><i>Σ</i><span><b>Maths · CAP</b><small>Programme officiel 2019</small></span></a><nav><a href="#/ccf" class="hide-s">CCF</a><a href="#/glossaire" class="hide-s">Glossaire</a><a href="#/a-propos">À propos</a><button class="profsw" data-prof aria-pressed="false" title="Mode professeur(e) : corrigés et annexe du manuel professeur" aria-label="Mode professeur(e)">👩‍🏫</button></nav></div></header>
<main id="main" tabindex="-1"><noscript><p>Cette application a besoin de JavaScript.${HASPDF ? ` Le manuel PDF reste disponible : <a href="${PDF}">télécharger le manuel</a>.` : ''}</p></noscript></main>
<footer class="foot2">Maths · CAP — Tom Rougeaud · CC BY-NC 4.0 · <a href="#/confidentialite">Confidentialité</a> · <a href="#/donnees">Mes données</a> · <a href="https://tom-rougeaud.github.io/mcv/">Tout le programme</a></footer>
<script>${js(rd('shared/gens.js'))}</script>
<script>${js(rd('shared/g1.js'))}</script>
<script>${js(rd('shared/pie.js'))}</script>
<script>${js(rd('shared/train.js'))}</script>
<script>${js(rd('shared/auto3.js'))}</script>
${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(n => fs.existsSync(path.join(HERE, 'shared/t' + n + '.js'))).map(n => `<script>${js(rd('shared/t' + n + '.js'))}</script>`).join('\n')}
<script>${js(rd('shared/mech.js'))}</script>
<script>${js(rd('app/widgets.js'))}</script>
${fs.existsSync(path.join(HERE, 'app/widgets_x.js')) ? `<script>${js(rd('app/widgets_x.js'))}</script>` : ''}
<script type="application/json" id="mcv-data">${json}</script>
<script>${js(rd('app/app3.js'))}</script>
<script>${js(rd('lib/svgfit.js'))}</script>
<script>${js(fs.readFileSync(path.join(HERE, 'node_modules/katex/dist/katex.min.js'), 'utf8'))}</script>
<script>${js(rd('lib/mathify.js'))}</script>
<script>${js(rd('lib/mathrun.js'))}</script>
<script>try { MCmathrun.watch(document.getElementById('main')); } catch (e) { }</script>
<script>try { MCVfit.watch(document.getElementById('main')); } catch (e) { }</script>
<script>window.MCVPWA={"name": "Maths · CAP", "short": "Maths CAP", "key": "mcvcap.v1", "color": "#E9F797", "ink": "#1D2240"};</script>
<script>${js(rd('pwa/pwa.js'))}</script>
</body>
</html>
`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`✓ ${OUT} · ${(html.length / 1024).toFixed(0)} Ko · ${CH.length} chapitres · ${CH.reduce((s, c) => s + c.entraine.length, 0)} entraînements · ${CH.reduce((s, c) => s + c.probs.length, 0)} problèmes · ${CCF.length} CCF blancs`);
