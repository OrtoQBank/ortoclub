import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sifonnPro = localFont({
  src: "./fonts/sifonn-pro.otf",
  variable: "--font-sifonn-pro",
});

export const metadata: Metadata = {
  title: "OrtoClub",
  description: "OrtoClub é uma plataforma de educação ortodôntica que oferece cursos, mentoria e produtos para profissionais da área.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sifonnPro.variable} antialiased bg-blue-50`}
      >
        <Providers>
          <Header />
          {children}
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
