/* Notice d’installation (PDF A4) — appli et manuel « 3ème Série Pro ». */
'use strict';
const fs = require('fs'), path = require('path');
const HERE = path.join(__dirname, '..');
const FONTS = fs.readFileSync(path.join(HERE, 'style', 'fonts.css'), 'utf8');
const RES = k => { try { return JSON.parse(fs.readFileSync(path.join(HERE, 'build', k + '.result.json'), 'utf8')).pages; } catch (e) { return '…'; } };
const QR = JSON.parse(fs.readFileSync(path.join(HERE, 'lib', 'qr.json'), 'utf8'));
const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Notice d’installation · Maths · CAP</title><style>${FONTS}
@page{size:A4;margin:13mm 14mm 14mm}
*{box-sizing:border-box}
body{font-family:'Nunito Sans','Noto Color Emoji','DejaVu Sans',sans-serif;font-size:9.4pt;line-height:1.3;color:#1D2240;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,.k,.tag,th{font-family:'Outfit','Noto Color Emoji','DejaVu Sans',sans-serif}
.hd{display:grid;grid-template-columns:auto 1fr 34mm;gap:5mm;align-items:center;background:#E9F797;color:#1D2240;border-radius:6mm;padding:5mm 6mm;position:relative;overflow:hidden}
.hd::after{content:"";position:absolute;right:-18mm;top:-22mm;width:60mm;height:60mm;border-radius:50%;background:#FFF5B8}
.hd>*{position:relative;z-index:1}
.sig{display:grid;place-items:center;width:17mm;height:17mm;border-radius:4.5mm;background:#1D2240;color:#E9F797;font:800 28pt 'Outfit'}
.k{font-weight:800;font-size:8.6pt;letter-spacing:.08em;text-transform:uppercase;color:#6B4A00;margin:0}
h1{margin:.5mm 0 1mm;font-size:21pt;line-height:1.05}
.hd p{margin:0}
.qr{background:#fff;border-radius:3mm;padding:1.6mm;text-align:center;color:#4F5E00;font:800 7pt 'Outfit'}.qr svg{width:100%;display:block}
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
<div class="hd"><span class="sig">Σ</span><div><p class="k">Notice d’installation · octobre 2026</p><h1>Maths · CAP</h1><p>L’appli en ligne et le manuel PDF de mathématiques pour le CAP : 9 chapitres, 2 CCF blancs</p></div><div class="qr">${QR.home.svg}L’appli</div></div>

<h2><b>1</b>Ce qui est en ligne</h2>
<div class="box"><table><tr><th style="width:30%">Élément</th><th>Adresse</th></tr>
<tr><td>📱 L’appli (9 chapitres + 2 CCF blancs)</td><td><code>https://tom-rougeaud.github.io/cap/</code></td></tr>
<tr><td>📘 Le manuel élève (PDF, ${RES('eleve')} pages)</td><td><code>…/cap/pdf/maths-cap.pdf</code> · le bouton « Le manuel PDF » de l’appli y renvoie.</td></tr>
<tr><td>📄 Un PDF par chapitre, et les CCF blancs</td><td><code>…/cap/pdf/chapitres/</code> : <code>maths-cap-chapitre-1.pdf</code> à <code>-9.pdf</code>, et <code>maths-cap-ccf-blancs.pdf</code>.</td></tr>
<tr><td>🎓 Les CCF blancs dans l’appli</td><td><code>…/cap/#/ccf</code> : 2 sujets sur 10, chrono de 45 minutes, correction automatique des réponses chiffrées.</td></tr>
<tr><td>🔗 Ce que tu sais déjà</td><td><code>…/cap/#/college</code> : pour chaque chapitre, ce qui vient du collège et ce qui est nouveau au CAP.</td></tr>
<tr><td>🏠 Autres niveaux (dépôts <code>3eme</code> et <code>mcv</code>)</td><td><b>Séparés</b> : le CAP a son propre dépôt <code>cap</code>.</td></tr></table></div>

<h2><b>2</b>Dans le dépôt GitHub</h2>
<div class="box"><p>Dépôt <b>séparé</b> <code>tom-rougeaud/cap</code> (GitHub Pages sur la branche <code>main</code>, à la racine) :</p>
<ul><li><code>index.html</code> : l’appli, en un seul fichier (aucune ressource externe, aucune police en ligne, aucun traceur) ; <code>manifest.webmanifest</code>, <code>sw.js</code> et les icônes : l’installation sur l’écran d’accueil.</li>
<li><code>pdf/maths-cap.pdf</code> : le manuel, version élève ; <code>pdf/chapitres/</code> : les 9 chapitres et les CCF blancs.</li>
<li><code>sources/</code> : les fichiers qui produisent le manuel et l’appli (Node + Playwright).</li></ul>
<p><b>À faire une seule fois</b> : dans le dépôt, <i>Settings → Pages</i>, choisir la branche <code>main</code>, dossier <code>/ (root)</code>. L’adresse de l’appli apparaît alors au bout d’une minute.</p>
<p><b>Supabase</b> : rien à changer, l’appli ne s’y connecte pas. <b>Version professeur</b> : jointe à la conversation seulement, <b>ne la déposez pas sur GitHub</b>.</p></div>

<h2><b>3</b>Installer l’appli sur l’écran d’accueil</h2>
<div class="box"><ul><li><b>Android, Chrome ou Edge</b> : une bannière « Installer l’appli » apparaît quelques secondes après l’ouverture (sinon, menu ⋮ → « Installer l’application »).</li>
<li><b>iPhone et iPad, Safari</b> : appuyer sur <b>Partager</b> (le carré avec une flèche), puis <b>« Sur l’écran d’accueil »</b>. La bannière de l’appli rappelle ces deux gestes.</li>
<li><b>Ordinateur</b> : icône « Installer » dans la barre d’adresse de Chrome ou d’Edge.</li>
<li>Une fois installée, l’appli s’ouvre sans réseau. Elle ne collecte rien : la progression reste sur l’appareil.</li></ul></div>

<h2><b>4</b>Programme et organisation d’un chapitre</h2>
<div class="box"><ul>
<li><b>Programme de mathématiques des classes préparant au CAP</b> (BOEN spécial n° 5 du 11 avril 2019) : statistique et probabilités, algèbre et analyse, nombres et calculs, géométrie. Les 5 compétences de la démarche scientifique : s’approprier, analyser, réaliser, valider, communiquer.</li>
<li><b>Une notion, une page</b> : 🔎 Je découvre (une situation de pop culture ou de métier) → 🧭 La méthode (3 ou 4 étapes numérotées, reprises sur le dessin) → ✅ La solution → 📌 Je retiens et ⚠️ Attention → ✏️ À moi (2 questions).</li>
<li><b>✅ Je fais le point</b> : le bilan « je sais faire » relié aux exercices, puis <b>⚡ 10 automatismes</b> sans calculatrice. Dans l’appli, ces 10 questions changent à chaque tirage.</li>
<li><b>🔧 Je m’entraîne à la mécanique</b> : quatre petits calculs sans contexte par notion, pour automatiser les gestes. <b>Exercices</b> à support visuel, un <b>problème « vers le CCF »</b> par chapitre ; dans l’appli, chaque exercice existe aussi en 🌱 guidé et en 🚀 défi, et les nombres changent à chaque essai.</li>
<li><b>Un métier par chapitre</b>, avec ses formations.</li></ul></div>

<h2><b>5</b>Le format du CCF</h2>
<div class="box y"><ul><li>Chaque chapitre se termine par une évaluation <b>sur 10</b>, au format du CCF : 3 automatismes sans calculatrice (3 points), 2 exercices de situations professionnelles avec la calculatrice (6 points), 1 point de rédaction.</li>
<li>Après le chapitre 9, <b>deux CCF blancs complets</b> de 45 minutes : A « La salle d’arcade » · B « Le magasin de jeux ». Corrigés détaillés et barèmes dans la version professeur.</li>
<li>Dans l’appli : chrono (compte à rebours), correction automatique des réponses chiffrées, auto-évaluation de la rédaction, meilleure note conservée.</li></ul></div>

<h2><b>6</b>Les 9 chapitres et leurs simulateurs (« Je manipule »)</h2>
<div class="box"><table><tr><th style="width:34%">Chapitre</th><th>Simulateur et défi</th></tr>
<tr><td>1 Statistique à une variable</td><td>Du tableau au diagramme · défi : 20 visiteurs et une moyenne de 3 parties</td></tr>
<tr><td>2 Probabilités</td><td>Simulation d’un dé à 20 faces · défi : fréquence à 0,03 près de la probabilité</td></tr>
<tr><td>3 Proportionnalité</td><td>Proportionnel ou pas ? · défi : 8 places pour 60 €</td></tr>
<tr><td>4 Pourcentages et échelles</td><td>Du prix de départ au taux d’évolution · défi : une hausse de 25 %</td></tr>
<tr><td>5 Équations et formules</td><td>Combien de séances pour mon budget ? · défi : exactement 10 séances</td></tr>
<tr><td>6 Fonctions et graphiques</td><td>Le saut d’un personnage de jeu vidéo, avec lignes de lecture · défi : la hauteur maximale</td></tr>
<tr><td>7 Fonctions linéaires et affines</td><td>Deux formules de séances de cinéma · défi : le nombre de séances où les prix sont égaux</td></tr>
<tr><td>8 Calculs commerciaux</td><td>De la remise au total TTC · défi : un total de 76,80 € TTC</td></tr>
<tr><td>9 Périmètres, aires et volumes</td><td>La contenance d’un gobelet · défi : environ 500 mL</td></tr></table>
<p class="small">Chaque chapitre a 6 onglets : Départ (scène, document à toucher, « Ce que tu sais déjà »), Leçon, Méthodes (exercices résolus et simulateur), S’entraîner (10 automatismes, calculs de mécanique, exercices qui changent à chaque essai, indices, erreurs fréquentes expliquées), Problèmes, S’évaluer (sur 10).</p></div>

<h2><b>7</b>Données personnelles et utilisation</h2>
<div class="box g"><ul><li>Aucun compte, aucun cookie, aucun traceur, aucune police ni script externe. La progression reste dans le navigateur, sous les clés <code>mcvcap.v1.progression</code> et <code>mcvcap.v1.preferences</code>, distinctes des autres niveaux.</li><li>Export, import et effacement depuis « Mes données ». Une fois ouverte, l’appli fonctionne sans réseau.</li></ul></div>

<h2><b>8</b>Les manuels PDF</h2>
<div class="box"><ul><li><b>Version élève</b> (${RES('eleve')} pages, 120 au plus) : couverture, « Comment ça marche », les 5 compétences et les consignes (une seule page), sommaire, « Ce que tu sais déjà », 9 chapitres, les 2 CCF blancs, les réponses de « Je m’entraîne », le glossaire visuel. Un rappel au début indique que les chiffres sans source sont inventés.</li>
<li><b>Version professeur</b> (${RES('calque')} pages) : mêmes pages que le manuel élève, réponses en rouge, puis annexes (détail des calculs, compétences, passation du CCF, programme), barèmes des CCF blancs. <b>Ne pas la déposer sur GitHub.</b></li></ul></div>

<h2><b>9</b>Ce qui a été vérifié, et ce qui ne l’a pas été</h2>
<div class="box"><table><tr><th>Vérification</th><th>Résultat</th></tr>
<tr><td>Nombres des leçons, exercices, évaluations et CCF blancs recalculés par programme ; barèmes vérifiés (10 points)</td><td><span class="tag">OK</span></td></tr>
<tr><td>Exercices visuels (178 400 tirages), points de départ, 36 séries de calculs de mécanique (216 000 questions) : aucune bonne réponse refusée, aucune fausse réponse acceptée ; une valeur exacte n’est acceptée qu’exacte, une valeur arrondie seulement si l’énoncé annonce l’arrondi</td><td><span class="tag">0 erreur</span></td></tr>
<tr><td>Test automatique de l’appli : 9 chapitres × 6 onglets et 2 CCF blancs, sur ordinateur (1 280 px) et téléphone (375 px) ; invite d’installation</td><td><span class="tag">OK</span></td></tr>
<tr><td>Contrôle visuel des pages du manuel : figures, étiquettes, formules non coupées, QR code séparé du texte</td><td><span class="tag">OK</span></td></tr>
<tr><td>Pages du manuel élève et du manuel professeur identiques bloc par bloc (174 blocs comparés) ; énoncés de l’appli (données du manuel) comparés au PDF élève (642 énoncés)</td><td><span class="tag">0 écart</span></td></tr>
<tr><td>Navigateurs : Chromium seulement ; Safari, Firefox, iPad et tablettes Android non testés ; installation sur l’écran d’accueil testée seulement en simulation</td><td><span class="tag mid">à vérifier</span></td></tr></table></div>

<div class="box"><p>Données réelles : Wikipédia (épisodes des Simpson, statue de l’Unicorn Gundam), CNC (fréquentation et top 2025), JeChange et centre d’aide Netflix (tarifs), Fiducial (taux de TVA), IFAB (lois du jeu), et les autres sources indiquées sous chaque document. Les entreprises, clubs et jeux des exercices sont inventés.</p>
<p>Tom Rougeaud · licence <b>CC BY-NC 4.0</b>.</p></div>
</body></html>`;
fs.writeFileSync(path.join(__dirname, 'notice.html'), html);
