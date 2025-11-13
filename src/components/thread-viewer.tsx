"use client";
import { useState } from "react";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";

interface Message {
  id: string;
  body: string;
  createdAt: string;
  sender: { id: string; handle: string | null };
}

interface Props {
  threadId: string;
  initialMessages: Message[];
  currentUserId?: string;
}

export function ThreadViewer({ threadId, initialMessages, currentUserId }: Props) {
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
      <div className="panel max-h-[520px] space-y-3 overflow-y-auto rounded-3xl border border-[var(--color-border)]/70 p-4 text-sm">
        {messages.map((message) => {
          const isOwn = currentUserId && message.sender.id === currentUserId;
          return (
            <div
              key={message.id}
              className={cn(
                "rounded-2xl border border-[var(--color-border)]/70 p-4",
                isOwn ? "bg-[var(--color-accent-strong)]/15 ml-auto max-w-[85%]" : "bg-[color:var(--background)]/50"
              )}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                @{message.sender.handle ?? "collector"}
              </p>
              <p className="mt-1">{message.body}</p>
              <p className="text-[0.65rem] text-[var(--muted)]">{new Date(message.createdAt).toLocaleString()}</p>
            </div>
          );
        })}
        {!messages.length ? <p className="text-center text-[var(--muted)]">No messages yet</p> : null}
      </div>
      <form className="panel flex flex-col gap-3 rounded-3xl border border-[var(--color-border)]/70 p-4" onSubmit={sendMessage}>
        <textarea
          className="min-h-[60px] rounded-2xl border border-[var(--color-border)]/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--color-accent-strong)]"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Ask about shipping, authenticity, etc."
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-[var(--color-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
