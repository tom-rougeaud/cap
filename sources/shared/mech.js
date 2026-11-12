/* Maths · CAP — « Je m’entraîne à la mécanique » : quatre petits calculs sans contexte pour chaque notion.
   Commun au manuel (tirage fixe) et à l’appli (nouveau tirage au choix).
   MCVT.mech('c4', 1, seed) → { titre, consigne, items:[{ k, t, a, v?, vs?, tol? }] }
     t : énoncé court ; a : réponse affichée ; v : valeur attendue (fractions et décimaux acceptés) ; vs : plusieurs nombres (ordre libre).
   Règle d’exactitude : une réponse exacte n’est acceptée qu’exacte (tol = 1e-9) ; une réponse arrondie n’existe que si l’énoncé demande l’arrondi
   (sinon la construction s’arrête). Toutes les réponses sont calculées, jamais écrites à la main. */
(function (root) {
  'use strict';
  const MCVT = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { H, L } = MCVT, { fr, rnd, pick, int, shuffle, MC } = H;
  const M = '−';
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const yn = b => b ? 'oui' : 'non';
  const sg = n => (n < 0 ? M : '') + Math.abs(n);
  const sf = (n, d) => { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : n + '/' + d; };
  const ROUND = /arrondi|à l’unité près|au (dixième|centième|millième|centime|degré|entier)|près/i;
  const it = (t, a, v, o) => ({ t, a: String(a), ...(v != null ? (Array.isArray(v) ? { vs: v } : { v }) : {}), ...(o || {}) });
  /* num(t, v, d, u) : réponse numérique à d décimales ; exacte si v n’a pas besoin d’arrondi, sinon l’énoncé doit l’annoncer */
  const num = (t, v, d, u) => {
    const r = rnd(v, d), ex = Math.abs(v - r) < 1e-9;
    if (!ex && !ROUND.test(t)) throw new Error('arrondi non annoncé : ' + t);
    /* standard 2026-11 : un arrondi n’est annoncé que s’il existe */
    if (ex) t = t.replace(/\s*\((arrondie?s? [^)]*|valeur exacte)\)/gi, '').replace(/,\s*arrondie?s? (au|à l’)[^.?]*([.?])/gi, '$2');
    const s = u === '€' ? fr(r, 2) : (d === 0 ? fr(r, 0) : fr(r));
    return it(t, s.replace('-', M) + (u ? ' ' + u : ''), r, { tol: ex ? 1e-9 : 0.5 * Math.pow(10, -d) + 1e-9 });
  };
  const R2 = (R, lo, hi) => int(R, lo, hi);
  const MECH = {};
  const def = (cid, k, titre, consigne, mk) => { MECH[cid + '.' + k] = { titre, consigne, mk }; };
  const eur = x => fr(rnd(x, 2), Number.isInteger(rnd(x, 2)) ? 0 : 2) + ' €';

  /* ======================= c1 · Statistique à une variable ======================= */
  def('c1', 1, 'Effectifs, effectif total et classes', 'L’effectif total est la somme de tous les effectifs. La classe [a ; b] contient tous les nombres x tels que a ≤ x ≤ b.', [
    R => { const e = [R2(R, 2, 9), R2(R, 3, 12), R2(R, 2, 8), R2(R, 1, 6)]; return num(`Les effectifs d’une série sont ${e.join(' ; ')}. Quel est l’effectif total ?`, e.reduce((a, b) => a + b, 0), 0); },
    R => { const e = [R2(R, 3, 9), R2(R, 4, 12), R2(R, 2, 8)], N = e.reduce((a, b) => a + b, 0) + R2(R, 3, 9); return num(`Une série compte ${N} valeurs. Les trois premières valeurs ont pour effectifs ${e.join(', ')}. Quel est l’effectif de la dernière valeur ?`, N - e.reduce((a, b) => a + b, 0), 0); },
    R => { const a = pick(R, [0, 10, 20]), k = int(R, 0, 2), x = a + 10 * k + int(R, 0, 9); return num(`Les classes sont [${a} ; ${a + 9}], [${a + 10} ; ${a + 19}] et [${a + 20} ; ${a + 29}]. Quelle est la plus petite valeur de la classe qui contient ${x} ?`, a + 10 * k, 0); },
    R => { const a = pick(R, [10, 20, 30]), b = a + pick(R, [4, 9]), x = pick(R, [a - 1, a, a + 3, b, b + 1, b + 5]); return it(`La valeur ${x} appartient-elle à la classe [${a} ; ${b}] ? Réponds par oui ou par non.`, yn(x >= a && x <= b), null); }
  ]);
  def('c1', 2, 'Fréquences', 'Fréquence = effectif ÷ effectif total. Pour un pourcentage, multiplie par 100.', [
    R => { const [k, n] = pick(R, [[12, 48], [9, 36], [15, 60], [6, 30], [8, 40], [18, 72]]); return num(`Effectif : ${k}. Effectif total : ${n}. Quelle est la fréquence, en pourcentage ?`, k * 100 / n, 1); },
    R => { const n = pick(R, [20, 40, 100, 200]), p = pick(R, [10, 20, 25, 50]); return num(`Effectif total : ${n}. Une valeur a pour fréquence ${p} %. Quel est son effectif ?`, n * p / 100, 0); },
    R => { const f = [pick(R, [20, 25, 30]), pick(R, [10, 15, 20]), pick(R, [15, 25, 30])], s = f.reduce((a, b) => a + b, 0); return num(`Trois valeurs ont pour fréquences ${f.join(' %, ')} %. Les autres valeurs se partagent le reste. Quelle est leur fréquence totale, en pourcentage ?`, 100 - s, 0); },
    R => { const [k, n] = pick(R, [[7, 40], [9, 50], [3, 8], [17, 20], [13, 25], [21, 60]]); return num(`Un effectif de ${k} sur un total de ${n} : écris la fréquence sous forme décimale (valeur exacte).`, k / n, 3); }
  ]);
  def('c1', 3, 'Diagrammes en bâtons et circulaires', 'Dans un diagramme circulaire, l’angle est proportionnel à l’effectif : 360° pour l’effectif total.', [
    R => { const [k, n] = pick(R, [[9, 36], [6, 24], [15, 60], [10, 40], [5, 30], [20, 48]]); return num(`Effectif : ${k} sur ${n}. Quel est l’angle du secteur correspondant, en degrés ?`, 360 * k / n, 0, '°'); },
    R => { const [n, a] = pick(R, [[24, 45], [24, 60], [24, 90], [36, 30], [36, 60], [36, 90], [48, 30], [48, 45], [60, 30], [60, 72], [60, 36]]); return num(`Un secteur mesure ${a}° dans un diagramme circulaire d’une série d’effectif total ${n}. Quel est l’effectif correspondant ?`, a * n / 360, 0); },
    R => { const e = shuffle(R, [R2(R, 2, 5), R2(R, 6, 9), R2(R, 10, 14)]); return num(`Un diagramme en bâtons indique les effectifs ${e.join(', ')}. Quelle est la différence entre le plus grand et le plus petit effectif ?`, Math.max(...e) - Math.min(...e), 0); },
    R => { const a = [pick(R, [90, 120]), pick(R, [60, 45]), pick(R, [30, 75])], s = a.reduce((x, y) => x + y, 0); return num(`Dans un diagramme circulaire, trois secteurs mesurent ${a.join('°, ')}°. Quel est l’angle du dernier secteur (le diagramme en compte quatre), en degrés ?`, 360 - s, 0, '°'); }
  ]);
  def('c1', 4, 'La moyenne', 'Moyenne = somme des valeurs ÷ nombre de valeurs.', [
    R => { const m = R2(R, 8, 16), a = R2(R, 1, 4); return num(`Calcule la moyenne de ${m - a}, ${m} et ${m + a}.`, m, 0); },
    R => { const v = [R2(R, 5, 18), R2(R, 5, 18), R2(R, 5, 18), R2(R, 5, 18)], s = v.reduce((a, b) => a + b, 0); return num(`Calcule la moyenne de ${v.join(' ; ')} (arrondie au dixième).`, s / 4, 1); },
    R => { const [x1, e1, x2, e2] = pick(R, [[10, 2, 20, 3], [8, 3, 12, 1], [5, 4, 15, 1], [2, 3, 6, 2], [4, 5, 9, 5]]); return num(`Valeur ${x1} d’effectif ${e1}, valeur ${x2} d’effectif ${e2}. Calcule la moyenne (arrondie au dixième).`, (x1 * e1 + x2 * e2) / (e1 + e2), 1); },
    R => { const m = R2(R, 9, 14), n = pick(R, [4, 5, 6]); return num(`Cinq notes ont pour moyenne ${m}. Quelle est la somme de ces notes ?`, 5 * m, 0); }
  ]);

  /* ======================= c2 · Probabilités ======================= */
  def('c2', 1, 'Issues et événements', 'Une issue est un résultat possible de l’expérience. Un événement regroupe des issues.', [
    R => { const f = pick(R, [6, 8, 10, 12, 20]); return num(`Combien d’issues possibles a le lancer d’un dé équilibré à ${f} faces ?`, f, 0); },
    R => { const n = pick(R, [6, 8, 10]), t = pick(R, [['pair', 2], ['multiple de 3', 3]]), c = []; for (let i = 1; i <= n; i++) if (i % t[1] === 0) c.push(i); return num(`On lance un dé équilibré à ${n} faces. Combien d’issues réalisent l’événement « obtenir un nombre ${t[0]} » ?`, c.length, 0); },
    R => { const [r, b, v] = [R2(R, 2, 6), R2(R, 2, 6), R2(R, 1, 5)]; return num(`Un sac contient ${r} boules rouges, ${b} bleues et ${v} vertes. Combien d’issues possibles a le tirage d’une boule ?`, r + b + v, 0); },
    R => { const n = pick(R, [4, 6, 8]), x = R2(R, 1, 10); return it(`On lance un dé équilibré à ${n} faces. Obtenir ${x} est-il possible ? Réponds par oui ou par non.`, yn(x <= n), null); }
  ]);
  def('c2', 2, 'Fréquences et stabilisation', 'Fréquence = effectif ÷ nombre d’essais. Plus on répète, plus elle se stabilise.', [
    R => { const [k, n] = pick(R, [[18, 50], [27, 60], [33, 100], [12, 40], [45, 90]]); return num(`Sur ${n} lancers, un événement s’est réalisé ${k} fois. Quelle est sa fréquence, en pourcentage ?`, k * 100 / n, 0); },
    R => { const n = pick(R, [200, 500, 1000]), p = pick(R, [20, 30, 35, 40, 45]); return num(`Sur ${n} essais, la fréquence d’un événement est de ${p} %. Combien de fois s’est-il réalisé ?`, n * p / 100, 0); },
    R => { const [k, n] = pick(R, [[7, 20], [9, 50], [3, 8], [17, 20], [13, 25], [21, 60]]); return num(`Sur ${n} essais, un événement apparaît ${k} fois. Quelle est sa fréquence, sous forme décimale (valeur exacte) ?`, k / n, 3); },
    R => { const [k, n] = pick(R, [[250, 1000], [370, 1000], [45, 500], [120, 400]]); return num(`Sur ${n} essais, un événement apparaît ${k} fois. Quelle est sa fréquence, en pourcentage ?`, k * 100 / n, 1, '%'); }
  ]);
  def('c2', 3, 'La probabilité d’un événement', 'P(A) = nombre d’issues favorables ÷ nombre d’issues possibles (issues équiprobables).', [
    R => { const n = pick(R, [6, 8, 10, 12]), k = R2(R, 1, n - 1); return it(`Un dé équilibré a ${n} faces. ${k} face${k > 1 ? 's' : ''} sur ${n} réalise${k > 1 ? 'nt' : ''} l’événement A. Calcule P(A) sous la forme d’une fraction irréductible.`, sf(k, n), k / n, { irr: 1 }); },
    R => { const [r, b] = [R2(R, 2, 6), R2(R, 2, 6)]; return num(`Un sac contient ${r} boules rouges et ${b} boules bleues (même chance d’être tirées). Probabilité de tirer une boule rouge, en pourcentage ? (arrondie à l’unité près)`, 100 * r / (r + b), 0, '%'); },
    R => { const n = pick(R, [20, 25, 40, 50]), k = pick(R, [5, 10, 15]); return num(`Probabilité d’un événement : ${k} issues favorables sur ${n} possibles. Écris-la sous forme décimale (valeur exacte).`, k / n, 3); },
    R => { const p = pick(R, [0.25, 0.4, 0.5, 0.75, 0.1]), n = pick(R, [20, 40, 100]); return num(`Un événement a pour probabilité ${fr(p)}. Il y a ${n} issues possibles, toutes équiprobables. Combien d’issues sont favorables ?`, p * n, 0); }
  ]);
  def('c2', 4, 'Événement contraire et deux épreuves', 'P(non A) = 1 − P(A). Deux épreuves : on multiplie les nombres de possibilités.', [
    R => { const p = pick(R, [0.2, 0.35, 0.6, 0.15, 0.45, 0.7]); return num(`P(A) = ${fr(p)}. Quelle est la probabilité de l’événement contraire de A ?`, 1 - p, 2); },
    R => { const k = R2(R, 1, 7), n = pick(R, [8, 10]); return it(`Un événement a pour probabilité ${k}/${n}. Probabilité de son contraire, en fraction irréductible ?`, sf(n - k, n), (n - k) / n, { irr: 1 }); },
    R => { const f = pick(R, [4, 6, 8, 12]); return num(`On lance un dé à ${f} faces, puis une pièce de monnaie (2 faces). Combien d’issues possibles pour les deux épreuves ?`, f * 2, 0); },
    R => { const a = R2(R, 3, 6), b = R2(R, 2, 5); return num(`Un menu propose ${a} entrées et ${b} plats. Combien de menus (une entrée et un plat) peut-on composer ?`, a * b, 0); }
  ]);

  /* ======================= c3 · Proportionnalité ======================= */
  def('c3', 1, 'Reconnaître une situation de proportionnalité', 'Il y a proportionnalité quand tous les rapports valeur ÷ quantité sont égaux.', [
    R => { const a = pick(R, [2, 3, 4]), k = pick(R, [1.5, 2, 2.5, 3]), q = [a, 2 * a, 3 * a], ok = R() < .5, p = q.map(x => x * k); if (!ok) p[2] += pick(R, [1, 2]); return it(`Quantités ${q.join(' ; ')}, prix ${p.map(x => fr(x)).join(' ; ')} €. La situation est-elle proportionnelle ? Réponds par oui ou par non.`, yn(ok), null); },
    R => { const [q1, q2] = pick(R, [[5, 10], [4, 12], [3, 9], [6, 12]]), v1 = pick(R, [6, 8, 10, 12]), ok = R() < .5, v2 = ok ? v1 * q2 / q1 : v1 * q2 / q1 + pick(R, [1, 2, 3]); return it(`${q1} objets coûtent ${fr(v1)} € et ${q2} objets coûtent ${fr(v2)} €. Le prix est-il proportionnel au nombre d’objets ? Réponds par oui ou par non.`, yn(ok), null); },
    R => { const k = pick(R, [2, 3, 4, 5]), x = R2(R, 3, 9); return num(`Dans un tableau de proportionnalité, 1 objet coûte ${k} €. Combien coûtent ${x} objets, en euros ?`, k * x, 0); },
    R => { const [q, v] = pick(R, [[3, 12], [4, 10], [5, 35], [2, 7], [6, 9]]), m = pick(R, [2, 3, 5]); return num(`Dans un tableau de proportionnalité, la quantité ${q} correspond à la valeur ${fr(v)}. Quelle valeur correspond à la quantité ${q * m} ?`, v * m, 1); }
  ]);
  def('c3', 2, 'Le coefficient de proportionnalité', 'Coefficient = valeur ÷ quantité. Pour retrouver la valeur : quantité × coefficient.', [
    R => { const q = pick(R, [4, 5, 8, 10]), c = pick(R, [1.5, 2, 2.5, 3, 4]); return num(`${q} objets coûtent ${fr(q * c)} €. Quel est le coefficient de proportionnalité (prix d’un objet, en euros) ?`, c, 2); },
    R => { const c = pick(R, [1.2, 1.5, 2.5, 3.5]), q = pick(R, [6, 10, 12]); return num(`Le coefficient de proportionnalité est ${fr(c)}. Quelle valeur correspond à la quantité ${q} ?`, c * q, 1); },
    R => { const c = pick(R, [2, 2.5, 4, 5]), v = pick(R, [20, 30, 50]); return num(`Le coefficient de proportionnalité est ${fr(c)}. Quelle quantité correspond à la valeur ${v} ?`, v / c, 1); },
    R => { const [q, v] = pick(R, [[3, 4.5], [8, 6], [6, 9], [5, 12.5], [4, 7]]); return num(`Quantité ${q}, valeur ${fr(v)}. Quel est le coefficient de proportionnalité (valeur exacte) ?`, v / q, 3); }
  ]);
  def('c3', 3, 'La quatrième proportionnelle', 'Dans un tableau de proportionnalité, on multiplie les deux nombres en diagonale, puis on divise par le troisième.', [
    R => { const [a, b, c] = pick(R, [[3, 12, 5], [4, 10, 6], [5, 15, 7], [2, 7, 6], [4, 9, 10]]); return num(`${a} objets coûtent ${b} €. Combien coûtent ${c} objets, en euros ? (arrondi au centime)`, b * c / a, 2, '€'); },
    R => { const [a, b, c] = pick(R, [[6, 15, 4], [8, 20, 6], [5, 12, 10], [3, 7, 9]]); return num(`${a} objets coûtent ${b} €. Combien d’objets peut-on acheter avec ${fr(b * c / a)} € ?`, c, 0); },
    R => { const [l, f, n] = pick(R, [[2, 250, 5], [3, 400, 2], [4, 500, 10], [5, 750, 4]]); return num(`Pour ${l} personnes, il faut ${f} g de farine. Combien de grammes pour ${l * n} personnes ?`, f * n, 0, 'g'); },
    R => { const [a, b, c] = pick(R, [[5, 8, 7], [6, 7, 5], [9, 4, 6], [4, 5, 9]]); return num(`${a} stylos coûtent ${b} €. Combien coûtent ${c} stylos, en euros ? (arrondi au centime)`, b * c / a, 2, '€'); }
  ]);
  def('c3', 4, 'Vitesse moyenne et proportionnalité', 'v = d ÷ t ; d = v × t ; t = d ÷ v. Pour passer des m/s aux km/h, on multiplie par 3,6.', [
    R => { const v = pick(R, [40, 60, 80, 90, 120]), t = pick(R, [2, 3, 1.5, 0.5, 2.5]); return num(`Une voiture roule à ${v} km/h pendant ${fr(t)} h. Quelle distance parcourt-elle, en km ?`, v * t, 0, 'km'); },
    R => { const d = pick(R, [120, 150, 180, 240]), t = pick(R, [2, 3, 4, 5]); return num(`On parcourt ${d} km en ${t} h. Quelle est la vitesse moyenne, en km/h ? (arrondie à l’unité près)`, d / t, 0, 'km/h'); },
    R => { const v = pick(R, [60, 80, 90, 120]), d = pick(R, [180, 240, 270, 360]); return num(`Une moto roule à ${v} km/h. Combien de temps met-elle pour ${d} km, en heures ? (arrondi au centième)`, d / v, 2, 'h'); },
    R => { const v = pick(R, [5, 10, 15, 20, 25]); return num(`Un cycliste roule à ${v} m/s. Quelle est sa vitesse en km/h ?`, v * 3.6, 0, 'km/h'); }
  ]);

  /* ======================= c4 · Pourcentages et échelles ======================= */
  def('c4', 1, 'Calculer un pourcentage d’une quantité', 'Prendre t % d’une quantité : multiplie par t puis divise par 100.', [
    R => { const p = pick(R, [10, 20, 25, 50]), q = pick(R, [40, 60, 80, 120, 200]); return num(`Calcule ${p} % de ${q}.`, p * q / 100, 0); },
    R => { const p = pick(R, [5, 15, 30, 12]), q = pick(R, [40, 60, 80, 200]); return num(`Calcule ${p} % de ${q} €. (arrondi au centime)`, p * q / 100, 2, '€'); },
    R => { const [k, n] = pick(R, [[6, 24], [9, 36], [15, 60], [18, 72], [7, 20], [12, 50]]); return num(`${k} élèves sur ${n} : quel pourcentage cela représente-t-il ?`, k * 100 / n, 1, '%'); },
    R => { const p = pick(R, [10, 20, 30, 50]), q = pick(R, [35, 45, 65, 90, 150]); return num(`Un article coûte ${q} €. Quelle est la remise de ${p} %, en € ?`, p * q / 100, 2, '€'); }
  ]);
  def('c4', 2, 'Hausse, baisse et coefficient multiplicateur', 'Hausse de t % : multiplie par 1 + t ÷ 100. Baisse de t % : multiplie par 1 − t ÷ 100.', [
    R => { const t = pick(R, [5, 10, 20, 25, 40]); return num(`Quel est le coefficient multiplicateur associé à une hausse de ${t} % ?`, 1 + t / 100, 2); },
    R => { const t = pick(R, [5, 10, 20, 25, 30]); return num(`Quel est le coefficient multiplicateur associé à une baisse de ${t} % ?`, 1 - t / 100, 2); },
    R => { const t = pick(R, [10, 20, 25, 50]), p = pick(R, [40, 60, 80, 120]); return num(`Un prix de ${p} € augmente de ${t} %. Quel est le nouveau prix, en euros ?`, p * (1 + t / 100), 2, '€'); },
    R => { const t = pick(R, [10, 20, 25, 30]), p = pick(R, [50, 80, 120, 200]); return num(`Un prix de ${p} € baisse de ${t} %. Quel est le nouveau prix, en euros ?`, p * (1 - t / 100), 2, '€'); }
  ]);
  def('c4', 3, 'Calculer un taux d’évolution', 'Taux = (valeur finale − valeur initiale) ÷ valeur initiale. Le signe − indique une baisse.', [
    R => { const [a, b] = pick(R, [[50, 60], [80, 100], [200, 250], [40, 50], [120, 150]]); return num(`Une valeur passe de ${a} à ${b}. Quel est le taux d’évolution, en pourcentage ?`, (b - a) * 100 / a, 0, '%'); },
    R => { const [a, b] = pick(R, [[50, 40], [80, 60], [200, 150], [120, 90], [60, 45]]); return num(`Une valeur passe de ${a} à ${b}. Quel est le taux d’évolution, en pourcentage ? (le signe compte)`, (b - a) * 100 / a, 0, '%'); },
    R => { const [a, b] = pick(R, [[30, 36], [45, 54], [70, 80], [90, 100], [55, 60]]); return num(`Une valeur passe de ${a} à ${b}. Quel est le taux d’évolution, en pourcentage ? (arrondi au dixième)`, (b - a) * 100 / a, 1, '%'); },
    R => { const t = pick(R, [10, 20, 25, 50]), b = pick(R, [60, 90, 120, 150]); return num(`Après une hausse de ${t} %, une valeur est égale à ${fr(b * (1 + t / 100))}. Quelle était la valeur de départ ?`, b, 0); }
  ]);
  def('c4', 4, 'Les échelles', 'Longueur réelle = longueur sur le plan × dénominateur de l’échelle. Convertis ensuite.', [
    R => { const n = pick(R, [50, 100, 200, 500]), l = pick(R, [2, 3, 4, 6]); return num(`Échelle 1/${n}. Une longueur de ${l} cm sur le plan. Quelle est la longueur réelle, en cm ?`, l * n, 0, 'cm'); },
    R => { const n = pick(R, [100, 200, 500]), l = pick(R, [3, 5, 8]); return num(`Échelle 1/${n}. Une longueur de ${l} cm sur le plan. Quelle est la longueur réelle, en mètres ?`, l * n / 100, 0, 'm'); },
    R => { const n = pick(R, [50, 100, 200]), L2 = pick(R, [4, 6, 10, 12]); return num(`Échelle 1/${n}. Une longueur réelle de ${L2} m. Quelle longueur sur le plan, en cm ?`, L2 * 100 / n, 0, 'cm'); },
    R => { const [l, r] = pick(R, [[4, 400], [5, 250], [2, 500], [3, 600]]); return num(`${l} cm sur le plan représentent ${r} cm dans la réalité. Quel est le dénominateur n de l’échelle 1/n ?`, r / l, 0); }
  ]);

  /* ======================= c5 · Équations et formules ======================= */
  def('c5', 1, 'Calculer avec une formule', 'Remplace chaque lettre par sa valeur, puis calcule en respectant les priorités.', [
    R => { const L2 = R2(R, 6, 15), l = R2(R, 3, 5); return num(`P = 2 × (L + l) avec L = ${L2} et l = ${l}. Calcule P.`, 2 * (L2 + l), 0); },
    R => { const [U, I] = pick(R, [[230, 2], [12, 3.5], [24, 2.5], [230, 0.5]]); return num(`P = U × I avec U = ${U} et I = ${fr(I)}. Calcule P.`, U * I, 1); },
    R => { const n = R2(R, 4, 12), a = pick(R, [3, 5, 8]), b = pick(R, [20, 30, 45]); return num(`T = ${a} × n + ${b} avec n = ${n}. Calcule T.`, a * n + b, 0); },
    R => { const a = R2(R, 3, 9); return num(`V = a × a × a avec a = ${a}. Calcule V.`, a * a * a, 0); }
  ]);
  def('c5', 2, 'Résoudre x + a = b et a × x = b', 'Pour garder l’équilibre, fais la même opération des deux côtés du signe =.', [
    R => { const a = R2(R, 3, 12), x = R2(R, 4, 20); return num(`Résous x + ${a} = ${x + a}.`, x, 0); },
    R => { const a = R2(R, 3, 12), x = R2(R, 15, 30); return num(`Résous x − ${a} = ${x - a}.`, x, 0); },
    R => { const a = R2(R, 2, 9), x = R2(R, 3, 12); return num(`Résous ${a} × x = ${a * x}.`, x, 0); },
    R => { const a = pick(R, [2, 4, 5, 8]), x = pick(R, [1.5, 2.5, 0.5, 3]); return num(`Résous ${a} × x = ${fr(a * x)}.`, x, 1); }
  ]);
  def('c5', 3, 'Résoudre a × x + b = c', 'On enlève b des deux côtés, puis on divise par a. Vérifie en remplaçant x.', [
    R => { const a = R2(R, 2, 6), b = R2(R, 3, 12), x = R2(R, 2, 9); return num(`Résous ${a} x + ${b} = ${a * x + b}.`, x, 0); },
    R => { const a = R2(R, 2, 6), b = R2(R, 3, 9), x = R2(R, 3, 9); return num(`Résous ${a} x − ${b} = ${a * x - b}.`, x, 0); },
    R => { const a = pick(R, [0.5, 1.5, 2.5]), x = R2(R, 2, 8), b = R2(R, 2, 9); return num(`Résous ${fr(a)} x + ${b} = ${fr(a * x + b)}.`, x, 0); },
    R => { const a = R2(R, 2, 5), k = R2(R, 1, 4), b = R2(R, 20, 30); return num(`Résous ${a} x + ${b} = ${b - a * k}. Attention au signe de la solution.`, -k, 0); }
  ]);
  def('c5', 4, 'Isoler une grandeur dans une formule', 'Isoler une grandeur : défaire les opérations dans l’ordre inverse, avec les valeurs données.', [
    R => { const L2 = R2(R, 6, 12), l = R2(R, 3, 5); return num(`A = L × l. On a A = ${L2 * l} et L = ${L2}. Calcule l.`, l, 0); },
    R => { const v = pick(R, [40, 60, 80, 90]), t = pick(R, [2, 3, 2.5, 1.5]); return num(`d = v × t. On a d = ${fr(v * t)} et v = ${v}. Calcule t.`, t, 1); },
    R => { const a = pick(R, [3, 4, 5, 8]), n = R2(R, 4, 12), b = pick(R, [20, 30, 40]); return num(`T = ${a} × n + ${b}. On a T = ${a * n + b}. Calcule n.`, n, 0); },
    R => { const [U, I] = pick(R, [[230, 2], [12, 4], [24, 3], [230, 5]]); return num(`U = R × I. On a U = ${U} et I = ${I}. Calcule R, arrondi au dixième.`, U / I, 1); }
  ]);

  /* ======================= c6 · Fonctions et graphiques ======================= */
  const tab = (X, Y) => `x : ${X.join(' ; ')} — f(x) : ${Y.join(' ; ')}`;
  def('c6', 1, 'Lire un tableau de valeurs', 'Lis la ligne des x, puis la valeur de f(x) juste en dessous.', [
    R => { const b = R2(R, 3, 9), p = R2(R, 2, 5), X = [0, 1, 2, 3, 4], Y = X.map(x => b + p * x), j = R2(R, 1, 4); return num(`${tab(X, Y)}. Quelle est l’image de ${X[j]} ?`, Y[j], 0); },
    R => { const b = R2(R, 3, 9), p = R2(R, 2, 5), X = [0, 1, 2, 3, 4], Y = X.map(x => b + p * x), j = R2(R, 1, 4); return num(`${tab(X, Y)}. Pour quelle valeur de x a-t-on f(x) = ${Y[j]} ?`, X[j], 0); },
    R => { const b = R2(R, 3, 9), p = R2(R, 2, 5), X = [0, 1, 2, 3, 4], Y = X.map(x => b + p * x); return num(`${tab(X, Y)}. De combien f(x) augmente-t-elle quand x augmente de 1 ?`, p, 0); },
    R => { const b = R2(R, 3, 9), p = R2(R, 2, 5), X = [0, 1, 2, 3], Y = X.map(x => b + p * x); return num(`${tab(X, Y)}. Si le tableau continue de la même façon, quelle est l’image de 5 ?`, b + 5 * p, 0); }
  ]);
  def('c6', 2, 'Lire les coordonnées d’un point', 'Un point se note (abscisse ; ordonnée) : on lit d’abord sur l’axe horizontal, puis sur l’axe vertical.', [
    R => { const x = R2(R, -6, 6), y = x === 0 ? 3 : -x + (x > 0 ? 1 : -1); return it(`Quelle est l’abscisse du point A(${sg(x)} ; ${sg(y)}) ?`, sg(x), x); },
    R => { const x = R2(R, -6, 6), y = R2(R, -6, 6); return it(`Quelle est l’ordonnée du point B(${sg(x)} ; ${sg(y)}) ?`, sg(y), y); },
    R => { const x = R2(R, 2, 7), y = R2(R, 2, 6); return it(`Un point est situé ${x} unités à gauche de l’axe vertical et ${y} unités au-dessus de l’axe horizontal. Quelle est son abscisse ?`, sg(-x), -x); },
    R => { const a = R2(R, -4, 1), d = R2(R, 3, 8), y = R2(R, -3, 5); return num(`Les points A(${sg(a)} ; ${sg(y)}) et B(${sg(a + d)} ; ${sg(y)}) sont sur la même ligne horizontale. Quelle est la longueur AB, en unités du repère ?`, d, 0); }
  ]);
  def('c6', 3, 'Image et antécédent d’un nombre', 'Image de a : remplace x par a. Antécédent de b : cherche x tel que f(x) = b.', [
    R => { const a = R2(R, 2, 5), b = R2(R, 1, 6), x = R2(R, 2, 8); return num(`f(x) = ${a} x + ${b}. Calcule l’image de ${x}.`, a * x + b, 0); },
    R => { const a = R2(R, 2, 5), b = R2(R, 1, 6), x = R2(R, 2, 8); return num(`f(x) = ${a} x + ${b}. Quel est l’antécédent de ${a * x + b} ?`, x, 0); },
    R => { const a = R2(R, 2, 5), b = R2(R, 10, 20), x = R2(R, 1, 4); return num(`f(x) = ${b} − ${a} x. Calcule l’image de ${x}.`, b - a * x, 0); },
    R => { const a = R2(R, 2, 5), x = R2(R, 2, 9); return num(`f(x) = ${a} x. Quel est l’antécédent de ${a * x} ?`, x, 0); }
  ]);
  def('c6', 4, 'Lire les variations d’une fonction', 'Une fonction croît quand ses images augmentent, elle décroît quand elles diminuent.', [
    R => { const Y = [R2(R, 2, 5), R2(R, 6, 9), R2(R, 10, 14), R2(R, 8, 9), R2(R, 3, 6)]; return num(`x : 0 ; 1 ; 2 ; 3 ; 4 — f(x) : ${Y.join(' ; ')}. Quelle est la plus grande valeur de f(x) ?`, Math.max(...Y), 0); },
    R => { const Y = [R2(R, 2, 5), R2(R, 6, 9), R2(R, 10, 14), R2(R, 8, 9), R2(R, 3, 6)]; return num(`x : 0 ; 1 ; 2 ; 3 ; 4 — f(x) : ${Y.join(' ; ')}. Pour quelle valeur de x la fonction atteint-elle sa plus grande valeur ?`, Y.indexOf(Math.max(...Y)), 0); },
    R => { const Y0 = R2(R, 12, 20), p = R2(R, 2, 3), Y = [0, 1, 2, 3, 4].map(i => Y0 - p * i); return num(`x : 0 ; 1 ; 2 ; 3 ; 4 — f(x) : ${Y.join(' ; ')}. De combien f(x) varie-t-elle quand x passe de 0 à 4 ? (donne un nombre négatif si f diminue)`, Y[4] - Y[0], 0); },
    R => { const Y = [R2(R, 1, 3), R2(R, 4, 6), R2(R, 7, 9), R2(R, 10, 12), R2(R, 13, 15)], up = R() < .5, Z = up ? Y : Y.slice().reverse(); return it(`x : 0 ; 1 ; 2 ; 3 ; 4 — f(x) : ${Z.join(' ; ')}. La fonction est-elle croissante sur [0 ; 4] ? Réponds par oui ou par non.`, yn(up), null); }
  ]);

  /* ======================= c7 · Fonctions linéaires et affines ======================= */
  def('c7', 1, 'La fonction linéaire f(x) = a × x', 'Une fonction linéaire s’écrit f(x) = a × x : a est le coefficient, f(1) = a.', [
    R => { const a = R2(R, 2, 7), x = R2(R, 3, 9); return num(`f(x) = ${a} x. Calcule f(${x}).`, a * x, 0); },
    R => { const a = R2(R, 2, 7), x = R2(R, 3, 9); return num(`f(x) = ${a} x. Pour quelle valeur de x a-t-on f(x) = ${a * x} ?`, x, 0); },
    R => { const a = R2(R, 2, 7), x = R2(R, 3, 9); return num(`f est linéaire et f(${x}) = ${a * x}. Quel est son coefficient a ?`, a, 0); },
    R => { const a = R2(R, 2, 7), x = R2(R, 2, 5), m = R2(R, 2, 3); return num(`f est linéaire et f(${x}) = ${a * x}. Calcule f(${x * m}).`, a * x * m, 0); }
  ]);
  def('c7', 2, 'Tracer la droite d’une fonction linéaire', 'La droite passe par l’origine O(0 ; 0) : un seul autre point suffit pour la tracer.', [
    R => { const a = pick(R, [2, 3, 1.5, 2.5, 0.5]), x = pick(R, [2, 4, 6]); return num(`La droite d’équation y = ${fr(a)} x passe par le point (${x} ; …). Quelle est l’ordonnée manquante ?`, a * x, 1); },
    R => { const a = R2(R, 2, 5), y = a * R2(R, 2, 6); return num(`La droite d’équation y = ${a} x passe par le point (… ; ${y}). Quelle est l’abscisse manquante ?`, y / a, 0); },
    R => { const [x, y] = pick(R, [[4, 6], [2, 5], [5, 10], [4, 10], [10, 5]]); return num(`Une droite passe par O(0 ; 0) et par A(${x} ; ${y}). Quel est son coefficient a (valeur exacte) ?`, y / x, 2); },
    R => { const a = pick(R, [2, 3, 4]), x = R2(R, 1, 4); return num(`Le point P(${x} ; ${a * x}) est sur la droite y = a x passant par l’origine. Quel est le coefficient a ?`, a, 0); }
  ]);
  def('c7', 3, 'La fonction affine f(x) = a × x + b', 'f(x) = a x + b : a est le coefficient, b l’ordonnée du point où la droite coupe l’axe vertical : (0 ; b).', [
    R => { const a = R2(R, 2, 6), b = R2(R, 3, 9), x = R2(R, 2, 6); return num(`f(x) = ${a} x + ${b}. Calcule f(${x}).`, a * x + b, 0); },
    R => { const a = R2(R, 2, 6), b = R2(R, 3, 9); return num(`f(x) = ${a} x + ${b}. La droite coupe l’axe vertical au point (0 ; …). Complète avec le nombre manquant.`, b, 0); },
    R => { const a = R2(R, 2, 6), b = R2(R, 3, 9); return num(`f(x) = ${a} x + ${b}. Quel est le coefficient a ?`, a, 0); },
    R => { const a = R2(R, 2, 5), b = R2(R, 10, 30), x = R2(R, 6, 12); return num(`f(x) = ${a} x + ${b}. Quel est l’antécédent de ${a * x + b} ? (résous a x + b = ${a * x + b})`, x, 0); }
  ]);
  def('c7', 4, 'Comparer deux formules', 'Deux formules donnent le même résultat quand f(x) = g(x) : résous cette équation.', [
    R => { const p = R2(R, 2, 4), r = p + R2(R, 2, 4), x = R2(R, 3, 9), q = (r - p) * x; return num(`f(x) = ${p} x + ${q} et g(x) = ${r} x. Pour quelle valeur de x a-t-on f(x) = g(x) ?`, x, 0); },
    R => { const p = R2(R, 2, 4), q = R2(R, 10, 30), x = R2(R, 3, 9); return num(`f(x) = ${p} x + ${q}. Calcule f(${x}).`, p * x + q, 0); },
    R => { const p = R2(R, 2, 4), r = p + R2(R, 2, 4), x = R2(R, 3, 9), q = (r - p) * x, y = x + R2(R, 2, 5); return it(`f(x) = ${p} x + ${q} et g(x) = ${r} x. Pour x = ${y}, g(x) est-il supérieur à f(x) ? Réponds par oui ou par non.`, yn(r * y > p * y + q), null); },
    R => { const p = R2(R, 3, 5), r = 2 * p, x = R2(R, 4, 12), q = p * x; return num(`Formule A : ${p} x + ${q}. Formule B : ${r} x. À partir de quelle valeur de x les deux formules coûtent-elles autant ?`, x, 0); }
  ]);

  /* ======================= c8 · Calculs commerciaux ======================= */
  def('c8', 1, 'Prix HT, TVA et prix TTC', 'TTC = HT × (1 + taux de TVA). TVA = HT × taux de TVA.', [
    R => { const ht = pick(R, [40, 50, 80, 120, 150]), t = pick(R, [20, 10, 5.5]); return num(`Prix HT : ${fr(ht)} €. Taux de TVA : ${fr(t)} %. Calcule le montant de la TVA, en euros. (arrondi au centime)`, ht * t / 100, 2, '€'); },
    R => { const ht = pick(R, [40, 50, 80, 120, 150, 250]), t = pick(R, [20, 10]); return num(`Prix HT : ${fr(ht)} €. Taux de TVA : ${t} %. Calcule le prix TTC, en euros.`, ht * (1 + t / 100), 2, '€'); },
    R => { const ht = pick(R, [50, 80, 100, 150, 200]), t = pick(R, [20, 10]); return num(`Prix TTC : ${fr(ht * (1 + t / 100))} €. Taux de TVA : ${t} %. Calcule le prix HT, en euros.`, ht, 2, '€'); },
    R => { const ht = pick(R, [20, 40, 60, 100, 200]); return num(`Prix HT : ${ht} €. Taux de TVA : 5,5 %. Calcule le prix TTC, en euros. (arrondi au centime)`, ht * 1.055, 2, '€'); }
  ]);
  def('c8', 2, 'Remise commerciale et facture', 'Remise = prix × taux ÷ 100. Net commercial = prix − remise.', [
    R => { const p = pick(R, [80, 120, 200, 250]), t = pick(R, [10, 15, 20, 5]); return num(`Prix : ${p} €. Remise de ${t} %. Calcule le montant de la remise, en euros. (arrondi au centime)`, p * t / 100, 2, '€'); },
    R => { const p = pick(R, [80, 120, 200, 250]), t = pick(R, [10, 15, 20, 25]); return num(`Prix : ${p} €. Remise de ${t} %. Calcule le net commercial, en euros. (arrondi au centime)`, p * (1 - t / 100), 2, '€'); },
    R => { const n = R2(R, 3, 9), pu = pick(R, [12.5, 8, 15, 4.5, 20]); return num(`Une facture comporte ${n} articles à ${fr(pu)} € l’un. Calcule le total, en euros. (arrondi au centime)`, n * pu, 2, '€'); },
    R => { const p = pick(R, [80, 120, 200, 250]), t = pick(R, [10, 15, 20, 25]); return num(`Prix catalogue : ${p} €. Net commercial : ${fr(p * (1 - t / 100))} €. Quel est le taux de remise, en pourcentage ?`, t, 1, '%'); }
  ]);
  def('c8', 3, 'Marge et taux de marge', 'Marge = prix de vente − prix d’achat. Taux de marge = marge ÷ prix d’achat × 100.', [
    R => { const a = pick(R, [40, 60, 80, 120]), m = pick(R, [10, 15, 20, 30]); return num(`Prix d’achat : ${a} €. Prix de vente : ${a + m} €. Calcule la marge, en euros.`, m, 2, '€'); },
    R => { const a = pick(R, [40, 50, 80, 100]), t = pick(R, [20, 25, 50]); return num(`Prix d’achat : ${a} €. Marge : ${fr(a * t / 100)} €. Calcule le taux de marge, en pourcentage.`, t, 1, '%'); },
    R => { const a = pick(R, [40, 50, 80, 100]), t = pick(R, [20, 25, 50]); return num(`Prix d’achat : ${a} €. Taux de marge : ${t} %. Calcule le prix de vente, en euros.`, a * (1 + t / 100), 2, '€'); },
    R => { const [a, v] = pick(R, [[20, 25], [30, 36], [40, 45], [50, 65], [60, 75], [25, 30]]); return num(`Prix d’achat : ${a} €. Prix de vente : ${v} €. Calcule le taux de marge, en pourcentage. (arrondi au dixième)`, (v - a) * 100 / a, 1, '%'); }
  ]);
  def('c8', 4, 'Intérêts simples et valeur acquise', 'Intérêts = capital × taux × durée en années ÷ 100. Valeur acquise = capital + intérêts.', [
    R => { const c = pick(R, [1000, 2000, 5000]), t = pick(R, [2, 3, 4]), n = pick(R, [1, 2, 3]); return num(`Capital : ${fr(c)} €. Taux : ${t} % par an. Durée : ${n} an${n > 1 ? 's' : ''}. Calcule les intérêts simples, en euros.`, c * t * n / 100, 2, '€'); },
    R => { const c = pick(R, [1000, 2000, 5000]), t = pick(R, [2, 3, 4]), n = pick(R, [1, 2, 3]); return num(`Capital : ${fr(c)} €. Taux : ${t} % par an. Durée : ${n} an${n > 1 ? 's' : ''}. Calcule la valeur acquise, en euros.`, c + c * t * n / 100, 2, '€'); },
    R => { const c = pick(R, [1200, 2400, 3000]), t = pick(R, [2, 3, 5]), m = pick(R, [3, 6, 9]); return num(`Capital : ${fr(c)} €. Taux : ${t} % par an. Durée : ${m} mois. Calcule les intérêts simples, en euros.`, c * t * m / 1200, 2, '€'); },
    R => { const c = pick(R, [1000, 1500, 2000]), t = pick(R, [2, 3, 4]), n = pick(R, [2, 3]); return num(`Capital : ${fr(c)} €. Intérêts après ${n} ans : ${fr(c * t * n / 100)} €. Quel est le taux annuel, en pourcentage ?`, t, 1, '%'); }
  ]);

  /* ======================= c9 · Périmètres, aires et volumes ======================= */
  def('c9', 1, 'Le périmètre', 'Le périmètre est la longueur du contour d’une figure.', [
    R => { const L2 = R2(R, 6, 15), l = R2(R, 3, 5); return num(`Rectangle de longueur ${L2} cm et de largeur ${l} cm. Calcule son périmètre, en cm.`, 2 * (L2 + l), 0, 'cm'); },
    R => { const c = R2(R, 4, 12); return num(`Carré de côté ${c} m. Calcule son périmètre, en m.`, 4 * c, 0, 'm'); },
    R => { const r = pick(R, [3, 5, 8, 10]); return num(`Cercle de rayon ${r} cm. Calcule son périmètre, en cm. (arrondi au dixième)`, 2 * Math.PI * r, 1, 'cm'); },
    R => { const a = R2(R, 5, 9), b = R2(R, 6, 11), c = R2(R, 7, 12); return num(`Triangle de côtés ${a} cm, ${b} cm et ${c} cm. Calcule son périmètre, en cm.`, a + b + c, 0, 'cm'); }
  ]);
  def('c9', 2, 'L’aire', 'L’aire mesure la surface : rectangle L × l ; triangle b × h ÷ 2 ; disque π × r².', [
    R => { const L2 = R2(R, 6, 15), l = R2(R, 3, 9); return num(`Rectangle de longueur ${L2} m et de largeur ${l} m. Calcule son aire, en m².`, L2 * l, 0, 'm²'); },
    R => { const b = pick(R, [6, 8, 10, 12]), h = R2(R, 3, 9); return num(`Triangle de base ${b} cm et de hauteur ${h} cm. Calcule son aire, en cm².`, b * h / 2, 1, 'cm²'); },
    R => { const r = pick(R, [2, 3, 5, 6]); return num(`Disque de rayon ${r} cm. Calcule son aire, en cm². (arrondi au dixième)`, Math.PI * r * r, 1, 'cm²'); },
    R => { const c = R2(R, 4, 12); return num(`Carré de côté ${c} cm. Calcule son aire, en cm².`, c * c, 0, 'cm²'); }
  ]);
  def('c9', 3, 'Le volume d’un solide', 'Pavé : L × l × h ; cylindre : π × r² × h ; cône : π × r² × h ÷ 3 ; boule : 4 ÷ 3 × π × r³.', [
    R => { const L2 = R2(R, 4, 10), l = R2(R, 3, 6), h = R2(R, 2, 5); return num(`Pavé de ${L2} cm sur ${l} cm sur ${h} cm. Calcule son volume, en cm³.`, L2 * l * h, 0, 'cm³'); },
    R => { const r = pick(R, [2, 3, 4, 5]), h = pick(R, [6, 9, 12]); return num(`Cône de rayon ${r} cm et de hauteur ${h} cm. Calcule son volume, en cm³. (arrondi à l’unité près)`, Math.PI * r * r * h / 3, 0, 'cm³'); },
    R => { const r = pick(R, [2, 3, 4, 5]), h = pick(R, [5, 8, 10]); return num(`Cylindre de rayon ${r} cm et de hauteur ${h} cm. Calcule son volume, en cm³. (arrondi à l’unité près)`, Math.PI * r * r * h, 0, 'cm³'); },
    R => { const L2 = R2(R, 3, 6), l = R2(R, 3, 5), V = L2 * l * R2(R, 2, 4); return num(`Un pavé a pour volume ${V} cm³ et pour base un rectangle de ${L2} cm sur ${l} cm. Calcule sa hauteur, en cm.`, V / (L2 * l), 0, 'cm'); }
  ]);
  def('c9', 4, 'Les conversions d’unités', 'Longueurs : de 10 en 10 ; aires : de 100 en 100 ; volumes : de 1 000 en 1 000. 1 dm³ = 1 L.', [
    R => { const x = pick(R, [2.5, 3.2, 0.75, 4.1, 1.6]); return num(`Convertis ${fr(x)} m en cm.`, x * 100, 0, 'cm'); },
    R => { const x = pick(R, [2.5, 3, 0.75, 4.2, 1.5]); return num(`Convertis ${fr(x)} L en mL.`, x * 1000, 0, 'mL'); },
    R => { const x = pick(R, [1.2, 3, 0.5, 2.5, 4]); return num(`Convertis ${fr(x)} m² en cm².`, x * 10000, 0, 'cm²'); },
    R => { const x = pick(R, [4500, 2000, 7500, 12000, 800]); return num(`Convertis ${fr(x)} cm³ en L.`, x / 1000, 3, 'L'); }
  ]);

  const PICK = null;
  const mech = (cid, k, seed) => {
    const m = MECH[cid + '.' + k]; if (!m) throw new Error('mécanique inconnue : ' + cid + '.' + k);
    const R = MC.rng(seed);
    return { titre: m.titre, consigne: m.consigne, items: m.mk.map((g, i) => { const o = g(R); o.k = L[i]; if (o.v != null && /^[−-]?\d+\/\d+$/.test(o.a) && /irréd|simplif/i.test(m.consigne + ' ' + o.t)) o.irr = 1; return o; }) };
  };
  MCVT.MECH = MECH; MCVT.mech = mech;
  MCVT.MECH_REGLE = {}; Object.keys(MECH).forEach(k => { MCVT.MECH_REGLE[k] = MECH[k].consigne; });
})(typeof module !== 'undefined' ? module.exports : window);
