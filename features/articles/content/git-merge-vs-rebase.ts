import { Article } from "../index";

export const gitMergeVsRebase: Article = {
  slug: "git-merge-vs-rebase",
  title: "mergeとrebase、結局どっちを使えばいい？",
  description:
    "git mergeとgit rebaseの違い、それぞれどんな場面で使うべきかを整理しました。「履歴をきれいに保ちたい」か「事実をそのまま残したい」かで選び方が変わります。",
  publishedAt: "2026.03.18",
  updatedAt: undefined,
  updatedAtTimestamp: undefined,
  tags: [
    { name: "Git", slug: "git" },
  ],
  content: `
    <h2>mergeとrebase、どっちも「ブランチを統合する」コマンド</h2>
    <p>
      <code>merge</code> と <code>rebase</code> はどちらも「あるブランチの変更を別のブランチに取り込む」ためのコマンドです。やりたいことは同じなのに2種類あるので混乱しがちですが、結果として作られる「コミット履歴の形」が違います。
    </p>
    <p>
      先にざっくりまとめると、こうなります。
    </p>
    <ul>
      <li><strong>merge</strong>：ブランチを統合した事実をそのまま履歴に残す</li>
      <li><strong>rebase</strong>：コミット履歴をきれいな一直線に整理する</li>
    </ul>
    <p>
      どちらが正解というわけではなく、場面によって使い分けます。
    </p>

    <h2>git merge：統合の事実を残す</h2>
    <p>
      まず <code>merge</code> から。<code>feature</code> ブランチで作業して、<code>main</code> に取り込む場面を考えます。
    </p>
    <pre><code># mainブランチに移動して、featureを取り込む
$ git checkout main
$ git merge feature</code></pre>
    <p>
      このとき、Gitは「<code>feature</code> と <code>main</code> をここで統合した」というマージコミットを1つ作ります。
    </p>
    <pre><code>      A---B---C  feature
     /         \\
D---E-----------F  main（マージコミット）</code></pre>
    <p>
      ブランチが分岐して合流した形がそのまま残ります。「いつ、どのブランチがどこで合流したか」が一目でわかります。
    </p>
    <h3>mergeのメリット・デメリット</h3>
    <p>
      メリットは作業の流れが正直に残ること。いつ誰がどのブランチを取り込んだかが履歴から読み取れます。
    </p>
    <p>
      デメリットは長期間開発が続くと履歴が枝分かれしてごちゃごちゃしやすいこと。<code>git log</code> を見たときに複雑に見えます。
    </p>

    <h2>git rebase：履歴を一直線に整える</h2>
    <p>
      <code>rebase</code> は、ブランチの「生えている根元」を付け替えるコマンドです。
    </p>
    <pre><code># featureブランチで作業中に、mainの最新を取り込む
$ git checkout feature
$ git rebase main</code></pre>
    <p>
      このとき何が起きるかというと、<code>feature</code> ブランチのコミットが一度取り外され、<code>main</code> の最新コミットの上に順番に貼り直されます。
    </p>
    <pre><code># rebase前
      A---B---C  feature
     /
D---E---F  main

# rebase後
              A'--B'--C'  feature
             /
D---E---F  main</code></pre>
    <p>
      コミット <code>A・B・C</code> が <code>A'・B'・C'</code> として作り直されています。内容は同じですがコミットIDが変わっているのがポイントです。この後 <code>main</code> に merge すると、枝分かれがなくなって一直線の履歴になります。
    </p>
    <pre><code>D---E---F---A'--B'--C'  main</code></pre>
    <h3>rebaseのメリット・デメリット</h3>
    <p>
      メリットは履歴がきれいなこと。<code>git log</code> を見たときに迷子になりません。コードレビューのときも「このブランチで何をやったか」が読みやすいです。
    </p>
    <p>
      デメリットはコミットIDが書き換わること。push済みのブランチに <code>rebase</code> すると、他のメンバーの手元と履歴がズレて混乱を招きます。
    </p>

    <h2>どっちを使えばいい？</h2>
    <p>
      現場では「<code>rebase</code> は危険」と言われることがありますが、正確には「push済みの共有ブランチに使うと危険」です。使う場面さえ間違えなければ怖くありません。
    </p>
    <h3>mergeを使う場面</h3>
    <ul>
      <li>プルリクエストをmainに取り込むとき</li>
      <li>チームで共有しているブランチ同士を統合するとき</li>
      <li>「いつ統合したか」の記録を残したいとき</li>
    </ul>
    <h3>rebaseを使う場面</h3>
    <ul>
      <li>作業中のfeatureブランチにmainの最新を取り込みたいとき</li>
      <li>pushする前にコミット履歴を整理したいとき</li>
      <li>ローカルだけで完結している作業のとき</li>
    </ul>
    <p>
      簡単に言うと、<strong>「自分だけが触るブランチなら rebase、チームで共有するブランチへの統合は merge」</strong>が基本の使い分けです。
    </p>

    <h2>rebaseでコンフリクトが起きたら</h2>
    <p>
      <code>rebase</code> 中にコンフリクトが発生すると、コミット1つずつに対して解決が求められます。<code>merge</code> と違って、コミットの数だけ解決の機会が来ることがあります。
    </p>
    <pre><code># コンフリクトを解決したら
$ git add 解決したファイル
$ git rebase --continue

# rebaseをやめて元に戻したいとき
$ git rebase --abort</code></pre>
    <p>
      途中でやっぱりやめたくなったら <code>--abort</code> で rebase 前の状態に戻せます。コンフリクトまみれになっても落ち着いて <code>--abort</code> できるのは覚えておくと安心です。
    </p>

    <h2>git pull --rebase という選択肢</h2>
    <p>
      <code>git pull</code> はデフォルトで merge を使ってリモートの変更を取り込みますが、<code>--rebase</code> オプションをつけることで rebase を使えます。
    </p>
    <pre><code>$ git pull --rebase origin main</code></pre>
    <p>
      「リモートでmainが進んでいたので取り込んだ」というだけのマージコミットが増えるのを防げます。履歴をすっきり保ちたいチームではこちらをデフォルト設定にしていることもあります。
    </p>

    <h2>まとめ</h2>
    <ul>
      <li><strong>merge</strong>：統合の事実をそのまま残す。共有ブランチへの取り込みはこちら</li>
      <li><strong>rebase</strong>：履歴を一直線に整える。ローカル・push前の作業に使う</li>
      <li>push済みの共有ブランチへの rebase は避ける</li>
      <li>迷ったら merge でも何も問題はない</li>
    </ul>
    <p>
      最初は merge だけ使っておいて、rebase は「手元の履歴を整理したいな」と感じたときに試してみるくらいの温度感でいいと思います。
    </p>
  `,
};