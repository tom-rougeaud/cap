/* Graphiques « vrais documents » en SVG, tracés à partir des données :
   axes titrés avec unités, graduations régulières, grille légère, légende, source.
   Unité du viewBox ≈ 0,25 mm quand le graphique occupe 160 mm de large. */
'use strict';
const { fr, esc } = require('./util');
const INK = '#1D2240', SOFT = '#545B7A', GRID = '#C4CCE4', AX = '#1D2240';
const tw = (s, fs) => String(s).length * fs * 0.56; // largeur approximative d’un texte

function niceStep(range, n = 6) {
  const raw = range / n, p = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const m of [1, 2, 2.5, 5, 10]) if (raw <= m * p) return m * p;
  return 10 * p;
}
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 12}" fill="${o.fill || INK}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : ''}>${esc(s)}</text>`;

/* Diagramme en barres (valeurs positives ou négatives) */
function bars(o) {
  const W = o.w || 640, H = o.h || 300, fs = o.fs || 12;
  const R = 14, Tp = o.title ? 34 : 16, B = (o.source ? 30 : 12) + 40;
  const vals = o.values, n = vals.length;
  let lo = Math.min(0, ...vals), hi = Math.max(0, ...vals);
  const step = o.yStep || niceStep(hi - lo, 6);
  lo = o.yMin != null ? o.yMin : Math.floor(lo / step) * step; hi = o.yMax != null ? o.yMax : Math.ceil(hi / step + (o.headroom || 0.15)) * step;
  let wmax = 0; for (let v = lo; v <= hi + 1e-9; v += step) wmax = Math.max(wmax, tw(fr(v), fs));
  const L = o.left || Math.max(54, wmax + 36);
  const pw = W - L - R, ph = H - Tp - B;
  const y = v => Tp + ph - (v - lo) / (hi - lo) * ph;
  const bw = pw / n * (o.bar || 0.62);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.title || '')}">`;
  if (o.title) s += T(W / 2, 20, o.title, { fs: fs + 2, w: 700, anchor: 'middle' });
  for (let v = lo; v <= hi + 1e-9; v += step) {
    const yy = y(v).toFixed(1);
    s += `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" stroke="${Math.abs(v) < 1e-9 ? AX : GRID}" stroke-width="${Math.abs(v) < 1e-9 ? 1.6 : 1}"/>`;
    s += T(L - 6, +yy + 4, fr(v), { fs, anchor: 'end', fill: SOFT });
  }
  s += `<line x1="${L}" x2="${L}" y1="${Tp}" y2="${Tp + ph}" stroke="${AX}" stroke-width="1.6"/>`;
  vals.forEach((v, i) => {
    const cx = L + pw / n * (i + .5), y0 = y(0), y1 = y(v);
    const col = (o.colors && o.colors[i]) || (v < 0 && o.neg ? o.neg : o.color || '#1D5FC2');
    s += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${Math.min(y0, y1).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(.8, Math.abs(y1 - y0)).toFixed(1)}" fill="${col}" rx="2"/>`;
    if (o.labels !== false) s += T(cx, v >= 0 ? y1 - 5 : y1 + fs + 3, (o.fmt || fr)(v), { fs: fs - 1, anchor: 'middle', w: 700 });
    s += T(cx, Tp + ph + fs + 6, o.cats[i], { fs, anchor: 'middle' });
  });
  // titres d’axes
  s += T(14, Tp + ph / 2, o.yLabel, { fs, anchor: 'middle', rot: -90, fill: SOFT, w: 700 });
  s += T(L + pw / 2, Tp + ph + 2 * fs + 12, o.xLabel, { fs, anchor: 'middle', fill: SOFT, w: 700 });
  if (o.source) s += T(W - R, H - 6, 'Source : ' + o.source, { fs: fs - 2, anchor: 'end', fill: SOFT });
  return s + '</svg>';
}

