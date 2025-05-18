"use client";

import ActionToolTip from "@/components/ui/action-tooltip";
import { BellOff, BellRing, Send } from "lucide-react";
import React, { FormEvent, useEffect, useRef, useState } from "react";
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
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

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

function PushNotification({ currentMemberId }: { currentMemberId: string }) {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();

  useEffect(() => {
    // Check if service worker and push are supported
    if ("serviceWorker" in navigator && "PushManager" in window) {
      registerServiceWorker();
    } else {
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
        setIsOpen(true);

        toast("Alert", {
          description: "Already subscribed to push notifications",
          style: { backgroundColor: "white", color: "black" },
          richColors: true,
        });
        setSubscription(existingSubscription);
      }
    } catch (error) {
      toast("Error", {
        description: `Service worker registration failed: check console for more details`,
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
      // Request permission
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        //Permission denied for notifications
        toast("Error", {
          description: "Permission denied for notifications",
          style: { backgroundColor: "white", color: "black" },
          richColors: true,
        });
        return;
      }

      const pushSubscription = await getSubscription();

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
      setIsOpen(true);
      const res = await subscribeUser(
        serializedSubscription,
        currentMemberId,
        params?.serverId as string
      );

      if (!res.success) {
        throw new Error(res.error);
      }

      setOpenMenu(true);
    } catch (error: Error | any) {
      toast("Error", {
        description: error?.message?.includes("push service error")
          ? "Failed to subscribe: please enable google services for push messaging in your browser settings."
          : "Failed to subscribe to push: check console for more details",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
        duration: 5000,
      });
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

        const res = await unsubscribeUser(
          currentMemberId,
          params?.serverId as string
        );

        if (!res.success) {
          throw new Error(res.error);
        }
        setIsOpen(false);

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
  async function sendTestNotification(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      toast("Alert", {
        description: "Please enter a message",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });
      return;
    }

    try {
      toast("Alert", {
        description: "Sending notification...",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });
      const serializedSubscription = JSON.parse(JSON.stringify(subscription));
      const res = await sendNotification({
        description: message,
        subscription: serializedSubscription,
      });

      if (!res.success) {
        console.error(res.error);
      }

      toast("Success", {
        description: "Notification sent successfully!",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
      });

      setMessage("");
    } catch (error) {
      toast("Error", {
        description:
          "Failed to send notification or reset pressing bell button: check console for more details",
        style: { backgroundColor: "white", color: "black" },
        richColors: true,
        duration: 4000,
      });
      console.error("Failed to send notification:", error);
    }
  }

  return (
    <div className="flex items-center flex-row-reverse">
      {subscription && isOpen ? (
        <ActionToolTip
          onClick={unsubscribeFromPush}
          className="ml-auto flex items-center  z-10"
          label="Unsubscribe to notifications"
        >
          <div className=" hover:bg-zinc-200 duration-300 p-2 transition rounded-md cursor-pointer">
            <BellOff className=" h-5 w-5" />
          </div>
        </ActionToolTip>
      ) : (
        <ActionToolTip
          onClick={subscribeToPush}
          className="ml-auto flex items-center z-10"
          label="Subscribe to notifications"
        >
          <div className=" hover:bg-zinc-500 bg-black duration-300 p-2 transition rounded-md cursor-pointer">
            <BellRing className=" h-5 w-5 text-white" />
          </div>
        </ActionToolTip>
      )}

      <DropdownMenu open={openMenu} onOpenChange={setOpenMenu} modal={false}>
        <DropdownMenuTrigger
          className={cn(
            " flex items-center mr-2   transition duration-300 translate-x-10",
            isOpen && "-translate-x-2"
          )}
        >
          <ActionToolTip
            className={cn(" flex items-center  p-1  ")}
            label="Test Push Notification"
            side="left"
          >
            <span className={cn("relative flex size-3  ")}>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-teal-500"></span>
            </span>
          </ActionToolTip>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="sm:w-[300px] w-[240px]" align="center">
          <DropdownMenuLabel className="cursor-default flex justify-start items-center gap-x-2">
            <span className="font-semibold tracking-wide text-red-500">
              Test Mode
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-zinc-600 font-semibold  break-words">
            In Test Mode, you can check whether the current browser receive push
            notifications.
          </DropdownMenuLabel>

          <DropdownMenuSeparator />
          <form
            onSubmit={sendTestNotification}
            className="flex items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Check Push Notification"
              value={message}
              className="focus-visible:ring-0 max-sm:placeholder:text-[13px] focus-visible:border-zinc-400 outline-none"
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default PushNotification;
