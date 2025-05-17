"use client";

import ActionToolTip from "@/components/ui/action-tooltip";
import { BellOff, BellRing, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { sendNotification, subscribeUser, unsubscribeUser } from "./action";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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

function PushNotification() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    // Check if service worker and push are supported
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    } else {
      // setStatus("Push notifications are not supported in this browser.");
      toast("Error", {
        description: "Push notifications are not supported in this browser.",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });
    }
  }, []);

  async function registerServiceWorker() {
    try {
      console.log("Registering service worker...");

      // Register the service worker
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });

      console.log("Service worker registered successfully!");

      // Check if already subscribed
      const existingSubscription =
        await registration.pushManager.getSubscription();

      if (existingSubscription) {
        setStatus("Already subscribed to push notifications");

        toast("Alert", {
          description: "Already subscribed to push notifications",
          style: { backgroundColor: "white", color: "black" },
          richColors: true,
        });
        setSubscription(existingSubscription);
      }
    } catch (error) {
      toast("Error", {
        description: `Service worker registration failed`,
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });
      console.error("Service worker registration failed:", error);
    }
  }
  const getSubscription = async () => {
    if ("serviceWorker" in navigator) {
      toast("Alert", {
        description: "Subscribing to push notifications...",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });

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
      toast("Error", {
        description: `Service Worker is not supported in this browser`,
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });
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
        toast("Error", {
          description: "Permission denied for notifications",
          style: { backgroundColor: "white", color: "black" },
          richColors: true,
        });
        return;
      }

      // Get service worker registration
      console.log(navigator);

      // Subscribe to push

      const pushSubscription = await getSubscription();
      console.log("push Subsription", pushSubscription);

      toast("Success", {
        description: "Successfully subscribed to push notifications",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });
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
        toast("Alert", {
          description: "Unsubscribing...",
          style: { backgroundColor: "white", color: "black" },
          richColors: true,
        });
        await subscription.unsubscribe();
        setSubscription(null);
        await unsubscribeUser();

        toast("Success", {
          description: "Unsubscribed from push notifications",
          style: { backgroundColor: "white", color: "black" },
          richColors: true,
        });
      }
    } catch (error) {
      console.error("Failed to unsubscribe from push:", error);
      toast("Error", {
        description: "Failed to unsubscribe",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });
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
  console.log(isOpen);

  // useEffect(() => {
  //   if (subscription) {
  //     setIsOpen(true);
  //   }
  // }, []);
  return (
    <div className="flex items-center">
      {subscription && isOpen ? (
        <ActionToolTip
          onClick={unsubscribeFromPush}
          className="ml-auto flex items-center "
          label="Unsubscribe to notifications"
        >
          <div className=" hover:bg-zinc-200 duration-300 p-2 transition rounded-md cursor-pointer">
            <BellOff className=" h-5 w-5" />
          </div>
        </ActionToolTip>
      ) : (
        <DropdownMenu
          modal={false}
          onOpenChange={(e) => {
            setIsOpen(e === false);

            if (e) {
              subscribeToPush();
              // setIsOpen(true)
            } else if (!e) {
              setIsTestMode(false);
            }
          }}
        >
          <DropdownMenuTrigger>
            <ActionToolTip
              className="ml-auto flex items-center"
              label="Subscribe to notifications"
            >
              <div className=" hover:bg-zinc-500 bg-black duration-300 p-2 transition rounded-md cursor-pointer">
                <BellRing className=" h-5 w-5 text-white" />
              </div>
            </ActionToolTip>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="sm:w-[300px] w-[240px]" align="end">
            <DropdownMenuLabel className="cursor-default flex justify-start items-center gap-x-2">
              <Switch
                // checked={true}
                onCheckedChange={(e) => {
                  setIsTestMode(e);
                }}
              />
              <span>Test Mode</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="   break-words  ">
              In Test Mode, you can check whether the current browser supports
              push notifications.
            </DropdownMenuLabel>
            {isTestMode && (
              <>
                <DropdownMenuSeparator />
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Check Push Notification"
                    value={message}
                    className="focus-visible:ring-0 max-sm:placeholder:text-[13px] focus-visible:border-zinc-400 outline-none"
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button onClick={sendTestNotification} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export default PushNotification;
