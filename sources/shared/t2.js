/* CAP Maths · chapitre 2 — Probabilités : issues, événements, fluctuation et stabilisation des fréquences, probabilité, événement contraire, deux épreuves.
   Chaque exercice « Je m’entraîne » existe en trois niveaux : courant (id), 🌱 guidé (id + 'a'), 🚀 défi (id + 'd'). Toutes les réponses sont calculées. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, tb, T, svg, table, num, qcm, pick, int, xs, lv, shuffle, rnd } = H;
  const sp = n => String(n).replace(/\B(?=(\d{3})+$)/g, '\u202f');
  const f2 = x => fr(rnd(x, 2), 2), f3 = x => fr(rnd(x, 3), 3);
  const PCT = p => [{ v: rnd(p * 100, 4), m: 'Tu as écrit un pourcentage. Ici, écris la probabilité en nombre décimal (ou en fraction).' }];
  /* issues favorables d’un événement sur un dé à n faces */
  const EV = { 8: [['un nombre pair', x => x % 2 === 0], ['au moins 7', x => x >= 7], ['un multiple de 4', x => x % 4 === 0]], 10: [['un nombre pair', x => x % 2 === 0], ['au moins 8', x => x >= 8], ['un nombre strictement inférieur à 4', x => x < 4], ['un multiple de 5', x => x % 5 === 0]], 20: [['au moins 15', x => x >= 15], ['un nombre pair', x => x % 2 === 0], ['un multiple de 5', x => x % 5 === 0], ['au plus 4', x => x <= 4], ['un multiple de 4', x => x % 4 === 0]] };
  const liste = a => a.length > 8 ? `${a.slice(0, 3).join(', ')}, …, ${a[a.length - 1]}` : a.join(', ');

  /* bande de cases : n faces (numérotées) ou n jetons dont k colorés */
  const cells = (N, K, nums, lab) => { const w = 26, h = 22, g = 3, per = 10, rows = Math.ceil(N / per); let b = ''; for (let i = 0; i < N; i++) { const x = 6 + (i % per) * (w + g), y = 6 + Math.floor(i / per) * (h + g), hot = i < K; b += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="${hot ? 'k' : 'k2'} ks" stroke-width="1.4"/>` + (nums ? T(x + w / 2, y + 15, String(i + 1), { fs: 10 }) : ''); } return `<div style="max-width:${Math.min(N, per) * 29 + 12}px">${svg(12 + Math.min(N, per) * (w + g) - g, 12 + rows * (h + g) - g, b, lab)}</div>`; };
  /* barre de 0 % à 100 % : une part rouge de r jetons qui vaut pc % */
  const barre = (r, pc) => { const W = 240, x0 = 12, a = W * pc / 100, left = a < W / 2, lx = left ? x0 + a + 4 : x0 + a - 4;
    return `<div style="max-width:${Math.round((W + 24) * 1.3)}px">` + svg(W + 24, 64, `<rect x="${x0}" y="24" width="${a}" height="26" rx="4" class="k"/><rect x="${x0 + a}" y="24" width="${W - a}" height="26" rx="4" class="k2 ks" stroke-width="1.4"/>` + `<line x1="${x0 + a}" y1="16" x2="${x0 + a}" y2="24" class="ks" stroke-width="1.4"/>` + T(x0 + a / 2, 42, String(r), { fs: 12, c: 'tw' }) + T(x0 + a + (W - a) / 2, 42, 'les autres', { fs: 11 }) + T(x0, 12, '0 %', { fs: 10, a: 'start' }) + T(lx, 12, `${pc} %`, { fs: 10, a: left ? 'start' : 'end', c: 'kt' }) + T(x0 + W, 12, '100 %', { fs: 10, a: 'end' }) + T(x0 + W / 2, 62, 'tous les jetons du sac', { fs: 10, c: 'ts' }), `Une barre de 0 à 100 % : ${r} jetons rouges représentent ${pc} % des jetons`) + '</div>'; };

  /* point de départ : un booster de cartes de 20 cartes, tirage d’une carte au hasard */
  DEP.c2 = R => {
    const N = 20, peu = int(R, 4, 6), rare = int(R, 2, 3), comm = N - peu - rare, ty = ['commune', 'peu commune', 'rare'], eff = [comm, peu, rare];
    const doc = `${table(['Type de carte', 'Commune', 'Peu commune', 'Rare'], [['Nombre de cartes', comm, peu, rare]])}<p class="srcl">Un booster est un paquet de cartes à collectionner, vendu fermé. Ce booster contient ${N} cartes. On en tire une au hasard, sans regarder.</p>`;
    const ch = shuffle(R, ['tirer une carte commune', 'tirer une carte peu commune', 'tirer une carte rare']);
    return { titre: 'Un booster de 20 cartes', doc,
      qs: [{ t: 'Combien y a-t-il de cartes dans le booster ?', kind: 'num', v: N, tol: .01, a: String(N), x: `${comm} + ${peu} + ${rare} = ${N}` },
        { t: 'Quelle est la probabilité de tirer une carte rare ? (écris un nombre décimal)', kind: 'num', v: rare / N, tol: .0051, a: f2(rare / N), x: `${rare} cartes rares sur ${N} : ${rare} ÷ ${N} = ${f2(rare / N)}` },
        { t: 'Quel événement est le plus probable ?', kind: 'qcm', choices: ch, ok: ch.indexOf('tirer une carte commune'), a: 'tirer une carte commune', x: `${comm} communes contre ${peu} peu communes et ${rare} rares` },
        { t: 'Quelle est la probabilité de ne pas tirer une carte rare ? (décimal)', kind: 'num', v: 1 - rare / N, tol: .0051, a: f2(1 - rare / N), x: `1 − ${f2(rare / N)} = ${f2(1 - rare / N)}` },
        { t: 'Quelle est la probabilité de tirer une carte légendaire (il n’y en a aucune) ?', kind: 'num', v: 0, tol: .0001, a: '0', x: 'événement impossible : probabilité 0' }] };
  };

  /* e1 · issues, événement, probabilité */
  lv('c2e1', (R, niv) => {
    if (niv === 0) {
      const n = pick(R, [8, 10, 20]), [txt, f] = pick(R, EV[n]), fav = Array.from({ length: n }, (_, i) => i + 1).filter(f), k = fav.length, p = k / n;
      if (Math.abs(p * 1000 - Math.round(p * 1000)) > 1e-9 || n === 10 && k === 3 && false) return TR.c2e1(R);
      const items = [num('a', n, 0, String(n), [{ v: k, m: 'C’est le nombre d’issues favorables. Les issues possibles, ce sont toutes les faces.' }]), num('b', k, 0, String(k), [{ v: n - k, m: 'Tu as compté les issues qui ne conviennent pas.' }]),
        num('c', rnd(p, 3), 3, f3(p).replace(/0+$/, '').replace(/,$/, ''), [...PCT(p), { v: k, m: 'C’est l’effectif. Divise par le nombre d’issues possibles.' }]), num('d', rnd((1 - p) * 100, 1), 1, fr(rnd((1 - p) * 100, 1)), [{ v: rnd(p * 100, 1), m: 'C’est la probabilité de l’événement. On te demande celle de l’événement contraire : 100 % moins ce nombre.' }])];
      xs(items, { a: `les faces vont de 1 à ${n} : ${n} issues`, b: `issues favorables : ${liste(fav)}, soit ${k}`, c: `${k} ÷ ${n} = ${fr(rnd(p, 3))}`, d: `100 − ${fr(rnd(p * 100, 1))} = ${fr(rnd((1 - p) * 100, 1))} %, ou ${n - k} ÷ ${n} × 100` });
      return { titre: 'Issues et événement', consigne: `Un dé à ${n} faces, numérotées de 1 à ${n}, est équilibré : toutes les faces ont la même chance de sortir. On le lance une fois. L’événement A est « obtenir ${txt} ».`,
        support: cells(n, 0, true, `Un dé à ${n} faces : les issues sont 1, 2, …, ${n}`) + `<p class="tr-l">a. Nombre d’issues possibles : ${tb('a', String(n), 14)}</p><p class="tr-l">b. Nombre d’issues favorables à A : ${tb('b', String(k), 14)}</p><p class="tr-l">c. Probabilité de A (en décimal) : ${tb('c', fr(rnd(p, 3)), 16)}</p><p class="tr-l">d. Probabilité de l’événement contraire de A, en % : ${tb('d', fr(rnd((1 - p) * 100, 1)), 16)} %</p>`, items,
        hints: ['Les issues possibles sont toutes les faces du dé.', 'Les issues favorables sont celles qui réalisent l’événement A : écris-les, puis compte-les.', 'Probabilité = issues favorables ÷ issues possibles.', 'Contraire : 100 % moins la probabilité de A, ou issues non favorables ÷ issues possibles.'] };
    }
    if (niv < 0) {
      const N = 20, r = int(R, 3, 9), p = r / N, col = pick(R, ['rouges', 'bleus', 'verts']), items = [num('a', N, 0, String(N)), num('b', rnd(p, 2), 2, f2(p), [...PCT(p), { v: r, m: 'C’est le nombre de jetons. Divise-le par 20.' }]), num('c', rnd(p * 100, 0), 0, String(Math.round(p * 100)), [{ v: rnd(p, 2), m: 'C’est le décimal. Multiplie par 100 pour avoir un pourcentage.' }])];
      xs(items, { a: 'le sac contient 20 jetons', b: `${r} ÷ 20 = ${f2(p)}`, c: `${f2(p)} × 100 = ${Math.round(p * 100)} %` });
      return { titre: 'Une probabilité, pas à pas', consigne: `Un sac contient ${N} jetons identiques au toucher : ${r} ${col} et ${N - r} d’autres couleurs. On tire un jeton au hasard. L’événement A est « tirer un jeton ${col.replace(/s$/, '')} ».`,
        support: cells(N, r, false, `Un sac de ${N} jetons dont ${r} ${col}`) + `<p class="tr-l">Début du calcul : ${r} issues favorables sur ${N} issues possibles → ${r} ÷ ${N}</p><p class="tr-l">a. Nombre d’issues possibles : ${tb('a', String(N), 14)}</p><p class="tr-l">b. Probabilité de A (en décimal) : ${tb('b', f2(p), 16)}</p><p class="tr-l">c. La même probabilité, en % : ${tb('c', String(Math.round(p * 100)), 14)} %</p>`, items,
        hints: ['Il y a un jeton pour chaque issue : compte tous les jetons du sac.', `Probabilité = ${r} ÷ ${N}.`, 'Pour un pourcentage, multiplie le décimal par 100.'] };
    }
    const [r, pc] = pick(R, [[3, 10], [6, 20], [4, 5], [9, 15], [12, 30], [6, 12], [8, 40]]), p = pc / 100, N = r * 100 / pc, add = pick(R, [5, 10]), p2 = (r + add) / (N + add);
    const items = [num('a', N, 0, String(N), [{ v: r, m: 'C’est le nombre de jetons rouges. Si ' + pc + ' % des jetons sont rouges, il y en a plus en tout.' }]), num('b', N - r, 0, String(N - r)), num('c', rnd(1 - p, 2), 2, f2(1 - p), PCT(1 - p)), num('d', rnd(p2, 2), 2, f2(p2), [{ v: rnd(p, 2), m: 'C’est la probabilité avant l’ajout. Recompte les jetons rouges et le total.' }])];
    xs(items, { a: `${r} jetons représentent ${pc} % : 1 % correspond à ${r} ÷ ${pc} = ${fr(rnd(r / pc, 4))}, et 100 % à ${N}`, b: `${N} − ${r} = ${N - r}`, c: `1 − ${f2(p)} = ${f2(1 - p)}`, d: `(${r} + ${add}) ÷ (${N} + ${add}) = ${r + add} ÷ ${N + add} ≈ ${f2(p2)}` });
    return { titre: 'Retrouver le nombre de jetons', consigne: `Dans un sac, ${r} jetons sont rouges. La probabilité de tirer un jeton rouge au hasard est de ${pc} %. Cette fois, on connaît la probabilité et on cherche le nombre de jetons.`,
      support: barre(r, pc) + `<p class="tr-l">a. Nombre total de jetons : ${tb('a', String(N), 14)}</p><p class="tr-l">b. Nombre de jetons qui ne sont pas rouges : ${tb('b', String(N - r), 14)}</p><p class="tr-l">c. Probabilité de ne pas tirer un jeton rouge (décimal) : ${tb('c', f2(1 - p), 16)}</p><p class="tr-l">d. On ajoute ${add} jetons rouges dans le sac. Nouvelle probabilité de tirer un rouge (arrondie au centième) : ${tb('d', f2(p2), 16)}</p>`, items,
      hints: [`${pc} % des jetons correspondent à ${r} : trouve ce que vaut 1 %.`, 'Jetons qui ne sont pas rouges : total moins jetons rouges.', 'Après l’ajout, il y a plus de jetons rouges et plus de jetons en tout.'] };
  });

  /* e2 · fluctuation et stabilisation des fréquences */
  const binom = (R, n, p) => { let k = 0; for (let i = 0; i < n; i++) if (R() < p) k++; return k; };
  lv('c2e2', (R, niv) => {
    if (niv <= 0) {
      const Ns = niv < 0 ? [20, 200] : [20, 100, 500, 2000];
      let K, dv, ok = false;
      for (let t = 0; t < 400 && !ok; t++) { let k = 0, n0 = 0; K = Ns.map(N => { k += binom(R, N - n0, .5); n0 = N; return k; }); dv = K.map((k, i) => Math.abs(k / Ns[i] - .5)); ok = dv.every((d, i) => i === 0 ? d >= .04 : d < dv[i - 1] - 1e-9) && dv[0] <= .2 && K.every((k, i) => (k / Ns[i] * 1000) % 1 === 0 || true); }
      if (!ok) { K = Ns.length === 2 ? [13, 108] : [13, 56, 262, 1004]; dv = K.map((k, i) => Math.abs(k / Ns[i] - .5)); }
      const F = K.map((k, i) => k / Ns[i]), jmin = dv.indexOf(Math.min(...dv)), L = Ns.length - 1;
      const tab = table(['Nombre de lancers', ...Ns.map(sp)], [['Nombre de piles', ...K.map(String)]]);
      const ch = Ns.map(String);
      const items = niv < 0 ? [num('a', rnd(F[0], 2), 2, f2(F[0])), num('b', rnd(F[1], 3), 3, f3(F[1])), qcm('c', ch, ch.indexOf(String(Ns[jmin])), String(Ns[jmin]))] : [num('a', rnd(F[0], 2), 2, f2(F[0]), [{ v: K[0], m: 'C’est l’effectif de piles. Divise-le par le nombre de lancers.' }]), num('b', rnd(F[L], 3), 3, f3(F[L]), [{ v: K[L], m: 'C’est l’effectif de piles. Divise-le par le nombre de lancers.' }]), num('c', rnd(dv[0], 2), 2, f2(dv[0])), qcm('d', ch, ch.indexOf(String(Ns[jmin])), String(Ns[jmin]))];
      const m = { a: `${K[0]} ÷ ${sp(Ns[0])} = ${f2(F[0])}`, b: `${K[niv < 0 ? 1 : L]} ÷ ${Ns[niv < 0 ? 1 : L]} = ${f3(F[niv < 0 ? 1 : L])}` };
      if (niv < 0) m.c = `les écarts à 0,5 sont ${F.map(f => f3(Math.abs(f - .5))).join(' puis ')} : le plus petit est pour ${sp(Ns[jmin])} lancers`; else { m.c = `|${f2(F[0])} − 0,5| = ${f2(dv[0])}`; m.d = `écarts à 0,5 : ${dv.map(d => f3(d)).join(' ; ')} : le plus petit est pour ${sp(Ns[jmin])} lancers`; }
      xs(items, m);
      return { titre: niv < 0 ? 'Observer les fréquences, pas à pas' : 'Fluctuation et stabilisation', consigne: `On simule des lancers d’une pièce équilibrée. La probabilité d’obtenir « pile » est 0,5. Le tableau donne le nombre de piles obtenus.`,
        support: tab + (niv < 0 ? `<p class="tr-l">a. Fréquence de pile pour ${sp(Ns[0])} lancers : ${tb('a', f2(F[0]), 16)}</p><p class="tr-l">b. Fréquence de pile pour ${sp(Ns[1])} lancers (au millième) : ${tb('b', f3(F[1]), 16)}</p><p class="tr-l">c. Avec combien de lancers la fréquence est-elle la plus proche de 0,5 ?</p>` : `<p class="tr-l">a. Fréquence de pile pour ${sp(Ns[0])} lancers : ${tb('a', f2(F[0]), 16)}</p><p class="tr-l">b. Fréquence de pile pour ${sp(Ns[L])} lancers (arrondie au millième) : ${tb('b', f3(F[L]), 16)}</p><p class="tr-l">c. Écart entre la fréquence pour ${sp(Ns[0])} lancers et 0,5 : ${tb('c', f2(dv[0]), 16)}</p><p class="tr-l">d. Avec combien de lancers la fréquence est-elle la plus proche de 0,5 ?</p>`), items,
        hints: ['Fréquence = nombre de piles ÷ nombre de lancers.', 'L’écart à 0,5 : la différence entre la fréquence et 0,5, sans signe.', 'Plus on lance de fois, plus la fréquence se rapproche de la probabilité.'] };
    }
    const p = pick(R, [.05, .1, .15, .2]), N = pick(R, [500, 1000, 2000]), att = p * N, dl = int(R, 2, 5) * (R() < .5 ? -1 : 1) * Math.round(att / 50), obs = att + dl, nm = pick(R, ['rares', 'brillantes']);
    const items = [num('a', att, 0, String(att), [{ v: rnd(p * 100, 0), m: 'C’est un pourcentage. Calcule p × nombre d’essais.' }]), num('b', rnd(obs / N, 3), 3, f3(obs / N), [{ v: obs, m: 'C’est l’effectif observé. Divise-le par le nombre d’essais.' }]), num('c', Math.abs(dl), 0, String(Math.abs(dl))), qcm('d', ['oui', 'non'], 1, 'non')];
    xs(items, { a: `${fr(p)} × ${N} = ${att}`, b: `${obs} ÷ ${N} = ${f3(obs / N)}`, c: `|${obs} − ${att}| = ${Math.abs(dl)}`, d: 'le hasard fait fluctuer : on peut prévoir à peu près, pas exactement, surtout avec peu d’essais' });
    return { titre: 'Prévoir et comparer', consigne: `Dans un jeu de cartes, la probabilité qu’un booster contienne une carte ${nm.replace(/s$/, '')} est ${fr(p)}. Une boutique en ouvre ${N} et en compte ${obs} avec une carte ${nm.replace(/s$/, '')}.`,
      support: table(['', 'Boosters ouverts', `Avec une carte ${nm.replace(/s$/, '')}`], [['Observé', fr(N), fr(obs)]]) + `<p class="tr-l">a. Nombre de boosters attendu avec une carte ${nm.replace(/s$/, '')} (probabilité × ${N}) : ${tb('a', String(att), 14)}</p><p class="tr-l">b. Fréquence observée, au millième : ${tb('b', f3(obs / N), 16)}</p><p class="tr-l">c. Écart entre le nombre observé et le nombre attendu : ${tb('c', String(Math.abs(dl)), 14)}</p><p class="tr-l">d. Peut-on prévoir exactement le nombre obtenu en ouvrant 10 boosters ?</p>`, items,
      hints: ['Nombre attendu = probabilité × nombre d’essais.', 'Fréquence observée = effectif observé ÷ nombre d’essais.', 'Le hasard fait fluctuer les résultats : est-ce exact ?'] };
  });

  /* e3 · événement contraire et deux épreuves */
  const grille = (rows, cols, hl) => `<table class="dt tcx dt-sm"><thead><tr><th></th>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr><th>${r}</th>${cols.map(c => `<td${hl(r, c) ? ' class="hlc"' : ''}>${r[0]}${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  lv('c2e3', (R, niv) => {
    if (niv < 0) {
      const ev = pick(R, [['deux faces', 'FF', 1], ['deux piles', 'PP', 1]]), nc = 1 - 1 / 4;
      const items = [num('a', 4, 0, '4', [{ v: 2, m: 'Une pièce a 2 issues, mais ici on lance deux pièces : 2 × 2.' }]), num('b', .25, 2, '0,25', [{ v: 1, m: 'C’est le nombre d’issues favorables. Divise-le par 4.' }, { v: 25, m: 'C’est un pourcentage. Écris un nombre décimal.' }]), num('c', .75, 2, '0,75', [{ v: .25, m: 'C’est la probabilité de l’événement. On te demande celle du contraire : 1 − 0,25.' }])];
      xs(items, { a: 'PP, PF, FP, FF : 4 issues, ou 2 × 2', b: `1 issue favorable (${ev[1]}) sur 4 : 1 ÷ 4 = 0,25`, c: `« ${ev[0] === 'deux faces' ? 'au moins un pile' : 'au moins une face'} » est le contraire de « ${ev[0]} » : 1 − 0,25 = 0,75` });
      return { titre: 'Deux pièces, pas à pas', consigne: `On lance deux pièces équilibrées l’une après l’autre. Chaque pièce donne pile (P) ou face (F). Voici toutes les issues. L’événement A est « ${ev[0]} ».`,
        support: grille(['P', 'F'], ['P', 'F'], (r, c) => r + c === ev[1]) + `<p class="tr-l">a. Nombre d’issues possibles : ${tb('a', '4', 14)}</p><p class="tr-l">b. Probabilité de A (décimal) : ${tb('b', '0,25', 16)}</p><p class="tr-l">c. Probabilité de « ${ev[0] === 'deux faces' ? 'au moins un pile' : 'au moins une face'} », le contraire de A : ${tb('c', '0,75', 16)}</p>`, items,
        hints: ['Compte les cases du tableau : 2 lignes × 2 colonnes.', 'Une seule case est colorée : 1 issue favorable.', 'Le contraire de A : 1 − P(A).'] };
    }
    if (niv === 0) {
      const ev = pick(R, [['pile', x => x % 2 === 0, 'un nombre pair', 'P'], ['face', x => x >= 5, 'un nombre au moins égal à 5', 'F'], ['pile', x => x % 3 === 0, 'un multiple de 3', 'P'], ['face', x => x % 2 === 1, 'un nombre impair', 'F']]);
      const D = [1, 2, 3, 4, 5, 6], fav = D.filter(ev[1]).length, p = fav / 12, pc = 1 - p;
      const tab = `<table class="dt tcx dt-sm"><thead><tr><th>Pièce \\ Dé</th>${D.map(d => `<th>${d}</th>`).join('')}</tr></thead><tbody>${['P', 'F'].map(s => `<tr><th>${s === 'P' ? 'Pile' : 'Face'}</th>${D.map(d => `<td>${s}${d}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      const items = [num('a', 12, 0, '12', [{ v: 6, m: 'Il y a 6 issues pour le dé et 2 pour la pièce : multiplie.' }, { v: 8, m: 'Tu as additionné 2 et 6. Il faut multiplier.' }]), num('b', fav, 0, String(fav), [{ v: 12 - fav, m: 'Tu as compté les issues qui ne conviennent pas.' }]), num('c', rnd(p, 2), 2, f2(p), [{ v: fav, m: 'C’est le nombre d’issues favorables. Divise-le par 12.' }, ...PCT(p)]), num('d', rnd(pc, 2), 2, f2(pc), [{ v: rnd(p, 2), m: 'C’est P(A). Le contraire : 1 − P(A).' }])];
      xs(items, { a: '2 issues pour la pièce × 6 issues pour le dé = 12', b: `${ev[2] === 'un nombre pair' ? '2, 4, 6' : D.filter(ev[1]).join(', ')} avec ${ev[0]} : ${fav} cases`, c: `${fav} ÷ 12 = ${fr(rnd(p, 4))}, soit ${f2(p)} au centième`, d: `1 − ${fr(rnd(p, 4))} = ${fr(rnd(pc, 4))}, soit ${f2(pc)}` });
      return { titre: 'Une pièce et un dé', consigne: `On lance une pièce équilibrée, puis un dé à 6 faces équilibré. Le tableau donne les 12 issues possibles. L’événement A est « ${ev[0]} et ${ev[2]} ».`,
        support: tab + `<p class="tr-l">a. Nombre d’issues possibles : ${tb('a', '12', 14)}</p><p class="tr-l">b. Nombre d’issues favorables à A : ${tb('b', String(fav), 14)}</p><p class="tr-l">c. Probabilité de A${Math.abs(p * 100 - Math.round(p * 100)) > 1e-9 ? ' (arrondie au centième)' : ', en écriture décimale'} : ${tb('c', f2(p), 16)}</p><p class="tr-l">d. Probabilité de l’événement contraire de A${Math.abs(p * 100 - Math.round(p * 100)) > 1e-9 ? ' (arrondie au centième)' : ', en écriture décimale'} : ${tb('d', f2(pc), 16)}</p>`, items,
        hints: ['Nombre d’issues : 2 résultats de pièce × 6 résultats de dé.', `Cherche les cases de la ligne « ${ev[0]} » dont le dé vérifie : ${ev[2]}.`, 'Probabilité = issues favorables ÷ issues possibles.', 'Contraire : 1 moins la probabilité de A.'] };
    }
    const k = pick(R, [9, 10, 11]), tot = []; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) tot.push(a + b);
    const fav = tot.filter(s => s >= k).length, p = fav / 36, nc = 36 - fav, sums = [2, ...Array(11).keys()].slice(1).map(x => x + 1), cnt = s => tot.filter(x => x === s).length, best = 7;
    const ch = shuffle(R, ['6', '7', '8']), items = [num('a', 36, 0, '36', [{ v: 12, m: 'Tu as additionné 6 + 6. Deux dés : 6 × 6.' }]), num('b', fav, 0, String(fav), [{ v: nc, m: 'Tu as compté les issues qui ne conviennent pas.' }]), num('c', rnd(p, 2), 2, f2(p), PCT(p)), num('d', rnd(1 - p, 2), 2, f2(1 - p)), qcm('e', ch, ch.indexOf('7'), '7')];
    const sk = []; for (let s = k; s <= 12; s++) sk.push(`${s} : ${cnt(s)}`);
    xs(items, { a: '6 issues pour le premier dé × 6 issues pour le second = 36', b: `sommes ${k} à 12 : ${sk.join(' ; ')} → ${fav} issues`, c: `${fav} ÷ 36 = ${fr(rnd(p, 4))}, soit ${f2(p)} au centième`, d: `1 − ${fr(rnd(p, 4))} = ${fr(rnd(1 - p, 4))}, soit ${f2(1 - p)} ; ou ${nc} ÷ 36`, e: 'la somme 7 apparaît 6 fois sur 36, plus que 6 (5 fois) ou 8 (5 fois)' });
    const rows = [1, 2, 3, 4, 5, 6], head = ['Dé 1 \\ Dé 2', ...rows];
    return { titre: 'Deux dés : la somme', consigne: `On lance deux dés à 6 faces équilibrés et on additionne les deux nombres. L’événement A est « obtenir une somme d’au moins ${k} ». Le tableau donne toutes les sommes possibles ; à toi de repérer celles qui conviennent.`,
      support: table(head, rows.map(a => [String(a), ...rows.map(b => String(a + b))])) + `<p class="tr-l">a. Nombre d’issues possibles : ${tb('a', '36', 14)}</p><p class="tr-l">b. Nombre d’issues favorables à A : ${tb('b', String(fav), 14)}</p><p class="tr-l">c. Probabilité de A (au centième) : ${tb('c', f2(p), 16)}</p><p class="tr-l">d. Probabilité de l’événement contraire (au centième) : ${tb('d', f2(1 - p), 16)}</p><p class="tr-l">e. Quelle somme est la plus probable ?</p>`, items,
      hints: ['Deux dés : 6 × 6 issues.', `Compte dans le tableau les cases dont la somme est ${k} ou plus.`, 'Probabilité = issues favorables ÷ 36.', 'La somme qui apparaît le plus souvent dans le tableau est la plus probable.'] };
  });
  if (typeof module !== 'undefined') module.exports = { EV };
  /* ===== exercice ajouté (3 niveaux) : notion 1 (expérience aléatoire, issues et événements) ===== */
  {
    const { fr, rnd, pick, int, shuffle, table, tb, svg, T, num, qcm, ln, tabXY, lv, eur, L } = H;
    /* trame d’un exercice : rows { lab, v, d, a, x, err, w, un } ou { lab, qcm, ok, x } ; aide : ligne d’aide du niveau guidé */
    const QC = (titre, consigne, rows, hints, pre = '', aide = '') => {
      const items = rows.map((r, i) => { const k = L[i], d = r.d == null ? 2 : r.d; const it = r.qcm ? qcm(k, r.qcm, r.ok, r.a) : num(k, r.v, d, r.a != null ? r.a : (Number.isInteger(rnd(r.v, d)) ? fr(r.v, 0) : d === 2 ? fr(r.v, 2) : fr(rnd(r.v, d))), r.err || []); if (r.x) it.x = r.x; return it; });
      return { titre, consigne, support: pre + (aide ? `<p class="tr-l">Aide : ${aide}</p>` : '') + rows.map((r, i) => r.qcm ? `<p class="tr-l">${L[i]}. ${r.lab}</p>` : ln(L[i], r.lab, items[i].a, r.w || 14, r.un || '')).join(''), items, hints };
    };
    lv('c2e4', (R, niv) => {
      if (niv < 0) {
        const pair = pick(R, ['pair', 'impair']), nf = 3, imp = pick(R, [7, 8, 9]);
        return QC('Un dé : issues et événements, pas à pas', 'On lance un dé à 6 faces numérotées de 1 à 6 et on regarde le numéro obtenu.', [
          { lab: 'Nombre d’issues possibles', v: 6, d: 0, w: 12, x: 'Le dé a 6 faces : les issues sont 1, 2, 3, 4, 5 et 6.' },
          { lab: `Nombre d’issues favorables à « obtenir un nombre ${pair} »`, v: nf, d: 0, w: 12, x: pair === 'pair' ? 'Nombres pairs : 2, 4 et 6, soit 3 issues.' : 'Nombres impairs : 1, 3 et 5, soit 3 issues.' },
          { lab: `« Obtenir ${imp} » est un événement…`, qcm: ['impossible', 'certain', 'possible mais pas certain'], ok: 0, x: `Aucune face ne porte ${imp} : l’événement n’a aucune issue favorable, il est impossible.` },
          { lab: '« Obtenir un nombre entre 1 et 6 » est un événement…', qcm: ['impossible', 'certain', 'possible mais pas certain'], ok: 1, x: 'Toutes les faces portent un nombre entre 1 et 6 : toutes les issues sont favorables, l’événement est certain.' }],
          ['Les issues sont tous les résultats possibles.', 'Les issues favorables sont celles qui réalisent l’événement.', 'Impossible : aucune issue favorable. Certain : toutes les issues sont favorables.'],
          table(['Dé', 'Faces'], [['Numéros', '1 · 2 · 3 · 4 · 5 · 6']]), 'compte les faces une par une.');
      }
      if (niv === 0) {
        const r = int(R, 3, 8), b = int(R, 3, 8), v = int(R, 2, 6), N = r + b + v;
        return QC('Un sac de boules : issues et événements', 'On tire une boule au hasard dans un sac, sans regarder.', [
          { lab: 'Nombre d’issues possibles', v: N, d: 0, w: 12, x: `${r} + ${b} + ${v} = ${N} boules, donc ${N} issues possibles.`, err: [{ v: 3, m: 'Chaque boule est une issue : additionne le nombre de boules de chaque couleur.' }] },
          { lab: 'Nombre d’issues favorables à « tirer une boule rouge »', v: r, d: 0, w: 12, x: `Il y a ${r} boules rouges : ${r} issues favorables.` },
          { lab: 'Nombre d’issues favorables à « ne pas tirer de boule rouge »', v: N - r, d: 0, w: 12, x: `${N} − ${r} = ${N - r} boules qui ne sont pas rouges.` },
          { lab: '« Tirer une boule jaune » est un événement…', qcm: ['impossible', 'certain', 'possible mais pas certain'], ok: 0, x: 'Il n’y a aucune boule jaune : l’événement est impossible.' },
          { lab: '« Tirer une boule rouge, bleue ou verte » est un événement…', qcm: ['impossible', 'certain', 'possible mais pas certain'], ok: 1, x: 'Toutes les boules sont rouges, bleues ou vertes : l’événement est certain.' }],
          ['Une issue = une boule possible. Additionne toutes les boules.', 'Issues favorables : celles qui réalisent l’événement.', 'Impossible : aucune issue favorable. Certain : toutes.'],
          table(['Couleur', 'rouge', 'bleue', 'verte'], [['Nombre de boules', r, b, v]]));
      }
      const N = pick(R, [12, 15, 18, 20]), m = pick(R, [3, 4]), fa = Math.floor(N / m), both = Math.floor(N / (m * 2));
      return QC('Une roue numérotée : issues et événements', `Une roue est partagée en ${N} secteurs égaux numérotés de 1 à ${N}. On la fait tourner : le secteur indiqué donne le résultat.`, [
        { lab: 'Nombre d’issues possibles', v: N, d: 0, w: 12, x: `Il y a ${N} secteurs : ${N} issues.` },
        { lab: `Nombre d’issues favorables à « le numéro est un multiple de ${m} »`, v: fa, d: 0, w: 12, x: `Multiples de ${m} jusqu’à ${N} : ${Array.from({ length: fa }, (_, i) => m * (i + 1)).join(', ')}, soit ${fa} issues.`, err: [{ v: m, m: 'Compte tous les multiples jusqu’à ' + N + '.' }] },
        { lab: `Nombre d’issues favorables à « le numéro est pair ET multiple de ${m} »`, v: both, d: 0, w: 12, x: `Il faut un multiple de ${m * 2} : ${Array.from({ length: both }, (_, i) => m * 2 * (i + 1)).join(', ')}, soit ${both} issue${both > 1 ? 's' : ''}.` },
        { lab: `Nombre d’issues favorables à « le numéro n’est pas un multiple de ${m} »`, v: N - fa, d: 0, w: 12, x: `${N} − ${fa} = ${N - fa}` },
        { lab: `« Obtenir un numéro plus grand que ${N} » est un événement…`, qcm: ['impossible', 'certain', 'possible mais pas certain'], ok: 0, x: `Les numéros vont de 1 à ${N} : aucune issue n’est favorable, l’événement est impossible.` }],
        ['Écris la liste des numéros favorables avant de les compter.', 'Pair et multiple de ' + m + ' : les deux conditions à la fois.', 'Le contraire d’un événement : toutes les autres issues.'],
        table(['Roue', 'Numéros'], [['Secteurs', `de 1 à ${N}`]]));
    });
  }
})(typeof module !== 'undefined' ? module.exports : window);