/* Courbe ou ligne brisée. series : [{name, pts:[[x,y]...], color, step, dash}] ; xTicks : [[x,label]] */
function lines(o) {
  const W = o.w || 640, H = o.h || 300, fs = o.fs || 12;
  const R = o.right || 18, Tp = o.title ? 34 : 16, legendH = o.series.length > 1 || o.legend ? 22 : 0;
  const B = (o.source ? 26 : 10) + 40 + legendH;
  const allY = o.series.flatMap(s => s.pts.map(p => p[1])), allX = o.series.flatMap(s => s.pts.map(p => p[0]));
  const xlo = o.xMin != null ? o.xMin : Math.min(...allX), xhi = o.xMax != null ? o.xMax : Math.max(...allX);
  let ylo = o.yMin != null ? o.yMin : Math.min(...allY), yhi = o.yMax != null ? o.yMax : Math.max(...allY);
  const step = o.yStep || niceStep(yhi - ylo, 6);
  if (o.yMin == null) ylo = Math.floor(ylo / step) * step; if (o.yMax == null) yhi = Math.ceil(yhi / step) * step;
  let wmax = 0; for (let v = ylo; v <= yhi + 1e-9; v += step) wmax = Math.max(wmax, tw((o.yfmt || fr)(v), fs));
  const L = o.left || Math.max(54, wmax + 36);
  const pw = W - L - R, ph = H - Tp - B;
  const X = x => L + (x - xlo) / (xhi - xlo) * pw, Y = v => Tp + ph - (v - ylo) / (yhi - ylo) * ph;
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.title || '')}">`;
  if (o.title) s += T(W / 2, 20, o.title, { fs: fs + 2, w: 700, anchor: 'middle' });
  for (let v = ylo; v <= yhi + 1e-9; v += step) { const yy = Y(v).toFixed(1); s += `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" stroke="${GRID}"/>` + T(L - 6, +yy + 4, (o.yfmt || fr)(v), { fs, anchor: 'end', fill: SOFT }); }
  (o.xTicks || []).forEach(([x, lab], i) => { const xx = X(x).toFixed(1); s += `<line x1="${xx}" x2="${xx}" y1="${Tp}" y2="${Tp + ph}" stroke="${GRID}"/><line x1="${xx}" x2="${xx}" y1="${Tp + ph}" y2="${Tp + ph + 5}" stroke="${AX}" stroke-width="1.4"/>`; if (lab !== '') s += T(+xx, Tp + ph + fs + 8, lab, { fs, anchor: 'middle' }); });
  s += `<line x1="${L}" x2="${L}" y1="${Tp}" y2="${Tp + ph}" stroke="${AX}" stroke-width="1.6"/><line x1="${L}" x2="${W - R}" y1="${Tp + ph}" y2="${Tp + ph}" stroke="${AX}" stroke-width="1.6"/>`;
  o.series.forEach(se => {
    let d = '';
    se.pts.forEach((p, i) => {
      const xx = X(p[0]).toFixed(1), yy = Y(p[1]).toFixed(1);
      if (!i) d += `M${xx} ${yy}`; else if (se.step) d += `H${xx}V${yy}`; else d += `L${xx} ${yy}`;
    });
    if (se.step && se.until != null) d += `H${X(se.until).toFixed(1)}`;
    s += `<path d="${d}" fill="none" stroke="${se.color}" stroke-width="${se.width || 3}"${se.dash ? ` stroke-dasharray="${se.dash}"` : ''} stroke-linejoin="round"/>`;
    if (se.dots) se.pts.forEach(p => { s += `<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="4" fill="#fff" stroke="${se.color}" stroke-width="2.4"/>`; });
    if (se.labels) se.pts.forEach(p => { s += T(X(p[0]), Y(p[1]) - 9, (o.yfmt || fr)(p[1]), { fs: fs - 2, anchor: 'middle', w: 700 }); });
    (se.notes || []).forEach(nt => { s += T(X(nt[0]), Y(nt[1]) - 8, nt[2], { fs: fs - 1, anchor: nt[3] || 'middle', w: 700, fill: se.color }); });
  });
  s += T(14, Tp + ph / 2, o.yLabel, { fs, anchor: 'middle', rot: -90, fill: SOFT, w: 700 });
  s += T(L + pw / 2, Tp + ph + 2 * fs + 14, o.xLabel, { fs, anchor: 'middle', fill: SOFT, w: 700 });
  if (legendH) { let x = L; o.series.forEach(se => { s += `<line x1="${x}" x2="${x + 26}" y1="${H - (o.source ? 30 : 12)}" y2="${H - (o.source ? 30 : 12)}" stroke="${se.color}" stroke-width="3"${se.dash ? ` stroke-dasharray="${se.dash}"` : ''}/>` + T(x + 32, H - (o.source ? 26 : 8), se.name, { fs }); x += 46 + tw(se.name, fs); }); }
  if (o.source) s += T(W - R, H - 6, 'Source : ' + o.source, { fs: fs - 2, anchor: 'end', fill: SOFT });
  return s + '</svg>';
}

