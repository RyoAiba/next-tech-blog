/**
 * Usagi Blog トップページ
 */

import HomeContent from "@/components/home/HomeContent";
import HeroSection from "@/components/home/HeroSection";
import Sidebar from "@/components/layout/Sidebar";
import { articles } from "@/features/articles";

export default function Home() {
  return (
    <>
      {/* ヒーローセクション */}
      <HeroSection />
      {/* コンテンツエリア */}
      <div className="max-w-7xl mx-auto px-4 md:pl-10 md:pr-4 py-6 md:py-10">
        <div className="flex flex-col md:flex-row md:gap-10">
          <HomeContent articles={articles} />
          {/* サイドバー */}
          <Sidebar />
        </div>
      </div>
    </>
  );
}
