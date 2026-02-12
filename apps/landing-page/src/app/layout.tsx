import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "TAKATHON — The Operating System for Hackathons in Tunisia",
    description:
        "TAKATHON is a SaaS platform that helps students form balanced hackathon teams based on skills and availability while giving organizers a structured overview of participants and teams.",
    keywords: [
        "hackathon",
        "Tunisia",
        "team formation",
        "TAKATHON",
        "students",
        "AI matching",
    ],
    openGraph: {
        title: "TAKATHON — The Operating System for Hackathons in Tunisia",
        description:
            "Transform chaotic team formation into a structured, efficient process.",
        type: "website",
        locale: "en_US",
    },
};

import FlyingMascot from "@/components/FlyingMascot";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className="antialiased">
                <FlyingMascot />
                {children}
            </body>
        </html>
    );
}
