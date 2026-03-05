import { NextResponse } from "next/server";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

async function sendMail(data: ContactFormData) {
  console.log("メール送信データ:", data);
}

export async function POST(request: Request) {
  try {
    const formData: ContactFormData = await request.json();

    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "すべての項目を入力してください。" },
        { status: 400 }
      );
    }

    await sendMail(formData);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "送信中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}