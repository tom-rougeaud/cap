/* Maths · CAP — rubrique « Je manipule » : un simulateur par chapitre.
   Tout se calcule dans le navigateur ; rien n’est envoyé ni enregistré. */
(function () {
  'use strict';
  const M = window.MCVG, fr = M.fr, rnd = M.rnd;
  const slider = (id, lab, min, max, step, val, unit = '') => `<label class="wg-sl"><span>${lab}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"><output for="${id}" id="${id}-o"></output>${unit ? `<small>${unit}</small>` : ''}</label>`;
  const box = (title, intro, body) => `<section class="wg"><h2 class="wg-t">🎛️ ${title}</h2><p class="wg-i">${intro}</p>${body}</section>`;
  const defi = (id, txt) => `<p class="wg-defi" id="${id}"><span class="wg-dk">🎯 Défi</span> ${txt} <b class="wg-ok" hidden>✅ Réussi !</b></p>`;
  const setDefi = (el, id, ok) => { const d = el.querySelector('#' + id); if (!d) return; d.classList.toggle('done', !!ok); d.querySelector('.wg-ok').hidden = !ok; };
  const kpi = (lab, val, cls = '') => `<div><small>${lab}</small><b class="${cls}">${val}</b></div>`;
  const val = (el, id) => +el.querySelector('#' + id).value;
  const out = (el, ids, d = {}) => ids.forEach(k => { const o = el.querySelector('#' + k + '-o'); if (o) o.textContent = fr(val(el, k), d[k] == null ? null : d[k]); });
  const NS = 'http://www.w3.org/2000/svg';
  const COL = ['#6B7B00', '#C2332A', '#1D5FC2', '#E0A100', '#7A3FB0'];
  const W = {};

  /* 1 · statistique : du tableau d’effectifs au diagramme */
  W.c1 = el => {
    const V = [1, 2, 3, 4, 5], init = [3, 7, 5, 4, 1];
    el.innerHTML = box('Du tableau au diagramme', 'Une salle d’arcade note le nombre de parties jouées par chaque visiteur. Change les effectifs : le tableau, la moyenne, le diagramme en bâtons et le diagramme circulaire se recalculent.',
      `<div class="wg-grid">${V.map((v, i) => slider('c1-e' + i, `${v} partie${v > 1 ? 's' : ''}`, 0, 12, 1, init[i], 'visiteurs')).join('')}</div><div class="wg-svg" id="c1-g"></div><div id="c1-t"></div><div class="wg-kpis" id="c1-k"></div>${defi('c1-d', 'Règle les effectifs pour avoir <b>20 visiteurs</b> et une moyenne de <b>3 parties</b> exactement.')}`);
    const arc = (cx, cy, r, a0, a1) => { const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${cx} ${cy}L${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z`; };
    const up = () => {
      out(el, V.map((_, i) => 'c1-e' + i));
      const E = V.map((_, i) => val(el, 'c1-e' + i)), N = E.reduce((a, b) => a + b, 0), S = E.reduce((a, e, i) => a + e * V[i], 0);
      if (!N) { el.querySelector('#c1-g').innerHTML = ''; el.querySelector('#c1-t').innerHTML = '<p class="small">Choisis au moins un visiteur.</p>'; el.querySelector('#c1-k').innerHTML = ''; setDefi(el, 'c1-d', false); return; }
      const mx = Math.max(...E), bw = 44;
      let s = `<line x1="30" y1="170" x2="340" y2="170" stroke="#1D2240" stroke-width="2"/><line x1="30" y1="170" x2="30" y2="14" stroke="#1D2240" stroke-width="2"/>`;
      E.forEach((e, i) => { const h = e / mx * 140, x = 48 + i * 58; s += `<rect x="${x}" y="${170 - h}" width="${bw}" height="${h}" rx="3" fill="${MCVPIE.col(i)}" stroke="#111" stroke-width="1.8"/><text x="${x + bw / 2}" y="${164 - h}" text-anchor="middle" font-size="14" font-weight="700" fill="#1D2240">${e}</text><text x="${x + bw / 2}" y="190" text-anchor="middle" font-size="13" fill="#1D2240">${V[i]}</text>`; });
      s += `<text x="190" y="206" text-anchor="middle" font-size="12" fill="#5A6180">nombre de parties</text>`;
      s += MCVPIE.sectors({ cx: 470, cy: 100, r: 84, fs: 14, parts: E.map((e, i) => e ? { a: Math.min(e / N * 360, 360), c: i, in: String(V[i]), out: `${V[i]} partie${V[i] > 1 ? 's' : ''} : ${e}` } : null).filter(Boolean) });
      el.querySelector('#c1-g').innerHTML = `<svg viewBox="0 0 600 214" class="pic" role="img" aria-label="Diagramme en bâtons et diagramme circulaire des effectifs">${s}</svg>`;
      el.querySelector('#c1-t').innerHTML = `<div class="tscroll"><table class="tbl"><tr><th>Parties</th>${V.map(v => `<th>${v}</th>`).join('')}<th>Total</th></tr><tr><th>Effectif</th>${E.map(e => `<td>${e}</td>`).join('')}<td><b>${N}</b></td></tr><tr><th>Fréquence</th>${E.map(e => `<td>${fr(rnd(e / N * 100, 1))} %</td>`).join('')}<td>100 %</td></tr><tr><th>Angle</th>${E.map(e => `<td>${fr(rnd(e / N * 360, 1))}°</td>`).join('')}<td>360°</td></tr></table></div>`;
      const top = Math.max(...E), modes = V.filter((_, i) => E[i] === top);
      el.querySelector('#c1-k').innerHTML = kpi('Effectif total', N) + kpi('Moyenne', fr(rnd(S / N, 2)) + ' parties', 'hot') + kpi('Somme (valeur × effectif)', S) + kpi('Valeur la plus fréquente', modes.join(' et '));
      setDefi(el, 'c1-d', N === 20 && S === 60);
    };
    el.addEventListener('input', up); up();
  };

  /* 2 · probabilités : simuler un dé à 20 faces */
  W.c2 = el => {
    const EVS = { a: ['au moins 15', n => n >= 15, 6 / 20, '6/20'], b: ['obtenir 20', n => n === 20, 1 / 20, '1/20'], c: ['un nombre pair', n => n % 2 === 0, 10 / 20, '10/20'], d: ['un multiple de 5', n => n % 5 === 0, 4 / 20, '4/20'] };
    let n = 0, k = 0, last = [], hist = [];
    el.innerHTML = box('Simuler un dé à 20 faces', 'Chaque clic lance un dé à 20 faces dans ton navigateur. Choisis un événement, lance beaucoup de fois et regarde la fréquence se rapprocher de la probabilité. Les résultats changent à chaque essai : c’est le hasard.',
      `<div class="wg-grid"><label class="wg-sl"><span>Événement</span><select id="c2-ev">${Object.entries(EVS).map(([key, v]) => `<option value="${key}">${v[0]}</option>`).join('')}</select></label></div><p class="wg-btns"><button class="btn sm" data-w="1">🎲 Lancer 1 fois</button><button class="btn sm" data-w="10">× 10</button><button class="btn sm" data-w="100">× 100</button><button class="btn sm" data-w="1000">× 1 000</button><button class="btn sm ghost" data-w="0">🔄 Recommencer</button></p><p class="small" id="c2-l" aria-live="polite"></p><div class="wg-svg" id="c2-g"></div><div class="wg-kpis" id="c2-k"></div>${defi('c2-d', 'Fais au moins <b>1 000 lancers</b> : la fréquence est-elle à moins de <b>0,03</b> de la probabilité ? Si ce n’est pas le cas, recommence : c’est la fluctuation.')}`);
    const ev = () => EVS[el.querySelector('#c2-ev').value];
    const draw = () => {
      const [lab, , p, pf] = ev(), f = n ? k / n : 0, ymax = p >= .4 ? 1 : .6, X = x => 50 + Math.log10(Math.max(1, x)) / 4 * 520, Y = y => 170 - y / ymax * 150;
      let s = [0, 1, 2, 3, 4].map(k => ymax * k / 4).map(t => `<line x1="50" y1="${Y(t)}" x2="580" y2="${Y(t)}" stroke="#C9D1EA" stroke-width="1"/>`).join('') + [1, 10, 100, 1000, 10000].map(t => `<line x1="${X(t)}" y1="170" x2="${X(t)}" y2="14" stroke="#C9D1EA" stroke-width="1"/>`).join('') + `<line x1="50" y1="170" x2="580" y2="170" stroke="#1D2240" stroke-width="2"/><line x1="50" y1="170" x2="50" y2="14" stroke="#1D2240" stroke-width="2"/>`;
      [1, 10, 100, 1000, 10000].forEach(t => { s += `<line x1="${X(t)}" y1="170" x2="${X(t)}" y2="175" stroke="#1D2240" stroke-width="2"/><text x="${X(t)}" y="190" text-anchor="middle" font-size="12" fill="#1D2240">${fr(t)}</text>`; });
      [0, 1, 2, 3, 4].map(k => ymax * k / 4).forEach(t => { s += `<text x="44" y="${Y(t) + 4}" text-anchor="end" font-size="12" fill="#1D2240">${fr(rnd(t, 2))}</text>`; });
      s += `<line x1="50" y1="${Y(p)}" x2="580" y2="${Y(p)}" stroke="#C2332A" stroke-width="2" stroke-dasharray="6 4"/><text x="578" y="${Y(p) - 6}" text-anchor="end" font-size="12" font-weight="700" fill="#C2332A">probabilité ${fr(rnd(p, 2))}</text>`;
      if (hist.length) { s += `<path d="${hist.map(([x, y], i) => (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1)).join('')}" fill="none" stroke="#1D2240" stroke-width="2.4"/>` + hist.map(([x, y]) => `<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="3.4" fill="#1D2240"/>`).join(''); }
      s += `<text x="315" y="208" text-anchor="middle" font-size="12" fill="#5A6180">nombre de lancers</text>`;
      el.querySelector('#c2-g').innerHTML = `<svg viewBox="0 0 600 214" class="pic" role="img" aria-label="Fréquence de l’événement « ${lab} » selon le nombre de lancers">${s}</svg>`;
      el.querySelector('#c2-k').innerHTML = kpi('Lancers', fr(n)) + kpi('Résultats favorables', fr(k)) + kpi('Fréquence', n ? fr(rnd(f, 4)) : '—', 'hot') + kpi('Probabilité', `${pf} = ${fr(rnd(p, 4))}`) + kpi('Écart', n ? fr(rnd(Math.abs(f - p), 4)) : '—');
      el.querySelector('#c2-l').textContent = last.length ? `Derniers résultats : ${last.join(' · ')}` : 'Aucun lancer pour l’instant.';
      setDefi(el, 'c2-d', n >= 1000 && Math.abs(f - p) < .03);
    };
    el.addEventListener('click', e => { const b = e.target.closest('[data-w]'); if (!b) return; const m = +b.dataset.w;
      if (!m) { n = 0; k = 0; last = []; hist = []; draw(); return; }
      const t = ev()[1]; for (let i = 0; i < m; i++) { const r = Math.floor(Math.random() * 20) + 1; n++; if (t(r)) k++; last.push(r); if (last.length > 10) last.shift(); }
      hist.push([n, k / n]); draw(); });
    el.addEventListener('change', e => { if (e.target.id === 'c2-ev') { n = 0; k = 0; last = []; hist = []; draw(); } });
    draw();
  };

  /* 3 · proportionnalité : proportionnel ou pas ? */
  W.c3 = el => {
    const NS_ = [1, 2, 3, 5, 8, 10];
    el.innerHTML = box('Proportionnel ou pas ?', 'Le prix de places de cinéma. Choisis un tarif : le tableau, les quotients et le graphique montrent si le prix est proportionnel au nombre de places.',
      `<div class="wg-grid"><label class="wg-sl"><span>Tarif</span><select id="c3-m"><option value="p">A · le même prix pour chaque place</option><option value="d">B · tarif dégressif (8 € puis 6 €)</option></select></label>${slider('c3-p', 'Prix d’une place', 1, 15, .5, 5, '€')}</div><div id="c3-t"></div><div class="wg-svg" id="c3-g"></div><p class="wg-calc" id="c3-v" aria-live="polite"></p>${defi('c3-d', 'Avec le tarif A, règle le prix d’une place pour que <b>8 places coûtent 60 €</b>.')}`);
    const price = (mode, p, n) => mode === 'p' ? p * n : (n <= 2 ? 8 * n : 16 + 6 * (n - 2));
    const up = () => {
      const mode = el.querySelector('#c3-m').value, p = val(el, 'c3-p'); out(el, ['c3-p']); el.querySelector('#c3-p').closest('label').hidden = mode !== 'p';
      const P = NS_.map(n => price(mode, p, n)), Q = NS_.map((n, i) => P[i] / n), same = Q.every(q => Math.abs(q - Q[0]) < 1e-9);
      el.querySelector('#c3-t').innerHTML = `<div class="tscroll"><table class="tbl"><tr><th>Places</th>${NS_.map(n => `<td>${n}</td>`).join('')}</tr><tr><th>Prix (€)</th>${P.map(x => `<td>${fr(rnd(x, 2))}</td>`).join('')}</tr><tr><th>Prix ÷ places</th>${Q.map(q => `<td class="${same ? 'ok' : ''}">${fr(rnd(q, 2))}</td>`).join('')}</tr></table></div>`;
      const ymax = Math.max(...P, 1), X = x => 50 + x / 10 * 520, Y = y => 170 - y / ymax * 150;
      let s = `<line x1="50" y1="170" x2="580" y2="170" stroke="#1D2240" stroke-width="2"/><line x1="50" y1="170" x2="50" y2="14" stroke="#1D2240" stroke-width="2"/>`;
      [0, 2, 4, 6, 8, 10].forEach(t => { s += `<text x="${X(t)}" y="190" text-anchor="middle" font-size="12" fill="#1D2240">${t}</text>`; });
      [0, 1, 2, 3, 4].map(k => ymax * k / 4).forEach(t => { s += `<text x="44" y="${Y(t) + 4}" text-anchor="end" font-size="12" fill="#1D2240">${fr(rnd(t, 1))}</text>`; });
      s += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(10)}" y2="${Y(Q[0] * 10)}" stroke="#C2332A" stroke-width="2" stroke-dasharray="6 4"/>`;
      s += `<path d="M${X(0)} ${Y(0)}${NS_.map((n, i) => 'L' + X(n).toFixed(1) + ' ' + Y(P[i]).toFixed(1)).join('')}" fill="none" stroke="#1D2240" stroke-width="2.2"/>` + NS_.map((n, i) => `<circle cx="${X(n).toFixed(1)}" cy="${Y(P[i]).toFixed(1)}" r="4.4" fill="#1D2240"/>`).join('');
      s += `<text x="315" y="208" text-anchor="middle" font-size="12" fill="#5A6180">nombre de places</text><text x="56" y="22" font-size="12" fill="#5A6180">prix (€)</text>`;
      el.querySelector('#c3-g').innerHTML = `<svg viewBox="0 0 600 214" class="pic" role="img" aria-label="Prix selon le nombre de places : les points sont alignés avec l’origine seulement si le prix est proportionnel">${s}</svg>`;
      el.querySelector('#c3-v').innerHTML = same ? `✅ Tous les quotients sont égaux (<b>${fr(rnd(Q[0], 2))} €</b> par place) et les points sont alignés avec l’origine : <b>le prix est proportionnel</b> au nombre de places. Le coefficient de proportionnalité est ${fr(rnd(Q[0], 2))}.` : `❌ Les quotients sont différents (de ${fr(rnd(Math.min(...Q), 2))} à ${fr(rnd(Math.max(...Q), 2))}) et les points ne sont pas alignés avec l’origine : <b>le prix n’est pas proportionnel</b> au nombre de places.`;
      setDefi(el, 'c3-d', mode === 'p' && Math.abs(8 * p - 60) < 1e-9);
    };
    el.addEventListener('input', up); up();
  };

  /* outils partagés avec widgets_x.js (chapitres 4 à 10) */
  W._h = { slider, box, defi, setDefi, kpi, val, out, COL };
  window.MCVW = W;
})();
