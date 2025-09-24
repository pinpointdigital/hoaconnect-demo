import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BrandingProvider } from "@/lib/branding/context";
import { AuthProvider } from "@/lib/auth/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HOA Connect - Demo Platform",
  description: "Manage communities with clarity, efficiency, and accountability",
  icons: {
    icon: [
      { url: '/hoa-connect-favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/hoa-connect-favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/hoa-connect-favicon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script 
          type="module"
          src="https://agent.d-id.com/v2/index.js"
          data-mode="full"
          data-client-key="Z29vZ2xlLW9hdXRoMnwxMTcwMjYzNDk1OTI1MDc3MTk1MjQ6dkNtS2p0anVLRWlkXzJJTUc3Q3VM"
          data-agent-id="v2_agt_KZeBzDbg"
          data-name="did-agent"
          data-monitor="true"
          data-target-id="hoa-ai-assistant"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BrandingProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </BrandingProvider>
      </body>
    </html>
  );
}
