/* Détecte les formules écrites « à plat » dans un texte (fractions 3/4, puissances x², fonctions f(x), égalités avec une lettre, racines…)
   et les convertit en TeX. Même code pour la construction (PDF) et pour l’appli (rendu KaTeX dans le navigateur).
   Principe : on ne touche qu’à ce qui est sûrement mathématique ; un calcul de nombres seuls (9 × 40 = 360) reste en texte. */
(function (root) {
  'use strict';
  const SPC = '[ \\u00a0\\u202f]';
  const SUPD = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
  const LET = /[A-Za-zÀ-ÿ]/;
  const sticky = (re, s, i) => { re.lastIndex = i; return re.exec(s); };
  const RE_NUM = /\d+(?:[   ](?=\d{3}(?!\d))\d{3})*(?:,\d+)?(?:[   ]?%)?/y;
  const RE_OP = /[   ]*(×|÷|\+|−|=|≠|≈|≤|≥|∩|∪)[   ]*/y;
  const OPTEX = { '×': '\\times ', '÷': '\\div ', '+': '+', '−': '-', '=': '=', '≠': '\\neq ', '≈': '\\approx ', '≤': '\\leq ', '≥': '\\geq ', '∩': '\\cap ', '∪': '\\cup ' };
  const isLone = (s, i) => /[A-Za-z]/.test(s[i] || '') && !LET.test(s[i - 1] || '') && !/[A-Za-zÀ-ÿ'’]/.test(s[i + 1] || '');
  const upperWord = (s, i) => { const m = sticky(/[A-Z]{2}(?![A-Za-zÀ-ÿ'’])/y, s, i); return m && !LET.test(s[i - 1] || '') ? m[0] : null; };

  function number(s, i) {
    const m = sticky(RE_NUM, s, i); if (!m) return null;
    let t = m[0], pct = /%$/.test(t); if (pct) t = t.replace(/[   ]?%$/, '');
    t = t.replace(/[   ]/g, '\\,').replace(',', '{,}');
    return { tex: t + (pct ? '\\,\\%' : ''), end: i + m[0].length, num: true };
  }
  function power(s, i) {
    let m = sticky(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/y, s, i);
    if (m) return { tex: [...m[0]].map(c => SUPD[c]).join(''), end: i + m[0].length };
    m = sticky(/⌃([^⌄]{1,10})⌄/y, s, i);
    if (m) return { tex: sticky(/[^\s]+/y, m[1], 0)[0].replace(/,/g, '{,}').replace(/−/g, '-'), end: i + m[0].length };
    return null;
  }
  function group(s, i) {
    let d = 0, j = i; for (; j < s.length && j < i + 70; j++) { if (s[j] === '(') d++; else if (s[j] === ')') { d--; if (!d) break; } }
    if (d || s[j] !== ')') return null;
    const inner = parseList(s, i + 1, j); if (!inner) return null;
    return { tex: '\\left(' + inner.tex + '\\right)', end: j + 1, int: inner.int, paren: true };
  }
  /* arguments d’une parenthèse : expressions séparées par « ; » ou « , » */
  function parseList(s, i, close) {
    const parts = [], seps = []; let j = i, it = false;
    for (;;) {
      while (/[   ]/.test(s[j] || '')) j++;
      const e = expr(s, j, true); if (!e) return null; parts.push(e.tex); it = it || e.int; j = e.end;
      while (/[   ]/.test(s[j] || '')) j++;
      if (j === close) return { tex: parts.map((x, k) => (k ? (seps[k - 1] === ';' ? '\\,;\\,' : ',\\,') : '') + x).join(''), int: it };
      if (s[j] === ';' || (s[j] === ',' && /[  ]/.test(s[j + 1] || ''))) { seps.push(s[j]); j++; continue; }
      return null;
    }
  }
  function operand(s, i) { /* côté d’une fraction */
    let m;
    if ((m = number(s, i)) && !/%/.test(s.slice(i, m.end))) return { tex: m.tex, end: m.end, num: true };
    const u = upperWord(s, i); if (u) return { tex: '\\mathrm{' + u + '}', end: i + u.length, up: true };
    if (isLone(s, i)) return { tex: s[i], end: i + 1, low: /[a-z]/.test(s[i]) };
    if (s[i] === '(') { const g = group(s, i); if (g) return { tex: g.tex.replace(/^\\left\(|\\right\)$/g, ''), end: g.end, par: true }; }
    return null;
  }
  function atom(s, i) {
    let r = null; const c = s[i];
    if (c === '(') r = group(s, i);
    else if (c === '√') { const a = atom1(s, i + 1); if (!a) return null; r = { tex: '\\sqrt{' + a.tex.replace(/^\\left\(|\\right\)$/g, '') + '}', end: a.end, int: true }; }
    else if (c === 'π') r = { tex: '\\pi ', end: i + 1, int: true };
    else if (c === '∞') r = { tex: '\\infty ', end: i + 1, int: true };
    else if (/\d/.test(c)) { if (LET.test(s[i - 1] || '') && !/[\d]/.test(s[i - 1])) return null; r = number(s, i); }
    else {
      const u = upperWord(s, i);
      if (u) r = { tex: '\\mathrm{' + u + '}', end: i + 2, int: true, seg: true };
      else if (isLone(s, i)) {
        if (s[i + 1] === '(') { const g = group(s, i + 1); if (!g) return null; r = { tex: s[i] + g.tex, end: g.end, int: true }; }
        else r = { tex: s[i], end: i + 1, int: true, v: true };
      }
    }
    if (!r) return null;
    const p = power(s, r.end); if (p) { r.tex += '^{' + p.tex + '}'; r.end = p.end; r.int = true; }
    return r;
  }
  const atom1 = (s, i) => { const a = atom(s, i); return a; };
  function frac(s, i, left) { /* a/b */
    if (s[left.end] !== '/') return null;
    const L = { num: left.num, up: left.seg, low: left.v, par: left.paren };
    if (/^[a-z]$/.test(s[i]) && left.end === i + 1 && !left.num) return null;
    const r = operand(s, left.end + 1); if (!r) return null;
    if (/[A-Za-zÀ-ÿ0-9/²³]/.test(s[r.end] || '') || (s[r.end] === '⌃')) return null;
    if (/[A-Za-zÀ-ÿ]/.test(s[i - 1] || '') || s[i - 1] === '/') return null;
    if (r.low && (left.v || (left.tex && /^[a-z]$/.test(left.tex)))) return null; /* m/s, g/L */
    if (left.num === undefined && !left.seg && !left.paren && !left.v) return null;
    if (left.v && !/[A-Z]/.test(left.tex) && !r.num && !r.up) return null;
    return { tex: '\\dfrac{' + left.tex.replace(/^\\left\(|\\right\)$/g, '') + '}{' + r.tex + '}', end: r.end, int: true };
  }
  function factor(s, i) {
    let neg = ''; if (s[i] === '−' && /[\d(A-Za-z√π]/.test(s[i + 1] || '')) { neg = '-'; i++; }
    const a = atom(s, i); if (!a) return null;
    const f = frac(s, i, a); const r = f || a;
    r.tex = neg + r.tex; return r;
  }
  function term(s, i) {
    const f = factor(s, i); if (!f) return null;
    let { tex, end, int } = f; let last = f;
    for (;;) { /* multiplication implicite : 5x, 2(x + 3), (x + 1)(x + 2), 3√2 */
      const c = s[end]; if (!c || !(c === '(' || c === '√' || c === 'π' || /[A-Za-z]/.test(c))) break;
      if (last.frac) break;
      if (/[A-Za-z]/.test(c) && !isLone(s, end)) break;
      if (!(last.num || last.paren || last.v || last.tex)) break;
      const g = atom(s, end); if (!g) break;
      tex += g.tex; end = g.end; int = int || g.int; last = g;
    }
    return { tex, end, int: int || f.int, frac: !!f.tex && f !== undefined && /\\dfrac/.test(tex) };
  }
  function expr(s, i, inner) {
    const t = term(s, i); if (!t) return null;
    let tex = t.tex, end = t.end, int = t.int, ops = 0;
    for (;;) {
      const m = sticky(RE_OP, s, end); if (!m) break;
      let k = end + m[0].length, neg = '';
      if (s[k] === '−' && /[\d(A-Za-z√π]/.test(s[k + 1] || '')) { /* −3 après un opérateur */ }
      const t2 = term(s, k); if (!t2) break;
      tex += OPTEX[m[1]] + t2.tex; end = t2.end; int = int || t2.int; ops++;
    }
    return { tex, end, int, ops };
  }
  /* les « runs » sûrement mathématiques d’un texte : [début, fin, tex] */
  function runs(s) {
    const out = []; let i = 0;
    while (i < s.length) {
      const c = s[i], prev = s[i - 1] || '';
      if (/[A-Za-zÀ-ÿ0-9²³]/.test(prev) || !/[\d(A-Za-z√π−]/.test(c)) { i++; continue; }
      const e = expr(s, i);
      if (e && e.end > i && e.int && (e.ops > 0 || /\\dfrac|\\sqrt|\^|\\left\(/.test(e.tex) && /[A-Za-z]/.test(e.tex))) {
        /* pas de formule qui se termine par un opérateur oublié, pas de simple « (a) » */
        out.push([i, e.end, e.tex]); i = e.end; continue;
      }
      if (e && e.end > i && e.int && /\\dfrac|\\sqrt|\^/.test(e.tex)) { out.push([i, e.end, e.tex]); i = e.end; continue; }
      i++;
    }
    return out;
  }
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  /* lecture à voix haute */
  const speak = tex => tex.replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, '$1 sur $2').replace(/\\mathrm\{([^}]*)\}/g, '$1').replace(/\\times/g, ' fois ').replace(/\\div/g, ' divisé par ').replace(/\\sqrt\{([^{}]*)\}/g, ' racine de $1 ').replace(/\^\{2\}/g, ' au carré').replace(/\^\{3\}/g, ' au cube').replace(/\^\{([^{}]*)\}/g, ' puissance $1 ').replace(/\\approx/g, ' environ égal à ').replace(/\\left|\\right|\\,|\\%/g, ' ').replace(/\{,\}/g, ',').replace(/\\pi/g, ' pi ').replace(/-/g, ' moins ').replace(/\\[a-z]+/g, ' ').replace(/[{}\\]/g, '').replace(/\s+/g, ' ').trim();
  const SKIP = /^(svg|style|script|pre|code|textarea|math)$/i;
  /* HTML → HTML : les runs sont remplacés par render(tex) ; les balises <sup> collées à un nombre ou une lettre sont lues comme des puissances */
  function html(h, render) {
    let src = h.replace(/&nbsp;/g, ' ').replace(/([\dA-Za-z)])<sup>([^<]{1,10})<\/sup>/g, '$1⌃$2⌄');
    const toks = src.split(/(<[^>]*>)/); let skip = 0, kx = 0, out = '';
    toks.forEach(t => {
      if (t[0] === '<' && t[t.length - 1] === '>') {
        const m = /^<\/?\s*([a-zA-Z0-9]+)/.exec(t), tag = m ? m[1].toLowerCase() : '', close = t[1] === '/', selfc = /\/>$/.test(t);
        if (SKIP.test(tag) && !selfc) skip += close ? -1 : 1;
        if (tag === 'span' && !selfc) { if (kx) kx += close ? -1 : 1; else if (!close && /class="[^"]*\b(kx|katex)\b/.test(t)) kx = 1; }
        out += t; return;
      }
      if (skip > 0 || kx > 0 || !t) { out += t.replace(/⌃([^⌄]*)⌄/g, '<sup>$1</sup>'); return; }
      const rs = runs(t); let p = 0, o = '';
      rs.forEach(([a, b, tex]) => { o += t.slice(p, a).replace(/⌃([^⌄]*)⌄/g, '<sup>$1</sup>'); o += render(tex) || t.slice(a, b); p = b; });
      out += o + t.slice(p).replace(/⌃([^⌄]*)⌄/g, '<sup>$1</sup>');
    });
    return out;
  }
  root.MCmathify = { runs, html, speak, esc };
  if (typeof module !== 'undefined') module.exports = root.MCmathify;
})(typeof module !== 'undefined' ? module.exports : window);
