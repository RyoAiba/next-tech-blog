import { Article } from "../index";

export const vuePerformanceOptimization: Article = {
  slug: "vue-performance-optimization",
  title: "Vueアプリが重くなる理由とパフォーマンス改善の考え方",
  description:
    "Vueアプリのパフォーマンス改善を仕組みから解説。再レンダリングの理解、computedとwatchの違い、v-ifとv-showの使い分けまで網羅します。",
  publishedAt: "2026.03.02",
  tags: [
    { name: "Vue", slug: "vue" },
    { name: "パフォーマンス", slug: "performance" },
  ],
  content: `
    <h2>なぜVueアプリは「気づいたら重くなる」のか</h2>
    <p>
      Vueは非常に書きやすいフレームワークです。
      しかし、規模が大きくなると「なんとなく動作が重い」と感じる瞬間が出てきます。
    </p>
    <p>
      多くの場合、その原因はVueの仕組みを十分に理解しないまま
      リアクティブな状態を増やしすぎていることにあります。
    </p>
    <p>
      パフォーマンス改善の第一歩は、「Vueは何をトリガーに再描画しているのか」を理解することです。
    </p>

    <h2>リアクティブシステムを理解する</h2>
    <p>
      Vueはリアクティブシステムを使って、データの変更を検知し、
      必要な部分だけを再レンダリングします。
    </p>
    <p>
      しかし、次のようなコードを書くと無駄な再計算が発生します。
    </p>
    <pre><code class="language-js">
const items = ref([...]);

const filtered = () => {
  return items.value.filter(item => item.active);
};
    </code></pre>
    <p>
      テンプレート内でfiltered()を直接呼び出すと、
      再レンダリングのたびに毎回計算が走ります。
    </p>

    <h2>computedを正しく使う</h2>
    <p>
      このケースではcomputedを使うべきです。
    </p>
    <pre><code class="language-js">
const filtered = computed(() => {
  return items.value.filter(item => item.active);
});
    </code></pre>
    <p>
      computedは依存関係を追跡し、
      必要なときだけ再計算します。
      これだけで無駄な処理を大きく減らせます。
    </p>
    <p>
      パフォーマンス改善の基本は、
      「再計算を減らすこと」です。
    </p>

    <h2>watchを乱用しない</h2>
    <p>
      watchは便利ですが、多用するとアプリは複雑になります。
    </p>
    <p>
      watchは副作用を扱うためのものです。
      データの派生にはcomputedを使う方が自然です。
    </p>
    <p>
      役割を分けるだけで、再描画や再実行の回数を減らせます。
    </p>

    <h2>v-ifとv-showの違いがパフォーマンスに影響する</h2>
    <p>
      v-ifはDOMを生成・破棄します。
      v-showはdisplayを切り替えるだけです。
    </p>
    <p>
      頻繁に表示切り替えが発生する要素はv-show、
      ほとんど表示されない要素はv-ifが向いています。
    </p>
    <p>
      この使い分けだけでも体感速度は変わります。
    </p>

    <h2>一段踏み込む：コンポーネント分割の考え方</h2>
    <p>
      大きなコンポーネントは再レンダリング範囲も大きくなります。
    </p>
    <p>
      状態が変わる範囲を意識してコンポーネントを分割すると、
      更新範囲を限定できます。
    </p>
    <p>
      これは設計レベルのパフォーマンス改善です。
      Vueの最適化はテクニックよりも構造で決まります。
    </p>

    <h2>まとめ</h2>
    <p>
      Vueのパフォーマンス改善は、
      特別な最適化テクニックから始まるわけではありません。
    </p>
    <p>
      再計算を減らす。
      再レンダリング範囲を小さくする。
      状態の責務を分ける。
    </p>
    <p>
      これらを意識するだけで、
      アプリの安定性は大きく変わります。
    </p>
  `,
};