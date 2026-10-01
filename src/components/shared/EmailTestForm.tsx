"use client";

import { FormEvent, useState } from "react";

interface SendEmailResponse {
  success?: boolean;
  error?: string;
}

export function EmailTestForm() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("JanMitra test email");
  const [message, setMessage] = useState("This is a test email from JanMitra AI.");
  const [status, setStatus] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsSending(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, message }),
      });

      const result = (await response.json()) as SendEmailResponse;

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email.");
      }

      setStatus("Email sent successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to send email.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span>Recipient email</span>
        <input
          type="email"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          placeholder="recipient@example.com"
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span>Subject</span>
        <input
          type="text"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span>Message</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          required
        />
      </label>

      <button type="submit" disabled={isSending}>
        {isSending ? "Sending..." : "Send test email"}
      </button>

      {status && <p role="status">{status}</p>}
    </form>
  );
}
