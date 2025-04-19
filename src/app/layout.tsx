import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "styles/globals.css";
import { auth } from "app/auth";
import Navbar from "@/components/Navbar";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <link rel="icon" href="/cat-spinning.gif" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar session={session}/>
        {children}
      </body>
    </html>
  );
}
