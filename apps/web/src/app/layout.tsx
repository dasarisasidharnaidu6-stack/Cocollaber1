import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoCollaber — Opportunity & Collaboration Ecosystem",
  description:
    "An open, global, domain-agnostic ecosystem where anyone can discover opportunities and create opportunities for others.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
