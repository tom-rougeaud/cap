# Sources de « Maths · CAP » (manuel PDF + appli)

Ces fichiers fabriquent le manuel de mathématiques de CAP (version élève et version professeur), les PDF par chapitre, les fiches de révision, les trois CCF blancs et l’appli publiée dans le dépôt `cap`.
Programme : mathématiques des classes préparant au CAP (BOEN spécial n° 5 du 11 avril 2019) ; évaluation par contrôle en cours de formation (CCF) : 45 minutes, sur 10 points, une partie « automatismes » sans calculatrice et une partie « situations professionnelles » avec calculatrice.
Tous les résultats sont calculés et contrôlés par programme (`chk`) : une erreur de calcul arrête la construction.

## Organisation
- `content/` : les chapitres (`c1.js` … `c9.js` ; `c10.js` — Pythagore, Thalès, trigonométrie — n’est plus dans le manuel), le glossaire visuel (`gl_c1.js` …), les évaluations sur 10 (`evals3.js`), les deux CCF blancs (`ccf3.js`), les tolérances des réponses numériques (`tolfix.js`), « Ce que tu sais déjà » (`pont3.js`), les métiers (`metiers3.js`), les dessins et les données réelles (`sk3.js`, `kit3e.js`), les corrigés détaillés de la version professeur (`det3.js`) ; `index.js` charge et vérifie le tout.
- `shared/` : `train.js` (moteur des exercices), `t1.js` … `t10.js` (documents de départ et exercices à support visuel, communs au manuel et à l’appli), `pie.js` (diagrammes circulaires et en bâtons), `g1.js` (graphiques avec lignes de lecture), `auto3.js` (automatismes).
- `lib/` : scènes au trait, pagination A4 (`paginate.js`), `svgfit.js` (aucune étiquette ne se superpose à un trait ou à un autre texte), couverture, QR codes (`qr.json`, vers `tom-rougeaud.github.io/cap/`), KaTeX.
- `app/` : l’appli (`app3.js`, `app3.css`, `widgets.js` pour les simulateurs « Je manipule »).
- `pwa/` : installation sur l’écran d’accueil (`pwa.js`, `sw.js`, `make-pwa.py` qui fabrique manifeste et icônes).
- `style/` : charte du manuel et polices embarquées. `notice/` : la notice d’installation.

## Une notion, une page
🔎 Je découvre → 🧭 La méthode → ✅ La solution → 📌 Je retiens et ⚠️ Attention → ✏️ À moi, puis 🔧 « Je m’entraîne à la mécanique » (4 calculs sans contexte, `shared/mech.js`). Le manuel tient en 120 pages : 9 chapitres (le chapitre 9, périmètres, aires et volumes, est court), un exercice-guide et des exercices par notion, un seul problème « vers le CCF » par chapitre, une évaluation au format du CCF sur 10, deux CCF blancs, un glossaire de 2 mots par chapitre. L’appli garde les exercices guidés 🌱 et défis 🚀 et tire de nouveaux nombres à chaque essai ; « Données du manuel » redonne ceux du PDF.

## Règle d’exactitude des réponses
Une valeur exacte n’est acceptée qu’exacte ; une valeur arrondie n’existe que si l’énoncé annonce l’arrondi, et n’est acceptée qu’à la demi-unité du rang demandé. Les tolérances ne sont jamais écrites à la main (`tools/audtol.js`, `content/tolfix.js`, `shared/train.js`).

## Version professeur calquée
`make3.py --calque` reconstruit le manuel professeur à partir du même flux que le manuel élève : mêmes pages, réponses en rouge, annexes à la suite. `ref-extract.py` relève la pagination du PDF élève ; `cmp-calque.py` vérifie bloc par bloc que les pages coïncident ; `cmp-app-pdf.py` compare les énoncés de l’appli (données du manuel) au PDF élève.

## Lisibilité des schémas
Tous les graphiques portent leurs valeurs et des lignes de lecture ; les diagrammes circulaires ont des couleurs contrastées et des frontières noires ; un contrôle automatique repère les étiquettes qui se superposent (`lib/svgfit.js`).

## Construire
Prérequis : Node.js 18 ou plus, Python 3 avec `playwright` et `pypdf`, un Chromium ; `npm install` (KaTeX).

```
node tools/chk3.js mcvC                # exercices visuels, points de départ
node tools/chkmech-lvl.js mcvC         # 36 séries de mécanique : bonnes réponses acceptées, fausses refusées
node tools/audtol.js                   # tolérances des évaluations et des CCF blancs
node lint3.js                          # contrôles pédagogiques (phrases, consignes, mots interdits, barèmes, supports)
python3 make3.py --eleve               # manuel élève + PDF par chapitre + CCF blancs + glossaire → build/
python3 ref-extract.py && python3 make3.py --calque && python3 cmp-calque.py   # manuel professeur calqué
node build-app3.js ../index.html   # l’appli en un seul fichier
python3 pwa/make-pwa.py .. "Maths · CAP" "Maths CAP" "#DCEBC8" "#1D2240" "#DCEBC8"   # manifeste, service worker, icônes
python3 test-app3.py "$PWD/../index.html"   # test de bout en bout (ordinateur et téléphone)
```

La version professeur (`build/maths-cap-professeur.pdf`) n’est pas publiée.

Données réelles : voir la page « À propos » de l’appli (sources et date de consultation). Les entreprises, clubs et jeux des exercices sont inventés (un rappel figure au début du manuel).

Tom Rougeaud · licence CC BY-NC 4.0.
