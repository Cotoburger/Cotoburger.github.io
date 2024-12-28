const cacheName = 'Cache-v1'; // Название текущего кэша
const filesToCache = [
    'DebugInfo.txt',
    'arabic.html',
    'about.html',
    'index.html',
    'script.js',
    'script2.js',
    'images/icon.png',
    'snowflake.svg',
    'styles.css',
    'images/image-26.png',
    'aos.js',
    'aos.css',
    'images/sun.svg',
    'images/moon.svg',
];

// Событие установки Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('Caching files...');
                return cache.addAll(filesToCache);
            })
    );
});

// Событие активации Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [cacheName];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (!cacheWhitelist.includes(cache)) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache); // Удаляем старые кэши
                    }
                })
            );
        })
    );
});

// Событие запроса ресурсов (fetch)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse; // Возвращаем ресурс из кэша
                }

                // Если ресурса нет в кэше, запрашиваем его из сети
                return fetch(event.request).then((networkResponse) => {
                    // Кэшируем ответ на новый запрос, если нужно
                    if (event.request.url.startsWith(self.location.origin)) {
                        caches.open(cacheName).then((cache) => {
                            cache.put(event.request, networkResponse.clone());
                        });
                    }
                    return networkResponse;
                });
            })
    );
});