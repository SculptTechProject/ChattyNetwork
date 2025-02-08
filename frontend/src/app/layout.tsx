"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    AOS.init({
      duration: 1000, // Czas trwania animacji w ms
      once: true, // Animacja tylko raz
    });
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
