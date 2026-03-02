import { Article } from "../index";

export const whatIsTypescript: Article = {
  slug: "what-is-typescript",
  title: "TypeScriptとは？JavaScriptとの違いについて",
  description:
    "TypeScriptとは何か？なぜ必要なのか？JavaScriptとの違い、型の意味、現場で使われる理由まで初心者向けに本質から解説します。",
  publishedAt: "2026.03.02",
  tags: [
    { name: "TypeScript", slug: "typescript" },
    { name: "JavaScript", slug: "javascript" },
  ],
  content: `
    <h2>TypeScriptとは？まず結論から</h2>
    <p>
      TypeScriptは、JavaScriptに「型（Type）」という仕組みを追加した言語です。<br />
      そして最終的にはJavaScriptに変換（コンパイル）されて実行されます。
    </p>
    <p>
      つまり、<strong>実行前にバグを検知できるように強化されたJavaScript</strong>と考えると分かりやすいです。
    </p>

    <h2>なぜTypeScriptが必要なのか？</h2>
    <p>
      JavaScriptは柔軟な言語です。
      しかしその「柔軟さ」は、大規模開発では弱点になります。
    </p>
    <p>
      例えば次のコードを見てください。
    </p>

    <pre><code class="language-js">
let price = 100;
price = "100円";
    </code></pre>

    <p>
      JavaScriptではエラーになりません。<br />
      しかしこの変数を計算に使った瞬間、アプリは壊れます。
    </p>
    <p>
      小さな個人開発なら問題にならなくても、
      チーム開発・長期運用では致命的になります。
    </p>

    <h2>「型」とは何か？本質を理解する</h2>
    <p>
      型とは、「このデータは何者なのか」を明確にするラベルです。
    </p>

    <pre><code class="language-ts">
let price: number = 100;
    </code></pre>

    <p>
      ここではpriceは「数値」であると宣言しています。<br />
      そのため、次のような代入はエラーになります。
    </p>

    <pre><code class="language-ts">
price = "100円"; // エラー
    </code></pre>

    <p>
      重要なのは、<strong>実行する前にエラーが分かる</strong>という点です。
      これがTypeScript最大の価値です。
    </p>

    <h2>JavaScriptとの違い</h2>
    <p>
      違いは「動くかどうか」ではありません。
      違いは「安全に動かせるかどうか」です。
    </p>
    <p>
      JavaScriptは実行してみるまで分かりません。
      TypeScriptは書いた瞬間に分かります。
    </p>

    <h3>実務でよくあるバグの例</h3>

    <pre><code class="language-ts">
function calculateTotal(price: number, quantity: number) {
  return price * quantity;
}
    </code></pre>

    <p>
      ここに誤って文字列が渡された場合、
      JavaScriptでは実行時エラーになります。
    </p>
    <p>
      しかしTypeScriptなら、呼び出し時点でエラーになります。
      バグは「後から直すもの」ではなく、「最初から防ぐもの」に変わります。
    </p>

    <h3>まず覚える基本の型</h3>

    <pre><code class="language-ts">
string   // 文字列
number   // 数値
boolean  // 真偽値
    </code></pre>

    <p>
      次に配列とオブジェクトです。
    </p>

    <pre><code class="language-ts">
let users: string[] = ["Taro", "Hanako"];

let user: { name: string; age: number } = {
  name: "Taro",
  age: 20
};
    </code></pre>

    <p>
      型を書くことで、「どんなデータ構造なのか」が一目で分かります。
    </p>

    <h2>なぜ現場でTypeScriptが選ばれるのか</h2>
    <ul>
      <li>バグを未然に防げる</li>
      <li>エディタ補完が強力になる</li>
      <li>チームでの仕様共有が明確になる</li>
      <li>リファクタリングが安全にできる</li>
    </ul>

    <p>
      特に大規模プロジェクトでは、
      「あとから仕様変更しても壊れにくい」という点が重要です。
    </p>

    <h2>一歩踏み込む：型推論という仕組み</h2>

    <pre><code class="language-ts">
let count = 10;
    </code></pre>

    <p>
      実はこの時点で、TypeScriptはcountをnumberだと自動判断しています。
      これを「型推論」と呼びます。
    </p>
    <p>
      つまり、すべてを書かなくてもTypeScriptは賢く判断しています。
    </p>

    <h2>まとめ</h2>
    <p>
      TypeScriptは「型を書く言語」ではありません。
      正しくは、「安全にコードを書くための仕組み」です。
    </p>
    <p>
      個人開発では不要に思えるかもしれません。
      しかし規模が大きくなるほど、その価値は圧倒的になります。
    </p>
    <p>
      まずは変数と関数に型をつけるところから始めてみてください。
      そこから理解は一気に深まります。
    </p>
  `,
};