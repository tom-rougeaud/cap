/* Maths · CAP — application (aucune donnée envoyée : tout reste sur l’appareil).
   6 onglets par chapitre : Départ · Leçon · Méthodes · S’entraîner · Problèmes · S’évaluer (format du CCF) ; fiches de révision ; trois CCF blancs. */
(function () {
  'use strict';
  const DATA = JSON.parse(document.getElementById('mcv-data').textContent);
  const M = window.MCVG, TR = window.MCVT;
  const APP = 'mcvcap', VER = 'v1', KEY = k => `${APP}.${VER}.${k}`;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const CH = DATA.chapitres, byId = Object.fromEntries(CH.map(c => [c.id, c]));
  const rnd9 = () => Math.floor(Math.random() * 1e9);

  /* ---------- stockage local, avec repli en mémoire ---------- */
  const MEM = {};
  const store = {
    get(k, d) { try { const v = localStorage.getItem(KEY(k)); return v == null ? (k in MEM ? MEM[k] : d) : JSON.parse(v); } catch (e) { return k in MEM ? MEM[k] : d; } },
    set(k, v) { MEM[k] = v; try { localStorage.setItem(KEY(k), JSON.stringify(v)); } catch (e) { /* stockage indisponible : on garde en mémoire */ } },
    clear() { Object.keys(MEM).forEach(k => delete MEM[k]); try { Object.keys(localStorage).filter(k => k.startsWith(`${APP}.`)).forEach(k => localStorage.removeItem(k)); } catch (e) { } }
  };
  const prog = () => store.get('progression', {});
  const setProg = (cid, ex, val) => { const p = prog(); p[cid] = p[cid] || {}; p[cid][ex] = Object.assign({}, p[cid][ex], val, { date: new Date().toISOString().slice(0, 10) }); store.set('progression', p); };
  const prefs = () => store.get('preferences', { texte: 1 });

  /* ---------- lecture à voix haute (voix de l’appareil, rien n’est envoyé) ---------- */
  const canSpeak = 'speechSynthesis' in window;
  function speak(text) {
    if (!canSpeak) return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').replace(/×/g, ' fois ').replace(/÷/g, ' divisé par ').replace(/−/g, ' moins ')); u.lang = 'fr-FR'; u.rate = .92; const v = speechSynthesis.getVoices().find(v => /^fr/i.test(v.lang)); if (v) u.voice = v; speechSynthesis.speak(u); } catch (e) { }
  }
  const sayBtn = sel => canSpeak ? `<button class="say" data-say="${sel}" aria-label="Écouter">🔊</button>` : '';

  /* ---------- encouragements : on félicite la démarche ---------- */
  const BRAVO = ['✅ Juste ! Tu as suivi la méthode : c’est le bon réflexe.', '✅ Bravo, c’est exact.', '✅ Exact ! Tu peux vérifier l’ordre de grandeur : il est cohérent.', '✅ Bien joué : calcul juste et propre.', '✅ C’est ça ! Tu progresses.'];
  const bravo = () => BRAVO[Math.floor(Math.random() * BRAVO.length)];
  const CPS = { app: 'S’approprier', ana: 'Analyser', rea: 'Réaliser', val: 'Valider', com: 'Communiquer' }, ORD = ['app', 'ana', 'rea', 'val', 'com'];

  /* ---------- progression et « Je sais faire » ---------- */
  const doneOf = (c, id) => { if (/^n\d/.test(id)) return !!((prog()[c.id] || {})['lc' + id.slice(1)] || {}).ok; const s = (prog()[c.id] || {})[id] || {}; return !!(s.fait || s.ok); };
  const progressOf = c => { const ids = [...c.entraine.map(e => e.id), ...c.probs.map(p => p.id)]; const done = ids.filter(id => doneOf(c, id)).length; return { done, total: ids.length, pct: Math.round(done / ids.length * 100) }; };
  const saisList = c => `<ul class="sais">${c.bilan.map(([t, ids]) => { const ok = ids.every(id => doneOf(c, id)); return `<li class="${ok ? 'on' : ''}"><span class="sk">${ok ? '✓' : ''}</span>${t}</li>`; }).join('')}</ul>`;

  /* ---------- accueil ---------- */
  function home() {
    return `<section class="hero">${DATA.deco ? `<div class="hero-deco" aria-hidden="true">${DATA.deco}</div>` : ''}<div class="hero-l"><span class="sigma">Σ</span></div><div><p class="kick">Mathématiques · CAP</p><h1>Maths · CAP</h1><p class="sub">Pop culture et CCF · séries, cinéma, jeux, sport</p></div></section>
    <p class="lead">Choisis un chapitre. Chacun part d’une scène de pop culture, avec de vraies données : une leçon où chaque notion se découvre pas à pas, des méthodes, de l’entraînement corrigé tout de suite, des problèmes, puis une évaluation au format du CCF. Les chapitres marqués ➕ complètent le tronc commun selon ton groupement.</p>
    <div class="grid">${CH.map(c => { const p = progressOf(c), ev = ((prog()[c.id] || {}).ev || {}).best; return `<a class="card c-${c.col}" href="#/${c.id}"><span class="card-n">${c.n}</span><span class="card-i">${c.icone}</span><span class="card-t">${esc(c.titre)}</span><span class="card-d">${esc(c.dom)}${c.plus ? ` · <b class="plus">➕ ${esc(c.plus)}</b>` : ''}</span><span class="bar"><i style="width:${p.pct}%"></i></span><span class="card-p">${p.done} / ${p.total} exercices réussis${ev != null ? ` · 🎯 ${String(ev).replace('.', ',')}/10` : ''}</span></a>`; }).join('')}</div>
    <div class="tiles"><a class="tile" href="#/de-college">🔗 <b>Ce que tu sais déjà</b><span>Ce que chaque chapitre reprend du collège</span></a><a class="tile" href="#/fiches">📄 <b>Fiches de révision</b><span>Une fiche par chapitre, avec quatre réflexes à tester</span></a><a class="tile" href="#/ccf">🎓 <b>Trois CCF blancs</b><span>45 minutes, sur 10, comme en classe</span></a><a class="tile" href="#/glossaire">🔤 <b>Glossaire visuel</b><span>Tous les mots, avec un schéma</span></a>${DATA.pdf ? `<a class="tile" href="${DATA.pdf}" download>📘 <b>Le manuel PDF</b><span>Tout le manuel, à imprimer ou à lire hors ligne</span></a>` : `<span class="tile" aria-disabled="true">📘 <b>Le manuel PDF</b><span>Bientôt disponible</span></span>`}<a class="tile" href="#/donnees">💾 <b>Mes données</b><span>Exporter, importer, effacer, taille du texte</span></a></div>`;
  }

  /* ---------- chapitre ---------- */
  const TABS = [['depart', '🚀 Départ'], ['lecon', '📘 Leçon'], ['methodes', '🧭 Méthodes'], ['entrainement', '✏️ S’entraîner'], ['problemes', '🧩 Problèmes'], ['evaluer', '🎯 S’évaluer']];
  const pdfOf = c => DATA.pdfch ? DATA.pdfch.replace('{n}', c.n) : '';
  function chapter(c, tab) {
    tab = TABS.some(t => t[0] === tab) ? tab : 'depart';
    const head = `<section class="chead2 c-${c.col}"><a class="back" href="#/">← Chapitres</a><p class="ck">Chapitre ${c.n} · ${esc(c.dom)}${c.plus ? ` · ➕ ${esc(c.plus)}` : ''}</p><h1>${c.icone} ${esc(c.titre)}</h1><p class="sous">${esc(c.sous || '')}</p>
      <p class="hbtns">${pdfOf(c) ? `<a class="btn ghost" href="${pdfOf(c)}" download>📘 PDF du chapitre</a>` : ''}<a class="btn ghost" href="#/fiches/${c.id}">📄 Fiche de révision</a><button class="btn ghost" data-sais>✅ Je sais faire</button></p><div class="saisbox" hidden>${saisList(c)}</div></section>
      <nav class="tabs c-${c.col}" role="tablist">${TABS.map(([k, l]) => `<a role="tab" href="#/${c.id}/${k}" class="${k === tab ? 'on' : ''}" aria-selected="${k === tab}">${l}</a>`).join('')}</nav>`;
    let body = '';
    if (tab === 'depart') body = departView(c);
    if (tab === 'lecon') body = leconView(c);
    if (tab === 'methodes') body = methodesView(c);
    if (tab === 'entrainement') body = autoApp(c) + `<p class="hint">Chaque exercice a un support à compléter. Les nombres changent à chaque essai : <b>🔄 Nouveaux nombres</b>. Bloqué ? Demande un indice.</p>` + c.entraine.map((e, i) => trCard(c, e, i)).join('') + (c.scratch || []).map((sx, j) => scratchCard(c, sx, c.entraine.length + j)).join('');
    if (tab === 'problemes') body = `<p class="hint">Je lis tout l’énoncé, je surligne les données, je dis avec mes mots ce que je cherche. Puis je réponds question par question.</p>` + c.probs.map((p, i) => probCard(c, p, i + 1 + c.entraine.length + (c.scratch || []).length)).join('') + metierCard(c);
    if (tab === 'evaluer') body = evalView(c);
    return head + `<div class="tabbody">${body}</div>` + `<nav class="chnav">${c.n > 1 ? `<a href="#/c${c.n - 1}">← Chapitre ${c.n - 1}</a>` : '<span></span>'}${c.n < CH.length ? `<a href="#/c${c.n + 1}">Chapitre ${c.n + 1} →</a>` : ''}</nav>`;
  }

  /* ---------- « Ce que tu sais déjà » ---------- */
  const pontApp = c => `<article class="pont c-${c.col}"><h3>🔗 Ce que tu sais déjà : ce qui reste, ce qui change au CAP</h3><div class="pont-g"><div class="pont-a"><p class="pont-k">Avant le CAP, tu as appris</p><ul>${c.pont.de.map(x => `<li><b class="pont-n">${x.niv}</b> <i>${esc(x.titre)}</i> : ${x.sais}</li>`).join('')}</ul><p class="pont-ex"><b>Exemple du collège</b> · ${c.pont.ex2}</p></div><div class="pont-b"><p class="pont-k">Au CAP, la même situation va plus loin</p><p class="pont-ex">${c.pont.ex1}</p></div></div><div class="pont-g3"><div><p class="pont-k">✅ Ce qui reste</p><ul>${c.pont.reste.map(x => `<li>${x}</li>`).join('')}</ul></div><div><p class="pont-k">➕ Ce qui change</p><ul>${c.pont.change.map(x => `<li>${x}</li>`).join('')}</ul></div><div><p class="pont-k">🎯 À quoi ça sert</p><p>${c.pont.pourquoi}</p></div></div></article>`;
  const pontPage = () => `<section class="chead2 c-brand"><a class="back" href="#/">← Accueil</a><h1>🔗 Ce que tu sais déjà</h1><p>Chaque chapitre part de ce que tu as appris au collège, puis va plus loin. Tu n’as pas tout retenu ? C’est normal : chaque chapitre commence par le rappeler.</p></section>`
    + CH.map(c => `<article class="pontl c-${c.col}"><span class="card-n">${c.n}</span><div><h3><a href="#/${c.id}">${c.icone} ${esc(c.titre)}</a></h3><p class="small">S’appuie sur : ${c.pont.de.map(x => `${x.niv} · ${esc(x.titre)}`).join(' · ')}</p><p>➜ ${c.pont.fil}</p></div></article>`).join('');

  /* ---------- zone « Automatismes » : 5 questions flash, nouvelles à chaque tirage ---------- */
  const AUTOS = {};
  const autoApp = c => { if (!window.MCVA) return ''; const seed = AUTOS[c.id] || (AUTOS[c.id] = rnd9()), qs = window.MCVA.gen(c.id, seed, 10);
    return `<article class="auto c-${c.col}" data-c="${c.id}"><div class="ex-h"><span class="num2">⚡</span><span class="ex-t">Automatismes · 10 minutes, sans calculatrice</span><button class="btn sm ghost" data-auto-new>🔄 Nouvelles questions</button></div><p class="cons">Comme la partie 1 du CCF : les automatismes du chapitre, puis d’autres automatismes. Réponds de tête, puis vérifie.</p><ol class="auto-q">${qs.map((q, j) => `<li class="aq" data-j="${j}"><p>${q.t}</p>${q.choices ? `<span class="chs">${q.choices.map((ch, k) => `<button class="ch" data-ak="${k}">${ch}</button>`).join('')}</span>` : `<input class="inp" inputmode="decimal" autocomplete="off" aria-label="Réponse ${j + 1}">`}<span class="afb" aria-live="polite"></span></li>`).join('')}</ol><div class="ex-act"><button class="btn" data-auto-check>Vérifier</button><span class="score"></span></div></article>`; };
  document.addEventListener('click', e => { const ak = e.target.closest('.aq [data-ak]'); if (ak) { $$('.ch', ak.parentNode).forEach(b => b.classList.toggle('sel', b === ak)); return; } const t = e.target.closest('[data-auto-check],[data-auto-new]'); if (!t) return; const card = t.closest('.auto'), cid = card.dataset.c;
    if (t.hasAttribute('data-auto-new')) { AUTOS[cid] = rnd9(); const tmp = document.createElement('div'); tmp.innerHTML = autoApp(byId[cid]); card.replaceWith(tmp.firstElementChild); return; }
    const qs = window.MCVA.gen(cid, AUTOS[cid], 10); let ok = 0;
    $$('.aq', card).forEach((li, j) => { const q = qs[j]; let good; if (q.choices) { const sel = $('.ch.sel', li); good = !!sel && +sel.dataset.ak === q.ok; } else { const v = M.parse(String($('.inp', li).value).replace(/\s*€/, '').replace(/\s/g, '')); good = Number.isFinite(v) && Math.abs(v - q.v) <= q.tol; }
      li.classList.toggle('ok', good); li.classList.toggle('ko', !good); $('.afb', li).innerHTML = good ? '✅' : `❌ <span class="sol">${q.a}</span>`; if (good) ok++; });
    $('.score', card).textContent = `${ok} / ${qs.length}`; });
  window.MCVAUTO = cid => window.MCVA.gen(cid, AUTOS[cid], 10);

  /* ---------- 1. départ : la scène, puis un document interactif ---------- */
  let DEP = null;
  function departView(c) {
    const seed = rnd9(), d = TR.dep(c.depart, seed);
    DEP = { c, d, got: {} };
    return `<article class="au3 c-${c.col}"><div class="au3-sc">${c.scene}</div><div class="au3-t"><p class="au3-k">🎬 La scène <span class="mt-r">${c.metier.roles.map(r => `<span>${r}</span>`).join('')}</span></p><p>${c.travail.question}</p><p class="small">${c.metier.txt}</p><div class="plan">${c.parties.map((p, k) => `<p class="plan-p"><span class="plan-l">${'ABCDE'[k]}</span><span><b>${p.t}</b><br><small>${p.n.map(j => `${j}. ${c.notions[j - 1].titre}`).join(' · ')}</small></span></p>`).join('')}</div><ul class="objs">${c.objectifs.map(o => `<li>🎯 ${o}</li>`).join('')}</ul></div></article>${pontApp(c)}
      <article class="dep c-${c.col}" id="dep"><div class="ex-h"><span class="num2">🚀</span><span class="ex-t">Point de départ · ${d.titre}</span><button class="btn sm ghost" data-newdep>🔄 Nouveau document</button></div>
      <p class="cons">Lis le document, puis réponds. ${d.qs.some(q => q.kind === 'tap') || d.qs.some(q => q.kind === 'qcm' && hasCells(d, q)) ? 'Pour certaines questions, <b>touche directement le document</b>.' : ''}</p>
      <div class="dep-g"><div class="dep-doc" id="dep-doc">${d.doc}</div><ol class="dep-q">${d.qs.map((q, j) => `<li class="dq" data-j="${j}"><p>${q.t}</p>${q.kind === 'tap' ? `<p class="tapme">👆 Touche la bonne case du tableau.</p>` : q.kind === 'qcm' ? `<span class="chs">${q.choices.map((ch, k) => `<button class="ch" data-dk="${k}">${ch}</button>`).join('')}</span>${hasCells(d, q) ? '<p class="tapme small">… ou touche le document.</p>' : ''}` : `<span class="qa-r"><input class="inp" inputmode="decimal" autocomplete="off" aria-label="Réponse ${j + 1}"><button class="btn sm" data-dv>Vérifier</button></span>`}<p class="qa-fb" aria-live="polite"></p></li>`).join('')}</ol></div>
      <p class="score" id="dep-score"></p></article>`;
  }
  const hasCells = (d, q) => q.kind === 'qcm' && q.choices.every((_, k) => d.doc.includes(`data-cell="${k}"`));
  let depActive = 0;
  function depAnswer(j, ok, html) {
    const li = $(`.dq[data-j="${j}"]`); if (!li) return;
    DEP.got[j] = DEP.got[j] || ok; li.classList.toggle('ok', ok); li.classList.toggle('ko', !ok);
    $('.qa-fb', li).innerHTML = html;
    const n = Object.values(DEP.got).filter(Boolean).length; $('#dep-score').textContent = `${n} / ${DEP.d.qs.length} réponses justes`;
    if (n === DEP.d.qs.length) { setProg(DEP.c.id, 'dep', { ok: true }); $('#dep-score').textContent += ' · 🎉 Tu es prêt pour la leçon !'; }
  }

  /* ---------- 2. leçon : une notion en cinq temps, dans l’ordre logique ---------- */
  const TEMPS = [['decouvre', '🔎 Je découvre'], ['methode', '🧭 La méthode'], ['solution', '✅ La solution'], ['retiens', '📌 Je retiens'], ['amoi', '✏️ À moi']];
  function leconView(c) {
    return `<p class="hint">Chaque notion part d’une question. Lis-la, cherche un peu, puis découvre la méthode étape par étape, la solution, ce qu’il faut retenir, et entraîne-toi tout de suite.</p>` + c.notions.map((nt, i) => `<article class="nt c-${c.col}" id="nt${i + 1}" data-t="1" data-c="${c.id}" data-i="${i + 1}"><p class="nt-k">Notion ${i + 1} sur ${c.notions.length} · Partie ${'ABCDE'[c.parties.findIndex(p => p.n.includes(i + 1))]} · ${c.parties.find(p => p.n.includes(i + 1)).t}</p><div class="lc-h"><span class="lc-n">${i + 1}</span>${nt.titre}</div>
      <div class="tp tp-decouvre"><span class="t3">🔎 Je découvre</span>${sayBtn(`#nt${i + 1} .tp-decouvre p`)}<div class="tp-dg"><p>${nt.decouvre.txt}</p><div class="tp-img">${nt.decouvre.img}</div></div><p class="small">Prends le temps de chercher : qu’est-ce qu’on te demande ? Quel calcul essayer ?</p></div>
      <div class="tp tp-methode" hidden><span class="t3">🧭 La méthode, pas à pas</span><button class="btn sm ghost replay" data-replay-vis>▶ Rejouer</button><ol class="mth">${nt.methode.map(m => `<li>${m}</li>`).join('')}</ol>${nt.vois}</div>
      <div class="tp tp-solution" hidden><div class="sol3"><span class="t3">✅ La solution</span>${nt.solution}</div></div>
      <div class="tp tp-retiens" hidden><div class="lc-r"><span class="lc-t">📌 Je retiens</span>${nt.retiens}</div><div class="att">⚠️ <b>Attention</b> · ${nt.attention}</div></div>
      <div class="tp tp-amoi" hidden><span class="t3">✏️ À moi</span><ol class="amoi">${nt.amoi.map(([q, a], k) => `<li><p>${q}</p><p class="qa-r"><input class="inp" autocomplete="off" aria-label="Ma réponse ${k + 1}" placeholder="ma réponse"><button class="btn sm ghost" data-amoi="${k}">Voir la réponse</button></p><p class="amoi-a" hidden>💬 ${a}</p></li>`).join('')}</ol></div>
      <div class="ex-act"><button class="btn" data-temps="${i + 1}">${TEMPS[1][1]} ▶</button><button class="btn ghost" data-tout="${i + 1}">Tout afficher</button><span class="tpc">1 / 5</span></div></article>`).join('')
      + `<article class="mk c-${c.col}"><div class="lc-h"><span class="lc-n">🔤</span>Les mots à connaître</div><table class="tbl mkt3"><tr><th>Le mot</th><th>Ce qu’il veut dire</th><th>En exemple</th></tr>${c.mots.map(r => `<tr><td class="mk-w">${r[0]}</td><td>${r[1]}</td><td class="mk-x">« ${r[2]} »</td></tr>`).join('')}</table></article>`;
  }
  function showTemps(art, all) {
    const tps = $$('.tp', art), N = TEMPS.length, n = all ? N : Math.min(N, (+art.dataset.t || 1) + 1);
    tps.forEach((tp, k) => { if (k < n && tp.hidden) { tp.hidden = false; if (tp.classList.contains('tp-methode')) playVis(tp); } });
    art.dataset.t = n; $('.tpc', art).textContent = `${n} / ${N}`;
    const b = $('[data-temps]', art); if (n >= N) { b.disabled = true; b.textContent = '✓ Notion vue'; setProg(art.dataset.c, 'lc' + art.dataset.i, { ok: true }); } else b.textContent = `${TEMPS[n][1]} ▶`;
  }
  function playVis(box) { const s = $('svg.vis', box) || $('.vhex svg.vis', box); if (!s) return; s.classList.remove('play'); void s.getBoundingClientRect(); s.classList.add('play'); }

  /* ---------- 3. méthodes : résolu pas à pas, résolu à compléter, simulateur ---------- */
  const norm = s => String(s).toLowerCase().replace(/[\s’'.]/g, '').replace(/€|%|min|cm|m$/g, '').normalize('NFD').replace(/[̀-ͯ]/g, '');
  function methodesView(c) {
    const [r1, r2] = c.resolus;
    let k = 0;
    const a1 = `<article class="rs c-${c.col}"><div class="rs-h"><span class="rs-k">Exercice résolu</span><span class="rs-t">${r1.titre}</span></div><div class="rs-en" id="rs0">${r1.enonce}${r1.doc ? `<div class="rs-doc">${r1.doc}</div>` : ''}${sayBtn('#rs0')}</div><table class="rs-t2"><tr><th>Ce que j’écris</th><th>Pourquoi je le fais</th></tr>${r1.rows.map((x, j) => `<tr class="step" ${j ? 'hidden' : ''}><td class="rs-w"><span class="rs-s">${j + 1}</span><span>${x[0]}</span></td><td class="rs-x">${x[1]}</td></tr>`).join('')}</table><div class="rs-act"><button class="btn" data-next>Étape suivante ▶</button><button class="btn ghost" data-all>Tout afficher</button></div><p class="rs-ver" hidden>🔁 <b>Je vérifie</b> · ${r1.verif}</p><p class="rs-rep" hidden>✅ ${r1.rep}</p></article>`;
    const fill = h => h.replace(/⟦([^⟧]+)⟧/g, (m, a) => `<input class="inp rsi" data-k="${k++}" data-a="${esc(a.replace(/<[^>]+>/g, ''))}" aria-label="Case à compléter" size="${Math.max(4, Math.min(18, a.length + 1))}">`);
    const a2 = `<article class="rs rs2 c-${c.col}" id="rs2"><div class="rs-h"><span class="rs-k">✍️ À toi</span><span class="rs-t">${r2.titre}</span></div><div class="rs-en">${r2.enonce}${r2.doc ? `<div class="rs-doc">${r2.doc}</div>` : ''}</div><table class="rs-t2"><tr><th>Ce que j’écris</th><th>Pourquoi je le fais</th></tr>${r2.rows.map((x, j) => `<tr><td class="rs-w"><span class="rs-s">${j + 1}</span><span>${fill(x[0])}</span></td><td class="rs-x">${x[1]}</td></tr>`).join('')}</table><div class="rs-act"><button class="btn" data-rs2>Vérifier mes cases</button><span class="score"></span></div><p class="rs-ver">🔁 <b>Je vérifie</b> · ${r2.verif}</p><p class="rs-rep" hidden>✅ ${r2.rep}</p></article>`;
    return `<h2 class="etape">Une méthode, deux temps : je regarde, puis je fais</h2>` + a1 + a2 + (window.MCVW && window.MCVW[c.id] ? `<h2 class="etape">🎛️ Je manipule</h2><div id="wg" class="c-${c.col}"></div>` : '');
  }
  function checkRs2(art) {
    let ok = 0; const ins = $$('.rsi', art);
    const NUM = /^[−-]?[\d\s]+([,.]\d+)?\s*(€|%|min|cm|m|L|h|kg|km|ans?)?$/, num = x => M.parse(String(x).replace(/\s*(€|%|min|cm|m|L|h|kg|km|ans?)$/, '').replace(/\s/g, ''));
    ins.forEach(i => { const a = i.dataset.a.trim(), v = i.value.trim();
      let good; if (NUM.test(a)) { const nv = num(v); good = Number.isFinite(nv) && Math.abs(nv - num(a)) < .006; } else good = norm(v) === norm(a) || (norm(v).length > 3 && norm(a).includes(norm(v)));
      i.classList.toggle('good', good); i.classList.toggle('bad', !good); if (good) ok++; else i.title = 'Attendu : ' + a; });
    $('.score', art).textContent = ok === ins.length ? `${ok} / ${ins.length} · ${bravo()}` : `${ok} / ${ins.length} · Relis l’exercice résolu juste au-dessus : la méthode est la même.`;
    if (ok === ins.length) { $('.rs-rep', art).hidden = false; setProg(art.dataset.c || cur(), 'r2', { ok: true }); }
    else if ((+art.dataset.n || 0) >= 1) $$('.rsi.bad', art).forEach(i => { const s = document.createElement('span'); s.className = 'sol'; s.textContent = ' → ' + i.dataset.a; if (!i.nextElementSibling || !i.nextElementSibling.classList.contains('sol')) i.after(s); });
    art.dataset.n = (+art.dataset.n || 0) + 1;
  }
  const cur = () => location.hash.replace(/^#\/?/, '').split('/')[0];

  /* ---------- 4. s’entraîner : supports visuels générés ---------- */
  const SEEDS = {};
  const genOf = (c, e) => { const k = c.id + e.id; if (!SEEDS[k]) SEEDS[k] = rnd9(); return TR.tr(e.gen, SEEDS[k]); };
  const nivB = e => e.niv ? `<span class="niv niv-${e.niv > 0 ? 'd' : 'a'}">${e.niv > 0 ? '🚀 Défi' : '🌱 Guidé'}</span>` : '';
  const nivNote = (e, n) => `<p class="niv-n">${e.niv > 0 ? `Tu as réussi l’exercice ${n} ? Voici le même thème, avec un défi en plus.` : `Si l’exercice ${n} te résiste, commence ici : même thème, nombres plus simples, début déjà fait.`}</p>`;
  function trCard(c, e, i) {
    const g = genOf(c, e), best = ((prog()[c.id] || {})[e.id] || {}).best;
    const inline = new Set(g.items.filter(it => g.support.includes(`data-k="${it.k}"`)).map(it => it.k));
    const below = g.items.filter(it => !inline.has(it.k));
    return `<article class="ex2 tr c-${c.col}" id="ex-${e.id}" data-c="${c.id}" data-e="${e.id}" data-h="0"><div class="ex-h"><span class="num2">${i + 1}</span>${nivB(e)}<span class="ex-t">${g.titre}</span><span class="lcref">notion ${e.lc}</span>${best != null ? `<span class="best">★ ${best}/${g.items.length}</span>` : ''}</div>${e.niv ? nivNote(e, trAll(c).findIndex(x => x.id === e.base) + 1) : ''}<p class="cons">${g.consigne}</p>
      <div class="sup">${g.support}</div>${below.length ? `<div class="its3">${below.map(it => `<div class="it3" data-k="${it.k}"><b>${it.k}.</b>${it.qcm ? `<span class="chs">${it.qcm.choices.map((ch, k) => `<button class="ch" data-k="${k}">${ch}</button>`).join('')}</span>` : `<input class="inp" inputmode="decimal" autocomplete="off" aria-label="Réponse ${it.k}">`}<span class="itfb" aria-live="polite"></span></div>`).join('')}</div>` : ''}
      <div class="ex-act"><button class="btn" data-check>Vérifier</button><button class="btn ghost" data-hint>💡 Indice 1</button><button class="btn ghost" data-new>🔄 Nouveaux nombres</button><span class="score"></span></div><div class="hints"></div><div class="fbs" aria-live="polite"></div></article>`;
  }
  /* Je programme avec Scratch : lire un programme, répondre */
  const scratchCard = (c, sx, i) => `<article class="ex2 scr c-${c.col}"><div class="ex-h"><span class="num2">${i + 1}</span><span class="ex-t">🐱 Je programme · ${sx.titre}</span><span class="lcref">notion ${sx.lc}</span></div><p class="cons">${sx.texte}</p><div class="scr-g">${sx.svg}<ol class="amoi">${sx.qs.map(([q, a], k) => `<li><p>${q}</p><p class="qa-r"><input class="inp" autocomplete="off" aria-label="Ma réponse ${k + 1}" placeholder="ma réponse"><button class="btn sm ghost" data-amoi="${k}">Voir la réponse</button></p><p class="amoi-a" hidden>💬 ${a}</p></li>`).join('')}</ol></div><p class="small">Tu peux tester ce programme sur scratch.mit.edu, ou dans l’éditeur Scratch de ton établissement.</p></article>`;
  const metierCard = c => { const m = c.metier.job; return `<article class="mt3a c-${c.col}"><h3>🧑‍🔧 Le métier derrière la scène</h3><p><b>${m.nom}</b> · ${m.fait}</p><p>📐 <b>Ses maths</b> · ${m.maths}</p><p class="small"><b>Après le CAP</b> · ${m.apres.join(' · ')}</p></article>`; };
  /* les cases lettrées du support deviennent des champs de saisie */
  function mountTr(card) {
    $$('.sup .tb[data-k]', card).forEach(tb => { const inp = document.createElement('input'); inp.className = 'inp tbi'; inp.dataset.k = tb.dataset.k; inp.setAttribute('inputmode', 'decimal'); inp.setAttribute('autocomplete', 'off'); inp.setAttribute('aria-label', 'Case ' + tb.dataset.k); inp.placeholder = tb.dataset.k; tb.replaceWith(inp); });
    // les cases dessinées (SVG) deviennent des champs posés sur le dessin, si l’écran est assez grand ; sinon, la liste sous le dessin
    const sup = $('.sup', card); if (!sup) return; sup.style.position = 'relative';
    $$('.sb', sup).forEach(g => { const k = ($('.sbk', g) || {}).textContent, it3 = k && $(`.it3[data-k="${k.trim()}"]`, card); if (!it3 || $('.ch', it3)) return;
      const r = $('rect', g).getBoundingClientRect(); if (r.height < 22 || r.width < 46) return;
      const inp = $('.inp', it3); inp.classList.add('tbi', 'ovl'); inp.dataset.k = k.trim(); inp.placeholder = k.trim(); inp._g = g; sup.appendChild(inp); it3.remove(); placeOvl(inp); });
    const its = $('.its3', card); if (its && !its.children.length) its.remove();
  }
  function placeOvl(inp) { const r = $('rect', inp._g).getBoundingClientRect(), s = inp.parentNode.getBoundingClientRect(), sup = inp.parentNode; Object.assign(inp.style, { position: 'absolute', left: (r.left - s.left + sup.scrollLeft) + 'px', top: (r.top - s.top + sup.scrollTop) + 'px', width: r.width + 'px', height: r.height + 'px', minHeight: '0', fontSize: Math.max(13, Math.min(18, r.height * .55)) + 'px', padding: '0 4px' }); }
  window.addEventListener('resize', () => $$('.ovl').forEach(placeOvl));
  function checkTr(card) {
    const c = byId[card.dataset.c], e = trAll(c).find(x => x.id === card.dataset.e), g = genOf(c, e); let ok = 0; const msgs = [];
    g.items.forEach(it => {
      const box = $(`.it3[data-k="${it.k}"]`, card), inp = box ? $('.inp', box) : $(`.tbi[data-k="${it.k}"]`, card);
      let val; if (it.qcm) { const sel = box && $('.ch.sel', box); val = sel ? sel.dataset.k : ''; } else val = inp ? inp.value : '';
      const v = TR.verdict(it, val); if (v.ok) ok++;
      const el = it.qcm ? box : inp; if (el) { el.classList.toggle('good', v.ok); el.classList.toggle('bad', !v.ok); }
      if (box) $('.itfb', box).textContent = v.ok ? '✅' : '❌';
      if (!v.ok && v.msg) msgs.push(`<p>🔎 <b>${it.k}.</b> ${v.msg}</p>`);
      else if (!v.ok && v.empty) msgs.push(`<p>✏️ <b>${it.k}.</b> Case vide : complète-la.</p>`);
    });
    const n = g.items.length, tries = (+card.dataset.n || 0) + 1; card.dataset.n = tries;
    $('.score', card).textContent = `${ok} / ${n}`;
    let html = msgs.join('');
    if (ok === n) html = `<p class="okmsg">${bravo()}</p>`;
    else if (tries >= 2 || +card.dataset.h >= 3) html += `<p><button class="btn sm ghost" data-sol>👁️ Voir les réponses</button></p>`;
    $('.fbs', card).innerHTML = html;
    const prev = ((prog()[c.id] || {})[e.id] || {}).best || 0;
    setProg(c.id, e.id, { best: Math.max(ok, prev), ok: ok === n || !!((prog()[c.id] || {})[e.id] || {}).ok });
  }
  function hint(card, list) { const h = +card.dataset.h || 0; if (h >= list.length) return; $('.hints', card).insertAdjacentHTML('beforeend', `<p class="hint1">💡 <b>Indice ${h + 1}</b> · ${list[h]}</p>`); card.dataset.h = h + 1; const b = $('[data-hint]', card); if (!b) return; if (h + 1 >= list.length) { b.disabled = true; b.textContent = '💡 Indices vus'; } else b.textContent = `💡 Indice ${h + 2}`; }

  const trAll = c => c.entraine;

  /* ---------- 5. problèmes ---------- */
  const ET = { 2: 'Petit problème', 3: 'Cas pratique', 4: 'Vers le CCF' };
  const findP = (c, id) => c.probs.find(x => x.id === id);
  function probCard(c, p, num, plus) {
    const st = (prog()[c.id] || {})[p.id] || {};
    return `${p.bulle && !plus ? `<div class="bulle2"><span>💬</span><p>${p.bulle}</p></div>` : ''}<article class="pb c-${c.col}${p.cls === 'bac' ? ' bac' : ''}" id="ex-${p.id}" data-c="${c.id}" data-p="${p.id}"${plus ? ' data-plus="1"' : ''} data-h="0"><div class="ex-h"><span class="num2">${num}</span>${p.niv ? nivB(p) : ''}${p.defi ? `<span class="defi">🏔️ Défi · ${p.defi} étapes</span>` : `<span class="et3b">${ET[p.etape] || 'Problème'}</span>`}<span class="ex-t">${p.titre}</span>${st.fait ? '<span class="best">✓ fait</span>' : ''}${sayBtn('#st-' + p.id)}</div>
      ${p.niv ? nivNote(p, c.probs.findIndex(x => x.id === p.base) + 1 + c.entraine.length + (c.scratch || []).length) : ''}${p.cls === 'bac' ? '<p class="bacline">🎓 Comme au CCF : une consigne claire, une réponse rédigée.</p>' : ''}<div class="stmt" id="st-${p.id}">${p.intro}</div>
      <div class="ans2">${p.seq.map(s => s.x != null ? `<div class="qx">${s.x}</div>` : qaBlock(p.qs[s.q], s.q)).join('')}${p.outro ? `<div class="qx">${p.outro}</div>` : ''}</div>
      ${p.autravail ? `<p class="autr2"><span class="cp2 cp-${p.autravail.comp}">${CPS[p.autravail.comp]}</span> 🧑‍🔧 <b>Dans un métier, cela sert à</b> ${p.autravail.txt}</p>` : ''}
      <div class="ex-act">${(p.hints || []).length ? `<button class="btn ghost" data-phint>💡 Indice 1</button>` : ''}${p.pouce ? `<button class="btn ghost" data-pouce>🤝 Coup de pouce</button>` : ''}<button class="btn ghost" data-corr>✔️ Correction</button><button class="btn" data-done>J’ai terminé</button></div><div class="hints"></div><p class="pouce2" hidden>🤝 ${p.pouce || ''}</p><p class="corr2" hidden>✔️ ${p.corr}</p></article>`;
  }
  const qaBlock = (q, j) => `<div class="qa" data-j="${j}"><p class="qa-q"><b>${q.l}</b> ${q.t}</p>${q.v != null ? `<div class="qa-r">${q.lab ? `<span class="qa-l">${q.lab}</span>` : ''}<input class="inp" inputmode="decimal" autocomplete="off" aria-label="Réponse ${esc(q.l)}" placeholder="ma réponse"><button class="btn sm" data-qv>Vérifier</button></div>` : `<div class="qa-r"><textarea class="inp txt" rows="2" aria-label="Réponse rédigée ${esc(q.l)}" placeholder="J’écris ma réponse ici"></textarea><button class="btn sm ghost" data-qs>Comparer</button></div>`}<p class="qa-fb" aria-live="polite"></p></div>`;
  function checkQ(pb, qa) {
    const c = byId[pb.dataset.c], p = findP(c, pb.dataset.p), q = p.qs[+qa.dataset.j], fb = $('.qa-fb', qa), n = (+qa.dataset.n || 0) + 1; qa.dataset.n = n;
    const v = TR.verdict({ v: q.v, tol: q.tol, err: q.err || [] }, $('.inp', qa).value);
    qa.classList.toggle('ok', v.ok);
    fb.innerHTML = v.ok ? `${bravo()} <span class="small">(${q.a})</span>` : v.msg ? `🔎 ${v.msg}` : n >= 2 ? `❌ Réponse attendue : <b>${q.a}</b>. Relis la correction pour voir le calcul.` : v.empty ? '✏️ Écris ta réponse.' : '❌ Pas encore. Relis les données surlignées, ou demande un indice.';
    if ($$('.qa', pb).every(x => x.classList.contains('ok') || !$('[data-qv]', x))) markDone(c, p, pb);
  }
  function markDone(c, p, pb) { setProg(c.id, p.id, { fait: true }); const b = $('[data-done]', pb); if (b) { b.textContent = '✓ Terminé'; b.disabled = true; } }

  /* ---------- 6. s’évaluer au format du CCF (partie 1 automatismes, partie 2 situations professionnelles, rédaction) ; CCF blancs ---------- */
  const pts = p => `${fr2(p)} pt${p > 1 ? 's' : ''}`, fr2 = x => String(Math.round(x * 100) / 100).replace('.', ',');
  let EV = null;
  const bestOf = key => { const p = prog(); return ((p[key[0]] || {})[key[1]] || {}).best; };
  /* une copie : e = { titre, lieu, grille, auto, exos, redac }, min = durée en minutes */
  function copie(e, col, key, kicker, min) {
    const all = [...e.auto, ...e.exos.flatMap(x => x.qs)], per = {}; all.forEach(q => { per[q.comp] = (per[q.comp] || 0) + q.pts; }); per.com = (per.com || 0) + e.redac;
    const best = bestOf(key); let k = 0;
    EV = { e, key, got: {}, done: false, t0: null, min, total: all.reduce((a, q) => a + q.pts, 0) + e.redac };
    const qHtml = (q, id) => `<div class="qa evq2" data-k="${id}"><p class="qa-q"><b>${id + 1}.</b> ${q.t} <span class="cp2 cp-${q.comp}">${CPS[q.comp]}</span> <span class="evpts">${pts(q.pts)}</span></p><div class="qa-r">${q.choices ? `<span class="chs">${q.choices.map((ch, j) => `<button class="ch" data-k="${j}">${ch}</button>`).join('')}</span>` : q.v != null ? `${q.lab ? `<span class="qa-l">${q.lab}</span>` : ''}<input class="inp" inputmode="decimal" autocomplete="off" aria-label="Réponse ${id + 1}" placeholder="ma réponse">` : `<textarea class="inp txt" rows="2" aria-label="Réponse rédigée ${id + 1}" placeholder="J’écris ma réponse"></textarea>`}</div><div class="evfb" aria-live="polite"></div></div>`;
    return `<section class="evh2 c-${col}"><p class="evk">${kicker}</p><h2>${esc(e.titre)}</h2><p>${e.lieu ? esc(e.lieu) + ' · ' : ''}durée : ${min >= 60 ? (min / 60) + ' h' : min + ' min'} · partie 1 sans calculatrice, partie 2 avec la calculatrice · noté sur ${fr2(EV.total)}</p><table class="tbl evg3"><tr><th>Compétence</th><th>Ce que je sais faire</th><th>Points</th></tr>${ORD.filter(o => per[o]).map(o => `<tr><td><span class="cp2 cp-${o}">${CPS[o]}</span></td><td class="tl">${e.grille[o]}</td><td>${pts(per[o])}</td></tr>`).join('')}</table><p class="evbar"><button class="btn sm" data-chrono>⏱️ Lancer le chrono (${min >= 60 ? (min / 60) + ' h' : min + ' min'})</button><span id="ev-timer" hidden></span>${best != null ? `<span class="best">★ meilleure note : ${fr2(best)} / ${fr2(EV.total)}</span>` : ''}</p></section>`
      + `<article class="evx2 c-${col}"><div class="ex-h"><span class="num2">1</span><span class="ex-t">Partie 1 · Automatismes · sans calculatrice</span><span class="lcref">${pts(e.auto.reduce((a, q) => a + q.pts, 0))}</span></div><p class="small">Réponds sans justifier.</p>${e.auto.map(q => qHtml(q, k++)).join('')}</article>`
      + `<p class="ev-p2a">Partie 2 · Situations professionnelles · calculatrice autorisée · justifie tes réponses</p>`
      + e.exos.map((x, i) => `<article class="evx2 c-${col}"><div class="ex-h"><span class="num2">${i + 1}</span><span class="ex-t">Exercice ${i + 1} · ${x.t}</span><span class="lcref">${pts(x.qs.reduce((a, b) => a + b.pts, 0))}</span></div>${x.intro ? `<div class="stmt">${x.intro}</div>` : ''}${x.qs.map(q => qHtml(q, k++)).join('')}</article>`).join('')
      + `<p class="evred2">✍️ <b>Rédaction · ${pts(e.redac)}</b> · phrases complètes, calculs posés, unités, résultats encadrés. Tu t’auto-évalues après avoir rendu ta copie.</p>`
      + `<div class="ex-act evact"><button class="btn" data-ev="rendre">📝 Rendre ma copie</button><button class="btn ghost" data-ev="again" hidden>🔄 Recommencer</button></div><section class="evres" id="ev-res" hidden></section>`;
  }
  const evalView = c => copie({ ...c.eval, titre: c.titre }, c.col, [c.id, 'ev'], '🎯 S’évaluer au format du CCF · CAP · noté sur 10', 45);
  const evQs = () => [...EV.e.auto, ...EV.e.exos.flatMap(x => x.qs)];
  function evScore() {
    const qs = evQs(), per = {}; let tot = 0, pending = 0;
    qs.forEach((q, k) => { per[q.comp] = per[q.comp] || [0, 0]; per[q.comp][1] += q.pts; const g = EV.got[k]; if (g == null) { pending++; return; } per[q.comp][0] += g; tot += g; });
    per.com = per.com || [0, 0]; per.com[1] += EV.e.redac; if (EV.got.redac == null) pending++; else { per.com[0] += EV.got.redac; tot += EV.got.redac; }
    const box = $('#ev-res'); box.hidden = false;
    box.innerHTML = `<h3>${pending ? 'Note provisoire' : 'Ma note'} : <b class="big3">${fr2(tot)} / ${fr2(EV.total)}</b></h3>${pending ? `<p class="small">Encore ${pending} réponse${pending > 1 ? 's' : ''} à auto-évaluer : compare avec la réponse attendue, puis clique sur ta note.</p>` : ''}<div class="evgrid">${ORD.filter(o => per[o]).map(o => { const [a, b] = per[o], r = b ? a / b : 0, lv = r >= .85 ? 'Très bonne maîtrise' : r >= .6 ? 'Maîtrise satisfaisante' : r >= .35 ? 'Maîtrise fragile' : 'Maîtrise insuffisante'; return `<div><span class="cp2 cp-${o}">${CPS[o]}</span><span class="evm"><i style="width:${Math.round(r * 100)}%"></i></span><b>${fr2(a)} / ${fr2(b)}</b><em>${lv}</em></div>`; }).join('')}</div><p class="small">Relis la phrase de chaque compétence : c’est ce que tu sais faire quand ta maîtrise est satisfaisante ou très bonne.</p>`;
    if (!pending) { const b = bestOf(EV.key); if (b == null || tot > b) setProg(EV.key[0], EV.key[1], { best: tot }); }
  }
  function evRendre() {
    if (EV.done) return; EV.done = true; clearInterval(EV.tm);
    evQs().forEach((q, k) => { const qa = $(`.evq2[data-k="${k}"]`), fb = $('.evfb', qa);
      if (q.choices) { const sel = $('.ch.sel', qa), ok = !!sel && +sel.dataset.k === q.ok; EV.got[k] = ok ? q.pts : 0; qa.classList.add(ok ? 'ok' : 'ko'); fb.innerHTML = ok ? `✅ +${pts(q.pts)}` : `❌ 0 pt · réponse attendue : <b>${q.a}</b>`; }
      else if (q.v != null) { const ok = M.check({ v: q.v, tol: q.tol }, $('.inp', qa).value); EV.got[k] = ok ? q.pts : 0; qa.classList.add(ok ? 'ok' : 'ko'); fb.innerHTML = ok ? `✅ +${pts(q.pts)}` : `❌ 0 pt · réponse attendue : <b>${q.a}</b>`; }
      else fb.innerHTML = `<p>💬 Réponse attendue : ${q.a}</p><p class="selfev">Je me note : <button class="btn sm" data-self="1" data-k="${k}">Réussi · ${pts(q.pts)}</button><button class="btn sm ghost" data-self=".5" data-k="${k}">En partie · ${pts(q.pts / 2)}</button><button class="btn sm ghost" data-self="0" data-k="${k}">Pas réussi · 0</button></p>`; });
    $('.evred2').insertAdjacentHTML('beforeend', `<span class="selfev"> Je me note : <button class="btn sm" data-self="1" data-k="redac">Clair et complet · ${pts(EV.e.redac)}</button><button class="btn sm ghost" data-self=".5" data-k="redac">En partie · ${pts(EV.e.redac / 2)}</button><button class="btn sm ghost" data-self="0" data-k="redac">À revoir · 0</button></span>`);
    $$('.evq2 .inp, .evq2 .ch').forEach(i => i.disabled = true); $('[data-ev="rendre"]').hidden = true; $('[data-ev="again"]').hidden = false; evScore(); $('#ev-res').scrollIntoView({ block: 'nearest' });
  }
  /* les trois CCF blancs */
  const CCF = DATA.ccf || [];
  const ccfP1 = CCF[0] ? CCF[0].auto.reduce((a, q) => a + q.pts, 0) : 3, ccfRed = CCF[0] ? CCF[0].redac : 1, ccfP2 = 10 - ccfP1 - ccfRed;
  const ccfList = () => `<section class="chead2 c-brand"><a class="back" href="#/">← Accueil</a><h1>🎓 Trois CCF blancs</h1><p>Au CAP, les mathématiques sont évaluées en contrôle en cours de formation (CCF), dans ton établissement. Chaque sujet blanc dure 45 minutes et vaut 10 points : partie 1 sur ${fr2(ccfP1)} points, sans calculatrice ; partie 2 sur ${fr2(ccfP2)} points, avec la calculatrice ; ${fr2(ccfRed)} point pour la rédaction.</p></section>`
    + `<div class="panel"><p><b>⏱️ 45 minutes</b> · <b>⚡ partie 1 : 10 min sans calculatrice</b> · <b>🧩 partie 2 : 35 min</b> · <b>✍️ ${fr2(ccfRed)} point de rédaction</b></p><p class="small">Dans la partie 2, les exercices sont indépendants : commence par celui que tu préfères, et laisse une trace de tes essais. Ces sujets sont des entraînements : ton professeur choisit le format réel de ton CCF.</p>${DATA.pdfccf ? `<p><a class="btn ghost" href="${DATA.pdfccf}" download>📄 Les trois sujets en PDF</a></p>` : ''}</div>`
    + `<div class="grid">${CCF.map(sj => { const b = bestOf(['ccf', sj.id]); return `<a class="card c-brand" href="#/ccf/${sj.id}"><span class="card-n">${sj.id}</span><span class="card-i">🎓</span><span class="card-t">${esc(sj.titre)}</span><span class="card-d">${sj.exos.map(x => esc(x.t)).join(' · ')}</span><span class="card-p">${b != null ? `★ ${fr2(b)}/10` : '45 minutes, sur 10'}</span></a>`; }).join('')}</div>`;
  const ccfView = id => { const sj = CCF.find(x => x.id === id); if (!sj) return ccfList();
    return `<p><a class="back" href="#/ccf">← Les CCF blancs</a></p>` + copie(sj, 'brand', ['ccf', sj.id], `🎓 CCF blanc ${sj.id} · CAP`, 45); };

  /* ---------- fiches de révision ---------- */
  const ficheCard = c => { const f = c.fiche; return `<article class="fcard c-${c.col}" id="fiche-${c.id}"><div class="fc-h"><span class="fc-n">${c.n}</span><div><p class="fc-k">📄 Fiche de révision${c.plus ? ` · ➕ ${esc(c.plus)}` : ''}</p><h2>${esc(c.titre)}</h2></div></div>
    <div class="fc-g"><div class="fc-b"><h3>📌 L’essentiel</h3><ul>${f.essentiel.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="fc-b"><h3>🧭 La méthode</h3><ol>${f.methode.map(x => `<li>${x}</li>`).join('')}</ol></div></div>
    <div class="fc-ex"><h3>✏️ Un exemple résolu</h3>${f.exemple}</div>
    <div class="fc-g"><div class="fc-b fc-att"><h3>⚠️ Les pièges</h3><ul>${f.pieges.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="fc-b"><h3>⚡ Je teste mes réflexes</h3><ol class="amoi">${f.flash.map(([q, a], k) => `<li><p>${q}</p><p class="qa-r"><input class="inp" autocomplete="off" aria-label="Ma réponse ${k + 1}" placeholder="ma réponse"><button class="btn sm ghost" data-amoi="${k}">Voir la réponse</button></p><p class="amoi-a" hidden>💬 ${a}</p></li>`).join('')}</ol></div></div>
    <p class="hbtns"><a class="btn ghost" href="#/${c.id}">← Retour au chapitre ${c.n}</a></p></article>`; };
  const fichesPage = id => { const c = byId[id];
    return `<section class="chead2 c-brand"><a class="back" href="#/">← Accueil</a><h1>📄 Fiches de révision</h1><p>Une fiche par chapitre : l’essentiel, la méthode, un exemple résolu, les pièges et quatre réflexes à tester.${DATA.pdffiches ? ` <a href="${DATA.pdffiches}" download>Les fiches en PDF, à imprimer</a>.` : ''}</p></section>`
      + `<nav class="fnav" aria-label="Choisir une fiche">${CH.map(x => `<a class="btn ${x.id === id ? '' : 'ghost'} sm" href="#/fiches/${x.id}">${x.n} · ${esc(x.titre)}</a>`).join('')}${id ? '<a class="btn ghost sm" href="#/fiches">Toutes</a>' : ''}</nav>`
      + (c ? ficheCard(c) : CH.map(ficheCard).join('')); };

  /* ---------- glossaire, données, à propos ---------- */
  const wordCard = (w, c) => `<article class="wcard c-${c.col}"><div class="w-ill">${w.pic}</div><h3>${w.mot}${w.abr ? ` <span class="sym">${w.abr}</span>` : ''}</h3><p>${w.def}</p>${w.formule ? `<p class="w-f">${w.formule}</p>` : ''}${w.sens ? `<p class="w-s">↔️ ${w.sens}</p>` : ''}<p class="w-p">« ${w.phrase} »</p></article>`;
  const glossaire = () => `<section class="chead2 c-brand"><a class="back" href="#/">← Accueil</a><h1>🔤 Glossaire visuel</h1><p>Les mots de chaque chapitre, avec un schéma, une définition et une phrase pour les réutiliser.</p></section>` + CH.map(c => `<h2 class="etape">${c.icone} Chapitre ${c.n} · ${esc(c.titre)}</h2><div class="words">${c.words.map(w => wordCard(w, c)).join('')}</div>`).join('');
  const donnees = () => `<section class="chead2 c-brand"><a class="back" href="#/">← Accueil</a><h1>💾 Mes données</h1><p>Ta progression reste sur cet appareil. Tu peux la sauvegarder dans un fichier, la recharger ailleurs ou l’effacer.</p></section>
    <div class="panel"><p><button class="btn" data-export>⬇️ Exporter ma progression</button></p><p><label class="btn ghost">⬆️ Importer un fichier<input type="file" accept="application/json" data-import hidden></label></p><p><button class="btn danger" data-clear>🗑️ Effacer ma progression</button></p><p class="small">Format : fichier JSON « maths-cap-progression ». Rien n’est envoyé sur Internet.</p></div>
    <div class="panel"><h3>Taille du texte</h3><p><button class="btn ghost" data-size="1">Normale</button> <button class="btn ghost" data-size="1.15">Grande</button> <button class="btn ghost" data-size="1.3">Très grande</button></p></div>`;
  const apropos = () => `<section class="chead2 c-brand"><a class="back" href="#/">← Accueil</a><h1>À propos</h1></section><div class="panel prose"><p><b>Maths · CAP</b> accompagne le manuel du même nom, pour les élèves de CAP, en première comme en deuxième année.</p><p>Il suit le programme de mathématiques des classes préparant au CAP (Bulletin officiel de l’éducation nationale, numéro spécial n° 5 du 11 avril 2019) : statistique et probabilités, proportionnalité, pourcentages, équations, fonctions, puis, selon le groupement, les calculs commerciaux et financiers (groupement 2) ou la géométrie (groupement 1). Ces domaines sont signalés par ➕. Les cinq compétences (s’approprier, analyser, réaliser, valider, communiquer) sont évaluées sur quatre degrés de maîtrise.</p><p>Chaque chapitre part d’une scène de pop culture : un document à lire (Départ), une leçon où chaque notion suit le même chemin (je découvre, la méthode, la solution, je retiens, à moi), un exercice résolu puis le même à compléter (Méthodes), des automatismes et des exercices à support visuel qui changent à chaque essai, avec une version guidée 🌱 et une version défi 🚀 de chaque exercice (S’entraîner), des problèmes avec le métier derrière la scène, et une évaluation au format du CCF notée sur 10. Une fiche de révision par chapitre et trois CCF blancs chronométrés complètent l’ensemble.</p><p><b>Données réelles</b>, sourcées dans chaque document : Wikipédia (épisodes des Simpson), CNC (entrées au cinéma en 2025), FDJ et La finance pour tous (Loto et EuroMillions), World Athletics et IAAF (100 m de Usain Bolt, Berlin 2009), Dig Minecraft (recette du bloc de fer). Quelques simulations de dés ont été faites pour ce manuel : elles sont reproductibles et signalées comme telles. Les personnages et les logos ne sont jamais dessinés : seuls les chiffres comptent. Les boutiques, les clubs, les prix et les enquêtes inventés pour les exercices sont signalés comme fictifs.</p><p><b>Auteur</b> : Tom Rougeaud, professeur de mathématiques-sciences, académie de Dijon. Contenu et application sous licence <b>CC BY-NC 4.0</b> : réutilisation libre, sans usage commercial, en citant l’auteur.</p><p class="small">Version ${DATA.version}.</p></div>`;
  const confid = () => `<section class="chead2 c-brand"><a class="back" href="#/">← Accueil</a><h1>Confidentialité</h1></section><div class="panel prose"><p><b>Aucune donnée personnelle n’est collectée.</b> Pas de compte, pas de cookie, pas de traceur, pas de publicité, pas de police ou de script chargé depuis un autre site.</p><p>Ta progression (notions vues, exercices réussis, problèmes terminés, meilleures notes aux évaluations et aux CCF blancs, taille du texte) est enregistrée uniquement dans la mémoire de ton navigateur (stockage local), sous des clés commençant par « mcvcap.v1. ». Elle ne quitte jamais ton appareil.</p><p>La lecture à voix haute utilise la voix installée sur ton appareil ; selon le système, elle peut fonctionner sans connexion.</p><p>Si tu installes l’appli sur ton écran d’accueil, ton navigateur garde sur ton appareil une copie des fichiers de ce site pour qu’elle s’ouvre aussi sans connexion. Ton choix « Plus tard » est mémorisé au même endroit que ta progression.</p><p>Tu peux à tout moment exporter ou effacer ces données depuis la page <a href="#/donnees">Mes données</a>. Effacer les données du site dans ton navigateur produit le même effet.</p></div>`;

  /* ---------- routeur ---------- */
  function render() {
    const h = location.hash.replace(/^#\/?/, ''), [path, query] = h.split('?'), parts = path.split('/').filter(Boolean);
    let html; if (EV && EV.tm) clearInterval(EV.tm); EV = null; DEP = null;
    if (!parts.length) html = home();
    else if (byId[parts[0]]) html = chapter(byId[parts[0]], parts[1]);
    else if (parts[0] === 'glossaire') html = glossaire();
    else if (parts[0] === 'de-college') html = pontPage();
    else if (parts[0] === 'fiches') html = fichesPage(parts[1]);
    else if (parts[0] === 'ccf') html = parts[1] ? ccfView(parts[1]) : ccfList();
    else if (parts[0] === 'donnees') html = donnees();
    else if (parts[0] === 'a-propos') html = apropos();
    else if (parts[0] === 'confidentialite') html = confid();
    else html = home();
    $('#main').innerHTML = html; if (canSpeak) speechSynthesis.cancel();
    $$('#main .ex2.tr').forEach(mountTr);
    $$('#main table').forEach(t => { if (!t.closest('.tscroll, .rs, .tk, .sh, .dep-doc, .sup')) { const w = document.createElement('div'); w.className = 'tscroll'; t.replaceWith(w); w.appendChild(t); } });
    const wg = $('#wg'); if (wg && window.MCVW && window.MCVW[parts[0]]) { try { window.MCVW[parts[0]](wg); } catch (err) { wg.innerHTML = '<p>Ce simulateur n’a pas pu démarrer sur cet appareil.</p>'; console.error(err); } }
    const ex = query && new URLSearchParams(query).get('ex'); if (ex && $('#ex-' + ex)) { $('#ex-' + ex).scrollIntoView({ block: 'start' }); $('#ex-' + ex).classList.add('flashy'); } else window.scrollTo(0, 0);
    document.title = (parts[0] && byId[parts[0]] ? byId[parts[0]].titre + ' · ' : '') + 'Maths · CAP';
  }

  /* ---------- événements ---------- */
  document.addEventListener('click', e => {
    const cell = e.target.closest('#dep-doc [data-cell]');
    if (cell && DEP) { // départ : on répond en touchant le document
      const qs = DEP.d.qs; let j = qs.findIndex((q, i) => !DEP.got[i] && q.kind === 'tap'); if (j < 0) j = qs.findIndex((q, i) => !DEP.got[i] && hasCells(DEP.d, q)); if (j < 0) return;
      const q = qs[j]; $$('#dep-doc [data-cell]').forEach(x => x.classList.remove('tapok', 'tapko'));
      if (q.kind === 'tap') { const ok = cell.dataset.cell === q.cell; cell.classList.add(ok ? 'tapok' : 'tapko'); depAnswer(j, ok, ok ? `${bravo()} (${q.a})` : '❌ Pas cette case : suis du doigt la ligne et la colonne de la question.'); }
      else { const k = +cell.dataset.cell, ok = k === q.ok; cell.classList.add(ok ? 'tapok' : 'tapko'); depAnswer(j, ok, ok ? `${bravo()} (${q.a})` : `❌ Ce n’est pas « ${q.choices[k]} ». Regarde encore le document.`); }
      return;
    }
    const t = e.target.closest('button, [data-say]'); if (!t) return;
    if (t.dataset.say) { const el = $(t.dataset.say); if (el) { const cl = el.cloneNode(true); cl.querySelectorAll('.kx').forEach(k => k.replaceWith(' ' + (k.dataset.t || '') + ' ')); cl.querySelectorAll('.say, .t3').forEach(b => b.remove()); speak(cl.textContent); } return; }
    if (t.hasAttribute('data-sais')) { const b = $('.saisbox'); b.hidden = !b.hidden; return; }
    // départ
    if (t.dataset.dk != null && DEP) { const li = t.closest('.dq'), j = +li.dataset.j, q = DEP.d.qs[j], ok = +t.dataset.dk === q.ok; $$('.ch', li).forEach(b => b.classList.toggle('sel', b === t)); depAnswer(j, ok, ok ? `${bravo()} ${q.a !== q.choices[q.ok] ? `(${q.a})` : ''}` : '❌ Pas encore : relis le document.'); return; }
    if (t.hasAttribute('data-dv') && DEP) { const li = t.closest('.dq'), j = +li.dataset.j, q = DEP.d.qs[j], n = (+li.dataset.n || 0) + 1; li.dataset.n = n; const v = TR.verdict({ v: q.v, tol: q.tol }, $('.inp', li).value); depAnswer(j, v.ok, v.ok ? `${bravo()}` : n >= 2 ? `❌ Réponse : <b>${q.a}</b>` : '❌ Pas encore : relis le document et réessaie.'); return; }
    if (t.hasAttribute('data-newdep')) { const c = byId[cur()]; const art = $('#dep'); const tmp = document.createElement('div'); tmp.innerHTML = departView(c); art.replaceWith($('#dep', tmp)); return; }
    // leçon
    if (t.dataset.temps) { showTemps(t.closest('.nt'), false); return; }
    if (t.dataset.tout) { showTemps(t.closest('.nt'), true); return; }
    if (t.hasAttribute('data-replay-vis')) { playVis(t.closest('.tp')); return; }
    if (t.dataset.amoi != null) { const li = t.closest('li'); $('.amoi-a', li).hidden = false; t.remove(); return; }
    // méthodes
    if (t.hasAttribute('data-next')) { const rs = t.closest('.rs'), hid = $$('.step[hidden]', rs); if (hid[0]) hid[0].hidden = false; if (hid.length <= 1) { $('.rs-ver', rs).hidden = false; $('.rs-rep', rs).hidden = false; t.disabled = true; } return; }
    if (t.hasAttribute('data-all')) { const rs = t.closest('.rs'); $$('.step', rs).forEach(s => s.hidden = false); $('.rs-ver', rs).hidden = false; $('.rs-rep', rs).hidden = false; $('[data-next]', rs).disabled = true; return; }
    if (t.hasAttribute('data-rs2')) { checkRs2(t.closest('.rs')); return; }
    // choix (QCM)
    if (t.classList.contains('ch') && t.dataset.k != null) { $$('.ch', t.parentNode).forEach(b => b.classList.remove('sel', 'good')); t.classList.add('sel'); if (EV && !EV.t0 && t.closest('.evq2')) startChrono(); return; }
    // s’entraîner
    const card = t.closest('.ex2.tr');
    if (card) { const c = byId[card.dataset.c], en = trAll(c).find(x => x.id === card.dataset.e);
      if (t.hasAttribute('data-check')) { checkTr(card); return; }
      if (t.hasAttribute('data-hint')) { hint(card, genOf(c, en).hints); return; }
      if (t.hasAttribute('data-sol')) { const g = genOf(c, en); $('.fbs', card).insertAdjacentHTML('beforeend', `<p class="sol">👁️ ${g.items.map(it => `${it.k}. ${it.a}`).join(' ; ')}</p>`); t.remove(); return; }
      if (t.hasAttribute('data-new')) { SEEDS[c.id + en.id] = rnd9(); const tmp = document.createElement('div'); tmp.innerHTML = trCard(c, en, trAll(c).indexOf(en)); const nc = tmp.firstElementChild; card.replaceWith(nc); mountTr(nc); return; } }
    // problèmes
    const pb = t.closest('.pb');
    if (pb) { const c = byId[pb.dataset.c], p = findP(c, pb.dataset.p);
      if (t.hasAttribute('data-qv')) { checkQ(pb, t.closest('.qa')); return; }
      if (t.hasAttribute('data-qs')) { const qa = t.closest('.qa'); $('.qa-fb', qa).innerHTML = `💬 Une réponse possible : ${p.qs[+qa.dataset.j].a}`; return; }
      if (t.hasAttribute('data-phint')) { hint(pb, p.hints); if (+pb.dataset.h >= p.hints.length) { t.disabled = true; t.textContent = '💡 Indices vus'; } else t.textContent = `💡 Indice ${+pb.dataset.h + 1}`; return; }
      if (t.hasAttribute('data-pouce')) { $('.pouce2', pb).hidden = false; return; }
      if (t.hasAttribute('data-corr')) { $('.corr2', pb).hidden = false; return; }
      if (t.hasAttribute('data-done')) { markDone(c, p, pb); return; } }
    // s’évaluer
    if (t.dataset.ev === 'rendre') { evRendre(); return; }
    if (t.dataset.ev === 'again') { render(); return; }
    if (t.hasAttribute('data-chrono') && EV) { const tm = $('#ev-timer'); tm.hidden = false; t.hidden = true; if (!EV.t0) startChrono(); return; }
    if (t.dataset.self != null && EV) { const kk = t.dataset.k; if (kk === 'redac') EV.got.redac = EV.e.redac * +t.dataset.self; else EV.got[+kk] = evQs()[+kk].pts * +t.dataset.self; $$(`[data-self][data-k="${kk}"]`).forEach(b => b.classList.toggle('ghost', b !== t)); evScore(); return; }
    // données
    if (t.hasAttribute('data-export')) { const blob = new Blob([JSON.stringify({ app: APP, version: VER, date: new Date().toISOString(), progression: prog(), preferences: prefs() }, null, 1)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'maths-cap-progression.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); return; }
    if (t.hasAttribute('data-clear')) { if (confirm('Effacer toute ta progression sur cet appareil ?')) { store.clear(); applyPrefs(); render(); } return; }
    if (t.dataset.size) { store.set('preferences', Object.assign(prefs(), { texte: +t.dataset.size })); applyPrefs(); return; }
  });
  /* chrono : compte à rebours (45 min ou 2 h) ; il démarre au clic sur le bouton ou à la première réponse */
  function startChrono() { if (!EV || EV.t0) return; EV.t0 = Date.now(); const T = EV.min * 60; const tick = () => { const el = $('#ev-timer'); if (!el || !EV) return; el.hidden = false; const left = Math.max(0, T - Math.floor((Date.now() - EV.t0) / 1000)), h = Math.floor(left / 3600), m = Math.floor(left % 3600 / 60); el.textContent = left ? `⏱️ ${h ? h + ' h ' : ''}${String(m).padStart(2, '0')}:${String(left % 60).padStart(2, '0')} restantes` : '⏱️ Temps écoulé : rends ta copie'; el.classList.toggle('late', left < 300); }; tick(); EV.tm = setInterval(tick, 1000); }
  document.addEventListener('input', e => { if (EV && !EV.t0 && e.target.closest('.evq2')) startChrono(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    if (e.target.matches('.ex2.tr .inp')) { e.preventDefault(); const all = $$('.inp', e.target.closest('.ex2')), i = all.indexOf(e.target); if (all[i + 1]) all[i + 1].focus(); else checkTr(e.target.closest('.ex2')); }
        else if (e.target.matches('.qa .inp:not(.txt)') && !e.target.closest('.evq2')) { e.preventDefault(); const b = $('[data-qv]', e.target.closest('.qa')); if (b) b.click(); }
    else if (e.target.matches('.dq .inp')) { e.preventDefault(); $('[data-dv]', e.target.closest('.dq')).click(); }
    else if (e.target.matches('.rsi')) { e.preventDefault(); const all = $$('.rsi', e.target.closest('.rs')), i = all.indexOf(e.target); if (all[i + 1]) all[i + 1].focus(); else checkRs2(e.target.closest('.rs')); }
  });
  document.addEventListener('change', e => { if (e.target.matches('[data-import]')) { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const d = JSON.parse(r.result); if (d.app !== APP) throw new Error('fichier d’une autre appli'); store.set('progression', d.progression || {}); if (d.preferences) store.set('preferences', d.preferences); applyPrefs(); alert('Progression importée.'); render(); } catch (err) { alert('Fichier non reconnu : ' + err.message); } }; r.readAsText(f); } });
  function applyPrefs() { document.documentElement.style.setProperty('--z', prefs().texte || 1); }
  window.addEventListener('hashchange', render);
  /* pour les tests automatiques : lecture seule des tirages en cours */
  window.MCVAPP = { seeds: SEEDS, dep: () => DEP && DEP.d };
  applyPrefs(); render();
})();
