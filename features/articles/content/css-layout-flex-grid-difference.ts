import { Article } from "../index";

export const cssLayoutFlexGridDifference: Article = {
  slug: "css-layout-flex-grid-difference",
  title: "FlexboxとGridの違いを理解する：CSSレイアウト設計で迷わなくなる考え方",
  description:
    "FlexboxとGridの違いを仕組みから解説。なぜ使い分けが重要なのか、具体例とともに理解できるCSSレイアウト設計ガイド。",
  publishedAt: "2026.03.02",
  tags: [
    { name: "CSS", slug: "css" },
  ],
  content: `
    <h2>FlexboxとGrid、どちらを使うべきか迷う理由</h2>
    <p>
      CSSでレイアウトを組むとき、多くの人がまずFlexboxを使います。
      それ自体は間違いではありません。
      しかし、すべてをFlexで解決しようとすると、どこかで無理が出てきます。
    </p>
    <p>
      なぜならFlexboxとGridは、設計思想がそもそも違うからです。
      ここを理解しないまま使い分けようとすると、常に「なんとなく」の選択になります。
    </p>

    <h2>Flexboxは「流れ」を制御する仕組み</h2>
    <p>
      Flexboxは1次元レイアウトです。
      横方向、または縦方向のどちらか一方向の並びを制御します。
    </p>
    <pre><code class="language-css">
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
    </code></pre>
    <p>
      Flexが得意なのは、「ナビゲーションメニュー」や「ボタンの横並び」のように、
      一列に並べたい要素をきれいに整列させることです。
    </p>
    <p>
      ポイントは、<strong>子要素のサイズや並び順を柔軟に変えられる</strong>こと。
      画面幅に応じて自然に折り返したり、余白を自動調整したりできます。
    </p>
    <p>
      つまりFlexは「コンテンツの流れ」に強いレイアウト手法です。
    </p>

    <h2>Gridは「構造」を設計する仕組み</h2>
    <p>
      Gridは2次元レイアウトです。
      行と列を同時に定義し、ページ全体の構造を設計できます。
    </p>
    <pre><code class="language-css">
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
}
    </code></pre>
    <p>
      このように「どこに何を配置するか」を最初に決められるのがGridの特徴です。
    </p>
    <p>
      例えば、
      ヘッダー・サイドバー・メイン・フッターのような
      ページ全体の骨組みを作るとき、Gridは非常に分かりやすく書けます。
    </p>
    <p>
      つまりGridは「レイアウトの設計図」を作るための仕組みです。
    </p>

    <h2>なぜFlexだけでは限界がくるのか</h2>
    <p>
      例えば、カード一覧レイアウトを考えてみます。
    </p>
    <pre><code class="language-css">
.container {
  display: flex;
  flex-wrap: wrap;
}
.card {
  width: 300px;
}
    </code></pre>
    <p>
      一見問題なさそうですが、
      横幅が微妙に合わないと不自然な余白が生まれます。
    </p>
    <p>
      ここでGridを使うと、より自然に設計できます。
    </p>
    <pre><code class="language-css">
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
    </code></pre>
    <p>
      minmaxを使うことで、
      「最低250px、余ったら均等に広がる」という挙動になります。
    </p>
    <p>
      この柔軟さはGridならではです。
    </p>

    <h2>使い分けの考え方</h2>
    <p>
      判断基準はシンプルです。
    </p>
    <ul>
      <li>一方向の並びを整えたい → Flexbox</li>
      <li>ページやセクションの構造を設計したい → Grid</li>
    </ul>
    <p>
      レイアウトは「見た目」ではなく「構造」で考えると、
      自然に選択できるようになります。
    </p>

    <h2>レイアウト設計ができるようになると何が変わるか</h2>
    <p>
      CSSがうまく書けない原因の多くは、
      手段から考えていることにあります。
    </p>
    <p>
      「Flexでどう書こう？」ではなく、
      「このUIは流れか、構造か？」と考える。
      それだけで設計の精度は一段上がります。
    </p>
    <p>
      FlexとGridは競合ではありません。
      役割が違うだけです。
      それぞれの思想を理解することが、安定したレイアウト設計につながります。
    </p>
  `,
};