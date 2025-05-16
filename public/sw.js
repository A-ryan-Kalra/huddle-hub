// Service Worker for Push Notifications

// Cache name for offline support
const CACHE_NAME = "push-notification-cache-v1";

// Install event - cache assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing");
  self.skipWaiting(); // Activate immediately
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
      icon: data.icon || "/icon.png",
      badge: data.badge || "/badge.png",
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: data.actions || [],
      tag: data.tag || "default",
      renotify: data.renotify || false,
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false,
    };

    // event.waitUntil(
    self.registration.showNotification(data.title || "Notification", options);
    // );
  } catch (error) {
    console.error("Error showing notification:", error);
  }
});

// Notification click event - handle user interaction with the notification
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked");

  event.notification.close();

  // Get the URL to open from the notification data or use default
  const urlToOpen = event.notification.data?.url || "/";

  // Open the URL in the existing window/tab if possible
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }

        // If no window/tab is open with the URL, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  console.log(event);

  if (
    request.method === "POST" &&
    request.url.includes("/api/socket/messages")
  ) {
    event.respondWith(
      (async () => {
        try {
          console.log("request.clone()=", request.clone());
          const response = request.clone();
          const reqBody = await response.json();
          reqBody.content = "<p>Intercepter</p>";
          reqBody.intercepter = true;
          console.log("reqBody=", reqBody);

          const modifyRequest = new Request(request.url, {
            method: request.method,
            headers: request.headers,
            body: JSON.stringify(reqBody),
            mode: request.mode,
            credentials: request.credentials,
            redirect: request.redirect,
            referrer: request.referrer,
            referrerPolicy: request.referrerPolicy,
          });

          console.log("modifyRequest", modifyRequest);
          return await fetch(modifyRequest);
        } catch (err) {
          console.error("[SW] Fetch failed:", err);
          return new Response(
            JSON.stringify({ error: "Service unavailable" }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      })()
    );
  }
});
