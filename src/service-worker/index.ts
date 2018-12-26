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
    'js/chunk-39ed6d25.js',
    'js/db-worker.js',
    'js/index.js',
    'lib/node-vibrant/vibrant.js',
    'lib/node-vibrant/worker.js',
    'lib/pwacompat.js',
    'lib/shimport.js',
];

const CACHE = 'color-breakdown';

export declare var self: ServiceWorkerGlobalScope;

// On install, cache some resources.
self.addEventListener('install', event => {
    // Ask the service worker to keep installing until the returning promise
    // resolves.
    event.waitUntil(precache());
});

// On fetch, use cache but update the entry with the latest contents from the
// server.
self.addEventListener('fetch', event => {
    event.respondWith(fromCache(event.request));

    event.waitUntil(update(event.request));
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
async function fromCache(request: Request | string) {
    const cache = await caches.open(CACHE);
    const matching = await cache.match(request);
    return matching || Promise.reject('no-match');
}

/**
 * Update consists in opening the cache, performing a network request and
 * storing the new response data.
 */
async function update(request: Request | string) {
    const cache = await caches.open(CACHE);
    const response = await fetch(request);
    await cache.put(request, response);
}
