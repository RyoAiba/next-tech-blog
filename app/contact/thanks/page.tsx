import Link from "next/link";

export default function ThanksPage() {

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-2 pb-8">

      <p className="text-lg font-semibold text-zinc-800 mb-2">
        お問い合わせを受け付けました。
      </p>

      <p className="text-sm text-zinc-500 mt-6">
        お問い合わせいただきありがとうございます。
      </p>
      <p className="text-sm text-zinc-500 mb-6">
        確認にお時間をいただく場合がありますので、ご了承くださいませ。
      </p>

      <Link
        href="/"
        className="bg-[var(--brand-500)] text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
      >
        トップページへ戻る
      </Link>
    </div>
  );
}