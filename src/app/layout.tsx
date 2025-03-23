import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EZStudy - Transcribe and Organize Handwritten Notes",
  description: "Upload, transcribe, and organize your handwritten notes with EZStudy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
