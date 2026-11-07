/* Manuel professeur calqué sur le manuel élève : après la mise en page (qui ne change JAMAIS), le détail de chaque réponse
   (calcul posé, phrase) est écrit en rouge dans l’espace libre : dans le pointillé, à sa droite, en dessous, ou dans le cadre « Mes calculs ».
   Rien n’est déplacé : les réponses sont des textes en surimpression ; une réponse n’est détaillée que si l’espace est réellement libre. */
window.MCVcalque = function (out) {
  const stats = { hosts: 0, detail: 0, inplace: 0, beside: 0, right: 0, below: 0, zone: 0, calc: 0, shrink: 0, short: 0 };
  const SK = 'script,style,template,.katex-mathml';
  const inter = (a, b) => a.left < b.right - 0.5 && a.right > b.left + 0.5 && a.top < b.bottom - 0.5 && a.bottom > b.top + 0.5;
  const meas = document.createElement('span'); meas.style.cssText = 'position:absolute;visibility:hidden;left:-9999px;top:0;display:block'; document.body.appendChild(meas);
  const size = (cs, txt, width, scale) => { meas.style.cssText = `position:absolute;visibility:hidden;left:-9999px;top:0;display:block;font-family:${cs.fontFamily};font-weight:${cs.fontWeight};font-style:${cs.fontStyle};font-size:${parseFloat(cs.fontSize) * (scale || 1)}px;line-height:${(cs.lineHeight === 'normal' ? 1.2 * parseFloat(cs.fontSize) : parseFloat(cs.lineHeight)) * (scale || 1)}px;white-space:${width ? 'normal' : 'nowrap'};${width ? `width:${width}px;` : ''}`; meas.textContent = txt; const r = meas.getBoundingClientRect(); return { w: r.width, h: r.height }; };
  [...out.children].forEach((page, pi) => {
    const inner = page.querySelector('.inner'); if (!inner) return;
    const hosts = [...inner.querySelectorAll('[data-a]')].filter(h => getComputedStyle(h, '::after').content !== 'none' && h.getBoundingClientRect().width > 0);
    if (!hosts.length) return;
    const obs = []; const push = (r, el, kind) => { if (r.width > 1 && r.height > 1) obs.push({ r: { left: r.left, right: r.right, top: r.top, bottom: r.bottom }, el, kind }); };
    const w = document.createTreeWalker(inner, NodeFilter.SHOW_TEXT, { acceptNode: n => (/\S/.test(n.nodeValue) && n.parentElement && !n.parentElement.closest(SK)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
    let t; while ((t = w.nextNode())) { const rg = document.createRange(); rg.selectNodeContents(t); for (const r of rg.getClientRects()) push({ left: r.left, right: r.right, top: r.top + 1, bottom: r.bottom - 1, width: r.width, height: r.height - 2 }, t.parentElement, 'text'); }
    inner.querySelectorAll('svg, img, canvas, .box, input, .calc, .conc').forEach(e => { if (e.closest('svg') !== e && e.tagName !== 'svg' && e.closest('svg')) return; push(e.getBoundingClientRect(), e, e.matches('.calc, .conc') ? 'frame' : 'obj'); });
    inner.querySelectorAll('.bl, .cellans, .tb').forEach(e => push(e.getBoundingClientRect(), e, 'blank'));
    // zone propre à une réponse : ligne(s) d’écriture, cadre de calcul
    const zoneOf = h => h.matches('.lines i') ? h.parentElement : h.matches('.alines .aln') ? h.parentElement : null;
    const own = (o, h, z) => o.el === h || (z && (z === o.el || z.contains(o.el))) || h.contains(o.el);
    const free = (rect, h, z, blk) => !obs.some(o => !own(o, h, z) && inter(rect, o.r));
    const placed = [];
    hosts.forEach(h => {
      stats.hosts++;
      const a = h.getAttribute('data-a'), x0 = h.getAttribute('data-x'), same = !x0, x = x0 || a; if (!x || h.closest('.lines, .alines')) return;
      const cs0 = getComputedStyle(h, '::after'), cs = { fontFamily: cs0.fontFamily, fontWeight: cs0.fontWeight, fontStyle: cs0.fontStyle, fontSize: cs0.fontSize, lineHeight: cs0.lineHeight, left: cs0.left, top: cs0.top, bottom: cs0.bottom }, H = h.getBoundingClientRect(), z = zoneOf(h), Z = z ? z.getBoundingClientRect() : null;
      const blk = h.closest('.blk') || inner, B = blk.getBoundingClientRect(), IN = inner.getBoundingClientRect();
      const bcs = getComputedStyle(blk), limR = Math.min(B.right - (parseFloat(bcs.paddingRight) || 0) - (parseFloat(bcs.borderRightWidth) || 0) - 2, IN.right - 2), limB = Math.min(B.bottom - 5, IN.bottom - 2);
      const left = H.left + (parseFloat(cs.left) || 0);
      const bottomAnch = cs.bottom !== 'auto' && !isNaN(parseFloat(cs.bottom));
      const lh = cs.lineHeight === 'normal' ? 1.2 * parseFloat(cs.fontSize) : parseFloat(cs.lineHeight);
      for (const sc of [1, 0.88]) {
        const s1 = size(cs, x, 0, sc), blankW = H.width - (left - H.left) - 2;
        const cand = [];
        if (z) { // plusieurs lignes d’écriture : le texte s’écrit dans la zone
          const W = Z.width - (left - Z.left) - 6, sz = size(cs, x, W, sc), top = Z.top + 1;
          cand.push({ k: 'zone', rect: { left, right: left + Math.min(W, sz.w), top, bottom: top + sz.h }, ok: sz.h <= Z.height - 2, W, t: 1 });
        } else {
          const top0 = bottomAnch ? H.bottom - parseFloat(cs.bottom) - s1.h : H.top + (parseFloat(cs.top) || 0);
          const boxed = parseFloat(getComputedStyle(h).borderTopWidth) > 0 && parseFloat(getComputedStyle(h).borderLeftWidth) > 0;
          if (s1.w <= blankW) cand.push({ k: 'inplace', rect: { left, right: left + s1.w, top: top0, bottom: top0 + s1.h }, ok: true });
          if (boxed) { const bl0 = H.right + 8, tp = H.top + (H.height - s1.h) / 2; cand.push({ k: 'beside', rect: { left: bl0, right: bl0 + s1.w, top: tp, bottom: tp + s1.h }, ok: bl0 + s1.w <= limR }); }
          else cand.push({ k: 'right', rect: { left, right: left + s1.w, top: top0, bottom: top0 + s1.h }, ok: left + s1.w <= limR });
          for (const W of [Math.min(limR - left, 360)]) { const sz = size(cs, x, W, sc), single = s1.w <= W; const top = H.bottom + 0.5, Wd = single ? s1.w : W, hh = single ? s1.h : sz.h;
            if (W > 80) cand.push({ k: 'below', rect: { left, right: left + Wd, top, bottom: top + hh }, ok: top + hh <= limB, W: Math.ceil(Wd) + 2, one: single }); }
        }
        if (same) { const d0 = cand.find(c => c.k === 'inplace'); if (!d0 || free(d0.rect, h, z, blk)) { if (d0) placed.push(d0.rect); return; } }
        for (const c of cand) {
          if (window.MCVDBG) window.MCVDBG.push({pi: pi + 1, k: h.dataset.xk, c: c.k, sc, ok: c.ok, rect: c.rect, free: c.rect ? free(c.rect, h, z, blk) : null, blockers: c.rect ? obs.filter(o => !own(o, h, z) && inter(c.rect, o.r)).map(o => (o.el.tagName + '.' + o.el.className + ':' + (o.el.textContent || '').slice(0, 12))) : null});
          if (!c.ok) continue; if (c.rect && !free(c.rect, h, z, blk)) continue;
          if (c.rect && placed.some(p => inter(c.rect, p))) continue;
          h.dataset.fx = c.k === 'inplace' ? 'in' : c.k; if (sc !== 1) { h.dataset.fs = '1'; h.style.setProperty('--fxs', (parseFloat(cs.fontSize) * sc) + 'px'); stats.shrink++; }
          if (c.k === 'below' || c.k === 'zone') h.style.setProperty('--fxw', c.W + 'px'); if (c.one) h.dataset.fn = '1'; if (c.k === 'zone') h.style.setProperty('--fxt', '1px');
          if (c.rect) placed.push(c.rect); if (same) { stats.moved = (stats.moved || 0) + 1; return; } stats[c.k]++; stats.detail++; return;
        }
      }
      if (!same) stats.short++;
    });
    // détails qui n’ont pas trouvé de place près de leur question : cadre « Mes calculs » de l’exercice, s’il est vide
    inner.querySelectorAll('.calc').forEach(fr => {
      const blk = fr.closest('.blk'); if (!blk) return;
      const left = [...blk.querySelectorAll('[data-x][data-xk]')].filter(h => !h.dataset.fx && !h.dataset.fc);
      if (!left.length) return;
      const F = fr.getBoundingClientRect(), W = F.width - 6 * MMpx(), fill = document.createElement('div'); fill.className = 'calqfill'; fr.appendChild(fill);
      const cs0 = getComputedStyle(fill), avail = F.height - parseFloat(cs0.top) - 3; let n = 0; const items = [];
      for (const h of left) { items.push(h); fill.innerHTML = items.map(i => `<span><b>${i.dataset.xk}</b>${i.dataset.x.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`).join(' '); if (fill.getBoundingClientRect().height > avail) { items.pop(); break; } n++; }
      fill.innerHTML = items.map(i => `<span><b>${i.dataset.xk}</b>${i.dataset.x.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`).join(' ');
      if (!n) fill.remove(); else { items.forEach(h => { h.dataset.fc = '1'; stats.calc++; stats.detail++; stats.short--; }); }
    });
  });
  function MMpx() { return 96 / 25.4; }
  meas.remove(); return stats;
};
