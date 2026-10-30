/* Diagrammes circulaires : secteurs de couleurs bien contrastées, frontières noires, valeurs écrites sur le dessin.
   Sans dépendance : utilisable dans le manuel (Node) comme dans l’appli (navigateur). */
(function (root) {
  'use strict';
  /* couleur de fond, couleur du texte posé dessus : unies, profondes, distinctes entre elles et du noir des frontières */
  const PAL = [['#F2B705', '#111111'], ['#2B6CB0', '#FFFFFF'], ['#D14B2A', '#FFFFFF'], ['#2E8B57', '#FFFFFF'], ['#7B4FA0', '#FFFFFF'], ['#9AA3AE', '#111111'], ['#8C5A2B', '#FFFFFF'], ['#E8D6A0', '#111111']];
  const BORDER = '#111111';
  const num = x => +x.toFixed(1);
  const lines = l => Array.isArray(l) ? l : String(l).split('\n');
  const FF = 'font-family="Inter,Andika,sans-serif"';
  const text = (x, y, l, o) => { const ls = lines(l), lh = o.fs * 1.18, y0 = y - (ls.length - 1) * lh / 2 + o.fs * .34;
    return `<text x="${num(x)}" y="${num(y0)}" font-size="${o.fs}" font-weight="${o.w || 800}" text-anchor="${o.a || 'middle'}" fill="${o.fill}" ${FF}>` + ls.map((t, i) => `<tspan x="${num(x)}" dy="${i ? lh : 0}">${t}</tspan>`).join('') + '</text>'; };
  /* parts : [{ a : angle en degrés, in : texte dans le secteur (« \n » = nouvelle ligne), out : texte à côté du secteur }] */
  function sectors(o) {
    const cx = o.cx, cy = o.cy, r = o.r, fs = o.fs || 12, minIn = o.minIn || 38, bw = o.bw || 2.2; let a0 = o.start == null ? -90 : o.start, s = '', t = '';
    const P = d => [cx + r * Math.cos(d * Math.PI / 180), cy + r * Math.sin(d * Math.PI / 180)];
    o.parts.forEach((p, i) => {
      const col = PAL[(p.c != null ? p.c : i) % PAL.length], a1 = a0 + p.a, m = (a0 + p.a / 2) * Math.PI / 180;
      if (p.a >= 359.9) s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col[0]}" stroke="${BORDER}" stroke-width="${bw}"/>`;
      else { const [x0, y0] = P(a0), [x1, y1] = P(a1); s += `<path d="M${cx} ${cy}L${num(x0)} ${num(y0)}A${r} ${r} 0 ${p.a > 180 ? 1 : 0} 1 ${num(x1)} ${num(y1)}Z" fill="${col[0]}" stroke="${BORDER}" stroke-width="${bw}" stroke-linejoin="round"/>`; }
      let outTxt = p.out;
      if (p.in != null && p.in !== '') { if (p.a >= minIn) t += text(cx + r * (o.k || .62) * Math.cos(m), cy + r * (o.k || .62) * Math.sin(m), p.in, { fs, fill: col[1] }); else outTxt = outTxt ? lines(outTxt).concat(lines(p.in)) : p.in; }
      if (outTxt != null && outTxt !== '') {
        const c = Math.cos(m), sn = Math.sin(m), e = o.gap == null ? 12 : o.gap, x1 = cx + r * c, y1 = cy + r * sn, x2 = cx + (r + 8) * c, y2 = cy + (r + 8) * sn;
        const anc = c > .25 ? 'start' : c < -.25 ? 'end' : 'middle', tx = cx + (r + e) * c + (anc === 'start' ? 2 : anc === 'end' ? -2 : 0), ty = cy + (r + e) * sn + (sn < -.6 ? -fs * .59 * (lines(outTxt).length - 1) : sn > .6 ? fs * .6 * (lines(outTxt).length - 1) : 0) + (sn < -.6 ? -(fs * .45 + 3.5) : sn > .6 ? fs * .45 + 2.5 : 0);
        t += `<line x1="${num(x1)}" y1="${num(y1)}" x2="${num(x2)}" y2="${num(y2)}" stroke="${BORDER}" stroke-width="1.4"/>` + text(tx, ty, outTxt, { fs, fill: '#1D2240', a: anc });
      }
      a0 = a1;
    });
    return s + t;
  }
  /* petite pastille de couleur (légende) : même couleur que le secteur ou la barre d’indice i */
  const chip = (x, y, i, w = 14) => `<rect x="${x}" y="${y}" width="${w}" height="${w}" rx="3" fill="${PAL[i % PAL.length][0]}" stroke="${BORDER}" stroke-width="1.6"/>`;
  const col = i => PAL[i % PAL.length][0];
  const ink = i => PAL[i % PAL.length][1];

  /* Diagramme en bâtons lisible : axe gradué avec lignes de lecture, valeur écrite au-dessus de chaque bâton, catégories dessous.
     o : x0, y0 (origine du repère), pitch (largeur d’une catégorie), bw (largeur du bâton), u (pixels par unité), vals, cats, ticks (graduations),
     color(i) → couleur, fmt(v) → texte, vmax (ordonnée du haut de l’axe), unit (légende de l’axe), fs */
  const bars = o => {
    const fs = o.fs || 10, n = o.vals.length, x0 = o.x0, y0 = o.y0, W = o.pitch * n, top = y0 - (o.vmax != null ? o.vmax : Math.max(...o.vals)) * o.u, fmt = o.fmt || (v => String(v).replace('.', ','));
    let s = '';
    (o.minor || []).forEach(t => { const y = y0 - t * o.u; s += `<line x1="${x0}" y1="${num(y)}" x2="${num(x0 + W + 4)}" y2="${num(y)}" stroke="#DCE2F2" stroke-width="1" stroke-dasharray="3 3"/>`; });
    (o.ticks || []).forEach(t => { const y = y0 - t * o.u; s += `<line x1="${x0}" y1="${num(y)}" x2="${num(x0 + W + 4)}" y2="${num(y)}" stroke="#C9D1EA" stroke-width="1"/><text x="${x0 - 5}" y="${num(y + fs * .34)}" font-size="${fs}" font-weight="700" text-anchor="end" fill="#5A6080" ${FF}>${fmt(t)}</text>`; });
    s += `<line x1="${x0}" y1="${num(y0)}" x2="${num(x0 + W + 4)}" y2="${num(y0)}" stroke="#1D2240" stroke-width="2.2"/><line x1="${x0}" y1="${num(y0)}" x2="${x0}" y2="${num(top - 4)}" stroke="#1D2240" stroke-width="2.2"/>`;
    if (o.unit) s += `<text x="${x0 - 5}" y="${num(top - 9)}" font-size="${fs}" font-weight="700" text-anchor="start" fill="#5A6080" ${FF}>${o.unit}</text>`;
    const lum = h => { const m = /^#([0-9a-f]{6})$/i.exec(h); if (!m) return 0; const n = parseInt(m[1], 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
    const vfs = o.vfs || fs - .5, my = o.mean != null ? y0 - o.mean * o.u : null;
    o.vals.forEach((v, i) => { const cx = x0 + o.pitch * (i + .5), h = v * o.u, c = typeof o.color === 'function' ? o.color(i) : (o.color || col(0));
      s += `<rect x="${num(cx - o.bw / 2)}" y="${num(y0 - h)}" width="${o.bw}" height="${num(h)}" rx="2" fill="${c}" stroke="${BORDER}" stroke-width="1.6"/>`;
      const show = o.labels === false ? false : Array.isArray(o.labels) ? o.labels.includes(i) : true;
      if (show) {
        /* la ligne de la moyenne ne doit jamais traverser une valeur : si elle passe au-dessus du bâton, on écrit la valeur dans le bâton */
        const by = y0 - h - 4, clash = my != null && my > by - vfs * .8 - 2 && my < by + 3 && h > vfs * 2.2;
        if (clash) s += `<text x="${num(cx)}" y="${num(y0 - h + vfs + 3)}" font-size="${vfs}" font-weight="800" text-anchor="middle" fill="${lum(c) > .55 ? '#111111' : '#FFFFFF'}" ${FF}>${fmt(v)}</text>`;
        else s += `<text x="${num(cx)}" y="${num(by)}" font-size="${vfs}" font-weight="800" text-anchor="middle" fill="#1D2240" ${FF}>${fmt(v)}</text>`;
      }
      if (o.cats) s += `<text x="${num(cx)}" y="${num(y0 + fs + 4)}" font-size="${fs}" font-weight="700" text-anchor="middle" fill="#1D2240" ${FF}>${o.cats[i]}</text>`; });
    if (o.mean != null) { const y = y0 - o.mean * o.u; s += `<line x1="${x0}" y1="${num(y)}" x2="${num(x0 + W + 4)}" y2="${num(y)}" stroke="#C2332A" stroke-width="2.4" stroke-dasharray="6 4"/>`; }
    return s;
  };
  /* roue partagée en secteurs égaux : seq = indice de couleur de chaque secteur, dans l’ordre */
  const wheel = o => sectors({ cx: o.cx, cy: o.cy, r: o.r, bw: o.bw, parts: o.seq.map(c => ({ a: 360 / o.seq.length, c })) });
  const api = { PAL, BORDER, sectors, chip, col, ink, bars, wheel };
  if (typeof module !== 'undefined') module.exports = api; else root.MCVPIE = api;
})(typeof window !== 'undefined' ? window : globalThis);
