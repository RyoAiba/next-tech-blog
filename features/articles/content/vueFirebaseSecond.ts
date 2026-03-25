import { Article } from "../index";

export const vueFirebaseSecond: Article = {
  slug: "vue-firebase-create-second",
  title: "Vue3 + Firebase でWebアプリを作ろう【後編】Firebase導入からデプロイまで",
  description:
    "VueとFirebaseを使ったWebアプリ作成の後編です。Firebaseプロジェクトの作成・CLIのセットアップ・ビルド・デプロイまでの手順を解説します。",
  publishedAt: "2026.03.25",
  updatedAt: undefined,
  updatedAtTimestamp: undefined,
  tags: [
    { name: "Vue", slug: "vue" },
  ],
  content: `
    <h2>この記事について</h2>
    <p>
      前編ではViteを使ったVueプロジェクトの作成からローカル起動まで進めました。後編ではFirebaseを導入してデプロイ・ホスティングするところまでを解説します。
    </p>
    <p>
      前編をまだ読んでいない方はそちらから進めてください。
    </p>

    <h2>環境</h2>
    <ul>
      <li>Node.js：20.18.0</li>
      <li>create-vue：3.11.1</li>
      <li>vite：5.4.9</li>
      <li>firebase-tools：13.23.0</li>
    </ul>

    <h2>Firebaseプロジェクトの作成</h2>
    <p>
      まずFirebaseのコンソールにアクセスして、「Firebaseプロジェクトを使ってみる」をクリックします。
    </p>
    <p>
      プロジェクト名を入力して「続行」をクリック。続いてGoogleアナリティクスを利用するかどうかを選択します。アナリティクスのアカウントが必要になるので、とくに必要なければ無効のまま「続行」で大丈夫です。
    </p>
    <p>
      1分ほど待つとプロジェクトの作成が完了します。「続行」をクリックするとコンソールに戻ります。
    </p>

    <h2>WebアプリにFirebaseを追加する</h2>
    <p>
      コンソールに「アプリにFirebaseを追加して利用を開始しましょう」という項目があります。「ウェブ」をクリックします。
    </p>

    <h3>アプリの登録</h3>
    <p>
      Firebase上で識別するためのニックネームを入力します。「このアプリのFirebase Hostingも設定します。」にチェックを入れてから「アプリを登録」をクリックします。
    </p>

    <h3>Firebase SDK のインストール</h3>
    <p>
      ターミナルで以下を実行してFirebase SDKをインストールします。
    </p>
    <pre><code>$ npm install firebase</code></pre>
    <p>
      APIキーが画面に表示されますが、今回は使いません。後から必要になった場合はプロジェクトの設定画面から確認できます。「次へ」をクリックして進みます。
    </p>

    <h3>Firebase CLI のインストール</h3>
    <p>
      Firebase CLIをインストールします。Node.js v18.0.0以降が必要です。インストールに失敗する場合はNode.jsのバージョンを確認してみてください。
    </p>
    <pre><code>$ npm install -g firebase-tools</code></pre>
    <p>
      インストールが完了したら「次へ」をクリックします。
    </p>

    <h3>Firebaseにログインする</h3>
    <p>
      ターミナルで以下を実行してログインします。CLIインストール直後に <code>firebase</code> コマンドが使えない場合は、一度ターミナルを再起動してみてください。
    </p>
    <pre><code>$ firebase login</code></pre>
    <p>
      情報収集を許可するかの質問が出るので回答すると、ブラウザでGoogleのログイン画面に遷移します。ログインしてアクセスを「許可」すると、ターミナルに以下のように表示されます。
    </p>
    <pre><code>✔  Success! Logged in as sample@email.com</code></pre>

    <h3>Firebaseの初期化</h3>
    <p>
      アプリのルートディレクトリで以下を実行します。
    </p>
    <pre><code>$ firebase init</code></pre>
    <p>
      Firebaseのアスキーアートが表示されてプロジェクトの初期化が始まります。いくつか質問されるので順に答えていきます。
    </p>
    <p>
      まず使用するFirebase機能を聞かれます。スペースキーで選択のON/OFFを切り替えられます。今回はホスティングとデプロイをしたいので、<code>Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys</code> を選択してエンターを押します。
    </p>
    <pre><code>? Which Firebase features do you want to set up for this directory?
❯◯ Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys</code></pre>
    <p>
      次にFirebaseプロジェクトとの連携方法を聞かれます。コンソールから作成済みなので <code>Use an existing project</code> を選択します。
    </p>
    <pre><code>? Please select an option:
❯ Use an existing project</code></pre>
    <p>
      プロジェクト一覧が表示されるので、紐づけたいプロジェクトを選択します。
    </p>

    <h3>Hostingのフォルダを設定する</h3>
    <p>
      デプロイ時にアップロードするファイルを格納するフォルダを指定します。デフォルトでは <code>public</code> になっていますが、Vueはビルド時のファイルを <code>dist</code> フォルダに出力するので、<code>dist</code> に変更してください。
    </p>
    <pre><code>? What do you want to use as your public directory? (public)</code></pre>
    <p>
      間違えてそのまま進んでしまっても、後から <code>firebase.json</code> の <code>public</code> を <code>"dist"</code> に修正すれば大丈夫です。
    </p>
    <p>
      続いてSPAの設定をするか、GitHub連携の自動デプロイを設定するかを聞かれます。
    </p>
    <pre><code>? Configure as a single-page app (rewrite all urls to /index.html)? (y/N)
? Set up automatic builds and deploys with GitHub? (y/N)</code></pre>
    <p>
      回答が完了するとFirebaseの初期化が完了します。
    </p>
    <pre><code>✔  Firebase initialization complete!</code></pre>

    <h2>デプロイ</h2>
    <p>
      まずVueプロジェクトをビルドします。プロジェクトルートで以下を実行します。
    </p>
    <pre><code>$ npm run build</code></pre>
    <p>
      ビルドが完了したらデプロイです。<code>project</code> の部分はFirebaseのプロジェクト名に置き換えてください。
    </p>
    <pre><code>$ firebase deploy --only hosting:project</code></pre>
    <p>
      デプロイが完了するとHosting URLが表示されます。
    </p>
    <pre><code>✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/project/overview
Hosting URL: https://project.web.app</code></pre>
    <p>
      表示されたURLをブラウザで開くと、Vueアプリがホスティングされているのを確認できます。
    </p>

    <h2>まとめ</h2>
    <p>
      前後編を通じて、VueとFirebaseを使ったWebアプリの作成からデプロイまでの流れを解説しました。Firebaseを使うとホスティング周りの設定がシンプルに済むのが便利なポイントです。
    </p>
    <p>
      デプロイ後に変更を反映したい場合は <code>npm run build</code> してから <code>firebase deploy</code> を再度実行するだけです。
    </p>
  `,
};