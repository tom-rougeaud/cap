/* CAP Maths — évaluations (CCF) des chapitres 4 à 10 : 45 minutes, sur 10 points (3 points d’automatismes, 6 points de situations, 1 point de rédaction). */
'use strict';
module.exports = ({ GR, E, chk0, K, H, tab, D, yn, sum }) => {
  const r2 = x => Math.round(x * 100) / 100;

  /* ---------- chapitre 4 · pourcentages et échelles ---------- */
  GR.c4 = { app: 'Je repère la valeur de départ, le pourcentage ou l’échelle dans l’énoncé.', ana: 'Je choisis le calcul : pourcentage d’une quantité, coefficient, taux d’évolution ou échelle.', rea: 'Je calcule une remise, un prix, un taux ou une longueur réelle.', val: 'Je vérifie le sens (hausse ou baisse) et si le résultat est vraisemblable.', com: 'Je rédige une réponse avec une phrase et l’unité.' };
  chk0.push(80 / 5 === 16 && 50 * .9 === 45 && 4 * 100 === 400 && 60 * 25 / 100 === 15 && 60 - 15 === 45 && r2(30 / .75) === 40 && r2(14.99 - 13.49) === 1.5 && Math.round(1.5 / 13.49 * 1000) === 111 && 1.5 / 13.49 * 100 < 15);
  E.c4 = { lieu: 'Boutique de jeux vidéo et abonnements', duree: '45 min', grille: GR.c4, redac: 1,
    auto: [
      { t: 'Calcule 20 % de 80 €.', comp: 'rea', pts: 1, a: '20 % = 1/5 ; 80 ÷ 5 = 16 €', v: 16, tol: .01, w: 20 },
      { t: 'Un prix de 50 € baisse de 10 %. Quel est le nouveau prix, en euros ?', comp: 'rea', pts: 1, a: '50 × 0,90 = 45 €', v: 45, tol: .01, w: 20 },
      { t: 'Sur un plan à l’échelle 1/100, un mur mesure 4 cm. Quelle est sa longueur réelle ?', comp: 'ana', pts: 1, choices: ['4 m', '40 cm', '400 m'], ok: 0, a: '4 m (4 × 100 = 400 cm)', v: null }],
    exos: [
      { t: 'Les soldes de la boutique', intro: `<p>Une boutique solde un jeu vidéo de ${H('60 €')} avec une remise de ${H('25 %')}.</p>`, qs: [
        { t: 'Calculer la remise, en euros.', comp: 'rea', pts: 1, a: '60 × 25 ÷ 100 = 15 €', v: 15, tol: .01, w: 20 },
        { t: 'Calculer le prix soldé, en euros.', comp: 'rea', pts: 1, a: '60 − 15 = 45 €', v: 45, tol: .01, w: 20 },
        { t: 'Un autre jeu, soldé de 25 %, coûte 30 €. Quel était son prix de départ, en euros ?', comp: 'ana', pts: 1, a: '30 ÷ 0,75 = 40 €', v: 40, tol: .01, w: 20 }] },
      { t: 'La hausse de l’offre Standard', intro: `<p>L’abonnement Netflix « Standard » est passé de ${H('13,49 €')} à ${H('14,99 €')} par mois.</p><p class="srcl">${D.srcNetflix}</p>`, qs: [
        { t: 'Calculer l’augmentation mensuelle, en euros.', comp: 'rea', pts: 1, a: '14,99 − 13,49 = 1,50 €', v: 1.5, tol: .006, w: 20 },
        { t: 'Calculer le taux d’évolution, en pourcentage (au dixième).', comp: 'rea', pts: 1, a: '1,50 ÷ 13,49 ≈ 0,111, soit 11,1 %', v: 11.1, tol: .06, w: 20 },
        { t: 'Un journaliste écrit : « Le prix a augmenté de plus de 15 %. » A-t-il raison ? Justifier.', comp: 'val', pts: 1, a: 'Non : la hausse est d’environ 11,1 %, inférieure à 15 %.', v: null, lines: 2 }] }] };

  /* ---------- chapitre 5 · équations et formules ---------- */
  GR.c5 = { app: 'Je repère la formule, l’inconnue et les valeurs données.', ana: 'Je choisis l’opération qui défait celle de l’équation.', rea: 'Je calcule la valeur d’une formule ou je résous une équation.', val: 'Je vérifie la solution et je la compare à la situation.', com: 'Je rédige une réponse avec une phrase et l’unité.' };
  chk0.push(28 + 12 === 40 && 3 * 6 + 5 === 23 && 24 / 3 === 8 && r2(2.5 * 6 + 5) === 20 && r2((30 - 5) / 2.5) === 10 && r2(2.5 * 10 + 5) === 30 && 2.5 * 10 + 5 > 28 && r2((28 - 5) / 2.5) === 9.2 && 1150 / 230 === 5 && 1380 / 230 === 6 && 5 + 6 === 11 && 11 > 10);
  E.c5 = { lieu: 'Club de jeux et installation électrique', duree: '45 min', grille: GR.c5, redac: 1,
    auto: [
      { t: 'Résous x + 12 = 40.', comp: 'rea', pts: 1, a: 'x = 40 − 12 = 28', v: 28, tol: .01, w: 20 },
      { t: 'Calcule 3 × n + 5 pour n = 6.', comp: 'rea', pts: 1, a: '3 × 6 + 5 = 18 + 5 = 23', v: 23, tol: .01, w: 20 },
      { t: 'Pour résoudre 3x = 24, on :', comp: 'ana', pts: 1, choices: ['divise par 3 des deux côtés', 'soustrait 3 des deux côtés', 'multiplie par 3 des deux côtés'], ok: 0, a: 'divise par 3 des deux côtés : x = 24 ÷ 3 = 8', v: null }],
    exos: [
      { t: 'Le club de jeux', intro: `<p>Un club demande ${H('5 €')} d’inscription puis ${H('2,50 €')} par séance. Le prix de n séances est P = 2,5 × n + 5.</p>`, qs: [
        { t: 'Calculer le prix de 6 séances, en euros.', comp: 'rea', pts: 1, a: '2,5 × 6 + 5 = 15 + 5 = 20 €', v: 20, tol: .01, w: 20 },
        { t: 'Léa a payé 30 €. Résoudre 2,5x + 5 = 30 pour trouver son nombre de séances.', comp: 'rea', pts: 1, a: '2,5x = 25 ; x = 25 ÷ 2,5 = 10 séances', v: 10, tol: .01, w: 20 },
        { t: 'Un ami dit : « Avec 28 €, on peut faire 10 séances. » A-t-il raison ? Justifier.', comp: 'val', pts: 1, a: 'Non : 10 séances coûtent 30 €, plus que 28 €. Avec 28 € : (28 − 5) ÷ 2,5 = 9,2, soit 9 séances complètes.', v: null, lines: 3 }] },
      { t: 'La prise de la cuisine', intro: `<p>La tension du secteur est ${H('230 V')}. La puissance est P = U × I (P en watts, U en volts, I en ampères). Un radiateur de ${H('1 150 W')} et un aspirateur de ${H('1 380 W')} sont branchés sur une prise limitée à ${H('10 A')}.</p>`, qs: [
        { t: 'Calculer l’intensité du radiateur, en ampères.', comp: 'rea', pts: 1, a: '1 150 ÷ 230 = 5 A', v: 5, tol: .01, w: 20 },
        { t: 'Calculer l’intensité de l’aspirateur, en ampères.', comp: 'rea', pts: 1, a: '1 380 ÷ 230 = 6 A', v: 6, tol: .01, w: 20 },
        { t: 'Peut-on brancher les deux appareils en même temps sur cette prise ? Justifier.', comp: 'val', pts: 1, a: 'Non : 5 + 6 = 11 A, supérieur à 10 A.', v: null, lines: 2 }] }] };

  /* ---------- chapitre 6 · fonctions et graphiques ---------- */
  GR.c6 = { app: 'Je repère ce que je cherche : une image, un antécédent, une coordonnée.', ana: 'Je choisis la ligne de lecture et le sens de lecture (de x vers f(x), ou l’inverse).', rea: 'Je lis ou je calcule la valeur demandée, avec son unité.', val: 'Je vérifie la valeur lue avec le tableau ou la formule.', com: 'Je rédige une réponse avec une phrase et l’unité.' };
  chk0.push(3 * 4 + 2 === 14 && r2(9.58 - 5.47) === 4.11 && 4.11 < 5 && 4 * 1 - 2 * 1 === 2 && 4 * .5 - 2 * .25 === 1.5 && 4 * 1.5 - 2 * 2.25 === 1.5 && 4 * 2 - 2 * 4 === 0);
  const sautC = (() => { const g = K.MCVP.plot({ W: 360, H: 210, x: [0, 2, .25], y: [0, 2.5, .5], ml: 38, mr: 12, mt: 16, mb: 34, fs: 10.5, lx: 2, ly: 1, xl: 't (s)', yl: 'h (m)', lab: 'La hauteur h du saut d’un personnage en fonction du temps t' }); return g.wrap(g.base + g.curve(t => 4 * t - 2 * t * t, { w: 3 }) + g.pts([0, .5, 1, 1.5, 2].map(t => [t, 4 * t - 2 * t * t]), { r: 4 })).replace('<svg ', '<svg style="max-width:108mm;height:auto" '); })();
  E.c6 = { lieu: 'Salle de jeux vidéo et piste d’athlétisme', duree: '45 min', grille: GR.c6, redac: 1,
    auto: [
      { t: 'Quelle est l’abscisse du point A (5 ; 2) ?', comp: 'app', pts: 1, a: 'l’abscisse est le premier nombre : 5', v: 5, tol: .01, w: 20 },
      { t: 'f(x) = 3x + 2. Calcule l’image de 4.', comp: 'rea', pts: 1, a: 'f(4) = 3 × 4 + 2 = 14', v: 14, tol: .01, w: 20 },
      { t: 'Une courbe descend de la gauche vers la droite. La fonction est :', comp: 'ana', pts: 1, choices: ['croissante', 'décroissante', 'constante'], ok: 1, a: 'décroissante', v: null }],
    exos: [
      { t: 'Le temps de Bolt', intro: `<p>Voici des temps de passage d’Usain Bolt (finale du 100 m, Berlin 2009).</p>${tab(['d (m)', '30', '50', '80', '100'], [['t (s)', '3,78', '5,47', '7,92', '9,58']])}<p class="srcl">${D.srcBoltC}</p>`, qs: [
        { t: 'Lire l’image de 50, en secondes.', comp: 'app', pts: 1, a: 'f(50) = 5,47 s', v: 5.47, tol: .006, w: 20 },
        { t: 'Lire l’antécédent de 7,92, en mètres.', comp: 'rea', pts: 1, a: 'l’antécédent de 7,92 est 80 m', v: 80, tol: .01, w: 20 },
        { t: 'Un élève affirme : « Entre 50 m et 100 m, Bolt a mis plus de 5 s. » A-t-il raison ? Justifier.', comp: 'val', pts: 1, a: 'Non : 9,58 − 5,47 = 4,11 s, inférieur à 5 s.', v: null, lines: 2 }] },
      { t: 'Le saut du personnage', intro: `<p>Un personnage de jeu vidéo saute. La courbe donne sa hauteur h, en mètres, selon le temps t, en secondes.</p>${sautC}`, qs: [
        { t: 'Lire la hauteur maximale, en mètres.', comp: 'rea', pts: 1, a: 'le point le plus haut est à 2 m', v: 2, tol: .01, w: 20 },
        { t: 'Lire l’instant où cette hauteur est atteinte, en secondes.', comp: 'rea', pts: 1, a: 'à t = 1 s', v: 1, tol: .01, w: 20 },
        { t: 'La fonction est-elle croissante ou décroissante entre 1 s et 2 s ? Justifier.', comp: 'ana', pts: 1, a: 'Décroissante : la courbe descend de 2 m à 0 m.', v: null, lines: 2 }] }] };

  /* ---------- chapitre 7 · fonctions linéaires et affines ---------- */
  GR.c7 = { app: 'Je repère le nombre a (qui multiplie x) et le nombre b (qui est ajouté).', ana: 'Je choisis : calcul d’une image, lecture sur la droite, équation ou comparaison.', rea: 'Je calcule l’image ou je résous l’équation, avec l’unité.', val: 'Je vérifie avec la droite ou avec un deuxième calcul.', com: 'Je rédige une conclusion avec une phrase et l’unité.' };
  chk0.push(5 * 6 === 30 && 5 * 8 + 15 === 55 && (80 - 15) / 5 === 13 && 5 * 12 + 15 === 75 && 75 > 70 && 8 * 5 === 40 && 4 * 5 + 20 === 40 && 8 * 7 === 56 && 4 * 7 + 20 === 48 && 48 < 56 && 8 * 8 === 64 && 4 * 8 + 20 === 52);
  const duoC = (() => { const g = K.MCVP.plot({ W: 360, H: 220, x: [0, 8, 1], y: [0, 70, 10], ml: 36, mr: 26, mt: 16, mb: 34, fs: 10.5, lx: 1, ly: 1, xl: 'nombre de séances x', yl: 'prix en €', lab: 'Les prix des formules A et B selon le nombre de séances' }); const t = (x, y, s, c) => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-family="Nunito Sans" font-size="13" font-weight="800" fill="${c}">${s}</text>`; return g.wrap(g.base + g.line(8, 0, { stroke: '#1D5FC2', w: 3 }) + g.line(4, 20, { stroke: '#C2332A', w: 3 }) + t(g.X(8) + 6, g.Y(64) + 4, 'A', '#1D5FC2') + t(g.X(8) + 6, g.Y(52) + 4, 'B', '#C2332A')).replace('<svg ', '<svg style="max-width:108mm;height:auto" '); })();
  E.c7 = { lieu: 'Cinéma et cabine de pop-corn', duree: '45 min', grille: GR.c7, redac: 1,
    auto: [
      { t: 'f(x) = 5x. Calcule l’image de 6.', comp: 'rea', pts: 1, a: 'f(6) = 5 × 6 = 30', v: 30, tol: .01, w: 20 },
      { t: 'Dans P(x) = 4x + 9, quelle est la valeur de b ?', comp: 'app', pts: 1, a: 'b est le nombre ajouté : 9', v: 9, tol: .01, w: 20 },
      { t: 'La droite d’une fonction passe par l’origine (0 ; 0). La fonction est :', comp: 'ana', pts: 1, choices: ['linéaire', 'affine avec b non nul', 'décroissante'], ok: 0, a: 'linéaire', v: null }],
    exos: [
      { t: 'La carte de cinéma', intro: `<p>Un cinéma propose une carte à ${H('15 €')}, puis ${H('5 €')} par séance. Le prix de x séances est P(x) = 5x + 15.</p>`, qs: [
        { t: 'Calculer le prix de 8 séances, en euros.', comp: 'rea', pts: 1, a: 'P(8) = 5 × 8 + 15 = 55 €', v: 55, tol: .01, w: 20 },
        { t: 'Avec 80 €, combien de séances peut-on payer ?', comp: 'rea', pts: 1, a: '5x + 15 = 80 donne 5x = 65, puis x = 13', v: 13, tol: .01, w: 20 },
        { t: 'Un client dit : « 12 séances coûtent moins de 70 €. » A-t-il raison ? Justifier.', comp: 'val', pts: 1, a: 'Non : P(12) = 5 × 12 + 15 = 75 €, plus que 70 €.', v: null, lines: 2 }] },
      { t: 'Deux formules de séances', intro: `<p>Formule A : ${H('8 €')} la séance, A(x) = 8x. Formule B : ${H('20 €')} de carte puis ${H('4 €')} la séance, B(x) = 4x + 20. Voici les deux droites.</p>${duoC}`, qs: [
        { t: 'Lire le nombre de séances pour lequel les deux formules coûtent pareil.', comp: 'app', pts: 1, a: 'les droites se croisent en x = 5', v: 5, tol: .01, w: 20 },
        { t: 'Lire le prix à cet endroit, en euros.', comp: 'rea', pts: 1, a: 'au croisement, le prix est 40 €', v: 40, tol: .01, w: 20 },
        { t: 'Pour 7 séances, quelle formule est la moins chère ? Justifier avec un calcul.', comp: 'ana', pts: 1, a: 'B : 4 × 7 + 20 = 48 €, contre 8 × 7 = 56 € avec A.', v: null, lines: 2 }] }] };

  /* ---------- chapitre 8 · calculs commerciaux ---------- */
  GR.c8 = { app: 'Je repère le prix HT, le taux de TVA, la remise ou le taux dans l’énoncé.', ana: 'Je choisis le calcul à faire et l’ordre des lignes de la facture.', rea: 'Je calcule la remise, la TVA, le TTC, la marge ou l’intérêt, avec l’unité.', val: 'Je vérifie avec un coefficient multiplicateur ou un calcul inverse.', com: 'Je rédige une conclusion avec une phrase et l’unité.' };
  chk0.push(r2(50 * 1.2) === 60 && r2(1000 * .03 * 2) === 60 && r2(120 * .1) === 12 && 120 - 12 === 108 && r2(108 * 1.2) === 129.6 && 129.6 > 120 && 39 - 30 === 9 && r2(9 / 30) === .3 && .3 < .4);
  E.c8 = { lieu: 'Boutique de jeux et salon de coiffure', duree: '45 min', grille: GR.c8, redac: 1,
    auto: [
      { t: 'Un prix de 50 € HT a 20 % de TVA. Quel est le prix TTC, en euros ?', comp: 'rea', pts: 1, a: '50 × 1,20 = 60 €', v: 60, tol: .01, w: 20 },
      { t: 'La marge d’un commerçant est la différence entre :', comp: 'app', pts: 1, choices: ['le prix de vente HT et le prix d’achat HT', 'le prix TTC et le prix HT', 'le prix brut et le net commercial'], ok: 0, a: 'le prix de vente HT et le prix d’achat HT', v: null },
      { t: 'Un capital de 1 000 € est placé à 3 % par an pendant 2 ans (intérêts simples). Calcule l’intérêt, en euros.', comp: 'rea', pts: 1, a: 'I = 1 000 × 0,03 × 2 = 60 €', v: 60, tol: .01, w: 20 }],
    exos: [
      { t: 'La facture du casque', intro: `<p>Un casque audio est facturé ${H('120 € HT')}. Le magasin accorde une remise de ${H('10 %')}. La TVA est de ${H('20 %')}.</p>`, qs: [
        { t: 'Calculer la remise, en euros.', comp: 'rea', pts: 1, a: '120 × 0,10 = 12 €', v: 12, tol: .01, w: 20 },
        { t: 'Calculer le total TTC, en euros.', comp: 'ana', pts: 1, a: 'net : 120 − 12 = 108 € HT ; TTC : 108 × 1,20 = 129,60 €', v: 129.6, tol: .006, w: 20 },
        { t: 'Le client dit : « Avec la remise, je paie moins de 120 €. » A-t-il raison ? Justifier.', comp: 'val', pts: 1, a: 'Non : le total TTC est 129,60 €, plus que 120 €, car la TVA s’ajoute au net de 108 €.', v: null, lines: 2 }] },
      { t: 'La marge sur un jeu', intro: `<p>Une boutique achète un jeu ${H('30 € HT')} et le revend ${H('39 € HT')}.</p>`, qs: [
        { t: 'Calculer la marge, en euros.', comp: 'rea', pts: 1, a: '39 − 30 = 9 €', v: 9, tol: .01, w: 20 },
        { t: 'Calculer le taux de marge, en pourcentage.', comp: 'app', pts: 1, a: '9 ÷ 30 = 0,30, soit 30 %', v: 30, tol: .05, w: 20 },
        { t: 'Le gérant dit : « Mon taux de marge est supérieur à 40 %. » A-t-il raison ? Justifier.', comp: 'ana', pts: 1, a: 'Non : le taux de marge est 30 %, inférieur à 40 %.', v: null, lines: 2 }] }] };
  /* ---------- chapitre 9 · périmètres, aires et volumes ---------- */
  GR.c9 = { app: 'Je repère les mesures et la formule : rectangle, triangle, disque, pavé ou cylindre.', ana: 'Je choisis la bonne formule et la bonne unité.', rea: 'Je calcule un périmètre, une aire, un volume ou une conversion, avec l’unité.', val: 'Je vérifie l’ordre de grandeur et l’unité (m, m² ou m³).', com: 'Je rédige une conclusion avec une phrase et l’unité.' };
  chk0.push(8 * 5 === 40 && 2 * 10000 === 20000 && 2 * (30 + 15) === 90 && 30 * 15 === 450 && 450 / 50 === 9 && 9 > 8 && r2(Math.PI * 9 * 10) === 282.74 && Math.round(Math.PI * 90) === 283 && Math.floor(1000 / (Math.PI * 90)) === 3 && 283 > 250);
  E.c9 = { lieu: 'Terrain de jeu et cinéma', duree: '45 min', grille: GR.c9, redac: 1,
    auto: [
      { t: 'Un rectangle mesure 8 m sur 5 m. Calcule son aire, en mètres carrés.', comp: 'rea', pts: 1, a: '8 × 5 = 40 m²', v: 40, tol: .01, w: 20 },
      { t: 'Le périmètre d’une figure s’exprime en :', comp: 'app', pts: 1, choices: ['mètres (m)', 'mètres carrés (m²)', 'mètres cubes (m³)'], ok: 0, a: 'mètres (m)', v: null },
      { t: 'Convertis 2 m² en centimètres carrés.', comp: 'rea', pts: 1, a: '2 × 10 000 = 20 000 cm²', v: 20000, tol: .01, w: 22 }],
    exos: [
      { t: 'Le terrain du quartier', intro: `<p>Un terrain de jeu est un rectangle de ${H('30 m')} sur ${H('15 m')}. Un pot de peinture couvre ${H('50 m²')}.</p>`, qs: [
        { t: 'Calculer le périmètre du terrain, en mètres.', comp: 'rea', pts: 1, a: 'P = 2 × (30 + 15) = 90 m', v: 90, tol: .01, w: 20 },
        { t: 'Calculer l’aire du terrain, en mètres carrés.', comp: 'app', pts: 1, a: 'A = 30 × 15 = 450 m²', v: 450, tol: .01, w: 20 },
        { t: 'Un ouvrier dit : « 8 pots suffisent pour peindre tout le terrain. » A-t-il raison ? Justifier.', comp: 'val', pts: 1, a: 'Non : 450 ÷ 50 = 9 pots, plus que 8.', v: null, lines: 2 }] },
      { t: 'Le gobelet du cinéma', intro: `<p>Un gobelet de cinéma est un cylindre de rayon ${H('3 cm')} et de hauteur ${H('10 cm')}. Une bouteille contient ${H('1 L')}, soit 1 000 mL. On rappelle que 1 cm³ = 1 mL.</p>`, qs: [
        { t: 'Calculer le volume du gobelet, arrondi à l’unité, en cm³.', comp: 'rea', pts: 1, a: 'V = π × 3² × 10 ≈ 283 cm³', v: 283, tol: .51, w: 20 },
        { t: 'Combien de gobelets pleins peut-on remplir avec la bouteille de 1 L ?', comp: 'ana', pts: 1, a: '1 000 ÷ 282,74 ≈ 3,5 : 3 gobelets pleins', v: 3, tol: .01, w: 20 },
        { t: 'Un client dit : « Ce gobelet contient plus de 250 mL. » A-t-il raison ? Justifier.', comp: 'val', pts: 1, a: 'Oui : 283 mL est supérieur à 250 mL.', v: null, lines: 2 }] }] };
    GR.c10 = { app: 'Je repère l’hypoténuse, les côtés de l’angle droit et les longueurs données.', ana: 'Je choisis entre Pythagore, Thalès et la trigonométrie.', rea: 'Je calcule une longueur ou un angle, avec l’unité et l’arrondi demandé.', val: 'Je vérifie que l’hypoténuse est le plus grand côté et que le résultat est possible.', com: 'Je rédige une conclusion avec une phrase et l’unité.' };
  chk0.push(Math.hypot(6, 8) === 10 && Math.round(Math.hypot(100, 56) * 10) / 10 === 114.6 && Math.round(Math.hypot(100, 56) / 2.54 * 10) / 10 === 45.1 && 114.6 < 120 && 8 / 1 === 8 && 1.5 * 8 === 12 && 12 < 15 && Math.round(10 * Math.sin(30 * Math.PI / 180) * 100) / 100 === 5);
  E.c10 = { lieu: 'Écran et arbre', duree: '45 min', grille: GR.c10, redac: 1,
    auto: [
      { t: 'Les côtés de l’angle droit d’un triangle mesurent 6 cm et 8 cm. Calcule l’hypoténuse, en centimètres.', comp: 'rea', pts: 1, a: '√(6² + 8²) = √100 = 10 cm', v: 10, tol: .01, w: 20 },
      { t: 'L’hypoténuse d’un triangle rectangle est :', comp: 'app', pts: 1, choices: ['le côté opposé à l’angle droit', 'le plus petit côté', 'un côté de l’angle droit'], ok: 0, a: 'le côté opposé à l’angle droit', v: null },
      { t: 'La calculatrice est en mode degrés. Calcule 10 × sin 30°.', comp: 'rea', pts: 1, a: 'sin 30° = 0,5, donc 10 × 0,5 = 5', v: 5, tol: .01, w: 20 }],
    exos: [
      { t: 'L’écran du salon', intro: `<p>Un écran de télévision rectangulaire mesure ${H('100 cm')} de large et ${H('56 cm')} de haut. On rappelle que 1 pouce = 2,54 cm.</p>`, qs: [
        { t: 'Calculer la diagonale de l’écran, arrondie au dixième, en centimètres.', comp: 'rea', pts: 1, a: 'd² = 100² + 56² = 13 136 ; d = √13 136 ≈ 114,6 cm', v: 114.6, tol: .06, w: 20 },
        { t: 'Convertir cette diagonale en pouces, arrondie au dixième.', comp: 'ana', pts: 1, a: '114,6 ÷ 2,54 ≈ 45,1 pouces', v: 45.1, tol: .06, w: 20 },
        { t: 'Un vendeur dit : « Cet écran mesure plus de 120 cm de diagonale. » A-t-il raison ? Justifier.', comp: 'val', pts: 1, a: 'Non : 114,6 cm est inférieur à 120 cm.', v: null, lines: 2 }] },
      { t: 'La hauteur d’un arbre', intro: `<p>Au même moment, un bâton de ${H('1,5 m')} a une ombre de ${H('1 m')}, et un arbre a une ombre de ${H('8 m')}. Les ombres sont proportionnelles aux hauteurs.</p>`, qs: [
        { t: 'Calculer le coefficient entre l’ombre de l’arbre et celle du bâton.', comp: 'app', pts: 1, a: '8 ÷ 1 = 8', v: 8, tol: .01, w: 20 },
        { t: 'Calculer la hauteur de l’arbre, en mètres.', comp: 'rea', pts: 1, a: '1,5 × 8 = 12 m', v: 12, tol: .01, w: 20 },
        { t: 'Un enfant dit : « L’arbre mesure plus de 15 m. » A-t-il raison ? Justifier.', comp: 'val', pts: 1, a: 'Non : 12 m est inférieur à 15 m.', v: null, lines: 2 }] }] };
  /* FIN */
};
