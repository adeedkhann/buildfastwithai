import { NextResponse } from "next/server";
import { Resend } from "resend";

interface SendEmailRequest {
  to: string;
  subject: string;
  message: string;
}

const DEFAULT_FROM = "onboarding@resend.dev";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }

  let body: Partial<SendEmailRequest>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const to = typeof body.to === "string" ? body.to.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!to || !subject || !message) {
    return NextResponse.json(
      { error: "to, subject, and message are required." },
      { status: 400 },
    );
  }

  if (!isValidEmail(to)) {
    return NextResponse.json(
      { error: "Please provide a valid recipient email address." },
      { status: 400 },
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [to],
      subject,
      text: message,
    });

    if (error) {
      console.error("Resend rejected the email:", error);
      return NextResponse.json(
        { error: "The email provider rejected the request." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { success: true, id: data?.id },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Unable to send email right now." },
      { status: 500 },
    );
  }
}
