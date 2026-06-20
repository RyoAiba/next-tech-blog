import { Article } from "../index";

export const vueCompositionVsOptions: Article = {
  slug: "vue-composition-vs-options",
  title: "Vue の Composition API と Options API — 何が違って、どちらを選べばいいか",
  description:
    "Vue 3 で導入された Composition API と、従来の Options API の違いをコードで比較しながら整理します。今から Vue を書くならどちらを選ぶべきかまで解説します。",
  publishedAt: "2026.03.06",
  updatedAt: undefined,
  updatedAtTimestamp: undefined,
  tags: [
    { name: "Vue.js", slug: "vue.js" },
    { name: "TypeScript", slug: "typescript" },
  ],
  content: `
<p>
  Vue を使い始めると「Options API と Composition API、どっちで書けばいいの？」という疑問にぶつかります。<br />
  ドキュメントや記事によって書き方がまちまちで、どちらが正解か分からない——そういう状態になりやすいポイントです。
</p>
<p>
  この記事では両者の違いを具体的なコードで比較しながら、今から Vue を書くならどちらを選ぶべきかまで整理します。
</p>

<h2>Options API とは</h2>
<p>
  Options API は Vue 2 から使われてきた、従来の書き方です。<br />
  コンポーネントを <code>data</code>・<code>methods</code>・<code>computed</code>・<code>mounted</code> といった「役割別のブロック（オプション）」に分けて定義します。
</p>

<pre><code class="language-vue">&lt;script&gt;
export default {
  data() {
    return {
      count: 0,
      message: "",
    };
  },
  computed: {
    doubleCount() {
      return this.count * 2;
    },
  },
  methods: {
    increment() {
      this.count++;
    },
    async fetchMessage() {
      const res = await fetch("/api/message");
      const data = await res.json();
      this.message = data.text;
    },
  },
  mounted() {
    this.fetchMessage();
  },
};
&lt;/script&gt;
</code></pre>

<p>
  役割ごとにブロックが分かれているため、構造を把握しやすいのが特徴です。<br />
  「状態は data に、処理は methods に」という置き場所のルールがはっきりしています。
</p>

<h2>Composition API とは</h2>
<p>
  Composition API は Vue 3 で正式導入された、新しい書き方です。<br />
  <code>&lt;script setup&gt;</code> の中に、状態・処理・ライフサイクルをまとめて書きます。
</p>

<pre><code class="language-vue">&lt;script setup&gt;
import { ref, computed, onMounted } from "vue";

const count = ref(0);
const message = ref("");

const doubleCount = computed(() => count.value * 2);

function increment() {
  count.value++;
}

async function fetchMessage() {
  const res = await fetch("/api/message");
  const data = await res.json();
  message.value = data.text;
}

onMounted(() => {
  fetchMessage();
});
&lt;/script&gt;
</code></pre>

<p>
  <code>&lt;script setup&gt;</code> はボイラープレート（定型コード）が少なく、定義した変数や関数をそのままテンプレートで使えます。<br />
  Vue 3 以降のコードでは、この書き方がほぼ標準になっています。
</p>

<h2>同じ機能を並べて比較する</h2>
<p>
  「検索キーワードを入力して結果を取得する」という同じ機能を、両方の書き方で実装してみます。
</p>

<h3>Options API</h3>
<pre><code class="language-vue">&lt;script&gt;
export default {
  data() {
    return {
      searchQuery: "",
      results: [],
    };
  },
  methods: {
    async search() {
      const res = await fetch(\`/api/search?q=\${this.searchQuery}\`);
      this.results = await res.json();
    },
  },
};
&lt;/script&gt;
</code></pre>

<h3>Composition API</h3>
<pre><code class="language-vue">&lt;script setup&gt;
import { ref } from "vue";

const searchQuery = ref("");
const results = ref([]);

async function search() {
  const res = await fetch(\`/api/search?q=\${searchQuery.value}\`);
  results.value = await res.json();
}
&lt;/script&gt;
</code></pre>

<p>
  機能は同じですが、Composition API の方が記述量が少なく、状態と処理が近くに並ぶため流れを追いやすくなっています。
</p>

<h2>Options API のメリット・デメリット</h2>

<h3>メリット</h3>
<ul>
  <li><strong>置き場所が決まっている</strong> — data・methods・computed とブロックが分かれているため、どこに何を書くか迷いにくい</li>
  <li><strong>Vue 2 からの移行がしやすい</strong> — Vue 2 の経験があれば、ほぼそのままの感覚で書ける</li>
  <li><strong>最初の学習コストが低め</strong> — 構造が直感的で、入門書でもよく使われる</li>
</ul>

<h3>デメリット</h3>
<ul>
  <li><strong>関連コードが分散する</strong> — 検索機能に関する状態は <code>data</code>、処理は <code>methods</code> と離れるため、機能が増えると追いにくくなる</li>
  <li><strong>TypeScript との相性がやや弱い</strong> — <code>this</code> を多用する構造上、型推論が効きにくい場面がある</li>
  <li><strong>ロジックの再利用が難しい</strong> — コンポーネントをまたいだロジック共有が mixins 頼みになりやすく、管理が複雑になりがち</li>
</ul>

<h2>Composition API のメリット・デメリット</h2>

<h3>メリット</h3>
<ul>
  <li><strong>機能単位でコードをまとめられる</strong> — 状態・処理・ライフサイクルを関連する機能ごとにまとめて書けるため、コードが追いやすい</li>
  <li><strong>TypeScript との相性が良い</strong> — <code>this</code> を使わないため型推論が効きやすく、型安全に書きやすい</li>
  <li><strong>ロジックをコンポーザブルとして切り出せる</strong> — 再利用したいロジックを独立した関数として扱えるため、複数コンポーネントで共有しやすい</li>
</ul>

<h3>デメリット</h3>
<ul>
  <li><strong>最初は概念が多い</strong> — <code>ref</code>・<code>reactive</code>・<code>.value</code> など、慣れるまでに覚えることがまとめて出てくる</li>
  <li><strong>自由度が高い分、設計が問われる</strong> — コードの置き場所に決まりがないため、チームや個人で方針を決める必要がある</li>
</ul>

<h2>Composition API の強み — コンポーザブル</h2>
<p>
  Composition API の大きな強みのひとつが、ロジックを<strong>コンポーザブル</strong>として切り出せることです。<br />
  React でいうカスタムフックに近い概念で、状態と処理をセットにして関数として持ち運べます。
</p>
<p>
  たとえばフェッチの状態管理（loading・error・data）を複数コンポーネントで使いたい場合、こんな形で共通化できます。
</p>

<pre><code class="language-typescript">// composables/useFetch.ts
import { ref } from "vue";

export function useFetch&lt;T&gt;(url: string) {
  const data = ref&lt;T | null&gt;(null);
  const loading = ref(false);
  const error = ref&lt;string | null&gt;(null);

  async function execute() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(\`エラー: \${res.status}\`);
      data.value = await res.json();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "取得失敗";
    } finally {
      loading.value = false;
    }
  }

  return { data, loading, error, execute };
}
</code></pre>

<pre><code class="language-vue">&lt;script setup&gt;
import { onMounted } from "vue";
import { useFetch } from "@/composables/useFetch";

const { data: items, loading, error, execute } = useFetch("/api/items");

onMounted(() => {
  execute();
});
&lt;/script&gt;
</code></pre>

<p>
  Options API の <code>mixins</code> でも似たことはできましたが、どのプロパティがどこから来たか分かりにくくなる問題がありました。<br />
  コンポーザブルは分割代入で明示的に受け取るため、出どころが一目で分かります。
</p>

<h2>結局どちらを選べばいいか</h2>
<p>
  Vue の公式ドキュメントでも言及されていますが、<strong>今から新しく書くなら Composition API を選ぶのがおすすめです。</strong>
</p>
<ul>
  <li>Vue 3 以降の標準的な書き方であり、今後もこちらが主流になっていく</li>
  <li>TypeScript との相性が良く、型安全に書きやすい</li>
  <li>コンポーザブルによるロジック再利用が柔軟にできる</li>
</ul>
<p>
  一方で、既存の Vue 2 プロジェクトを保守している・チームが Options API に慣れているといった場合は、無理に移行する必要はありません。<br />
  Vue 3 でも Options API は引き続きサポートされており、両者を混在させることも可能です。
</p>

<h2>まとめ</h2>
<ul>
  <li><strong>Options API</strong> — Vue 2 からの書き方。役割別ブロックで構造が分かりやすい。TypeScript との相性はやや弱め</li>
  <li><strong>Composition API</strong> — Vue 3 で導入。機能単位でコードをまとめられ、TypeScript との相性も良い。今から書くならこちら</li>
  <li><strong>コンポーザブル</strong> — Composition API を活かしたロジック再利用の仕組み。React のカスタムフックに近い概念</li>
</ul>
<p>
  最初は <code>ref</code> や <code>.value</code> に慣れるまで少し時間がかかるかもしれませんが、慣れてくると Composition API の方がコードを追いやすくなってきます。<br />
  まずは小さなコンポーネントから試してみるのがスムーズな入り方です。
</p>
  `,
};