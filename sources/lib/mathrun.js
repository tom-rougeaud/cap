/* Rendu KaTeX en direct dans l’appli : les formules écrites « à plat » (fractions 3/4, puissances, f(x), racines…),
   y compris celles créées pendant l’utilisation (entraînements générés, corrections), sont converties en KaTeX.
   Même détecteur que pour le PDF (lib/mathify.js). */
(function () {
  'use strict';
  if (!window.katex || !window.MCmathify) return;
  const M = window.MCmathify;
  const render = tex => {
    try {
      const sp = M.speak(tex);
      return '<span class="kx" role="img" aria-label="' + M.esc(sp) + '">' + katex.renderToString(tex, { throwOnError: true, output: 'html', strict: false }) + '</span>';
    } catch (e) { return null; }
  };
  const SKIP = 'svg,.kx,.katex,textarea,input,select,script,style,pre,code,[contenteditable],[data-nomath]';
  const INL = /^(B|I|EM|STRONG|SPAN|SUP|SUB|MARK|U|SMALL|BR|A)$/;
  const hasText = el => { for (const n of el.childNodes) if (n.nodeType === 3 && /\S/.test(n.nodeValue)) return true; return false; };
  const leaf = el => { for (const c of el.children) { if (!INL.test(c.tagName) || c.matches(SKIP) && !c.classList.contains('kx') || c.querySelector('input,select,textarea,svg,button,img,table,ul,ol,div,p')) return false; } return true; };
  const done = new WeakSet();
  function run(root) {
    if (!root || root.nodeType !== 1) return;
    const list = [root, ...root.querySelectorAll('*')];
    list.forEach(el => {
      if (done.has(el) || !root.contains(el) || el.closest(SKIP) || !hasText(el)) return;
      if (!leaf(el)) { // conteneur mixte (champs, cases…) : on convertit seulement les morceaux de texte
        [...el.childNodes].forEach(nd => { if (nd.nodeType !== 3 || !/\S/.test(nd.nodeValue)) return; const h0 = M.esc(nd.nodeValue).replace(/&quot;/g, '"'), h1 = M.html(h0, render); if (h1 === h0) return;
          const tp = document.createElement('template'); tp.innerHTML = h1; nd.replaceWith(tp.content); });
        done.add(el); return; }
      const h = el.innerHTML; if (!/[0-9A-Za-z)²³⁰-₟]/.test(h) || !/[\/²³⁰¹⁴-⁹√×÷=≠≈≤≥(<]/.test(h)) { done.add(el); return; }
      const n = M.html(h, render);
      if (n !== h) el.innerHTML = n;
      done.add(el);
    });
  }
  function watch(main) {
    let busy = false, queue = new Set(), t = 0;
    const flush = () => { t = 0; busy = true; try { queue.forEach(n => { if (n.isConnected) run(n); }); } finally { queue.clear(); setTimeout(() => { busy = false; }, 0); } };
    const obs = new MutationObserver(ms => {
      if (busy) return;
      ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) queue.add(n); else if (n.parentElement) queue.add(n.parentElement); }));
      if (!t && queue.size) t = setTimeout(flush, 16);
    });
    obs.observe(main, { childList: true, subtree: true });
    queue.add(main); t = setTimeout(flush, 0);
  }
  window.MCmathrun = { run, watch };
})();
