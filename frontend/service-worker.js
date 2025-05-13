const CACHE_NAME = 'race-control-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/index.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

self.addEventListener('install', installServiceWorker);
self.addEventListener('fetch', fetchResources);
self.addEventListener('activate', updateServiceWorker);

function installServiceWorker(event){
    // event.waitUntil(
    //     caches.open(CACHE_NAME).then((cache) => {
    //         console.log('Cache opened');
    //         return cache.addAll(urlsToCache);
    //     })
    // );
    event.waitUntil((async  () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(urlsToCache);
    })())
}

function fetchResources(event) {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    )
}

function updateServiceWorker(event){
    const cacheWhiteList = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhiteList.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
}