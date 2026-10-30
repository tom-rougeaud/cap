/* Chapitre 1 · Statistique à une variable — CAP Maths (programme de mathématiques des classes préparant au CAP, BOEN spécial n° 5 du 11 avril 2019). */
'use strict';
const K = require('./kit3e');
const { H, FM, R, Q, BQ, PB, ENT, tab, S, T, Rc, Ar, Br, st, bl, SN } = K;
const { SK, D } = require('./sk3');
const PIE = require('../shared/pie.js');
const { MCVG } = require('../shared/gens.js');
const fr = (x, d) => MCVG.fr(x, d), rnd = MCVG.rnd, f1 = x => fr(rnd(x, 1), 1), f2 = x => fr(rnd(x, 2), 2);
const sum = a => a.reduce((x, y) => x + y, 0);
const tally = a => { const m = {}; a.forEach(v => { m[v] = (m[v] || 0) + 1; }); return Object.keys(m).map(Number).sort((x, y) => x - y).map(v => [v, m[v]]); };

module.exports = function (chk) {
  const c = { id: 'c1', n: 1, col: 'donnees', icone: '📊', dom: 'Statistique et probabilités · statistique à une variable', titre: 'Statistique à une variable', sous: 'Effectifs, fréquences, diagrammes, moyenne' };
  c.parties = [{ t: 'Organiser les données', n: [1, 2] }, { t: 'Les représenter', n: [3] }, { t: 'Les résumer par un nombre', n: [4] }];
  c.travail = { question: `En 2025, il y a eu près de ${H('157 millions d’entrées')} dans les cinémas français. Quel mois a été le plus fréquenté ? Et combien de spectateurs y a-t-il eu en moyenne chaque mois ? Tu sauras répondre aux notions 1 et 4.` };
  c.objectifs = ['Je saurai calculer un effectif total et regrouper des données par classes.', 'Je saurai calculer une fréquence et l’écrire en fraction, en décimal et en pourcentage.', 'Je saurai lire et construire un diagramme en bâtons et un diagramme circulaire.', 'Je saurai calculer une moyenne, avec ou sans effectifs.'];
  c.depart = 'c1';

  /* ---------- contrôles des nombres du chapitre ---------- */
  const SIM = D.simpsons, tl = tally(SIM), N = SIM.length;
  const cl1 = SIM.filter(v => v <= 19).length, cl2 = SIM.filter(v => v >= 20 && v <= 22).length, cl3 = SIM.filter(v => v >= 23).length;
  const n22 = SIM.filter(v => v === 22).length, TOTS = sum(SIM);
  chk(N === 36 && TOTS === 790 && tl.map(x => x.join(':')).join() === '13:1,18:1,20:1,21:4,22:21,23:3,24:1,25:4', 'c1 Simpson : effectifs');
  chk(cl1 === 2 && cl2 === 26 && cl3 === 8 && cl1 + cl2 + cl3 === 36 && [cl1, cl2, cl3].map(x => x * 10).join() === '20,260,80', 'c1 Simpson : classes et angles');
  chk(n22 === 21 && Math.abs(21 / 36 - 0.58333) < 1e-4 && f1(21 / 36 * 100) === '58,3' && f1(26 / 36 * 100) === '72,2', 'c1 fréquences Simpson');
  const A25 = D.cnc2025, A24 = D.cnc2024, T25 = rnd(sum(A25), 2), T24 = rnd(sum(A24), 2), M25 = T25 / 12, M24 = T24 / 12;
  chk(T25 === 156.66 && T24 === 181.54 && f2(M25) === '13,06' && fr(rnd(M25, 3), 3) === '13,055' && f2(M24) === '15,13', 'c1 CNC : total et moyenne');
  chk(A25.filter(v => v < M25).length === 7 && f1(A25[11] / T25 * 100) === '13,2' && rnd(T24 - T25, 2) === 24.88 && f2((T24 - T25) / 12) === '2,07', 'c1 CNC : mois, part de décembre, écart');
  const T10 = D.top2025.map(x => x[1]), S10 = rnd(sum(T10), 2), S5 = rnd(sum(T10.slice(0, 5)), 2), S3 = rnd(sum(T10.slice(0, 3)), 2);
  chk(S10 === 35.4 && S5 === 22.14 && S3 === 15.86 && T10.filter(v => v > 3).length === 4 && f1(6.18 / S10 * 100) === '17,5' && fr(rnd(6.18 / S5, 3), 3) === '0,279' && Math.round(6.18 / S5 * 100) === 28 && S3 / S10 < .5, 'c1 top 10 du CNC');
  const SA = SIM.slice(0, 10), tA = tally(SA), sA = sum(SA), SB = SIM.slice(10, 20), tB = tally(SB);
  chk(sA === 226 && rnd(sA / 10, 1) === 22.6 && tA.map(x => x.join(':')).join() === '13:1,22:3,23:1,24:1,25:4' && tB.map(x => x.join(':')).join() === '20:1,21:3,22:6' && 6 / 10 === .6 && 3 / 10 * 360 === 108, 'c1 résolus');
  const M11 = rnd(T25 - A25[11], 2); chk(M11 === 135.93 && 14.5 * 12 === 174 && rnd(174 - M11, 2) === 38.07 && rnd(38.07 / A25[11], 1) === 1.8 && Math.max(...A24) === 20.54 && f2(M24) === '15,13' && rnd(M24 - A25[8], 2) === 5.67, 'c1 défi CNC');

  /* ---------- méthodes visuelles ---------- */
  const fracSvg = (x, y, n, d, o = {}) => T(x, y, n, { fs: o.fs || 20, c: o.c }) + `<line x1="${x - (o.w || 30)}" y1="${y + 9}" x2="${x + (o.w || 30)}" y2="${y + 9}" class="ks" stroke-width="2.2"/>` + T(x, y + 34, d, { fs: o.fs || 20, c: o.c });
  // 1. effectifs et classes
  const cols = tl;
  const classes = S(600, 200, st(1, SN(1, 22, 20) + T(300, 25, SIM.slice(0, 11).join(' · ') + ' · …', { fs: 14, c: 'kt' }))
    + st(2, SN(2, 22, 56) + T(54, 66, 'épisodes', { fs: 12, a: 'start', c: 'ts' }) + T(54, 92, 'saisons', { fs: 12, a: 'start', c: 'ts' }) + cols.map(([v, n], i) => Rc(118 + i * 58, 48, 54, 22, { rx: 4 }) + T(145 + i * 58, 64, v, { fs: 14 }) + Rc(118 + i * 58, 74, 54, 22, { rx: 4, c: 'k' }) + T(145 + i * 58, 90, n, { fs: 14, c: 'tw' })).join(''))
    + st(3, SN(3, 22, 122) + Rc(60, 106, 480, 28, { rx: 8 }) + T(300, 126, cols.map(x => x[1]).join(' + ') + ' = 36 saisons', { fs: 15 }))
    + st(4, SN(4, 22, 168) + [['[13 ; 19]', cl1], ['[20 ; 22]', cl2], ['[23 ; 25]', cl3]].map(([k, n], i) => Rc(60 + i * 162, 148, 150, 42, { c: 'k', rx: 8 }) + T(135 + i * 162, 166, k, { fs: 15, c: 'tw' }) + T(135 + i * 162, 182, n + ' saisons', { fs: 12, c: 'tw' })).join('')),
  'Le nombre d’épisodes par saison est rangé dans un tableau d’effectifs (total 36), puis en trois classes : 2, 26 et 8 saisons');
  // 2. fréquence
  const freq = S(600, 200, st(1, SN(1, 24, 22) + T(150, 27, '21 saisons ont 22 épisodes', { fs: 15 }))
    + st(2, SN(2, 24, 84) + fracSvg(104, 76, '21', '36', { w: 30 }) + T(168, 100, '≈', { fs: 22 }) + T(236, 100, '0,583', { fs: 19, c: 'kt' }))
    + st(3, SN(3, 330, 84) + T(430, 100, '× 100', { fs: 16, c: 'ts' }) + Ar(398, 108, 470, 108, { w: 2.4, h: 8 }) + Rc(480, 80, 100, 40, { c: 'k', rx: 10 }) + T(530, 106, '58,3 %', { fs: 20, c: 'tw' }))
    + st(4, SN(4, 24, 138) + Array.from({ length: 36 }, (_, i) => `<rect x="${60 + (i % 18) * 28}" y="${124 + Math.floor(i / 18) * 26}" width="24" height="22" rx="4" class="${i < 21 ? 'k' : 'k2'} ks" stroke-width="1.4"/>`).join('') + T(300, 193, '21 carrés foncés sur 36 : un peu plus de la moitié', { fs: 13, c: 'kt' })),
  '21 sur 36 donne environ 0,583, soit 58,3 % ; 21 carrés foncés sur 36');
  // 3. bâtons et circulaire
  const bars = [cl1, cl2, cl3], clsN = ['moins de 20', '20 à 22', '23 à 25'];
  const batons = S(600, 200, st(1, SN(1, 22, 22) + PIE.bars({ x0: 52, y0: 164, pitch: 62, bw: 44, u: 4, vals: bars, cats: clsN, ticks: [0, 5, 10, 15, 20, 25], vmax: 28, color: i => PIE.col(i), fs: 10, vfs: 12, unit: 'saisons' }))
    + st(2, SN(2, 276, 34) + T(296, 39, 'angle = effectif × 10°', { fs: 12, a: 'start', c: 'kt' }) + bars.map((n, i) => PIE.chip(276, 55 + i * 24, i, 14) + T(298, 66 + i * 24, `${n} × 10 = ${n * 10}°`, { fs: 14, a: 'start' })).join('') + T(296, 140, '20° + 260° + 80° = 360°', { fs: 12, a: 'start', c: 'ts' }))
    + st(3, SN(3, 440, 34) + PIE.sectors({ cx: 522, cy: 100, r: 56, fs: 13, minIn: 45, gap: 10, parts: bars.map((n, i) => ({ a: n * 10, in: `${n * 10}°` })) }))
    + st(4, SN(4, 276, 170) + T(296, 175, 'plus haut bâton = plus grand secteur', { fs: 12, a: 'start', c: 'kt' }) + T(296, 193, 'classe [20 ; 22] : 26 saisons sur 36', { fs: 12, a: 'start', c: 'kt' })),
  'Diagramme en bâtons de trois classes (2, 26 et 8 saisons) et diagramme circulaire de 20°, 260° et 80°, avec les mêmes couleurs');
  // 4. moyenne
  const fm = v => Number.isInteger(v) ? String(v) : fr(v, 2);
  const moy = S(600, 200, st(1, SN(1, 22, 22) + PIE.bars({ x0: 40, y0: 156, pitch: 26.5, bw: 23, u: 5, vals: A25, cats: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], ticks: [0, 5, 10, 15, 20], vmax: 22, fmt: fm, color: i => i === 11 ? PIE.col(0) : PIE.col(1), fs: 10, vfs: 7.6, unit: 'millions d’entrées', mean: M25 })
    + `<line x1="48" y1="190" x2="76" y2="190" stroke="#C2332A" stroke-width="2.4" stroke-dasharray="6 4"/>` + T(82, 194, 'moyenne : 13,055 millions par mois', { fs: 11, a: 'start', c: 'kt' }))
    + st(2, SN(2, 386, 30) + T(494, 35, '13,83 + 14,30 + … + 20,73', { fs: 13 }) + T(494, 56, '= 156,66 millions', { fs: 15, c: 'kt' }))
    + st(3, SN(3, 386, 88) + T(494, 94, '12 mois : on divise par 12', { fs: 13 }) + T(494, 116, '156,66 ÷ 12', { fs: 16 }))
    + st(4, SN(4, 386, 152) + Rc(406, 134, 188, 50, { c: 'k', rx: 12 }) + T(500, 157, '13,055 millions', { fs: 18, c: 'tw' }) + T(500, 176, 'par mois, en moyenne', { fs: 12, c: 'tw' })),
  'Douze barres mensuelles avec leur valeur en millions et la ligne de la moyenne : 156,66 ÷ 12 = 13,055 millions d’entrées par mois');

  c.notions = [
    { titre: 'Effectifs, effectif total et classes', decouvre: { txt: `Les Simpson ont diffusé ${H('36 saisons')} complètes. Chaque saison compte un nombre d’épisodes. Combien de saisons ont ${H('22 épisodes')} ? Et combien de saisons en tout ?`, img: SK.saisons() },
      methode: ['Je repère ce que je compte : le nombre d’épisodes de chaque saison (13, 22, 24, 22…).', 'Je compte combien de fois chaque valeur apparaît : c’est son effectif.', 'J’additionne tous les effectifs : j’obtiens l’effectif total.', 'Si les valeurs sont trop nombreuses, je les regroupe en classes : [13 ; 19], [20 ; 22], [23 ; 25].'],
      vois: classes,
      solution: `<p>21 saisons comptent 22 épisodes. L’effectif total est ${FM(R`1+1+1+4+21+3+1+4=36`)} saisons.</p><p>Par classes : 2 saisons dans [13 ; 19], 26 dans [20 ; 22] et 8 dans [23 ; 25]. Et 2 + 26 + 8 = 36.</p><p class="srcl">${D.srcSimpsons}</p>`,
      retiens: `<p>L’<b>effectif</b> d’une valeur est le nombre de fois où elle apparaît. L’<b>effectif total</b> est la somme de tous les effectifs.</p><p>Une <b>classe</b> regroupe des valeurs proches. La classe [20 ; 22] contient tous les nombres x tels que 20 ≤ x ≤ 22.</p>`,
      attention: 'Une valeur ne peut être que dans une seule classe : [13 ; 19], [20 ; 22], [23 ; 25]. Jamais [20 ; 22] et [22 ; 25] : 22 serait compté deux fois.',
      amoi: [['Combien de saisons comptent 25 épisodes ?', '4 saisons'], ['Combien de saisons comptent 21 épisodes ou moins ?', '1 + 1 + 1 + 4 = 7 saisons']] },
    { titre: 'Fréquences', decouvre: { txt: `Sur les ${H('36 saisons')} des Simpson, ${H('21')} comptent 22 épisodes. Quelle part des saisons cela représente-t-il ? Comment l’écrire de plusieurs façons ?`, img: SK.barre() },
      methode: ['J’écris l’effectif de la valeur qui m’intéresse : 21 saisons.', 'Je divise par l’effectif total : 21 ÷ 36.', 'Je lis le résultat décimal : 0,583… que j’arrondis si on me le demande.', 'Je multiplie par 100 pour avoir un pourcentage : 58,3 %.'],
      vois: freq,
      solution: `<p>La fréquence des saisons à 22 épisodes est ${FM(R`f=\dfrac{21}{36}\approx0{,}583`)}, soit environ <b>58,3 %</b> des saisons.</p><p>La classe [20 ; 22] a une fréquence de 26 ÷ 36 ≈ 0,722, soit 72,2 %.</p>`,
      retiens: `<p>${FM(R`\text{fréquence}=\dfrac{\text{effectif}}{\text{effectif total}}`)}</p><p>Une fréquence est comprise entre 0 et 1. On peut l’écrire en <b>fraction</b>, en <b>nombre décimal</b> ou en <b>pourcentage</b>. La somme de toutes les fréquences vaut 1, soit 100 %.</p>`,
      attention: 'On divise toujours par l’effectif total (36 saisons), pas par le nombre de valeurs différentes (8) ni par le plus grand effectif.',
      amoi: [['Quelle est la fréquence, arrondie au centième, des saisons à 21 épisodes (4 saisons) ?', '4 ÷ 36 ≈ 0,11'], ['Mentalement : 9 saisons sur 36, quel pourcentage ?', '9/36 = 1/4 = 25 %']] },
    { titre: 'Diagrammes en bâtons et circulaires', decouvre: { txt: `Les ${H('36 saisons')} sont rangées en trois classes : ${H('2')}, ${H('26')} et ${H('8')} saisons. Comment montrer cette répartition d’un seul coup d’œil ?`, img: SK.secteurs() },
      methode: ['Bâtons : un axe pour les classes, un axe pour les effectifs. La hauteur du bâton est l’effectif.', 'Cercle : l’angle est proportionnel à l’effectif. Ici 360° ÷ 36 = 10° par saison.', 'Je calcule les angles : 20°, 260° et 80°. Je vérifie : 20 + 260 + 80 = 360.', 'Je lis : le plus haut bâton et le plus grand secteur indiquent la classe la plus fréquente.'],
      vois: batons,
      solution: `<p>Angles : 20°, 260° et 80°. Le plus grand secteur est celui de la classe [20 ; 22] : 26 saisons sur 36.</p><p>Le total des angles vaut bien 360°.</p>`,
      retiens: `<p><b>Diagramme en bâtons</b> : la hauteur de chaque bâton est l’effectif (ou la fréquence).</p><p><b>Diagramme circulaire</b> : ${FM(R`\text{angle}=\dfrac{\text{effectif}}{\text{effectif total}}\times360^\circ`)}</p><p>Un diagramme a toujours un titre, des axes avec leur unité, ou une légende.</p>`,
      attention: 'L’axe des effectifs d’un diagramme en bâtons commence à 0. Un axe qui commence plus haut fait paraître les écarts plus grands qu’ils ne sont.',
      amoi: [['Quel est l’angle du secteur pour 9 saisons sur 36 ?', '9 × 10 = 90°'], ['Un secteur de 90° représente quelle fréquence ?', '90/360 = 1/4 = 25 %']] },
    { titre: 'La moyenne', decouvre: { txt: `Voici les entrées au cinéma en France, mois par mois, en ${H('2025')}, en millions. Combien d’entrées y a-t-il eu en moyenne chaque mois ?`, img: SK.moyenne() },
      methode: ['J’additionne les 12 valeurs : 13,83 + 14,30 + … + 20,73 = 156,66 millions.', 'Je compte les valeurs : il y en a 12.', 'Je divise la somme par le nombre de valeurs : 156,66 ÷ 12 = 13,055.', 'Je contrôle : 13,055 est entre 9,46 et 20,73. Je réponds avec l’unité.'],
      vois: moy,
      solution: `<p>En moyenne, il y a eu <b>13,055 millions d’entrées par mois</b>, soit environ 13,06 millions.</p><p class="srcl">${D.srcCnc}</p>`,
      retiens: `<p>${FM(R`\text{moyenne}=\dfrac{\text{somme des valeurs}}{\text{nombre de valeurs}}`)}</p><p>Quand les valeurs ont des effectifs : on multiplie chaque valeur par son effectif, on additionne, puis on divise par l’effectif total.</p>`,
      attention: 'La moyenne n’est pas forcément une valeur de la série (21,9 épisodes n’existe pas), mais elle est toujours entre la plus petite et la plus grande valeur. Sinon, il y a une erreur.',
      amoi: [['Mentalement : quelle est la moyenne de 12 ; 15 ; 18 ?', '(12 + 15 + 18) ÷ 3 = 45 ÷ 3 = 15'], ['En 2024, les 12 mois totalisent 181,54 millions. Quelle est la moyenne par mois (au centième) ?', '181,54 ÷ 12 ≈ 15,13 millions']] }];
  chk(90 / 360 === .25 && 4 / 36 > .11 && f2(4 / 36) === '0,11' && 9 / 36 === .25 && tl.filter(([v]) => v <= 21).reduce((a, [, n]) => a + n, 0) === 7 && (12 + 15 + 18) / 3 === 15, 'c1 « À moi »');

  /* Je programme avec Scratch */
  c.scratch = [{ titre: 'calculer une moyenne', lc: 4, texte: 'Un programme peut faire la somme de plusieurs nombres : il utilise une variable « total » qu’il augmente à chaque réponse, puis il divise par le nombre de réponses.',
    prog: [{ c: 'evt', t: 'quand ⚑ est cliqué' }, { c: 'var', t: 'mettre total à 0' }, { c: 'ctl', t: 'répéter 3 fois', open: 3 }, { c: 'sns', t: 'demander « Entrées du mois ? » et attendre', d: 1 }, { c: 'var', t: 'ajouter réponse à total', d: 1 }, { c: 'ctl', t: '', end: true }, { c: 'look', t: 'dire (total / 3)' }],
    qs: [['Les trois réponses sont 12 ; 15 ; 18. Que vaut « total » à la fin ?', '45', 'total passe de 0 à 12, puis 27, puis 45 : 12 + 15 + 18 = 45.'], ['Que dit le lutin à la fin ?', '15', 'Le lutin dit total / 3 = 45 ÷ 3 = 15 : c’est la moyenne.'], ['Que faut-il changer pour 12 mois ?', 'remplacer les deux 3 par 12', 'Le nombre de répétitions et le diviseur doivent être égaux au nombre de valeurs : « répéter 12 fois » et « total / 12 ».']] }];
  chk(12 + 15 + 18 === 45 && 45 / 3 === 15, 'c1 Scratch');

  c.mots = [['effectif', 'nombre de fois où une valeur apparaît', '21 saisons ont 22 épisodes : l’effectif de 22 est 21.'], ['effectif total', 'somme de tous les effectifs', '36 saisons en tout.'], ['fréquence', 'effectif divisé par l’effectif total', '21/36 ≈ 0,583 ≈ 58,3 %.'], ['classe', 'groupe de valeurs voisines, écrit avec un intervalle', 'la classe [20 ; 22] regroupe 20, 21 et 22 épisodes.'], ['diagramme en bâtons', 'graphique où la hauteur d’un bâton est l’effectif', 'un bâton de hauteur 26 pour la classe [20 ; 22].'], ['diagramme circulaire', 'cercle partagé en secteurs proportionnels aux effectifs', 'le secteur de 260° représente 26 saisons.'], ['moyenne', 'somme des valeurs divisée par leur nombre', '156,66 ÷ 12 = 13,055 millions d’entrées par mois.']];

  /* ---------- exercices résolus ---------- */
  c.resolus = [
    { titre: 'Calculer une moyenne avec des effectifs', outil: '🧮 calculatrice', enonce: `Voici le nombre d’épisodes des ${H('10 premières saisons')} des Simpson : 13 · 22 · 24 · 22 · 22 · 25 · 25 · 25 · 25 · 23. Calcule la moyenne d’épisodes par saison.`,
      rows: [['13 → 1 ; 22 → 3 ; 23 → 1 ; 24 → 1 ; 25 → 4', 'Je range les valeurs dans un tableau d’effectifs.'], ['1 + 3 + 1 + 1 + 4 = 10', 'J’additionne les effectifs : c’est l’effectif total.'], ['13 × 1 + 22 × 3 + 23 × 1 + 24 × 1 + 25 × 4 = 13 + 66 + 23 + 24 + 100 = <b>226</b>', 'Je multiplie chaque valeur par son effectif, puis j’additionne.'], ['226 ÷ 10 = <b>22,6</b>', 'Je divise la somme par l’effectif total.']], verif: '22,6 est entre 13 et 25, et 10 × 22,6 = 226 ✓', rep: 'Les 10 premières saisons comptent en moyenne 22,6 épisodes.', go: ['e3'] },
    { titre: 'À toi : fréquence et angle', outil: '🧮 calculatrice', enonce: `Voici le nombre d’épisodes des saisons ${H('11 à 20')} : 22 · 21 · 22 · 22 · 22 · 21 · 22 · 22 · 20 · 21. Calcule la fréquence de la valeur 22, puis l’angle du secteur de la valeur 21 dans un diagramme circulaire.`, trous: [0, 1, 2, 3],
      rows: [['22 → ⟦6⟧ ; 21 → 3 ; 20 → 1', 'Je compte combien de fois chaque valeur apparaît.'], ['6 + 3 + 1 = ⟦10⟧', 'L’effectif total est la somme des effectifs.'], ['fréquence de 22 : 6 ÷ 10 = ⟦0,6⟧ = ⟦60⟧ %', 'Effectif divisé par l’effectif total, puis × 100.'], ['angle de 21 : 3 ÷ 10 × 360 = ⟦108⟧°', 'Le secteur est proportionnel à l’effectif : fréquence × 360°.']], verif: '60 % + 30 % + 10 % = 100 % ✓', rep: 'La fréquence de 22 est 0,6 (60 %) et le secteur de 21 mesure 108°.', go: ['e1', 'e2'] }];
  c.entraine = ENT('c1', [2, 3, 4]);

  /* ---------- je résous ---------- */
  const T10t = D.top2025;
  const topTab = n => tab(['Rang', 'Film', 'Entrées (millions)'], T10t.slice(0, n).map(([f, v], i) => [String(i + 1), f, fr(v, 2)]));
  const mths = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const cncTab = yrs => tab(['Millions d’entrées', ...mths], yrs.map(y => [String(y), ...(y === 2025 ? A25 : A24).map(v => fr(v, 2))]));
  const pCNC = `<p>Le CNC (Centre national du cinéma) compte les billets vendus dans les salles : une ${H('entrée')}, c’est un billet vendu.</p>`;
  c.probs = [
    PB({ id: 'pa', niv: -1, base: 'p1', etape: 2, lc: 2, comps: ['app', 'rea'], titre: 'Le top 5 du cinéma en 2025 (pas à pas)',
      intro: pCNC + `<p>Voici les ${H('5 films')} les plus vus en France en 2025.</p>${topTab(5)}<p class="srcl">${D.srcTop}</p>`,
      qs: [Q('a.', 'Quel film a fait le plus d’entrées ?', 'Zootopie 2, avec 6,18 millions d’entrées.', null, { lines: 1 }), Q('b.', 'Additionne les 5 nombres : 6,18 + 5,10 + 4,58 + 3,31 + 2,97. C’est l’effectif total, en millions.', fr(S5, 2) + ' millions', S5, { w: 30, lab: 'total :' }), Q('c.', 'Calcule la fréquence de Zootopie 2 dans ce top 5 : 6,18 ÷ 22,14 (arrondie au millième).', fr(rnd(6.18 / S5, 3), 3), rnd(6.18 / S5, 3), { w: 30, tol: .0006 }), Q('d.', 'Écris cette fréquence en pourcentage, arrondi à l’unité.', Math.round(6.18 / S5 * 100) + ' %', Math.round(6.18 / S5 * 100), { w: 26, tol: .6 })],
      err: { 1: [{ v: 6.18, m: 'C’est l’effectif de Zootopie 2. L’effectif total est la somme des 5 films.' }], 2: [{ v: 6.18 * 100 / S5 / 100 * 100, m: 'Ce nombre est un pourcentage : donne d’abord la fréquence en décimal.' }] },
      hints: ['Cherche le plus grand nombre de la colonne.', 'Additionne les cinq nombres de la colonne de droite.', 'Fréquence = 6,18 ÷ l’effectif total.'], pouce: 'Total : 22,14. Fréquence : 6,18 ÷ 22,14 ≈ 0,279. Pourcentage : × 100.',
      det: ['Le plus grand nombre de la colonne est 6,18 : Zootopie 2.', '6,18 + 5,10 + 4,58 + 3,31 + 2,97 = 22,14 millions.', '6,18 ÷ 22,14 ≈ 0,279.', '0,279 × 100 = 27,9, soit environ 28 % des entrées du top 5.'], corr: 'a. Zootopie 2. b. 22,14. c. 0,279. d. 28 %.' }),
    PB({ id: 'p1', etape: 2, lc: 2, comps: ['app', 'ana', 'rea'], titre: 'Le top 10 du cinéma en 2025',
      intro: pCNC + `<p>Voici les ${H('10 films')} les plus vus en France en 2025.</p>${tab(['Rang', 'Film', 'Millions'], T10t.map(([f, v], i) => [String(i + 1), f, fr(v, 2)]))}<p class="srcl">${D.srcTop}</p>`,
      qs: [Q('a.', 'Calcule le total des entrées de ces 10 films (en millions).', fr(S10, 2) + ' millions', S10, { w: 30, lab: 'total :' }), Q('b.', 'Quelle est la fréquence de Zootopie 2 dans ce top 10, en pourcentage (arrondie au dixième) ?', f1(6.18 / S10 * 100) + ' %', rnd(6.18 / S10 * 100, 1), { w: 26, tol: .06 }), Q('c.', 'Combien de films dépassent 3 millions d’entrées ?', '4 films', 4, { w: 22 }), Q('d.', 'Les trois premiers films font-ils plus de la moitié des entrées du top 10 ? Justifie avec un calcul.', `Non : ${fr(S3, 2)} ÷ ${fr(S10, 2)} ≈ ${f1(S3 / S10 * 100)} %, c’est moins de 50 %.`, null, { lines: 2 })],
      err: { 0: [{ v: 10, m: 'Tu as compté les films. Il faut additionner leurs entrées.' }], 1: [{ v: 6.18, m: 'C’est l’effectif. Divise-le par l’effectif total, puis multiplie par 100.' }] },
      hints: ['Additionne les dix nombres de la colonne « Millions ».', 'Fréquence = entrées de Zootopie 2 ÷ total, puis × 100.', 'Pour la question d, additionne les trois premiers et compare à la moitié du total (17,7).'], pouce: 'Total : 35,4. Zootopie 2 : 6,18 ÷ 35,4 × 100. Trois premiers : 6,18 + 5,10 + 4,58.',
      det: ['6,18 + 5,10 + 4,58 + 3,31 + 2,97 + 2,95 + 2,66 + 2,64 + 2,55 + 2,46 = 35,40 millions.', '6,18 ÷ 35,4 ≈ 0,1746, soit environ 17,5 %.', 'Les films au-dessus de 3 : 6,18 ; 5,10 ; 4,58 ; 3,31. Cela fait 4 films.', 'Les trois premiers : 6,18 + 5,10 + 4,58 = 15,86. La moitié du total vaut 35,4 ÷ 2 = 17,7. Comme 15,86 < 17,7 (soit 44,8 %), la réponse est non.'], corr: 'a. 35,4. b. 17,5 %. c. 4 films. d. Non (44,8 %).' }),
    PB({ id: 'p2', etape: 3, lc: 3, defi: 5, bulle: 'Ce cas se fait en 5 étapes. Commence par le total (36 saisons) : il sert pour la fréquence, l’angle et la moyenne.', autravail: { comp: 'com', txt: 'résumer un relevé (pièces, commandes, durées) en un nombre et un graphique pour le présenter à un chef d’équipe.' }, comps: ['app', 'ana', 'rea', 'com'], titre: 'Les saisons des Simpson',
      intro: `<p>Une saison de série, c’est un ensemble d’épisodes diffusés pendant une année de télévision. Les Simpson ont ${H('36 saisons')} terminées, soit ${H('790 épisodes')}. On range les saisons selon leur nombre d’épisodes.</p>${tab(['Épisodes par saison', 'moins de 20', 'de 20 à 22', 'de 23 à 25'], [['Saisons', String(cl1), String(cl2), String(cl3)]])}<p class="srcl">${D.srcSimpsons}</p>`,
      qs: [Q('a.', 'Calcule l’effectif total (le nombre de saisons).', '2 + 26 + 8 = 36 saisons', 36, { w: 26 }), Q('b.', 'Quelle est la fréquence de la classe « de 20 à 22 » en pourcentage (au dixième) ?', f1(26 / 36 * 100) + ' %', rnd(26 / 36 * 100, 1), { w: 26, tol: .06 }), Q('c.', 'Calcule l’angle du secteur de cette classe dans un diagramme circulaire.', '26 × 10 = 260°', 260, { w: 24 }), Q('d.', 'Calcule le nombre moyen d’épisodes par saison (790 épisodes en 36 saisons), arrondi au dixième.', f1(790 / 36) + ' épisodes', rnd(790 / 36, 1), { w: 28, tol: .06 }), Q('e.', 'Un fan affirme : « Chaque saison compte exactement 22 épisodes. » A-t-il raison ? Justifie.', 'Non : 22 est la valeur la plus fréquente (21 saisons), mais d’autres saisons ont 13, 18 ou 25 épisodes. La moyenne (21,9) n’est pas non plus 22.', null, { lines: 3 })],
      err: { 2: [{ v: 26, m: '26 est l’effectif. L’angle se calcule sur 360° : 26 × 10.' }], 3: [{ v: 790 / 3, m: 'Tu as divisé par 3 (le nombre de classes). Divise par le nombre de saisons : 36.' }] },
      hints: ['Additionne les trois effectifs du tableau.', 'Fréquence = 26 ÷ 36, puis × 100.', 'Ici 360° ÷ 36 = 10° par saison.', 'Moyenne = 790 ÷ 36.'], pouce: 'Total : 36. Fréquence : 26 ÷ 36. Angle : 26 × 10. Moyenne : 790 ÷ 36.',
      det: ['2 + 26 + 8 = 36 saisons.', '26 ÷ 36 ≈ 0,7222, soit environ 72,2 %.', '360° ÷ 36 = 10° par saison, donc 26 × 10 = 260°. Contrôle : 26/36 × 360 = 260.', '790 ÷ 36 ≈ 21,94, soit 21,9 épisodes par saison en moyenne.', 'Réponse rédigée : non. La valeur la plus fréquente est 22 (21 saisons sur 36), mais 36 − 21 = 15 saisons ont un autre nombre d’épisodes. La moyenne vaut 21,9 et non 22.'], corr: 'a. 36. b. 72,2 %. c. 260°. d. 21,9. e. Non (22 est le plus fréquent, pas le seul).' }),
    PB({ id: 'p3', etape: 4, lc: 4, cls: 'bac', defi: 5, bulle: 'Voici une question « vers le CCF » : 5 étapes, avec de vraies données. Justifie chaque réponse par un calcul : c’est ce qui rapporte les points.', autravail: { comp: 'val', txt: 'vérifier un relevé mensuel (consommation, production, ventes) et repérer un mois anormal.' }, comps: ['app', 'ana', 'rea', 'val', 'com'], titre: 'Le cinéma en France, mois par mois (2025)',
      intro: pCNC + `<p>Voici les entrées en salle en France, mois par mois, en ${H('2025')} (en millions).</p>${cncTab([2025])}<p class="srcl">${D.srcCnc}</p>`,
      qs: [BQ('1', 'Calculer le nombre total d’entrées de l’année 2025.', 'rea', fr(T25, 2) + ' millions', T25, { w: 30 }), BQ('2', 'En déduire le nombre moyen d’entrées par mois, arrondi au centième.', 'rea', f2(M25) + ' millions', rnd(M25, 2), { w: 28, tol: .006 }), BQ('3', 'Combien de mois sont en dessous de cette moyenne ? Expliquer la méthode.', 'ana', '7 mois : on compare chaque valeur à 13,06 (mars, avril, mai, juin, août, septembre, octobre).', null, { lines: 2 }), BQ('4', 'Quelle part de l’année représente le mois de décembre ? Donner un pourcentage arrondi au dixième.', 'rea', f1(A25[11] / T25 * 100) + ' %', rnd(A25[11] / T25 * 100, 1), { w: 26, tol: .06 }), BQ('5', 'Un journaliste écrit : « En 2025, chaque mois a compté 13,06 millions d’entrées. » Expliquer pourquoi cette phrase est fausse.', 'com', 'C’est une moyenne : les mois sont très différents, de 9,46 millions (septembre) à 20,73 millions (décembre).', null, { lines: 2 })],
      err: { 0: [{ v: 12, m: 'Tu as compté les mois. Il faut additionner les entrées.' }], 1: [{ v: T25, m: 'C’est le total. Pour la moyenne, divise par 12.' }], 3: [{ v: A25[11], m: 'C’est le nombre d’entrées de décembre. Pour la part, divise par le total de l’année.' }] },
      hints: ['Additionne les 12 valeurs du tableau.', 'Moyenne = total ÷ 12.', 'Compare chaque mois à la moyenne : 13,06.', 'Part de décembre = 20,73 ÷ total, puis × 100.'], pouce: 'Total : 156,66. Moyenne : 156,66 ÷ 12. Part de décembre : 20,73 ÷ 156,66 × 100.',
      det: ['13,83 + 14,30 + 12,72 + 11,83 + 11,23 + 11,37 + 14,29 + 9,94 + 9,46 + 12,84 + 14,12 + 20,73 = 156,66 millions.', '156,66 ÷ 12 = 13,055, soit 13,06 millions par mois (au centième).', 'Valeurs sous 13,06 : 12,72 ; 11,83 ; 11,23 ; 11,37 ; 9,94 ; 9,46 ; 12,84. Cela fait 7 mois.', '20,73 ÷ 156,66 ≈ 0,1323, soit 13,2 % des entrées de l’année.', 'Une moyenne n’est pas la valeur de chaque mois : septembre a fait 9,46 millions et décembre 20,73 millions.'], corr: '1. 156,66. 2. 13,06. 3. 7 mois. 4. 13,2 %. 5. C’est une moyenne.' }),
    PB({ id: 'pd', niv: 1, base: 'p3', etape: 3, lc: 4, autravail: { comp: 'ana', txt: 'savoir quel total il faut atteindre pour tenir une moyenne visée, par exemple un objectif de ventes par mois.' }, comps: ['ana', 'rea', 'val', 'com'], titre: 'Retrouver une moyenne : 2024 contre 2025',
      intro: pCNC + `<p>Voici les entrées de ${H('2024')} et de ${H('2025')} (en millions).</p>${cncTab([2024, 2025])}<p class="srcl">${D.srcCnc}</p>`,
      qs: [Q('a.', 'Calcule le nombre moyen d’entrées par mois en 2024, arrondi au centième.', f2(M24) + ' millions', rnd(M24, 2), { w: 28, tol: .006 }), Q('b.', 'Calcule combien d’entrées il a manqué en 2025 pour égaler le total de 2024.', fr(rnd(T24 - T25, 2), 2) + ' millions', rnd(T24 - T25, 2), { w: 28, lab: 'écart :' }), Q('c.', 'Les 11 premiers mois de 2025 font 135,93 millions. Quel nombre d’entrées en décembre aurait donné une moyenne de 14,5 millions par mois sur l’année ?', fr(rnd(174 - M11, 2), 2) + ' millions', rnd(174 - M11, 2), { w: 28, tol: .006 }), Q('d.', 'Ce résultat est-il vraisemblable, sachant que décembre 2025 a fait 20,73 ? Explique.', 'Non : 38,07 est environ 1,8 fois 20,73, et bien plus que le meilleur mois de 2024 (20,54). Atteindre 14,5 de moyenne était donc irréaliste.', null, { lines: 3 })],
      err: { 2: [{ v: 174, m: 'C’est le total que l’on voudrait sur l’année (14,5 × 12). Retire ensuite les 11 premiers mois : 174 − 135,93.' }, { v: 14.5, m: '14,5 est la moyenne visée. Calcule d’abord le total : 14,5 × 12.' }] },
      hints: ['Moyenne 2024 = 181,54 ÷ 12.', 'Écart = total 2024 − total 2025.', 'Pour une moyenne de 14,5 sur 12 mois, le total doit valoir 14,5 × 12.', 'Compare le résultat au meilleur mois connu.'], pouce: 'Total visé : 14,5 × 12 = 174. Décembre : 174 − 135,93.',
      det: ['181,54 ÷ 12 ≈ 15,128, soit 15,13 millions par mois.', '181,54 − 156,66 = 24,88 millions d’entrées en moins.', 'Total visé : 14,5 × 12 = 174. Décembre : 174 − 135,93 = 38,07 millions.', '38,07 ÷ 20,73 ≈ 1,8 : il faudrait presque deux fois plus d’entrées que le vrai mois de décembre 2025. Même le meilleur mois de 2024 (20,54) en est loin : ce n’était pas réaliste.'], corr: 'a. 15,13. b. 24,88. c. 38,07. d. Non, environ 1,8 fois le vrai mois de décembre.' })];

  c.bilan = [['Je sais calculer un effectif total et regrouper en classes.', ['e1', 'p2']], ['Je sais calculer une fréquence et l’écrire de plusieurs façons.', ['e1', 'p1', 'p3']], ['Je sais lire et construire un diagramme en bâtons ou circulaire.', ['e2', 'p2']], ['Je sais calculer une moyenne, avec ou sans effectifs.', ['e3', 'p3', 'pd']]];
  c.fiche = {
    essentiel: ['<b>Effectif</b> : nombre de fois où une valeur apparaît. <b>Effectif total</b> : somme des effectifs.', '<b>Fréquence</b> = effectif ÷ effectif total (entre 0 et 1). × 100 pour un pourcentage.', '<b>Classe</b> : groupe de valeurs, noté [a ; b]. Pas de chevauchement.', '<b>Moyenne</b> = somme des valeurs ÷ nombre de valeurs. Avec effectifs : Σ(valeur × effectif) ÷ effectif total.', '<b>Diagramme circulaire</b> : angle = fréquence × 360°.'],
    methode: ['Je repère ce que je compte et l’unité.', 'Je range dans un tableau d’effectifs et j’additionne : effectif total.', 'Je calcule la fréquence : effectif ÷ total.', 'Pour le diagramme circulaire : angle = fréquence × 360°, et la somme vaut 360°.', 'Pour la moyenne : somme ÷ nombre de valeurs, puis je contrôle qu’elle est entre le min et le max.'],
    exemple: `<p>36 saisons des Simpson : 26 ont de 20 à 22 épisodes.</p><p>Fréquence : 26 ÷ 36 ≈ 0,722, soit 72,2 %. Angle : 26 × 10 = 260° (360° ÷ 36 = 10° par saison).</p><p>Moyenne : 790 épisodes ÷ 36 saisons ≈ 21,9 épisodes par saison.</p>`,
    pieges: ['Diviser par le nombre de valeurs différentes au lieu de l’effectif total.', 'Une classe chevauchée : une valeur comptée deux fois.', 'Une moyenne en dehors de l’intervalle [plus petite ; plus grande valeur] : il y a une erreur.', 'Un axe qui ne commence pas à 0 sur un diagramme en bâtons.'],
    flash: [['Mentalement : 9 sur 36, en pourcentage ?', '25 %'], ['Moyenne de 8 ; 10 ; 12 ?', '10'], ['Effectifs 5 ; 7 ; 8 : effectif total ?', '20'], ['Angle d’un secteur de fréquence 0,25 ?', '90°']]
  };
  chk(0.25 * 360 === 90 && 5 + 7 + 8 === 20 && (8 + 10 + 12) / 3 === 10 && 9 / 36 === .25, 'c1 fiche');
  c.words = require('./gl3')('c1');
  return c;
};
