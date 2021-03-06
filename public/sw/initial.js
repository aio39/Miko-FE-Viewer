/* eslint-disable prettier/prettier */
const cacheName = '::myServiceWorker';
const version = 'v0.0.1';
const cacheList = [];

self.addEventListener('install', function (event) {
  console.log('Hello world from the Service Worker π€');
});

// λ€νΈμν¬ fetch μ
self.addEventListener('fetch', e => {
  // μλ΅μ μμ νλ€
  e.respondWith(
    // μμ²­μ λν μλ΅μ μΊμ±ν μ μ΄ μλμ§ νμΈνλ€
    caches.match(e.request).then(r => {
      // μΊμ±λ λ°μ΄ν°κ° μμΌλ©΄ κ·Έκ²μ λ°ννλ€
      if (r) {
        return r;
      }

      const fetchRequest = e.request.clone();

      // μΊμ±λ λ°μ΄ν°κ° μμΌλ©΄ μλμ μμ²­μ λ³΄λΈλ€
      return fetch(fetchRequest).then(response => {
        if (!response) {
          return response;
        }

        const requestUrl = e.request.url || '';

        const responseToCache = response.clone();
        // POST μμ²­μ λν μλ΅μ΄λ chrome extensionμ λν μλ΅μ μΊμ± λΆκ°λ₯νλ€.
        if (!requestUrl.startsWith('chrome-extension') && e.request.method !== 'POST')
          // μΊμ± κ°λ₯ν μλ΅μ΄λ©΄ μΊμμ μμ²­μ λν μλ΅μ μ μ₯νλ€.
          caches.open(version + cacheName).then(cache => {
            cache.put(e.request, responseToCache);
          });

        // μμ²­μ λ°ννλ€.
        return response;
      });
    }),
  );
});
