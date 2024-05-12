export function subscribeUser() {
    navigator.serviceWorker.ready.then(function(registration) {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BPCTljDDgqnfjRLNlghwE22T2XnJW8_Z79GsLJsqOgRwgljeEmzW7-E-IWjsDtf69H9FkD_Mo6vgt2Vxqti5FLA')
      };
  
      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function(pushSubscription) {
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
      return fetch('http://localhost:8000/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pushSubscription)
      });
    });
  }
  
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4); // Upewnij się, że długość stringa jest wielokrotnością 4
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    try {
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
  
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    } catch (e) {
      console.error("Failed to convert base64 string:", e);
      return null;
    }
  }
  