"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";

interface ChatMsg {
  role: "user" | "assistant";
  text: string;
}

const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
const SYS = `You are the ClubConnect Directory Assistant. Help students find the right clubs by answering questions about club categories, meeting times, membership requirements, and activities. Keep answers concise (2-3 sentences). Reference ClubConnect features when relevant.`;

export default function AIChatbot() {
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [chat, loading]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      const userMsg: ChatMsg = { role: "user", text: text.trim() };
      setChat((p) => [...p, userMsg]);
      setInput("");
      setLoading(true);
      try {
        const history = [...chat, userMsg].map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }));
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYS }] },
              contents: history,
            }),
          },
        );
        const data = await res.json();
        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ??
          "Sorry, try again!";
        setChat((p) => [...p, { role: "assistant", text: reply }]);
      } catch {
        setChat((p) => [
          ...p,
          { role: "assistant", text: "Connection issue — please try again." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [chat, loading],
  );

  return (
    <div className="bg-white border border-primary-200 rounded-xl overflow-hidden">
      <div className="bg-primary-900 px-3.5 py-2.5 flex items-center gap-2">
        <Bot size={14} className="text-primary-200" />
        <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
          AI Club Finder
        </h3>
      </div>

      <div className="p-3 space-y-2.5">
        <div
          ref={scrollRef}
          className="h-[180px] overflow-y-auto space-y-2 bg-neutral-50/50 rounded-lg p-2"
        >
          {chat.length === 0 && (
            <div className="text-center py-4">
              <Sparkles size={18} className="mx-auto text-primary-300 mb-1.5" />
              <p className="font-bold text-primary-700 text-xs">
                Ask me anything about clubs!
              </p>
              <div className="mt-2 space-y-1">
                {[
                  "Which clubs meet after school?",
                  "What STEM clubs are available?",
                  "How do I join a club?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="w-full text-[11px] px-2.5 py-1.5 border border-primary-200 text-primary-600 hover:bg-primary-50 text-left rounded-lg"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-2.5 py-1.5 text-xs leading-relaxed rounded-lg ${
                  msg.role === "user"
                    ? "bg-primary-900 text-white"
                    : "bg-white border border-neutral-200 text-neutral-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-neutral-200 px-3 py-2 rounded-lg">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-1.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about clubs…"
            className="flex-1 text-xs py-1.5 px-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-primary-900 text-white px-2.5 py-1.5 rounded-lg text-xs hover:bg-primary-900 disabled:opacity-50"
          >
            <Send size={12} />
          </button>
        </form>
      </div>
    </div>
  );
}
