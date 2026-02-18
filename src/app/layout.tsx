import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import StructuredData from "@/components/StructuredData";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://junkcaptainllc.com'),
  title: {
    default: "Junk Captain LLC | Professional Junk Removal in Raleigh, Cary, Apex & Durham",
    template: "%s | Junk Captain LLC"
  },
  description: "Professional junk removal services in Raleigh, Cary, Apex, Fuquay Varina, and Durham. Same-day service available. Free estimates. Licensed & insured. Call (919) 924-8463 today!",
  keywords: [
    "junk removal Raleigh",
    "junk removal Cary",
    "junk removal Apex",
    "junk removal Durham",
    "junk removal Fuquay Varina",
    "furniture removal Raleigh",
    "appliance removal Cary",
    "estate cleanout Durham",
    "construction debris removal",
    "hot tub removal",
    "mattress disposal Raleigh",
    "same day junk removal",
    "eco-friendly junk removal",
    "affordable junk removal Triangle NC"
  ],
  authors: [{ name: "Junk Captain LLC" }],
  creator: "Junk Captain LLC",
  publisher: "Junk Captain LLC",
  formatDetection: {
    telephone: true,
  },
  icons: {
    icon: '/brand/logo/logo_circle.png',
    apple: '/brand/logo/logo_circle.png',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://junkcaptainllc.com",
    siteName: "Junk Captain LLC",
    title: "Junk Captain LLC | Professional Junk Removal in Raleigh, Cary, Apex & Durham",
    description: "Professional junk removal services in the Triangle area. Same-day service, free estimates, and eco-friendly disposal. Call (919) 924-8463!",
    images: [
      {
        url: "/brand/logo/logo_original.jpg",
        width: 1200,
        height: 630,
        alt: "Junk Captain LLC - Professional Junk Removal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Junk Captain LLC | Professional Junk Removal in Raleigh Area",
    description: "Same-day junk removal in Raleigh, Cary, Apex, Durham & Fuquay Varina. Free estimates. Licensed & insured. Call (919) 924-8463!",
    images: ["/brand/logo/logo_original.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here later
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
