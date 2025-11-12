"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  body: string;
  createdAt: string;
  sender: { id: string; handle: string | null };
}

export function ThreadViewer({ threadId, initialMessages }: { threadId: string; initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId, body }),
    });
    setSending(false);
    if (!response.ok) {
      const payload = await response.json();
      toast.error(payload.error ?? "Unable to send message");
      return;
    }
    const data = await response.json();
    setMessages((prev) => [...prev, data.message]);
    setBody("");
  }

  return (
    <div className="space-y-4">
      <div className="max-h-[480px] space-y-3 overflow-y-auto rounded border border-[var(--color-border)] p-4 text-sm">
        {messages.map((message) => (
          <div key={message.id} className="rounded border border-[var(--color-border)] bg-[color:var(--background)]/80 p-3">
            <p className="text-xs text-foreground/60">@{message.sender.handle ?? "collector"}</p>
            <p>{message.body}</p>
            <p className="text-xs text-foreground/50">{new Date(message.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {!messages.length ? <p className="text-center text-foreground/60">No messages yet</p> : null}
      </div>
      <form className="flex gap-2" onSubmit={sendMessage}>
        <textarea
          className="min-h-[60px] flex-1 rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Ask about shipping, authenticity, etc."
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-[var(--color-accent-strong)] px-4 py-2 text-sm font-semibold text-white"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
