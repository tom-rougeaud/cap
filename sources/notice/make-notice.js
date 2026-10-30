/* Notice d’installation (PDF A4) — appli et manuel « 3ème Série Pro ». */
'use strict';
const fs = require('fs'), path = require('path');
const HERE = path.join(__dirname, '..');
const FONTS = fs.readFileSync(path.join(HERE, 'style', 'fonts.css'), 'utf8');
const RES = k => { try { return JSON.parse(fs.readFileSync(path.join(HERE, 'build', k + '.result.json'), 'utf8')).pages; } catch (e) { return '…'; } };
const QR = JSON.parse(fs.readFileSync(path.join(HERE, 'lib', 'qr.json'), 'utf8'));
const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Notice d’installation · 3ème Série Pro</title><style>${FONTS}
@page{size:A4;margin:13mm 14mm 14mm}
*{box-sizing:border-box}
body{font-family:'Andika','Noto Color Emoji','DejaVu Sans',sans-serif;font-size:9.4pt;line-height:1.3;color:#1D2240;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,.k,.tag,th{font-family:'Inter','Noto Color Emoji','DejaVu Sans',sans-serif}
.hd{display:grid;grid-template-columns:auto 1fr 34mm;gap:5mm;align-items:center;background:#E9F797;color:#1D2240;border-radius:6mm;padding:5mm 6mm;position:relative;overflow:hidden}
.hd::after{content:"";position:absolute;right:-18mm;top:-22mm;width:60mm;height:60mm;border-radius:50%;background:#FFF5B8}
.hd>*{position:relative;z-index:1}
.sig{display:grid;place-items:center;width:17mm;height:17mm;border-radius:4.5mm;background:#1D2240;color:#E9F797;font:800 28pt 'Inter'}
.k{font-weight:800;font-size:8.6pt;letter-spacing:.08em;text-transform:uppercase;color:#6B4A00;margin:0}
h1{margin:.5mm 0 1mm;font-size:21pt;line-height:1.05}
.hd p{margin:0}
.qr{background:#fff;border-radius:3mm;padding:1.6mm;text-align:center;color:#4F5E00;font:800 7pt 'Inter'}.qr svg{width:100%;display:block}
h2{font-size:12pt;color:#4F5E00;margin:3.6mm 0 1.4mm;break-after:avoid;display:flex;align-items:center;gap:2mm}
h2 b{display:inline-grid;place-items:center;width:7mm;height:7mm;border-radius:50%;background:#E9F797;color:#1D2240;font-size:10pt}
.box{border:1.6px solid #D9DEF2;border-radius:4mm;padding:2.2mm 3.6mm;background:#fff}tr,li{break-inside:avoid}
.box.y{background:#FFFBEA;border-color:#F3DA7A}.box.g{background:#EEF9F1;border-color:#BFE6CB}.box.r{background:#FDEEEC;border-color:#F3C3BD}
p{margin:1mm 0}ul{margin:1mm 0;padding-left:5mm}li{margin:.6mm 0}
code{font-family:'DejaVu Sans Mono',monospace;font-size:9pt;background:#F1F3FA;border-radius:1mm;padding:0 1mm}
.two{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
table{width:100%;border-collapse:collapse;font-size:9.6pt}th,td{border:1px solid #D9DEF2;padding:.9mm 2mm;text-align:left;vertical-align:top}th{background:#EEF0FB;font-size:8.8pt}
.tag{display:inline-block;white-space:nowrap;font-weight:800;font-size:8pt;border-radius:99px;padding:.2mm 2.4mm;color:#fff;background:#1E7F45}.tag.no{background:#C2332A}.tag.mid{background:#B05200}
.small{font-size:8.8pt;color:#545B7A}
.pb{break-before:page}
</style></head><body>
<div cla<div class="hd"><span class="sig">Σ</span><div><p class="k">Notice d’installation · octobre 2026</p><h1>3ème Série Pro</h1><p>L’appli en ligne et le manuel PDF de mathématiques pour la 3e Prépa-Métiers, brevet série professionnelle</p></div><div class="qr">${QR.home.svg}L’appli</div></div>

<h2><b>1</b>Ce qui est en ligne</h2>
<div class="box"><table><tr><th style="width:30%">Élément</th><th>Adresse</th></tr>
<tr><td>📱 L’appli (10 chapitres + 3 sujets blancs du brevet)</td><td><code>https://tom-rougeaud.github.io/3eme/</code></td></tr>
<tr><td>📘 Le manuel élève (PDF, ${RES('eleve')} pages)</td><td><code>…/3eme/pdf/maths-3e-serie-pro.pdf</code> · le bouton « Le manuel PDF » de l’appli y renvoie.</td></tr>
<tr><td>📄 Un PDF par chapitre, et les sujets blancs</td><td><code>…/3eme/pdf/chapitres/</code> : <code>maths-3e-serie-pro-chapitre-1.pdf</code> à <code>-10.pdf</code>, et <code>maths-3e-serie-pro-sujets-brevet.pdf</code>.</td></tr>
<tr><td>🎓 Les sujets blancs dans l’appli</td><td><code>…/3eme/#/brevet</code> : 3 sujets sur 20, chrono de 2 heures, correction automatique des réponses chiffrées.</td></tr>
<tr><td>🔗 Ce que tu sais déjà</td><td><code>…/3eme/#/de-4e</code> : pour chaque chapitre, ce qui a été vu au cycle 4 et ce qui est nouveau en 3e.</td></tr>
<tr><td>🏠 Site principal, 2de, 1re, terminale (dépôt <code>mcv</code>)</td><td><b>Inchangés</b> : la 3e a son propre dépôt, séparé de <code>mcv</code>.</td></tr></table></div>

<h2><b>2</b>Dans le dépôt GitHub</h2>
<div class="box"><p>Dépôt <b>séparé</b> <code>tom-rougeaud/3eme</code> (GitHub Pages sur la branche <code>main</code>, à la racine), distinct du dépôt <code>mcv</code> :</p>
<ul><li><code>index.html</code> : l’appli, en un seul fichier (aucune ressource externe, aucune police en ligne, aucun traceur).</li>
<li><code>pdf/maths-3e-serie-pro.pdf</code> : le manuel, version élève ; <code>pdf/chapitres/</code> : les 10 chapitres et les sujets blancs.</li>
<li><code>sources/</code> : les fichiers qui produisent le manuel et l’appli (Node + Playwright).</li></ul>
<p><b>Supabase</b> : rien à changer, l’appli ne s’y connecte pas. <b>Version professeur</b> : jointe à la conversation seulement, <b>ne la déposez pas sur GitHub</b>.</p></div>

<h2><b>3</b>Programme et organisation d’un chapitre</h2>
<div class="box"><ul>
<li><b>Programme du cycle 4</b> (arrêté du 17 juillet 2020, BO n° 31 du 30 juillet 2020), attendus de fin de 3e, et épreuve de mathématiques du brevet série professionnelle (note de service du 2 septembre 2025, BO n° 33 du 4 septembre 2025). Les 6 compétences : chercher, modéliser, représenter, raisonner, calculer, communiquer.</li>
<li><b>Une notion, une page</b> : 🔎 Je découvre (une situation de pop culture) → 🧭 La méthode (3 ou 4 étapes numérotées, reprises sur le dessin) → ✅ La solution de la même situation → 📌 Je retiens et ⚠️ Attention → ✏️ À moi (2 questions). Chaque notion commence en haut de page.</li>
<li><b>✅ Je fais le point</b> : le bilan « je sais faire » relié aux exercices, puis <b>⚡ 10 automatismes du brevet</b> sans calculatrice. Dans l’appli, ces 10 questions changent à chaque tirage.</li>
<li><b>🐱 Je programme</b> : des programmes Scratch dessinés (chapitres 1, 3, 7 et 10), à lire et à modifier.</li>
<li><b>Un métier par chapitre</b> (aucun métier du commerce ou de la vente) avec ses formations : agent logistique, technicien réseaux et fibre, électricien, cuisinier, mécanicien automobile, assistant de gestion, pilote de ligne de production, charpentier, peintre en signalétique, technicien d’usinage.</li></ul></div>

<h2><b>4</b>Le format du brevet</h2>
<div class="box y"><ul><li>Chaque chapitre se termine par une évaluation <b>sur 20</b>, au format du brevet : 6 automatismes sans calculatrice (6 points), des problèmes avec calculatrice (12 points), 2 points de rédaction.</li>
<li>Après le chapitre 10, <b>trois sujets blancs complets</b> sur 20 : partie 1, 9 automatismes (6 points, 20 minutes, sans calculatrice) ; partie 2, 4 exercices (2, 4, 4 et 2 points) ; rédaction (2 points). A « La convention manga » · B « Soirée cinéma et séries » · C « Le tournoi de jeux ». Corrigés détaillés et barèmes dans la version professeur.</li>
<li>Dans l’appli : chrono (compte à rebours), correction automatique des réponses chiffrées, auto-évaluation de la rédaction, meilleure note conservée.</li></ul></div>

<h2><b>5</b>Les 10 chapitres et leurs simulateurs (« Je manipule »)</h2>
<div class="box"><table><tr><th style="width:34%">Chapitre</th><th>Simulateur et défi</th></tr>
<tr><td>1 Nombres entiers et arithmétique</td><td>Diviseurs d’un nombre de cartes · défi : un nombre entre 100 et 120 qui a 12 diviseurs</td></tr>
<tr><td>2 Fractions, puissances, écriture scientifique</td><td>Débit et données (Mbit/s, Go) · défi : environ 1 Go à 5 Mbit/s</td></tr>
<tr><td>3 Calcul littéral et équations</td><td>Résolution de ax + b = cx + d pas à pas · défi : solution x = 4</td></tr>
<tr><td>4 Proportionnalité, pourcentages, grandeurs composées</td><td>Évolution en pourcentage · défi : retrouver la hausse Netflix 5,99 € → 7,99 €</td></tr>
<tr><td>5 Fonctions linéaires et affines</td><td>Deux formules de cinéma, deux droites · défi : même prix pour 4 séances</td></tr>
<tr><td>6 Statistiques</td><td>Moyenne, médiane, étendue d’une liste tapée · défi : moyenne 10 et médiane 8</td></tr>
<tr><td>7 Probabilités</td><td>Simulation de lancers de dé · défi : fréquence à 0,01 près</td></tr>
<tr><td>8 Pythagore et trigonométrie</td><td>Triangle rectangle de la statue de Gundam · défi : un angle de 45°</td></tr>
<tr><td>9 Échelles, agrandissements et Thalès</td><td>Rapport k, aires × k², volumes × k³ · défi : volume × 8</td></tr>
<tr><td>10 Espace, transformations et programmes</td><td>Tortue qui trace un polygone · défi : périmètre 400 pas, 45° à chaque coin</td></tr></table>
<p class="small">Chaque chapitre a 6 onglets : Départ (scène, document à toucher, « Ce que tu sais déjà »), Leçon (les notions en 5 temps), Méthodes (exercices résolus et simulateur), S’entraîner (10 automatismes, 3 exercices qui changent à chaque essai, indices, erreurs fréquentes expliquées, Scratch), Problèmes (dont « vers le brevet » et le métier), S’évaluer (sur 20).</p></div>

<h2><b>6</b>Données personnelles et utilisation</h2>
<div class="box g"><ul><li>Aucun compte, aucun cookie, aucun traceur, aucune police ni script externe. La progression reste dans le navigateur, sous les clés <code>mcv3e.v1.progression</code> et <code>mcv3e.v1.preferences</code>, distinctes des autres niveaux.</li><li>Export, import et effacement depuis « Mes données ». Une fois ouverte, l’appli fonctionne sans réseau ; on peut aussi enregistrer <code>index.html</code> sur un poste.</li></ul></div>

<h2><b>7</b>Les manuels PDF</h2>
<div class="box"><ul><li><b>Version élève</b> (${RES('eleve')} pages) : couverture, « Comment ça marche », les 6 compétences, sommaire, « Ce que tu sais déjà », 10 chapitres, les 3 sujets blancs, les réponses de « Je m’entraîne », le glossaire visuel.</li>
<li><b>Version professeur</b> (${RES('prof')} pages) : réponses en rouge, pages de continuité, corrigé complet avec les barèmes des sujets blancs. <b>Ne pas la déposer sur GitHub.</b></li></ul></div>

<h2><b>8</b>Ce qui a été vérifié, et ce qui ne l’a pas été</h2>
<div class="box"><table><tr><th>Vérification</th><th>Résultat</th></tr>
<tr><td>Nombres des leçons, exercices, évaluations et sujets blancs recalculés par programme ; barèmes vérifiés (20 points)</td><td><span class="tag">OK</span></td></tr>
<tr><td>30 générateurs d’exercices et 10 points de départ : 60 000 tirages ; automatismes : 150 000 questions</td><td><span class="tag">0 erreur</span></td></tr>
<tr><td>Test automatique : 10 chapitres × 6 onglets et 3 sujets blancs, sur ordinateur (1 280 px) et téléphone (375 px)</td><td><span class="tag">OK</span></td></tr>
<tr><td>Contrôle visuel des pages du manuel élève et professeur</td><td><span class="tag">OK</span></td></tr>
<tr><td>Programmes Scratch : dessinés et calculés, mais pas exécutés dans Scratch</td><td><span class="tag mid">à vérifier</span></td></tr>
<tr><td>Navigateurs : Chromium seulement ; Safari, Firefox, iPad et tablettes Android non testés ; lecture à voix haute non testée</td><td><span class="tag mid">à vérifier</span></td></tr></table></div>

<div class="box"><p>Données réelles : Wikipédia (épisodes des Simpson, statue de l’Unicorn Gundam), Shueisha (One Piece, tome 114), The Pokémon Company (chiffres au 31 mars 2026), JeChange et centre d’aide Netflix (tarifs, débits), CNC (fréquentation et top 2025, visa d’Avengers : Endgame), IFAB (lois du jeu). Les entreprises, clubs et jeux des exercices sont fictifs et signalés comme tels.</p>
<p>Tom Rougeaud · licence <b>CC BY-NC 4.0</b>.</p></div>
</body></html>`;
fs.writeFileSync(path.join(__dirname, 'notice.html'), html);

