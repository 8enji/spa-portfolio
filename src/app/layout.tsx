import type { Metadata } from "next";
import "./globals.css";
import InteractiveGrid from "@/components/InteractiveGrid";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
    title: "Ben Charest",
    description: "Software engineer focused on designing simple, maintainable systems that solve real problems",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <InteractiveGrid />
                {children}
                <Analytics />
            </body>
        </html>
    );
}
