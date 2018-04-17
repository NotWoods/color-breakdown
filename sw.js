const resources = [
  './',
  'index.html',
  'css/base.css',
  'css/desktop.css',
  'css/new.css',
  'css/palette.css',
  'img/placeholder.svg',
  'node_modules/idb/lib/idb.js',
  'node_modules/node-vibrant/dist/vibrant.worker.js',
  'js/db-worker/index.js',
  'js/page/canvas.js',
  'js/page/db.js',
  'js/page/dom.js',
  'js/page/events.js',
];

const CACHE = 'vibrant-gui';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(resources)));
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(response))
  );

  event.waitUntil(
    caches
      .open(CACHE)
      .then(cache =>
        fetch(event.request).then(response =>
          cache.put(event.request, response)
        )
      )
  );
});
