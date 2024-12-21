const cacheName = 'txt-cache-v1';
const filesToCache = [
    'Arabic.txt',
    'DebugInfo.txt',
    "index.html",
    "script.js",
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', (event) => {
    // Удаление старых кэшей при активации нового сервис-воркера
    const cacheWhitelist = [cacheName];  // новый кэш
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (!cacheWhitelist.includes(cache)) {
                        return caches.delete(cache);  // удаление старых кэшей
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});