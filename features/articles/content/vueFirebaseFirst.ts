import { Article } from "../index";

export const vueFirebaseFirst: Article = {
  slug: "vue-firebase-create-first",
  title: "Vue3 + Firebase でWebアプリを作ろう【前編】プロジェクト作成からローカル起動まで",
  description:
    "VueとFirebaseを使ってWebアプリを作る方法を前後編で解説します。前編ではViteを使ったVueプロジェクトの作成から、ローカル環境での画面表示までを説明します。",
  publishedAt: "2026.03.25",
  updatedAt: undefined,
  updatedAtTimestamp: undefined,
  tags: [
    { name: "Vue", slug: "vue" },
  ],
  content: `
    <h2>この記事について</h2>
    <p>
      VueとFirebaseを使ってWebアプリを作成する方法を紹介します。前後編に分けて、デプロイしてホスティングできるところまでを解説します。
    </p>
    <p>
      前編ではVueプロジェクトを作成して、ローカル環境で画面表示するところまでを進めます。Firebaseの導入とデプロイは後編で扱います。
    </p>

    <h2>環境</h2>
    <ul>
      <li>Node.js：20.18.0</li>
      <li>create-vue：3.11.1</li>
      <li>vite：5.4.9</li>
      <li>firebase-tools：13.23.0</li>
    </ul>

    <h2>Vueプロジェクトの作成</h2>
    <p>
      ターミナルを開いて新しいVueプロジェクトを作成します。公式ドキュメントではViteコマンドの使用が推奨されているので、こちらを使います。
    </p>
    <p>
      ViteはVueの作者によって開発されたビルドツールです。
    </p>
    <pre><code>$ npm create vue@latest</code></pre>
    <p>
      実行するといくつか質問されます。個人アプリの開発規模であれば全てNoでも問題ないですが、必要に応じて選択してください。
    </p>

    <h3>Project name</h3>
    <p>
      プロジェクト名を入力します。フォルダ名としても使われるので、大文字や特殊文字は避けて小文字・ハイフン・アンダースコアで入力するのが無難です。
    </p>

    <h3>Add TypeScript?</h3>
    <p>
      TypeScriptはJavaScriptに型を持たせた言語で、コードの可読性と安全性が上がります。学習コストは低めですが記法が変わるので、小規模なアプリ開発ではオーバーヘッドになることもあります。
    </p>

    <h3>Add JSX Support?</h3>
    <p>
      JSX（JavaScript XML）はJavaScriptのコード内でHTMLライクな構文を使う機能です。条件付きレンダリングや動的なプロパティ設定など、標準のtemplate記法だけでは困る場面で有効です。開発規模に応じて選択してください。
    </p>

    <h3>Add Vue Router for Single Page Application development?</h3>
    <p>
      Vue RouterはSPAでページ間の遷移を管理するためのライブラリです。複数画面を作る予定があれば導入しておいた方がいいです。
    </p>

    <h3>Add Pinia for state management?</h3>
    <p>
      PiniaはVue用の状態管理ライブラリです。アプリ全体の状態を一元管理できます。複数のコンポーネントで共通の状態を扱いたい場合に必要になります。
    </p>

    <h3>Add Vitest for Unit Testing?</h3>
    <p>
      Vitestはユニットテストを行うためのテストフレームワークです。
    </p>

    <h3>Add an End-to-End Testing Solution?</h3>
    <p>
      E2Eテストはアプリ全体のフローをテストする手法です。Cypress・Nightwatch・Playwrightの中から選択します。
    </p>

    <h3>Add ESLint for code quality?</h3>
    <p>
      ESLintはJavaScript・TypeScriptなどの静的解析ツールです。構文エラーを検知したり、プロジェクト独自のコーディング規約を設定できます。
    </p>

    <h3>Add Vue DevTools 7 extension for debugging? (experimental)</h3>
    <p>
      Vue DevToolsはVueアプリのデバッグを行うためのブラウザ拡張機能です。現時点では実験的な機能とのことです。
    </p>

    <h2>Vueプロジェクトを起動する</h2>
    <p>
      質問に回答するとプロジェクトが作成されます。作成後はターミナルに以下のようなメッセージが表示されるので、これに従って起動します。
    </p>
    <pre><code>Scaffolding project in /Users/user/workspace/Vue.js/project...

Done. Now run:

  cd project
  npm install
  npm run dev</code></pre>

    <h3>プロジェクトルートに移動する</h3>
    <p>
      作成されたフォルダに移動します。プロジェクト名にはProject nameで入力した名前を使います。
    </p>
    <pre><code>$ cd プロジェクト名</code></pre>

    <h3>パッケージをインストールする</h3>
    <p>
      プロジェクトに必要な依存関係をインストールします。<code>package.json</code> に記載されたパッケージが自動的にインストールされ、VueやそのほかのライブラリがプロジェクトIndexで使えるようになります。
    </p>
    <pre><code>$ npm install</code></pre>

    <h3>プロジェクトを起動する</h3>
    <p>
      開発サーバーを起動します。以下のようなメッセージが表示されれば成功です。
    </p>
    <pre><code>$ npm run dev

> project@0.0.0 dev
> vite

  VITE v5.4.9  ready in 879 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help</code></pre>
    <p>
      <code>http://localhost:5173/</code> がローカル環境のURLです。ブラウザで開くとVueアプリのデフォルト画面が表示されます。
    </p>

    <h2>まとめ</h2>
    <p>
      これでVueプロジェクトの起動まで完了です。うまく表示されない場合はターミナルのエラーメッセージを確認してみてください。よくある原因は依存関係が正しくインストールされていないか、ポートがすでに使われているかのどちらかです。
    </p>
    <p>
      後編ではFirebaseの導入とデプロイを解説します。
    </p>
  `,
};