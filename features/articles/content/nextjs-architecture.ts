import type { Article } from "../index";

export const nextjsArchitecture: Article = {
  slug: "nextjs-architecture",
  title: "App Routerで迷わなくなった設計の考え方",
  description:
    "App Routerを活用した実務レベルの設計戦略を体系的に解説します。",
  publishedAt: "2026.02.18",
  tags: [
    { name: "Next.js", slug: "nextjs" },
    { name: "TypeScript", slug: "typescript" },
    { name: "パフォーマンス", slug: "performance" },
  ],
  content: `
<p>
  「とりあえず動いた」から「半年後も迷わない設計」へ。<br />
  App Routerに乗り換えて実際に詰まったポイントを整理しながら、<strong>初心者でも再現できる設計の考え方</strong>をまとめます。
</p>

<h2>App Routerってそもそも何？</h2>
<p>
  Next.js 13から導入された新しいルーティングの仕組みです。
  それまで使われていた「Pages Router」とは設計思想が根本から異なります。
</p>
<p>
  一番の違いは、<strong>React Server Components（RSC）前提で設計されている</strong>こと。
  「サーバーでやること」と「ブラウザでやること」を最初から分けて考える構造になっています。
</p>

<h3>なぜServer Componentがデフォルトなのか</h3>
<p>
  理由はシンプルです。<strong>パフォーマンスとSEOを両立するため</strong>です。
</p>
<ul>
  <li>不要なJavaScriptをブラウザに送らなくて済む</li>
  <li>データ取得をサーバー側で完結できる</li>
  <li>初期表示が速くなる</li>
</ul>
<p>
  一言で言うと「<strong>できるだけサーバーで処理しよう</strong>」という思想です。
  これがApp Router全体の設計哲学の根幹になります。
</p>

<h2>Pages Routerとの違いをざっくり理解する</h2>
<p>
  Pages Routerは「<strong>ページ単位</strong>」の設計でした。
  一方、App Routerは「<strong>レイアウト単位</strong>」で設計できます。
</p>
<p>
  これがなぜ重要かというと、<strong>UIを使い回しやすくなるから</strong>です。
</p>
<p>
  例えば、ヘッダーやサイドバー。
  Pages Routerだと毎ページ <code>import</code> していましたが、
  App Routerではレイアウトとして自然にネストできます。
</p>

<h2>拡張性の高いディレクトリ設計とは？</h2>
<p>
  長く運用するプロジェクトほど、「あとから機能が増える」前提で設計する必要があります。
  ここで重要なのが<strong>責務の分離</strong>です。
</p>

<h3>features単位で分ける理由</h3>
<p>
  機能（ドメイン）ごとにディレクトリを切り分けます。
</p>
<pre><code>src/
  app/                   # Next.js App Router のルート
    articles/
      [slug]/
        page.tsx
      layout.tsx         # 記事専用レイアウト
      page.tsx
    layout.tsx           # RootLayout
    page.tsx
  features/              # ドメインロジックはここ
    articles/
      ArticleCard.tsx
      useArticles.ts
      types.ts
    users/
    auth/
  components/            # 汎用UIパーツ
    Button.tsx
    Modal.tsx
  libs/                  # 外部サービス・ユーティリティ
</code></pre>
<ul>
  <li><strong>機能追加時に迷わない</strong> — 「どこに置くか」が構造で決まる</li>
  <li><strong>修正範囲が限定される</strong> — articles を変えても users に影響しない</li>
  <li><strong>チーム開発で衝突しにくい</strong> — 担当範囲がディレクトリで可視化される</li>
</ul>
<p>
  「<strong>機能ごとに小さなアプリを作る</strong>」イメージで考えると、ディレクトリ構成が自然に決まります。
</p>

<h3>componentsとfeaturesの違い</h3>
<p>
  ここは初心者が一番混乱しがちなポイントです。シンプルにこう覚えてください。
</p>
<ul>
  <li><strong>components</strong> → どこでも使える汎用UI（ボタン・モーダル・バッジなど）</li>
  <li><strong>features</strong> → 特定の機能にしか使わないロジック・UIの塊</li>
</ul>
<p>
  この線引きを曖昧にすると、数ヶ月後に「どこに何があるのか分からない地獄」が始まります。実際に経験しました。
</p>

<h2>レイアウト設計がApp Routerの本質</h2>
<p>
  App Router最大の武器は「<strong>ネスト可能なレイアウト</strong>」です。
  ここを理解できるかどうかで、App Routerを使いこなせるかが決まると言っても過言ではありません。
</p>

<h3>RootLayoutの役割</h3>
<p>
  全ページ共通の基盤です。以下をここに集約します。
</p>
<ul>
  <li><strong>ヘッダー・フッター</strong> — 全ページに共通するナビゲーション</li>
  <li><strong>グローバルCSS</strong> — アプリ全体のスタイル定義</li>
  <li><strong>メタデータ</strong> — SEOに関わる共通タグ</li>
</ul>
<pre><code>// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="ja"&gt;
      &lt;body&gt;
        &lt;Header /&gt;
        &lt;main&gt;{children}&lt;/main&gt;
        &lt;Footer /&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  )
}
</code></pre>

<h3>セクション別レイアウトを作る理由</h3>
<p>
  例えば <code>/articles</code> 配下だけ専用レイアウトを持たせることができます。
  「なぜわざわざ分けるのか？」と思うかもしれません。
</p>
<p>
  理由は<strong>将来の変更コストを最小化するため</strong>です。
  「記事ページだけデザインを刷新したい」となった時、変更範囲が <code>articles/layout.tsx</code> 一ファイルに収まります。
</p>
<p>
  これは「<strong>将来の自分への保険</strong>」です。書いた直後には効果を感じにくいですが、半年後に必ず効いてきます。
</p>

<h2>パフォーマンスは設計段階で決まる</h2>
<p>
  後から最適化するのはコストが高いです。最初から意識する方が圧倒的に楽です。現場で何度も痛感したことです。
</p>

<h3>静的生成（generateStaticParams）を使う理由</h3>
<p>
  <code>generateStaticParams</code> を使えば、ビルド時にページを生成できます。
  アクセス時にサーバー計算が不要になるため、レスポンスが速くなります。
</p>
<pre><code>// app/articles/[slug]/page.tsx

// ビルド時に全記事スラッグを生成
export async function generateStaticParams() {
  const articles = await fetchAllArticles()
  return articles.map((a) =&gt; ({ slug: a.slug }))
}

// このページはビルド時に静的HTMLとして生成される
export default async function ArticlePage({ params }) {
  const article = await fetchArticle(params.slug)
  return &lt;ArticleDetail article={article} /&gt;
}
</code></pre>

<h3>"use client"は最小限に</h3>
<p>
  何でもかんでもクライアントコンポーネントにすると、JavaScriptが肥大化してパフォーマンスが落ちます。
</p>
<ul>
  <li><strong>useState / useEffect を使う</strong> → クライアントが必要</li>
  <li><strong>クリックなどのイベントハンドラを持つ</strong> → クライアントが必要</li>
  <li><strong>表示だけ・データ取得だけ</strong> → サーバーで十分</li>
</ul>
<p>
  「<strong>本当にブラウザで動く必要がある？</strong>」と自問する癖をつけるだけで、設計レベルが一段上がります。
  コードレビューでも使える視点です。
</p>

<h2>まとめ</h2>
<p>
  App Routerは単なるルーティングではありません。<strong>設計思想そのもの</strong>です。
  次の3点を意識するだけで「なんとなく動く構成」から「長期運用できる設計」に変わります。
</p>
<ul>
  <li><strong>サーバー中心に考える</strong> — "use client" は最小限、デフォルトはサーバー</li>
  <li><strong>責務を分離する</strong> — features / components の線引きを明確に</li>
  <li><strong>レイアウトで拡張性を担保する</strong> — 将来の変更コストを今の設計で下げる</li>
</ul>
  `,
};