/**
 * プライバシーポリシーページ
 */

import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

export const metadata = {
  title: "プライバシーポリシー | Usagi Blog",
  description: "Usagi Blog のプライバシーポリシーです。個人情報の取り扱いについて記載しています。",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-10 py-6 md:py-10 prose prose-zinc prose-sm md:prose-base leading-relaxed">
      {/* パンくず */}
      <Breadcrumb
        items={[
          { label: "Usagi Blog", href: "/" },
          { label: "プライバシーポリシー" },
        ]}
      />
      <h1 className="text-2xl md:text-3xl">プライバシーポリシー</h1>

      <p>
        Usagi Blog（以下「当サイト」といいます）は、利用者のプライバシーを尊重し、個人情報の保護に努めています。
        <br/>
        本プライバシーポリシーは、当サイトにおける個人情報の収集・利用・管理について定めたものです。
      </p>

      <h2>収集する情報と利用目的</h2>

      <p>
        当サイトでは以下の情報を収集することがあります。
      </p>

      <ul>
        <li>名前・ハンドルネーム</li>
        <li>メールアドレス</li>
        <li>コメント内容</li>
        <li>アクセスログ（IPアドレス、ブラウザ情報等）</li>
        <li>Cookie 情報</li>
      </ul>

      <p>
        収集した情報は以下の目的で利用します：
      </p>

      <ul>
        <li>お問い合わせの返信</li>
        <li>コメント機能の提供</li>
        <li>サイト改善のための分析</li>
        <li>スパム防止・不正アクセス対策</li>
      </ul>

      <h2>アクセス解析ツールについて</h2>
      <p>
        当サイトではアクセス解析ツールとして以下を利用しています：
      </p>
      <ul>
        <li>
          <Link
            href="https://marketingplatform.google.com/about/analytics/terms/jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
          >
            Google Analytics
            <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
          </Link>
        </li>
        <li>
          <Link
            href="https://policies.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
          >
            Google Search Console
            <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
          </Link>
        </li>
      </ul>
      <p>
        これらのツールは Cookie を用いて利用者の行動を分析する場合がありますが、個人を特定する情報は取得しません。
      </p>

      <h2>Cookie の利用について</h2>
      <p>
        当サイトでは Cookie を利用することがあります。Cookie は利便性向上やアクセス分析に使用され、個人を特定する情報は含みません。
        <br/>
        Cookie の使用を望まない場合は、ブラウザ側で拒否設定が可能です。
      </p>

      <h2>第三者提供について</h2>
      <p>
        当サイトは、法令に基づく場合を除き、利用者の個人情報を第三者に提供することはありません。
      </p>

      <h2>広告配信について</h2>
      <p>
        当サイトでは広告配信サービスを利用する場合があり、広告配信事業者が Cookie を使用して情報を収集することがあります。
        <br/>
        この情報は当サイトには提供されず、配信事業者独自のポリシーに従って扱われます。
      </p>

      <h2>個人情報の開示・訂正・削除</h2>
      <p>
        ご本人からの請求により、当サイトが保持する個人情報の開示・訂正・削除に対応いたします。
        <br/>
        希望される場合は下記お問い合わせフォームからご連絡ください。
      </p>

      <h2>免責事項</h2>
      <p>
        掲載された情報の正確性には最大限の注意を払っていますが、内容の完全性・正確性・安全性を保証するものではありません。
        <br/>
        また、当サイトの利用による損害について一切責任を負いません。
      </p>

      <h2>プライバシーポリシーの変更</h2>
      <p>
        本ポリシーは必要に応じて改訂されることがあります。
        <br/>
        改定後の内容は当サイト上に表示された時点で効力を生じます。
      </p>

      <h2>お問い合わせ</h2>
      <p>
        プライバシーに関するお問い合わせは以下のフォームからご連絡ください：
      </p>
      <p>
        <Link href="/contact" className="text-blue-600 hover:underline">
          お問い合わせフォーム
        </Link>
      </p>

      <p>最終更新日: 2026年2月22日</p>
    </main>
  );
}