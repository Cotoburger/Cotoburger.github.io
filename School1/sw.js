const cacheName = 'Cache';
const filesToCache = [
    'Arabic.txt',
    'DebugInfo.txt',
    "arabic.html",
    "about.html",
    "index.html",
    "script.js",
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
            return cache.addAll(filesToCache); // Сразу кэшируем всё
        })
    );
    self.skipWaiting(); // Немедленно активируем новый Service Worker
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((oldCacheName) => {
                    if (oldCacheName !== cacheName) {
                        return caches.delete(oldCacheName); // Удаляем старый кэш
                    }
                })
            );
        })
    );
    self.clients.claim(); // Активируем обновления сразу
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Проверяем, что ответ успешен
                if (networkResponse && networkResponse.ok) {
                    const clonedResponse = networkResponse.clone(); // Клонируем ответ до использования
                    caches.open(cacheName).then((cache) => {
                        cache.put(event.request, clonedResponse); // Кэшируем клон
                    });
                }
                return networkResponse; // Возвращаем оригинальный ответ
            }).catch((err) => {
                console.error('Ошибка при запросе:', err); // Логируем ошибки сети
            });

            // Если файл есть в кэше, возвращаем его, иначе загружаем с сети
            return cachedResponse || fetchPromise;
        })
    );
});