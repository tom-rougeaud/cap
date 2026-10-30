/* CAP Maths — « S’évaluer au format du CCF » : une évaluation par chapitre, sur 10 points, en 45 minutes.
   Partie 1 : 3 questions d’automatismes sans calculatrice (3 points). Partie 2 : 1 ou 2 exercices avec la calculatrice (6 points).
   Rédaction et présentation : 1 point. La grille reprend les 5 compétences de la démarche scientifique, écrites en phrases d’élève. */
'use strict';
const K = require('./kit3e');
const { H, tab } = K;
const { D } = require('./sk3');

const GR = {
  c2: { app: 'Je repère les issues et les données utiles dans l’énoncé ou le tableau.', ana: 'Je choisis le bon calcul : issues favorables ÷ issues possibles, ou événement contraire.', rea: 'Je calcule une probabilité, une fréquence ou la probabilité du contraire.', val: 'Je contrôle que le résultat est entre 0 et 1 et je compare fréquence et probabilité.', com: 'Je rédige une réponse claire, avec une phrase.' },
  c3: { app: 'Je repère les deux grandeurs et les données du tableau.', ana: 'Je choisis la méthode : quotients, coefficient ou passage par l’unité.', rea: 'Je calcule un quotient, un coefficient ou une quatrième proportionnelle.', val: 'Je vérifie par un autre calcul et je dis si la situation est proportionnelle.', com: 'Je rédige une réponse avec une phrase et l’unité.' },
  c1: { app: 'Je repère les données utiles dans le tableau ou l’énoncé.', ana: 'Je choisis le calcul ou le diagramme qui répond à la question.', rea: 'Je calcule un effectif, une fréquence, un angle ou une moyenne.', val: 'Je contrôle mon résultat et je dis s’il est vraisemblable.', com: 'Je rédige une réponse claire, avec une phrase et l’unité.' }
};
const doc = {};
const E = {};
const chk0 = [];
const yn = ['oui', 'non'];
const sum = a => a.reduce((x, y) => x + y, 0);

