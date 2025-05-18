// Install event - cache assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing");
  // self.skipWaiting(); // Activate immediately
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating");
  // self.clients.claim(); // Take control immediately
});

// Push event - handle incoming push notifications
self.addEventListener("push", (event) => {
  console.log("Push notification received");

  if (!event.data) {
    console.log("No payload in push notification");
    return;
  }

  try {
    // Parse the notification data
    const data = event.data.json();

    // Show the notification
    const options = {
      body: data.body || "New notification",
      icon: data.icon || "/icons/icon-192x192.png",
      badge: data.badge || "/icons/icon-192x192.png",
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: data.actions || [],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "Notification", options)
    );
  } catch (error) {
    console.error("Error showing notification:", error);
  }
});

let notificationClicked = false;

self.addEventListener("notificationclick", function (event) {
  if (notificationClicked) {
    return;
  }

  notificationClicked = true;

  const urlToOpen = new URL(
    event.notification.data?.url || "/",
    self.location.origin
  ).href;
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (new URL(client.url).href === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );

  // Reset the flag after some time (optional)
  setTimeout(() => (notificationClicked = false), 1000);
});
