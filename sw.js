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
          'icons/ic_add_white_24px.svg',
          'icons/ic_arrow_back_black_24px.svg',
          'icons/ic_arrow_back_white_24px.svg',
          'icons/ic_delete_black_24px.svg',
          'icons/ic_delete_white_24px.svg',
          'icons/ic_done_white_24px.svg',
          'icons/ic_file_upload_black_24px.svg',
          'icons/ic_github_circle_white_24px.svg',
          'icons/ic_info_outline_white_24px.svg',
          'icons/placeholder.svg',
          'node_modules/idb/lib/idb.js',
          'node_modules/node-vibrant/dist/vibrant.worker.js',
          'js/db-worker.js',
          'js/db.js',
          'js/dom.js',
          'js/events.js'
        ])
      )
  );
});

self.addEventListener('fetch', event =>
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(response))
  )
);
