
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers";

import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "ProHostix",
  description: "Architecting high-performance digital ecosystems",
  keywords: ["Prohostix", "pro hostix", "software company", "it firm", "it company"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        <Providers>
          <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
