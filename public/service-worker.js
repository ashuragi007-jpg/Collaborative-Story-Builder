const CACHE_NAME = "collab-story-builder-v3";

const FILES_TO_CACHE = [
  "/",
  "/manifest/manifest.json",
  "/controllers/storyBuilderApp.mjs",
  "/styles/indexStyle.css",
  "/img/book-transparent.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });

        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;

        if (request.mode === "navigate") {
            const fallbackPage = await caches.match("/");
            if (fallbackPage) {
                return fallbackPage;
            }
        }
        return new Response ("Offline content is not available.", {
            status: 503,
            statusText: "Service Unavailable",
            headers: {"Content-Type":"text/plain"}
        })
      })
  );
});

