/* Installation sur l’écran d’accueil (PWA) : bandeau discret, bouton « Installer l’appli » en pied de page, consignes pour iPhone/iPad.
   Aucune ressource extérieure ; seul le stockage local de l’appareil garde « plus tard » (catégorie technique, aucune donnée personnelle).
   Configuration lue dans window.MCVPWA = { name, short, key, color, ink, sw } */
(function () {
  'use strict';
  const C = window.MCVPWA || {}; if (!C.name) return;
  const KEY = (C.key || 'mcv') + '.pwa', DAYS = 14;
  const store = { get() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }, set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } } };
  const standalone = () => { try { return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; } catch (e) { return false; } };
  const ua = navigator.userAgent || '';
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  let deferred = null, bar = null, panel = null;

  /* hors connexion : le service worker garde en mémoire les fichiers déjà ouverts */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => { try { navigator.serviceWorker.register(C.sw || 'sw.js').catch(() => { }); } catch (e) { } });
  }

  const css = `.pwa-bar{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:90;max-width:560px;margin:0 auto;background:#1D2240;color:#fff;border-radius:16px;padding:12px 14px;display:flex;gap:12px;align-items:center;box-shadow:0 2px 0 #11142a,0 8px 24px rgba(29,34,64,.35);font:600 14px/1.35 'Nunito Sans',system-ui,sans-serif}
.pwa-bar i{font-style:normal;font-size:26px;flex:none}.pwa-bar p{margin:0;flex:1}.pwa-bar small{display:block;font-weight:500;opacity:.88;font-size:12.5px}
.pwa-bar button,.pwa-panel button{font:700 14px/1 'Nunito Sans',system-ui,sans-serif;border:0;border-radius:12px;padding:11px 14px;cursor:pointer;min-height:44px}
.pwa-go{background:${C.color || '#E9F797'};color:${C.ink || '#1D2240'}}.pwa-no{background:transparent;color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.55)}
.pwa-bar button:focus-visible,.pwa-panel button:focus-visible,.pwa-link:focus-visible{outline:3px solid ${C.color || '#E9F797'};outline-offset:2px}
.pwa-panel{position:fixed;inset:0;z-index:95;background:rgba(17,20,42,.62);display:flex;align-items:flex-end;justify-content:center;padding:12px}
.pwa-card{background:#fff;color:#1D2240;border-radius:20px;max-width:520px;width:100%;padding:18px 18px 16px;max-height:88vh;overflow:auto;font:500 15px/1.5 'Nunito Sans',system-ui,sans-serif}
.pwa-card h2{margin:0 0 8px;font-size:19px}.pwa-card ol{margin:8px 0 12px;padding-left:22px}.pwa-card li{margin:6px 0}.pwa-card .row{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:12px}
.pwa-panel .pwa-go{box-shadow:inset 0 0 0 2px #1D2240}.pwa-panel .pwa-no{color:#1D2240;box-shadow:inset 0 0 0 1.5px #1D2240}
.pwa-link{background:none;border:0;padding:0;margin:0;font:inherit;color:inherit;text-decoration:underline;cursor:pointer}
@media print{.pwa-bar,.pwa-panel,.pwa-link,.pwa-li{display:none!important}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const how = () => {
    if (iOS) return `<ol><li>Ouvre cette page dans <b>Safari</b>.</li><li>Touche le bouton <b>Partager</b> (le carré avec une flèche vers le haut ⬆︎).</li><li>Fais défiler et touche <b>« Sur l’écran d’accueil »</b>, puis <b>Ajouter</b>.</li></ol>`;
    if (android) return `<ol><li>Touche le menu <b>⋮</b> de Chrome (en haut à droite).</li><li>Touche <b>« Installer l’application »</b> ou <b>« Ajouter à l’écran d’accueil »</b>.</li><li>Confirme avec <b>Installer</b>.</li></ol>`;
    return `<ol><li>Avec <b>Chrome</b> ou <b>Edge</b> : clique sur l’icône d’installation ⊕ à droite de la barre d’adresse, puis sur <b>Installer</b>.</li><li>Avec <b>Safari</b> (Mac) : menu <b>Fichier ▸ Ajouter au Dock</b>.</li><li>Avec <b>Firefox</b> : l’installation n’est pas proposée sur ordinateur ; ajoute la page aux favoris.</li></ol>`;
  };
  const closePanel = () => { if (panel) { panel.remove(); panel = null; if (window.__pwaFocus) { try { window.__pwaFocus.focus(); } catch (e) { } } } };
  const showPanel = () => {
    if (standalone()) return; closePanel(); window.__pwaFocus = document.activeElement;
    panel = document.createElement('div'); panel.className = 'pwa-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-labelledby', 'pwa-t');
    panel.innerHTML = `<div class="pwa-card"><h2 id="pwa-t">📲 Installer ${C.short || C.name} sur l’écran d’accueil</h2><p>L’appli s’ouvre comme une application, en plein écran, et marche aussi sans connexion pour les pages déjà ouvertes. Elle ne demande aucun compte.</p>${deferred ? '' : how()}<div class="row">${deferred ? '<button class="pwa-go" data-a="go">Installer</button>' : ''}<button class="pwa-no" data-a="close">Fermer</button></div></div>`;
    panel.addEventListener('click', e => { const a = e.target.closest('button'); if (e.target === panel || (a && a.dataset.a === 'close')) closePanel(); else if (a && a.dataset.a === 'go') install(); });
    panel.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
    document.body.appendChild(panel); const b = panel.querySelector('button'); if (b) b.focus();
  };
  const install = async () => {
    if (!deferred) { showPanel(); return; }
    const d = deferred; deferred = null; closePanel(); hideBar();
    try { d.prompt(); const r = await d.userChoice; if (r && r.outcome !== 'accepted') store.set({ t: Date.now() }); } catch (e) { }
  };
  const hideBar = () => { if (bar) { bar.remove(); bar = null; } };
  const later = () => { store.set({ t: Date.now() }); hideBar(); };
  const recent = () => { const v = store.get(); return !!(v && v.t && Date.now() - v.t < DAYS * 864e5); };
  const showBar = () => {
    if (bar || standalone() || recent() || (!deferred && !iOS)) return;
    bar = document.createElement('aside'); bar.className = 'pwa-bar'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Installer l’appli');
    bar.innerHTML = `<i aria-hidden="true">📲</i><p>Installe ${C.short || C.name} sur ton écran d’accueil<small>${iOS ? 'Touche Partager ⬆︎ puis « Sur l’écran d’accueil ».' : 'Elle s’ouvre en plein écran, même sans connexion.'}</small></p>${iOS ? '<button class="pwa-go" data-a="how">Comment ?</button>' : '<button class="pwa-go" data-a="go">Installer</button>'}<button class="pwa-no" data-a="no" aria-label="Plus tard">Plus tard</button>`;
    bar.addEventListener('click', e => { const a = e.target.closest('button'); if (!a) return; if (a.dataset.a === 'go') install(); else if (a.dataset.a === 'how') showPanel(); else later(); });
    document.body.appendChild(bar);
  };

  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; setTimeout(showBar, 3500); });
  window.addEventListener('appinstalled', () => { deferred = null; hideBar(); closePanel(); store.set({ t: Date.now() + 365 * 864e5 }); });
  if (iOS) setTimeout(showBar, 6000);

  /* lien permanent en pied de page */
  const addLink = () => {
    if (standalone()) return; const f = document.querySelector('footer'); if (!f || f.querySelector('.pwa-li')) return;
    const s = document.createElement('span'); s.className = 'pwa-li'; s.innerHTML = ' · <button type="button" class="pwa-link">📲 Installer l’appli</button>';
    s.querySelector('button').addEventListener('click', () => { if (deferred) install(); else showPanel(); }); f.appendChild(s);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addLink); else addLink();
})();
