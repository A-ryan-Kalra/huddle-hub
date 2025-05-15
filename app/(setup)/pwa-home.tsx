"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { subscribeUser, unsubscribeUser, sendNotification } from "../action";
import { Bell, BellOff, Send } from "lucide-react";

// Helper function to convert base64 to Uint8Array (required for applicationServerKey)
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export default function Home() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Check if service worker and push are supported
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    } else {
      setStatus("Push notifications are not supported in this browser.");
    }
  }, []);

  async function registerServiceWorker() {
    try {
      setStatus("Registering service worker...");

      // Register the service worker
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });

      setStatus("Service worker registered successfully!");

      // Check if already subscribed
      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setStatus("Already subscribed to push notifications");
        setSubscription(existingSubscription);
      }
    } catch (error) {
      setStatus(`Service worker registration failed: ${error}`);
      console.error("Service worker registration failed:", error);
    }
  }
  const getSubscription = async () => {
    if ("serviceWorker" in navigator) {
      setStatus("Subscribing to push notifications...");
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
          ),
        });
      }
      // console.log("React Subscription ", subscription);
      return subscription;
    } else {
      console.error("Service Worker is not supported in this browser");
      return null;
    }
  };

  async function subscribeToPush() {
    try {
      setStatus("Requesting permission...");

      // Request permission
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setStatus("Permission denied for notifications");
        return;
      }

      // Get service worker registration
      console.log(navigator);

      // Subscribe to push

      const pushSubscription = await getSubscription();
      console.log("push Subsription", pushSubscription);
      setStatus("Successfully subscribed to push notifications!");
      setSubscription(pushSubscription);

      // Send subscription to server
      const serializedSubscription = JSON.parse(
        JSON.stringify(pushSubscription)
      );
      await subscribeUser(serializedSubscription);
    } catch (error) {
      setStatus(`Failed to subscribe: ${error}`);
      console.error("Failed to subscribe to push:", error);
    }
  }

  async function unsubscribeFromPush() {
    try {
      if (subscription) {
        setStatus("Unsubscribing...");
        await subscription.unsubscribe();
        setSubscription(null);
        await unsubscribeUser();
        setStatus("Unsubscribed from push notifications");
      }
    } catch (error) {
      setStatus(`Failed to unsubscribe: ${error}`);
      console.error("Failed to unsubscribe from push:", error);
    }
  }

  async function sendTestNotification() {
    if (!message.trim()) {
      setStatus("Please enter a message");
      return;
    }

    try {
      setStatus("Sending notification...");
      await sendNotification(message);
      setStatus("Notification sent successfully!");
      setMessage("");
    } catch (error) {
      setStatus(`Failed to send notification: ${error}`);
      console.error("Failed to send notification:", error);
    }
  }

  if (!isSupported) {
    return (
      <div className="flex h-fit flex-col items-center justify-center ">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>
              Push notifications are not supported in this browser.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-fit flex-col items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Push Notifications Demo</CardTitle>
          <CardDescription>
            {subscription
              ? "You are subscribed to push notifications"
              : "Subscribe to receive push notifications"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">Status: {status}</div>

          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Enter notification message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button onClick={sendTestNotification} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
        <CardFooter>
          {subscription ? (
            <Button
              onClick={unsubscribeFromPush}
              variant="outline"
              className="w-full"
            >
              <BellOff className="mr-2 h-4 w-4" />
              Unsubscribe
            </Button>
          ) : (
            <Button onClick={subscribeToPush} className="w-full">
              <Bell className="mr-2 h-4 w-4" />
              Subscribe to Notifications
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