/* ---------- chapitre 1 · statistique à une variable ---------- */
{
  const ef = [[20, 2], [25, 3], [30, 4], [40, 1]], N = sum(ef.map(x => x[1])), S = sum(ef.map(x => x[0] * x[1])), M = S / N;
  const ete = [11.37, 14.29, 9.94], Se = Math.round(sum(ete) * 100) / 100, Me = Math.round(Se / 3 * 100) / 100;
  chk0.push(N === 10 && S === 275 && M === 27.5 && Math.round(4 / N * 100) === 40 && Math.round(4 / N * 360) === 144 && 4 * 100 / N === 40 && 4 * 360 / N === 144 && (8 + 10 + 12) / 3 === 10 && 5 / 20 === .25 && 90 / 360 === .25);
  chk0.push(Se === 35.6 && Me === 11.87 && ete.filter(v => v > 12).length === 1 && ete.filter(v => v < 12).length === 2 && Math.abs(35.6 / 3 - 11.8667) < 1e-3);
  E.c1 = { lieu: 'Ciné-club et soirée séries', duree: '45 min', grille: GR.c1, redac: 1,
    auto: [
      { t: 'Calcule la moyenne de 8 ; 10 et 12.', comp: 'rea', pts: 1, a: '(8 + 10 + 12) ÷ 3 = 10', v: 10, tol: .01, w: 20 },
      { t: 'Sur 20 spectateurs, 5 viennent en groupe. Quelle est la fréquence des spectateurs en groupe ?', comp: 'rea', pts: 1, choices: ['1/4', '1/5', '1/2'], ok: 0, a: '1/4 (5/20 = 0,25)', v: null },
      { t: 'Un secteur d’un diagramme circulaire mesure 90°. Quelle fraction du cercle représente-t-il ?', comp: 'ana', pts: 1, choices: ['1/4', '1/3', '1/2'], ok: 0, a: '1/4 (90/360 = 0,25)', v: null }],
    exos: [
      { t: 'Le ciné-club', intro: `<p>Un ciné-club a organisé ${H('10 séances')}. Voici le nombre de spectateurs par séance.</p>${tab(['Spectateurs par séance', '20', '25', '30', '40'], [['Nombre de séances', '2', '3', '4', '1']])}`, qs: [
        { t: 'Combien de séances ont réuni 30 spectateurs ?', comp: 'app', pts: .5, a: '4 séances', v: 4, tol: .01, w: 20 },
        { t: 'Vérifier que le club a organisé 10 séances en tout.', comp: 'rea', pts: .5, a: '2 + 3 + 4 + 1 = 10 séances', v: 10, tol: .01, w: 20 },
        { t: 'Calculer la fréquence des séances à 30 spectateurs, en pourcentage.', comp: 'rea', pts: 1, a: '4 ÷ 10 = 0,4 = 40 %', v: 40, tol: .01, w: 22 },
        { t: 'On construit un diagramme circulaire. Calculer l’angle du secteur des séances à 30 spectateurs.', comp: 'ana', pts: 1, a: '0,4 × 360 = 144°', v: 144, tol: .01, w: 22 }] },
      { t: 'Le cinéma en été 2025', intro: `<p>Voici les entrées dans les cinémas français en ${H('2025')}, en millions : ${H('juin')} 11,37 ; ${H('juillet')} 14,29 ; ${H('août')} 9,94.</p><p class="srcl">${D.srcCnc}</p>`, qs: [
        { t: 'Calculer le nombre total d’entrées de ces trois mois (en millions).', comp: 'rea', pts: 1, a: '11,37 + 14,29 + 9,94 = 35,60 millions', v: 35.6, tol: .006, w: 28 },
        { t: 'En déduire le nombre moyen d’entrées par mois, arrondi au centième.', comp: 'rea', pts: 1, a: '35,6 ÷ 3 ≈ 11,87 millions', v: 11.87, tol: .006, w: 28 },
        { t: 'Un journaliste écrit : « Chaque mois d’été a dépassé 12 millions d’entrées. » A-t-il raison ? Justifier avec les données.', comp: 'val', pts: 1, a: 'Non : juin (11,37) et août (9,94) sont sous 12 millions.', v: null, lines: 2 }] }] };
}

