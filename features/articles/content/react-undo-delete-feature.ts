import { Article } from "../index";

export const reactUndoDeleteFeature: Article = {
  slug: "react-undo-delete-feature",
  title: "削除を取り消せるUndo機能をReactで実装する方法",
  description:
    "誤操作で消してしまったデータを取り消せるUndo機能を、setTimeoutを使った二段階の削除フローで実装した話をまとめました。",
  publishedAt: "2026.06.19",
  updatedAt: "2026.06.19",
  updatedAtTimestamp: 1781827200000,
  tags: [
    { name: "React", slug: "react" },
    { name: "TypeScript", slug: "typescript" },
    { name: "UI", slug: "ui" },
  ],
  content: `
    <h2>削除ボタンの近さが生む「うっかり削除」</h2>
    <p>
      リストの中に削除ボタンと編集ボタンが並んでいると、編集ボタンの近くをクリックしたつもりが、間違って削除を押してしまう、ということがどうしても起きます。即座にデータが消えてしまうと、同じ内容をもう一度入力し直す手間がかかってしまいます。
    </p>
    <p>
      メールサービスにある「送信を取り消す」機能と考え方は同じで、操作した直後の一瞬だけ「取り消す」チャンスを残しておけば、うっかり消してしまったときの被害を最小限にできます。
    </p>

    <h2>仕組みの全体像</h2>
    <p>
      ポイントは、削除ボタンを押した瞬間にデータを本当に消すのではなく、画面上は消えたように見せつつ、裏側では数秒間だけ「まだ消していない」状態を保っておくことです。その数秒の間にUndoボタンを押すと元に戻り、何も押さずに時間が過ぎると、そこで本当にデータが削除される、という二段階の流れになります。
    </p>
    <p>
      「画面上はすでに反映されているが、確定処理はあとから行う」という考え方は、楽観的UI（オプティミスティックUI）と呼ばれる手法にも近いものです。サーバーへの通信を待たずに先に画面だけ更新してしまう発想と、削除を即座に確定させずに猶予を持たせる発想は、どちらも「ユーザーの操作にすぐ反応を返す」ことを優先している点で似ています。
    </p>

    <h3>なぜ即削除ではなく一度待つのか</h3>
    <p>
      即座に削除してしまうと、元に戻すには「もう一度同じ内容を作り直す」しか手段がなくなります。これは名前や色をまた入力し直す手間がかかりますし、操作として元に戻った安心感も薄いです。少しの間だけ確定を保留しておけば、元のデータをそのまま復元できるので、操作の気持ちよさが全く違ってきます。
    </p>

    <h2>useLabelDeleteフックを作る</h2>
    <p>
      この仕組みは画面のあちこちで使うことになるので、useLabelDeleteというカスタムフックに切り出すと管理しやすくなります。中でやることは大きく分けると、次の3つです。
    </p>
    <p>
      ひとつ目は、削除ボタンが押された瞬間に画面上のラベルを非表示にすることです。ここで実際のデータはまだ消さず、見た目だけ消えたように見せます。
    </p>
    <p>
      ふたつ目は、setTimeoutを使って数秒後に本当の削除を実行する処理を仕込むことです。たとえば5秒後に削除を確定する、というタイマーをセットしておきます。
    </p>
    <p>
      みっつ目は、その数秒の間にUndoボタンが押されたら、setTimeoutをclearTimeoutでキャンセルし、非表示にしていたラベルを元の表示に戻す処理です。タイマーが走っている間だけUndoの選択肢が存在する、というイメージです。
    </p>
    <p>
      この3つをまとめると、こんな実装になります。
    </p>
    <pre><code>type PendingDeletion = {
  label: Label;
  timer: ReturnType&lt;typeof setTimeout&gt;;
};

export function useLabelDelete(restoreLabel: (label: Label) => void) {
  const pendingRef = useRef&lt;Map&lt;string, PendingDeletion&gt;&gt;(new Map());

  // 1. 押された瞬間は見た目だけ消す。実データの削除は5秒後に確定
  const deleteLabel = (label: Label, onConfirm: (id: string) => void) => {
    const timer = setTimeout(() => {
      onConfirm(label.id);
      pendingRef.current.delete(label.id);
    }, 5000);

    pendingRef.current.set(label.id, { label, timer });
  };

  // 2. Undoが押されたらタイマーを止めて元のラベルを復元する
  const undoDelete = (id: string) => {
    const pending = pendingRef.current.get(id);
    if (!pending) return;

    clearTimeout(pending.timer);
    pendingRef.current.delete(id);
    restoreLabel(pending.label);
  };

  return { deleteLabel, undoDelete };
}</code></pre>
    <p>
      使う側はこんなイメージです。
    </p>
    <pre><code>const { deleteLabel, undoDelete } = useLabelDelete(restoreLabel);

const handleDelete = (label: Label) => {
  hideLabelFromUI(label.id);          // 見た目だけ先に消す
  deleteLabel(label, (id) => {
    removeLabelPermanently(id);       // 5秒後、ここで本当に削除される
  });
};</code></pre>

    <h3>useRefを使う理由</h3>
    <p>
      コードの中でpendingRefという名前でuseRefを使っています。タイマー情報を保存するだけならuseStateで持っておいてもよさそうに見えますが、ここでuseRefを選んでいる理由があります。useStateで管理した値が変わると、そのたびにコンポーネントは再レンダリングされます。タイマーの開始や終了は画面の見た目に直接関係しない、いわば裏側の管理情報なので、その変化のたびに再レンダリングが起きるのはもったいないです。useRefで持っておけば値を書き換えても再レンダリングは発生せず、画面に表示する必要があるisOpenのような状態だけをuseStateで管理する、という役割分担がきれいになります。
    </p>

    <h3>複数のラベルを同時に削除するときの工夫</h3>
    <p>
      ここで少し厄介なのが、ラベルAを削除した直後にラベルBも削除した場合の挙動です。それぞれのラベルに対して独立したタイマーを持たせる必要があり、ひとつの変数でタイマーIDを管理すると後から削除したものが先のタイマーを上書きしてしまうバグにつながります。上のコードでpendingRefをMapにしているのはこのためで、ラベルのIDをキーにしてタイマーIDを個別に保持することで、何個同時に削除してもお互いに干渉しないようにしています。
    </p>

    <h2>もう少し踏み込んで: Contextと組み合わせる</h2>
    <p>
      このUndo機能は単体のボタンだけでなく、ラベル一覧を管理しているContextと組み合わせて使うと、より実用的になります。具体的には、Contextの中にrestoreLabelという関数を用意しておき、Undoが押されたときにこの関数を呼ぶことで、消える前のラベルの情報（名前や色など）をそのまま元の位置に復元できるようにします。
    </p>
    <p>
      ここで意外と忘れがちなのが「元の位置」の扱いです。配列の末尾にラベルを追加し直すだけだと、削除する前とは並び順が変わってしまいます。restoreLabelの中では、削除した瞬間に記録しておいた元のインデックス（何番目にあったか）も一緒に保持しておき、配列のその位置に挿入し直すようにします。削除前のデータを保持するだけでなく「どこにあったか」まで覚えておく必要がある、という点が見落としやすいポイントです。
    </p>

    <h2>応用: どんなデータにも使えるようにする</h2>
    <p>
      今回はラベルに対してこの仕組みを作りましたが、考え方自体はタスクやコメントなど、ほかのデータの削除にもそのまま応用できます。useLabelDeleteの中身をよく見ると、ラベル特有の処理はほとんどなく、「何かを一時的に退避して、一定時間後に確定処理を呼ぶ」という汎用的な流れになっています。Labelという型の部分をジェネリクスにして、useDeleteWithUndo&lt;T&gt;のような形に一般化しておくと、削除を取り消せる仕組みをいろいろな場面で再利用しやすくなります。
    </p>

    <h2>まとめ</h2>
    <p>
      削除という操作は取り返しがつかないからこそ、ワンクッション置いてあげるだけでユーザーの安心感が大きく変わります。即座に消す代わりに「数秒待ってから確定する」という時間差を作ることで、Undoという選択肢を自然に用意できます。地味な機能ですが、こういう細かいところの気遣いが画面全体の使い心地につながっていきます。
    </p>
  `,
};