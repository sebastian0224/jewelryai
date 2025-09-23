import type { Metadata } from "next";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

export const metadata: Metadata = {
  title: "JewelryAI - Professional Jewelry Photography with AI",
  description:
    "Transform your jewelry photos into stunning professional images with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
