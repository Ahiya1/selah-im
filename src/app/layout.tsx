// src/app/layout.tsx - SELAH Root Layout - FIXED
// Technology that breathes with you
// Sacred container for contemplative experience

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SELAH - Technology that breathes with you",
  description:
    "The first contemplative technology. Two chambers for consciousness to explore itself: breathing meditation and AI-synthesized contemplative questions.",
  keywords: [
    "contemplative technology",
    "meditation",
    "consciousness",
    "mindfulness",
    "breathing",
    "self-recognition",
    "presence",
    "technology that serves",
  ],
  authors: [{ name: "Ahiya", url: "https://selah.im" }],
  creator: "Ahiya",
  publisher: "Selah",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://selah.im"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SELAH - Technology that breathes with you",
    description:
      "The first contemplative technology. Experience meditation and AI-synthesized questions for self-recognition.",
    url: "https://selah.im",
    siteName: "SELAH",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SELAH - Technology that breathes with you",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SELAH - Technology that breathes with you",
    description:
      "The first contemplative technology. Two chambers for consciousness to explore itself.",
    images: ["/og-image.png"],
    creator: "@selah_im",
  },
  robots: {
    index: true,
    follow: true,
    noarchive: true,
    nosnippet: false,
    noimageindex: false,
    nocache: false,
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" }],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SELAH",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#2d5a3d",
    "theme-color": "#2d5a3d",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2d5a3d" },
    { media: "(prefers-color-scheme: dark)", color: "#2d5a3d" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* DNS prefetch for analytics */}
        <link rel="dns-prefetch" href="//vitals.vercel-analytics.com" />
      </head>
      <body
        className={`
          min-h-screen 
          bg-gradient-to-br from-slate-50 to-emerald-50 
          text-slate-800 
          font-inter 
          antialiased
          overflow-x-hidden
          scrollbar-hide
        `}
        suppressHydrationWarning={true}
      >
        {/* Main content container */}
        <div className="relative min-h-screen">
          {/* Subtle background pattern */}
          <div
            className="fixed inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #2d5a3d 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Breathing gradient overlay */}
          <div
            className="fixed inset-0 opacity-30 pointer-events-none animate-breathe-slow"
            style={{
              background: `radial-gradient(circle at 50% 50%, 
                rgba(45, 90, 61, 0.1) 0%, 
                rgba(45, 90, 61, 0.05) 40%, 
                transparent 70%
              )`,
            }}
          />

          {/* Content */}
          <main className="relative z-10">{children}</main>
        </div>

        {/* Analytics - Only in production when packages are available */}
        {process.env.NODE_ENV === "production" && (
          <>
            {/* TODO: Add back when @vercel/analytics is installed */}
            {/* <Analytics /> */}
            {/* <SpeedInsights /> */}
          </>
        )}
      </body>
    </html>
  );
}
