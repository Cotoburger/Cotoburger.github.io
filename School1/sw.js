const cacheName = 'txt-cache-v1';
const filesToCache = [
    'Arabic.txt',
    'DebugInfo.txt',
    "index.html",
    "script.js",
    "script2.js",
    "images/icon.png",
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
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Обновление кэша с новой версией
                if (networkResponse && event.request.url.includes('script.js')) {
                    caches.open(cacheName).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                    });
                }
                return networkResponse;
            });

            // Вернуть либо кэш, либо новый ресурс
            return cachedResponse || fetchPromise;
        })
    );
});