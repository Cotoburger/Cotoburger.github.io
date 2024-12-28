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

// Установка Service Worker и добавление файлов в кэш
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
    self.skipWaiting(); // Пропускаем стадию ожидания
});

// Активация Service Worker и очистка старого кэша
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
    self.clients.claim(); // Активируем Service Worker немедленно
});

// Обработчик fetch с использованием стратегии Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.ok) {
                    caches.open(cacheName).then((cache) => {
                        cache.put(event.request, networkResponse.clone()); // Обновляем кэш
                    });

                    console.log(`Файл ${event.request.url} подгружен с интернета`);
                }
                return networkResponse; // Возвращаем сетевой ответ
            }).catch((err) => {
                console.error('Ошибка при запросе:', err);
                return cachedResponse; // Возвращаем кэш, если сеть недоступна
            });

            return cachedResponse || fetchPromise; // Возвращаем кэш сразу, сеть параллельно
        })
    );
});