/* ---------- chapitre 2 · probabilités ---------- */
{
  const mul = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const R = mul(136); let n = 0, k = 0; const sim = [100, 1000].map(N => { while (n < N) { n++; if (1 + Math.floor(R() * 20) === 20) k++; } return k; });
  chk0.push(sim.join() === '8,51' && 3 / 6 === .5 && Math.round((1 - .35) * 100) === 65 && 1 / 50 === .02 && 5 / 50 === .1 && 50 - 1 - 4 === 45 && Math.round((1 - .1) * 100) === 90 && 45 / 50 === .9 && Math.round(8 / 100 * 1000) === 80 && Math.round(51 / 1000 * 1000) === 51 && Math.round((.08 - .05) * 1000) === 30 && Math.round((.051 - .05) * 1000) === 1);
  E.c2 = { lieu: 'Tombola et simulation', duree: '45 min', grille: GR.c2, redac: 1,
    auto: [
      { t: 'On lance un dé équilibré à 6 faces. Quelle est la probabilité d’obtenir un nombre pair ?', comp: 'rea', pts: 1, choices: ['1/2', '1/3', '1/6'], ok: 0, a: '1/2 (3 issues sur 6)', v: null },
      { t: 'La probabilité d’un événement A est 0,35. Quelle est la probabilité de l’événement contraire de A ?', comp: 'rea', pts: 1, a: '1 − 0,35 = 0,65', v: .65, tol: .001, w: 20 },
      { t: 'Lequel de ces nombres ne peut pas être une probabilité ?', comp: 'ana', pts: 1, choices: ['0,8', '1,2', '0'], ok: 1, a: '1,2 : une probabilité est comprise entre 0 et 1', v: null }],
    exos: [
      { t: 'La tombola', intro: `<p>Une association organise une tombola de ${H('50 billets')} numérotés de 1 à 50. ${H('1 billet')} gagne le gros lot, ${H('4 billets')} gagnent un petit lot, les autres perdent. On tire un billet au hasard.</p>`, qs: [
        { t: 'Combien de billets perdants y a-t-il ?', comp: 'app', pts: .5, a: '50 − 1 − 4 = 45 billets', v: 45, tol: .01, w: 20 },
        { t: 'Calculer la probabilité de gagner le gros lot (en décimal).', comp: 'rea', pts: 1, a: '1 ÷ 50 = 0,02', v: .02, tol: .0006, w: 20 },
        { t: 'Calculer la probabilité de gagner un lot (gros lot ou petit lot).', comp: 'rea', pts: 1, a: '5 ÷ 50 = 0,1', v: .1, tol: .0006, w: 20 },
        { t: 'En déduire la probabilité de perdre.', comp: 'ana', pts: .5, a: '1 − 0,1 = 0,9', v: .9, tol: .0006, w: 20 }] },
      { t: 'La simulation', intro: `<p>Un programme simule des lancers d’un dé équilibré à ${H('20 faces')} et compte les « 20 ».</p>${tab(['Nombre de lancers', '100', '1 000'], [['Nombre de « 20 »', '8', '51']])}<p class="srcl">${D.srcSim}</p>`, qs: [
        { t: 'Calculer la fréquence de « 20 » pour 100 lancers.', comp: 'rea', pts: 1, a: '8 ÷ 100 = 0,08', v: .08, tol: .0006, w: 20 },
        { t: 'Calculer la fréquence de « 20 » pour 1 000 lancers.', comp: 'rea', pts: 1, a: '51 ÷ 1 000 = 0,051', v: .051, tol: .00006, w: 20 },
        { t: 'La probabilité d’obtenir « 20 » est 0,05. Que constate-t-on en comparant les deux fréquences à 0,05 ? Justifier.', comp: 'val', pts: 1, a: '0,051 est plus proche de 0,05 que 0,08 : avec plus de lancers, la fréquence se rapproche de la probabilité.', v: null, lines: 2 }] }] };
}

