import { Article } from "../index";

export const buttonDesignBasics: Article = {
  slug: "button-design-basics",
  title: "ボタンデザインの基本 — 色・余白・状態設計の整理",
  description:
    "ボタンはUIの中でもっとも行動に直結するパーツです。押せると分かるか、優先度は伝わるか、状態設計はできているか。設計の基本を、実際に触れるボタンの例つきで解説します。",
  publishedAt: "2026.02.27",
  updatedAt: "2026.06.21",
  updatedAtTimestamp: 1781827200000,
  image: "/eyecatches/button-design-basics.png",
  tags: [
    { name: "UI", slug: "ui" },
    { name: "CSS", slug: "css" },
  ],
  content: `
<p>
  ボタンはUIの中でも、ユーザーの行動に一番直接つながるパーツです。<br />
  「クリックしてもらえるかどうか」を決める要素がここに凝縮されています。
</p>
<p>
  どれだけページのビジュアルが整っていても、ボタンが押しにくければ体験は一気に悪くなります。<br />
  逆に、ボタン設計だけしっかりしていると「なんか使いやすい」という印象を与えやすくなります。<br />
  小さなパーツですが、UIの完成度を左右する存在です。
</p>

<style>
.bdb-demo {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
  margin: 20px 0;
  padding: 20px;
  background: #f9fafb;
  border-radius: 10px;
}
.bdb-demo-caption {
  width: 100%;
  font-size: 13px;
  color: #6b7280;
  margin-top: -4px;
}
.bdb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease, background-color 0.15s ease;
}
.bdb-btn--primary {
  background: #2563eb;
  color: #fff;
}
.bdb-btn--primary:hover {
  opacity: 0.85;
}
.bdb-btn--primary:active {
  transform: scale(0.97);
}
.bdb-btn--secondary {
  background: transparent;
  color: #2563eb;
  border: 1.5px solid #2563eb;
}
.bdb-btn--secondary:hover {
  background: rgba(37, 99, 235, 0.08);
}
.bdb-btn--tertiary {
  background: transparent;
  color: #2563eb;
  padding: 0 8px;
  min-height: auto;
  font-weight: normal;
  text-decoration: underline;
}
.bdb-btn--tertiary:hover {
  opacity: 0.7;
}
.bdb-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
.bdb-btn--small {
  min-height: 26px;
  padding: 0 10px;
  font-size: 12px;
}
.bdb-link {
  color: #2563eb;
  text-decoration: underline;
  font-size: 14px;
}
</style>

<h2>まず「押せると分かること」が大前提</h2>
<p>
  ボタン設計でまずやるべきことは、見た目を整えることより<strong>「これは押せる」と伝えること</strong>です。<br />
  ユーザーは画面を一瞬で判断します。どれが操作できる要素か迷わせた時点で、体験として負けです。
</p>
<p>
  下の2つを見比べてみてください。
</p>
<div class="bdb-demo">
  <a class="bdb-link" href="#">テキストリンク</a>
  <button class="bdb-btn bdb-btn--primary">ボタン</button>
</div>
<p>
  どちらもクリックすれば何かが起きそうですが、ボタンの方は「指で押す対象」として認識しやすく、リンクの方は「読む対象の中にある通り道」として認識しやすいはずです。これは単なる見た目の好みではなく、<strong>アフォーダンス</strong>という考え方に基づいています。立体的に見える・縁取りがある・背景色で囲まれているといった見た目は、現実の物理的なボタンやスイッチを長年押してきた経験と結びついていて、「これは押せるものだ」という判断を一瞬で引き出します。逆に背景もなくただ文字が浮いているだけだと、その連想が働かず、押せるかどうかの判断に余計な時間がかかってしまうわけです。
</p>
<p>
  押せる要素として認識されやすい見た目には、共通した特徴があります。
</p>
<ul>
  <li>背景色がある（テキストだけのリンクと明確に区別されている）</li>
  <li>角丸・枠線・影などで「立体的なパーツ」に見える</li>
  <li>テキストの周囲に十分な余白がある</li>
</ul>
<p>
  おしゃれさより先に、「クリックできますよ」という視覚的なシグナルを整えることが最初のステップです。
</p>

<h2>優先度を設計する — 全部同じ強さにしない</h2>
<p>
  画面上にボタンが複数ある場合、すべてを同じ強さにすると「どれを押せばいいか」が伝わりません。<br />
  ユーザーに一番押してほしいボタンを主役にして、他はトーンを落とす設計が基本です。
</p>
<p>
  よく使われる3段階の優先度設計はこのような構成です。
</p>
<ul>
  <li><strong>Primary</strong> — 最重要アクション。塗りつぶしで強調する</li>
  <li><strong>Secondary</strong> — 補助的なアクション。枠線のみ、または薄い背景色</li>
  <li><strong>Tertiary</strong> — 優先度が低いアクション。テキストリンクに近い形</li>
</ul>
<p>
  たとえば「保存」と「キャンセル」が並ぶとき、「保存」だけ Primary にして「キャンセル」は Tertiary にすると、こうなります。
</p>
<div class="bdb-demo">
  <button class="bdb-btn bdb-btn--primary">保存する</button>
  <button class="bdb-btn bdb-btn--tertiary">キャンセル</button>
</div>
<p>
  一方、両方を同じ強さにしてしまうと、こうなります。
</p>
<div class="bdb-demo">
  <button class="bdb-btn bdb-btn--secondary">保存する</button>
  <button class="bdb-btn bdb-btn--secondary">キャンセル</button>
</div>
<div class="bdb-demo-caption">同じ強さのボタンが並ぶと、視線がどちらにも吸い寄せられず、一瞬「どっちだっけ」と文字を読みにいく必要が出てきます</div>
<p>
  人の目は、コントラストが強い場所に先に引きつけられます。Primaryを1つだけ目立たせておくと、文字を読む前に視線が自然とそこへ向かい、迷う前に判断できます。逆に強さが同じボタンが並ぶと、視覚的な手がかりがなくなるので、ユーザーは一度文字を読んで意味を理解するという、ひと手間多い処理を強いられることになります。この差をつけるだけで、ユーザーの迷いが減ってクリック率が上がるのは、こうした視線の動き方に理由があります。
</p>

<h2>余白とサイズで押しやすさは変わる</h2>
<p>
  ボタンが小さすぎると、特にスマートフォンで押し間違いが起きやすくなります。<br />
  <strong>最低でも高さ 44px</strong> を目安にするのがよく知られた基準で、Apple の Human Interface Guidelines でも推奨されているサイズです。
</p>
<div class="bdb-demo">
  <button class="bdb-btn bdb-btn--primary bdb-btn--small">小さいボタン</button>
  <button class="bdb-btn bdb-btn--primary">適切なサイズのボタン</button>
</div>
<div class="bdb-demo-caption">スマートフォンで触れてみると、左のボタンは指の腹で隠れてしまい、隣のボタンを誤って押しやすくなります</div>
<p>
  この44pxという数字には根拠があります。Fitts's Lawという、対象物に到達するまでの時間は「対象の大きさ」と「対象までの距離」で決まる、という人間の動作に関する法則があり、対象が小さいほど正確に止めるのが難しくなります。人の指先が画面に触れる面積はおおよそ8〜10mm程度（画面の解像度にしておよそ40px前後）なので、ボタンがそれより小さいと、狙った場所からズレて隣の要素を押してしまう確率が上がるわけです。44pxという基準は、この指先のサイズに対して十分な余裕を持たせた数値ということになります。
</p>
<p>
  また、内側の余白（padding）をしっかり取ることで、テキストが窮屈に見えなくなります。<br />
  余白が不足していると、文字がボタンの端ギリギリに見えてしまい、安っぽい印象になりがちです。
</p>

<pre><code class="language-css">.button {
  min-height: 44px;
  padding: 0 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
}
</code></pre>

<p>
  <code>padding</code> の左右は最低でも 16px 以上、できれば 24px 程度あると余裕が生まれます。<br />
  余白の単位は8の倍数で揃えると、ボタンだけでなく画面全体の余白にも統一感が出てきます。この考え方は別の記事で詳しく解説しているので、気になる方はそちらも見てみてください。
</p>
<a class="article-related-card" href="#">
  <div class="article-related-card-label">関連記事</div>
  <div class="article-related-card-title">余白を8の倍数で揃えるルールについて</div>
</a>

<h2>状態設計を忘れずに — hover・active・disabled</h2>
<p>
  ボタンは「通常状態だけ作って終わり」ではありません。<br />
  インタラクションの気持ちよさは、状態の変化が丁寧かどうかで決まります。
</p>
<p>
  実際に下のボタンにマウスを乗せたり、押してみてください。
</p>
<div class="bdb-demo">
  <button class="bdb-btn bdb-btn--primary">ホバー・クリックしてみてください</button>
  <button class="bdb-btn bdb-btn--primary" disabled>無効化されたボタン</button>
</div>
<p>
  最低限用意しておきたい3つの状態です。
</p>
<ul>
  <li><strong>hover</strong> — マウスが乗ったとき。「反応してる」とユーザーが気づける</li>
  <li><strong>active</strong> — 押した瞬間。「押せた」というフィードバックになる</li>
  <li><strong>disabled</strong> — 操作できない状態。「なぜ押せないか」が伝わることが理想</li>
</ul>
<p>
  なぜこの状態変化が必要かというと、人は何かを操作したとき、結果がすぐに返ってこないと「本当に反応しているのか」が不安になるからです。エレベーターのボタンを押したときにランプが点かないと、もう一度押してしまうのと同じ理屈で、画面上でも見た目の変化というフィードバックがないと、ユーザーは同じボタンを何度も押してしまったり、サイトが固まったと誤解したりします。
</p>

<pre><code class="language-css">.button:hover {
  opacity: 0.85;
  transition: opacity 0.15s ease;
}

.button:active {
  transform: scale(0.97);
  transition: transform 0.1s ease;
}

.button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
</code></pre>

<p>
  <code>transition</code> を加えることで、変化がなめらかになります。<br />
  数値は小さめ（0.1〜0.2秒程度）にしておくと、もたつかずに気持ちいい反応になります。
</p>
<p>
  disabled に <code>pointer-events: none</code> を加えると、無効状態のボタンに誤ってホバー効果が出るのを防げます。<br />
  細かい点ですが、品質感に差が出るポイントです。
</p>

<h2>まとめ</h2>
<p>
  ボタン設計で意識したいポイントをまとめます。
</p>
<ul>
  <li><strong>押せると分かる</strong> — 背景色・角丸・余白でボタンらしく見せる</li>
  <li><strong>優先度をつける</strong> — Primary / Secondary / Tertiary で主役を決める</li>
  <li><strong>サイズと余白</strong> — 最低44px・padding は左右24px目安</li>
  <li><strong>状態設計</strong> — hover・active・disabled を必ずセットで用意する</li>
</ul>
<p>
  「とりあえず置く」から「どう押してもらうか」を考えて設計するようになると、UIの完成度がひとつ上がります。<br />
  次にボタンを作るときは、5つのポイントをひとつずつ確認してみてください。
</p>
  `,
};