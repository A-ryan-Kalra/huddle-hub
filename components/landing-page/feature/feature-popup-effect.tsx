"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import FeatureImagePages from "./feature-image";

function FeaturePopupEffect() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const imgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const line = lineRef.current;
      const imge = imgeRef.current;

      if (!section || !line || !imge) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const triggerPoint = 400;

      if (rect.top < windowHeight - triggerPoint && rect.bottom > 0) {
        const totalScrollable = rect.height;
        const scrolled = Math.min(
          totalScrollable,
          Math.max(100, windowHeight - triggerPoint - rect.top)
        );

        line.style.height = `${scrolled}px`;
        imge.style.height = `${scrolled}px`;
      } else {
        imge.style.height = `${100}px`;
        line.style.height = `${100}px`;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // console.log(entries);
        for (let i = entries.length - 1; i >= 0; i--) {
          const entry = entries[i];

          if (!entry.isIntersecting) {
            document.querySelectorAll("[data-img-new]").forEach((img) => {
              img.classList.toggle("hide");
            });

            break;
          }
        }
      },
      { threshold: 0 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className=" w-full relative mx-auto flex h-full flex-col p-2 items-center pt-[4.5rem]  ">
      <div
        ref={imgeRef}
        className="w-1 border-[3px] border-gray-300 border-dashed rounded-xl h-full absolute top-0 mx-auto mt-5 transition"
      ></div>
      <div
        ref={imgeRef}
        className="w-[50px]  h-[50px] rounded-xl absolute top-0 mx-auto mt-5 transition"
        style={{ height: "100px" }}
      >
        <div className="border-[2px] border-teal-600 z-10 bottom-0 absolute bg-white rounded-full w-[50px] h-[50px] flex items-center">
          <img
            className="object-cover aspect-square scale-[200%] mx-auto w-10 h-10"
            alt="logo"
            src={"/icons/maskable-icon.png"}
          />
        </div>
      </div>
      <div
        ref={lineRef}
        className="w-[5px] bg-indigo-700  rounded-xl absolute top-0 mx-auto mt-5 transition"
        style={{ height: "100px" }}
      ></div>

      <div ref={sectionRef} className="h-full w-full bg-gray-">
        <FeatureImagePages
          title="Threaded Chats"
          description="Threaded chats in Huddle-hub allow users to have focused, organized
            conversations within a specific message, keeping side discussions
            out of the main channel flow. By replying in a thread, team members
            can discuss a topic in depth without cluttering the channel."
          alt="modal"
          // className="show"
          icon="/modal.png"
        />
        <FeatureImagePages
          title="Push Notifications"
          description="Introducing push notifications, It keep users instantly informed, even when they're not actively browsing. With this feature, users can receive real-time updates — like new messages, alerts or important announcements — directly on their device."
          alt="env-card"
          icon="/env-card.png"
        />
        <FeatureImagePages
          title="Jump to Message"
          description="Quickly navigate to the exact point in a conversation with our Jump to Message feature. Whether you're following up on a reply, a mention, or a thread, just tap and instantly scroll to the original message."
          alt="deploy"
          icon="/type.png"
        />
        <FeatureImagePages
          title="Notification Tracking"
          description="Our website includes a notification tracking feature that lets users view and manage all their notifications in one place. Whether it's a new message, update, alert, or reminder — everything is stored and organized so users never miss anything important."
          alt="deploy"
          icon="/type.png"
        />
        <FeatureImagePages
          title="Invite Friends"
          description="Easily grow your network by inviting friends to join the platform. With our Invite Friends feature, users can send personalized invitations via link. It's a simple way to share the experience, collaborate with others."
          alt="type"
          icon="/type.png"
        />
        <FeatureImagePages
          title="Live Video Call"
          description="Connect in real time with seamless live video calls directly through the platform.Ensuring high-quality video, secure connections, and instant communication — all in one place whether for meetings, collaboration, or casual chats."
          alt="type"
          icon="/type.png"
        />
        <FeatureImagePages
          title="Create Channels"
          description="Organize conversations your way with the ability to create private or public channels. Stay in control of who sees what — and keep communication organized and secure."
          alt="type"
          icon="/type.png"
        />
        <FeatureImagePages
          title="Create Server"
          description="Build your own workspace for community, collaboration, or team communication with the Create Server feature. Servers act as hubs where you can organize channels, manage members, set permissions, and customize settings to fit your needs — whether it's for friends, a project team, or a large community."
          alt="type"
          icon="/type.png"
        />
      </div>
    </div>
  );
}

export default FeaturePopupEffect;