/* ---------- chapitre 3 · proportionnalité ---------- */
{
  chk0.push(12 / 3 * 5 === 20 && 5 / 2 === 2.5 && 15 / 6 === 2.5 && 12.5 / 5 === 2.5 && 12 * 2.5 === 30 && 20 / 2.5 === 8 && Math.round(2.88 / 20 * 1000) === 144 && Math.round(5 * 2.88 * 100) === 1440 && Math.round((14.4 - 9.58) * 100) === 482 && [3 / 1, 6 / 2, 9 / 3].every(q => q === 3));
  E.c3 = { lieu: 'Boutique de goodies et athlétisme', duree: '45 min', grille: GR.c3, redac: 1,
    auto: [
      { t: '3 objets coûtent 12 €. Le prix est proportionnel au nombre d’objets. Combien coûtent 5 objets ?', comp: 'rea', pts: 1, a: '12 ÷ 3 = 4 € l’objet, puis 5 × 4 = 20 €', v: 20, tol: .01, w: 20 },
      { t: 'Un tableau de proportionnalité donne 2 → 5 et 6 → 15. Quel est le coefficient de proportionnalité ?', comp: 'rea', pts: 1, a: '5 ÷ 2 = 2,5', v: 2.5, tol: .01, w: 20 },
      { t: 'Lequel de ces tableaux est un tableau de proportionnalité ?', comp: 'ana', pts: 1, choices: ['1 → 3 ; 2 → 6 ; 3 → 9', '1 → 3 ; 2 → 5 ; 3 → 7', '1 → 2 ; 2 → 3 ; 3 → 4'], ok: 0, a: '1 → 3 ; 2 → 6 ; 3 → 9 (tous les quotients valent 3)', v: null }],
    exos: [
      { t: 'La boutique de badges', intro: `<p>Une boutique vend des badges. ${H('5 badges')} coûtent ${H('12,50 €')}. Le prix est proportionnel au nombre de badges.</p>`, qs: [
        { t: 'Calculer le prix d’un badge.', comp: 'rea', pts: 1, a: '12,50 ÷ 5 = 2,50 €', v: 2.5, tol: .006, w: 20 },
        { t: 'Calculer le prix de 12 badges.', comp: 'rea', pts: 1, a: '12 × 2,50 = 30 €', v: 30, tol: .006, w: 20 },
        { t: 'Avec 20 €, combien de badges peut-on acheter ?', comp: 'ana', pts: 1, a: '20 ÷ 2,50 = 8 badges', v: 8, tol: .01, w: 20 }] },
      { t: 'Les 100 m de Bolt', intro: `<p>Le 16 août 2009 à Berlin, Usain Bolt a couru le 100 m en ${H('9,58 s')}. Son temps de passage à ${H('20 m')} est ${H('2,88 s')}.</p><p class="srcl">${D.srcBolt}</p>`, qs: [
        { t: 'Calculer le quotient temps ÷ distance à 20 m (au millième).', comp: 'rea', pts: 1, a: '2,88 ÷ 20 = 0,144', v: .144, tol: .0006, w: 20 },
        { t: 'Si le temps était proportionnel à la distance, quel serait son temps pour 100 m ? (100 m = 5 × 20 m)', comp: 'rea', pts: 1, a: '5 × 2,88 = 14,40 s', v: 14.4, tol: .006, w: 20 },
        { t: 'Comparer avec son vrai temps de 9,58 s. Le temps est-il proportionnel à la distance ? Justifier.', comp: 'val', pts: 1, a: 'Non : 14,40 s est très différent de 9,58 s (4,82 s d’écart). Au départ Bolt accélère.', v: null, lines: 2 }] }] };
}

require('./evals_x')({ GR, E, chk0, K, H, tab, D, yn, sum });

/* contrôle du format : 45 min, 3 questions d’automatismes (3 points), 1 ou 2 exercices (6 points), 1 point de rédaction */
module.exports = (chk, extra = {}) => {
  Object.assign(E, extra);
  chk(chk0.every(Boolean), 'S’évaluer : contrôles de calcul');
  for (const [id, e] of Object.entries(E)) {
    if (doc[id]) { const ix = e.exos.length > 1 ? 1 : 0; if (!String(e.exos[ix].intro).startsWith(doc[id])) e.exos[ix].intro = doc[id] + (e.exos[ix].intro || ''); }
    const pa = e.auto.reduce((a, q) => a + q.pts, 0), pe = e.exos.reduce((a, x) => a + x.qs.reduce((b, q) => b + q.pts, 0), 0), n = e.exos.reduce((a, x) => a + x.qs.length, 0);
    chk(e.duree === '45 min' && e.auto.length === 3 && Math.abs(pa - 3) < 1e-9 && e.exos.length >= 1 && e.exos.length <= 2 && n >= 4 && n <= 10 && Math.abs(pe - 6) < 1e-9 && e.redac === 1, `S’évaluer ${id} : partie 1 ${e.auto.length} questions / ${pa} pts, partie 2 ${n} questions / ${pe} pts, rédaction ${e.redac}`);
    [...e.auto, ...e.exos.flatMap(x => x.qs)].forEach(q => chk(!!GR[id] && !!GR[id][q.comp], `S’évaluer ${id} : compétence ${q.comp} sans phrase de grille`));
    [...e.auto, ...e.exos.flatMap(x => x.qs)].forEach(q => chk(q.choices ? (q.ok >= 0 && q.ok < q.choices.length) : (q.v === null || Number.isFinite(q.v)), `S’évaluer ${id} : question mal formée « ${q.t.slice(0, 30)} »`));
  }
  return E;
};
module.exports.GR = GR; module.exports.doc = doc; module.exports.E = E;
