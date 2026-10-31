/* Mise en pages A4 : blocs répartis dans des pages fixes, jamais coupés.
   Auto-ajustement des textes (.fit), contrôle des débordements à droite. */
(async function () {
  if (document.fonts) { try { await Promise.all([...document.fonts].map(f => f.load())); } catch (e) { } await document.fonts.ready; }
  try { if (window.MCVfit) MCVfit.fitAll(document.getElementById('flow')); } catch (e) { }
  const MM = 96 / 25.4, PROF = document.body.classList.contains('prof');
  document.body.classList.add('paging'); // les réponses du professeur ne comptent pas dans la mise en page
  const flow = document.getElementById('flow'), out = document.getElementById('out');
  const res = { secs: {}, words: {}, num: {}, errors: [], warnings: [], pages: 0, notes: 0, fits: 0 };
  const tpl = id => document.getElementById(id).content.firstElementChild.cloneNode(true);
  // version professeur : le corrigé détaillé de chaque exercice est rangé DANS l’exercice (sous chaque question quand c’est possible,
  // sinon en fin de bloc), donc toujours sur la même page que lui ; il compte dans la mise en page
  if (PROF && document.getElementById('dets')) {
    const SRCD = {}; document.querySelectorAll('#dets .dz-src').forEach(d => { const e = d.querySelector('.dz-e'); if (e) SRCD[d.dataset.for] = { h: d.innerHTML, li: [...e.querySelectorAll('.dz-l > li')].map(l => l.innerHTML) }; });
    const mk = (cls, html) => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; return d; };
    const whole = (e, id) => e.appendChild(mk('dz-in', '<div class="dz-h">✔️ Corrigé détaillé</div>' + SRCD[id].h));
    const byId = {}; flow.querySelectorAll('[data-det]').forEach(e => { (byId[e.dataset.det] = byId[e.dataset.det] || []).push(e); });
    for (const [id, list] of Object.entries(byId)) {
      const s = SRCD[id]; if (!s) continue;
      const evq = list.filter(e => e.classList.contains('evq'));
      if (evq.length) { if (evq.length === s.li.length) evq.forEach((e, k) => e.appendChild(mk('dq', s.li[k]))); else whole(evq[evq.length - 1], id); res.dets = (res.dets || 0) + 1; continue; }
      list.forEach(e => {
        const box = e.querySelector(':scope > .exb') || e;
        const us = [...box.querySelectorAll('.pq, .qq')].filter(u => !u.parentElement.closest('.pq, .qq'));
        if ((e.classList.contains('pb3') || e.classList.contains('evx')) && us.length === s.li.length) us.forEach((u, k) => u.appendChild(mk('dq', s.li[k]))); else whole(e, id);
        res.dets = (res.dets || 0) + 1;
      });
    }
    Object.keys(SRCD).forEach(id => { if (!byId[id] && !/-r2$/.test(id)) res.errors.push('Corrigé détaillé sans exercice : ' + id); });
    document.getElementById('dets').remove();
  }
  function newPage(run, col, cols) {
    const p = document.createElement('div'); p.className = 'page' + (col ? ' c-' + col : '') + (run ? ' cont' : '');
    p.innerHTML = (run ? `<div class="run">${run}</div>` : '') + `<div class="inner${cols ? ' cols2' : ''}"></div><div class="foot"></div>`;
    out.appendChild(p); return p;
  }
  const inner = p => p.querySelector('.inner');
  const over = el => el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
  function free(el) {
    const kids = [...el.children]; const pb = parseFloat(getComputedStyle(el).paddingBottom);
    const bottom = el.getBoundingClientRect().bottom - pb;
    if (!kids.length) return bottom - el.getBoundingClientRect().top;
    const last = kids[kids.length - 1]; return bottom - last.getBoundingClientRect().bottom - parseFloat(getComputedStyle(last).marginBottom);
  }
  function fitAll(root) {
    root.querySelectorAll('.fit').forEach(el => {
      let fs = parseFloat(getComputedStyle(el).fontSize), k = 0; const min = fs * 0.55;
      const box = el.parentElement;
      const tooWide = () => el.scrollWidth > el.clientWidth + 0.5 || el.getBoundingClientRect().right > box.getBoundingClientRect().right + 0.5;
      while (tooWide() && fs > min && k < 60) { fs -= 0.4; el.style.fontSize = fs + 'px'; k++; }
      if (k) res.fits++;
      if (tooWide()) res.warnings.push('Texte trop long : ' + el.textContent.slice(0, 40));
    });
  }
  function addNotes(p) {
    const el = inner(p); if (el.classList.contains('cols2')) return; const f = free(el) / MM; (res.gaps = res.gaps || []).push([out.children.length, Math.round(f), Math.round(el.clientHeight / MM)]);
    if (f < 34) return;
    const n = tpl('notesTpl'); n.querySelector('.lines').innerHTML = '<i></i>'.repeat(Math.floor((f - 24) / 10));
    el.appendChild(n); if (over(el)) el.removeChild(n); else res.notes++;
  }
  // une page de notes, pour qu’un chapitre commence toujours sur une page de droite (page impaire)
  const fillPage = () => { const pg = document.createElement('div'); pg.className = 'page filler'; pg.innerHTML = '<div class="inner"><div class="blk notes"><h3>📝 Mes notes</h3><div class="lines">' + '<i></i>'.repeat(24) + '</div></div></div><div class="foot"></div>'; out.appendChild(pg); res.fillers = (res.fillers || 0) + 1; };
  for (const node of [...flow.children]) {
    if (node.dataset.recto === '1' && out.children.length % 2 === 1) fillPage();
    if (node.classList.contains('page')) { out.appendChild(node); fitAll(node); continue; }
    if (node.dataset.key === 'rep') { const placed = new Set([...out.querySelectorAll('.ex[data-eid]')].map(e => e.dataset.eid)); node.querySelectorAll('[data-optrep]').forEach(e => { if (!placed.has(e.dataset.optrep)) e.remove(); }); }
    const run = node.dataset.run, col = node.dataset.col, fill = node.dataset.fill === '1', cols = node.dataset.cols === '2';
    let p = newPage(null, col, false);
    res.secs[node.dataset.key] = out.children.length;
    const kids = [...node.children]; const fixed = [], queue = [];
    kids.forEach(k => (k.classList.contains('ex') ? queue : fixed).push(k));
    const pool = queue.filter(b => b.classList.contains('opt')); pool.forEach(b => queue.splice(queue.indexOf(b), 1));
    const place = blk => { const el = inner(p); el.appendChild(blk); fitAll(blk); if (over(el)) { el.removeChild(blk); return false; } return true; };
    let first = true;
    let curLc = 0;
    /* réserve d’exercices : posés seulement dans la place restée vide d’une page, jamais sur une page en plus */
    const usedSrc = {};
    const topUp = (lc, dep) => { if (!fill || !pool.length) return; const el = inner(p); if (el.classList.contains('cols2')) return;
      const here = new Set([...el.querySelectorAll(':scope > .opt')].map(b => b.dataset.src));
      const pickc = (test, same) => pool.filter(b => test(b) && (b.dataset.free || (lc ? +b.dataset.lc === lc : (!b.dataset.src || out.querySelector('.ex[data-eid="' + b.dataset.src + '"]')))) && (same || (!here.has(b.dataset.src) && !(b.dataset.src && el.querySelector('[data-eid="' + b.dataset.src + '"]')))))
        .sort((a, b) => (usedSrc[a.dataset.src] || 0) - (usedSrc[b.dataset.src] || 0));
      const put1 = (b, same) => {
        if (lc) b.classList.add('inl'); if (same) b.classList.add('again');
        const sais = lc ? null : el.querySelector(':scope > .sais3, :scope > .sais'); let ok = false;
        if (sais) { el.insertBefore(b, sais); fitAll(b); ok = !over(el); if (!ok) el.removeChild(b); } else ok = place(b);
        if (!ok) { b.classList.remove('inl'); b.classList.remove('again'); }
        return ok; };
      const first = (cand, same) => { for (const b of cand) if (put1(b, same)) return b; return null; };
      /* rappel : on choisit l’exercice qui remplit le mieux la place restante */
      const best = cand => { let bb = null, bf = 1e9; for (const b of cand) if (put1(b, false)) { const f = free(el); el.removeChild(b); if (f < bf) { bf = f; bb = b; } } if (bb) put1(bb, false); return bb; };
      for (;;) {
        /* d’abord les « autres nombres » de la page ; sur une page de cours, la même notion « encore une fois » ; sur une page d’exercices, un rappel d’un chapitre précédent */
        let put = first(pickc(b => dep ? b.dataset.dep : !b.dataset.rap, false), false);
        if (!put && lc) put = first(pickc(b => !b.dataset.rap, true), true);
        if (!put && !lc) put = best(pickc(b => b.dataset.rap && (dep ? !b.dataset.dep : true), false));
        if (!put) return;
        pool.splice(pool.indexOf(put), 1); here.add(put.dataset.src); usedSrc[put.dataset.src] = (usedSrc[put.dataset.src] || 0) + 1; } };
    const lessonTop = () => { const el = inner(p), last = el.lastElementChild; if (last && last.classList.contains('nt3r') && last.dataset.lc) topUp(+last.dataset.lc); else if (last && (last.classList.contains('dep3') || last.classList.contains('auto3'))) topUp(0, true); };
    for (const blk of fixed) {
      if (cols && first && !blk.classList.contains('span')) { p = out.lastElementChild; }
      if (cols && !blk.classList.contains('span') && !inner(p).classList.contains('cols2') && !p._colbox) {
        // après l’en-tête pleine largeur : la suite en deux colonnes sur la même page
        const box = document.createElement('div'); box.className = 'colbox'; inner(p).appendChild(box);
        const h = (inner(p).getBoundingClientRect().bottom - parseFloat(getComputedStyle(inner(p)).paddingBottom)) - box.getBoundingClientRect().top;
        box.style.height = Math.max(0, h - 2) + 'px'; p._colbox = box;
      }
      first = false;
      const target = (cols && p._colbox) ? p._colbox : null;
      if (target) { target.appendChild(blk); fitAll(blk); if (target.scrollWidth <= target.clientWidth + 1) continue; target.removeChild(blk);
        const carry = []; while (target.lastElementChild && target.lastElementChild.classList.contains('kwn')) carry.unshift(target.removeChild(target.lastElementChild));
        p = newPage(run, col, true); carry.forEach(c => inner(p).appendChild(c)); inner(p).appendChild(blk); fitAll(blk); continue; }
      if (cols && inner(p).classList.contains('cols2')) { const el = inner(p); el.appendChild(blk); fitAll(blk); if (!over(el)) continue; el.removeChild(blk);
        const carry = []; while (el.lastElementChild && el.lastElementChild.classList.contains('kwn')) carry.unshift(el.removeChild(el.lastElementChild));
        p = newPage(run, col, true); carry.forEach(c => inner(p).appendChild(c)); inner(p).appendChild(blk); continue; }
      // une notion commence toujours en haut d’une page (sa méthode et sa solution restent ensemble)
      if (blk.classList.contains('pgb') && inner(p).children.length) { lessonTop(); if (fill) addNotes(p); p = newPage(run, col, false); }
      if (!place(blk)) { const el = inner(p), carry = [];
        while (el.lastElementChild && el.lastElementChild.classList.contains('kwn') && el.children.length > 1) carry.unshift(el.removeChild(el.lastElementChild));
        lessonTop(); if (fill) addNotes(p);
        p = newPage(run, col, false); carry.forEach(c => inner(p).appendChild(c)); inner(p).appendChild(blk); fitAll(blk); if (over(inner(p))) res.errors.push('Débordement : ' + blk.textContent.slice(0, 50)); }
    }
    const WIN = 8;
    while (queue.length) {
      let done = false;
      const lim = queue.findIndex((x, i) => i > 0 && x.classList.contains('palh'));
      for (let j = 0; j < Math.min(WIN, lim > 0 ? lim : queue.length); j++) {
        const b = queue[j]; if (j > 0 && (b.classList.contains('sais') || b.classList.contains('keep') || queue[0].classList.contains('keep')) && queue.length > 1) continue;
        // on ne remonte jamais un exercice d’une étape plus avancée (comprendre → mots → calculer → problèmes → rédiger)
        if (j > 0 && (+b.dataset.stage || 0) > (+queue[0].dataset.stage || 0)) continue;
        // et jamais un exercice avant un exercice qui le précède dans le manuel : la numérotation suit l’ordre de la progression (exercice, 🌱 guidé, 🚀 défi)
        if (j > 0 && b.dataset.eid && queue.slice(0, j).some(x => x.dataset.eid)) continue;
        if (place(b)) {
          if (b.classList.contains('kwn') && queue[j + 1]) { const nx = queue[j + 1]; if (!place(nx)) { inner(p).removeChild(b); break; } inner(p).removeChild(nx); }
          queue.splice(j, 1); if (queue[j] && queue[j].classList.contains('keep') && !queue[j].classList.contains('palh')) queue.unshift(queue.splice(j, 1)[0]); done = true; break; }
      }
      if (done) continue;
      const el = inner(p);
      if (!el.children.length) { const b = queue.shift(); el.appendChild(b);
        // un problème trop long pour une page : la fin passe sur la page suivante (« suite »)
        const box = b.querySelector('.pbm') || (b.querySelector(':scope > .exb > .pq') ? b.querySelector(':scope > .exb') : null);
        if (box && over(el) && box.querySelectorAll(':scope > .pq').length > 1) {
          const cont = document.createElement('div'); cont.className = 'blk ex keep cont';
          const t = b.querySelector('.ext'); cont.innerHTML = `<div class="exh"><span class="ext">${t ? t.innerHTML : ''} <span class="suite">(suite)</span></span></div><div class="exb"></div>`; if (b.classList.contains('bac')) cont.classList.add('bac');
          const dst = cont.querySelector('.exb'); const pc = box.querySelector(':scope > .pouce'); if (pc) dst.appendChild(pc);
          while (over(el) && box.querySelectorAll(':scope > .pq').length > 1) { const qs = box.querySelectorAll(':scope > .pq'); dst.insertBefore(qs[qs.length - 1], dst.firstChild); }
          queue.unshift(cont); res.splits = (res.splits || 0) + 1;
        }
        if (over(el)) res.errors.push('Bloc trop grand pour une page : ' + (b.querySelector('.ext') || b).textContent.slice(0, 60)); continue; }
      // un problème qui ne tient pas en entier dans une demi-page libre : on le coupe entre deux questions (« suite » en haut de la page suivante)
      const half = () => {
        if (!fill || free(el) / MM < 70) return false;
        let i = 0; const lead = []; while (queue[i] && (queue[i].classList.contains('bulle') || queue[i].classList.contains('palh'))) lead.push(queue[i++]);
        const b = queue[i]; if (!b || !b.classList.contains('pb3')) return false;
        const units = () => [...b.querySelectorAll(':scope > .exb > .qq, :scope > .exb > .pq')];
        if (units().length < 3) return false;
        lead.forEach(x => el.appendChild(x)); el.appendChild(b); fitAll(b);
        const au = b.querySelector(':scope > .autr'); if (au) b.removeChild(au);
        const dzi = b.querySelector(':scope > .dz-in'); if (dzi) b.removeChild(dzi);
        const moved = []; while (over(el) && units().length > 2) { const u = units().pop(); moved.unshift(u); u.remove(); }
        if (over(el) || !moved.length) { const box = b.querySelector(':scope > .exb'); moved.forEach(u => box.appendChild(u)); if (au) b.appendChild(au); if (dzi) b.appendChild(dzi); el.removeChild(b); lead.forEach(x => el.removeChild(x)); return false; }
        const cont = document.createElement('div'); cont.className = b.className.replace(/\bpb3\b/, 'pb3c') + ' keep cont';
        const t = b.querySelector('.ext'); cont.innerHTML = `<div class="exh"><span class="ext">${t ? t.innerHTML : ''} <span class="suite">(suite)</span></span></div><div class="exb"></div>`;
        const dst = cont.querySelector('.exb'); moved.forEach(u => dst.appendChild(u)); if (au) cont.appendChild(au); if (dzi) cont.appendChild(dzi); if (b.dataset.det) cont.dataset.det = b.dataset.det;
        queue.splice(0, i + 1, cont); res.splits = (res.splits || 0) + 1; return true;
      };
      if (el.children.length && half()) continue;
      // un titre (« Les exercices ») ne reste jamais seul en bas de page
      const carry = []; while (el.lastElementChild && el.lastElementChild.classList.contains('kwn') && el.children.length > 1) carry.unshift(el.removeChild(el.lastElementChild));
      topUp(0); if (fill) addNotes(p);
      p = newPage(run, col, false); carry.forEach(c => inner(p).appendChild(c));
    }
    topUp(0); if (fill) addNotes(p);
    if (fill && pool.length) { const el = inner(p); (res.poolLeft = res.poolLeft || {})[node.dataset.key] = pool.map(b => { el.appendChild(b); const h = Math.round(b.getBoundingClientRect().height / MM); el.removeChild(b); return (b.dataset.src || '?') + (b.dataset.dep ? '/dep' : '') + (b.dataset.lc ? '/lc' + b.dataset.lc : '') + ':' + h; }); }
  }
  if (out.children.length % 2 === 1) { const last = document.createElement('div'); last.className = 'page'; last.innerHTML = '<div class="inner"><div class="blk notes"><h3>📝 Mes notes</h3><div class="lines">' + '<i></i>'.repeat(24) + '</div></div></div><div class="foot"></div>'; out.appendChild(last); }
  flow.remove();
  // numérotation des exercices par chapitre, dans l’ordre des pages
  let cur = null, k = 0;
  const pagesBySec = {}; const keys = Object.entries(res.secs).sort((a, b) => a[1] - b[1]);
  [...out.children].forEach((pg, i) => { let s = null; for (const [kk, v] of keys) if (v <= i + 1) s = kk; pg.dataset.sec = s || ''; });
  [...out.children].forEach(pg => { if (pg.dataset.sec !== cur) { cur = pg.dataset.sec; k = 0; } pg.querySelectorAll('.ex .num').forEach(nn => { k++; nn.textContent = k; const e = nn.closest('.ex').dataset.eid; if (e) res.num[e] = k; }); });
  [...out.children].forEach((p, i) => {
    const n = i + 1; p.classList.add(n % 2 ? 'odd' : 'even'); p.dataset.n = n;
    const f = p.querySelector('.foot'); if (f && n > 1) f.innerHTML = `<span>${document.body.dataset.foot}</span><b>${n}</b>`;
    const ls = p.querySelector('[data-lesson]'), rn = p.querySelector('.run'); if (ls && rn) { rn.textContent = ls.dataset.lesson; [...p.classList].filter(c => c.startsWith('c-')).forEach(c => p.classList.remove(c)); p.classList.add('c-' + ls.dataset.lcol); }
    p.querySelectorAll('[data-sec]').forEach(s => { if (!res.secs[s.dataset.sec]) res.secs[s.dataset.sec] = n; });
    p.querySelectorAll('[data-word]').forEach(w => { if (!res.words[w.dataset.word]) res.words[w.dataset.word] = n; });
  });
  document.querySelectorAll('[data-pageof]').forEach(s => { const v = res.secs[s.dataset.pageof]; if (v) s.textContent = v; else res.errors.push('Renvoi introuvable : ' + s.dataset.pageof); });
  document.querySelectorAll('[data-wordpage]').forEach(s => { const v = res.words[s.dataset.wordpage]; if (v) s.textContent = v; else res.errors.push('Page introuvable : ' + s.dataset.wordpage); });
  document.querySelectorAll('[data-numof]').forEach(s => { const v = res.num[s.dataset.numof]; if (v) s.textContent = v; else res.errors.push('Numéro introuvable : ' + s.dataset.numof); });
  document.querySelectorAll('.rp3').forEach(rp => { const ps = [...rp.querySelectorAll(':scope > p')]; ps.sort((x, y) => (+x.querySelector('[data-numof]').textContent || 0) - (+y.querySelector('[data-numof]').textContent || 0)).forEach(x => rp.appendChild(x)); });
  document.querySelectorAll('.bilan td').forEach(td => { const bs = [...td.querySelectorAll('[data-numof]')]; if (bs.length > 1) td.innerHTML = bs.map(b => +b.textContent).sort((a, b) => a - b).map(x => `<b>${x}</b>`).join(', '); });
  // version 3 : les coups de pouce (écrits à l’envers) descendent en bas de leur page ; la hauteur totale ne change pas
  document.querySelectorAll('#out .page').forEach(pg => { const ps = [...pg.querySelectorAll('.inner .pouce-inv')]; if (!ps.length) return; const f = document.createElement('div'); f.className = 'pfoot'; ps.forEach(x => f.appendChild(x)); pg.appendChild(f); res.pouces = (res.pouces || 0) + ps.length; });
  // coups de pouce : dans l’ordre des numéros d’exercice, page par page
  // (tri par groupe : on ne mélange jamais deux chapitres)
  document.querySelectorAll('#out .inner').forEach(inn => { const runs = []; let cur = null;
    [...inn.children].forEach(k => { if (k.matches('.pc, .kq')) { if (!cur) runs.push(cur = []); cur.push(k); } else cur = null; });
    runs.filter(r => r.length > 1).forEach(pcs => { const anchor = pcs[0].previousElementSibling; const sorted = pcs.slice().sort((x, y) => (+x.querySelector('[data-numof]').textContent || 0) - (+y.querySelector('[data-numof]').textContent || 0)); pcs.forEach(x => x.remove()); let ref = anchor; sorted.forEach(x => { if (ref) ref.after(x); else inn.prepend(x); ref = x; }); }); });
  // corrigé express : dans l’ordre des numéros d’exercice
  document.querySelectorAll('.cc').forEach(cc => { const ps = [...cc.querySelectorAll(':scope > p')]; ps.sort((x, y) => (+x.querySelector('.cn').textContent || 0) - (+y.querySelector('.cn').textContent || 0)).forEach(x => cc.appendChild(x)); });
  // formules : jamais coupées par un retour à la ligne. Seules les opérations réellement coupées sont jointes (espaces insécables), si la page a la place ; sinon on les signale
  res.mxfix = 0; res.mxkeep = [];
  {
    const NB = '\\u00a0\\u202f', NUM = `\\d+(?:[${NB} ]\\d{3}(?!\\d))*(?:,\\d+)?(?:[a-zA-Z](?![\\p{L}]))?[²³]?`, UNIT = `(?:[${NB} ]?(?:%|€|°|cm|km|kg|mm|ml|cl|min|[mgLhs])[²³]?(?![\\p{L}]))?`;
    const OPD = `(?:[A-Za-z]{0,3}\\([^()<>]{1,40}\\)[²³]?|${NUM}${UNIT}|[a-zA-Z](?![\\p{L}])[²³]?)`;
    const OP = `[${NB} ]?[+−×÷=≈<>≤≥/·][${NB} ]?`;
    const COORD = `\\([−-]?\\d+(?:,\\d+)?[${NB} ]?;[${NB} ]?[−-]?\\d+(?:,\\d+)?\\)`;
    const RE = new RegExp(`${COORD}|${OPD}(?:${OP}${OPD})+`, 'gu');
    [...out.children].forEach((pg, i) => { const inn = pg.querySelector('.inner'); if (!inn) return;
      const w = document.createTreeWalker(inn, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.parentElement && !n.parentElement.closest('.katex,.katex-mathml,svg,script,style,textarea,template,.pfoot') && /[+−×÷=≈<>≤≥\/·;]/.test(n.nodeValue)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
      const nodes = []; let t; while ((t = w.nextNode())) nodes.push(t);
      nodes.forEach(n => { const s = n.nodeValue; RE.lastIndex = 0; let m;
        while ((m = RE.exec(s))) { if (m[0].length < 4 || m[0].length > 130) continue;
          const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
          if (new Set([...rg.getClientRects()].filter(r => r.width > 0.5).map(r => Math.round(r.top / 4))).size < 2) continue;
          const cur = n.nodeValue; n.nodeValue = cur.slice(0, m.index) + m[0].replace(/ /g, ' ') + cur.slice(m.index + m[0].length);
          if (over(inn)) { n.nodeValue = cur; res.mxkeep.push('p. ' + (i + 1) + ' : ' + m[0]); } else res.mxfix++; } }); });
  }
  // contrôles : rien ne déborde, ni en bas ni à droite
  [...out.children].forEach((p, i) => { const el = p.querySelector('.inner'); if (el && over(el)) res.errors.push('Page ' + (i + 1) + ' déborde');
    if (PROF) return;
    p.querySelectorAll('.ex, .gcard, .az, .chead, .ghead').forEach(b => { const R = b.getBoundingClientRect();
      for (const d of b.querySelectorAll('span,b,i,p,div,li,td,svg,strong')) { if (d.closest('.prof-only')) continue; const r = d.getBoundingClientRect(); if (r.width && r.right > R.right + 0.5) { res.errors.push(`Page ${i + 1} : dépasse du cadre → « ${(d.textContent || d.tagName).trim().slice(0, 40)} »`); break; } } }); });
  document.body.classList.remove('paging');
  // version professeur : une réponse rouge plus longue que son pointillé élargit le pointillé (elle ne passe jamais sur le texte qui suit), si la page a la place
  res.ansfix = 0; res.anskeep = [];
  if (PROF) { const cv = document.createElement('canvas').getContext('2d');
    [...out.children].forEach((pg, i) => { const inn = pg.querySelector('.inner'); if (!inn) return;
      inn.querySelectorAll('[data-a]').forEach(e => { const cs = getComputedStyle(e, '::after'); if (!cs || cs.content === 'none' || cs.whiteSpace !== 'nowrap' || cs.position !== 'absolute') return;
        const left = parseFloat(cs.left); if (isNaN(left) || e.classList.contains('rl')) return; const r = e.getBoundingClientRect(); if (!r.width) return;
        cv.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; const wd = cv.measureText(e.getAttribute('data-a')).width, need = left + wd + 5; if (need <= r.width) return;
        const old = e.style.minWidth; e.style.minWidth = need + 'px'; if (over(inn)) { e.style.minWidth = old; res.anskeep.push('p. ' + (i + 1) + ' : ' + e.getAttribute('data-a').slice(0, 40)); } else res.ansfix++; }); }); }
  res.pages = out.children.length; window.__result = res;
})();
