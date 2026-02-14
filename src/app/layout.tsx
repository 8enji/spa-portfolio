import type { Metadata } from "next";
import "./globals.css";
import InteractiveGrid from "@/components/InteractiveGrid";

export const metadata: Metadata = {
    title: "Benjamin Charest — Software Engineer",
    description: "Software engineer focused on building thoughtful, well-crafted products.",
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
            </body>
        </html>
    );
}
