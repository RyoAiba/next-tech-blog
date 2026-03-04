import { Article } from "../index";

export const javascriptAjax: Article = {
  slug: "javascript-ajax",
  title: "JavaScriptで非同期通信をちゃんと理解する【Ajax入門】",
  description:
    "Ajaxとは何か、なぜ必要なのかを整理しつつ、XMLHttpRequest・fetch・axiosの3つの実装方法をコード付きで解説します。",
  publishedAt: "2026.02.23",
  tags: [
    { name: "JavaScript", slug: "javascript" },
  ],
  content: `
<p>
  Twitterのタイムラインが自動で更新されたり、フォームを送信しても画面が切り替わらなかったり。<br />
  こういった「ページを丸ごとリロードせずにデータをやり取りする」仕組みの裏側にあるのが <strong>Ajax</strong> です。
</p>

<h2>Ajaxとは何か</h2>
<p>
  Ajax（エイジャックス）は「<strong>Asynchronous JavaScript and XML</strong>」の略で、
  <strong>ページを再読み込みせずにサーバーと通信できる</strong>技術の総称です。
</p>
<p>
  通常のWeb通信（同期通信）では、リンクをクリックしたりフォームを送信するたびにページ全体が再読み込みされます。
  それに対してAjaxによる非同期通信では、<strong>ページはそのままの状態で、必要なデータだけをサーバーとやり取り</strong>できます。
</p>
<ul>
  <li><strong>同期通信</strong> — サーバーの処理が終わるまでブラウザが待機し、ページ全体が更新される</li>
  <li><strong>非同期通信（Ajax）</strong> — サーバーの処理を待たずに他の操作ができ、必要な箇所だけ更新される</li>
</ul>
<p>
  身近な例でいうと、Googleマップでドラッグしても画面が白くならず地図が読み込まれていくのがAjaxの典型的な活用です。
</p>

<h2>実装方法は3つある</h2>
<p>
  JavaScriptでAjaxを実装する方法は複数あります。それぞれ用途とトレードオフが異なるので、順に見ていきましょう。
</p>
<ul>
  <li><strong>XMLHttpRequest</strong> — 古くからある標準API。仕組みを理解するのに役立つ</li>
  <li><strong>fetch</strong> — 現在のブラウザ標準。ライブラリ不要でモダンな書き方ができる</li>
  <li><strong>axios</strong> — 実務でよく使われるライブラリ。エラー処理が書きやすい</li>
</ul>

<h2>XMLHttpRequest（歴史的背景として）</h2>
<p>
  Ajaxの元祖とも言える実装方法です。2000年代から使われており、現在のコードベースでも見かけることがあります。
  仕組みを理解するために一度は目を通しておくと良いです。
</p>

<pre><code>const client = new XMLHttpRequest();

// サーバー応答時の処理を定義
client.onreadystatechange = function () {
  if (client.readyState === 4) {       // 通信完了
    if (client.status === 200) {       // 通信成功
      const data = JSON.parse(client.responseText);
      console.log(data);
    } else {
      console.error("通信失敗:", client.status);
    }
  }
};

// リクエストを初期化して送信
client.open("GET", "https://api.example.com/data");
client.setRequestHeader("Content-Type", "application/json");
client.send(null);
</code></pre>

<p>
  <code>readyState === 4</code> が「通信完了」、<code>status === 200</code> が「成功」を意味します。
  この2段階チェックが必要なのが、XMLHttpRequestの特徴でもあります。
</p>
<p>
  記述が冗長になりがちなので、現在の新規実装では後述する <code>fetch</code> や <code>axios</code> を使うことがほとんどです。
</p>

<h2>fetch（モダンなネイティブ実装）</h2>
<p>
  <code>fetch</code> はブラウザに標準搭載されているAPI で、ライブラリのインストールなしで使えます。
  <code>Promise</code> ベースで書けるため、XMLHttpRequestより読みやすいコードになります。
</p>

<pre><code>fetch("https://api.example.com/data", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("通信失敗: " + response.status);
    }
    return response.json();  // レスポンスをJSONとして解析
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
</code></pre>

<p>
  <code>response.json()</code> を呼ぶことで、受け取ったJSONを自動でオブジェクトに変換してくれます。
</p>
<p>
  ひとつ注意点があります。<strong><code>fetch</code> は404や500などのHTTPエラーでも <code>catch</code> には落ちません</strong>。
  ネットワークエラーの場合のみ <code>catch</code> に入るため、<code>response.ok</code> で明示的にチェックする必要があります。
</p>

<h3>async/awaitで書くとさらにスッキリする</h3>
<p>
  <code>async/await</code> 構文を使うと、Promiseのチェーンをより直線的に書けます。
</p>

<pre><code>async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("通信失敗: " + response.status);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

fetchData();
</code></pre>

<p>
  <code>await</code> を使うことで、非同期処理を上から順に読める形で書けます。
  <code>try/catch</code> でエラーも自然に処理できるため、実務ではこの書き方が主流です。
</p>

<h2>axios（実務でよく使われるライブラリ）</h2>
<p>
  <code>axios</code> はサードパーティのHTTPクライアントライブラリです。
  <code>fetch</code> との最大の違いは、<strong>HTTPエラーを自動で <code>catch</code> に流してくれる</strong>点です。
  また、レスポンスのJSON変換も自動でやってくれます。
</p>
<p>
  CDNで導入する場合はHTMLに以下を追加します。
</p>

<pre><code>&lt;script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"&gt;&lt;/script&gt;
</code></pre>

<p>
  npm を使う場合はこちら。
</p>

<pre><code>npm install axios
</code></pre>

<p>
  基本的な使い方は以下の通りです。
</p>

<pre><code>axios({
  method: "get",
  url: "https://api.example.com/data",
  headers: { "Content-Type": "application/json" },
})
  .then((response) => {
    console.log(response.data);  // data プロパティに中身が入っている
  })
  .catch((error) => {
    console.error(error);
  });
</code></pre>

<p>
  <code>axios.get(url)</code> のように、メソッドを外出しした書き方もできます。
</p>

<pre><code>// async/await と組み合わせた実務的な書き方
async function fetchData() {
  try {
    const { data } = await axios.get("https://api.example.com/data");
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
</code></pre>

<h2>fetch と axios の使い分け</h2>
<p>
  どちらを使えばいいか迷う場面があると思うので、簡単に整理します。
</p>
<ul>
  <li><strong>ライブラリを増やしたくない・シンプルな用途</strong> → <code>fetch</code></li>
  <li><strong>エラーハンドリングを丁寧にしたい・リクエストが複数ある</strong> → <code>axios</code></li>
  <li><strong>React / Vue などのフレームワーク上で使う</strong> → どちらも使われるが <code>axios</code> が多い印象</li>
</ul>
<p>
  迷ったら「小さなプロジェクトは <code>fetch</code>、チーム開発や規模が大きいプロジェクトは <code>axios</code>」と覚えておくと判断しやすいです。
</p>

<h2>まとめ</h2>
<p>
  Ajaxは「ページを丸ごとリロードせずにサーバーと通信する」技術の総称で、現代のWebアプリに欠かせない仕組みです。
</p>
<ul>
  <li><strong>XMLHttpRequest</strong> — 歴史的経緯として知っておく。新規では使わない</li>
  <li><strong>fetch</strong> — ライブラリ不要のブラウザ標準。<code>response.ok</code> のチェックを忘れずに</li>
  <li><strong>axios</strong> — エラー処理が楽でコードがスッキリ。実務での採用率が高い</li>
</ul>
<p>
  まずは <code>fetch</code> で動かしてみて、物足りなくなったら <code>axios</code> に乗り換えるのがスムーズな学習順序だと思います。
</p>
  `,
};