/* Barre empilée horizontale : décomposition d’un total (ex. prix TTC = coût d’achat + marge + TVA) */
function stack(o) {
  const W = o.w || 640, fs = o.fs || 12, L = 10, R = 10, bh = o.bh || 46, H = 30 + bh + 64;
  const tot = o.parts.reduce((a, p) => a + p.v, 0), pw = W - L - R;
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.title || '')}">`;
  if (o.title) s += T(W / 2, 18, o.title, { fs: fs + 1, w: 700, anchor: 'middle' });
  let x = L; const y0 = 30;
  o.parts.forEach(p => {
    const w = p.v / tot * pw;
    s += `<rect x="${x.toFixed(1)}" y="${y0}" width="${w.toFixed(1)}" height="${bh}" fill="${p.color}" stroke="#fff" stroke-width="2"/>`;
    const lab = (o.fmt || fr)(p.v);
    if (tw(lab, fs + 1) < w - 6) s += T(x + w / 2, y0 + bh / 2 + 5, lab, { fs: fs + 1, anchor: 'middle', w: 700, fill: p.ink || '#fff' });
    s += `<line x1="${(x + w / 2).toFixed(1)}" x2="${(x + w / 2).toFixed(1)}" y1="${y0 + bh}" y2="${y0 + bh + 10}" stroke="${SOFT}"/>` + T(x + w / 2, y0 + bh + 10 + fs + 2, p.name, { fs, anchor: 'middle', w: 700 });
    x += w;
  });
  s += `<path d="M${L} ${y0 + bh + 42}V${y0 + bh + 48}H${W - R}V${y0 + bh + 42}" fill="none" stroke="${INK}" stroke-width="1.4"/>` + T(W / 2, y0 + bh + 48 + fs + 2, o.total, { fs, anchor: 'middle', w: 700 });
  return s + '</svg>';
}


/* Boîtes à moustaches horizontales sur une même échelle. series : [{name, min, q1, me, q3, max, color}] */
function boxes(o) {
  const W = o.w || 640, fs = o.fs || 12, Lm = o.left || 120, R = 24, Tp = o.title ? 36 : 14, rowH = 58, n = o.series.length, H = Tp + n * rowH + 56 + (o.source ? 18 : 0);
  const lo = o.min, hi = o.max, X = v => Lm + (v - lo) / (hi - lo) * (W - Lm - R);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  if (o.title) s += T(W / 2, 20, o.title, { fs: fs + 2, w: 700, anchor: 'middle' });
  const yb = Tp + n * rowH + 6;
  for (let v = lo; v <= hi + 1e-9; v += o.step) { const x = X(v).toFixed(1); s += `<line x1="${x}" x2="${x}" y1="${Tp}" y2="${yb}" stroke="${GRID}"/><line x1="${x}" x2="${x}" y1="${yb}" y2="${yb + 5}" stroke="${AX}" stroke-width="1.4"/>` + T(+x, yb + fs + 8, fr(v), { fs, anchor: 'middle', fill: SOFT }); }
  s += `<line x1="${Lm}" x2="${W - R}" y1="${yb}" y2="${yb}" stroke="${AX}" stroke-width="1.6"/>` + T(Lm + (W - Lm - R) / 2, yb + 2 * fs + 14, o.xLabel, { fs, anchor: 'middle', fill: SOFT, w: 700 });
  o.series.forEach((b, i) => { const y = Tp + i * rowH + rowH / 2, h = 26, c = b.color || '#755C00';
    s += T(Lm - 10, y + 4, b.name, { fs, anchor: 'end', w: 700 });
    s += `<line x1="${X(b.min)}" x2="${X(b.q1)}" y1="${y}" y2="${y}" stroke="${INK}" stroke-width="2"/><line x1="${X(b.q3)}" x2="${X(b.max)}" y1="${y}" y2="${y}" stroke="${INK}" stroke-width="2"/>`;
    s += `<line x1="${X(b.min)}" x2="${X(b.min)}" y1="${y - 9}" y2="${y + 9}" stroke="${INK}" stroke-width="2"/><line x1="${X(b.max)}" x2="${X(b.max)}" y1="${y - 9}" y2="${y + 9}" stroke="${INK}" stroke-width="2"/>`;
    s += `<rect x="${X(b.q1)}" y="${y - h / 2}" width="${X(b.q3) - X(b.q1)}" height="${h}" fill="${c}" fill-opacity=".22" stroke="${c}" stroke-width="2"/><line x1="${X(b.me)}" x2="${X(b.me)}" y1="${y - h / 2}" y2="${y + h / 2}" stroke="${c}" stroke-width="3.5"/>`; });
  if (o.source) s += T(W - R, H - 4, 'Source : ' + o.source, { fs: fs - 2, anchor: 'end', fill: SOFT });
  return s + '</svg>';
}

