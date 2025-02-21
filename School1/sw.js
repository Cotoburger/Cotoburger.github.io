const cacheName = 'Cache';

const filesToCache = [
    'DebugInfo.txt',
    "arabic.html",
    "about.html",
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
    "scripts/usascript.js",
    "scripts/accelerometer.js",
    "images/16179f27f955d3d4ec88b294bcafd1b7.jpg",
    "gpt.html",
    "manifest.json"
];

self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install Event');
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache)
                .then(() => console.log('[ServiceWorker] Cached all files successfully'))
                .catch((error) => console.error('[ServiceWorker] Failed to cache files:', error));
        })
    );
    self.skipWaiting();
});

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
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const excludedUrls = ['https://api.mymemory.translated.net/', "https://api.github.com/repos/Cotoburger", "https://uselessfacts.jsph.pl/random.json?language=en"];

    if (excludedUrls.some(url => event.request.url.startsWith(url))) {
        console.log('[ServiceWorker] Excluding from cache:', event.request.url);
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log('[ServiceWorker] Serving from cache:', event.request.url);
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

function fetchAndUpdateCache(request) {
    return fetch(request).then((response) => {
        if (response && response.ok && response.type !== 'opaque') {
            const clonedResponse = response.clone();
            caches.open(cacheName).then((cache) => {
                cache.put(request, clonedResponse).then(() => {
                    console.log('[ServiceWorker] Updated cache for:', request.url);
                }).catch((error) => {
                    console.error('[ServiceWorker] Failed to cache the response:', error);
                });
            });
        }
        return response; // Return the response for further use
    }).catch((error) => {
        console.error('[ServiceWorker] Failed to fetch:', error);

        // Fallback to cache if fetch fails
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