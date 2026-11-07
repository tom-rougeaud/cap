/* Manuel professeur calqué : annexes de fin de manuel (aucune page du manuel élève n’est touchée)
   1. Les compétences en détail   2. Passation du CCF   3. Référentiel et capacités du programme de CAP.
   Les repères de lecture (degrés, protocole) sont ceux de l’auteur ; les textes officiels ne sont pas reproduits. */
'use strict';
module.exports = function ({ DATA, COMPS, CPS, ORD, esc }) {
  const f1 = x => String(Math.round(x * 10) / 10).replace('.', ',');
  const head = (k, h, p) => `<div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">${k}</div><h2>${h}</h2>${p}</div></div>`;
  const DEF = {
    app: 'Rechercher, extraire et organiser l’information utile d’un document ou d’un énoncé ; traduire les informations avec ses mots.',
    ana: 'Choisir une méthode, un outil, des lois pertinentes ; raisonner pour décider quel calcul répond à la question.',
    rea: 'Mettre en œuvre la démarche : calculer, représenter, utiliser un modèle, avec les unités et l’arrondi demandés.',
    val: 'Contrôler qu’un résultat est vraisemblable, le critiquer, argumenter pour justifier une réponse.',
    com: 'Rendre compte à l’écrit comme à l’oral : expliquer sa démarche, répondre par une phrase complète avec le résultat et l’unité.'
  };
  const DEG = {
    app: ['Reste devant l’énoncé sans rien noter ; ne repère pas les données utiles.', 'Relève des données mais en oublie ou en prend d’inutiles ; ne démarre qu’avec de l’aide.', 'Repère les données utiles et la question posée.', 'Repère les données utiles, ignore les données inutiles et reformule la question avec ses mots.'],
    ana: ['Ne choisit aucun calcul.', 'Choisit une opération au hasard, ou recopie un modèle déjà vu sans le justifier.', 'Choisit le bon calcul ou la bonne formule dans une situation proche de celles du manuel.', 'Choisit et justifie son calcul dans une situation nouvelle.'],
    rea: ['Calculs absents ou faux, même simples.', 'Calculs justes mais sans unité, ou erreurs de signe, de priorité ou d’arrondi.', 'Calculs justes, avec l’unité et l’arrondi demandés.', 'Calculs justes et contrôlés (ordre de grandeur, calcul inverse), avec un outil choisi à bon escient.'],
    val: ['Donne un résultat sans aucun contrôle.', 'Contrôle par « ça me semble bien » ou par un seul exemple.', 'Vérifie la vraisemblance avec un calcul ou un ordre de grandeur.', 'Vérifie, corrige son erreur et argumente avec un calcul.'],
    com: ['Aucune phrase de réponse.', 'Répond par un nombre seul ou par une phrase incomplète.', 'Répond par une phrase complète avec le résultat et l’unité.', 'Rédige une démarche claire, dans l’ordre, qu’un lecteur suit sans explication orale.']
  };
  const per = c => { const o = {}; [...c.eval.auto, ...c.eval.exos.flatMap(x => x.qs)].forEach(q => { o[q.comp] = (o[q.comp] || 0) + q.pts; }); o.com = (o.com || 0) + (c.eval.redac || 0); return o; };
  const PER = DATA.map(per), TOT = {}; ORD.forEach(o => { TOT[o] = PER.reduce((a, p) => a + (p[o] || 0), 0); });
  const row = (a, b) => `<tr><th>${a}</th><td>${b}</td></tr>`;

  const acomp = `<section class="sec" data-key="acomp" data-recto="1" data-run="Annexe · les compétences en détail · version professeur" data-col="brand">`
    + head('Annexe · version professeur', '🧩 Les compétences en détail', '<p>Les cinq compétences sont évaluées sur quatre degrés de maîtrise, dans les évaluations de chapitre et les CCF blancs. Cette page donne, pour chacune, ce que l’on observe à chaque degré.</p>')
    + COMPS.map(([k]) => `<div class="blk acp c-brand"><div class="acp-h"><span class="cp cp-${k}">${CPS[k]}</span><p>${DEF[k]}</p></div><table class="acp-t"><tr><th>Maîtrise insuffisante</th><th>Maîtrise fragile</th><th>Maîtrise satisfaisante</th><th>Très bonne maîtrise</th></tr><tr>${DEG[k].map(x => `<td>${x}</td>`).join('')}</tr></table></div>`).join('')
    + `<div class="blk acs c-brand"><h3>Les points par compétence, évaluation par évaluation</h3><table class="tbl acs-t"><tr><th>Chapitre</th>${ORD.map(o => `<th><span class="cp cp-${o}">${CPS[o]}</span></th>`).join('')}<th>Total</th></tr>`
    + DATA.map((c, i) => `<tr><td class="tl"><b>${c.n}</b> · ${esc(c.titre)}</td>${ORD.map(o => `<td>${PER[i][o] ? f1(PER[i][o]) : '·'}</td>`).join('')}<td><b>${f1(ORD.reduce((a, o) => a + (PER[i][o] || 0), 0))}</b></td></tr>`).join('')
    + `<tr class="tot"><td class="tl"><b>Sur les ${DATA.length} évaluations</b></td>${ORD.map(o => `<td><b>${f1(TOT[o])}</b></td>`).join('')}<td><b>${f1(ORD.reduce((a, o) => a + TOT[o], 0))}</b></td></tr></table></div>`
    + `</section>`;

  const adnb = `<section class="sec" data-key="adnb" data-recto="0" data-run="Annexe · passation du CCF · version professeur" data-col="brand">`
    + head('Annexe · version professeur', '🎓 Passation du CCF', '<p>Le contrôle en cours de formation (CCF) de mathématiques au CAP : format retenu pour les évaluations de chapitre et les CCF blancs de ce manuel.</p>')
    + `<div class="blk apr c-brand"><h3>Le format utilisé dans ce manuel</h3><table class="apr-t">`
    + row('Durée et note', '45 minutes, notées sur 10 points.')
    + row('Partie 1 · automatismes', '3 points · 10 minutes · <b>sans calculatrice</b> · trois questions courtes, réponses sans justification.')
    + row('Partie 2 · situations professionnelles', '6 points · 35 minutes · <b>calculatrice autorisée</b> · deux exercices indépendants, réponses justifiées.')
    + row('Clarté de la rédaction', '1 point : phrases complètes, calculs posés, unités.')
    + row('Compétences', 'S’approprier, analyser, réaliser, valider, communiquer : chaque question porte la pastille de sa compétence et le barème est reporté dans la grille en tête de la feuille.')
    + `</table><p class="small"><b>À vérifier</b> · ce format est celui que l’auteur a retenu à partir du programme de mathématiques des classes préparant au CAP (BOEN spécial n° 5 du 11 avril 2019) ; les modalités exactes de l’évaluation certificative (nombre de situations, dates) sont fixées par le règlement d’examen de chaque spécialité et par l’établissement.</p></div>`
    + `<div class="blk apr c-brand"><h3>Faire passer un CCF blanc, pas à pas <small>(repères de l’auteur)</small></h3><ol class="apr-o">`
    + `<li><b>Avant</b> · imprimer le sujet (pages <span data-pageof="dnb">…</span> et suivantes du manuel), rappeler le matériel : stylo, règle, équerre ; les calculatrices restent rangées pour la partie 1.</li>`
    + `<li><b>De 0 à 10 minutes</b> · partie 1, automatismes, sans calculatrice et sans justification.</li>`
    + `<li><b>De 10 à 45 minutes</b> · partie 2. Rappeler que les deux exercices sont indépendants et qu’une démarche même inachevée rapporte des points.</li>`
    + `<li><b>Correction</b> · réponses détaillées dans l’annexe « Détail des calculs » (p. <span data-pageof="corr">…</span>) ; on coche pour chaque compétence l’un des quatre degrés de la grille.</li>`
    + `<li><b>Adapter</b> · temps et aménagements selon le PAP ou le PPS de l’élève ; pour les élèves allophones, lire la consigne à voix haute et vérifier le lexique avant de commencer.</li></ol></div>`
    + `</section>`;

  const TH = { c1: 'Statistique et probabilités', c2: 'Statistique et probabilités', c3: 'Nombres et calculs · Proportionnalité', c4: 'Nombres et calculs · Proportionnalité', c5: 'Algèbre et analyse', c6: 'Algèbre et analyse · Fonctions', c7: 'Algèbre et analyse · Fonctions', c8: 'Calculs commerciaux et financiers ➕ (groupement 2)', c9: 'Géométrie ➕ (groupement 1)' };
  const aref = `<section class="sec" data-key="aref" data-recto="0" data-run="Annexe · programme et capacités · version professeur" data-col="brand">`
    + head('Annexe · version professeur', '📚 Programme et capacités du CAP', '<p>Le manuel suit le programme de mathématiques des classes préparant au CAP. Cette annexe relie chaque chapitre à son domaine, puis donne, chapitre par chapitre, les appuis du collège, les automatismes à réactiver et les points de vigilance.</p>')
    + `<div class="blk apr c-brand"><h3>Le texte de référence</h3><table class="apr-t">`
    + row('Programme', 'Programme de mathématiques des classes préparant au CAP : Bulletin officiel de l’éducation nationale, numéro spécial n° 5 du 11 avril 2019.')
    + row('Les cinq compétences', 'S’approprier · Analyser · Réaliser · Valider · Communiquer (annexe « Les compétences en détail », p. <span data-pageof="acomp">…</span>).')
    + row('Le signe ➕', 'Domaine propre à un groupement de spécialités ou complément du programme.')
    + `</table></div>`
    + `<div class="blk apr c-brand"><h3>Les chapitres et les domaines du programme</h3><table class="tbl apr-m"><tr><th>Chapitre</th><th>Domaine</th><th>Page</th></tr>${DATA.map(c => `<tr><td class="tl"><b>${c.n}</b> · ${esc(c.titre)}</td><td class="tl">${TH[c.id] || ''}</td><td><span data-pageof="${c.id}">…</span></td></tr>`).join('')}</table></div>`
    + DATA.map(c => `<div class="blk pontp c-${c.col}"><h3><span class="pontl-n">${c.n}</span>${esc(c.titre)}</h3><p class="pontp-d"><b>Appuis</b> · ${c.pont.de.map(x => `${x.niv} « ${esc(x.titre)} »`).join(' · ')}</p><table class="pontp-t"><tr><th>Capacités du programme de CAP</th><th>À réactiver</th><th>Vigilance</th></tr><tr><td><ul>${c.pont.prog.map(x => `<li>${x}</li>`).join('')}</ul><p class="pontp-pl"><b>Parties</b> · ${c.parties.map((p, i) => `${'ABCDE'[i]}. ${p.t}`).join(' · ')}</p></td><td><ul>${c.pont.reac.map(x => `<li>${x}</li>`).join('')}</ul></td><td><ul>${c.pont.vig.map(x => `<li>${x}</li>`).join('')}</ul></td></tr></table></div>`).join('')
    + `</section>`;
  return { acomp, adnb, aref };
};
