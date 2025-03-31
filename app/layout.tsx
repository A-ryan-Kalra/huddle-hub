import type { Metadata } from "next";
import { Geist, Noto_Sans_Indic_Siyaq_Numbers } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

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
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
