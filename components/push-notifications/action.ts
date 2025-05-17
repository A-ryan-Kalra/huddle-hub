"use server";

import webpush, { PushSubscription } from "web-push";

// Configure web-push with your VAPID keys
webpush.setVapidDetails(
  "mailto:aryan.smart832@gmail.com", // Change this to your email
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
      subscription,
      JSON.stringify({
        title: "Hello",
        body: message,
        icon: "/icons/icon-512x512.png",
        badge: "/icons/icon-512x512.png",
        data: {
          url: "/",
          timestamp: new Date().toISOString(),
        },
      })
    );
    return { success: true };
  } catch (error: Error | any) {
    console.error("Error sending push notification:", error);
    if (error.statusCode === 410) {
      unsubscribeUser();
    }
    return { success: false, error: "Failed to send notification" };
  }
}
