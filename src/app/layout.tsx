import { UserProvider } from "@/components/UserContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Study Space",
  description: "Personalize YOUR Study Sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/cat-spinning.gif" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
