import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "JewelryAI - Professional Jewelry Photography with AI",
  description:
    "Transform your jewelry photos into stunning professional images with AI",
};
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
