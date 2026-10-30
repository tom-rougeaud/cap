/* Schémas SVG : (1) aucun texte coupé au bord du dessin, (2) aucune étiquette traversée par un trait ou posée sur un autre texte,
   une forme ou une courbe. Les mesures se font en unités du dessin (indépendantes de la taille d’affichage).
   Un texte qui doit rester posé sur un trait (barre de fraction, pointillé voulu) porte data-keep. */
(function (root) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const visible = el => { for (let e = el; e && e.nodeType === 1 && e.tagName.toLowerCase() !== 'svg'; e = e.parentNode) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return false; } return true; };
  const toRoot = (svg, el) => { const a = svg.getScreenCTM(), b = el.getScreenCTM(); return (a && b) ? a.inverse().multiply(b) : null; };
  const pt = (M, x, y) => [M.a * x + M.c * y + M.e, M.b * x + M.d * y + M.f];
  const boxOf = (svg, el) => { const M = toRoot(svg, el); if (!M) return null; let b; try { b = el.getBBox(); } catch (e) { return null; } if (!b.width && !b.height) return null;
    const c = [pt(M, b.x, b.y), pt(M, b.x + b.width, b.y), pt(M, b.x, b.y + b.height), pt(M, b.x + b.width, b.y + b.height)];
    return { x0: Math.min(...c.map(p => p[0])), x1: Math.max(...c.map(p => p[0])), y0: Math.min(...c.map(p => p[1])), y1: Math.max(...c.map(p => p[1])) }; };
  const lum = s => { const m = /rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/.exec(s); if (!m) return null; return { l: (0.299 * m[1] + 0.587 * m[2] + 0.114 * m[3]) / 255, a: m[4] != null ? +m[4] : 1 }; };

  function fitOne(svg) {
    if (svg.dataset.fit === '1') return;
    const R = svg.getBoundingClientRect(); if (!R.width || !svg.viewBox || !svg.viewBox.baseVal || !svg.viewBox.baseVal.width || !svg.getScreenCTM()) return;
    svg.dataset.fit = '1';
    /* obstacles : traits significatifs (la grille légère n’en est pas une), formes pleines */
    const strokes = [], shapes = [];
    svg.querySelectorAll('line,path,polyline,polygon,circle,ellipse,rect').forEach(e => {
      if (e.closest('defs,clipPath,mask') || !visible(e)) return;
      const cs = getComputedStyle(e), M = toRoot(svg, e); if (!M) return;
      const fillOn = cs.fill && cs.fill !== 'none' && (lum(cs.fill) ? lum(cs.fill).a > 0.05 : true) && parseFloat(cs.fillOpacity || 1) > 0.05;
      if ((e.tagName === 'rect' || e.tagName === 'circle' || e.tagName === 'ellipse') && fillOn) { const b = boxOf(svg, e); if (b && (b.x1 - b.x0) > 1 && (b.y1 - b.y0) > 1 && (b.x1 - b.x0) < svg.viewBox.baseVal.width * 0.97) { b.el = e; b.opaque = (lum(cs.fill) ? lum(cs.fill).a : 1) * (parseFloat(cs.fillOpacity || 1)) * (parseFloat(cs.opacity || 1)) > 0.95; shapes.push(b); } }
      if (e.tagName === 'rect') return;
      if ((e.tagName === 'circle' || e.tagName === 'ellipse' || e.tagName === 'path' || e.tagName === 'polygon') && fillOn && e.tagName !== 'path') return;
      const sw = parseFloat(cs.strokeWidth) || 0, c = lum(cs.stroke); if (!c || sw < 1.2 || c.l > 0.8 || c.a * (parseFloat(cs.strokeOpacity) || 1) < 0.5 || e.dataset.keep != null) return;
      let L = 0; try { L = e.getTotalLength(); } catch (x) { return; } if (!L || L > 5000) return;
      const n = Math.min(500, Math.ceil(L / 1.2)), pts = []; for (let i = 0; i <= n; i++) { const p = e.getPointAtLength(L * i / n); pts.push(pt(M, p.x, p.y)); }
      strokes.push(pts);
    });
    const texts = [...svg.querySelectorAll('text')].filter(t => t.textContent.trim() && visible(t) && !t.closest('[data-keep]'));
    const placed = [];
    const hidden = t => { const b = boxOf(svg, t); if (!b) return true; const ta = (b.x1 - b.x0) * (b.y1 - b.y0); return shapes.some(sh => sh.opaque && (t.compareDocumentPosition(sh.el) & 4) && (Math.min(b.x1, sh.x1) - Math.max(b.x0, sh.x0)) * (Math.min(b.y1, sh.y1) - Math.max(b.y0, sh.y0)) / ta >= 0.9); };
    const score = (b0, self, infl) => { let s = 0; const pad = 0.6, f = infl || 0, b = { x0: b0.x0 - f, x1: b0.x1 + f, y0: b0.y0 - f, y1: b0.y1 + f };
      strokes.forEach(pts => { let k = 0; for (const p of pts) if (p[0] > b.x0 + pad && p[0] < b.x1 - pad && p[1] > b.y0 + pad && p[1] < b.y1 - pad) { k++; if (k > 1) break; } if (k >= 2) s += 5; });
      placed.forEach(o => { if (o === self) return; const ix = Math.min(b.x1, o.x1) - Math.max(b.x0, o.x0), iy = Math.min(b.y1, o.y1) - Math.max(b.y0, o.y0); if (ix > 1 && iy > 1.5) s += 5; });
      const ta = (b.x1 - b.x0) * (b.y1 - b.y0);
      if (!shapes.some(sh => { const ix = Math.min(b.x1, sh.x1) - Math.max(b.x0, sh.x0), iy = Math.min(b.y1, sh.y1) - Math.max(b.y0, sh.y0); return ix > 0 && iy > 0 && ix * iy / ta >= 0.9; })) {
        let hit = 0, n = 0; for (let a = 0; a < 10; a++) for (let c = 0; c < 4; c++) { n++; const x = b.x0 + (a + .5) / 10 * (b.x1 - b.x0), y = b.y0 + (c + .5) / 4 * (b.y1 - b.y0); if (shapes.some(sh => x >= sh.x0 && x <= sh.x1 && y >= sh.y0 && y <= sh.y1)) hit++; }
        const f = hit / n; if (f >= 0.12 && f <= 0.92) s += 5; }
      return s; };
    const strokeHit = b0 => { const pad = 0.6; return strokes.some(pts => { let k = 0; for (const p of pts) if (p[0] > b0.x0 + pad && p[0] < b0.x1 - pad && p[1] > b0.y0 + pad && p[1] < b0.y1 - pad) { k++; if (k > 1) return true; } return false; }); };
    const DIRS = [[0, -1], [0, 1], [1, 0], [-1, 0], [1, -1], [-1, -1], [1, 1], [-1, 1]];
    texts.forEach(t => {
      let b = boxOf(svg, t); if (!b || hidden(t)) return;
      if (score(b, null) > 0) {
        const P = toRoot(svg, t.parentNode), Pi = P ? P.inverse() : null;
        search: for (const d of [3, 5, 7, 9, 12, 15, 19]) for (const [dx, dy] of DIRS) {
          const c = { x0: b.x0 + dx * d, x1: b.x1 + dx * d, y0: b.y0 + dy * d, y1: b.y1 + dy * d };
          if (score(c, null, 3.5) === 0) { if (Pi) { const lx = Pi.a * dx * d + Pi.c * dy * d, ly = Pi.b * dx * d + Pi.d * dy * d; t.setAttribute('transform', `translate(${lx.toFixed(2)} ${ly.toFixed(2)})` + (t.getAttribute('transform') ? ' ' + t.getAttribute('transform') : '')); b = boxOf(svg, t) || c; } break search; }
        }
      }
      /* si aucune place voisine n’est libre : un liseré blanc autour des lettres interrompt le trait derrière le texte (le texte reste lisible) */
      if (strokeHit(b)) { t.style.paintOrder = 'stroke fill'; t.style.stroke = '#FFFFFF'; t.style.strokeWidth = '3.2px'; t.style.strokeLinejoin = 'round'; }
      placed.push(b);
    });
    /* texte coupé au bord : on agrandit le cadre du dessin (jamais on ne réduit) */
    const vb = svg.viewBox.baseVal; let x0 = vb.x, y0 = vb.y, x1 = vb.x + vb.width, y1 = vb.y + vb.height, ch = false;
    placed.forEach(b => { if (b.x0 < x0 - .3) { x0 = Math.floor(b.x0 - 3); ch = true; } if (b.y0 < y0 - .3) { y0 = Math.floor(b.y0 - 3); ch = true; } if (b.x1 > x1 + .3) { x1 = Math.ceil(b.x1 + 3); ch = true; } if (b.y1 > y1 + .3) { y1 = Math.ceil(b.y1 + 3); ch = true; } });
    if (ch) svg.setAttribute('viewBox', `${x0} ${y0} ${x1 - x0} ${y1 - y0}`);
  }
  function fitAll(rootEl) { (rootEl || document).querySelectorAll('svg').forEach(s => { if (s.closest('.katex,.qrbox') || s.dataset.fit === '1') return; try { fitOne(s); } catch (e) { s.dataset.fit = '1'; } }); }
  /* l’appli : à chaque changement de l’écran, les nouveaux dessins sont ajustés */
  function watch(el) { let q = 0; const run = () => { q = 0; fitAll(el); }; new MutationObserver(() => { if (!q) q = requestAnimationFrame(run); }).observe(el, { childList: true, subtree: true }); fitAll(el); }
  root.MCVfit = { fitAll, fitOne, watch };
})(typeof window !== 'undefined' ? window : globalThis);
