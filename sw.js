(function () {
    'use strict';

    const resources = [
        './',
        'index.html',
        'css/base.css',
        'css/desktop.css',
        'css/new.css',
        'css/palette.css',
        'img/placeholder.svg',
        'img/favicon/logo24.png',
        'img/favicon/logo48.png',
        'img/favicon/logo192.png',
        'img/demo/andrew-hughes-261571-unsplash.jpg',
        'img/demo/ever-wild-634729-unsplash.jpg',
        'img/demo/will-turner-1244879-unsplash.jpg',
        'js/chunk-0e059a95.js',
        'js/db-worker.js',
        'js/index.js',
        'lib/node-vibrant/vibrant.js',
        'lib/node-vibrant/worker.js',
        'lib/pwacompat.js',
        'lib/shimport.js',
    ];
    const CACHE = 'color-breakdown-05ff7ec3f8d555bf5fe1c5aa40737210b6a16bc6';
    // On install, cache some resources.
    self.addEventListener('install', event => {
        // Ask the service worker to keep installing until the returning promise
        // resolves.
        event.waitUntil(precache());
    });
    // On activate, clean up old caches
    self.addEventListener('activate', event => {
        event.waitUntil(clearOldCaches());
    });
    // On fetch, use cache but update the entry with the latest contents from the
    // server.
    self.addEventListener('fetch', event => {
        event.respondWith(fromCache(event.request));
    });
    /**
     * Open a cache and use addAll() with an array of assets to add all of them to
     * the cache. Return a promise resolving when all the assets are added.
     */
    async function precache() {
        const cache = await caches.open(CACHE);
        return cache.addAll(resources);
    }
    /**
     * Open the cache where the assets were stored and search for the requested
     * resource. Notice that in case of no matching, the promise still resolves
     * but it does with undefined as value.
     */
    async function fromCache(request) {
        const matching = await caches.match(request);
        if (matching) {
            return matching;
        }
        try {
            return await fetch(request);
        }
        catch (err) {
            if (new URL(request.url).hostname !== 'www.googletagmanager.com') {
                throw new TypeError('Failed to fetch Google Analytics');
            }
            throw new TypeError(`Failed to fetch: ${request.url}`);
        }
    }
    async function clearOldCaches() {
        const cacheNames = await caches.keys();
        return Promise.all(cacheNames
            .filter(name => name !== CACHE)
            .map(name => caches.delete(name)));
    }

}());
//# sourceMappingURL=sw.js.map
