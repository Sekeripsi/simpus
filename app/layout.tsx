import type { Metadata, Viewport } from "next";
import { Poppins, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Simpus",
    default: "Simpus - Sistem Informasi Manajemen Puskesmas",
  },
  description:
    "Platform manajemen puskesmas terintegrasi untuk pendaftaran pasien, rekam medis, dan manajemen data kesehatan. Solusi kesehatan terpercaya untuk fasilitas kesehatan publik.",
  keywords: [
    "puskesmas",
    "kesehatan",
    "rekam medis",
    "manajemen kesehatan",
    "sistem informasi kesehatan",
    "simpus",
  ],
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
  authors: [
    {
      name: "SIMPUS",
      url: "https://simpus.example.com",
    },
  ],
  openGraph: {
    title: "Simpus - Sistem Informasi Manajemen Puskesmas",
    description:
      "Platform manajemen puskesmas terintegrasi untuk pendaftaran pasien, rekam medis, dan manajemen data kesehatan.",
    url: "https://simpus.example.com",
    type: "website",
  },
  applicationName: "SIMPUS",
  category: "Healthcare",
  icons: {
    icon: "/favicon/logo.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0c96b5", // SIMPUS Primary Brand Color
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", poppins.variable, playfairDisplay.variable, "font-sans", geist.variable)}
    >
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
