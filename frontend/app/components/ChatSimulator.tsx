"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../../lib/api";   // Fixed relative import

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const defaultResponse =
  "Thanks for your question. I can help with services, HIPAA support, onboarding, and next steps for your practice.";

const suggestedPrompts = [
  "What services do you offer?",
  "How does HIPAA compliance work?",
  "What does onboarding look like?",
  "How do I get started?",
];

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
  const idCounterRef = useRef(0);

  const nextId = (prefix: string) => {
    idCounterRef.current += 1;
    return `${prefix}-${idCounterRef.current}`;
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if (!text) return;

    const userMessage: Message = {
      id: nextId("u"),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const data = await api.sendToLangflow({ message: text });

      const assistantMessage: Message = {
        id: nextId("a"),
        role: "assistant",
        text: data?.reply ?? defaultResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = api.getApiErrorMessage(err);
      const assistantMessage: Message = {
        id: nextId("a"),
        role: "assistant",
        text: `I'm here to help. ${defaultResponse} ${errorMessage}`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage();
  };

  const memoizedMessages = useMemo(() => messages, [messages]);

  return (
    <div className="rounded-3xl border border-amber-200/70 bg-gradient-to-br from-white via-amber-50/70 to-lime-50/70 p-6 shadow-sm dark:border-amber-400/30 dark:from-[#34240d] dark:via-[#24170b] dark:to-[#1d1408]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-amber-50">AI Assistant</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-amber-100/80">
            Ask about services, HIPAA support, or getting started.
          </p>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          Online
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => void sendMessage(prompt)}
            className="rounded-full border border-amber-200/80 bg-white/80 px-3 py-1.5 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:bg-amber-50 dark:border-amber-400/30 dark:bg-[#26190c] dark:text-amber-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-4 max-h-[380px] space-y-3 overflow-y-auto pr-2">
        {memoizedMessages.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              message.role === "assistant"
                ? "bg-amber-50/80 text-slate-800 dark:bg-amber-500/10 dark:text-amber-100"
                : "ml-auto bg-lime-100/80 text-slate-900 dark:bg-lime-500/15 dark:text-amber-50"
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
          className="flex-1 rounded-xl border border-amber-200/70 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/30 dark:bg-[#26190c] dark:text-amber-50"
        />
        <button
          type="submit"
          disabled={isThinking || !input.trim()}
          className="inline-flex min-w-[88px] items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-lime-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_-18px_rgba(249,115,22,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-70"
        >
          {isThinking ? "Thinking…" : "Send"}
        </button>
      </form>
    </div>
  );
}