self.addEventListener('push', function(event) {
    const payload = event.data ? event.data.text() : 'No payload';
    event.waitUntil(
      self.registration.showNotification('Financial Alert!', {
        body: payload,
        icon: 'icons/icon-192x192.png'
      })
    );
  });
  