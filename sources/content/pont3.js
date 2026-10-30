/* CAP Maths — « Ce que tu sais déjà » : ce que chaque chapitre reprend du collège, et ce qu’il ajoute au CAP.
   de      : notions déjà vues (niveau, thème, ce que l’élève y a appris)
   fil     : une phrase de synthèse (page d’ouverture du manuel)
   ex2/ex1 : la même situation traitée au collège, puis au CAP
   reste, change, pourquoi : ce qui reste, ce qui change, à quoi ça sert
   prog    : capacités du programme de CAP couvertes (version professeur)
   reac    : automatismes à réactiver (version professeur)
   vig     : points de vigilance (version professeur) */
'use strict';
const d = (niv, titre, sais) => ({ niv, titre, sais });
module.exports = {
  c1: { de: [d('Collège', 'Tableaux et diagrammes', 'tu as lu un tableau, calculé une fréquence et lu un diagramme en bâtons ou circulaire.'), d('Collège', 'Moyenne', 'tu as calculé la moyenne d’une liste de nombres.')],
    fil: 'Du tableau au nombre qui résume : trier, représenter et calculer pour comprendre une série de données.',
    ex2: 'Au collège : trois notes 12, 15 et 18. Moyenne : (12 + 15 + 18) ÷ 3 = 15.',
    ex1: 'Au CAP : on range 36 saisons d’une série dans un tableau, on les regroupe en classes, on calcule des fréquences, on trace un diagramme circulaire et on interprète une moyenne de 13,055 millions d’entrées par mois.',
    reste: ['Calculer une moyenne : somme ÷ nombre de valeurs.', 'Lire un tableau et un diagramme.', 'Écrire une proportion en pourcentage.'],
    change: ['On regroupe les données en classes, notées avec des intervalles [a ; b].', 'On traite de grandes séries, avec la calculatrice ou un tableur.', 'On construit soi-même un diagramme circulaire (calcul des angles) et on l’interprète.'],
    pourquoi: 'Résumer un grand nombre de relevés (ventes, pièces, durées) en quelques nombres et un graphique, pour décider.',
    prog: ['Recueillir et organiser des données ; regrouper par classes', 'Calculer un effectif total, des fréquences', 'Lire, interpréter et représenter un diagramme en bâtons ou circulaire', 'Calculer une moyenne (mentalement dans des cas simples, avec calculatrice ou tableur sinon)'],
    reac: ['Pourcentages simples : 10 %, 25 %, 50 %.', 'Divisions et opérations avec des décimaux.', 'Moyenne de deux ou trois nombres simples.'],
    vig: ['La fréquence se calcule avec l’effectif total, pas avec le plus grand effectif.', 'Les classes ne se chevauchent pas : une valeur dans une seule classe.', 'La moyenne avec les centres de classes et l’histogramme ne sont pas des attendus du programme.', 'Axe des effectifs gradué à partir de 0.'] }

  ,c2: { de: [d('Collège', 'Probabilités', 'tu as calculé la probabilité d’un événement simple, comme obtenir un 6 avec un dé.'), d('Collège', 'Fréquences et pourcentages', 'tu as calculé une fréquence et écrit une proportion en pourcentage.')],
    fil: 'Du hasard aux nombres : compter les issues, mesurer une chance entre 0 et 1, et constater que les fréquences se stabilisent.',
    ex2: 'Au collège : un dé à 6 faces. La probabilité d’obtenir 6 est 1/6.',
    ex1: 'Au CAP : un dé à 20 faces et une simulation de 5 000 lancers montrent la stabilisation de la fréquence de « 20 » vers 0,05 ; on compare avec le Loto (1 chance sur 19 068 840) et on dénombre les 36 issues de deux dés.',
    reste: ['Probabilité = issues favorables ÷ issues possibles.', 'Une probabilité est comprise entre 0 et 1.', 'Écrire un nombre en fraction, en décimal et en pourcentage.'],
    change: ['On observe la fluctuation et la stabilisation des fréquences avec une simulation.', 'On utilise l’événement contraire : P(non A) = 1 − P(A).', 'On dénombre les issues de deux épreuves avec un tableau.'],
    pourquoi: 'Comprendre les jeux de hasard et les risques : évaluer une chance, comparer des fréquences observées à une probabilité, repérer un raisonnement faux.',
    prog: ['Expérience aléatoire, ensemble des issues possibles, événement', 'Fluctuation d’une fréquence sur des échantillons de taille n fixée ; stabilisation vers la probabilité quand n augmente (simulation fournie)', 'Calculer des probabilités dans des cas simples : événements impossible, certain, contraire', 'Expérience à une ou deux épreuves indépendantes (tableau de dénombrement)'],
    reac: ['Fractions : simplifier 6/36, 3/6.', 'Pourcentages simples : 10 %, 25 %, 50 %.', 'Décimaux : 1 − 0,35.'],
    vig: ['La formule favorables ÷ possibles suppose des issues de même chance (dé équilibré, tirage au hasard).', 'Avec deux dés, les sommes 2 à 12 n’ont pas la même probabilité : on compte les cases du tableau.', 'Les tableaux à double entrée sont fournis, éventuellement déjà partiellement complétés (programme).', 'Le hasard n’a pas de mémoire.'] }
  ,c3: { de: [d('Collège', 'Proportionnalité', 'tu as complété un tableau de proportionnalité et calculé un prix à partir du prix d’une unité.'), d('Collège', 'Vitesse', 'tu as calculé une vitesse moyenne et converti des unités simples.')],
    fil: 'Reconnaître, calculer, contrôler : un coefficient pour passer d’une ligne à l’autre, et la prudence de vérifier que la situation est bien proportionnelle.',
    ex2: 'Au collège : 3 cahiers coûtent 6 €. 5 cahiers coûtent 5 × 2 = 10 €.',
    ex1: 'Au CAP : on commence par tester la proportionnalité avec les quotients (le temps des 100 m de Bolt ne l’est pas), puis on complète des tableaux (recette, places de cinéma, blocs de fer) et on convertit une vitesse en km/h.',
    reste: ['Le coefficient de proportionnalité et le passage par l’unité.', 'Compléter un tableau de proportionnalité.'],
    change: ['On teste d’abord la proportionnalité avec les quotients : on rencontre des situations qui ne le sont pas.', 'On utilise le produit en croix comme méthode de contrôle.', 'On travaille avec des unités différentes (cL et L, m/s et km/h).'],
    pourquoi: 'Adapter une quantité (recette, dosage, peinture), calculer un prix ou une durée, convertir une vitesse.',
    prog: ['Reconnaître que deux suites de nombres sont proportionnelles', 'Calculer une quatrième proportionnelle', 'Trouver le coefficient de proportionnalité et compléter un tableau', 'Traiter des problèmes relatifs à deux suites proportionnelles'],
    reac: ['Tables de multiplication.', 'Divisions par 2, 3, 4, 5 et 10.', 'Conversions : cL et L, m et km, m/s et km/h (× 3,6).'],
    vig: ['Il est important de présenter des situations de non-proportionnalité (programme).', 'Les calculs commerciaux ou financiers sont des exemples : toutes les informations nécessaires sont fournies.', 'Une vitesse moyenne n’est pas la vitesse à chaque instant.', 'Le produit en croix sert de contrôle ; le coefficient et le passage par l’unité donnent du sens.'] }
}
Object.assign(module.exports, require('./pont_x')(d));
