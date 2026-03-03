import type { Metadata } from "next";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "TAKATHON — Sponsor Panel",
  description:
    "Empower the next generation of innovators by sponsoring world-class hackathons on TAKATHON.",
  keywords: [
    "hackathon",
    "Tunisia",
    "sponsorship",
    "TAKATHON",
    "innovation",
    "dashboard",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-dark text-white">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
