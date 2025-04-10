const cacheName = 'Cache';
const GITHUB_API_URL = 'https://api.github.com/repos/Cotoburger/Cotoburger.github.io/commits?per_page=1';
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

self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install Event');
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll(filesToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate Event');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(oldCacheName => {
                    if (oldCacheName !== cacheName) {
                        console.log('[ServiceWorker] Deleting old cache:', oldCacheName);
                        return caches.delete(oldCacheName);
                    }
                })
            );
        }).then(() => {
            return checkForUpdates();
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const excludedUrls = [
        'https://api.mymemory.translated.net/',
        "https://api.github.com/repos/Cotoburger",
        "https://uselessfacts.jsph.pl/random.json?language=en"
    ];

    if (excludedUrls.some(url => event.request.url.startsWith(url))) {
        return event.respondWith(fetch(event.request));
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetchAndUpdateCache(event.request);
            
            if (cachedResponse) {
                event.waitUntil(fetchPromise);
                return cachedResponse;
            }
            return fetchPromise;
        })
    );
});

async function checkForUpdates() {
    try {
        const response = await fetch(GITHUB_API_URL);
        
        if (response.status === 403) {
            console.log('[ServiceWorker] GitHub API rate limit exceeded');
            return;
        }
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const commits = await response.json();
        const latestHash = commits[0].sha;
        const cache = await caches.open(cacheName);
        const cachedHash = await (await cache.match('lastCommitHash'))?.text() || null;

        if (latestHash !== cachedHash) {
            console.log('[ServiceWorker] New version detected');
            await updateCache(latestHash, cache);
            notifyClientsToReload();
        }
    } catch (error) {
        console.log('[ServiceWorker] Update check failed:', error.message);
    }
}

async function updateCache(newHash, cache) {
    try {
        const requests = filesToCache.map(file => new Request(file, { cache: 'no-cache' }));
        const responses = await Promise.all(requests.map(req => fetch(req)));
        
        await Promise.all(requests.map((req, i) => 
            responses[i].ok ? cache.put(req.url, responses[i]) : Promise.reject()
        ));
        
        await cache.put('lastCommitHash', new Response(newHash));
        console.log('[ServiceWorker] Cache updated successfully');
    } catch (error) {
        console.error('[ServiceWorker] Cache update failed:', error);
        throw error;
    }
}

function notifyClientsToReload() {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'RELOAD' }));
    });
}

async function fetchAndUpdateCache(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('Offline', { 
            status: 503, 
            headers: { 'Content-Type': 'text/plain' } 
        });
    }
}