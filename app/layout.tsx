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
  description: "Tech articles and engineering insights by Usagi.",
  alternates: {
    canonical: "https://usagi-blog.vercel.app",
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
    description: "Tech articles and engineering insights by Usagi.",
    url: "https://usagi-blog.vercel.app",
    siteName: "Usagi Blog",
    type: "website",
    images: [
      {
        url: "/avatar.svg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-zinc-50 text-zinc-900">
        {/* ヘッダー */}
        <Header />

        {/* ページ内容 */}
        <main className="bg-zinc-50">
          <div className="mx-auto">{children}</div>
        </main>

        {/* フッター */}
        {/* GA */}
        <Footer />
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
        <SpeedInsights/>
      </body>
    </html>
  );
}
