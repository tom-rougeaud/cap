/* CAP Maths — trois CCF blancs (contrôle en cours de formation) : 45 minutes, sur 10 points.
   Partie 1 : 3 questions d’automatismes sans calculatrice (3 points, 10 minutes). Partie 2 : 2 exercices de situations professionnelles
   avec la calculatrice (6 points, 35 minutes). Rédaction et présentation : 1 point. Chaque question porte son corrigé détaillé (x) pour la version professeur.
   Les entreprises, clubs et tarifs sont inventés ; les calculs sont vérifiés par chk. */
'use strict';
const { H, tab } = require('./kit3e');

module.exports = chk => {
  const r2 = x => Math.round(x * 100) / 100, rad = d => d * Math.PI / 180;
  const SJ = [];
  const G = (o) => Object.assign({ app: 'Je repère les données utiles dans le document ou l’énoncé.', ana: 'Je choisis le bon calcul ou la bonne formule.', rea: 'Je calcule juste, avec l’unité et l’arrondi demandés.', val: 'Je contrôle mon résultat et je réponds à la question posée.', com: 'Je rédige des phrases claires, avec le résultat et l’unité.' }, o);

  /* ---------- sujet A · la salle d’arcade : statistique, probabilités ---------- */
  {
    const eff = [2, 5, 8, 3, 2], val = [1, 2, 3, 4, 5], N = eff.reduce((a, b) => a + b, 0), S = eff.reduce((a, e, i) => a + e * val[i], 0);
    chk((6 + 9 + 12 + 5) / 4 === 8 && 5 / 20 === .25 && 4.5 / 3 * 5 === 7.5 && N === 20 && S === 58 && S / N === 2.9 && 8 / 20 === .4 && .4 > 1 / 3 && 2 / 8 === .25 && 1 - 3 / 8 === .625 && 5 / 8 > .5, 'CCF A');
    SJ.push({ id: 'A', titre: 'La salle d’arcade', redac: 1,
      grille: G({ app: 'Je repère les effectifs et les issues dans le tableau ou la roue.', ana: 'Je choisis entre la moyenne, la fréquence et la probabilité.', rea: 'Je calcule une moyenne, une probabilité ou une quatrième proportionnelle.', val: 'Je compare mon résultat à l’affirmation et je conclus.' }),
      auto: [
        { t: 'Calcule la moyenne de 6 ; 9 ; 12 et 5.', comp: 'rea', pts: 1, a: '8', v: 8, tol: .01, w: 20, x: '6 + 9 + 12 + 5 = 32 ; 32 ÷ 4 = 8.' },
        { t: 'Un sac contient 20 boules dont 5 sont rouges. Calcule la probabilité de tirer une boule rouge.', comp: 'ana', pts: 1, a: '0,25', v: .25, tol: .005, w: 20, x: '5 boules rouges sur 20 : 5 ÷ 20 = 0,25.' },
        { t: '3 jetons coûtent 4,50 €. Combien coûtent 5 jetons, en euros ?', comp: 'rea', pts: 1, a: '7,50', v: 7.5, tol: .005, w: 20, x: '4,50 ÷ 3 = 1,50 € le jeton ; 1,50 × 5 = 7,50 €.' }],
      exos: [
        { t: 'Les parties de la semaine', intro: `<p>Une salle d’arcade relève le nombre de parties jouées par ${H('20 clients')} un samedi.</p>${tab(['Parties jouées', '1', '2', '3', '4', '5'], [['Nombre de clients', '2', '5', '8', '3', '2']], 'dt-c')}`, qs: [
          { t: 'Calculer le nombre total de parties jouées par les 20 clients.', comp: 'app', pts: 1, a: '1 × 2 + 2 × 5 + 3 × 8 + 4 × 3 + 5 × 2 = 58 parties', v: 58, tol: .01, w: 20, x: '1 × 2 = 2 ; 2 × 5 = 10 ; 3 × 8 = 24 ; 4 × 3 = 12 ; 5 × 2 = 10. Total : 2 + 10 + 24 + 12 + 10 = 58 parties.' },
          { t: 'Calculer le nombre moyen de parties par client.', comp: 'rea', pts: 1, a: '58 ÷ 20 = 2,9 parties', v: 2.9, tol: .006, w: 20, x: 'Moyenne = total des parties ÷ nombre de clients = 58 ÷ 20 = 2,9 parties.' },
          { t: 'Le gérant dit : « Plus d’un tiers des clients jouent 3 parties. » A-t-il raison ? Justifier.', comp: 'val', pts: 1, a: 'Oui : 8 ÷ 20 = 0,40, soit 40 %, et 40 % est supérieur à 33,3 %.', v: null, lines: 2, x: '8 clients sur 20 jouent 3 parties : 8 ÷ 20 = 0,40 = 40 %. Un tiers vaut environ 33,3 %. 40 % est supérieur : le gérant a raison.' }] },
        { t: 'La roue de la chance', intro: `<p>Une roue est partagée en ${H('8 secteurs égaux')} : 3 rouges, 2 bleus et 3 verts. On la fait tourner : chaque secteur a la même chance de sortir. Un lot est gagné avec un secteur rouge ou bleu.</p>`, qs: [
          { t: 'Calculer la probabilité d’obtenir un secteur bleu.', comp: 'app', pts: 1, a: '2 ÷ 8 = 0,25', v: .25, tol: .005, w: 20, x: '2 secteurs bleus sur 8 : 2 ÷ 8 = 0,25.' },
          { t: 'Quel calcul donne la probabilité de ne pas obtenir un secteur rouge ?', comp: 'ana', pts: 1, choices: ['3 ÷ 8', '1 − 3 ÷ 8', '1 − 5 ÷ 8'], ok: 1, a: '1 − 3 ÷ 8', v: null, x: 'L’événement contraire a pour probabilité 1 − 3 ÷ 8 = 5 ÷ 8 = 0,625.' },
          { t: 'Un joueur dit : « Je gagne un lot plus d’une fois sur deux. » A-t-il raison ? Justifier.', comp: 'val', pts: 1, a: 'Oui : (3 + 2) ÷ 8 = 0,625, et 0,625 est supérieur à 0,5.', v: null, lines: 2, x: 'Un lot est gagné avec un secteur rouge ou bleu : 3 + 2 = 5 secteurs sur 8. 5 ÷ 8 = 0,625. 0,625 est supérieur à 0,5 : le joueur a raison.' }] }] });
  }

  /* ---------- sujet B · le magasin de jeux : pourcentages, formule affine ---------- */
  {
    chk(.2 * 150 === 30 && 40 * .9 === 36 && 3 * 4 + 2 === 14 && 1 - .25 === .75 && r2(60 * .75) === 45 && 45 > 40 && 5 * 3 + 20 === 35 && (70 - 20) / 5 === 10 && 5 * 15 + 20 === 95 && 95 > 90, 'CCF B');
    SJ.push({ id: 'B', titre: 'Le magasin de jeux', redac: 1,
      grille: G({ app: 'Je repère le prix, le taux et les valeurs du tableau.', ana: 'Je choisis le coefficient multiplicateur ou la formule.', rea: 'Je calcule un prix soldé ou je résous une équation.', val: 'Je compare le résultat à l’affirmation et je conclus.' }),
      auto: [
        { t: 'Calcule 20 % de 150.', comp: 'rea', pts: 1, a: '30', v: 30, tol: .01, w: 20, x: '20 % = un cinquième : 150 ÷ 5 = 30.' },
        { t: 'Un article à 40 € baisse de 10 %. Calcule son nouveau prix, en euros.', comp: 'rea', pts: 1, a: '36', v: 36, tol: .01, w: 20, x: '10 % de 40 = 4 ; 40 − 4 = 36 €.' },
        { t: 'Calcule y = 3x + 2 pour x = 4.', comp: 'rea', pts: 1, a: '14', v: 14, tol: .01, w: 20, lab: 'y =', x: '3 × 4 = 12 ; 12 + 2 = 14.' }],
      exos: [
        { t: 'Les soldes', intro: `<p>Un jeu vidéo coûte ${H('60 €')} avant les soldes. Pendant les soldes, son prix baisse de ${H('25 %')}.</p>`, qs: [
          { t: 'Calculer le coefficient multiplicateur correspondant à une baisse de 25 %.', comp: 'ana', pts: 1, a: '1 − 0,25 = 0,75', v: .75, tol: .0006, w: 20, x: 'Une baisse de 25 % multiplie le prix par 1 − 25 ÷ 100 = 0,75.' },
          { t: 'Calculer le prix soldé, en euros.', comp: 'rea', pts: 1, a: '60 × 0,75 = 45 €', v: 45, tol: .01, w: 20, x: '60 × 0,75 = 45 €. Contrôle : 25 % de 60 = 15 et 60 − 15 = 45 €.' },
          { t: 'Le vendeur affirme : « Pendant les soldes, ce jeu coûte moins de 40 €. » A-t-il raison ? Justifier.', comp: 'val', pts: 1, a: 'Non : 45 € est supérieur à 40 €.', v: null, lines: 2, x: 'Le prix soldé est 45 €. 45 est supérieur à 40 : le vendeur a tort.' }] },
        { t: 'Le tarif du club de jeux', intro: `<p>Un club de jeux de société demande une inscription de ${H('20 €')}, puis ${H('5 €')} par séance. Le prix payé pour x séances est P(x) = 5x + 20.</p>${tab(['Séances x', '1', '2', '3'], [['Prix P(x) en €', '25', '30', '35']], 'dt-c')}`, qs: [
          { t: 'Lire dans le tableau le prix à payer pour 3 séances, en euros.', comp: 'app', pts: 1, a: '35 €', v: 35, tol: .01, w: 20, x: 'Dans la colonne x = 3 du tableau, on lit 35 €. Contrôle : 5 × 3 + 20 = 35 €.' },
          { t: 'Combien de séances peut-on payer avec 70 € ? Résoudre 5x + 20 = 70.', comp: 'rea', pts: 1, a: '5x = 50, donc x = 10 séances', v: 10, tol: .01, w: 20, lab: 'x =', x: '5x + 20 = 70 donne 5x = 70 − 20 = 50, donc x = 50 ÷ 5 = 10 séances.' },
          { t: 'Lou a un budget de 90 €. Peut-elle payer 15 séances ? Justifier.', comp: 'val', pts: 1, a: 'Non : 5 × 15 + 20 = 95 €, et 95 € est supérieur à 90 €.', v: null, lines: 2, x: 'P(15) = 5 × 15 + 20 = 75 + 20 = 95 €. 95 est supérieur à 90 : le budget ne suffit pas.' }] }] });
  }

  /* ---------- sujet C · le skatepark : trigonométrie, périmètres et aires ---------- */
  {
    const h = 4 * Math.sin(rad(10));
    chk(6 * 4 / 2 === 12 && Math.hypot(3, 4) === 5 && 3 * 10000 === 30000 && r2(h) === .69 && h < 1 && 2 * (30 + 18) === 96 && 30 * 18 === 540 && Math.ceil(540 / 80) === 7 && 6 * 80 === 480 && 480 < 540, 'CCF C');
    SJ.push({ id: 'C', titre: 'Le skatepark', redac: 1,
      grille: G({ app: 'Je repère les mesures, l’angle et les formules.', ana: 'Je choisis entre sinus, cosinus et tangente.', rea: 'Je calcule une longueur, un périmètre ou une aire.', val: 'Je compare mon résultat à la règle ou à la quantité achetée.' }),
      auto: [
        { t: 'Calcule l’aire d’un triangle de base 6 m et de hauteur 4 m, en mètres carrés.', comp: 'rea', pts: 1, a: '12', v: 12, tol: .01, w: 20, x: 'A = base × hauteur ÷ 2 = 6 × 4 ÷ 2 = 12 m².' },
        { t: 'Un triangle rectangle a des côtés de l’angle droit de 3 cm et 4 cm. Calcule l’hypoténuse, en centimètres.', comp: 'ana', pts: 1, a: '5', v: 5, tol: .01, w: 20, x: 'd² = 3² + 4² = 9 + 16 = 25, donc d = √25 = 5 cm.' },
        { t: 'Convertis 3 m² en centimètres carrés.', comp: 'rea', pts: 1, a: '30 000', v: 30000, tol: .01, w: 22, x: '1 m² = 10 000 cm², donc 3 m² = 3 × 10 000 = 30 000 cm².' }],
      exos: [
        { t: 'La rampe', intro: `<p>Une rampe de skate mesure ${H('4 m')} de long. Elle fait un angle de ${H('10°')} avec le sol. On note h sa hauteur. La calculatrice est en mode degrés.</p>`, qs: [
          { t: 'Quel rapport relie la hauteur h, la longueur 4 m et l’angle de 10° ?', comp: 'ana', pts: 1, choices: ['le sinus', 'le cosinus', 'la tangente'], ok: 0, a: 'le sinus', v: null, x: 'h est le côté opposé à l’angle et 4 m est l’hypoténuse : sin 10° = h ÷ 4.' },
          { t: 'Calculer la hauteur h, arrondie au centième, en mètres.', comp: 'rea', pts: 1, a: 'h = 4 × sin 10° ≈ 0,69 m', v: .69, tol: .006, w: 20, x: 'h = 4 × sin 10° = 4 × 0,1736 ≈ 0,69 m.' },
          { t: 'Le règlement demande une rampe de moins de 1 m de haut. La rampe respecte-t-elle la règle ? Justifier.', comp: 'val', pts: 1, a: 'Oui : 0,69 m est inférieur à 1 m.', v: null, lines: 2, x: 'h ≈ 0,69 m. 0,69 est inférieur à 1 : la règle est respectée.' }] },
        { t: 'La piste de roller', intro: `<p>Le sol d’une piste de roller est un rectangle de ${H('30 m')} sur ${H('18 m')}. On le peint. Un seau de peinture couvre ${H('80 m²')}.</p>`, qs: [
          { t: 'Calculer le périmètre de la piste, en mètres.', comp: 'app', pts: 1, a: '2 × (30 + 18) = 96 m', v: 96, tol: .01, w: 20, x: 'P = 2 × (30 + 18) = 2 × 48 = 96 m.' },
          { t: 'Combien de seaux faut-il acheter pour peindre tout le sol ? Calculer l’aire, puis arrondir à l’entier supérieur.', comp: 'rea', pts: 1, a: 'A = 30 × 18 = 540 m² ; 540 ÷ 80 = 6,75 : 7 seaux', v: 7, tol: .01, w: 20, x: 'A = 30 × 18 = 540 m². 540 ÷ 80 = 6,75. On ne peut pas acheter 0,75 seau : on arrondit à 7 seaux.' },
          { t: 'Un employé en a acheté 6. Est-ce suffisant ? Justifier.', comp: 'val', pts: 1, a: 'Non : 6 × 80 = 480 m², et 480 m² est inférieur à 540 m².', v: null, lines: 2, x: '6 seaux couvrent 6 × 80 = 480 m². 480 est inférieur à 540 : il manque de la peinture.' }] }] });
  }

  SJ.slice(0, 2).forEach(sj => require('./tolfix').all(sj, chk, 'CCF ' + sj.id));
  return SJ.slice(0, 2); /* deux CCF blancs */
};
