import { NextResponse } from "next/server";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string; // honeypot
};

// 簡易IPレート制限用ストア
const rateLimitStore: Record<string, number> = {};

async function sendToSlack(data: ContactFormData) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("SLACK_WEBHOOK_URLが未設定です");
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `
📩 *新しいお問い合わせ*

*名前:* ${data.name}
*メール:* ${data.email}
*件名:* ${data.subject}

*内容:*
${data.message}
      `,
    }),
  });
}

export async function POST(request: Request) {
  try {
    const formData: ContactFormData = await request.json();

    /* ======================
      ① 不正アクセス対策のRefererチェック
    ====================== */
    const referer = request.headers.get("referer");

    const allowedOrigins = [
      "http://localhost:3000",
      "https://usagi-blog.vercel.app",
    ];

    if (
      !referer ||
      !allowedOrigins.some((origin) => referer.startsWith(origin))
    ) {
      return NextResponse.json(
        { error: "送信に失敗しました" },
        { status: 403 }
      );
    }

    /* ======================
      ② Bot対策のHoneypotチェック
    ====================== */
    if (formData.company) {
      return NextResponse.json({ error: "送信に失敗しました" }, { status: 400 });
    }

    const { name, email, subject, message } = formData;

    /* ======================
      ③ 必須項目チェック
    ====================== */
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "すべて入力してください" },
        { status: 400 }
      );
    }

    /* ======================
      ④ 連打対策のIPレート制限（10秒）
    ====================== */
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

    const now = Date.now();
    const lastRequestTime = rateLimitStore[ip] ?? 0;

    if (now - lastRequestTime < 10000) {
      return NextResponse.json(
        { error: "短時間での連続送信はできません" },
        { status: 429 }
      );
    }

    rateLimitStore[ip] = now;

    /* ======================
      ⑤ Slack送信
    ====================== */
    await sendToSlack(formData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "送信に失敗しました" },
      { status: 500 }
    );
  }
}