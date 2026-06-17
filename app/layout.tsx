import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlphaVest WealthOS",
  description: "Demo-data-first wealth governance operating system."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

