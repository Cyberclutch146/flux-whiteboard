import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flux — Collaborative Whiteboard",
  description: "Real-time collaborative whiteboard built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-canvas-bg text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
