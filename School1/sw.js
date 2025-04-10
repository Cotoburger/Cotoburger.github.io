const cacheName = 'Cache';
const versionKey = 'version';

// Список файлов для кэширования
const filesToCache = [
    "arabic.html",
    "index.html",
    "scripts/script.js",
    "scripts/script2.js",
    "images/icon.svg",
    "snowflake.svg",
    "styles.css",
    "images/image-26.png",
    "images/sun.svg",
    "images/moon.svg",
    "images/next.svg",
    "images/nextwhite.svg",
    "scripts/accelerometer.js",
    "images/16179f27f955d3d4ec88b294bcafd1b7.jpg",
    "manifest.json"
];

// Установка service worker и предзагрузка кэша
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install Event');
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache)
                .then(() => {
                    console.log('[ServiceWorker] Cached all files successfully');
                    // Инициализируем версию в кэше (начальное значение)
                    return cache.put(versionKey, new Response('0'));
                })
                .catch((error) => console.error('[ServiceWorker] Failed to cache files:', error));
        })
    );
    self.skipWaiting();
});

// Активация service worker, очистка старого кэша и запуск проверки обновлений
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate Event');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((oldCacheName) => {
                    if (oldCacheName !== cacheName) {
                        console.log('[ServiceWorker] Deleting old cache:', oldCacheName);
                        return caches.delete(oldCacheName);
                    }
                })
            );
        }).then(() => {
            // Проверяем обновления после активации
            checkForUpdates();
            return self.clients.claim();
        })
    );
});

// Обработка запросов fetch с исключениями для некоторых URL
self.addEventListener('fetch', (event) => {
    const excludedUrls = [
        'https://api.mymemory.translated.net/',
        "https://api.github.com/repos/Cotoburger",
        "https://uselessfacts.jsph.pl/random.json?language=en"
    ];

    if (excludedUrls.some(url => event.request.url.startsWith(url))) {
        console.log('[ServiceWorker] Excluding from cache:', event.request.url);
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log('[ServiceWorker] Serving from cache:', event.request.url);
                // Асинхронно обновляем кэш
                event.waitUntil(fetchAndUpdateCache(event.request));
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.ok && event.request.method !== 'HEAD') {
                    const clonedResponse = networkResponse.clone();
                    caches.open(cacheName).then((cache) => {
                        cache.put(event.request, clonedResponse);
                        console.log('[ServiceWorker] Cached new response for:', event.request.url);
                    });
                }
                return networkResponse;
            }).catch((error) => {
                console.error('[ServiceWorker] Fetch failed:', error);
                return caches.match(event.request).then((cachedResponse) => {
                    return cachedResponse || new Response("Offline", { status: 503 });
                });
            });
        })
    );
});

// Функция обновления кэша для отдельного запроса
function fetchAndUpdateCache(request) {
    return fetch(request).then((response) => {
        if (response && response.ok && response.type !== 'opaque') {
            const clonedResponse = response.clone();
            caches.open(cacheName).then((cache) => {
                cache.put(request, clonedResponse)
                    .then(() => console.log('[ServiceWorker] Updated cache for:', request.url))
                    .catch((error) => console.error('[ServiceWorker] Failed to cache the response:', error));
            });
        }
        return response;
    }).catch((error) => {
        console.error('[ServiceWorker] Failed to fetch:', error);
        return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log('[ServiceWorker] Serving from cache:', request.url);
                return cachedResponse;
            } else {
                throw new Error(`[ServiceWorker] No cache available for: ${request.url}`);
            }
        });
    });
}

// Функция проверки обновлений через GitHub API
function checkForUpdates() {
    console.log('[ServiceWorker] Checking for updates...');
    fetch('https://api.github.com/repos/Cotoburger/Cotoburger.github.io')
        .then(response => response.json())
        .then(data => {
            // Используем поле pushed_at в качестве "хэша"
            const remoteVersion = data.pushed_at;
            if (!remoteVersion) {
                console.warn('[ServiceWorker] No pushed_at value in API response');
                return;
            }
            caches.open(cacheName).then((cache) => {
                cache.match(versionKey).then((cachedResponse) => {
                    if (cachedResponse) {
                        cachedResponse.text().then((cachedVersion) => {
                            // Выводим в консоль хэш с GitHub и хэш из кэша рядом
                            console.log(`[ServiceWorker] GitHub hash: ${remoteVersion} | Cache hash: ${cachedVersion}`);
                            // Если хэши различаются, выполняем обновление кэша и перезагрузку клиентов
                            if (cachedVersion !== remoteVersion) {
                                console.log('[ServiceWorker] New version detected. Updating cache...');
                                updateCache(remoteVersion);
                            }
                        });
                    } else {
                        // Если версия не сохранена, записываем новую
                        cache.put(versionKey, new Response(remoteVersion));
                    }
                });
            });
        })
        .catch((error) => {
            console.error('[ServiceWorker] Update check failed, using old cache. Error:', error);
        });
}

// Функция обновления кэша и перезагрузки клиентов
function updateCache(newVersion) {
    caches.delete(cacheName)
        .then(() => {
            caches.open(cacheName).then((cache) => {
                cache.addAll(filesToCache)
                    .then(() => {
                        // Сохраняем новую "версию" в кэше
                        cache.put(versionKey, new Response(newVersion));
                        console.log('[ServiceWorker] Cache updated with new version:', newVersion);
                        // Перезагружаем все окна клиентов
                        self.clients.matchAll({ type: 'window' }).then(clients => {
                            clients.forEach(client => {
                                client.navigate(client.url);
                            });
                        });
                    })
                    .catch((error) => console.error('[ServiceWorker] Failed to update cache:', error));
            });
        })
        .catch((error) => console.error('[ServiceWorker] Failed to delete old cache:', error));
}
