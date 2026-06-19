import { Article } from "../index";

export const reactContextDesignTips: Article = {
  slug: "react-context-design-tips",
  title: "Context APIで地味に詰まりやすいポイントと設計のコツ",
  description:
    "ReactのContext APIを使うときに意外と詰まりやすいポイントと、再レンダリングを抑えるための設計の工夫を実装例とともに紹介します。",
  publishedAt: "2026.06.19",
  updatedAt: "2026.06.19",
  updatedAtTimestamp: 1781827200000,
  tags: [
    { name: "React", slug: "react" },
    { name: "TypeScript", slug: "typescript" },
  ],
  content: `
    <h2>Contextは「何でも入れる箱」にしない</h2>
    <p>
      複数のグローバルな状態をContext APIで管理する場合、最初はとりあえず共通で使いそうな値を片っ端からひとつのAppContextに詰め込んでしまうことがよくあります。ただこのやり方は、あとからじわじわとつらくなってきます。今回はContext APIを使うときに意識しておきたいポイントをまとめます。
    </p>

    <h2>Contextが更新されると配下が全部re-renderする</h2>
    <p>
      Context APIのいちばん詰まりやすいポイントは、Contextの値が変わると、そのContextを使っているコンポーネントすべてが再レンダリングされる、という挙動です。これは一部の値だけを使っているコンポーネントでも例外ではありません。
    </p>
    <p>
      ここで言う「再レンダリング」とは、Reactがそのコンポーネントの中身をもう一度実行して画面に反映する処理のことです。中身の処理が重かったり、対象のコンポーネントの数が多かったりすると、画面の応答が一瞬遅れたり、アニメーションがぎこちなくなったりする原因になります。だからこそ「本当に変更が必要な部分だけが再レンダリングされる」状態を保つのが理想です。
    </p>
    <p>
      たとえばAppContextの中にタスク一覧（頻繁に変わる）と、ユーザーのプロフィール情報（ほとんど変わらない）を一緒に入れていたとします。
    </p>
    <pre><code>type AppContextValue = {
  tasks: Task[];
  profile: Profile;
};

const AppContext = createContext&lt;AppContextValue | null&gt;(null);</code></pre>
    <p>
      この状態でタスクが1件増えるだけで、AppContextに渡しているvalueオブジェクト自体が新しく作り直されます。Reactは「前回のContextの値」と「今回のContextの値」を比較するとき、オブジェクトの中身までは見てくれず、参照、つまり同じオブジェクトを指しているかどうかだけで判定します。前回とは別の新しいオブジェクトが渡された時点で「値が変わった」と判断されるので、プロフィール情報しか参照していないコンポーネントまで再レンダリングの対象になってしまいます。プロフィールの値そのものは1ビットも変わっていないのに、です。
    </p>

    <h3>useMemoで包んでも解決しない理由</h3>
    <p>
      ここで「Contextに渡すvalueをuseMemoで包めばいいのでは」と思うかもしれません。ですが、useMemoは依存配列に入れた値が変わると、結局新しいオブジェクトを作り直す仕組みです。tasksとprofileを同じvalueオブジェクトに入れている以上、tasksが変わればuseMemoの依存配列も変わり、新しいオブジェクトが作られてしまいます。useMemoが効果を発揮するのは「依存配列に入れた値が変わらない限り、同じオブジェクトを再利用する」ケースなので、そもそも一緒に詰め込んでいる値の更新頻度がバラバラだと、useMemoだけでは防ぎきれません。
    </p>

    <h2>解決策: 関心ごとでContextを分ける</h2>
    <p>
      対策としては、更新頻度や関心ごとが違う値は、最初から別々のContextに分けてしまうことです。タスク用、ラベル用、設定用のように、扱う対象ごとにTasksContext、LabelsContext、SettingsContextへとContextを分割するのがひとつの解決策です。
    </p>
    <pre><code>// 分割前
const AppContext = createContext&lt;AppContextValue | null&gt;(null);

// 分割後
const TasksContext = createContext&lt;TasksContextValue | null&gt;(null);
const LabelsContext = createContext&lt;LabelsContextValue | null&gt;(null);
const SettingsContext = createContext&lt;SettingsContextValue | null&gt;(null);</code></pre>
    <p>
      こうすることで、タスクが更新されてもラベルや設定だけを見ているコンポーネントは再レンダリングの対象から外れます。ひとつのContextに詰め込みたくなる気持ちはよく分かりますが、「この値はどのくらいの頻度で変わるか」を意識して分けておくと、あとからパフォーマンスで悩む場面がぐっと減ります。
    </p>

    <h2>Contextに「値」だけでなく「操作」も持たせる</h2>
    <p>
      もうひとつ意識しておきたいのが、Contextには生のstateだけでなく、その状態を操作するための関数も一緒に持たせる、という設計です。
    </p>
    <p>
      労せず実装すると、labelsとsetLabelsをそのままContextで渡してしまいがちです。
    </p>
    <pre><code>type LabelsContextValue = {
  labels: Label[];
  setLabels: Dispatch&lt;SetStateAction&lt;Label[]&gt;&gt;;
};</code></pre>
    <p>
      これだと、利用する側のコンポーネントが好きなようにlabelsを書き換えられてしまいます。たとえば誤って同じIDのラベルを2つ追加してしまうコードを書いても、Context側にはそれを止める仕組みがありません。本来Context側に閉じ込めておきたいルールが、利用する側のコンポーネントごとに毎回気をつけて守る約束事になってしまうわけです。
    </p>
    <p>
      そこで、生のsetLabelsを外には渡さず、操作を意味のある単位の関数として用意するのがおすすめです。たとえばラベルの配列そのものだけでなく、ラベルを復元するためのrestoreLabelという関数も一緒に提供しておきます。
    </p>
    <pre><code>type LabelsContextValue = {
  labels: Label[];
  addLabel: (label: Label) => void;
  removeLabel: (id: string) => void;
  restoreLabel: (label: Label) => void;
};</code></pre>
    <p>
      こうしておくと、各コンポーネント側ではsetLabelsのような生のステート更新関数を直接触る必要がなくなります。「ラベルをどう操作できるか」がContextの型定義を見るだけで分かるようになり、操作のルール（たとえば同じIDのラベルは追加できない、など）もContext側に閉じ込めておけるので、コンポーネント側はシンプルに関数を呼ぶだけで済みます。
    </p>

    <h3>Contextを直接使わず、専用フックでラップする</h3>
    <p>
      最後に効果が大きい工夫が、Contextを直接useContextで呼ばせず、専用のカスタムフックを経由させることです。
    </p>
    <pre><code>const LabelsContext = createContext&lt;LabelsContextValue | null&gt;(null);

export function useLabels() {
  const context = useContext(LabelsContext);
  if (!context) {
    throw new Error("useLabels must be used within a LabelsProvider");
  }
  return context;
}</code></pre>
    <p>
      Providerの外側でuseLabelsを呼んでしまった場合、contextの値はnullになりますが、その状態のまま使おうとするとどこで何が起きているか分かりにくいエラーになりがちです。フックの中で早めにエラーを投げてあげることで、「Providerで囲み忘れている」という原因にすぐ気づけるようになります。型の面でも、フックの戻り値はnullを除いた型になるので、使う側でnullチェックを書く必要がなくなるという嬉しさもあります。
    </p>

    <h2>応用: stateとdispatchのContextを分ける</h2>
    <p>
      さらに再レンダリングを抑えたい場合、useReducerと組み合わせて、stateを渡すContextとdispatch関数を渡すContextを別々に用意する、という方法もあります。useReducerが返すdispatch関数は、state自体が更新されても同じ関数のまま変わらない、という性質を持っています。
    </p>
    <pre><code>const LabelsStateContext = createContext&lt;Label[] | null&gt;(null);
const LabelsDispatchContext = createContext&lt;Dispatch&lt;LabelsAction&gt; | null&gt;(null);</code></pre>
    <p>
      dispatch関数だけを参照しているコンポーネント（ボタンを押してアクションを送るだけのコンポーネントなど）は、LabelsDispatchContextだけを使うようにしておけば、labelsの中身が変わってもそのコンポーネントは再レンダリングされません。state用とdispatch用のContextを両方用意する分、コードの見通しは少し複雑になるので、規模の小さいうちはやりすぎな構成になりがちですが、扱うデータの量や画面の数が増えてきたタイミングで検討する価値のある工夫です。
    </p>

    <h2>まとめ</h2>
    <p>
      Context APIは手軽に使える分、最初は「とりあえず全部入れる箱」として使ってしまいがちです。更新頻度で分割すること、値だけでなく操作も一緒に渡すこと、専用フックでラップしてエラーを分かりやすくすること。この3つを意識しておくと、Contextまわりのコードがぐっと見通しやすくなります。
    </p>
  `,
};