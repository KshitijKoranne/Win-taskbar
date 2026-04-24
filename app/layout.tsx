"use server";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taskbar Builder — Build custom Windows taskbars",
  description: "Design pixel-perfect Windows 7, 10, and 11 taskbars. Add real icons, set a custom time and date, and export at native screen resolution. Free, no signup.",
  keywords: ["windows taskbar", "taskbar builder", "windows mockup", "windows 7", "windows 10", "windows 11", "taskbar export", "desktop mockup"],
  authors: [{ name: "KJR Labs", url: "https://kjrlabs.in" }],
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-100.png", sizes: "100x100", type: "image/png" },
    ],
    apple: "/favicon-100.png",
  },
  openGraph: {
    title: "Taskbar Builder",
    description: "Design pixel-perfect Windows taskbars and export at native resolution.",
    url: "https://win-taskbar.vercel.app",
    siteName: "Taskbar Builder",
    images: [{ url: "/favicon-100.png", width: 100, height: 100 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Taskbar Builder",
    description: "Design pixel-perfect Windows taskbars and export at native resolution.",
    images: ["/favicon-100.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
