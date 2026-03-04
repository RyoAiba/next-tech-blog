import { Article } from "../index";

export const javascriptScrollChangeCss: Article = {
  slug: "javascript-scroll-change-css",
  title: "scrollイベントとIntersectionObserver、結局どっちを使えばいい？",
  description:
    "scrollイベントとIntersectionObserverを使ったスクロール連動UIの実装を解説。パフォーマンスを意識したclass切り替えのコツも紹介します。",
  publishedAt: "2026.02.23",
  tags: [
    { name: "JavaScript", slug: "javascript" },
    { name: "CSS", slug: "css" },
    { name: "パフォーマンス", slug: "performance" },
  ],
  content: `
<p>
  ヘッダーがスクロールで色変わったり、セクションに入ったら背景が切り替わったり。<br />
  よく見るUIですよね。「なんとなく動く」実装から「なぜそう書くか分かる」実装を目指して整理します。
</p>

<h2>scrollイベントを使う基本実装</h2>
<p>
  まずは基本から。<code>window</code> の <code>scroll</code> イベントを使ってスクロール量を取得する方法です。<br />
  <code>scroll</code> イベントは<strong>スクロールするたびに発火するイベント</strong>で、
  現在のスクロール位置は <code>window.scrollY</code> で取得できます。
</p>

<pre><code>const header = document.getElementById("header");

window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY;

  if (scrollPosition > 500) {
    header.style.backgroundColor = "red";
  } else if (scrollPosition > 200) {
    header.style.backgroundColor = "green";
  } else {
    header.style.backgroundColor = "blue";
  }
});
</code></pre>

<p>
  数値で条件分岐するだけなので、直感的に書けます。<br />
  ただしこの書き方は <strong>JavaScriptが見た目を直接管理している</strong> 状態です。
  デザイン変更のたびにJSを触ることになるので、ちょっと扱いにくい。
</p>

<h2>classを切り替える実装（これが基本）</h2>
<p>
  実務でよく使われるのは、styleを直接触るのではなく <strong>classを切り替える方式</strong> です。<br />
  なぜかというと、<strong>「見た目の管理はCSS」「状態の管理はJavaScript」</strong> と責務を分離できるからです。
</p>
<p>
  これは前回の記事で触れた「責務の分離」と同じ考え方ですね。
</p>

<pre><code>window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY;

  header.classList.remove("scrolled-200", "scrolled-500");

  if (scrollPosition > 500) {
    header.classList.add("scrolled-500");
  } else if (scrollPosition > 200) {
    header.classList.add("scrolled-200");
  }
});
</code></pre>

<h3>対応するCSS</h3>

<pre><code>#header {
  transition: background-color 0.3s;
}

.scrolled-200 {
  background-color: green;
}

.scrolled-500 {
  background-color: red;
}
</code></pre>

<p>
  この方法ならデザイン変更があっても、CSS側だけ修正すればOKです。<br />
  <code>transition</code> を使えばアニメーションも一行で付けられるのも嬉しいポイント。<br />
  まずはこの「class切り替え方式」を基本として覚えておきましょう。
</p>

<h2>パフォーマンスを意識した実装</h2>
<p>
  実は <code>scroll</code> イベントには注意点があります。<strong>発火頻度がとても高い</strong>ことです。<br />
  スクロール中は1秒間に数十〜100回以上イベントが飛んでくることもあり、
  重い処理を書くとカクつきの原因になります。
</p>
<p>
  そこで使えるのが <code>requestAnimationFrame</code> です。<br />
  ブラウザの<strong>描画タイミング（約60fps）に合わせて処理を間引く</strong>テクニックで、
  無駄な再計算を防げます。
</p>

<pre><code>let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateHeader();
      ticking = false;
    });
    ticking = true;
  }
});

function updateHeader() {
  const scrollPosition = window.scrollY;
  // ここにクラス切り替えの処理を書く
}
</code></pre>

<p>
  <code>ticking</code> フラグがポイントです。<br />
  「描画タイミングが来るまで次のスクロールイベントを無視する」という仕組みで、
  処理回数を描画に必要な分だけに絞っています。<br />
  特にモバイル環境では効果が出やすいので、ぜひ覚えておきたいパターンです。
</p>

<h2>IntersectionObserverを使う方法（モダン実装）</h2>
<p>
  <code>IntersectionObserver</code> は、<strong>ある要素が画面（viewport）に入ったかどうかを監視できるAPI</strong>です。<br />
  <code>scroll</code> イベントを一切書かずに、要素の表示状態だけで処理を走らせられます。
</p>
<p>
  なぜこれが便利かというと、<strong>ブラウザ側が最適化された形で監視してくれる</strong>からです。
  自前でスクロール位置を計算するよりも効率的に動作します。
</p>

<pre><code>const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      document.body.style.backgroundColor =
        entry.target.dataset.color;
    }
  });
});

sections.forEach((section) => observer.observe(section));
</code></pre>

<p>
  HTML側では <code>data-color</code> 属性で色を持たせておくイメージです。
</p>

<pre><code>&lt;section data-color="#f0f4ff"&gt;セクション1&lt;/section&gt;
&lt;section data-color="#fff4e6"&gt;セクション2&lt;/section&gt;
</code></pre>

<p>
  セクション単位で背景色を変えたいケースとの相性が抜群です。<br />
  「スクロール量」ではなく「<strong>要素の可視状態</strong>」で制御したいなら <code>IntersectionObserver</code> を選びましょう。
</p>

<h3>threshold オプションで検知タイミングを調整する</h3>
<p>
  少し応用になりますが、<code>IntersectionObserver</code> には <code>threshold</code> というオプションがあります。<br />
  「要素が何割見えたら発火するか」を <code>0</code>〜<code>1</code> の数値で指定できます。
</p>

<pre><code>const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.3, // 要素が30%見えたら発火
  }
);
</code></pre>

<p>
  たとえば <code>threshold: 0</code> なら「少しでも見えたら」、<code>threshold: 1</code> なら「全部見えたら」発火します。<br />
  フェードインアニメーションの発火タイミングを調整するときなどに重宝するオプションです。
</p>

<h2>まとめ：どれを使えばいい？</h2>
<p>
  3つの方法を整理するとこうなります。
</p>
<ul>
  <li><strong>scrollイベント + class切り替え</strong> — 基本。スクロール量で細かく制御したいときに</li>
  <li><strong>requestAnimationFrame と組み合わせる</strong> — パフォーマンスが気になるなら必須</li>
  <li><strong>IntersectionObserver</strong> — 要素の表示状態を監視したいときに。コードもスッキリする</li>
</ul>
<p>
  迷ったら「スクロール量で制御したい → scrollイベント」「要素が見えたら何かしたい → IntersectionObserver」で選ぶとシンプルです。
</p>
  `,
};