import { Article } from "../index";

export const vuePiniaIntroduction: Article = {
  slug: "vue-pinia-introduction",
  title: "Pinia 入門 — Vuex から何が変わって、なぜ使いやすいのか",
  description:
    "Vue 3 の標準的な状態管理ライブラリとして定着した Pinia。Vuex との違いや基本的な使い方、TypeScript との相性の良さをコードで解説します。",
  publishedAt: "2026.03.06",
  updatedAt: undefined,
  updatedAtTimestamp: undefined,
  tags: [
    { name: "Vue.js", slug: "vue.js" },
    { name: "TypeScript", slug: "typescript" },
  ],
  content: `
<p>
  Vue でアプリを作っていると、コンポーネントをまたいで状態を共有したい場面が出てきます。<br />
  そういうときに使うのが状態管理ライブラリで、Vue 3 では <strong>Pinia（ピーニャ）</strong> が事実上の標準になっています。
</p>
<p>
  以前は Vuex が使われていましたが、Vue 3 以降は Pinia が公式に推奨されており、新規プロジェクトでは Pinia を選ぶのが一般的です。<br />
  この記事では Vuex と何が変わったのか、そして Pinia の基本的な使い方を解説します。
</p>

<h2>状態管理ライブラリがなぜ必要か</h2>
<p>
  Vue の <code>ref</code> や <code>reactive</code> はコンポーネント内の状態管理に使いますが、複数のコンポーネントで同じ状態を扱うには工夫が必要です。
</p>
<p>
  たとえば「ログイン中のユーザー情報」を、ヘッダー・サイドバー・メインコンテンツの3箇所で使いたいとします。<br />
  素直に実装すると props のバケツリレーになり、コンポーネントの階層が深くなるほど管理が複雑になります。
</p>
<p>
  状態管理ライブラリは、こういった「アプリ全体で共有したい状態」をひとつの場所で管理するための仕組みです。
</p>

<h2>Vuex から Pinia へ — 何が変わったか</h2>
<p>
  Vuex は Vue 2 から使われてきた状態管理ライブラリで、<strong>state・mutations・actions・getters</strong> という4つのブロックで状態を管理していました。
</p>

<pre><code class="language-javascript">// Vuex の書き方（参考）
const store = createStore({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    async fetchCount({ commit }) {
      const res = await fetch("/api/count");
      const data = await res.json();
      commit("increment");
    },
  },
  getters: {
    doubleCount: (state) => state.count * 2,
  },
});
</code></pre>

<p>
  状態を変更するには必ず mutations を経由しなければならず、非同期処理は actions に書く——という制約があったため、シンプルな処理でも記述量が多くなりがちでした。<br />
  また TypeScript との相性も良いとは言えず、型定義のためのボイラープレートが多くなっていました。
</p>
<p>
  Pinia はこれらの課題を解消した後継ライブラリで、Vue 3 の Composition API と非常に相性よく設計されています。
</p>

<h2>Pinia のインストール</h2>

<pre><code class="language-bash">npm install pinia
</code></pre>

<pre><code class="language-typescript">// main.ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

const app = createApp(App);
app.use(createPinia());
app.mount("#app");
</code></pre>

<h2>Store を定義する</h2>
<p>
  Pinia の Store は <code>defineStore</code> で定義します。<br />
  構造は Composition API と同じ感覚で書けます。
</p>

<pre><code class="language-typescript">// stores/counter.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCounterStore = defineStore("counter", () => {
  // state
  const count = ref(0);

  // getter
  const doubleCount = computed(() => count.value * 2);

  // action
  function increment() {
    count.value++;
  }

  async function fetchCount() {
    const res = await fetch("/api/count");
    const data = await res.json();
    count.value = data.count;
  }

  return { count, doubleCount, increment, fetchCount };
});
</code></pre>

<p>
  Vuex と比べると、<code>mutations</code> が不要になっています。<br />
  Vuex では「状態の変更は必ず mutations 経由」というルールがありましたが、Pinia ではそのような制約がなく、<code>ref</code> に直接代入するだけで状態を更新できます。
</p>
<p>
  また、非同期処理も <code>actions</code> という専用ブロックを設ける必要がなく、ただの <code>async function</code> として定義するだけです。<br />
  これにより Vuex より大幅にコードがシンプルになります。
</p>

<h2>コンポーネントから使う</h2>
<p>
  コンポーネントからは、定義した Store を呼び出すだけで使えます。
</p>

<pre><code class="language-vue">&lt;script setup lang="ts"&gt;
import { useCounterStore } from "@/stores/counter";

const store = useCounterStore();
&lt;/script&gt;

&lt;template&gt;
  &lt;div&gt;
    &lt;p&gt;カウント: {{ store.count }}&lt;/p&gt;
    &lt;p&gt;2倍: {{ store.doubleCount }}&lt;/p&gt;
    &lt;button @click="store.increment"&gt;+1&lt;/button&gt;
    &lt;button @click="store.fetchCount"&gt;サーバーから取得&lt;/button&gt;
  &lt;/div&gt;
&lt;/template&gt;
</code></pre>

<p>
  <code>store.count</code>・<code>store.increment</code> のように、定義したものをそのままドット記法で使えます。<br />
  Vuex の <code>this.$store.commit("increment")</code> のような書き方は不要です。
</p>

<h3>分割代入するときの注意点</h3>
<p>
  Store の値を分割代入で取り出すと、リアクティビティ（値の変化が画面に反映される仕組み）が失われてしまいます。
</p>

<pre><code class="language-typescript">// ❌ リアクティビティが失われる
const { count, increment } = useCounterStore();

// ✅ storeToRefs を使うと状態だけリアクティビティを保てる
import { storeToRefs } from "pinia";

const store = useCounterStore();
const { count, doubleCount } = storeToRefs(store); // 状態は storeToRefs で
const { increment, fetchCount } = store;            // アクションは直接分割代入でOK
</code></pre>

<p>
  状態（ref・computed）は <code>storeToRefs</code> で、アクション（関数）はそのまま分割代入するのが正しい使い方です。
</p>

<h2>複数の Store を使う</h2>
<p>
  Pinia は複数の Store を作ることができ、Store 同士で参照し合うことも可能です。<br />
  Vuex のような「モジュール」という概念が不要で、ファイルを分けるだけでスッキリ管理できます。
</p>

<pre><code class="language-typescript">// stores/user.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const userName = ref("");
  const isLoggedIn = ref(false);

  function login(name: string) {
    userName.value = name;
    isLoggedIn.value = true;
  }

  function logout() {
    userName.value = "";
    isLoggedIn.value = false;
  }

  return { userName, isLoggedIn, login, logout };
});
</code></pre>

<pre><code class="language-typescript">// 別の Store から参照する例
import { defineStore } from "pinia";
import { useUserStore } from "./user";

export const useCartStore = defineStore("cart", () => {
  const userStore = useUserStore();

  function checkout() {
    if (!userStore.isLoggedIn) {
      console.warn("ログインが必要です");
      return;
    }
    // 購入処理...
  }

  return { checkout };
});
</code></pre>

<h2>Vuex との比較まとめ</h2>
<table>
  <thead>
    <tr>
      <th></th>
      <th>Vuex</th>
      <th>Pinia</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>対応バージョン</td>
      <td>Vue 2 / 3</td>
      <td>Vue 3（推奨）</td>
    </tr>
    <tr>
      <td>状態の変更</td>
      <td>必ず mutations 経由</td>
      <td>直接代入でOK</td>
    </tr>
    <tr>
      <td>非同期処理</td>
      <td>actions に書く</td>
      <td>ただの async 関数でOK</td>
    </tr>
    <tr>
      <td>TypeScript</td>
      <td>型定義が複雑になりやすい</td>
      <td>型推論が効きやすくシンプル</td>
    </tr>
    <tr>
      <td>コード量</td>
      <td>多め</td>
      <td>少なくて済む</td>
    </tr>
  </tbody>
</table>

<h2>まとめ</h2>
<ul>
  <li><strong>Pinia</strong> は Vue 3 の公式推奨状態管理ライブラリ。Vuex の後継にあたる</li>
  <li><code>mutations</code> が不要になり、状態の変更が直接代入でできるためコードがシンプル</li>
  <li>Composition API と同じ感覚で書けて、TypeScript との相性も良い</li>
  <li>分割代入するときは <code>storeToRefs</code> を使うとリアクティビティが保たれる</li>
  <li>複数 Store をファイル分割で管理できるため、Vuex のモジュール管理より見通しが良い</li>
</ul>
<p>
  Vuex を使ったことがある人なら、Pinia の書き方は明らかにシンプルに感じると思います。<br />
  新規プロジェクトであれば迷わず Pinia を選んで問題ありません。
</p>
  `,
};