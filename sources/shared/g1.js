/* Maths et MCV · 1re — repère, courbes, nuages : tracé exact (coordonnées calculées, jamais dessinées à la main).
   Commun au manuel, à l’appli et aux tests. Exporte MCVP. */
(function (root) {
  'use strict';
  const MC = typeof module !== 'undefined' ? require('./gens.js').MCVG : root.MCVG;
  const { fr } = MC;
  const INK = '#1D2240', SOFT = '#545B7A', GRID = '#DCE2F2', RED = '#C2332A', BLUE = '#1D5FC2', ORG = '#B05200', GRN = '#1E7F45', VIO = '#7438C0';
  const f1 = n => (Math.round(n * 10) / 10).toString();
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const T = (x, y, s, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" font-size="${o.fs || 12}" text-anchor="${o.a || 'middle'}" font-weight="${o.w || 700}" ${o.fill ? `fill="${o.fill}"` : `class="${o.c || 'tx'}"`}${o.r ? ` transform="rotate(${o.r} ${f1(x)} ${f1(y)})"` : ''}>${s}</text>`;
  /* repère : x ∈ [x0 ; x1] pas dx, y ∈ [y0 ; y1] pas dy */
  function plot(o) {
    const W = o.W || 600, H = o.H || 300, [x0, x1, dx] = o.x, [y0, y1, dy] = o.y, ml = o.ml == null ? 50 : o.ml, mr = o.mr == null ? 16 : o.mr, mt = o.mt == null ? 16 : o.mt, mb = o.mb == null ? 36 : o.mb;
    const X = x => ml + (x - x0) / (x1 - x0) * (W - ml - mr), Y = y => H - mb - (y - y0) / (y1 - y0) * (H - mt - mb);
    const inY = y => Number.isFinite(y) && y >= y0 - 1e-9 && y <= y1 + 1e-9;
    let base = '';
    if (o.grid !== false) {
      for (let x = x0; x <= x1 + 1e-9; x += dx) base += `<line x1="${f1(X(x))}" y1="${f1(Y(y0))}" x2="${f1(X(x))}" y2="${f1(Y(y1))}" stroke="${GRID}" stroke-width="${o.fine ? .7 : 1}"/>`;
      for (let y = y0; y <= y1 + 1e-9; y += dy) base += `<line x1="${f1(X(x0))}" y1="${f1(Y(y))}" x2="${f1(X(x1))}" y2="${f1(Y(y))}" stroke="${GRID}" stroke-width="${o.fine ? .7 : 1}"/>`;
    }
    const ax0 = o.zeroAxes ? Math.min(Math.max(0, y0), y1) : y0, ay0 = o.zeroAxes ? Math.min(Math.max(0, x0), x1) : x0;
    base += `<line x1="${f1(X(x0))}" y1="${f1(Y(ax0))}" x2="${f1(X(x1))}" y2="${f1(Y(ax0))}" stroke="${INK}" stroke-width="2"/><line x1="${f1(X(ay0))}" y1="${f1(Y(y0))}" x2="${f1(X(ay0))}" y2="${f1(Y(y1))}" stroke="${INK}" stroke-width="2"/>`;
    const fs = o.fs || 12, lx = o.lx || 1, ly = o.ly || 1;
    let i = 0;
    if (o.xt) { for (const [x, lab] of o.xt) base += `<line x1="${f1(X(x))}" y1="${f1(Y(ax0))}" x2="${f1(X(x))}" y2="${f1(Y(ax0) + 5)}" stroke="${INK}" stroke-width="1.6"/>` + T(X(x), Y(ax0) + 19, lab, { fs, w: 400, c: 'ts' }); }
    else for (let x = x0; x <= x1 + 1e-9; x += dx, i++) { base += `<line x1="${f1(X(x))}" y1="${f1(Y(ax0)) }" x2="${f1(X(x))}" y2="${f1(Y(ax0) + 5)}" stroke="${INK}" stroke-width="1.6"/>`; if (i % lx === 0 && !(o.zeroAxes && Math.abs(x) < 1e-9 && ay0 === 0 && false)) base += T(X(x), Y(ax0) + 19, fr(+x.toFixed(6)), { fs, w: 400, c: 'ts' }); }
    i = 0;
    for (let y = y0; y <= y1 + 1e-9; y += dy, i++) { base += `<line x1="${f1(X(ay0) - 5)}" y1="${f1(Y(y))}" x2="${f1(X(ay0))}" y2="${f1(Y(y))}" stroke="${INK}" stroke-width="1.6"/>`; if (i % ly === 0) base += T(X(ay0) - 9, Y(y) + 4, fr(+y.toFixed(6)), { fs, a: 'end', w: 400, c: 'ts' }); }
    if (o.xl) base += T(X(x1), H - 1, o.xl, { fs: fs + 1, a: 'end', c: 'ts' });
    if (o.yl) base += T(ml - 4, 11, o.yl, { fs: fs + 1, a: 'start', c: 'ts' });
    /* courbe d’une fonction, coupée là où elle sort du cadre */
    const curve = (fn, c = {}) => {
      const a = c.a == null ? x0 : c.a, b = c.b == null ? x1 : c.b, n = c.n || 240; let d = '', pen = false;
      for (let k = 0; k <= n; k++) { const x = a + (b - a) * k / n, y = fn(x); if (inY(y)) { d += (pen ? 'L' : 'M') + f1(X(x)) + ' ' + f1(Y(y)); pen = true; } else pen = false; }
      return `<path d="${d}" fill="none" ${c.stroke ? `stroke="${c.stroke}"` : 'class="ks"'} stroke-width="${c.w || 3}"${c.dash ? ` stroke-dasharray="${c.dash}"` : ''} stroke-linecap="round" stroke-linejoin="round"/>`;
    };
    const pts = (list, c = {}) => list.map(([x, y]) => `<circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="${c.r || 4.5}" ${c.fill ? `fill="${c.fill}"` : 'class="k"'} stroke="#fff" stroke-width="1.4"/>`).join('');
    const dot = (x, y, c = {}) => `<circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="${c.r || 5.5}" fill="${c.fill || '#fff'}" stroke="${c.stroke || INK}" stroke-width="2.4"/>` + (c.lab ? T(X(x) + (c.dx || 8), Y(y) + (c.dy == null ? -9 : c.dy), c.lab, { fs: c.fs || 13, a: c.a || 'start', c: c.cls || 'kt' }) : '');
    /* repères en pointillés de l’axe jusqu’au point */
    const guide = (x, y, c = {}) => `<path d="M${f1(X(x))} ${f1(Y(ax0))}V${f1(Y(y))}H${f1(X(ay0))}" fill="none" stroke="${c.stroke || SOFT}" stroke-width="1.8" stroke-dasharray="5 4"/>`;
    const seg = (xa, ya, xb, yb, c = {}) => `<line x1="${f1(X(xa))}" y1="${f1(Y(ya))}" x2="${f1(X(xb))}" y2="${f1(Y(yb))}" ${c.stroke ? `stroke="${c.stroke}"` : 'class="ks"'} stroke-width="${c.w || 2.4}"${c.dash ? ` stroke-dasharray="${c.dash}"` : ''} stroke-linecap="round"/>`;
    /* droite y = a x + b, coupée au cadre */
    const line = (a, b, c = {}) => {
      let lo = x0, hi = x1;
      if (a !== 0) { const xa = (y0 - b) / a, xb = (y1 - b) / a; lo = Math.max(lo, Math.min(xa, xb)); hi = Math.min(hi, Math.max(xa, xb)); } else if (b < y0 || b > y1) return '';
      return lo > hi ? '' : seg(lo, a * lo + b, hi, a * hi + b, c);
    };
    /* bande sur l’axe des x : intervalle [xa ; xb] */
    const band = (xa, xb, c = {}) => `<rect x="${f1(X(Math.max(xa, x0)))}" y="${f1(Y(y1))}" width="${f1(X(Math.min(xb, x1)) - X(Math.max(xa, x0)))}" height="${f1(Y(y0) - Y(y1))}" fill="${c.fill || '#FFC233'}" opacity="${c.op || .22}"/>`;
    const txt = (x, y, s, c = {}) => T(X(x) + (c.dx || 0), Y(y) + (c.dy || 0), s, { fs: c.fs || 13, a: c.a, c: c.cls || 'kt', fill: c.fill });
    const open = `<svg viewBox="0 0 ${W} ${H}" class="${o.cls || 'pic vis'}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.lab || 'Graphique')}">`;
    return { W, H, X, Y, base, curve, pts, dot, guide, seg, line, band, txt, T, wrap: body => open + body + '</svg>', open, ml, mr, mt, mb };
  }
  /* moindres carrés : droite y = a x + b et coefficient de détermination */
  function fit(P) {
    const n = P.length, mx = P.reduce((s, p) => s + p[0], 0) / n, my = P.reduce((s, p) => s + p[1], 0) / n;
    const sxx = P.reduce((s, p) => s + (p[0] - mx) ** 2, 0), sxy = P.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0), syy = P.reduce((s, p) => s + (p[1] - my) ** 2, 0);
    const a = sxy / sxx, b = my - a * mx, r2 = sxy * sxy / (sxx * syy);
    return { a, b, r2, mx, my, n };
  }
  root.MCVP = { plot, fit, T, esc, INK, SOFT, GRID, RED, BLUE, ORG, GRN, VIO };
  if (typeof module !== 'undefined') module.exports = root;
})(typeof module !== 'undefined' ? module.exports : window);
