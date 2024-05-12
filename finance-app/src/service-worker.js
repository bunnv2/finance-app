importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);


self.addEventListener('push', function (event) {
  const payload = event.data ? event.data.text() : 'No payload';
  event.waitUntil(
    self.registration.showNotification('Financial Alert!', {
      body: payload,
      icon: 'icons/icon-192x192.png'
    })
  );
});
