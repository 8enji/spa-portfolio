import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Ben — Software Engineer",
    description: "Software engineer focused on building thoughtful, well-crafted products.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
