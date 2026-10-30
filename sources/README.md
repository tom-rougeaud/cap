# Sources de « Maths · CAP » (manuel PDF + appli)

Ces fichiers fabriquent le manuel de mathématiques de CAP (version élève et version professeur), les PDF par chapitre, les fiches de révision, les trois CCF blancs et l’appli publiée dans le dépôt `cap`.
Programme : mathématiques des classes préparant au CAP (BOEN spécial n° 5 du 11 avril 2019) ; évaluation par contrôle en cours de formation (CCF) : 45 minutes, sur 10 points, une partie « automatismes » sans calculatrice et une partie « situations professionnelles » avec calculatrice.
Tous les résultats sont calculés et contrôlés par programme (`chk`) : une erreur de calcul arrête la construction.

## Organisation
- `content/` : les chapitres (`c1.js` … `c10.js`), le glossaire visuel (`gl_c1.js` …), les évaluations sur 10 (`evals3.js`), les CCF blancs (`ccf3.js`), « Ce que tu sais déjà » (`pont3.js`), les métiers (`metiers3.js`), les dessins et les données réelles (`sk3.js`, `kit3e.js`), les corrigés détaillés de la version professeur (`det3.js`) ; `index.js` charge et vérifie le tout.
- `shared/` : `train.js` (moteur des exercices), `t1.js` … `t10.js` (documents de départ et exercices à support visuel, communs au manuel et à l’appli), `pie.js` (diagrammes circulaires et en bâtons), `g1.js` (graphiques avec lignes de lecture), `auto3.js` (automatismes).
- `lib/` : scènes au trait, pagination A4 (`paginate.js`), `svgfit.js` (aucune étiquette ne se superpose à un trait ou à un autre texte), couverture, QR codes (`qr.json`, vers `tom-rougeaud.github.io/cap/`), KaTeX.
- `app/` : l’appli (`app3.js`, `app3.css`, `widgets.js` pour les simulateurs « Je manipule »).
- `pwa/` : installation sur l’écran d’accueil (`pwa.js`, `sw.js`, `make-pwa.py` qui fabrique manifeste et icônes).
- `style/` : charte du manuel et polices embarquées. `notice/` : la notice d’installation.

## Une notion, une page
🔎 Je découvre → 🧭 La méthode (étapes numérotées, reprises sur le dessin) → ✅ La solution → 📌 Je retiens et ⚠️ Attention → ✏️ À moi. Chaque chapitre : un point de départ, la leçon, des méthodes (un exercice résolu, un à compléter), 9 exercices (courant, 🌱 guidé, 🚀 défi), 5 problèmes, une fiche de révision, une évaluation au format du CCF.

## Lisibilité des schémas
Tous les graphiques portent leurs valeurs et des lignes de lecture ; les diagrammes circulaires ont des couleurs contrastées et des frontières noires ; un contrôle automatique repère les étiquettes qui se superposent (`lib/svgfit.js`).

## Construire
Prérequis : Node.js 18 ou plus, Python 3 avec `playwright` et `pypdf`, un Chromium ; `npm install` (KaTeX).

```
node test-train.js                     # documents de départ, exercices visuels et automatismes
node lint3.js                          # contrôles pédagogiques (phrases, consignes, mots interdits, barèmes, supports)
python3 make3.py                       # manuel élève + professeur + PDF par chapitre + fiches + CCF blancs → build/
node build-app3.js ../cap/index.html   # l’appli en un seul fichier
python3 pwa/make-pwa.py ../cap "Maths · CAP" "Maths CAP" "#E9F797" "#1D2240" "#E9F797"   # manifeste, service worker, icônes
python3 test-app3.py "$PWD/../cap/index.html"   # test de bout en bout (ordinateur et téléphone)
```

La version professeur (`build/maths-cap-professeur.pdf`) n’est pas publiée.

Données réelles : voir la page « À propos » de l’appli (sources et date de consultation). Les entreprises, clubs et jeux des exercices inventés sont signalés « (fictif) ».

Tom Rougeaud · licence CC BY-NC 4.0.