/* Diagramme circulaire avec légende. parts : [{name, v, color}] ; frontières noires, couleurs contrastées si color est omis, valeur écrite sur chaque secteur */
function pie(o) {
  const PIE = require('../shared/pie.js');
  const W = o.w || 640, fs = o.fs || 12, H = o.h || 250, cx = 150, cy = (o.title ? 30 : 0) + (H - (o.title ? 30 : 0)) / 2, r = Math.min(105, (H - (o.title ? 30 : 0)) / 2 - 12);
  const tot = o.parts.reduce((a, p) => a + p.v, 0), fm = o.fmt || (v => fr(v));
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  if (o.title) s += T(W / 2, 20, o.title, { fs: fs + 2, w: 700, anchor: 'middle' });
  s += PIE.sectors({ cx, cy, r, fs: fs + 1, minIn: 26, parts: o.parts.map((p, i) => ({ a: p.v / tot * 360, c: i, in: fm(p.v) })) });
  o.parts.forEach((p, i) => { const ly = (o.title ? 44 : 20) + i * 26; s += PIE.chip(300, ly - 12, i, 16) + T(324, ly + 1, p.name, { fs }); });
  if (o.source) s += T(W - 14, H - 4, 'Source : ' + o.source, { fs: fs - 2, anchor: 'end', fill: SOFT });
  return s + '</svg>';
}

