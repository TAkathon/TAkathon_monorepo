import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
    title: "TAKATHON — Student Portal",
    description: "Join hackathons, form teams, and collaborate with other students on TAKATHON.",
    keywords: [
        "hackathon",
        "Tunisia",
        "team formation",
        "TAKATHON",
        "students",
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
            <body className="antialiased">
                {children}
                <Toaster theme="dark" position="bottom-right" richColors />
            </body>
        </html>
    );
}
