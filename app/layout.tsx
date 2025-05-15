import type { Metadata } from "next";
import { Geist, Noto_Sans_Indic_Siyaq_Numbers } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ModalProviders from "@/components/providers/modal-providers";
import { Toaster } from "@/components/ui/sonner";
import SocketProviders from "@/components/providers/socket-providers";
import QueryProvider from "@/components/providers/query-provider";

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
          <SocketProviders>
            <ModalProviders />
            <Toaster />
            <QueryProvider>{children}</QueryProvider>
          </SocketProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
