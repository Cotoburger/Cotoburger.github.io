const cacheName = 'txt-cache-v1';
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
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return Promise.all(
                filesToCache.map((url) => {
                    return fetch(url).then((response) => {
                        if (!response.ok) {
                            throw new Error(`Ошибка загрузки: ${url}`);
                        }
                        return cache.put(url, response);
                    }).catch((err) => {
                        console.error(err); // Здесь выводится какая ошибка и для какого файла
                    });
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Если файл в кэше, возвращаем его
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                if (networkResponse && event.request.url.includes('snowflake.svg')) {
                    caches.open(cacheName).then((cache) => {
                        cache.put(event.request, networkResponse.clone()); // Клонируем ответ
                    });
                }
                return networkResponse.clone(); // Клонируем для возврата
            });

            // Если файл есть в кэше, возвращаем его, иначе загружаем с сети
            return cachedResponse || fetchPromise;
        })
    );
});

// Обработка запросов и обновление кэша при необходимости
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Если файл в кэше, возвращаем его
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                if (networkResponse && event.request.url.indexOf('snowflake.svg') !== -1) {
                    caches.open(cacheName).then((cache) => {
                        cache.put(event.request, networkResponse.clone());  // Обновляем кэш
                    });
                }
                return networkResponse;
            });

            // Если файл есть в кэше, возвращаем его, иначе загружаем с сети
            return cachedResponse || fetchPromise;
        })
    );
});