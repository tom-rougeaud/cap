/* Maths · CAP — rubrique « Je manipule » des chapitres 4 à 10. Tout se calcule dans le navigateur ; rien n’est envoyé ni enregistré. */
(function () {
  'use strict';
  const M = window.MCVG, fr = M.fr, rnd = M.rnd, W = window.MCVW, { slider, box, defi, setDefi, kpi, val, out } = W._h, P = window.MCVPIE;

  /* 4 · du prix de départ au taux d’évolution */
  W.c4 = el => {
    el.innerHTML = box('Du prix de départ au taux d’évolution', 'Un prix passe d’une valeur de départ à une valeur d’arrivée. Change les deux curseurs : l’écart, le coefficient multiplicateur et le taux d’évolution se recalculent.',
      `<div class="wg-grid">${slider('c4-a', 'Prix de départ', 10, 200, 1, 80, '€')}${slider('c4-b', 'Prix d’arrivée', 10, 300, 1, 100, '€')}</div><div class="wg-svg" id="c4-g"></div><div class="wg-kpis" id="c4-k"></div><p class="wg-v" id="c4-v"></p>${defi('c4-d', 'Pour un prix de départ de 80 €, règle le prix d’arrivée pour obtenir une <b>hausse de 25 %</b> exactement.')}`);
    const up = () => {
      out(el, ['c4-a', 'c4-b']);
      const a = val(el, 'c4-a'), b = val(el, 'c4-b'), e = rnd(b - a, 2), co = b / a, tx = e / a * 100;
      el.querySelector('#c4-g').innerHTML = `<svg viewBox="0 0 320 190" class="pic" role="img" aria-label="Deux barres : le prix de départ ${a} euros et le prix d’arrivée ${b} euros">${P.bars({ x0: 50, y0: 160, pitch: 110, bw: 70, u: .4, vals: [a, b], cats: ['avant', 'après'], ticks: [0, 50, 100, 150, 200, 250, 300], minor: [25, 75, 125, 175, 225, 275], vmax: 300, unit: 'prix en €', fs: 11, vfs: 13, color: i => i ? P.col(0) : P.col(5) })}</svg>`;
      el.querySelector('#c4-k').innerHTML = kpi('Écart', (e > 0 ? '+' : '') + fr(e) + ' €') + kpi('Coefficient multiplicateur', '× ' + fr(rnd(co, 3)), 'hot') + kpi('Taux d’évolution', (tx > 0 ? '+' : '') + fr(rnd(tx, 1)) + ' %', 'hot');
      el.querySelector('#c4-v').innerHTML = e === 0 ? 'Le prix ne change pas : le coefficient vaut 1.' : `${e > 0 ? '📈 Hausse' : '📉 Baisse'} : (${fr(b)} − ${fr(a)}) ÷ ${fr(a)} = ${fr(rnd(e / a, 3))}, soit <b>${fr(rnd(tx, 1))} %</b>. On divise par le prix de <b>départ</b>.`;
      setDefi(el, 'c4-d', a === 80 && Math.abs(tx - 25) < 1e-9);
    };
    el.addEventListener('input', up); up();
  };

  /* 5 · un club de jeux : le prix de n séances et le budget */
  W.c5 = el => {
    el.innerHTML = box('Combien de séances pour mon budget ?', 'Un club demande une inscription puis un prix par séance : P = a × n + b. Change les curseurs : les barres donnent le prix de 1 à 10 séances, la ligne rouge est ton budget.',
      `<div class="wg-grid">${slider('c5-a', 'Prix par séance', 1, 5, .5, 2.5, '€')}${slider('c5-b', 'Inscription', 0, 15, 1, 5, '€')}${slider('c5-c', 'Budget', 10, 80, 1, 40, '€')}</div><div class="wg-svg" id="c5-g"></div><div class="wg-kpis" id="c5-k"></div><p class="wg-v" id="c5-v"></p>${defi('c5-d', 'Avec un prix de <b>2,50 €</b> par séance et <b>5 €</b> d’inscription, règle le budget pour payer <b>exactement 10 séances</b>.')}`);
    const up = () => {
      out(el, ['c5-a', 'c5-b', 'c5-c']);
      const a = val(el, 'c5-a'), b = val(el, 'c5-b'), c = val(el, 'c5-c'), N = Math.max(0, Math.floor(rnd((c - b) / a, 6))), x = (c - b) / a, V = Array.from({ length: 10 }, (_, i) => rnd(a * (i + 1) + b, 2));
      el.querySelector('#c5-g').innerHTML = `<svg viewBox="0 0 360 200" class="pic" role="img" aria-label="Prix de 1 à 10 séances avec ${fr(a)} euros par séance et ${fr(b)} euros d’inscription, budget ${fr(c)} euros">${P.bars({ x0: 44, y0: 160, pitch: 29, bw: 22, u: 1.7, vals: V, cats: V.map((_, i) => i + 1), ticks: [0, 20, 40, 60, 80], minor: [10, 30, 50, 70], vmax: 80, unit: 'prix P en €', fs: 10.5, vfs: 9.5, mean: c, color: i => V[i] <= c ? P.col(5) : P.col(0) })}<text x="190" y="190" font-size="10.5" font-weight="700" text-anchor="middle" fill="#1D2240" font-family="Inter">nombre de séances n</text></svg>`;
      el.querySelector('#c5-k').innerHTML = kpi('Séances complètes', String(N), 'hot') + kpi('Prix de ' + N + ' séance' + (N > 1 ? 's' : ''), fr(rnd(a * N + b, 2)) + ' €') + kpi('Solution exacte de x', c < b ? '—' : fr(rnd(x, 2)));
      el.querySelector('#c5-v').innerHTML = c < b ? 'Le budget ne couvre même pas l’inscription.' : `${fr(a)}x + ${fr(b)} = ${fr(c)} donne ${fr(a)}x = ${fr(rnd(c - b, 2))}, puis x = ${fr(rnd(c - b, 2))} ÷ ${fr(a)} = ${fr(rnd(x, 2))}. ${N >= 10 ? 'Au-delà de 10 séances, le graphique s’arrête, mais le calcul continue.' : ''} On ne paie que des séances <b>entières</b> : ${N} séance${N > 1 ? 's' : ''} complète${N > 1 ? 's' : ''}.`;
      setDefi(el, 'c5-d', a === 2.5 && b === 5 && c === 30);
    };
    el.addEventListener('input', up); up();
  };

  /* 6 · le saut d’un personnage : image, antécédent, maximum */
  W.c6 = el => {
    el.innerHTML = box('Le saut d’un personnage de jeu vidéo', 'La hauteur est h = 4 × t − 2 × t × t. Déplace le curseur du temps : le point suit la courbe, et les lignes de lecture donnent l’image. Active ensuite la hauteur à retrouver pour lire un antécédent.',
      `<div class="wg-grid">${slider('c6-t', 'Temps t', 0, 2, .05, 0.5, 's')}${slider('c6-h', 'Hauteur à retrouver', 0, 2, .05, 1.5, 'm')}</div><div class="wg-svg" id="c6-g"></div><div class="wg-kpis" id="c6-k"></div><p class="wg-v" id="c6-v"></p>${defi('c6-d', 'Place le curseur du temps sur l’instant où la hauteur est <b>maximale</b> (2 m).')}`);
    const G = window.MCVP, f = t => 4 * t - 2 * t * t;
    const up = () => {
      out(el, ['c6-t', 'c6-h']);
      const t = val(el, 'c6-t'), hh = val(el, 'c6-h'), h = rnd(f(t), 3);
      /* 2t² − 4t + h = 0 : t = 1 ± √(1 − h/2) */
      const q = 1 - hh / 2, t1 = rnd(1 - Math.sqrt(Math.max(0, q)), 2), t2 = rnd(1 + Math.sqrt(Math.max(0, q)), 2);
      const g = G.plot({ W: 360, H: 220, x: [0, 2, .25], y: [0, 2.5, .5], ml: 38, mr: 12, mt: 16, mb: 34, fs: 10.5, lx: 2, ly: 1, xl: 't (s)', yl: 'h (m)', lab: 'La courbe du saut, le point au temps choisi et la hauteur à retrouver' });
      let b = g.base + g.curve(f, { w: 3 });
      b += `<line x1="${g.X(0).toFixed(1)}" y1="${g.Y(hh).toFixed(1)}" x2="${g.X(2).toFixed(1)}" y2="${g.Y(hh).toFixed(1)}" stroke="#1D5FC2" stroke-width="1.8" stroke-dasharray="6 4"/>`;
      b += `<path d="M${g.X(t).toFixed(1)} ${g.Y(0).toFixed(1)}V${g.Y(h).toFixed(1)}H${g.X(0).toFixed(1)}" fill="none" stroke="#C2332A" stroke-width="2" stroke-dasharray="6 4"/>` + g.pts([[t, h]], { r: 5.5 });
      el.querySelector('#c6-g').innerHTML = g.wrap(b);
      el.querySelector('#c6-k').innerHTML = kpi('Temps t', fr(t) + ' s') + kpi('Image h(t)', fr(h) + ' m', 'hot') + kpi('Antécédents de ' + fr(hh) + ' m', q < 0 ? 'aucun' : (q === 0 ? fr(1) + ' s' : fr(t1) + ' s et ' + fr(t2) + ' s'), 'hot');
      el.querySelector('#c6-v').innerHTML = `Au temps ${fr(t)} s, la hauteur est <b>${fr(h)} m</b> (ligne rouge). La ligne bleue à ${fr(hh)} m coupe la courbe ${q < 0 ? 'nulle part' : (q === 0 ? 'en un seul point, le maximum' : 'en deux points : à la montée et à la descente')}. ${h === 2 ? 'C’est le <b>maximum</b>.' : (t < 1 ? 'Ici la fonction est <b>croissante</b>.' : 'Ici la fonction est <b>décroissante</b>.')}`;
      setDefi(el, 'c6-d', Math.abs(h - 2) < 1e-9);
    };
    el.addEventListener('input', up); up();
  };

  /* 7 · deux formules de séances : où les droites se croisent-elles ? */
  W.c7 = el => {
    el.innerHTML = box('Deux formules de séances de cinéma', 'La formule A coûte A(x) = p × x. La formule B coûte B(x) = q × x + r. Change les prix : les droites se déplacent, et le croisement indique quand les deux formules coûtent pareil.',
      `<div class="wg-grid">${slider('c7-p', 'Formule A : prix par séance (p)', 5, 12, 1, 9, '€')}${slider('c7-q', 'Formule B : prix par séance (q)', 3, 9, 1, 7, '€')}${slider('c7-r', 'Formule B : prix de la carte (r)', 0, 30, 1, 12, '€')}${slider('c7-n', 'Nombre de séances x', 0, 10, 1, 4, '')}</div><div class="wg-svg" id="c7-g"></div><div class="wg-kpis" id="c7-k"></div><p class="wg-v" id="c7-v"></p>${defi('c7-d', 'Avec A à <b>9 €</b>, B à <b>7 €</b> et une carte à <b>12 €</b>, place le curseur sur le nombre de séances où les deux formules coûtent <b>pareil</b>.')}`);
    const G = window.MCVP;
    const up = () => {
      out(el, ['c7-p', 'c7-q', 'c7-r', 'c7-n']);
      const p = val(el, 'c7-p'), q = val(el, 'c7-q'), r = val(el, 'c7-r'), n = val(el, 'c7-n'), A = p * n, B = q * n + r;
      const top = Math.max(p * 10, q * 10 + r), ym = Math.ceil(top / 20) * 20, xs = p > q ? r / (p - q) : null, cross = xs !== null && xs > 0 && xs <= 10;
      const g = G.plot({ W: 360, H: 220, x: [0, 10, 1], y: [0, ym, ym / 5], ml: 38, mr: 26, mt: 16, mb: 34, fs: 10.5, lx: 1, ly: 1, xl: 'nombre de séances x', yl: 'prix en €', lab: 'Les droites des formules A et B, avec le point correspondant au nombre de séances choisi' });
      let yA = g.Y(p * 10) + 4, yB = g.Y(q * 10 + r) + 4; if (Math.abs(yA - yB) < 15) { if (yA <= yB) { yA -= 7; yB += 7; } else { yA += 7; yB -= 7; } }
      const tl = (y, s, c) => `<text x="${(g.X(10) + 6).toFixed(1)}" y="${y.toFixed(1)}" font-family="Inter" font-size="13" font-weight="800" fill="${c}">${s}</text>`;
      let b = g.base + g.line(p, 0, { stroke: '#1D5FC2', w: 3 }) + g.line(q, r, { stroke: '#C2332A', w: 3 }) + tl(yA, 'A', '#1D5FC2') + tl(yB, 'B', '#C2332A');
      b += `<line x1="${g.X(n).toFixed(1)}" y1="${g.Y(0).toFixed(1)}" x2="${g.X(n).toFixed(1)}" y2="${g.Y(Math.max(A, B)).toFixed(1)}" stroke="#1D2240" stroke-width="1.6" stroke-dasharray="5 4"/>` + g.pts([[n, A]], { r: 5, fill: '#1D5FC2' }) + g.pts([[n, B]], { r: 5, fill: '#C2332A' });
      if (cross) b += `<circle cx="${g.X(xs).toFixed(1)}" cy="${g.Y(p * xs).toFixed(1)}" r="6" fill="#fff" stroke="#1D2240" stroke-width="2.4"/>`;
      el.querySelector('#c7-g').innerHTML = g.wrap(b);
      el.querySelector('#c7-k').innerHTML = kpi('Prix avec A', fr(A) + ' €') + kpi('Prix avec B', fr(B) + ' €') + kpi('Moins chère', A === B ? 'égalité' : (A < B ? 'A' : 'B'), 'hot') + kpi('Égalité à x =', p > q ? fr(rnd(xs, 2)) : '—');
      el.querySelector('#c7-v').innerHTML = `Pour ${n} séance${n > 1 ? 's' : ''} : A = ${fr(p)} × ${n} = <b>${fr(A)} €</b> ; B = ${fr(q)} × ${n} + ${fr(r)} = <b>${fr(B)} €</b>. ` + (p > q ? `Les deux coûtent pareil quand ${fr(p)}x = ${fr(q)}x + ${fr(r)}, donc ${fr(p - q)}x = ${fr(r)}, soit x = ${fr(rnd(xs, 2))}. ${cross ? 'Avant ce nombre de séances, A est moins chère ; après, B est moins chère.' : 'Ce croisement est hors du graphique.'}` : `Comme p n’est pas plus grand que q, la formule A n’est jamais plus chère que la formule B${r === 0 && p === q ? ' (les deux sont identiques)' : ''}.`);
      setDefi(el, 'c7-d', p === 9 && q === 7 && r === 12 && n === 6);
    };
    el.addEventListener('input', up); up();
  };

  /* 8 · de la remise au prix TTC */
  W.c8 = el => {
    el.innerHTML = box('De la remise au total TTC', 'Une facture : prix brut HT, remise, net commercial HT, TVA, total TTC. Change les trois curseurs : les lignes de la facture et les barres se recalculent. Taux de TVA usuels : 5,5 %, 10 % et 20 %.',
      `<div class="wg-grid">${slider('c8-a', 'Prix brut HT', 10, 200, 5, 80, '€')}${slider('c8-r', 'Remise', 0, 40, 5, 15, '%')}${slider('c8-t', 'Taux de TVA', 0, 20, .5, 20, '%')}</div><div class="wg-svg" id="c8-g"></div><div class="wg-kpis" id="c8-k"></div><p class="wg-v" id="c8-v"></p>${defi('c8-d', 'Avec un prix brut de <b>80 € HT</b> et <b>20 %</b> de TVA, règle la remise pour obtenir un total TTC de <b>76,80 €</b>.')}`);
    const up = () => {
      out(el, ['c8-a', 'c8-r', 'c8-t']);
      const a = val(el, 'c8-a'), r = val(el, 'c8-r'), t = val(el, 'c8-t'), rem = rnd(a * r / 100, 2), net = rnd(a - rem, 2), tva = rnd(net * t / 100, 2), ttc = rnd(net + tva, 2);
      el.querySelector('#c8-g').innerHTML = `<svg viewBox="0 0 320 190" class="pic" role="img" aria-label="Trois barres : prix brut ${fr(a)} euros, net commercial ${fr(net)} euros, total toutes taxes comprises ${fr(ttc)} euros">${P.bars({ x0: 50, y0: 160, pitch: 85, bw: 60, u: .48, vals: [a, net, ttc], cats: ['brut HT', 'net HT', 'TTC'], ticks: [0, 50, 100, 150, 200, 250], minor: [25, 75, 125, 175, 225], vmax: 250, unit: 'montant en €', fs: 11, vfs: 13, color: i => i === 2 ? P.col(5) : P.col(i === 0 ? 0 : 2) })}</svg>`;
      el.querySelector('#c8-k').innerHTML = kpi('Remise', fr(rem) + ' €') + kpi('Net commercial HT', fr(net) + ' €') + kpi('TVA', fr(tva) + ' €') + kpi('Total TTC', fr(ttc) + ' €', 'hot');
      el.querySelector('#c8-v').innerHTML = `Remise : ${fr(a)} × ${fr(r / 100)} = <b>${fr(rem)} €</b>. Net : ${fr(a)} − ${fr(rem)} = <b>${fr(net)} €</b>. TVA : ${fr(net)} × ${fr(t / 100)} = <b>${fr(tva)} €</b>. Total : ${fr(net)} + ${fr(tva)} = <b>${fr(ttc)} €</b>. La TVA se calcule sur le net, après la remise.`;
      setDefi(el, 'c8-d', a === 80 && t === 20 && Math.abs(ttc - 76.8) < 1e-9);
    };
    el.addEventListener('input', up); up();
  };
  /* 9 · le gobelet : rayon, hauteur, volume */
  W.c9 = el => {
    el.innerHTML = box('La contenance d’un gobelet', 'Un gobelet est un cylindre. Change le rayon et la hauteur : le dessin, la règle graduée et le volume se recalculent. 1 cm³ = 1 mL et 1 000 cm³ = 1 L.',
      `<div class="wg-grid">${slider('c9-r', 'Rayon r', 2, 6, .5, 4, 'cm')}${slider('c9-h', 'Hauteur h', 4, 20, 1, 12, 'cm')}</div><div class="wg-svg" id="c9-g"></div><div class="wg-kpis" id="c9-k"></div><p class="wg-v" id="c9-v"></p>${defi('c9-d', 'Règle le rayon et la hauteur pour obtenir un gobelet d’environ <b>500 mL</b> (entre 495 et 505 mL).')}`);
    const up = () => {
      out(el, ['c9-r', 'c9-h']);
      const r = val(el, 'c9-r'), h = val(el, 'c9-h'), V = Math.PI * r * r * h, rp = r * 10, hp = h * 5, ry = rp * .22, cx = 140, yb = 168, yt = yb - hp;
      let ruler = `<path d="M44 ${yb}V${yb - 100}" stroke="#1D2240" stroke-width="1.6" fill="none"/>`;
      for (let k = 0; k <= 20; k += 5) ruler += `<path d="M40 ${yb - k * 5}h8" stroke="#1D2240" stroke-width="1.6"/><text x="36" y="${yb - k * 5 + 4}" font-size="11" font-weight="700" text-anchor="end" fill="#1D2240" font-family="Inter">${k}</text>`;
      ruler += `<text x="20" y="${yb - 108}" font-size="10.5" font-weight="700" fill="#1D2240" font-family="Inter">hauteur (cm)</text>`;
      el.querySelector('#c9-g').innerHTML = `<svg viewBox="0 0 330 190" class="pic" role="img" aria-label="Un cylindre de rayon ${fr(r)} centimètres et de hauteur ${fr(h)} centimètres">${ruler}<path d="M${cx - rp} ${yt}V${yb}a${rp} ${ry} 0 0 0 ${2 * rp} 0V${yt}" class="k2 ks" stroke-width="2.2"/><ellipse cx="${cx}" cy="${yt}" rx="${rp}" ry="${ry}" class="k2 ks" stroke-width="2.2"/><path d="M48 ${yt}H${cx - rp}" stroke="#1D2240" stroke-width="1.2" stroke-dasharray="3 3" fill="none"/><path d="M${cx} ${yt}H${cx + rp}" stroke="#C2332A" stroke-width="3" fill="none"/><text x="${cx + rp + 8}" y="${yt + 4}" font-size="12.5" font-weight="800" fill="#1D2240" font-family="Inter">r = ${fr(r)} cm</text></svg>`;
      el.querySelector('#c9-k').innerHTML = kpi('Volume', fr(rnd(V, 1)) + ' cm³', 'hot') + kpi('Contenance', fr(rnd(V, 0)) + ' mL') + kpi('En litres', fr(rnd(V / 1000, 2)) + ' L');
      el.querySelector('#c9-v').innerHTML = `V = π × r² × h = π × ${fr(r)}² × ${fr(h)} = π × ${fr(rnd(r * r * h, 2))} ≈ <b>${fr(rnd(V, 1))} cm³</b>, soit environ <b>${fr(rnd(V, 0))} mL</b>. Le rayon est <b>au carré</b> : si tu doubles le rayon, le volume est multiplié par 4.`;
      setDefi(el, 'c9-d', V >= 495 && V <= 505);
    };
    el.addEventListener('input', up); up();
  };
    W.c10 = el => {
    el.innerHTML = box('Le triangle est-il rectangle ?', 'Choisis trois longueurs a, b et c : le triangle se dessine avec ces trois côtés. Il est rectangle seulement si le carré du plus grand côté est égal à la somme des carrés des deux autres.',
      `<div class="wg-grid">${slider('c10-a', 'Côté a', 3, 12, 1, 5, 'cm')}${slider('c10-b', 'Côté b', 3, 12, 1, 12, 'cm')}${slider('c10-c', 'Côté c', 3, 20, .5, 13, 'cm')}</div><div class="wg-svg" id="c10-g"></div><div class="wg-kpis" id="c10-k"></div><p class="wg-v" id="c10-v"></p>${defi('c10-d', 'Trouve un triangle rectangle dont les côtés <b>a</b> et <b>b</b> valent au moins <b>5 cm</b>.')}`);
    const up = () => {
      out(el, ['c10-a', 'c10-b', 'c10-c']);
      const a = val(el, 'c10-a'), b = val(el, 'c10-b'), c = val(el, 'c10-c'), s = 9, X0 = 100, Y0 = 168;
      const x = (a * a + b * b - c * c) / (2 * a), y2 = b * b - x * x, tri = y2 > 1e-9;
      const L = [a, b, c].slice().sort((p, q) => q - p), g2 = L[0] * L[0], p2 = L[1] * L[1] + L[2] * L[2], ok = tri && Math.abs(g2 - p2) < 1e-9;
      let svg = '';
      if (tri) {
        const P0 = [X0, Y0], P1 = [X0 + a * s, Y0], P2 = [X0 + x * s, Y0 - Math.sqrt(y2) * s], Ps = [P0, P1, P2];
        const lab = (A, B, O, txt, col) => { const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, vx = B[0] - A[0], vy = B[1] - A[1], n = Math.hypot(vx, vy); let nx = -vy / n, ny = vx / n; if (nx * (O[0] - mx) + ny * (O[1] - my) > 0) { nx = -nx; ny = -ny; } const an = nx < -.35 ? 'end' : nx > .35 ? 'start' : 'middle'; return `<text x="${(mx + nx * 14).toFixed(1)}" y="${(my + ny * 14 + 4).toFixed(1)}" font-size="12.5" font-weight="800" text-anchor="${an}" fill="${col || '#1D2240'}" font-family="Inter">${txt}</text>`; };
        svg = `<path d="M${P0}L${P1}L${P2}Z" class="k2 ks" stroke-width="2.2" stroke-linejoin="round"/>` + lab(P0, P1, P2, `a = ${fr(a)} cm`) + lab(P0, P2, P1, `b = ${fr(b)} cm`) + lab(P1, P2, P0, `c = ${fr(c)} cm`, '#C2332A');
        if (ok) {
          const iMax = [a, b, c].indexOf(L[0]), V = Ps[[2, 1, 0][iMax]];
          const nb = Ps.filter(p => p !== V), u = nb.map(p => { const d = Math.hypot(p[0] - V[0], p[1] - V[1]); return [(p[0] - V[0]) / d * 10, (p[1] - V[1]) / d * 10]; });
          svg += `<path d="M${(V[0] + u[0][0]).toFixed(1)} ${(V[1] + u[0][1]).toFixed(1)}L${(V[0] + u[0][0] + u[1][0]).toFixed(1)} ${(V[1] + u[0][1] + u[1][1]).toFixed(1)}L${(V[0] + u[1][0]).toFixed(1)} ${(V[1] + u[1][1]).toFixed(1)}" fill="none" stroke="#1D2240" stroke-width="2"/>`;
        }
      }
      el.querySelector('#c10-g').innerHTML = `<svg viewBox="0 0 330 190" class="pic" role="img" aria-label="Un triangle de côtés ${fr(a)}, ${fr(b)} et ${fr(c)} centimètres">${svg}</svg>`;
      el.querySelector('#c10-k').innerHTML = kpi('Grand côté au carré', fr(rnd(g2, 2)), ok ? 'hot' : '') + kpi('Somme des deux autres carrés', fr(rnd(p2, 2)), ok ? 'hot' : '') + kpi('Verdict', !tri ? 'pas un triangle' : ok ? 'rectangle' : 'pas rectangle');
      el.querySelector('#c10-v').innerHTML = !tri ? 'Avec ces trois longueurs, on ne peut pas construire de triangle : le plus grand côté doit être plus petit que la somme des deux autres.'
        : ok ? `${fr(rnd(L[0], 1))}² = ${fr(rnd(g2, 2))} et ${fr(rnd(L[1], 1))}² + ${fr(rnd(L[2], 1))}² = ${fr(rnd(p2, 2))} : les deux nombres sont <b>égaux</b>, le triangle est <b>rectangle</b> (réciproque de Pythagore). L’angle droit est le petit carré du dessin.`
        : `${fr(rnd(L[0], 1))}² = ${fr(rnd(g2, 2))} mais ${fr(rnd(L[1], 1))}² + ${fr(rnd(L[2], 1))}² = ${fr(rnd(p2, 2))} : les deux nombres sont <b>différents</b>, le triangle n’est <b>pas rectangle</b>.`;
      setDefi(el, 'c10-d', ok && a >= 5 && b >= 5);
    };
    el.addEventListener('input', up); up();
  };
  /* FIN */
})();
