importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

self.addEventListener('push', function (event) {
  const payload = event.data ? event.data.text() : 'No payload';
  event.waitUntil(
    self.registration.showNotification('Financial Alert!', {
      body: payload,
      icon: '../public/bunn.png'
    })
  );
});


