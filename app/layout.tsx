import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KKUSB — Koperasi Karyawan Usaha Sejahtera Bersama",
    template: "%s | KKUSB"
  },
  description: "Website Resmi Koperasi Karyawan Usaha Sejahtera Bersama (KKUSB). Sinergi Usaha, Tumbuh Bersama — Melayani Simpan Pinjam Syariah, Retail USB Mart, Tour & Travel, Bengkel Simetris, dan Solusi Kemitraan Industri Sejak 2010.",
  keywords: ["KKUSB", "Koperasi Karyawan Usaha Sejahtera Bersama", "Koperasi Gresik", "USB Mart", "Koperasi Semen Gresik", "Simpan Pinjam Syariah", "Tour Travel Gresik"],
  authors: [{ name: "KKUSB Management" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

import { Providers } from "@/components/providers";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
