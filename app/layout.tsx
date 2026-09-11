import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pharmacy Safety Hunt",
  description: "An interactive seven-stage home medication safety game.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
