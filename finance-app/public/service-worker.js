/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

// Set up Workbox precaching
if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

/* eslint-disable no-restricted-globals */
self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/logo192.png'
  });
});
