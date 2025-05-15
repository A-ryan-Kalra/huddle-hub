"use server";

import webpush from "web-push";

// Configure web-push with your VAPID keys
webpush.setVapidDetails(
  "mailto:your-email@example.com", // Change this to your email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// In a real application, you would store subscriptions in a database
// This is just for demonstration purposes
let subscription: PushSubscription | null = null;

export async function subscribeUser(sub: PushSubscription) {
  subscription = sub;
  // In a production environment, you would store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true };
}

export async function unsubscribeUser() {
  subscription = null;
  // In a production environment, you would remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true };
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error("Invalid subscription object");
  }

  try {
    await webpush.sendNotification(
      subscription as any,
      JSON.stringify({
        title: "Push Notification",
        body: message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        data: {
          url: "/",
          timestamp: new Date().toISOString(),
        },
      })
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
