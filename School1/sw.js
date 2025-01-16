const cacheName = 'Cache';
const filesToCache = [
    'DebugInfo.txt',
    "arabic.html",
    "about.html",
    "index.html",
    "script.js",
    "scriptmy.js",
    "script2.js",
    "images/icon.png",
    "snowflake.svg",
    "styles.css",
    "images/image-26.png",
    "aos.js",
    "aos.css",
    "images/sun.svg",
    "images/moon.svg",
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((oldCacheName) => {
                    if (oldCacheName !== cacheName) {
                        return caches.delete(oldCacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).then((networkResponse) => {
            // Проверяем, что запрос успешен
            if (networkResponse && networkResponse.ok) {
                const clonedResponse = networkResponse.clone();
                caches.open(cacheName).then((cache) => {
                    cache.put(event.request, clonedResponse);  // Обновляем кэш
                });
            }
            return networkResponse;
        }).catch(() => {
            // Если сеть недоступна, возвращаем кэшированные данные
            return caches.match(event.request);
        })
    );
});