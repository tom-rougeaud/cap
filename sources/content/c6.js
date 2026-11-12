/* Chapitre 6 · Fonctions et graphiques — CAP Maths (programme de mathématiques des classes préparant au CAP, BOEN spécial n° 5 du 11 avril 2019). */
'use strict';
const K = require('./kit3e');
const { H, FM, R, Q, BQ, PB, ENT, tab, S, T, Rc, Ar, st, SN, cell, MCVP: P } = K;
const { SK, D } = require('./sk3');
const { MCVG } = require('../shared/gens.js');
const fr = (x, d) => MCVG.fr(x, d), rnd = MCVG.rnd, f1 = x => fr(rnd(x, 1), 1), f2 = x => fr(rnd(x, 2), 2);
const RED = '#C2332A', BLUE = '#1D5FC2';

module.exports = function (chk) {
  const c = { id: 'c6', n: 6, col: 'fonction', icone: '📈', dom: 'Algèbre et analyse · fonctions', titre: 'Fonctions et graphiques', sous: 'Tableau de valeurs, coordonnées, image, antécédent, variations' };
  c.parties = [{ t: 'Lire un tableau de valeurs', n: [1] }, { t: 'Se repérer et lire un graphique', n: [2, 3] }, { t: 'Les variations', n: [4] }];
  c.travail = { question: `Usain Bolt a couru le 100 m en ${H('9,58 s')}. À 50 m, il en était à 5,47 s. À quelle distance en était-il à 8,75 s ? Et un personnage de jeu vidéo saute : quand atteint-il sa hauteur maximale ? Tu sauras répondre aux notions 3 et 4.` };
  c.objectifs = ['Je saurai lire l’image et l’antécédent d’un nombre dans un tableau de valeurs.', 'Je saurai lire les coordonnées d’un point avec des lignes de lecture.', 'Je saurai lire une image et un antécédent sur une courbe.', 'Je saurai dire où une fonction est croissante ou décroissante, et lire son maximum.'];
  c.depart = 'c6';

  /* ---------- données et contrôles ---------- */
  const B0 = [[0, 0], ...D.bolt], bt = d => D.bolt.find(r => r[0] === d)[1];
  const hj = t => rnd(4 * t - 2 * t * t, 3);
  chk(bt(30) === 3.78 && bt(50) === 5.47 && bt(60) === 6.29 && bt(70) === 7.1 && bt(80) === 7.92 && bt(90) === 8.75 && bt(100) === 9.58, 'c6 Bolt : temps de passage');
  chk(rnd(9.58 - 5.47, 2) === 4.11 && f1(50 / 4.11) === '12,2' && rnd(9.58 - 8.75, 2) === 0.83 && f1(10 / .83) === '12,0' && rnd(9.58 / 2, 2) === 4.79 && 5.47 > 4.79 && rnd(7.92 - 5.47, 2) === 2.45, 'c6 Bolt : durées');
  chk(hj(0) === 0 && hj(.5) === 1.5 && hj(1) === 2 && hj(1.5) === 1.5 && hj(2) === 0 && hj(.25) === .875 && hj(.75) === 1.875 && 2 - 0 === 2, 'c6 saut h = 4t − 2t²');
  chk(5 - 1 === 4 && 5 - 2 === 3 && 6 - 1 === 5 && 5 - 2 === 3 && 3 * 4 + 2 === 14 && 3 * 5 + 2 === 17 && (11 - 2) / 3 === 3 && 3 * 2 + 2 === 8, 'c6 coordonnées et tableaux');

  /* ---------- graphiques à lignes de lecture ---------- */
  const boltG = (o = {}) => { const g = P.plot({ W: 360, H: 210, x: [0, 100, 10], y: [0, 10, 1], ml: 40, mr: 12, mt: 16, mb: 34, fs: 10, sx: 5, sy: 5, lx: 1, ly: 2, xl: 'distance (m)', yl: 'temps (s)', lab: 'Temps de passage de Bolt selon la distance, avec des lignes de lecture' });
    const line = `<polyline points="${B0.map(([d, t]) => g.X(d).toFixed(1) + ',' + g.Y(t).toFixed(1)).join(' ')}" fill="none" class="ks" stroke-width="2.8" stroke-linejoin="round"/>`;
    return { g, body: g.base + line + g.pts(B0.slice(1).map(([d, t]) => [d, t]), { r: 3.6 }) }; };
  const tri = (x, y, dir, col) => { const p = { l: [[x, y], [x + 8, y - 4.5], [x + 8, y + 4.5]], d: [[x, y], [x - 4.5, y - 8], [x + 4.5, y - 8]], r: [[x, y], [x - 8, y - 4.5], [x - 8, y + 4.5]], u: [[x, y], [x - 4.5, y + 8], [x + 4.5, y + 8]] }[dir]; return `<polygon points="${p.map(q => q.join(',')).join(' ')}" fill="${col}"/>`; };
  const gtxt = (x, y, str, col, an = 'start', fs = 11.5) => `<text x="${rnd(x, 1)}" y="${rnd(y, 1)}" font-family="Nunito Sans" font-size="${fs}" font-weight="800" text-anchor="${an}" fill="${col}">${str}</text>`;
  /* notion 3 : image de 60 m et antécédent de 8,75 s */
  const lec = (() => { const { g, body } = boltG();
    const X = g.X, Y = g.Y;
    const img = `<path d="M${X(60).toFixed(1)} ${Y(0).toFixed(1)}V${Y(6.29).toFixed(1)}H${(X(0) + 8).toFixed(1)}" fill="none" stroke="${RED}" stroke-width="2" stroke-dasharray="6 4"/>` + tri(X(0), Y(6.29), 'l', RED) + gtxt(X(0) + 8, Y(6.29) - 6, '6,29 s', RED) + gtxt(X(60) + 5, Y(0) - 6, '60 m', RED);
    const ant = `<path d="M${X(0).toFixed(1)} ${Y(8.75).toFixed(1)}H${X(90).toFixed(1)}V${(Y(0) - 8).toFixed(1)}" fill="none" stroke="${BLUE}" stroke-width="2" stroke-dasharray="6 4"/>` + tri(X(90), Y(0), 'd', BLUE) + gtxt(X(0) + 8, Y(8.75) - 6, '8,75 s', BLUE) + gtxt(X(90) + 5, Y(0) - 6, '90 m', BLUE);
    const tx = (n, y, l1, l2, l3, col) => SN(n, 396, y) + gtxt(414, y - 3, l1, col, 'start', 11.5) + gtxt(414, y + 13, l2, '#1D2240', 'start', 11) + (l3 ? gtxt(414, y + 29, l3, '#1D2240', 'start', 11) : '');
    return S(600, 210, st(1, body + SN(1, 396, 30) + gtxt(414, 35, 'temps de passage de Bolt', '#1D2240', 'start', 11.5))
      + st(2, img + tx(2, 70, 'image de 60 m', 'je monte jusqu’à la courbe,', 'puis à gauche : 6,29 s', RED))
      + st(3, ant + tx(3, 130, 'antécédent de 8,75 s', 'à droite jusqu’à la courbe,', 'puis je descends : 90 m', BLUE))
      + st(4, SN(4, 396, 190) + gtxt(414, 195, 'image 6,29 s ; antécédent 90 m', '#1D2240', 'start', 11)),
    'La courbe de Bolt : on lit l’image de 60 mètres, 6,29 secondes, et l’antécédent de 8,75 secondes, 90 mètres'); })();
  /* notion 2 : coordonnées du point A (4 ; 3) */
  const coo = (() => { const g = P.plot({ W: 360, H: 210, x: [0, 7, 1], y: [0, 6, 1], ml: 32, mr: 12, mt: 16, mb: 34, fs: 11, lx: 1, ly: 1, xl: 'axe horizontal', yl: 'axe vertical', lab: 'Un repère quadrillé avec le point A de coordonnées 4 et 3' });
    const X = g.X, Y = g.Y;
    const ln = `<path d="M${X(4).toFixed(1)} ${Y(0).toFixed(1)}V${Y(3).toFixed(1)}H${X(0).toFixed(1)}" fill="none" stroke="${RED}" stroke-width="2" stroke-dasharray="6 4"/>`;
    const tx = (n, y, l1, l2) => SN(n, 396, y) + gtxt(414, y - 3, l1, RED, 'start', 11.5) + gtxt(414, y + 13, l2, '#1D2240', 'start', 11.5);
    return S(600, 210, st(1, g.base + g.pts([[0, 0]], { r: 3.4 }) + gtxt(X(0) + 8, Y(0) - 7, 'O', '#1D2240', 'start', 12))
      + st(2, ln + gtxt(X(4) + 5, Y(0) - 6, 'abscisse 4', RED)) + st(3, gtxt(X(0) + 8, Y(3) - 6, 'ordonnée 3', RED) + g.pts([[4, 3]], { r: 5.2 }) + gtxt(X(4) + 8, Y(3) - 10, 'A (4 ; 3)', '#1D2240', 'start', 12.5))
      + st(1, tx(1, 36, 'je pars de l’origine O', 'de coordonnées (0 ; 0)')) + st(2, tx(2, 86, 'abscisse : je descends', 'sur l’axe horizontal : 4'))
      + st(3, tx(3, 136, 'ordonnée : je vais à gauche', 'sur l’axe vertical : 3')) + st(4, SN(4, 396, 184) + T(414, 189, 'A (4 ; 3) : abscisse d’abord', { fs: 11.5, a: 'start', c: 'kt' })),
    'Un repère quadrillé : le point A a pour abscisse 4 et pour ordonnée 3'); })();
  /* notion 1 : tableau de valeurs, image et antécédent */
  const tabv = (() => { const cols = [[30, '3,78'], [50, '5,47'], [80, '7,92'], [90, '8,75'], [100, '9,58']], x0 = 70, w = 60, gap = 6;
    let s = T(40, 80, 'd (m)', { fs: 11.5, c: 'ts' }) + T(40, 150, 't (s)', { fs: 11.5, c: 'ts' });
    cols.forEach(([d, t], i) => { const x = x0 + i * (w + gap), hot = d === 80; s += cell(x, 62, w, 30, String(d), { k: hot, fs: 14 }) + cell(x, 132, w, 30, t, { k: hot, fs: 14 }); });
    const cx = i => x0 + i * (w + gap) + w / 2;
    return S(600, 210, st(1, T(40, 34, 'Bolt, 100 m, Berlin 2009 : temps de passage', { fs: 13, a: 'start', c: 'kt' }) + s)
      + st(2, Ar(cx(2), 95, cx(2), 128, { w: 2.6, h: 8 }) + T(cx(2) + 10, 118, 'image', { fs: 12, a: 'start', c: 'kt' }))
      + st(3, Ar(cx(3), 129, cx(3), 96, { w: 2.6, h: 8 }) + T(cx(3) + 10, 118, 'antécédent', { fs: 12, a: 'start', c: 'kt' }))
      + st(2, SN(1, 40, 188) + T(58, 193, 'image de 80 : 7,92 s', { fs: 12.5, a: 'start' })) + st(3, SN(2, 250, 188) + T(268, 193, 'antécédent de 8,75 s : 90 m', { fs: 12.5, a: 'start' })),
    'Tableau des temps de passage de Bolt : l’image de 80 mètres est 7,92 secondes, l’antécédent de 8,75 secondes est 90 mètres'); })();
  /* notion 4 : les variations du saut h = 4t − 2t² */
  const sautG = () => { const g = P.plot({ W: 360, H: 210, x: [0, 2, .25], y: [0, 2.5, .5], ml: 38, mr: 12, mt: 16, mb: 34, fs: 10, sx: 1, sy: 5, lx: 2, ly: 1, xl: 'temps t (s)', yl: 'hauteur h (m)', lab: 'La hauteur h du saut d’un personnage de jeu vidéo en fonction du temps t' });
    return { g, body: g.base + g.curve(t => 4 * t - 2 * t * t, { w: 3 }) + g.pts([0, .5, 1, 1.5, 2].map(t => [t, hj(t)]), { r: 4 }) }; };
  const vari = (() => { const { g, body } = sautG(), X = g.X, Y = g.Y;
    const tx = (n, y, l) => SN(n, 396, y) + gtxt(414, y + 5, l, '#1D2240', 'start', 11.5);
    const vt = (x, y, v, k) => cell(x, y, 40, 24, v, { k, fs: 13 });
    return S(600, 210, st(1, body)
      + st(2, gtxt(X(.36), Y(2.15), 'croissante', RED, 'middle', 12))
      + st(3, gtxt(X(1.64), Y(2.15), 'décroissante', BLUE, 'middle', 12))
      + st(4, g.guide(1, 2, { stroke: '#1D2240' }) + gtxt(X(1), Y(2) - 12, 'maximum : 2 m', '#1D2240', 'middle', 11.5))
      + st(1, tx(1, 28, 'je lis de gauche à droite')) + st(2, tx(2, 52, 'de 0 à 1 s : elle monte')) + st(3, tx(3, 76, 'de 1 à 2 s : elle descend')) + st(4, tx(4, 100, 'maximum : 2 m à t = 1 s'))
      + st(4, T(396, 131, 't', { fs: 12, c: 'ts' }) + vt(412, 114, '0', false) + vt(466, 114, '1', false) + vt(520, 114, '2', false) + T(396, 191, 'h', { fs: 12, c: 'ts' }) + vt(412, 178, '0', false) + vt(466, 146, '2', true) + vt(520, 178, '0', false) + Ar(454, 182, 466, 168, { w: 2.4, h: 6 }) + Ar(508, 168, 520, 182, { w: 2.4, h: 6 })),
    'Le saut d’un personnage : la hauteur croît de 0 à 2 mètres entre 0 et 1 seconde, puis décroît jusqu’à 0 à 2 secondes'); })();

  c.notions = [
    { titre: 'Lire un tableau de valeurs', decouvre: { txt: `Le tableau donne le temps de passage d’${H('Usain Bolt')} à Berlin en 2009. À ${H('80 m')}, il en est à ${H('7,92 s')}. À quelle distance en est-il à ${H('8,75 s')} ?`, img: '' },
      methode: ['Je repère ce que je cherche : une image (je pars de la distance) ou un antécédent (je pars du temps).', 'Pour une image : je cherche la distance dans la ligne du haut, je lis le temps en dessous.', 'Pour un antécédent : je cherche le temps dans la ligne du bas, je lis la distance au-dessus.', 'J’écris la réponse avec son unité.'],
      vois: tabv,
      solution: `<p>À 80 m, le temps est ${H('7,92 s')} : 7,92 est l’<b>image</b> de 80.</p><p>Le temps 8,75 s se lit sous 90 : <b>90 m</b> est l’<b>antécédent</b> de 8,75.</p><p class="srcl">${D.srcBoltC}</p>`,
      retiens: `<p>Une <b>fonction</b> associe à chaque nombre x un nombre f(x), son <b>image</b>. On dit que x est un <b>antécédent</b> de f(x).</p><p>Ici : f(80) = 7,92. L’image de 80 est 7,92 ; l’antécédent de 7,92 est 80.</p>`,
      attention: 'Un nombre a une seule image, mais il peut avoir plusieurs antécédents, ou aucun. Pour une image, on part du haut. Pour un antécédent, on part du bas.',
      amoi: [['Avec le tableau, quelle est l’image de 50 ?', '5,47 s'], ['Quel est l’antécédent de 9,58 ?', '100 m']] },
    { titre: 'Lire les coordonnées d’un point', decouvre: { txt: `Dans un jeu vidéo, un coffre est caché sur une carte quadrillée. Pour le trouver, on donne deux nombres : ${H('(4 ; 3)')}. Que signifient-ils ?`, img: '' },
      methode: ['Je pars de l’origine O, le point (0 ; 0).', 'Pour l’abscisse, je descends du point jusqu’à l’axe horizontal : 4.', 'Pour l’ordonnée, je vais du point jusqu’à l’axe vertical : 3.', 'J’écris les coordonnées entre parenthèses : A (4 ; 3).'],
      vois: coo,
      solution: `<p>Le point A est à <b>4</b> carreaux de l’axe vertical et à <b>3</b> carreaux de l’axe horizontal.</p><p>Ses coordonnées sont ${H('A (4 ; 3)')}.</p>`,
      retiens: `<p>Un point se repère par ses <b>coordonnées</b> (abscisse ; ordonnée).</p><p>L’<b>abscisse</b> se lit sur l’axe horizontal. L’<b>ordonnée</b> se lit sur l’axe vertical.</p>`,
      attention: 'On écrit toujours l’abscisse en premier : le point (4 ; 3) n’est pas le point (3 ; 4). Les lignes de lecture en pointillés aident à ne pas se tromper.',
      amoi: [['Un point a pour abscisse 5 et pour ordonnée 2. Écris ses coordonnées.', '(5 ; 2)'], ['Dans le point (3 ; 6), quelle est l’ordonnée ?', '6']] },
    { titre: 'Lire une image et un antécédent sur une courbe', decouvre: { txt: `La courbe donne le temps de passage de Bolt selon la distance. Quel est le temps à ${H('60 m')} ? À quelle distance en est-il à ${H('8,75 s')} ?`, img: '' },
      methode: ['Pour une image, je pars de la distance sur l’axe horizontal.', 'Je monte jusqu’à la courbe, puis je vais à gauche lire le temps sur l’axe vertical.', 'Pour un antécédent, je pars du temps sur l’axe vertical, je vais à droite jusqu’à la courbe, puis je descends lire la distance.', 'J’écris la réponse avec son unité.'],
      vois: lec,
      solution: `<p>L’image de 60 m est ${H('6,29 s')}. L’antécédent de 8,75 s est ${H('90 m')}.</p><p>On obtient les mêmes valeurs que dans le tableau.</p><p class="srcl">${D.srcBoltC}</p>`,
      retiens: `<p>Sur une courbe : pour une <b>image</b>, on part de l’axe horizontal, on rejoint la courbe, on lit sur l’axe vertical.</p><p>Pour un <b>antécédent</b>, on fait le chemin inverse.</p>`,
      attention: 'Trace toujours des lignes de lecture avec une règle et note la valeur lue avec son unité. Une lecture au jugé donne souvent une erreur.',
      amoi: [['Sur la courbe de Bolt, quelle est l’image de 70 m ?', '7,10 s'], ['Quel est l’antécédent de 4,64 s ?', '40 m']] },
    { titre: 'Lire les variations d’une fonction', decouvre: { txt: `Un personnage de jeu de plateforme saute. La courbe donne sa hauteur ${H('h')} (en m) selon le temps ${H('t')} (en s). Pendant combien de temps monte-t-il ? Quelle hauteur maximale atteint-il ?`, img: '' },
      methode: ['Je lis la courbe de gauche à droite, sur l’axe horizontal.', 'Quand la courbe monte, la fonction est croissante.', 'Quand la courbe descend, la fonction est décroissante.', 'Je lis le point le plus haut : c’est le maximum.'],
      vois: vari,
      solution: `<p>De 0 à 1 s, la courbe monte : h est <b>croissante</b>. De 1 à 2 s, elle descend : h est <b>décroissante</b>.</p><p>Le maximum est ${H('2 m')}, atteint à ${H('t = 1 s')}. Le personnage monte pendant 1 s.</p>`,
      retiens: `<p>Une fonction est <b>croissante</b> quand sa courbe monte, <b>décroissante</b> quand elle descend.</p><p>Le <b>maximum</b> est la plus grande valeur, le <b>minimum</b> la plus petite.</p>`,
      attention: 'On lit les variations de gauche à droite. Le maximum est une valeur de l’axe vertical, l’instant où on l’atteint se lit sur l’axe horizontal.',
      amoi: [['Une courbe monte de x = 0 à x = 3. La fonction est-elle croissante ou décroissante entre 0 et 3 ?', 'croissante'], ['Pour le saut, quelle est la hauteur à t = 2 s ?', '0 m : le personnage est retombé']] }];

  /* Je programme avec Scratch */
  c.scratch = [{ titre: 'calculer l’image d’un nombre', lc: 4, texte: 'Le programme calcule la hauteur h = 4 × t − 2 × t × t d’un personnage de jeu vidéo au temps t.',
    prog: [{ c: 'evt', t: 'quand ⚑ est cliqué' }, { c: 'var', t: 'mettre t à 0,5' }, { c: 'var', t: 'mettre h à ((4 × t) − (2 × (t × t)))' }, { c: 'look', t: 'dire (h)' }],
    qs: [['Que dit le lutin ?', '1,5', '4 × 0,5 = 2 et 2 × 0,25 = 0,5 ; 2 − 0,5 = 1,5.'], ['On met t à 1. Que dit le lutin ?', '2', '4 × 1 = 4 et 2 × 1 = 2 ; 4 − 2 = 2.'], ['On met t à 2. Que dit le lutin ?', '0', '4 × 2 = 8 et 2 × 4 = 8 ; 8 − 8 = 0.']] }];

  c.mots = [['fonction', 'relation qui associe à chaque nombre x un nombre f(x)', 'x est une distance, f(x) est le temps de passage.'], ['image', 'nombre obtenu par la fonction à partir de x', 'l’image de 80 est 7,92.'], ['antécédent', 'nombre dont l’image est donnée', '90 est l’antécédent de 8,75.'], ['abscisse', 'première coordonnée, lue sur l’axe horizontal', 'dans (4 ; 3), l’abscisse est 4.'], ['ordonnée', 'deuxième coordonnée, lue sur l’axe vertical', 'dans (4 ; 3), l’ordonnée est 3.'], ['croissante', 'une fonction dont la courbe monte', 'la hauteur croît de 0 à 1 s.'], ['décroissante', 'une fonction dont la courbe descend', 'la hauteur décroît de 1 à 2 s.'], ['maximum', 'la plus grande valeur d’une fonction', 'le maximum du saut est 2 m.']];

  /* ---------- exercices résolus ---------- */
  c.resolus = [
    { titre: 'Lire une image et un antécédent', outil: '✏️ règle', enonce: `Voici des temps de passage de Bolt. Donne l’image de ${H('70')} et l’antécédent de ${H('5,47')}.${tab(['d (m)', '30', '50', '70', '100'], [['t (s)', '3,78', '5,47', '7,10', '9,58']])}`,
      rows: [['L’image de 70 se lit sous 70 : <b>7,10</b>', 'Je pars de la ligne du haut.'], ['5,47 se lit au-dessus de 50 : <b>50</b>', 'Je pars de la ligne du bas.']], verif: 'f(70) = 7,10 et f(50) = 5,47 ✓', rep: 'L’image de 70 est 7,10 s ; l’antécédent de 5,47 est 50 m.', go: ['e1'] },
    { titre: 'À toi : lire les variations du saut', outil: '✏️ règle', enonce: `Le saut du personnage : la hauteur passe de 0 m à 2 m entre 0 s et 1 s, puis revient à 0 m à 2 s. Complète les variations.`, trous: [0, 1, 2],
      rows: [['De t = 0 à t = ⟦1⟧, la courbe monte.', 'Je lis de gauche à droite.'], ['h est ⟦croissante⟧ sur [0 ; 1], ⟦décroissante⟧ sur [1 ; 2].', 'Montée, puis descente.'], ['Le maximum est ⟦2⟧ m, atteint à t = ⟦1⟧ s.', 'Le point le plus haut de la courbe.']], verif: 'Les variations sont cohérentes avec la courbe ✓', rep: 'h croît de 0 à 1 s, puis décroît ; le maximum est 2 m à t = 1 s.', go: ['e3'] }];
  c.entraine = ENT('c6', [1, 2, 4]);

  /* ---------- je résous ---------- */
  const tb4 = tab(['d (m)', '30', '50', '80', '100'], [['t (s)', '3,78', '5,47', '7,92', '9,58']]);
  const carte = (() => { const g = P.plot({ W: 360, H: 210, x: [0, 7, 1], y: [0, 6, 1], ml: 32, mr: 12, mt: 16, mb: 34, fs: 11, lx: 1, ly: 1, xl: 'axe horizontal', yl: 'axe vertical', lab: 'Une carte quadrillée avec un coffre, une clé et une porte' });
    const lab = ([x, y], s) => gtxt(g.X(x) + 9, g.Y(y) - 8, s, '#1D2240', 'start', 12);
    return g.wrap(g.base + g.pts([[4, 3], [1, 5], [6, 2]], { r: 5 }) + lab([4, 3], 'coffre') + lab([1, 5], 'clé') + lab([6, 2], 'porte')).replace('<svg ', '<svg style="max-width:150mm;height:auto" '); })();
  const sautFig = (() => { const { g, body } = sautG(); return g.wrap(body).replace('<svg ', '<svg style="max-width:105mm;height:auto" '); })();
  const boltFig = (() => { const { g, body } = boltG(); return g.wrap(body).replace('<svg ', '<svg style="max-width:100mm;height:auto" '); })();
  c.probs = [
    PB({ id: 'pa', niv: -1, base: 'p1', etape: 2, lc: 1, comps: ['app', 'rea'], titre: 'Le tableau de Bolt, pas à pas',
      intro: `<p>Le 16 août 2009, Usain Bolt a couru le 100 m en 9,58 s. Voici ses temps de passage.</p>${tb4}<p class="srcl">${D.srcBoltC}</p>`,
      qs: [Q('a.', 'Quel est le temps de passage à 50 m, en secondes ? C’est l’image de 50.', 'f(50) = 5,47 s', 5.47, { w: 18, tol: .006 }), Q('b.', 'À quelle distance en est-il à 7,92 s ? C’est l’antécédent de 7,92.', 'l’antécédent de 7,92 est 80 m', 80, { w: 18 }), Q('c.', 'Combien de temps a-t-il mis entre 50 m et 100 m ? Calcule 9,58 − 5,47.', '9,58 − 5,47 = 4,11 s', 4.11, { w: 18, tol: .006 }), Q('d.', 'Calcule sa vitesse moyenne sur ces 50 m, en m/s, arrondie au dixième : 50 ÷ 4,11.', '50 ÷ 4,11 ≈ 12,2 m/s', 12.2, { w: 18, tol: .06 })],
      err: { 0: [{ v: 50, m: 'C’est la distance. Pour une image, on lit le temps dans la ligne du dessous.' }], 1: [{ v: 7.92, m: 'C’est le temps donné. L’antécédent est la distance, dans la ligne du dessus.' }], 3: [{ v: 205.5, m: 'Tu as multiplié 50 par 4,11. Pour une vitesse, on divise la distance par le temps.' }] },
      hints: ['L’image de 50 se lit sous 50.', 'L’antécédent de 7,92 se lit au-dessus de 7,92.', 'Soustrais les deux temps.', 'Vitesse = distance ÷ temps.'], pouce: 'tableau ; 9,58 − 5,47 ; 50 ÷ 4,11.',
      det: ['Dans la colonne de 50, on lit 5,47 s.', 'Dans la colonne de 7,92 s, on lit 80 m.', '9,58 − 5,47 = 4,11 s.', '50 ÷ 4,11 = 12,165… ≈ 12,2 m/s.'], corr: 'a. 5,47 s. b. 80 m. c. 4,11 s. d. 12,2 m/s.' }),
    PB({ id: 'p1', etape: 2, lc: 2, comps: ['app', 'ana', 'rea', 'val'], titre: 'La carte au trésor',
      intro: `<p>Dans un jeu vidéo, le héros doit récupérer une clé, ouvrir un coffre et rejoindre une porte. La carte est quadrillée.</p>${carte}`,
      qs: [Q('a.', 'Quelle est l’abscisse du coffre ?', 'le coffre est en (4 ; 3) : abscisse 4', 4, { w: 18 }), Q('b.', 'Quelle est l’ordonnée de la clé ?', 'la clé est en (1 ; 5) : ordonnée 5', 5, { w: 18 }), Q('c.', 'Pour aller de la clé à la porte (6 ; 2), de combien de carreaux se déplace-t-on vers la droite ?', '6 − 1 = 5 carreaux', 5, { w: 18 }), Q('d.', 'Et de combien de carreaux vers le bas ?', '5 − 2 = 3 carreaux', 3, { w: 18 })],
      err: { 0: [{ v: 3, m: 'Tu as lu l’ordonnée. L’abscisse se lit sur l’axe horizontal.' }], 1: [{ v: 1, m: 'Tu as lu l’abscisse. L’ordonnée se lit sur l’axe vertical.' }], 3: [{ v: 7, m: 'Tu as additionné 5 et 2. Pour descendre de 5 à 2, calcule 5 − 2.' }] },
      hints: ['Abscisse : axe horizontal.', 'Ordonnée : axe vertical.', 'Compare les abscisses 1 et 6.', 'Compare les ordonnées 5 et 2.'], pouce: 'coffre (4 ; 3) ; clé (1 ; 5) ; porte (6 ; 2).',
      det: ['Du coffre, on descend sur l’axe horizontal : 4.', 'De la clé, on va sur l’axe vertical : 5.', '6 − 1 = 5 carreaux vers la droite.', '5 − 2 = 3 carreaux vers le bas.'], corr: 'a. 4. b. 5. c. 5 carreaux. d. 3 carreaux.' }),
    PB({ id: 'p2', etape: 3, lc: 4, defi: 5, bulle: 'Ce cas se fait en 5 étapes. Pour chaque question, trace une ligne de lecture avec ta règle avant de répondre.', autravail: { comp: 'ana', txt: 'lire une courbe de diagnostic ou de réglage et relever une valeur maximale.' }, comps: ['app', 'ana', 'rea', 'val'], titre: 'Le saut du personnage',
      intro: `<p>Un personnage de jeu de plateforme saute. La courbe donne sa hauteur h, en mètres, selon le temps t, en secondes.</p>${sautFig}`,
      qs: [Q('a.', 'Quelle est la hauteur à t = 0,5 s, en mètres ?', 'h(0,5) = 1,5 m', 1.5, { w: 18, tol: .006 }), Q('b.', 'Quelle est la hauteur maximale, en mètres ?', 'le maximum est 2 m', 2, { w: 18 }), Q('c.', 'À quel instant atteint-il cette hauteur maximale, en secondes ?', 'à t = 1 s', 1, { w: 18 }), Q('d.', 'Quand le personnage redescend, sa hauteur est-elle croissante ou décroissante ? Justifie avec la courbe.', 'décroissante : la courbe descend de 2 m jusqu’à 0 m', null, { lines: 2 }), Q('e.', 'Pendant combien de temps le personnage est-il en l’air, en secondes ?', 'il retombe au sol à t = 2 s : 2 s', 2, { w: 18 })],
      err: { 1: [{ v: 1, m: 'C’est l’instant du maximum, lu sur l’axe horizontal. La hauteur se lit sur l’axe vertical.' }], 2: [{ v: 2, m: 'C’est la hauteur du maximum. L’instant se lit sur l’axe horizontal.' }], },
      hints: ['Pars de 0,5 sur l’axe horizontal.', 'Cherche le point le plus haut de la courbe.', 'Lis l’abscisse de ce point.', 'Regarde si la courbe monte ou descend après le point le plus haut.', 'Le saut s’arrête quand h revient à 0.'], pouce: 'ligne verticale en t = 0,5 ; point le plus haut.',
      det: ['Au-dessus de 0,5, la courbe est à 1,5 m.', 'Le point le plus haut est à 2 m.', 'Ce point est au-dessus de t = 1.', 'Après le point le plus haut, la courbe descend : h est décroissante.', 'La hauteur revient à 0 à t = 2 : le saut dure 2 s.'], corr: 'a. 1,5 m. b. 2 m. c. 1 s. d. Décroissante. e. 2 s.' }),
    PB({ id: 'p3', etape: 4, lc: 3, cls: 'bac', defi: 5, bulle: 'Voici une question « vers le CCF » : lis la courbe de Bolt, calcule une vitesse puis vérifie une affirmation. Appuie-toi sur le graphique.', autravail: { comp: 'val', txt: 'vérifier une affirmation en s’appuyant sur une courbe ou un tableau.' }, comps: ['app', 'ana', 'rea', 'val', 'com'], titre: 'La course de Bolt',
      intro: `<p>La courbe donne le temps de passage de Bolt selon la distance (finale du 100 m, Berlin 2009).</p>${boltFig}<p class="srcl">${D.srcBoltC}</p>`,
      qs: [BQ('1', 'Lire l’image de 50 m, en secondes.', 'app', 'f(50) = 5,47 s', 5.47, { w: 22, tol: .02 }), BQ('2', 'Lire l’antécédent de 6,29 s, en mètres.', 'app', 'l’antécédent de 6,29 est 60 m', 60, { w: 22, tol: .6 }), BQ('3', 'Calculer le temps mis entre 50 m et 100 m, en secondes. Le temps à 100 m est 9,58 s.', 'rea', '9,58 − 5,47 = 4,11 s', 4.11, { w: 22, tol: .006 }), BQ('4', 'Calculer la vitesse moyenne sur ces 50 derniers mètres, en m/s, arrondie au dixième.', 'ana', '50 ÷ 4,11 ≈ 12,2 m/s', 12.2, { w: 22, tol: .06 }), BQ('5', 'Un journaliste écrit : « À 50 m, Bolt avait fait la moitié du temps, soit 4,79 s. » A-t-il raison ? Justifier.', 'com', 'Non : la moitié de 9,58 s est 4,79 s, mais à 50 m le temps lu est 5,47 s, supérieur à 4,79 s. Bolt accélère : la 2e moitié est plus rapide.', null, { lines: 3 })],
      err: { 0: [{ v: 50, m: 'C’est la distance donnée. L’image se lit sur l’axe vertical.' }], 1: [{ v: 6.29, m: 'C’est le temps donné. L’antécédent se lit sur l’axe horizontal.' }], 3: [{ v: 205.5, m: 'Tu as multiplié 50 par 4,11. Pour la vitesse, divise la distance par le temps.' }] },
      hints: ['Pars de 50 sur l’axe horizontal.', 'Pars de 6,29 sur l’axe vertical.', 'Soustrais les deux temps.', 'Vitesse = distance ÷ temps.', 'Compare 4,79 s avec le temps lu à 50 m.'], pouce: 'courbe à 50 m ; courbe à 6,29 s ; 9,58 − 5,47 ; 50 ÷ 4,11.',
      det: ['Au-dessus de 50 m, la courbe est à 5,47 s.', 'À 6,29 s, la courbe est au-dessus de 60 m.', '9,58 − 5,47 = 4,11 s.', '50 ÷ 4,11 = 12,165… ≈ 12,2 m/s.', 'Le temps total est 9,58 s ; sa moitié est 4,79 s. À 50 m, la courbe donne 5,47 s. 5,47 > 4,79 : l’affirmation est fausse.'], corr: '1. 5,47 s. 2. 60 m. 3. 4,11 s. 4. 12,2 m/s. 5. Non.' }),
    PB({ id: 'pd', niv: 1, base: 'p3', etape: 3, lc: 4, autravail: { comp: 'ana', txt: 'comparer des mesures relevées sur un graphique et lire un maximum.' }, comps: ['ana', 'rea', 'val', 'com'], titre: 'Le saut dans les deux sens',
      intro: `<p>Un personnage de jeu vidéo saute. Sa hauteur est donnée, en mètres, par la formule ${H('h = 4 × t − 2 × t × t')} où t est le temps en secondes. Voici la courbe.</p>${sautFig}`,
      qs: [Q('a.', 'Calcule la hauteur à t = 0,25 s, en mètres, avec la formule.', 'h = 4 × 0,25 − 2 × 0,25 × 0,25 = 1 − 0,125 = 0,875 m', 0.875, { w: 20, tol: .006 }), Q('b.', 'Sur la courbe, le personnage est à 1,5 m de hauteur à deux instants. Lis le plus petit de ces deux instants, en secondes.', 'la ligne à 1,5 m coupe la courbe en t = 0,5 et t = 1,5 : le plus petit est 0,5 s', 0.5, { w: 20, tol: .006 }), Q('c.', 'Calcule la hauteur à t = 0,75 s avec la formule, en mètres.', 'h = 4 × 0,75 − 2 × 0,75 × 0,75 = 3 − 1,125 = 1,875 m', 1.875, { w: 20, tol: .0006 }), Q('d.', 'Entre t = 1 et t = 2, la fonction est-elle croissante ou décroissante ? Justifie.', 'décroissante : la courbe descend de 2 m à 0 m', null, { lines: 2 }), Q('e.', 'Un joueur affirme : « À t = 0,25 s, le personnage est déjà à 1 m. » A-t-il raison ? Justifie.', 'Non : h(0,25) = 0,875 m, inférieur à 1 m.', null, { lines: 2 })],
      err: { 0: [{ v: 0.5, m: 'Tu as calculé 4 × 0,25 − 0,5. Calcule 2 × 0,25 × 0,25 = 0,125 avant de soustraire.' }, { v: 0.75, m: 'Tu as soustrait 0,25 de 1. Calcule 2 × 0,25 × 0,25, soit 0,125.' }], 1: [{ v: 1.5, m: 'Il y a deux instants. On demande le plus petit : lis l’autre.' }], 2: [{ v: 3, m: 'Tu as oublié de soustraire 2 × 0,75 × 0,75 = 1,125.' }] },
      hints: ['Remplace t par 0,25 dans la formule.', 'Trace la ligne horizontale à 1,5 m.', 'Remplace t par 0,75 : multiplie avant de soustraire.', 'Regarde si la courbe monte ou descend entre 1 et 2.', 'Compare 0,875 à 1.'], pouce: '4 × 0,25 ; 2 × 0,25 × 0,25 ; ligne à 1,5 m.',
      det: ['4 × 0,25 = 1 ; 2 × 0,25 × 0,25 = 0,125 ; 1 − 0,125 = 0,875 m.', 'La ligne horizontale à 1,5 m coupe la courbe en 0,5 et en 1,5 : le plus petit est 0,5.', '4 × 0,75 = 3 ; 2 × 0,75 × 0,75 = 1,125 ; 3 − 1,125 = 1,875 m.', 'La courbe descend de 2 m (à t = 1) à 0 m (à t = 2) : décroissante.', '0,875 < 1 : le joueur se trompe.'], corr: 'a. 0,875 m. b. 0,5 s. c. 1,875 m. d. Décroissante. e. Non.' })];

  c.probsManuel = ['p1', 'p2', 'p3'];
  c.bilan = [['Je sais lire l’image et l’antécédent dans un tableau.', ['e1', 'pa']], ['Je sais lire les coordonnées d’un point.', ['e2', 'p1']], ['Je sais lire une image et un antécédent sur une courbe.', ['e3', 'p2', 'p3']], ['Je sais lire les variations et le maximum.', ['e3', 'p2', 'pd']]];
  c.fiche = {
    essentiel: ['<b>Image</b> : on part de x, on lit f(x). <b>Antécédent</b> : on part de f(x), on lit x.', '<b>Coordonnées</b> : (abscisse ; ordonnée), l’abscisse d’abord.', '<b>Lecture sur une courbe</b> : lignes de lecture horizontale et verticale, valeur et unité.', '<b>Variations</b> : croissante si la courbe monte, décroissante si elle descend.', '<b>Maximum</b> : la plus grande valeur de la fonction.'],
    methode: ['Je repère ce que je cherche : image ou antécédent.', 'Je trace la ligne de lecture avec une règle.', 'Je note la valeur lue avec son unité.', 'Je vérifie dans le tableau ou avec la formule.', 'Je réponds avec une phrase.'],
    exemple: `<p>Bolt : l’image de 60 m est 6,29 s, l’antécédent de 8,75 s est 90 m.</p><p>Saut : h croît de 0 à 1 s, puis décroît ; le maximum est 2 m à t = 1 s.</p>`,
    pieges: ['Inverser l’abscisse et l’ordonnée.', 'Confondre image et antécédent.', 'Oublier qu’un nombre peut avoir deux antécédents.', 'Lire les variations de droite à gauche.'],
    flash: [['Dans (4 ; 3), quelle est l’abscisse ?', '4'], ['f(80) = 7,92 : 7,92 est l’… de 80.', 'image'], ['La courbe descend : la fonction est… ?', 'décroissante'], ['Comment s’appelle la plus grande valeur ?', 'le maximum']]
  };
  c.words = require('./gl3')('c6');
  /* ajout-e4 : un exercice d’entraînement (3 niveaux) pour chaque notion qui n’en avait pas */
  c.entraine.push({ id: 'e4', gen: 'c6e4', lc: 3, niv: 0 }, { id: 'e4a', gen: 'c6e4a', lc: 3, niv: -1, base: 'e4' }, { id: 'e4d', gen: 'c6e4d', lc: 3, niv: 1, base: 'e4' });
  c.bilan[2][1].push('e4');
  return c;
};
