/* Service worker : garde en mémoire (sur l’appareil) les fichiers du site déjà ouverts, pour fonctionner sans connexion.
   Réseau d’abord (pour toujours avoir la dernière version), mémoire en secours. Aucune donnée n’est envoyée ailleurs. */
const CACHE = 'mcv-pwa-v1';
const BASE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).catch(() => { }).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)).catch(() => { }); } return res; })
    .catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
});
