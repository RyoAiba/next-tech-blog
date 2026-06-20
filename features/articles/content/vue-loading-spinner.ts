import { Article } from "../index";

export const vueLoadingSpinner: Article = {
  slug: "vue-loading-spinner",
  title: "Vue × CSS でローディング状態を作る — スピナーとスケルトンスクリーンの実装",
  description:
    "APIのデータ取得中に何を表示するかは、UXの印象を大きく左右します。Vue 3 でスピナーとスケルトンスクリーンを実装する方法をコード付きで解説します。",
  publishedAt: "2026.03.06",
  updatedAt: undefined,
  updatedAtTimestamp: undefined,
  tags: [
    { name: "Vue.js", slug: "vue.js" },
    { name: "CSS", slug: "css" },
    { name: "UI", slug: "ui" },
  ],
  content: `
<p>
  API からデータを取得するとき、レスポンスが返ってくるまでの間に何も表示しないと「壊れているのかな」とユーザーに思わせてしまいます。<br />
  ローディング状態の表示は、体験の品質を地味に左右する重要なポイントです。
</p>
<p>
  代表的なアプローチは2つあります。<strong>スピナー</strong>（くるくる回るアイコン）と<strong>スケルトンスクリーン</strong>（コンテンツの形をグレーのブロックで先に表示する）です。<br />
  それぞれの実装を Vue 3 + CSS で組んでいきます。
</p>

<h2>まず状態の管理を整理する</h2>
<p>
  ローディング表示に必要な状態は、基本的に3つです。
</p>
<ul>
  <li><strong>loading</strong> — データ取得中かどうか</li>
  <li><strong>data</strong> — 取得したデータ</li>
  <li><strong>error</strong> — 取得失敗時のエラー情報</li>
</ul>
<p>
  この3つを <code>ref</code> で管理して、<code>v-if</code> / <code>v-else-if</code> / <code>v-else</code> で表示を切り替えるのが基本パターンです。
</p>

<pre><code class="language-vue">&lt;script setup lang="ts"&gt;
import { ref, onMounted } from "vue";

type Item = {
  id: number;
  title: string;
  description: string;
};

const items = ref&lt;Item[]&gt;([]);
const loading = ref(false);
const error = ref&lt;string | null&gt;(null);

async function fetchItems() {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch("/api/items");
    if (!res.ok) throw new Error(\`取得失敗: \${res.status}\`);
    items.value = await res.json();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "エラーが発生しました";
  } finally {
    // 成功・失敗に関わらず loading を解除する
    loading.value = false;
  }
}

onMounted(() => {
  fetchItems();
});
&lt;/script&gt;
</code></pre>

<p>
  <code>finally</code> で <code>loading.value = false</code> にしているのがポイントです。<br />
  成功しても失敗しても必ず loading が解除されるため、「ずっとローディングが出続ける」という事故を防げます。
</p>

<h2>スピナーを実装する</h2>
<p>
  スピナーはシンプルで実装コストが低く、どんな場面でも使いやすいローディング表示です。<br />
  CSS の <code>animation</code> と <code>border</code> だけで作れます。
</p>

<pre><code class="language-vue">&lt;template&gt;
  &lt;div class="container"&gt;
    &lt;div v-if="loading" class="spinner-wrapper"&gt;
      &lt;div class="spinner"&gt;&lt;/div&gt;
    &lt;/div&gt;

    &lt;p v-else-if="error" class="error"&gt;{{ error }}&lt;/p&gt;

    &lt;ul v-else&gt;
      &lt;li v-for="item in items" :key="item.id" class="item"&gt;
        &lt;p class="item-title"&gt;{{ item.title }}&lt;/p&gt;
        &lt;p class="item-description"&gt;{{ item.description }}&lt;/p&gt;
      &lt;/li&gt;
    &lt;/ul&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;style scoped&gt;
.spinner-wrapper {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
&lt;/style&gt;
</code></pre>

<p>
  仕組みはシンプルで、円形のボーダーのうち上側だけ色を変えて、それを <code>rotate</code> でぐるぐる回しているだけです。<br />
  <code>border-top-color</code> をブランドカラーに合わせるだけで雰囲気が変わります。
</p>

<h2>スケルトンスクリーンを実装する</h2>
<p>
  スケルトンスクリーンは、コンテンツの形をグレーのブロックで先に表示しておく手法です。<br />
  SNS やメディア系サイトでよく見かける、リスト・カード形式の UI に特に向いています。
</p>
<p>
  スピナーと違い「どんなコンテンツが来るか」の形を先に見せられるため、待ち時間の体感が短く感じられる効果があります。
</p>

<pre><code class="language-vue">&lt;template&gt;
  &lt;div class="container"&gt;
    &lt;!-- スケルトン表示 --&gt;
    &lt;ul v-if="loading"&gt;
      &lt;li v-for="n in 4" :key="n" class="skeleton-item"&gt;
        &lt;div class="skeleton skeleton-title"&gt;&lt;/div&gt;
        &lt;div class="skeleton skeleton-description"&gt;&lt;/div&gt;
      &lt;/li&gt;
    &lt;/ul&gt;

    &lt;p v-else-if="error" class="error"&gt;{{ error }}&lt;/p&gt;

    &lt;ul v-else&gt;
      &lt;li v-for="item in items" :key="item.id" class="item"&gt;
        &lt;p class="item-title"&gt;{{ item.title }}&lt;/p&gt;
        &lt;p class="item-description"&gt;{{ item.description }}&lt;/p&gt;
      &lt;/li&gt;
    &lt;/ul&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;style scoped&gt;
.skeleton {
  background: linear-gradient(
    90deg,
    #e5e7eb 25%,
    #f3f4f6 50%,
    #e5e7eb 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-item {
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
}

.skeleton-title {
  height: 16px;
  width: 60%;
  margin-bottom: 8px;
}

.skeleton-description {
  height: 12px;
  width: 90%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
&lt;/style&gt;
</code></pre>

<p>
  光が流れるような shimmer アニメーションは、<code>background-position</code> を動かすことで表現しています。<br />
  <code>v-for="n in 4"</code> でスケルトンを4件分並べているのは、実際のデータが来たときにレイアウトが大きく変わらないようにするためです。
</p>

<h2>スピナーとスケルトン、どちらを選ぶか</h2>
<p>
  どちらを使うかはコンテンツの性質と実装コストのバランスで判断するのが現実的です。
</p>

<table>
  <thead>
    <tr>
      <th></th>
      <th>スピナー</th>
      <th>スケルトンスクリーン</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>向いている場面</td>
      <td>送信中・処理中など一時的な待機</td>
      <td>リスト・カードなど構造が決まったコンテンツ</td>
    </tr>
    <tr>
      <td>実装コスト</td>
      <td>低い</td>
      <td>やや高い（コンテンツに合わせた形作りが必要）</td>
    </tr>
    <tr>
      <td>体験の印象</td>
      <td>シンプル・汎用的</td>
      <td>表示後のガタつきが少なく、より洗練された印象</td>
    </tr>
  </tbody>
</table>

<p>
  迷ったらまずスピナーで実装して、UX を改善したいタイミングでスケルトンに移行するのが現実的な進め方です。
</p>

<h2>コンポーザブルに切り出すとさらに使いやすくなる</h2>
<p>
  複数のコンポーネントで同じローディング処理を書くのは手間です。<br />
  コンポーザブルとして切り出しておくと、どこからでも使い回せます。
</p>

<pre><code class="language-typescript">// composables/useAsync.ts
import { ref } from "vue";

export function useAsync&lt;T&gt;(fn: () => Promise&lt;T&gt;) {
  const data = ref&lt;T | null&gt;(null);
  const loading = ref(false);
  const error = ref&lt;string | null&gt;(null);

  async function execute() {
    loading.value = true;
    error.value = null;
    try {
      data.value = await fn();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "エラーが発生しました";
    } finally {
      loading.value = false;
    }
  }

  return { data, loading, error, execute };
}
</code></pre>

<pre><code class="language-vue">&lt;script setup lang="ts"&gt;
import { onMounted } from "vue";
import { useAsync } from "@/composables/useAsync";

const { data: items, loading, error, execute } = useAsync(async () => {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error(\`取得失敗: \${res.status}\`);
  return res.json();
});

onMounted(() => {
  execute();
});
&lt;/script&gt;
</code></pre>

<p>
  コンポーザブルについては<a href="/articles/vue-composition-api-vs-options-api">Composition API の記事</a>でも詳しく解説しているので、合わせて読んでみてください。
</p>

<h2>まとめ</h2>
<ul>
  <li><strong>loading / data / error</strong> の3状態を <code>ref</code> で管理して <code>v-if</code> で切り替えるのが基本</li>
  <li><code>finally</code> で <code>loading = false</code> にして、成功・失敗どちらでも解除されるようにする</li>
  <li><strong>スピナー</strong> は実装コストが低く汎用的。まず試すならこちら</li>
  <li><strong>スケルトン</strong> はリスト・カードに向いており、レイアウトのガタつきを防ぎ体験が洗練される</li>
  <li>複数コンポーネントで使うなら<strong>コンポーザブル</strong>に切り出すとスッキリする</li>
</ul>
  `,
};