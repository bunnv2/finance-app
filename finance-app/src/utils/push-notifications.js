
// push-notifications.js

// This function converts a URL-safe base64 string to a Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Function to unsubscribe the user
export function unsubscribeUser() {
  navigator.serviceWorker.ready.then(function(registration) {
      registration.pushManager.getSubscription().then(function(subscription) {
          if (subscription) {
              subscription.unsubscribe().then(function(successful) {
                  console.log('Unsubscription successful: ', successful);
              }).catch(function(error) {
                  console.log('Unsubscription failed: ', error);
              });
          } else {
              console.log('No subscription to unsubscribe.');
          }
      });
  });
}

// Function to subscribe the user
export function subscribeUser() {
  const applicationServerKey = urlBase64ToUint8Array('BPCTljDDgqnfjRLNlghwE22T2XnJW8_Z79GsLJsqOgRwgljeEmzW7-E-IWjsDtf69H9FkD_Mo6vgt2Vxqti5FLA');
  navigator.serviceWorker.ready.then(function(registration) {
      const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
      };
      return registration.pushManager.subscribe(subscribeOptions);
  })
  .then(function(pushSubscription) {
      fetch('http://localhost:8000/subscribe', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(pushSubscription)
      });
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
      // Additional code to send subscription to your backend
  })
  .catch(function(error) {
      console.error('Failed to subscribe the user: ', error);
  });
}
