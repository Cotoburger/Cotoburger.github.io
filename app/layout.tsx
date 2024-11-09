import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import Link from "next/link";
import Header from "@/app/navibook/header";

export const metadata: Metadata = {
  title: "NaviBook",
  description: "The most advanced mod-free laptop for Scrap Mechanic.",
  openGraph: {
    title: "NaviBook",
    description: "The most advanced mod-free laptop for Scrap Mechanic.",
    images: ["https://cotoburger.github.io/mainpic.png"]
  },
  twitter: {
    title: "NaviBook",
    description: "The most advanced mod-free laptop for Scrap Mechanic.",
    images: ["https://cotoburger.github.io/mainpic.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
    <body
        className={`antialiased`}
    >
    <Header/>

    {children}
    </body>
    </html>
  );
}
