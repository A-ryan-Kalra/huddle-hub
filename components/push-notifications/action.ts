"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import webpush, { PushSubscription } from "web-push";

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_USER_EMAIL!}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function subscribeUser(
  sub: PushSubscription,
  memberId: string,
  serverId: string
) {
  try {
    if (!memberId) {
      throw new Error("Member Id Missing");
    }
    if (!serverId) {
      throw new Error("Server Id Missing");
    }
    await db.member.update({
      where: {
        id: memberId,
        serverId,
      },
      data: {
        subscription: sub as any,
      },
      include: {
        profile: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error occured at: ", error);
    return { success: false, error: "Error occured at: " + error };
  }
}

export async function unsubscribeUser(memberId: string, serverId?: string) {
  try {
    if (!memberId) {
      throw new Error("Member Id Missing");
    }
    if (!serverId) {
      throw new Error("Server Id Missing");
    }
    await db.member.update({
      where: {
        id: memberId,
        ...(serverId && { serverId }),
      },
      data: {
        subscription: Prisma.JsonNull,
      },
      include: {
        profile: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error occured at: ", error);
    return { success: false, error: "Error occured at: " + error };
  }
}

export async function sendNotification(message: {
  title?: string;
  description: string;
  notificationId?: string;
  subscription: PushSubscription | any;
}) {
  try {
    if (!message?.subscription) {
      throw new Error("Subscription Expired");
    }
    await webpush.sendNotification(
      message?.subscription,
      JSON.stringify({
        title: message?.title ?? "Notification Received",
        body: message?.description,
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
      unsubscribeUser(message?.notificationId as string);
    }
    return { success: false, error: "Failed to send notification " + error };
  }
}
