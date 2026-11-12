/* CAP Maths — zones « ⚡ Automatismes » : 5 questions flash par chapitre, sans calculatrice.
   Les questions suivent la liste d’automatismes du programme de CAP (BOEN spécial n° 5 du 11 avril 2019) :
   calculs, proportions, formules et équations simples, arrondis, durées ; unités et figures pour le groupement 1.
   Tirage fixe dans le manuel, nouveau tirage dans l’appli. Toutes les réponses sont calculées.
   Une question = { t, v, tol, a, x } (réponse numérique) ou { t, choices, ok, a, x } (choix). */
(function (root) {
  'use strict';
  const MC = typeof module !== 'undefined' ? require('./gens.js').MCVG : root.MCVG;
  const { fr, rnd, rng } = MC;
  const pick = (R, a) => a[Math.floor(R() * a.length)], int = (R, lo, hi) => lo + Math.floor(R() * (hi - lo + 1));
  const Q = (t, v, a, d = 2, x) => ({ t, v, tol: .5 * Math.pow(10, -d) + 1e-9, a: a || fr(rnd(v, d)), ...(x ? { x } : {}) });
  const C = (t, choices, ok, a, x) => ({ t, choices, ok, a: a || choices[ok], ...(x ? { x } : {}) });
  const rot = (R, arr) => { const o = int(R, 0, arr.length - 1); return [...arr.slice(o), ...arr.slice(0, o)]; };
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const fs = (n, d) => { const g = gcd(n, d); return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`; };
  const sg = n => n < 0 ? '−' + fr(-n) : fr(n), par = n => n < 0 ? '(−' + fr(-n) + ')' : fr(n);
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = n => String(n).replace('-', '⁻').split('').map(c => SUP['0123456789'.indexOf(c)] || c).join('');

  /* ---------- nombres et calculs (tous les CAP) ---------- */
  const mult10 = R => { const f = pick(R, [10, 100, .1, .01]), n = pick(R, [3.4, .52, 6.7, 45, 8.03, 12.5, 7, 2.6]), v = rnd(n * f, 6), k = (f === 10 || f === .1) ? 1 : 2;
    return Q(`Calcule ${fr(n)} × ${fr(f)}.`, v, fr(v), 4, `on décale la virgule de ${k} rang${k > 1 ? 's' : ''} vers la ${f > 1 ? 'droite' : 'gauche'} : ${fr(v)}`); };
  const calcMental = R => { const k = int(R, 0, 2); if (k === 0) { const a = int(R, 31, 69), b = int(R, 12, 29); return Q(`Calcule ${a} + ${b}.`, a + b, null, 2, `${a} + ${b} = ${a + b}`); }
    if (k === 1) { const [a, b] = pick(R, [[25, 4], [25, 8], [15, 6], [12, 5], [11, 9], [50, 6], [35, 2]]); return Q(`Calcule ${a} × ${b}.`, a * b, null, 2, `${a} × ${b} = ${a * b}`); }
    const a = int(R, 6, 9), b = int(R, 6, 9); return Q(`Calcule ${a} × ${b}.`, a * b, null, 2, `table de ${a} : ${a} × ${b} = ${a * b}`); };
  const signes = R => { const a = int(R, 2, 9), b = int(R, 2, 9), [sa, sb] = pick(R, [[-1, 1], [1, -1], [-1, -1]]), dv = R() < .5;
    if (dv) { const p = a * b, A = p * sa, B = b * sb; return Q(`Calcule ${par(A)} ÷ ${par(B)}.`, A / B, null, 2, `${sa * sb > 0 ? 'même signe : le résultat est positif' : 'signes différents : le résultat est négatif'} ; ${p} ÷ ${b} = ${a}, donc ${sg(A / B)}`); }
    const A = a * sa, B = b * sb; return Q(`Calcule ${par(A)} × ${par(B)}.`, A * B, null, 2, `${sa * sb > 0 ? 'même signe : le résultat est positif' : 'signes différents : le résultat est négatif'} ; ${a} × ${b} = ${a * b}, donc ${sg(A * B)}`); };
  const fracAdd = R => { const [a, b, c, d] = pick(R, [[1, 2, 1, 4], [1, 3, 1, 6], [2, 5, 1, 10], [1, 4, 1, 8], [3, 4, 1, 2], [1, 2, 1, 3], [2, 3, 1, 6]]);
    const n = a * d + c * b, dd = b * d, ok = fs(n, dd), w1 = fs(a + c, b + d), w2 = fs(a * c, b * d), ch = [ok, w1, w2];
    if (new Set(ch).size < 3) return fracAdd(R); const o = rot(R, ch);
    return C(`Calcule ${a}/${b} + ${c}/${d}.`, o, o.indexOf(ok), ok, `dénominateur commun ${dd} : ${a * d}/${dd} + ${c * b}/${dd} = ${n}/${dd} = ${ok}`); };
  const fracMul = R => { const [a, b, c, d] = pick(R, [[2, 3, 3, 4], [1, 2, 2, 5], [3, 4, 2, 3], [4, 5, 5, 8], [1, 3, 3, 5], [2, 7, 7, 4]]);
    const ok = fs(a * c, b * d), w1 = fs(a + c, b + d), w2 = fs(a * d, b * c), ch = [ok, w1, w2];
    if (new Set(ch).size < 3) return fracMul(R); const o = rot(R, ch);
    return C(`Calcule ${a}/${b} × ${c}/${d}.`, o, o.indexOf(ok), ok, `${a} × ${c} = ${a * c} et ${b} × ${d} = ${b * d} : ${a * c}/${b * d} = ${ok}`); };
  const prop = R => { const [n, d] = pick(R, [[1, 4], [3, 4], [1, 5], [2, 5], [3, 10], [1, 2], [7, 20], [9, 20], [3, 5]]), p = n * 100 / d;
    return Q(`${n} sur ${d} : écris cette proportion en pourcentage.`, p, fr(p), 2, `${n} ÷ ${d} = ${fr(n / d)} ; ${fr(n / d)} × 100 = ${fr(p)} %`); };
  const fracDec = R => { const [n, d] = pick(R, [[1, 4], [3, 4], [1, 2], [1, 5], [2, 5], [3, 10], [7, 10], [1, 8]]), v = n / d; return Q(`Écris ${n}/${d} sous forme décimale.`, v, fr(v), 3, `${n} ÷ ${d} = ${fr(v)}`); };
  const compDec = R => { const g = pick(R, [[3.14, 3.4, 3.041], [0.35, 0.305, 0.4], [12.5, 12.05, 12.49], [0.9, 0.099, 0.19], [6.08, 6.8, 6.79], [1.2, 1.02, 1.199]]), mx = Math.max(...g), ch = rot(R, g.map(x => fr(x)));
    return C('Quel est le plus grand de ces nombres ?', ch, ch.indexOf(fr(mx)), fr(mx), `on compare chiffre par chiffre, de gauche à droite : ${fr(mx)} est le plus grand`); };
  const compFr = R => { if (R() < .5) { const g = pick(R, [[[3, 4], [2, 3], [5, 8]], [[1, 2], [3, 5], [4, 10]], [[7, 10], [3, 4], [2, 3]]]), vals = g.map(([n, d]) => n / d), mx = Math.max(...vals), i = vals.indexOf(mx), ch = rot(R, g.map(([n, d]) => `${n}/${d}`));
      return C('Quelle fraction est la plus grande ?', ch, ch.indexOf(`${g[i][0]}/${g[i][1]}`), `${g[i][0]}/${g[i][1]}`, `en décimal : ${g.map(([n, d]) => `${n}/${d} = ${fr(rnd(n / d, 3))}`).join(' ; ')}`); }
    const [m1, e1, m2, e2] = pick(R, [[3.5, 2, 4.2, 1], [2, 4, 9, 3], [6.1, 3, 6.1, 2], [1.5, 5, 8, 4]]), v1 = m1 * 10 ** e1, v2 = m2 * 10 ** e2, ch = rot(R, [`${fr(m1)} × 10${sup(e1)}`, `${fr(m2)} × 10${sup(e2)}`]);
    return C('Quel nombre est le plus grand ?', ch, ch.indexOf(v1 > v2 ? `${fr(m1)} × 10${sup(e1)}` : `${fr(m2)} × 10${sup(e2)}`), null, `${fr(m1)} × 10${sup(e1)} = ${fr(rnd(v1, 6))} et ${fr(m2)} × 10${sup(e2)} = ${fr(rnd(v2, 6))}`); };
  const formule = R => { const f = pick(R, [
    () => { const I = int(R, 2, 6), Rr = int(R, 3, 12), U = Rr * I; return [`En électricité, U = R × I. Avec U = ${U} V et I = ${I} A, calcule R, en ohms.`, Rr, `R = U ÷ I = ${U} ÷ ${I} = ${Rr}`]; },
    () => { const t = int(R, 2, 5), v = int(R, 4, 12) * 10, d = v * t; return [`Distance d = v × t. Avec d = ${d} km et v = ${v} km/h, calcule t, en heures.`, t, `t = d ÷ v = ${d} ÷ ${v} = ${t}`]; },
    () => { const U = pick(R, [10, 12, 20, 24]), I = int(R, 2, 5), P = U * I; return [`En électricité, P = U × I. Avec P = ${P} W et U = ${U} V, calcule I, en ampères.`, I, `I = P ÷ U = ${P} ÷ ${U} = ${I}`]; },
    () => { const a = int(R, 3, 9), b = int(R, 2, 8), A = a * b; return [`Aire d’un rectangle A = L × l. Avec A = ${A} cm² et L = ${a} cm, calcule l, en cm.`, b, `l = A ÷ L = ${A} ÷ ${a} = ${b}`]; }])();
    return Q(f[0], f[1], null, 2, f[2]); };
  const eq1 = R => { const k = int(R, 0, 2); if (k === 0) { const x = int(R, 2, 12), a = int(R, 2, 9); return Q(`Résous ${a}x = ${a * x}.`, x, null, 2, `x = ${a * x} ÷ ${a} = ${x}`); }
    if (k === 1) { const x = int(R, 2, 12), a = int(R, 3, 15); return Q(`Résous x + ${a} = ${x + a}.`, x, null, 2, `x = ${x + a} − ${a} = ${x}`); }
    const a = int(R, 2, 6), x = int(R, a + 2, 14); return Q(`Résous x − ${a} = ${x - a}.`, x, null, 2, `x = ${x - a} + ${a} = ${x}`); };
  const equa = R => { const a = int(R, 2, 5), x = int(R, 2, 9), b = int(R, 1, 9); return Q(`Résous ${a}x + ${b} = ${a * x + b}.`, x, null, 2, `${a}x = ${a * x + b} − ${b} = ${a * x}, donc x = ${a * x} ÷ ${a} = ${x}`); };
  const arrondi = R => { const [v, d] = pick(R, [[3.478, 1], [12.346, 2], [7.8449, 2], [0.7264, 1], [5.6271, 0], [18.0962, 1], [2.3188, 2], [9.5071, 0]]), r = rnd(v, d), nom = ['à l’unité', 'au dixième', 'au centième'][d];
    return Q(`Arrondis ${fr(v)} ${nom}.`, r, fr(r), 3, `on regarde le chiffre suivant : ${fr(v)} ≈ ${fr(r)}`); };
  const duree = R => { if (R() < .5) { const [h, m] = pick(R, [[3, 30], [2, 15], [1, 45], [4, 12], [2, 6], [5, 36]]), v = h + m / 60; return Q(`Convertis ${h} h ${m} min en heures (écriture décimale).`, v, fr(rnd(v, 2)), 2, `${m} min = ${m} ÷ 60 = ${fr(m / 60)} h, donc ${fr(rnd(v, 2))} h`); }
    const [h, f] = pick(R, [[1, .5], [2, .25], [3, .75], [1, .2], [4, .1], [2, .4]]), m = Math.round(f * 60); return Q(`${fr(h + f)} h = ${h} h … min. Donne les minutes.`, m, null, 2, `${fr(f)} h = ${fr(f)} × 60 = ${m} min`); };
  /* ---------- données, probabilités, proportionnalité ---------- */
  const moy = R => { const m = int(R, 8, 16), a = int(R, 1, 4), b = int(R, 1, 4); if (R() < .5) return Q(`Moyenne de ${m - a}, ${m} et ${m + a} ?`, m, null, 2, `(${m - a} + ${m} + ${m + a}) ÷ 3 = ${3 * m} ÷ 3 = ${m}`);
    const l = rot(R, [m - a, m + a, m - b, m + b]); return Q(`Moyenne de ${l.join(', ')} ?`, m, null, 2, `${l.join(' + ')} = ${4 * m}, puis ${4 * m} ÷ 4 = ${m}`); };
  const freq = R => { const [k, n] = pick(R, [[12, 48], [9, 36], [15, 60], [6, 30], [8, 40], [18, 72]]); return Q(`${k} élèves sur ${n} : fréquence en % ?`, k * 100 / n, null, 2, `${k} ÷ ${n} = ${fr(k / n)}, soit ${fr(k * 100 / n)} %`); };
  const efftot = R => { const e = [int(R, 2, 9), int(R, 3, 12), int(R, 2, 8), int(R, 1, 6)], N = e.reduce((a, b) => a + b, 0); return Q(`Effectifs d’une série : ${e.join(' ; ')}. Quel est l’effectif total ?`, N, null, 2, `${e.join(' + ')} = ${N}`); };
  const proba = R => { if (R() < .5) { const [txt, n] = pick(R, [['un 6', 1], ['un nombre pair', 3], ['un nombre supérieur ou égal à 5', 2], ['un multiple de 3', 2], ['un nombre inférieur à 3', 2], ['un nombre impair', 3]]), ok = fs(n, 6), ch = [ok, fs(n, 5), fs(n, 7)];
      if (new Set(ch).size < 3) return proba(R); const o = rot(R, ch); return C(`On lance un dé équilibré à 6 faces. Probabilité d’obtenir ${txt} ?`, o, o.indexOf(ok), ok, `${n} issue${n > 1 ? 's' : ''} favorable${n > 1 ? 's' : ''} sur 6 : ${n}/6 = ${ok}`); }
    const r = int(R, 1, 4), b = r + int(R, 1, 4), t = r + b, ok = fs(r, t), ch = [ok, fs(r, b), fs(b, t)]; if (new Set(ch).size < 3) return proba(R); const o = rot(R, ch);
    return C(`Un sac contient ${r} bille${r > 1 ? 's' : ''} rouge${r > 1 ? 's' : ''} et ${b} bleues. On tire une bille au hasard. Probabilité qu’elle soit rouge ?`, o, o.indexOf(ok), ok, `${r} favorable${r > 1 ? 's' : ''} sur ${t} billes : ${r}/${t} = ${ok}`); };
  const contraire = R => { const p = pick(R, [.2, .35, .6, .15, .45, .7]); return Q(`La probabilité qu’un événement A se réalise est ${fr(p)}. Quelle est la probabilité qu’il ne se réalise pas ?`, rnd(1 - p, 2), null, 2, `1 − ${fr(p)} = ${fr(rnd(1 - p, 2))}`); };
  const qprop = R => { const [a, b, c, nom, un] = pick(R, [[3, 12, 5, 'places de cinéma', '€'], [4, 10, 6, 'tickets de bus', '€'], [5, 15, 7, 'paquets de cartes', '€'], [2, 7, 6, 'sorties au cinéma', '€'], [6, 9, 10, 'tickets de manège', '€']]);
    return Q(`${a} ${nom} coûtent ${b} ${un}. Combien coûtent ${c} ${nom} ?`, b / a * c, null, 2, `1 pour ${fr(b / a)} ${un} ; ${c} × ${fr(b / a)} = ${fr(b / a * c)} ${un}`); };
  const coefp = R => { const [a, b] = pick(R, [[4, 10], [5, 20], [3, 12], [8, 20], [6, 15], [10, 35], [2, 5]]); return Q(`Dans un tableau de proportionnalité, ${a} devient ${b}. Quel est le coefficient de proportionnalité ?`, b / a, null, 2, `${b} ÷ ${a} = ${fr(b / a)}`); };
  const pctOf = R => { const [p, x] = pick(R, [[10, 80], [25, 60], [50, 46], [20, 45], [75, 40], [10, 250], [5, 60], [30, 70]]); return Q(`Calcule ${p} % de ${x}.`, p * x / 100, null, 2, `${x} × ${p} ÷ 100 = ${fr(p * x / 100)}`); };
  const hausse = R => { const [x, p, s] = pick(R, [[80, 10, 1], [60, 25, 1], [50, 20, 1], [200, 5, 1], [40, 50, 1], [80, 25, -1], [60, 10, -1], [50, 20, -1], [200, 15, -1], [120, 50, -1]]), v = x * (100 + s * p) / 100, k = (100 + s * p) / 100;
    return Q(`Un prix de ${x} € ${s > 0 ? 'augmente' : 'baisse'} de ${p} %. Quel est le nouveau prix, en € ?`, v, null, 2, `coefficient ${fr(k)} : ${x} × ${fr(k)} = ${fr(v)} €`); };
  const ttc = R => { const x = pick(R, [50, 80, 120, 25, 150]); return Q(`Un article coûte ${x} € hors taxes. Avec une TVA de 20 %, quel est son prix TTC, en € ?`, x * 1.2, null, 2, `${x} × 1,2 = ${fr(rnd(x * 1.2, 2))} €`); };
  const echelle = R => { if (R() < .6) { const [e, d] = pick(R, [[100, 3], [1000, 5], [50, 4], [200, 2.5]]); return Q(`Sur un plan à l’échelle 1/${e}, un mur mesure ${fr(d)} cm. Longueur réelle, en cm ?`, e * d, fr(e * d), 2, `${fr(d)} × ${e} = ${fr(e * d)} cm`); }
    const [e, m] = pick(R, [[200, 8], [50, 2], [100, 6], [500, 10]]), cm = m * 100 / e; return Q(`Un mur de ${m} m est dessiné sur un plan à l’échelle 1/${e}. Longueur sur le plan, en cm ?`, cm, null, 2, `${m} m = ${m * 100} cm ; ${m * 100} ÷ ${e} = ${fr(cm)} cm`); };
  /* ---------- fonctions ---------- */
  const imageF = R => { const a = int(R, 2, 5), b = int(R, 1, 9), x = int(R, 2, 6); return Q(`On donne f(x) = ${a}x + ${b}. Calcule f(${x}).`, a * x + b, null, 2, `f(${x}) = ${a} × ${x} + ${b} = ${a * x} + ${b} = ${a * x + b}`); };
  const antec = R => { const a = int(R, 2, 9), x = int(R, 2, 9); return Q(`On donne f(x) = ${a}x. Quel est l’antécédent de ${a * x} ?`, x, null, 2, `${a}x = ${a * x}, donc x = ${a * x} ÷ ${a} = ${x}`); };
  const variation = R => { const s = pick(R, [1, -1]), a = int(R, 2, 5), d = int(R, 2, 4), v = [a, a + s * d, a + s * 2 * d].map(x => Math.max(x, 0)); if (v[2] === v[1] || v[0] === v[1]) return variation(R);
    const ch = rot(R, ['croissante', 'décroissante', 'constante']);
    return C(`Une fonction f vérifie f(1) = ${v[0]}, f(2) = ${v[1]} et f(3) = ${v[2]}. Sur [1 ; 3], elle est :`, ch, ch.indexOf(s > 0 ? 'croissante' : 'décroissante'), s > 0 ? 'croissante' : 'décroissante', `les images ${s > 0 ? 'augmentent' : 'diminuent'} quand x augmente : ${v.join(' ; ')}`); };
  const coord = R => { const a = int(R, 2, 8), b = int(R, 1, 7) + (R() < .5 ? 0 : 0); if (a === b) return coord(R); const ask = pick(R, ['abscisse', 'ordonnée']), ok = ask === 'abscisse' ? a : b, ch = rot(R, [String(a), String(b), String(a + b)]);
    return C(`Le point M a pour coordonnées (${a} ; ${b}). Quelle est son ${ask} ?`, ch, ch.indexOf(String(ok)), String(ok), `dans (abscisse ; ordonnée), l’${ask} est ${ok}`); };
  /* ---------- groupement 1 : grandeurs, géométrie ---------- */
  const carre = R => { const n = int(R, 3, 10); return Q(`Calcule ${n}².`, n * n, null, 2, `${n} × ${n} = ${n * n}`); };
  const racine = R => { const n = int(R, 3, 10); return Q(`Calcule √${n * n}.`, n, null, 2, `${n} × ${n} = ${n * n}, donc √${n * n} = ${n}`); };
  const conv = R => { const [q, de, a, f, nom] = pick(R, [[3, 'm', 'cm', 100], [2.5, 'km', 'm', 1000], [4, 'cm', 'mm', 10], [4, 'm²', 'dm²', 100], [3, 'dm²', 'cm²', 100], [2, 'L', 'cm³', 1000], [5, 'dm³', 'cm³', 1000], [1.5, 'm', 'cm', 100], [6, 'm³', 'dm³', 1000]]), v = rnd(q * f, 6);
    return Q(`Convertis ${fr(q)} ${de} en ${a}.`, v, fr(v), 3, `1 ${de} = ${fr(f)} ${a} ; ${fr(q)} × ${fr(f)} = ${fr(v)} ${a}`); };
  const aire = R => { const k = int(R, 0, 1); if (k) { const L = int(R, 3, 9), l = int(R, 2, 6); return Q(`Aire d’un rectangle de ${L} cm sur ${l} cm, en cm² ?`, L * l, null, 2, `${L} × ${l} = ${L * l} cm²`); }
    const b = int(R, 3, 8) * 2, h = int(R, 2, 7); return Q(`Aire d’un triangle de base ${b} cm et de hauteur ${h} cm, en cm² ?`, b * h / 2, null, 2, `${b} × ${h} ÷ 2 = ${b * h / 2} cm²`); };
  const perim = R => { const L = int(R, 4, 12), l = int(R, 2, 8); return Q(`Périmètre d’un rectangle de ${L} cm sur ${l} cm, en cm ?`, 2 * (L + l), null, 2, `2 × (${L} + ${l}) = 2 × ${L + l} = ${2 * (L + l)} cm`); };
  const volume = R => { const a = int(R, 2, 5), b = int(R, 2, 4), c = int(R, 2, 5); return Q(`Volume d’un pavé de ${a} cm × ${b} cm × ${c} cm, en cm³ ?`, a * b * c, null, 2, `${a} × ${b} × ${c} = ${a * b * c} cm³`); };
  const solide = R => { const s = pick(R, [['cylindre', 'deux disques et une face courbe'], ['cône', 'un disque et un sommet'], ['pyramide', 'une base polygonale et un sommet'], ['boule', 'une seule surface courbe, sans arête']]), ch = rot(R, ['cylindre', 'cône', 'pyramide', 'boule']);
    return C(`Quel solide a ${s[1]} ?`, ch, ch.indexOf(s[0]), s[0], `c’est le ${s[0]}`); };
  const pyth = R => { const [a, b, c] = pick(R, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]); return Q(`Triangle rectangle de côtés de l’angle droit ${a} cm et ${b} cm. Hypoténuse, en cm ?`, c, null, 2, `${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c} et √${c * c} = ${c} cm`); };
  const thales = R => { const k = int(R, 2, 4), am = int(R, 2, 5), an = int(R, 2, 5), ab = am * k, ac = an * k; return Q(`Thalès : AM = ${am} cm, AB = ${ab} cm, AN = ${an} cm, (MN) // (BC). Calcule AC, en cm.`, ac, null, 2, `AB ÷ AM = ${ab} ÷ ${am} = ${k} ; AC = ${an} × ${k} = ${ac} cm`); };

  const A = {
    c1: [efftot, freq, moy, prop, calcMental],
    c2: [proba, contraire, fracAdd, prop, fracDec],
    c3: [qprop, coefp, mult10, arrondi, calcMental],
    c4: [pctOf, hausse, echelle, prop, mult10],
    c5: [eq1, equa, formule, signes, calcMental],
    c6: [imageF, antec, variation, coord, signes],
    c7: [coefp, antec, imageF, qprop, mult10],
    c8: [pctOf, hausse, ttc, arrondi, duree],
    c9: [carre, conv, aire, perim, solide],
    c10: [carre, racine, pyth, thales, echelle]
  };
  /* 5 du chapitre ; au-delà, d’autres automatismes du programme, tous différents ; les unités et les figures seulement pour le groupement 1 */
  /* [automatisme, premier chapitre où la notion est vue] : en début d’année, on ne tire pas une question sur une notion pas encore étudiée */
  const POOLN = [[calcMental, 0], [mult10, 0], [signes, 0], [fracAdd, 0], [fracMul, 0], [prop, 0], [fracDec, 0], [compDec, 0], [compFr, 0], [formule, 5], [eq1, 5], [arrondi, 0], [duree, 0], [efftot, 1], [freq, 1], [moy, 1], [pctOf, 0], [proba, 2], [contraire, 2], [qprop, 3], [coefp, 3], [hausse, 4], [echelle, 4], [equa, 5], [imageF, 6], [antec, 6], [variation, 6], [coord, 6], [ttc, 8]];
  const POOL = POOLN.map(x => x[0]);
  const POOL1 = [carre, racine, conv, aire, perim, volume, solide];
  const G1 = { c9: 1, c10: 1 };
  const gen = (cid, seed, n = 5) => { const R = rng(seed), own = A[cid], q = own.map(f => f(R)), num = +cid.slice(1);
    if (n > own.length) { const rest = (G1[cid] ? POOLN.concat(POOL1.map(f => [f, 1])) : POOLN).filter(([f, c]) => c <= num && !own.includes(f)).map(x => x[0]); for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; } rest.slice(0, n - own.length).forEach(f => q.push(f(R))); }
    return q; };
  /* début de chapitre : seulement des notions des chapitres précédents ou du collège */
  const genPrev = (cid, seed, n = 10) => { const R = rng(seed), num = +cid.slice(1), pool = POOLN.filter(([f, c]) => c < num).map(x => x[0]); for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; } const q = [], seen = new Set(); for (let i = 0; q.length < n && i < 6 * n; i++) { const x = pool[i % pool.length](R); if (!seen.has(x.t)) { seen.add(x.t); q.push(x); } } return q; };
  const API = { A, gen, genPrev, ALL: { calcMental, mult10, signes, fracAdd, fracMul, prop, fracDec, compDec, compFr, formule, eq1, equa, arrondi, duree, moy, freq, efftot, proba, contraire, qprop, coefp, pctOf, hausse, ttc, echelle, imageF, antec, variation, coord, carre, racine, conv, aire, perim, volume, solide, pyth, thales } };
  if (typeof module !== 'undefined') module.exports = API; else root.MCVA = API;
})(typeof module !== 'undefined' ? module.exports : window);
