"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const cannedResponses: Array<{ query: RegExp; response: string }> = [
  {
    query: /pricing|cost|rate/i,
    response:
      "Our pricing depends on the scope and volume of work. For a quick estimate, tell me what tasks you'd like help with and how many hours per week you expect.",
  },
  {
    query: /hipaa/i,
    response:
      "We follow HIPAA guidelines and use secure workflows. All assistants are trained in PHI handling and we recommend using secure portals for protected data.",
  },
  {
    query: /services|support|tasks/i,
    response:
      "We can support scheduling, billing follow-up, patient outreach, and more. Share a few examples of what you'd like to offload.",
  },
];

const defaultResponse =
  "Thanks for the question! Tell me more about your requirements and I can suggest how our medical VAs can assist.";

export function ChatSimulator() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m0",
      role: "assistant",
      text: "Hi! I'm here to help you explore how a HIPAA-trained medical VA can support your practice. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    await new Promise((resolve) => setTimeout(resolve, 850));

    const match = cannedResponses.find((item) => item.query.test(userMessage.text));
    const assistantText = match ? match.response : defaultResponse;

    const assistantMessage: Message = {
      id: `a-${Date.now()}`,
      role: "assistant",
      text: assistantText,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsThinking(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage();
  };

  const memoizedMessages = useMemo(() => messages, [messages]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Chat with Assistant</h2>
        <span className="text-xs text-slate-500">(Simulated)</span>
      </div>
      <div className="mt-4 max-h-[380px] space-y-3 overflow-y-auto pr-2">
        {memoizedMessages.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              message.role === "assistant"
                ? "bg-slate-50 text-slate-800"
                : "ml-auto bg-emerald-50 text-slate-900"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about services, pricing, HIPAA, etc."
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        <button
          type="submit"
          disabled={isThinking || !input.trim()}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {isThinking ? "Thinking…" : "Send"}
        </button>
      </form>
    </div>
  );
}
