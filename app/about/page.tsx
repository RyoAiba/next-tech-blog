/**
 * Aboutページ
 */
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata = {
  title: "About | Usagi Blog",
  description:
    "Usagi Blog の運営者情報と、このサイトの技術構成について紹介しています。",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-10 py-6 md:py-10 prose prose-zinc prose-sm md:prose-base leading-relaxed">
      {/* パンくず */}
      <Breadcrumb
        items={[
          { label: "Usagi Blog", href: "/" },
          { label: "Usagi Blogについて" },
        ]}
      />

      <h1 className="text-2xl md:text-3xl">Usagi Blogについて</h1>
      <p>
        Usagi Blog は、エンジニアとしての学びや気づきをまとめた備忘録ブログです。<br />
        外部 CMS を使わず、記事データから UI コンポーネントまで<br />
        すべてをコードで管理する構成をとっています。
      </p>

      <h2>技術構成</h2>

      <h3>Framework — Next.js (App Router)</h3>
      <p>
        ページのルーティングとレンダリングには Next.js の App Router を採用しています。<br />
        ファイルベースのルーティングとレイアウトの入れ子構造により、
        ページ構成をシンプルに保ちながら開発できます。
      </p>

      <h3>Rendering — Static Site Generation (SSG)</h3>
      <p>
        記事ページはビルド時に HTML として生成する SSG 方式を採用しています。<br />
        サーバーサイドの処理を必要とせず、生成済みのファイルを CDN から直接配信できるため、
        表示速度・SEO・インフラコストの面で優れた構成になっています。
      </p>

      <h3>Language — TypeScript</h3>
      <p>
        サイト全体を TypeScript で記述しています。<br />
        記事データも TypeScript ファイルで管理しており、タイトル・スラッグ・タグ・公開日といった
        フィールドに型定義を設けることで、記事追加時のミスをコンパイル時に検知できる構成になっています。
      </p>

      <h3>Styling — Tailwind CSS</h3>
      <p>
        スタイリングには Tailwind CSS を採用しています。<br />
        ユーティリティクラスをそのまま JSX に書けるため、コンポーネントとスタイルを同じファイルで完結させられます。<br />
        カラー・余白・タイポグラフィなどのデザイントークンを設定ファイルで管理することで、
        サイト全体の一貫性を保ちながら開発しています。
      </p>

      <h3>SEO — Metadata / OGP / Sitemap</h3>
      <p>
        Next.js の Metadata API を使ってページごとのタイトルと description を設定しています。<br />
        OGP タグの出力にも対応しており、SNS でシェアされた際のプレビューにも対応しています。<br />
        また <code>sitemap.xml</code> と <code>robots.txt</code> を自動生成することで、
        検索エンジンへの適切なインデックスを促す構成にしています。
      </p>

      <h3>Hosting — Vercel</h3>
      <p>
        デプロイと配信には Vercel を使用しています。<br />
        GitHub へのプッシュをトリガーに自動でビルド・デプロイされる CI/CD 構成で、
        生成した静的ファイルはグローバル CDN から配信されます。<br />
        Next.js との親和性が高く、設定コストを最小限に抑えられる点を選定理由としています。
      </p>

      <h3>Analytics — Google Analytics</h3>
      <p>
        アクセス解析には Google Analytics を導入しています。<br />
        どの記事が読まれているか・流入元の内訳などを把握しながら、
        コンテンツの改善に役立てています。
      </p>

      <h2>お問い合わせ</h2>
      <p>
        ご質問やご連絡は以下のフォームからご連絡ください。
      </p>
      <p>
        <Link href="/contact" className="text-blue-600 hover:underline">
          お問い合わせフォーム
        </Link>
      </p>

      <p className="text-sm text-zinc-400">最終更新日: 2026年3月6日</p>
    </main>
  );
}