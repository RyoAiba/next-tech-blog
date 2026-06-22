import { Article } from "../index";

export const cssAnimationMethods: Article = {
  slug: "css-animation-methods",
  title:
    "CSSアニメーション@keyframesで動くUIをサクッと作る",
  description:
    "CSSアニメーションの作り方を初心者向けに解説。@keyframesの基本からanimationプロパティの使い方、よく使うサンプルコードまでわかりやすく紹介します。",
  publishedAt: "2026.02.26",
  updatedAt: "2026.06.22",
  updatedAtTimestamp: 1782086400000,
  image: "/eyecatches/css-animation-methods.png",
  tags: [{ name: "CSS", slug: "css" }],
  content: `
    <p>CSSでアニメーションを作る方法は大きく2つあります。<code>transition</code>と<code>animation</code>です。hoverやfocusなど、状態の変化に合わせて単発の動きをつけたいだけなら<code>transition</code>で十分ですが、複数の段階を経る動きや、ループするような動きを作りたい場合は<code>animation</code>と<code>@keyframes</code>の組み合わせが必要になります。</p>
    <p>この記事では、保存ボタンを押すとトーストが出てきて、2秒後に消える、という場面を例にしながら、動きを少しずつ足していく形で@keyframesの使い方を見ていきます。</p>

    <style>
.caa-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding: 28px;
  background: #f9fafb;
  border-radius: 10px;
  margin: 16px 0;
  min-height: 140px;
}
.caa-demo-caption {
  font-size: 13px;
  color: #6b7280;
  margin: -8px 0 16px;
}
.caa-trigger-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.caa-trigger-btn:hover {
  opacity: 0.85;
}
.caa-toast {
  background: #111827;
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 動きなし */
.caa-toast--none-base {
  opacity: 0;
}

/* フェード */
.caa-toast--fade-base {
  opacity: 0;
}
.caa-toast--fade-in {
  animation: caaFadeIn 1s ease forwards;
}
.caa-toast--fade-out {
  animation: caaFadeOut 0.6s ease-in forwards;
}
@keyframes caaFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes caaFadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* スライド */
.caa-toast--slide-base {
  opacity: 0;
  transform: translateY(20px);
}
.caa-toast--slide-in {
  animation: caaSlideUp 0.6s ease-out forwards;
}
.caa-toast--slide-out {
  animation: caaSlideDown 0.5s ease-in forwards;
}
@keyframes caaSlideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes caaSlideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
}

/* スピナー・フロート */
.caa-spinner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  animation: caaSpin 0.8s linear infinite;
}
@keyframes caaSpin {
  to { transform: rotate(360deg); }
}
.caa-float {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: #2563eb;
  animation: caaFloat 2s ease-in-out infinite alternate;
}
@keyframes caaFloat {
  from { transform: translateY(0); }
  to { transform: translateY(-14px); }
}
    </style>

    <h2>まずは動きなしの状態を見てみる</h2>
    <p>
      「保存」ボタンを押すと、その場で「保存しました」というトーストが出てきて、2秒後に消える、という動きを作っていきます。まずはアニメーションをつけない状態です。
    </p>
    <div class="caa-demo">
      <button
        type="button"
        class="caa-trigger-btn"
        onclick="var el=document.getElementById('caa-none-toast'); clearTimeout(el._caaTimer); el.style.opacity='1'; el._caaTimer=setTimeout(function(){ el.style.opacity='0'; }, 2000);"
      >保存</button>
      <div class="caa-toast caa-toast--none-base" id="caa-none-toast">保存しました</div>
    </div>
    <div class="caa-demo-caption">ボタンを押してみてください。トーストがパッと現れて、パッと消えます</div>
    <p>
      表示も非表示も一瞬で切り替わるだけなので、見ているところと違う場所にトーストが出ると、気づかないまま消えてしまうことがあります。動きをつける一番の目的は、装飾ではなく「ここで何かが起きた」という変化そのものに気づいてもらうことです。
    </p>

    <h2>フェードインを加える</h2>
    <pre><code class="language-css">@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.toast.show {
  animation: fadeIn 1s ease forwards;
}

.toast.hide {
  animation: fadeOut 0.6s ease-in forwards;
}</code></pre>
    <div class="caa-demo">
      <button
        type="button"
        class="caa-trigger-btn"
        onclick="
          var el=document.getElementById('caa-fade-toast');
          clearTimeout(el._caaTimer);
          el.classList.remove('caa-toast--fade-in','caa-toast--fade-out');
          void el.offsetWidth;
          el.classList.add('caa-toast--fade-in');
          el._caaTimer=setTimeout(function(){
            el.classList.remove('caa-toast--fade-in');
            void el.offsetWidth;
            el.classList.add('caa-toast--fade-out');
          }, 2000);
        "
      >保存</button>
      <div class="caa-toast caa-toast--fade-base" id="caa-fade-toast">保存しました</div>
    </div>
    <div class="caa-demo-caption">出てくるときはfadeIn、消えるときはfadeOutを再生しています</div>
    <p>
      じわっと現れて、じわっと消えるようになりました。出てくる動きと消える動きを、それぞれ別の<code>@keyframes</code>として用意しているのがポイントです。消える方には<code>ease-in</code>を使っていて、これは後ほど触れますが「消えていく動き」に合う性質を持っています。
    </p>

    <h2>位置の変化を組み合わせる</h2>
    <pre><code class="language-css">@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
}

.toast.show {
  animation: slideUp 0.6s ease-out forwards;
}

.toast.hide {
  animation: slideDown 0.5s ease-in forwards;
}</code></pre>
    <div class="caa-demo">
      <button
        type="button"
        class="caa-trigger-btn"
        onclick="
          var el=document.getElementById('caa-slide-toast');
          clearTimeout(el._caaTimer);
          el.classList.remove('caa-toast--slide-in','caa-toast--slide-out');
          void el.offsetWidth;
          el.classList.add('caa-toast--slide-in');
          el._caaTimer=setTimeout(function(){
            el.classList.remove('caa-toast--slide-in');
            void el.offsetWidth;
            el.classList.add('caa-toast--slide-out');
          }, 2000);
        "
      >保存</button>
      <div class="caa-toast caa-toast--slide-base" id="caa-slide-toast">保存しました</div>
    </div>
    <div class="caa-demo-caption">下から持ち上がって出てきて、2秒後に下へ戻りながら消えます</div>
    <p>
      出てくるときは<code>ease-out</code>で下から持ち上がり、消えるときは<code>ease-in</code>で下に戻りながらフェードアウトする、という対の動きにしています。<code>ease-out</code>には、なんとなく心地よく見えるという以上の理由があります。Googleのデザインガイドライン「Material Design」では、現実の物体は瞬間的に止まらず徐々に減速することを踏まえて、イージングのない動きは硬く機械的に見え、自然な減速を伴う動きの方が自然に感じられると説明されています。<code>ease-out</code>は「勢いよく入ってきて、最後にすっと止まる」動きなので現れる場面に合い、逆に<code>ease-in</code>は「ゆっくり動き出して、最後に速く去っていく」動きなので、消えていく場面に合っています。
    </p>

    <h2>ループするアニメーション</h2>
    <p>
      トーストのような一度きりの動きとは別に、ローディングスピナーのようにずっと繰り返す動きもあります。
    </p>
    <pre><code class="language-css">@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 0.8s linear infinite;
}</code></pre>
    <div class="caa-demo" style="flex-direction: row; align-items: center;">
      <div class="caa-spinner"></div>
    </div>
    <p>
      <code>animation-iteration-count: infinite</code>で繰り返し、回転のような動きには<code>linear</code>（一定速度）がよく合います。往復するような動きには<code>animation-direction: alternate</code>を使うと、行きと帰りを自動で切り替えてくれます。
    </p>
    <pre><code class="language-css">@keyframes float {
  from { transform: translateY(0); }
  to { transform: translateY(-14px); }
}

.box {
  animation: float 2s ease-in-out infinite alternate;
}</code></pre>
    <div class="caa-demo" style="flex-direction: row; align-items: center;">
      <div class="caa-float"></div>
    </div>
    <p>
      ループするアニメーションは画面に映り続けるので、派手すぎると気が散る原因になります。AppleのHuman Interface Guidelinesでも、アニメーションのためのアニメーションは避けるべきで、過剰な動きは利用者を疲れさせると注意されています。ループ系の動きは、振れ幅を小さめにしておくのが無難です。
    </p>

    <h2>動きの質感を決めるtiming-function</h2>
    <p>
      先ほど触れた<code>ease-out</code>や<code>ease-in</code>のように、動き始めと終わりの速度のつき方を決めるのが<code>animation-timing-function</code>です。よく使う値をまとめます。
    </p>
    <table>
      <thead>
        <tr>
          <th>値</th>
          <th>動きの特徴</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ease</td>
          <td>開始と終了がゆっくり</td>
        </tr>
        <tr>
          <td>linear</td>
          <td>一定速度</td>
        </tr>
        <tr>
          <td>ease-in</td>
          <td>徐々に加速（画面から消えていく動きに合う）</td>
        </tr>
        <tr>
          <td>ease-out</td>
          <td>徐々に減速（画面に現れる動きに合う）</td>
        </tr>
        <tr>
          <td>ease-in-out</td>
          <td>加速してから減速（往復する動きに合う）</td>
        </tr>
      </tbody>
    </table>

    <h3>複数のアニメーションをまとめて指定する</h3>
    <pre><code class="language-css">.box {
  animation:
    fadeIn 1s ease,
    floating 3s ease-in-out infinite;
}</code></pre>
    <p>
      カンマで区切ると、1つの要素に複数のアニメーションを同時に適用できます。
    </p>

    <h2>まとめ</h2>
    <p>
      同じ「トーストを出して、2秒後に消す」という動きでも、フェードだけ、スライドを足す、出るときと消えるときでイージングを変える、というように少しずつ調整するだけで印象がかなり変わります。最初から全部のプロパティを覚える必要はなく、まずは1つの動きを作って、足りないと感じた部分にdelayやiteration-count、timing-functionを足していくくらいで十分です。
    </p>
  `,
};