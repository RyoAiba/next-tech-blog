import { Article } from "../index";

export const reactTocComponentMobile: Article = {
  slug: "react-toc-component-mobile",
  title: "Reactで目次コンポーネントを自作する【後編】スマホ用固定バー＋ポップアップを実装する",
  description:
    "前編に続き、スマホ向けの目次バーを実装します。IntersectionObserverでヘッダーの消滅を検知してfixedに切り替え、ガクつきをプレースホルダーで防ぐ実装パターンをUsagi Blogのコードをもとに解説します。",
  publishedAt: "2026.03.17",
  updatedAt: undefined,
  updatedAtTimestamp: undefined,
  tags: [
    { name: "React", slug: "react" },
    { name: "Next.js", slug: "nextjs" },
    { name: "UI", slug: "ui" },
  ],
  content: `
    <h2>前編のおさらい</h2>
    <p>
      前編では見出し抽出・ID注入・IntersectionObserverによるスクロール連動ハイライト・スムーズスクロールまで実装しました。
    </p>
    <p>
      ただ前編はPC（サイドバー）向けのみです。スマホは横幅がないのでサイドバーが出せません。後編ではスマホ専用の目次バーコンポーネント <code>MobileTocBar</code> を作ります。
    </p>
    <p>完成形のイメージはこうです。</p>
    <ul>
      <li>ヘッダーがスクロールで画面外に消えたら、上部に目次バーが固定表示される</li>
      <li>「目次」ボタンをタップするとポップアップで目次が展開する</li>
      <li>目次アイテムをタップするとスクロールし、ポップアップが閉じる</li>
      <li>ポップアップの背景タップでも閉じられる</li>
    </ul>

    <h2>MobileTocBarの全体像</h2>
    <p>
      まず完成コードを見てから各部分を解説します。
    </p>
    <pre><code>"use client";

import { useEffect, useRef, useState } from "react";
import { TocItem } from "@/lib/toc";
import TableOfContents from "./TableOfContents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

type Props = {
  items: TocItem[];
};

export default function MobileTocBar({ items }: Props) {
  const [isFixed, setIsFixed] = useState(false);
  const [open, setOpen] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const barRef = useRef&lt;HTMLDivElement | null&gt;(null);
  const headerRef = useRef&lt;HTMLElement | null&gt;(null);

  useEffect(() => {
    headerRef.current = document.querySelector("header");
    if (!headerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFixed(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (barRef.current) {
      setBarHeight(barRef.current.offsetHeight);
    }
  }, [isFixed]);

  return (
    &lt;div className="md:hidden relative z-40"&gt;
      {isFixed && &lt;div style={{ height: barHeight }} /&gt;}

      &lt;div
        ref={barRef}
        className={\`
          w-full bg-white border-b border-zinc-200
          px-4 py-3 flex justify-end items-center
          \${isFixed ? "fixed top-0 left-0 right-0 shadow-md" : ""}
        \`}
      &gt;
        &lt;button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-sm text-zinc-500"
        &gt;
          目次
          &lt;FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className="text-xs" /&gt;
        &lt;/button&gt;
      &lt;/div&gt;

      {open && (
        &lt;&gt;
          &lt;div className="fixed inset-0 z-50" onClick={() => setOpen(false)} /&gt;
          &lt;div
            className={\`z-50 \${isFixed ? "fixed" : "absolute"}\`}
            style={{
              top: barHeight - 8,
              left: "52%",
              transform: "translateX(-50%)",
              width: "90vw",
            }}
          &gt;
            &lt;div className="px-5 py-5 max-h-[60vh] overflow-y-auto card-base"&gt;
              &lt;TableOfContents items={items} onItemClick={() => setOpen(false)} /&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/&gt;
      )}
    &lt;/div&gt;
  );
}</code></pre>
    <p>
      状態は3つです。<code>isFixed</code>・<code>open</code>・<code>barHeight</code>。それぞれ順番に見ていきます。
    </p>

    <h2>ヘッダーが消えたらfixedに切り替える</h2>
    <p>
      記事を開いてすぐ目次バーが出ていたら邪魔です。ヘッダーがスクロールで画面外に消えたタイミングでfixedに切り替えています。
    </p>
    <p>
      前編でも使ったIntersectionObserverを、今度はヘッダー要素に使います。
    </p>
    <pre><code>useEffect(() => {
  headerRef.current = document.querySelector("header");
  if (!headerRef.current) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      setIsFixed(!entry.isIntersecting);
    },
    { threshold: 0 }
  );

  observer.observe(headerRef.current);
  return () => observer.disconnect();
}, []);</code></pre>
    <p>
      <code>entry.isIntersecting</code> がヘッダーの「画面内に見えているか」を表します。ヘッダーが消えた（<code>false</code>）タイミングで <code>isFixed</code> を <code>true</code> にする、それだけです。
    </p>
    <p>
      スクロールイベントで実装すると毎フレーム計算が走りますが、IntersectionObserverは変化があったときだけコールバックが呼ばれます。
    </p>

    <h2>プレースホルダーでガクつきを防ぐ</h2>
    <p>
      <code>position: fixed</code> にすると要素がレイアウトのフローから外れます。バーが占めていた高さ分、コンテンツが突然上にズレます。
    </p>
    <pre><code>useEffect(() => {
  if (barRef.current) {
    setBarHeight(barRef.current.offsetHeight);
  }
}, [isFixed]);

{isFixed && &lt;div style={{ height: barHeight }} /&gt;}</code></pre>
    <p>
      <code>isFixed</code> が切り替わるたびにバーの高さ（<code>offsetHeight</code>）を取得して、同じ高さの空divをその場に置いておきます。これがないと記事を読み始めた瞬間にコンテンツがガクッと動きます。地味ですが重要な処理です。
    </p>

    <h2>ポップアップの表示ロジック</h2>
    <p>
      「目次」ボタンをタップすると <code>open</code> が切り替わってポップアップが表示されます。2点だけ工夫しているところがあります。
    </p>
    <h3>背景オーバーレイで「タップして閉じる」</h3>
    <p>
      <code>fixed inset-0</code>（画面全体を覆う透明なdiv）をポップアップの下に敷いて、タップで閉じるようにしています。モーダルやドロワーでよく使われるパターンです。
    </p>
    <pre><code>&lt;div className="fixed inset-0 z-50" onClick={() => setOpen(false)} /&gt;</code></pre>
    <h3>fixedとabsoluteを切り替える</h3>
    <p>
      バーがfixedのときはポップアップもfixedにしないと、スクロールに追随して表示がおかしくなります。バーが通常フローにいるときはabsoluteでバーの直下に置く。<code>isFixed</code> によって切り替えています。<code>top: barHeight - 8</code> でバーのすぐ下にぴったり配置しています。
    </p>

    <h2>onItemClickでPC・スマホの挙動を切り替える</h2>
    <p>
      前編で実装した <code>TableOfContents</code> には <code>onItemClick</code> という省略可能なpropsがありました。
    </p>
    <pre><code>type Props = {
  items: TocItem[];
  onItemClick?: () => void;
};</code></pre>
    <p>
      <code>MobileTocBar</code> では <code>onItemClick={() =&gt; setOpen(false)}</code> を渡して、目次タップ時にポップアップを閉じています。PC版サイドバーでは渡さないので、クリックしても何も起きません。
    </p>
    <p>
      同じコンポーネントをPC・スマホで使い回しながら、挙動だけ外から差し込める設計です。こういうpropsの使い方、覚えておくと応用が効きます。
    </p>

    <h2>記事ページへの組み込み</h2>
    <pre><code>return (
  &lt;div&gt;
    &lt;MobileTocBar items={toc} /&gt;
    &lt;article&gt;
      &lt;ArticleContent content={contentWithIds} /&gt;
      &lt;Sidebar toc={toc} /&gt;
    &lt;/article&gt;
  &lt;/div&gt;
);</code></pre>
    <p>
      <code>MobileTocBar</code> は内部で <code>md:hidden</code> なのでPCでは非表示、<code>Sidebar</code> 内の <code>TableOfContents</code> は <code>hidden md:block</code> なのでスマホでは非表示。お互い干渉しない設計です。
    </p>

    <h2>まとめ</h2>
    <h3>前編（PC向け）</h3>
    <ul>
      <li>正規表現でHTMLから見出しを抽出（日本語対応）</li>
      <li>同じロジックで見出し要素にIDを注入</li>
      <li>IntersectionObserverでスクロール連動ハイライト（<code>rootMargin</code> がキモ）</li>
      <li>オフセットを考慮したスムーズスクロール</li>
    </ul>
    <h3>後編（スマホ向け）</h3>
    <ul>
      <li>IntersectionObserverでヘッダーの消滅を検知してfixedに切り替え</li>
      <li>プレースホルダーでガクつきを防止</li>
      <li>背景オーバーレイで「タップして閉じる」</li>
      <li><code>onItemClick</code> でPC・スマホの挙動を使い分け</li>
    </ul>
    <p>
      自分で書いた分だけ「なぜこう動くのか」がわかるので、変な挙動が起きたときも落ち着いて対処できます。ライブラリに頼る前に一度自作してみるのも悪くないです。
    </p>
  `,
};