/* Courbes de fonctions dans un repère quadrillé. fns : [{f, name, color, dash}] */
function fplot(o) {
  const W = o.w || 640, H = o.h || 360, fs = o.fs || 12, L = 50, R = 20, Tp = o.title ? 34 : 14, B = 44 + (o.fns.length > 1 || o.legend ? 22 : 0);
  const X = x => L + (x - o.xMin) / (o.xMax - o.xMin) * (W - L - R), Y = y => Tp + (o.yMax - y) / (o.yMax - o.yMin) * (H - Tp - B);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  if (o.title) s += T(W / 2, 20, o.title, { fs: fs + 2, w: 700, anchor: 'middle' });
  for (let x = o.xMin; x <= o.xMax + 1e-9; x += o.xStep) s += `<line x1="${X(x)}" x2="${X(x)}" y1="${Y(o.yMax)}" y2="${Y(o.yMin)}" stroke="${GRID}"/>` + (Math.abs(x) > 1e-9 || o.yMin >= 0 ? T(X(x), Y(Math.max(o.yMin, 0)) + fs + 4, fr(x), { fs: fs - 1, anchor: 'middle', fill: SOFT }) : '');
  for (let y = o.yMin; y <= o.yMax + 1e-9; y += o.yStep) s += `<line x1="${X(o.xMin)}" x2="${X(o.xMax)}" y1="${Y(y)}" y2="${Y(y)}" stroke="${GRID}"/>` + T(X(Math.max(o.xMin, 0)) - 6, Y(y) + 4, fr(y), { fs: fs - 1, anchor: 'end', fill: SOFT });
  const x0 = X(Math.max(o.xMin, Math.min(0, o.xMax))), y0 = Y(Math.max(o.yMin, Math.min(0, o.yMax)));
  s += `<line x1="${X(o.xMin)}" x2="${X(o.xMax)}" y1="${y0}" y2="${y0}" stroke="${AX}" stroke-width="1.8"/><line x1="${x0}" x2="${x0}" y1="${Y(o.yMin)}" y2="${Y(o.yMax)}" stroke="${AX}" stroke-width="1.8"/>`;
  s += T(X(o.xMax) - 2, y0 - 8, o.xLabel || 'x', { fs, anchor: 'end', w: 700, fill: SOFT }) + T(x0 + 8, Y(o.yMax) + 12, o.yLabel || 'y', { fs, w: 700, fill: SOFT });
  o.fns.forEach(fn => { let d = ''; const a = fn.from != null ? fn.from : o.xMin, b = fn.to != null ? fn.to : o.xMax; for (let i = 0; i <= 200; i++) { const x = a + (b - a) * i / 200, y = fn.f(x); if (y < o.yMin - 1e-9 || y > o.yMax + 1e-9) { d += ''; continue; } d += (d ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1); } s += `<path d="${d}" fill="none" stroke="${fn.color}" stroke-width="3"${fn.dash ? ` stroke-dasharray="${fn.dash}"` : ''}/>`; (fn.pts || []).forEach(p => { s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4.5" fill="${fn.color}"/>`; }); });
  if (o.fns.length > 1 || o.legend) { let x = L; o.fns.forEach(fn => { s += `<line x1="${x}" x2="${x + 26}" y1="${H - 12}" y2="${H - 12}" stroke="${fn.color}" stroke-width="3"${fn.dash ? ` stroke-dasharray="${fn.dash}"` : ''}/>` + T(x + 32, H - 8, fn.name, { fs }); x += 50 + tw(fn.name, fs); }); }
  return s + '</svg>';
}

/* Barres empilées à 100 % (une barre par groupe) : répartition conditionnelle. rows : [{name, vals:[…]}] ; keys : [{name, color, ink}] */
function stackRows(o) {
  const W = o.w || 640, fs = o.fs || 12, bh = o.bh || 30, gap = 14, Tp = o.title ? 36 : 12;
  const L = Math.max(...o.rows.map(r => tw(r.name, fs))) + 22, R = 16, pw = W - L - R;
  const H = Tp + o.rows.length * (bh + gap) + 34 + (o.source ? 18 : 0);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.title || '')}">`;
  if (o.title) s += T(W / 2, 20, o.title, { fs: fs + 2, w: 700, anchor: 'middle' });
  [0, 25, 50, 75, 100].forEach(p => { const x = L + pw * p / 100; s += `<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${Tp - 4}" y2="${Tp + o.rows.length * (bh + gap) - gap + 4}" stroke="${GRID}"/>` + T(x, Tp + o.rows.length * (bh + gap) - gap + 16, p + ' %', { fs: fs - 2, anchor: 'middle', fill: SOFT }); });
  o.rows.forEach((r, i) => {
    const y0 = Tp + i * (bh + gap), tot = r.vals.reduce((a, b) => a + b, 0); let x = L;
    s += T(L - 8, y0 + bh / 2 + fs * .36, r.name, { fs, anchor: 'end', w: 700 });
    r.vals.forEach((v, j) => { const w = v / tot * pw, k = o.keys[j], p = Math.round(v / tot * 1000) / 10;
      s += `<rect x="${x.toFixed(1)}" y="${y0}" width="${w.toFixed(1)}" height="${bh}" fill="${k.color}" stroke="#fff" stroke-width="1.5"/>`;
      const lab = fr(p) + ' %'; if (tw(lab, fs) < w - 6) s += T(x + w / 2, y0 + bh / 2 + fs * .36, lab, { fs, anchor: 'middle', w: 700, fill: k.ink || '#fff' });
      x += w; });
  });
  let lx = L, ly = H - (o.source ? 22 : 6);
  o.keys.forEach(k => { s += `<rect x="${lx}" y="${ly - 10}" width="12" height="12" rx="2" fill="${k.color}"/>` + T(lx + 17, ly, k.name, { fs: fs - 1 }); lx += 30 + tw(k.name, fs - 1); });
  if (o.source) s += T(W - R, H - 4, 'Source : ' + o.source, { fs: fs - 2, anchor: 'end', fill: SOFT });
  return s + '</svg>';
}

module.exports = { bars, lines, stack, niceStep, boxes, pie, fplot, stackRows };

