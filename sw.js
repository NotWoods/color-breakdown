self.addEventListener('install', e => {
  e.waitUntil(
    caches
      .open('vibrant-gui')
      .then(cache =>
        cache.addAll([
          './',
          'index.html',
          'css/base.css',
          'css/desktop.css',
          'css/new.css',
          'css/palette.css',
          'icons/placeholder.svg',
          'node_modules/idb/lib/idb.js',
          'node_modules/node-vibrant/dist/vibrant.worker.js',
          'js/db-worker.js',
          'js/page/canvas.js',
          'js/page/db.js',
          'js/page/dom.js',
          'js/page/events.js',
        ])
      )
  );
});

self.addEventListener('fetch', event =>
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(response))
  )
);
