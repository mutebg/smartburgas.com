// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  messagingSenderId: "736449147119"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
  const data = payload.data;

  // Customize notification here
  const notificationTitle = data.title;
  const notificationOptions = {
    body: data.body,
    icon: "/exclamation-circle.svg",
    silent: true,
    data: {
      click_action: data.type
    }
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", function(event) {
  const baseUrl = "https://smartburgas.com/";
  const url = baseUrl + "details/" + event.notification.data.click_action;

  event.notification.close();

  // Check if there's already a tab open with this URL.
  // If yes: focus on the tab.
  // If no: open a tab with the URL.
  event.waitUntil(
    Promise.all([
      clients
        .matchAll({
          type: "window"
        })
        .then(windowClients => {
          const client = windowClients.find(client => {
            return client.url === url && "focus" in client;
          });

          if (client) {
            client.focus();
          } else if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    ])
  );
});
