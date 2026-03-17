import { Article } from "../index";

export const reactTocComponent: Article = {
  slug: "react-toc-component",
  title: "Reactで目次コンポーネントを自作する【前編】HTMLから見出しを抽出してスクロール連動させるまで",
  description:
    "ライブラリなしで目次コンポーネントを自作してみました。HTMLから見出しを抽出してIDを注入し、IntersectionObserverでスクロール連動ハイライトを実装するまでの流れをUsagi Blogの実装をもとに解説します。",
  publishedAt: "2026.03.17",
  updatedAt: undefined,
  updatedAtTimestamp: undefined,
  tags: [
    { name: "React", slug: "react" },
    { name: "Next.js", slug: "nextjs" },
    { name: "UI", slug: "ui" },
  ],
  content: `
    <h2>目次コンポーネント、ライブラリいらなかった</h2>
    <p>
      Usagi Blogを作るとき、目次どうしようとライブラリを探しはじめたんですが、やることを整理してみたら4つだけでした。
    </p>
    <ul>
      <li>HTMLから見出しを抽出する</li>
      <li>見出し要素にIDを付ける</li>
      <li>クリックでスムーズスクロールする</li>
      <li>スクロール位置に応じてハイライトを更新する</li>
    </ul>
    <p>
      これなら自前で書けます。自分で書けば挙動を自由に変えられるし、変な動きが起きたときの原因もすぐわかります。
    </p>
    <p>
      前編ではPC向けの基本部分、HTMLからの見出し抽出からスクロール連動ハイライトまでを作ります。スマホ対応は後編です。
    </p>

    <h2>先にデータの流れを把握する</h2>
    <p>
      コードを読む前に、データがどう流れるかを整理しておくと迷いません。
    </p>
    <pre><code>article.content（HTML文字列）
  ↓ extractHeadings()
TocItem[]（見出し情報の配列）
  ↓
┌─────────────────────────────────────┐
│  contentWithIds（IDを注入したHTML）  │  → ArticleContent で表示
│  toc（TocItem[]）                   │  → Sidebar → TableOfContents に渡す
└─────────────────────────────────────┘</code></pre>
    <p>
      <code>extractHeadings</code> が生成した <code>TocItem[]</code> を、記事本文側（ID注入）とUI側（目次表示）の2箇所で使い回す構造です。
    </p>

    <h2>HTMLから見出しを抽出する</h2>
    <p>
      HTML文字列から見出し情報を取り出すユーティリティを作ります。
    </p>
    <pre><code>// lib/toc.ts

export type TocItem = {
  id: string;    // スクロール先のID
  text: string;  // 目次に表示するテキスト
  level: number; // 見出しのレベル（2 = h2, 3 = h3）
};

export function extractHeadings(html: string): TocItem[] {
  const headingRegex = /&lt;(h2|h3).*?&gt;(.*?)&lt;\\/\\1&gt;/g;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = match[1] === "h2" ? 2 : 3;
    const text = match[2].replace(/&lt;[^&gt;]+&gt;/g, "");

    const id = text
      .toLowerCase()
      .replace(/\\s+/g, "-")
      .replace(/[^\\w\\-ぁ-んァ-ン一-龥]/g, "");

    items.push({ id, text, level });
  }

  return items;
}</code></pre>
    <p>
      正規表現で <code>h2</code> / <code>h3</code> タグを拾い、テキストとIDを生成しています。
    </p>
    <p>
      ID生成のロジックは「小文字化 → スペースをハイフンに → 記号を除去」の3ステップです。文字クラスに <code>ぁ-んァ-ン一-龥</code> を入れているのがポイントで、これがないと日本語の見出しのIDが空文字になります。たとえば <code>「スクロールの仕組み」</code> は <code>「」</code> だけ除去されて <code>スクロールの仕組み</code> というIDになります。
    </p>

    <h2>見出し要素にIDを注入する</h2>
    <p>
      次に、記事ページ側でHTMLの見出し要素に実際のIDを付与します。さっきと同じID生成ロジックを使うことで、目次リンクの飛び先とDOM要素のIDが必ず一致します。
    </p>
    <pre><code>// app/articles/[slug]/page.tsx（抜粋）

const toc = extractHeadings(article.content);

const contentWithIds = article.content.replace(
  /&lt;(h2|h3)(.*?)&gt;(.*?)&lt;\\/\\1&gt;/g,
  (match, tag, attrs, inner) => {
    const text = inner.replace(/&lt;[^&gt;]+&gt;/g, "");
    const id = text
      .toLowerCase()
      .replace(/\\s+/g, "-")
      .replace(/[^\\w\\-ぁ-んァ-ン一-龥]/g, "");

    return \`&lt;\${tag} id="\${id}"\${attrs}&gt;\${inner}&lt;/\${tag}&gt;\`;
  }
);</code></pre>
    <p>
      ここのロジックを変えるときは <code>extractHeadings</code> 側も同時に変える必要があります。将来的にはID生成を共通関数に切り出しておくと安全です。
    </p>

    <h2>IntersectionObserverでスクロール連動ハイライト</h2>
    <p>
      スクロールに合わせてアクティブな見出しをハイライトする処理です。ここが一番の見どころ。
    </p>
    <p>
      使うのは <strong>IntersectionObserver</strong> というブラウザAPIです。「ある要素が画面に入ったか出たか」を非同期で監視できます。昔はスクロールイベントで <code>getBoundingClientRect()</code> を毎フレーム呼んでいましたが、それだと重い。IntersectionObserverはブラウザが裏で計算してくれるのでメインスレッドをブロックしません。
    </p>
    <pre><code>"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TocItem } from "@/lib/toc";

type Props = {
  items: TocItem[];
  onItemClick?: () => void;
};

export default function TableOfContents({ items, onItemClick }: Props) {
  const [activeId, setActiveId] = useState&lt;string | null&gt;(null);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -80% 0px",
        threshold: 0.2,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, [items]);

  if (!items.length) return null;

  // ...JSX省略
}</code></pre>
    <p>
      <code>rootMargin: "0px 0px -80% 0px"</code> が地味に重要です。「判定エリアを画面上部20%に絞る」という設定です。
    </p>
    <p>
      デフォルト（画面全体）のままだと複数の見出しが同時に「表示中」と判定されてハイライトがバタバタします。<code>-80%</code> を指定することで、今まさに画面上部に差し掛かった見出し1つだけが反応するようになります。
    </p>
    <p>
      クリーンアップの <code>observer.unobserve</code> も忘れずに。アンマウント時に解除しないと監視だけが残り続けます。
    </p>

    <h2>クリックでスムーズスクロール</h2>
    <p>
      目次リンクをクリックしたとき、見出しまでなめらかにスクロールする処理です。
    </p>
    <pre><code>const scrollToHeading = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;

  const isMobile = window.innerWidth &lt; 768;
  const offset = isMobile ? 70 : 20;

  const position =
    el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top: position, behavior: "smooth" });
};</code></pre>
    <p>
      <code>href="#id"</code> だけでもジャンプはできますが、固定ヘッダーがあるとそのままでは見出しがヘッダーの下に潜ります。
    </p>
    <p>
      <code>getBoundingClientRect().top</code> は画面上端からの相対距離なので、<code>window.scrollY</code> を足してページ先頭からの絶対位置に変換しています。そこから <code>offset</code> 分だけ引いた位置にスクロールすることで、見出しがきれいに見える位置に止まります。スマホはヘッダーが少し大きいので <code>offset</code> を分けています。
    </p>

    <h2>サイドバーに組み込む</h2>
    <p>
      <code>TableOfContents</code> をサイドバーに置いて、スクロールしても追従するようにします。
    </p>
    <pre><code>{toc && toc.length &gt; 0 && (
  &lt;div className="hidden md:block md:sticky md:top-10"&gt;
    &lt;TableOfContents items={toc} /&gt;
  &lt;/div&gt;
)}</code></pre>
    <p>
      <code>hidden md:block</code> でPC表示のみ、<code>md:sticky md:top-10</code> でスクロールに追従。スマホ向けは後編で別コンポーネントとして作ります。
    </p>

    <h2>まとめ</h2>
    <ul>
      <li>見出しの抽出は正規表現で十分。日本語対応の文字クラスを忘れずに</li>
      <li>IDの生成ロジックは抽出側と注入側で揃える</li>
      <li>IntersectionObserverのハイライトは <code>rootMargin</code> の調整がキモ</li>
      <li>スムーズスクロールは固定ヘッダーのオフセット処理が必要</li>
    </ul>
    <p>
      後編ではスマホ用の固定バー＋ポップアップ（<code>MobileTocBar</code>）を実装します。ヘッダーが消えたタイミングで自動的にfixedに切り替わる仕組みが面白いので、続けて読んでみてください。
    </p>
  `,
};