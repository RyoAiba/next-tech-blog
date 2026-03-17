/**
 * RootLayout
 *
 * - 全ページ共通レイアウト
 * - SEOメタデータ定義
 * - グローバルスタイル適用
 */

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { SpeedInsights } from "@vercel/speed-insights/next"

config.autoAddCss = false;

export const metadata: Metadata = {
  metadataBase: new URL("https://usagi-blog.vercel.app"),
  title: {
    default: "Usagi Blog",
    template: "%s | Usagi Blog",
  },
  description: "Next.js・TypeScript・UI設計を中心に、実務で得た知見や設計ノウハウを解説する技術ブログ。",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Usagi Blog",
    description: "Next.js・TypeScript・UI設計を中心にした技術ブログ",
    url: "https://usagi-blog.vercel.app",
    siteName: "Usagi Blog",
    type: "website",
    images: [
      {
        url: "/default-eyecatch.svg",
        width: 1200,
        height: 630,
      },
    ],
  },
  verification: {
    google: "bZaac-w3ajq_VEzAdk49KXuuBYR01Hd6P1azarFCsTg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1008847397870501"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-zinc-50 text-zinc-900">
        {/* ヘッダー */}
        <Header />

        {/* ページ内容 */}
        <main className="bg-zinc-50">
          <div className="mx-auto">{children}</div>
        </main>

        {/* フッター */}
        <Footer />
        {/* GA */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        {/* Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}
