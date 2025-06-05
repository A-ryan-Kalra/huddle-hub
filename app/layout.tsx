import type { Metadata } from "next";
import { Geist, Noto_Sans_Indic_Siyaq_Numbers } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ModalProviders from "@/components/providers/modal-providers";
import { Toaster } from "@/components/ui/sonner";
import SocketProviders from "@/components/providers/socket-providers";
import QueryProvider from "@/components/providers/query-provider";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const righteous = Noto_Sans_Indic_Siyaq_Numbers({
  variable: "--font-righteous",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Huddle Hub",
  description: "The only platform to connect employes within the organization.",
  keywords: [
    "internal chat",
    "organization",
    "team communication",
    "huddle",
    "group-chat",
  ],
  openGraph: {
    title: "Huddle Hub",
    description: "Chat with your team. All in one place.",
    url: process.env.NEXT_PUBLIC_SITE_URL!,
    siteName: "Huddle Hub",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Huddle Hub PWA",
  },
  formatDetection: {
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${righteous.className}  antialiased`}>
          <Suspense fallback={<Loading />}>
            <SocketProviders>
              <ModalProviders />
              <Toaster />
              <QueryProvider>{children}</QueryProvider>
            </SocketProviders>
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}
