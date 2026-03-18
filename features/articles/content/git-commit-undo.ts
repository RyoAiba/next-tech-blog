import { Article } from "../index";

export const gitCommitUndo: Article = {
  slug: "git-commit-undo",
  title: "やり直したい！git commitの取り消し方まとめ（reset / revert / amend の使い分け）",
  description:
    "コミットを間違えたとき、reset・revert・amendの3つをどう使い分けるか整理しました。「歴史を消す」か「歴史に残す」かで選び方が変わります。",
  publishedAt: "2026.03.18",
  updatedAt: undefined,
  updatedAtTimestamp: undefined,
  tags: [
    { name: "Git", slug: "git" },
  ],
  content: `
    <h2>コミットを間違えた、どうする</h2>
    <p>
      Gitを使っていると必ずやらかします。タイポをコミットした、まだ途中なのに間違えてコミットした、コミットメッセージが雑すぎた。
    </p>
    <p>
      そういうときに使うのが <code>reset</code>・<code>revert</code>・<code>amend</code> の3つです。名前が似ていてどれを使えばいいか迷いがちですが、選び方はシンプルです。
    </p>
    <ul>
      <li>コミット履歴ごと消したい → <strong>reset</strong></li>
      <li>履歴は残して取り消したい → <strong>revert</strong></li>
      <li>直前のコミットだけ修正したい → <strong>amend</strong></li>
    </ul>
    <p>
      「歴史を書き換えるか、歴史に残すか」で判断すると迷いにくいです。順番に見ていきます。
    </p>

    <h2>git commit --amend：直前のコミットをやり直す</h2>
    <p>
      一番使う機会が多いのが <code>amend</code> です。直前のコミットだけを修正できます。
    </p>
    <pre><code>$ git commit --amend</code></pre>
    <p>
      実行するとエディタが開いて、コミットメッセージを編集できます。メッセージはそのままでいい場合は <code>--no-edit</code> をつけます。
    </p>
    <pre><code># メッセージを変えずにファイルだけ追加してやり直す
$ git add 忘れてたファイル.ts
$ git commit --amend --no-edit</code></pre>
    <p>
      「コミットした直後にファイルの追加漏れに気づいた」というケースにちょうどいいです。
    </p>
    <h3>push後はやめておく</h3>
    <p>
      <code>amend</code> はコミット自体を作り直すのでコミットIDが変わります。すでに <code>git push</code> したあとに使うと、リモートとの履歴がズレます。ローカルだけで完結しているコミットにだけ使いましょう。
    </p>

    <h2>git reset：コミット履歴を巻き戻す</h2>
    <p>
      <code>reset</code> はコミット履歴そのものを巻き戻すコマンドです。「なかったことにする」イメージです。
    </p>
    <p>
      オプションが3種類あって、ここが少しわかりにくいポイントです。
    </p>
    <h3>--soft：コミットだけ取り消す</h3>
    <pre><code>$ git reset --soft HEAD~1</code></pre>
    <p>
      直前のコミットを取り消しつつ、変更内容はステージに残ります。「コミットはなかったことにしたいけど変更は残したい」ときに使います。コミットメッセージを書き直したいときなんかによく使います。
    </p>
    <h3>--mixed：コミットとステージを取り消す（デフォルト）</h3>
    <pre><code>$ git reset HEAD~1
# または
$ git reset --mixed HEAD~1</code></pre>
    <p>
      コミットとステージの両方を取り消して、変更内容はファイルに残ります。オプションを省略したときのデフォルト動作です。
    </p>
    <h3>--hard：全部まるごと消す</h3>
    <pre><code>$ git reset --hard HEAD~1</code></pre>
    <p>
      コミット・ステージ・ファイルの変更、全部消えます。完全になかったことになります。<strong>消えた変更は基本的に戻せないので、本当に捨てていいときだけ使います。</strong>
    </p>
    <h3>HEAD~1 ってなに？</h3>
    <p>
      <code>HEAD~1</code> は「今のコミットから1つ前」という意味です。<code>HEAD~2</code> なら2つ前。特定のコミットに戻したい場合はコミットIDを直接指定もできます。
    </p>
    <pre><code>$ git reset --soft abc1234</code></pre>
    <h3>resetもpush後は要注意</h3>
    <p>
      push済みのコミットを <code>reset</code> するとリモートとの履歴がズレます。チームで共有しているブランチでは使わない方が無難です。
    </p>

    <h2>git revert：取り消しをコミットとして残す</h2>
    <p>
      <code>revert</code> は、指定したコミットの変更を打ち消す新しいコミットを作ります。履歴は消えません。「取り消した」という事実も記録に残ります。
    </p>
    <pre><code># 直前のコミットを取り消す
$ git revert HEAD --no-edit

# 特定のコミットを取り消す
$ git revert abc1234</code></pre>
    <h3>revertを使う場面</h3>
    <p>
      pushした後や、チームで共有しているブランチで使います。履歴を書き換えないので、他のメンバーの作業に影響しません。「本番に出てしまったコミットを取り消したい」というケースはほぼ <code>revert</code> 一択です。
    </p>

    <h2>3つの使い分けをまとめると</h2>
    <pre><code>状況                                   使うコマンド
──────────────────────────────────────────────────────
直前のコミットメッセージを直したい      git commit --amend
直前のコミットにファイルを追加したい    git add して git commit --amend
ローカルのコミットを取り消したい        git reset（--soft / --mixed / --hard）
pushしたコミットを取り消したい          git revert
本番の変更を安全に元に戻したい          git revert</code></pre>
    <p>
      大事なのは「push済みかどうか」です。push前ならリセット系で気軽に書き換えられますが、push後は <code>revert</code> で履歴に残す形で取り消すのが安全です。
    </p>

    <h2>間違えて --hard してしまったら</h2>
    <p>
      「<code>git reset --hard</code> したらコードが全部消えた」という事故、よく聞きます。でも実は <code>git reflog</code> を使えば復元できるケースがあります。
    </p>
    <pre><code>$ git reflog</code></pre>
    <p>
      <code>reflog</code> はHEADの移動履歴を記録しています。<code>reset --hard</code> した直前のコミットIDがここに残っていれば、そこに戻れます。
    </p>
    <pre><code>$ git reset --hard abc1234</code></pre>
    <p>
      ただし <code>reflog</code> も一定期間が過ぎると消えます。やらかしたと気づいたらすぐ確認しましょう。
    </p>

    <h2>まとめ</h2>
    <ul>
      <li><strong>amend</strong>：直前のコミットをやり直す。push前限定</li>
      <li><strong>reset --soft</strong>：コミットだけ取り消す。変更はステージに残る</li>
      <li><strong>reset --mixed</strong>：コミット＋ステージを取り消す。変更はファイルに残る</li>
      <li><strong>reset --hard</strong>：全部消す。push前限定、慎重に</li>
      <li><strong>revert</strong>：取り消しを新しいコミットとして記録。push後もOK</li>
    </ul>
    <p>
      「push済みなら revert、push前なら reset」だけ覚えておけばほとんどのケースは乗り越えられます。
    </p>
  `,
};