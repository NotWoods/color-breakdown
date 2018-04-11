self.addEventListener('install', e => {
	e.waitUntil(
		caches
			.open('vibrant-gui')
			.then(cache =>
				cache.addAll([
					'./',
					'index.html',
					'css/base.css',
					'css/new.css',
					'css/palette.css',
					'icons/ic_add_white_24px.svg',
					'icons/ic_github_circle_white_24px.svg',
					'icons/ic_info_outline_white_24px.svg',
					'icons/placeholder.svg',
					'js/dom.js',
					'js/events.js',
					'js/vibrant.worker.min.js'
				])
			)
	);
});

self.addEventListener('fetch', event =>
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(response))
  )
);
