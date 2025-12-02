import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/constants/site-info";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import "./globals.scss";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} | ${SITE_DESCRIPTION}`,
  },
  description: SITE_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || '';

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="robots" content="index, follow" />
        <meta property="og:url" content={SITE_URL} />
        <meta name="google-adsense-account" content="ca-pub-6309653411409847" />
        <link rel="icon" type="image/png" href="https://zosi0vn2uecxzezz.public.blob.vercel-storage.com/favicon-32x96.png" sizes="32x96"></link>
        <link rel="shortcut icon" href="https://zosi0vn2uecxzezz.public.blob.vercel-storage.com/favicon.ico"></link>
        <link rel="apple-touch-icon" sizes="180x180" href="https://zosi0vn2uecxzezz.public.blob.vercel-storage.com/apple-touch-icon.png"></link>
      </head>
      <body
        className={`${roboto.variable} antialiased`}
      >
        <div className="min-h-screen bg-white relative main-layout font-[Roboto]">
          {/* Red Corner Flag */}
          <div className="fixed top-0 -right-2 z-50">
            <div className="relative">
              <Link href="/support-us" className="block">
                <div className="bg-red-600 text-white text-[10px] font-bold py-2 px-8 transform rotate-45 translate-x-6 translate-y-4 shadow-lg cursor-pointer hover:bg-red-700 transition-colors">
                  SUPPORT US
                </div>
              </Link>
            </div>
          </div>
          
          {/* Header */}
          <Header />

          {/* Page Content */}
          <div className="bg-slate-100 pb-10">
            {children}
          </div>

          {/* Footer */}
          <Footer />

          <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
          <SpeedInsights/>
          <Analytics/>
          <script 
            async 
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6309653411409847"
          ></script>
        </div>
      </body>
    </html>
  );
}
