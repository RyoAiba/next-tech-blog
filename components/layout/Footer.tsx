/**
 * サイト共通フッター
 */

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-5 md:mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 text-center">

        {/* 上部リンク */}
        <div className="mb-6 text-xs text-zinc-600">
          <Link
            href="/privacy"
            className="hover:underline"
          >
            プライバシーポリシー
          </Link>
          <span className="mx-2">|</span>
          <Link
            href="/contact"
            className="hover:underline"
          >
            お問い合わせ
          </Link>
          <span className="mx-2">|</span>
          <Link
            href="/about"
            className="hover:underline"
          >
            Usagi Blogについて
          </Link>
        </div>

        {/* サイト説明 */}
        <p className="text-xs text-zinc-600 mb-1">
          日々の学びを発信するサイト
        </p>

        {/* タイトル */}
        <p className="text-2xl font-bold mb-3">
          <Link
            href="/"
            className="transition-opacity"
          >
            Usagi Blog
          </Link>
        </p>

        {/* コピーライト */}
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} Usagi Blog
        </p>
      </div>
    </footer>
  );
}
