import { Article } from "../index";

export const localStorageSsrFlashCookie: Article = {
  slug: "localstorage-ssr-flash-cookie",
  title: "ReactでlocalStorageを使うとSSRでチラつく問題、cookieへの移行で解決した話",
  description:
    "Next.jsでlocalStorageを使った状態保存がSSRとうまく噛み合わずちらついてしまう原因と、cookieに移行することで解決した実装の話です。",
  publishedAt: "2026.06.19",
  updatedAt: "2026.06.19",
  updatedAtTimestamp: 1781827200000,
  tags: [
    { name: "React", slug: "react" },
    { name: "Next.js", slug: "nextjs" },
    { name: "TypeScript", slug: "typescript" },
    { name: "パフォーマンス", slug: "performance" },
  ],
  content: `
    <h2>サイドバーの開閉状態がちらつく現象</h2>
    <p>
      SSR（サーバーサイドレンダリング）を使っているNext.jsのようなフレームワークで、サイドバーの開閉状態のようなUIの状態をlocalStorageに保存していると、ページをリロードした瞬間にほんの一瞬だけ違う見た目が表示されてから、パッと正しい状態に切り替わる、というちらつきが起きることがあります。
    </p>
    <p>
      最終的には正しい状態に落ち着くので機能としては壊れていませんが、画面がカクッと切り替わる様子は見ていて気になるものです。原因を辿っていくと、SSRとlocalStorageの相性の悪さが見えてきます。
    </p>

    <h2>なぜちらつくのか</h2>
    <p>
      Next.jsはページを表示する前に、サーバー側で一度HTMLを組み立てます。これがSSRと呼ばれる仕組みで、ブラウザに届く画面は、サーバーがあらかじめ用意した「完成品のHTML」です。
    </p>
    <p>
      ところがこのHTMLを組み立てている時点では、サーバーはブラウザの中にあるlocalStorageの内容を読むことができません。localStorageはあくまでブラウザというソフトの中に保存されている値で、ネットワークを通じてサーバーに送られることはないからです。そのためサーバーは「サイドバーが開いていたか閉じていたか」を知る手段がそもそもなく、とりあえず「閉じている」というデフォルトの状態でHTMLを組み立ててブラウザに送ります。
    </p>
    <p>
      そのHTMLがブラウザに届いた直後は、まだサーバーが用意した「閉じている」状態のままです。そのあとJavaScriptが動き出して初めてlocalStorageの内容を読み込み、本来の状態に画面を書き換えます。たとえるなら、まず仮の原稿を一度読み上げてから、あとから訂正のテロップを差し込んでいるようなものです。この「最初に表示された画面」と「JavaScriptが読み込んで書き換えたあとの画面」の間にわずかなタイムラグがあり、それが目に見える形でちらつきとして現れるわけです。
    </p>

    <h3>localStorageはブラウザだけのもの</h3>
    <p>
      ここで改めて整理すると、localStorageはブラウザの中だけに閉じた保存場所です。ページを開くときにブラウザがサーバーへ送るリクエストには、localStorageの内容は一切含まれません。サーバー側のコードからlocalStorageに直接アクセスする方法も存在しません。なので「最初のHTMLを組み立てる段階で、ユーザーごとの保存状態を反映する」ということが、localStorageを使っている限りはどうしても実現できないのです。
    </p>

    <h2>解決策はcookieへの移行</h2>
    <p>
      そこで使えるのがcookieです。cookieもlocalStorageと同じようにブラウザに保存される値ですが、決定的に違う点があります。cookieはページを読み込むときのリクエストに自動で乗って、サーバーにも一緒に送られるんです。郵便物に同封されている案内状のように、リクエストという荷物の中に最初から入っている、というイメージです。
    </p>
    <p>
      つまりサーバー側のコードでも、リクエストに乗ってきたcookieの中身を読めば「サイドバーが開いていたかどうか」が分かります。Next.jsのサーバーコンポーネントであれば、next/headersから提供されているcookies関数を使ってその値を読み取り、最初からその情報を反映した状態でHTMLを組み立てられます。サーバーが最初から正解を知っている状態で画面を作れるので、あとからJavaScriptで書き換える必要がなくなり、ちらつく余地そのものがなくなるというわけです。
    </p>

    <h3>実装の流れ</h3>
    <p>
      直し方は大きく分けると2つです。状態を保存する先をlocalStorageからcookieに変更すること、そしてその状態を読み込む処理を、クライアント側のuseEffectからサーバーコンポーネント側に移すことです。順番に見ていきます。
    </p>
    <p>
      Before（localStorageに頼っているパターン）はこんな感じです。
    </p>
    <pre><code>"use client";
import { useState, useEffect } from "react";

export function useSidebarState() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-open");
    if (stored) setIsOpen(stored === "true");
  }, []);

  const toggle = () => {
    const next = !isOpen;
    localStorage.setItem("sidebar-open", String(next));
    setIsOpen(next);
  };

  return { isOpen, toggle };
}</code></pre>
    <p>
      初回レンダリング時はisOpenがfalse固定なので、サーバーが作るHTMLは常に「閉じている」状態になります。useEffectはブラウザに届いたあとにしか動かないので、そこで初めて正しい値に書き換わり、その瞬間がちらつきとして見えていました。
    </p>
    <p>
      After（cookieに移行し、サーバー側で初期値を決めるパターン）はこうなります。
    </p>
    <pre><code>// サーバーコンポーネント側
import { cookies } from "next/headers";
import { Sidebar } from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isOpen = cookies().get("sidebar-open")?.value === "true";

  return (
    &lt;&gt;
      &lt;Sidebar initialIsOpen={isOpen} /&gt;
      {children}
    &lt;/&gt;
  );
}</code></pre>
    <pre><code>// クライアントコンポーネント側
"use client";
import { useState } from "react";

type Props = { initialIsOpen: boolean };

export function Sidebar({ initialIsOpen }: Props) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    document.cookie =
      "sidebar-open=" + next + "; path=/; max-age=31536000";
  };

  return (
    &lt;button onClick={toggle}&gt;
      {isOpen ? "閉じる" : "開く"}
    &lt;/button&gt;
  );
}</code></pre>
    <p>
      サーバーコンポーネントの時点でcookieを読んでisOpenを決めているので、最初に届くHTMLからすでに正しい状態になっています。クライアント側はpropsで受け取った値をそのまま初期値として使うだけなので、useEffectでの書き換えが不要になり、ちらつきも起きなくなります。
    </p>

    <h2>もう少し踏み込んで: cookieを使うときの注意点</h2>
    <p>
      cookieは便利ですが、いくつか気をつけたいポイントがあります。まず、cookieは1つあたり4KB程度というサイズの制限があり、しかもページを読み込むたびにリクエストへ毎回乗っていきます。大きなデータや頻繁に更新するデータを入れると、それだけ通信量が増えてしまうので、サイドバーの開閉状態のような小さなフラグ程度に留めておくのが安心です。
    </p>
    <p>
      もうひとつ覚えておきたいのが、Next.jsのサーバーコンポーネントは基本的にcookieを「読む」ことしかできず、「書き込む」処理はサーバーコンポーネントの中には書けない、という制約です。書き込みを行うのはクライアントコンポーネント側か、サーバーアクションやルートハンドラーと呼ばれる別の仕組みの中になります。この制約を知らずにサーバーコンポーネントの中でcookieをセットしようとすると、エラーになってしまうので注意が必要です。
    </p>
    <p>
      またhttpOnly属性をつけると、JavaScriptからcookieを読み書きできなくなります。これはログイントークンのような機密情報を守るための設定で、サイドバーの状態のようなUI上の好みを保存する場合には、むしろJavaScript側からも読み書きしたいのでhttpOnlyはつけない、という判断になります。用途によって付け外しを考える必要がある、というのは覚えておくと役立つポイントです。
    </p>

    <h2>まとめ</h2>
    <p>
      localStorageは便利な反面、サーバーからは見えないという特性があり、SSRと組み合わせると「最初の表示」と「実際の状態」がズレてちらつきの原因になることがあります。サーバーにも値が届くcookieに移行することで、最初から正しい状態でレンダリングできるようになり、地味だけど気になるちらつきを解消できます。状態をどこに保存するか、という選択ひとつで見た目の印象が変わるのは面白いところです。
    </p>
  `,
};