import { Article } from "../index";

export const contextSettingsMergeBug: Article = {
  slug: "context-settings-merge-bug",
  title: "オブジェクトのマージで設定が消える、地味だけど厄介なバグ",
  description:
    "ContextでデフォルトのSettingsとユーザー保存値をスプレッドでマージしたら、ネストしたオブジェクトの設定が丸ごと消えてしまった話と、その直し方をまとめました。",
  publishedAt: "2026.06.19",
  updatedAt: "2026.06.19",
  updatedAtTimestamp: 1781827200000,
  tags: [
    { name: "React", slug: "react" },
    { name: "TypeScript", slug: "typescript" },
  ],
  content: `
    <h2>設定で起きる「いつの間にか元に戻ってる」現象</h2>
    <p>
      テーマカラーやフォントサイズなど複数の項目をまとめてSettingsとして保存する場合、デフォルト値とユーザーが保存した値をマージして使う設計はよくあります。ただこのマージの実装次第で、「フォントサイズだけ変更したはずなのに、テーマカラーがデフォルトに戻ってしまう」という不思議な現象が起きることがあります。
    </p>
    <p>
      保存や読み込みの処理自体は正しく動いていても、なぜか一部の設定だけ消えてしまう。原因は保存周りではなく、オブジェクトを合体させる「マージ」の処理そのものにあります。
    </p>

    <h2>よくあるマージ処理を振り返る</h2>
    <p>
      設定は次のような形をしているとします。テーマに関する設定と、通知に関する設定をひとつのオブジェクトにまとめています。
    </p>
    <pre><code>type Settings = {
  theme: {
    color: string;
    fontSize: number;
  };
  notifications: boolean;
};

const defaultSettings: Settings = {
  theme: {
    color: "blue",
    fontSize: 14,
  },
  notifications: true,
};</code></pre>
    <p>
      ユーザーが設定を変更すると、その差分だけをlocalStorageなどに保存しておき、起動時にデフォルト値と保存された値をマージして使う、という設計はよく見かけます。マージの処理はこんな形になりがちです。
    </p>
    <pre><code>function loadSettings(stored: Partial&lt;Settings&gt;): Settings {
  return {
    ...defaultSettings,
    ...stored,
  };
}</code></pre>
    <p>
      一見問題なさそうに見えますが、ここに今回のようなバグの原因が潜んでいます。
    </p>

    <h2>なぜネストした設定が消えてしまうのか</h2>
    <p>
      スプレッド構文（...）によるマージは、オブジェクトの一番上の階層にあるキーだけを上書きする処理です。つまりthemeというキーごと、storedにあるthemeオブジェクトでそのまま置き換えてしまいます。中身を1つずつ見て合体させてくれるわけではありません。
    </p>
    <p>
      たとえばユーザーがフォントサイズだけを16に変更して保存すると、storedの中身はtheme: { fontSize: 16 }のように、変更した部分だけが入った形になります（差分だけ保存する設計のため）。これをdefaultSettingsとスプレッドでマージした結果を実際に出力してみると、こうなります。
    </p>
    <pre><code>const stored = { theme: { fontSize: 16 } };

const merged = {
  ...defaultSettings,
  ...stored,
};

console.log(merged.theme);
// { fontSize: 16 }  ← colorが消えている</code></pre>
    <p>
      本来は「colorはデフォルトのblueを引き継ぎつつ、fontSizeだけ16にしたい」のに、themeオブジェクト自体が丸ごと置き換えられてしまうので、colorの情報が消えてしまうわけです。
    </p>
    <p>
      ややこしいのは、notificationsのような単純なtrue/falseの値だけを変更する場合は、このスプレッド構文によるマージが完璧に動いてくれる、という点です。動いている部分があるからこそ「スプレッドでマージすればいい」という思い込みが生まれやすく、ネストした値で初めて綻びに気づく、という順番でバグに遭遇しやすいテーマだと思います。
    </p>
    <p>
      これは「シャローマージ（浅いマージ）」と呼ばれる挙動です。透明なシートを重ねるところを想像してみてください。1枚目のシート（デフォルト値）の上に2枚目のシート（保存された値）を重ねると、2枚目に書かれている部分はそのまま見え、書かれていない部分には1枚目の内容が透けて見えます。ただしこれが成立するのは、シートの中の「マス目」がトップレベルのキーだけのとき。マス目の中にさらに小さいマス目、つまりネストしたオブジェクトがある場合、スプレッド構文は小さいマス目の中までは透かしてくれず、2枚目のマス目をそのまま上から覆ってしまうんです。
    </p>

    <h2>解決策: ネストした階層も手動でマージする</h2>
    <p>
      直し方はシンプルで、ネストしている階層もひとつずつ展開してマージしてあげることです。
    </p>
    <pre><code>function loadSettings(stored: Partial&lt;Settings&gt;): Settings {
  return {
    ...defaultSettings,
    ...stored,
    theme: {
      ...defaultSettings.theme,
      ...stored.theme,
    },
  };
}</code></pre>
    <p>
      themeのキーだけ明示的に「デフォルトのthemeとstoredのthemeをさらにマージする」という処理を追加しています。これでstored.theme.fontSizeしか保存されていなくても、colorはdefaultSettings.themeから引き継がれるようになり、ユーザーが変更していない項目が消えることはなくなります。
    </p>

    <h3>階層が増えたらどうする?</h3>
    <p>
      今回のようにthemeという1階層のネストだけであれば手動でも十分ですが、設定の階層がもっと深くなる場合は、ひとつずつ書いていくのが大変になってきます。そういうときは再帰的にオブジェクトをマージするユーティリティ関数を自作するか、軽量なライブラリを使う選択肢もあります。簡単なケースであれば、こんなイメージの関数でも対応できます。
    </p>
    <pre><code>function isPlainObject(value: unknown): value is Record&lt;string, unknown&gt; {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge&lt;T extends Record&lt;string, unknown&gt;&gt;(base: T, override: Partial&lt;T&gt;): T {
  const result = { ...base };

  for (const key in override) {
    const overrideValue = override[key];
    const baseValue = base[key];

    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(baseValue, overrideValue) as T[keyof T];
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue as T[keyof T];
    }
  }

  return result;
}</code></pre>
    <p>
      ただし配列の扱い（上書きするのか連結するのか）など仕様で迷う部分も増えるので、設定の階層が浅いうちは、手動でマージする方が「何をしているか」が読みやすく、バグも追いやすいというのが結論です。
    </p>

    <h2>もう少し踏み込んで: そもそも差分保存をやめる選択肢</h2>
    <p>
      今回のバグは「差分だけを保存する」という設計とシャローマージが組み合わさって起きるものでした。別の解決策として、差分ではなく常に完全なSettingsオブジェクトを保存してしまう、という方法もあります。これなら保存されている値は常にすべてのキーを持っているので、マージという概念自体が不要になります。ただし設定の項目が増えるたびに保存しているデータの形を意識する必要があるので、差分保存とどちらを選ぶかは規模や設定項目の増減頻度によって変わってくるところです。
    </p>

    <h2>まとめ</h2>
    <p>
      オブジェクトのスプレッド構文によるマージは便利ですが、あくまで浅い階層でしか効いてくれません。ネストしたオブジェクトを扱うときは、ひとつ深い階層まで意識してマージしてあげる必要があります。普段何気なく使っているスプレッド構文の挙動を、改めて言葉にして理解できると、似たようなバグを未然に防げるようになります。
    </p>
  `,
};