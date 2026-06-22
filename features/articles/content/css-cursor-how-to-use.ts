import { Article } from "../index";

export const cssCursorHowToUse: Article = {
  slug: "css-cursor-how-to-use",
  title: "【CSS】cursorの使い方とカーソルを変える方法、地味だけど超大事",
  description:
    "CSSのcursorプロパティの基本的な使い方を解説します。pointerやtextなどよく使う値を中心に、ユーザビリティを高める考え方もあわせて紹介します。",
  publishedAt: "2026.02.27",
  updatedAt: "2026.06.22",
  updatedAtTimestamp: 1782086400000,
  image: "/eyecatches/css-cursor-how-to-use.png",
  tags: [
    { name: "CSS", slug: "css" },
    { name: "UI", slug: "ui" },
  ],
  content: `
    <style>
.ccu-demo {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  padding: 24px;
  background: #f9fafb;
  border-radius: 10px;
  margin: 16px 0;
}
.ccu-demo-caption {
  font-size: 13px;
  color: #6b7280;
  margin: -8px 0 16px;
}
.ccu-fakebtn {
  display: inline-flex;
  align-items: center;
  background: #2563eb;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
}
.ccu-fakebtn--no-cursor {
  cursor: auto;
}
.ccu-fakebtn--pointer {
  cursor: pointer;
}
.ccu-link-plain {
  color: #2563eb;
  text-decoration: underline;
  font-size: 14px;
}
.ccu-div-plain {
  font-size: 14px;
  color: #2563eb;
  text-decoration: underline;
}
.ccu-swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
  width: 100%;
}
.ccu-swatch {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px 8px;
  text-align: center;
  font-size: 12px;
  color: #374151;
}
.ccu-grab {
  display: inline-flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 13px;
  cursor: grab;
}
.ccu-grab:active {
  cursor: grabbing;
}
.ccu-disabled-a,
.ccu-disabled-b {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background: #2563eb;
  opacity: 0.5;
}
.ccu-disabled-a {
  pointer-events: none;
  cursor: not-allowed;
}
.ccu-disabled-b {
  cursor: not-allowed;
}
    </style>

    <p>
      下の2つのボタン、見た目は同じですが、マウスを乗せてみてください。
    </p>
    <div class="ccu-demo">
      <div class="ccu-fakebtn ccu-fakebtn--no-cursor">cursor未設定</div>
      <div class="ccu-fakebtn ccu-fakebtn--pointer">cursor: pointer</div>
    </div>
    <div class="ccu-demo-caption">右だけ「押せそう」な感触になるはずです</div>
    <p>
      見た目はまったく同じ青いボタンですが、片方は指先のアイコン（pointer）になり、もう片方は普通の矢印のままです。<code>cursor</code>はこの「マウスが乗ったときの形」を切り替えるCSSのプロパティで、地味ですが押せるかどうかの判断にかなり影響します。
    </p>

    <h2>cursorの基本的な使い方</h2>
    <p>
      使い方はシンプルです。カーソルを変更したい要素に対して<code>cursor: 値;</code>を指定します。
    </p>
    <pre><code>button {
  cursor: pointer;
}</code></pre>
    <p>
      <code>p</code>タグや<code>div</code>タグ、<code>label</code>タグなど、さまざまな要素に適用できます。
    </p>

    <h2>なぜaタグは何も書かなくてもpointerになるのか</h2>
    <p>
      ここで1つ確認しておきたいことがあります。下の2つも、どちらもCSSで<code>cursor</code>を指定していません。
    </p>
    <div class="ccu-demo">
      <a href="#" class="ccu-link-plain">aタグ（CSSなし）</a>
      <div class="ccu-div-plain">divタグ（CSSなし）</div>
    </div>
    <div class="ccu-demo-caption">aタグだけ、何も書いていないのにpointerになっているはずです</div>
    <p>
      <code>&lt;a href&gt;</code>タグは、ブラウザが標準で持っているスタイル（ユーザーエージェントスタイルシート）の中に、すでに<code>cursor: pointer</code>相当の指定が入っています。リンクは「押せるもの」だとブラウザ自身が知っているからです。
    </p>
    <p>
      一方<code>div</code>に<code>onClick</code>だけ付けてボタンのように使う場合、ブラウザからすると見た目はただの箱で、押せるかどうかの情報を何も持っていません。だから<code>cursor: pointer</code>を自分で指定しない限り、ずっと普通の矢印のままになります。「見た目だけボタン風にしたdivに、cursorを指定し忘れる」というありがちなミスは、ここが原因です。
    </p>

    <h2>よく使う値を実際に見てみる</h2>
    <p>
      実務でよく使う値は、そこまで多くありません。実際にマウスを乗せて確認してみてください。
    </p>
    <div class="ccu-demo">
      <div class="ccu-swatch-grid">
        <div class="ccu-swatch" style="cursor: pointer;">pointer</div>
        <div class="ccu-swatch" style="cursor: text;">text</div>
        <div class="ccu-swatch" style="cursor: not-allowed;">not-allowed</div>
        <div class="ccu-swatch" style="cursor: move;">move</div>
        <div class="ccu-swatch" style="cursor: wait;">wait</div>
        <div class="ccu-swatch" style="cursor: help;">help</div>
        <div class="ccu-swatch" style="cursor: crosshair;">crosshair</div>
        <div class="ccu-swatch" style="cursor: zoom-in;">zoom-in</div>
        <div class="ccu-swatch" style="cursor: ns-resize;">ns-resize</div>
        <div class="ccu-swatch" style="cursor: none;">none</div>
      </div>
    </div>
    <p>
      この中で圧倒的によく使うのは<strong>pointer</strong>です。クリックできる要素には、ほぼ必ずと言っていいほど使われます。<strong>text</strong>はテキストの選択範囲（inputではない、テキストとして選択できるdivなど）、<strong>not-allowed</strong>は無効化されたボタンに使う場面が多いです。move・wait・help・crosshair・zoom-inあたりは使う場面がかなり限られますが、知っておくと「ドラッグできそう」「処理中っぽい」という雰囲気を出したいときに選択肢になります。
    </p>

    <h2>応用: grabとgrabbingでドラッグ感を出す</h2>
    <p>
      ドラッグ操作ができる要素には、<code>grab</code>と<code>grabbing</code>を組み合わせるとそれらしい挙動になります。
    </p>
    <pre><code>.draggable {
  cursor: grab;
}

.draggable:active {
  cursor: grabbing;
}</code></pre>
    <div class="ccu-demo">
      <div class="ccu-grab">クリックしたままにしてみてください</div>
    </div>
    <div class="ccu-demo-caption">マウスを乗せるとgrab、クリックしている間だけgrabbingに変わります</div>
    <p>
      <code>:active</code>と組み合わせるだけなので、JavaScript不要でドラッグ中らしい見た目を作れます。実際にドラッグ機能を実装する際の補助表現としてよく使われます。
    </p>

    <h2>UI目線での注意点: pointer-eventsとの組み合わせ</h2>
    <p>
      無効化したボタンに<code>not-allowed</code>を指定するときに、ハマりやすい組み合わせがあります。下の2つは、どちらも無効化されたボタンに<code>cursor: not-allowed</code>を指定していますが、片方だけ<code>pointer-events: none</code>も一緒に付けています。
    </p>
    <div class="ccu-demo">
      <button class="ccu-disabled-a" disabled>pointer-events: none</button>
      <button class="ccu-disabled-b" disabled>cursor: not-allowed のみ</button>
    </div>
    <div class="ccu-demo-caption">左にマウスを乗せても何も変わらず、右だけnot-allowedが表示されます</div>
    <p>
      <code>pointer-events: none</code>は「この要素はマウス操作の対象外にする」という指定なので、ホバー自体が発生しなくなり、<code>cursor</code>の指定も一緒に無効化されてしまいます。無効化ボタンのクリックを防ぐ目的で<code>pointer-events: none</code>を使う実装はよく見かけますが、それを付けた瞬間に<code>cursor: not-allowed</code>が効かなくなる、という組み合わせの相性の悪さは覚えておく価値があります。クリックを防ぎたいだけなら、<code>disabled</code>属性やイベントハンドラ側で制御し、<code>cursor</code>はCSSだけで見た目を伝える、という役割分担にしておくのが安全です。
    </p>

    <h2>まとめ</h2>
    <p>
      cursorは見た目に直接影響しない分、後回しにされがちなプロパティです。ですが「押せると思ったのに何も起きない」という体験は、それだけでアプリへの信頼感を少し下げてしまいます。divをボタンとして使うときは、まずcursorを指定し忘れていないか、無効化ボタンではpointer-eventsとの組み合わせがおかしくなっていないか、この2点だけ確認してみてください。
    </p>
  `,
};