"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // Bot対策用ダミー

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isValid =
    name.trim() &&
    email.trim() &&
    subject.trim() &&
    message.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !subject || !message) {
      setError("すべての項目を入力してください。");
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("正しいメールアドレスを入力してください。");
      return;
    }

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message, company }),
    });

    const json = await res.json();

    if (json.error) {
      setError(json.error);
    } else {
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setCompany("");
    }
  };

  return (
    <>
      {success && (
        <p className="text-green-600 mb-4">
          お問い合わせを送信しました。
        </p>
      )}
      {error && <p className="text-[#ff4b4b] mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 text-zinc-700">
        <div>
          <div className="flex mb-1">
            <label className="block font-bold">名前</label>
            <div className="ml-2 h-5 self-center px-1.5 py-0.75 bg-[#ff4b4b] text-xs text-white rounded">必須</div>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-zinc-300 px-3 py-2 bg-white rounded"
          />
        </div>
        <div>
          <div className="flex mb-1">
            <label className="block font-bold">メールアドレス</label>
            <div className="ml-2 h-5 self-center px-1.5 py-0.75 bg-[#ff4b4b] text-xs text-white rounded">必須</div>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-zinc-300 px-3 py-2 bg-white rounded"
          />
        </div>
        <div>
          <div className="flex mb-1">
            <label className="block font-bold">件名</label>
            <div className="ml-2 h-5 self-center px-1.5 py-0.75 bg-[#ff4b4b] text-xs text-white rounded">必須</div>
          </div>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-zinc-300 px-3 py-2 bg-white rounded"
          />
        </div>
        <div>
          <div className="flex mb-1">
            <label className="block font-bold">お問い合わせ内容</label>
            <div className="ml-2 h-5 self-center px-1.5 py-0.75 bg-[#ff4b4b] text-xs text-white rounded">必須</div>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full max-h-50 min-h-20 md:h-30 border border-zinc-300 px-3 py-2 bg-white rounded"
            rows={6}
          ></textarea>
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={!isValid}
            className={`
              font-semibold px-5 py-2 rounded
              ${isValid
                ? "bg-[var(--brand-500)] text-white cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-default"}
            `}
          >
            送信する
          </button>
        </div>
        {/* Bot対策（Honeypot） */}
        <input
          type="text"
          name="company"
          value=""
          onChange={() => { }}
          className="hidden"
        />
      </form>
    </>
  );
}