"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageSquare, Send, X } from "lucide-react";
import { chapters } from "@/lib/data";
import { getPrimaryLocation } from "@/lib/location";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! I'm the ClubConnect AI assistant. Ask me about clubs, events, or how to get involved!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const clubSummary = chapters
        .map(
          (c) =>
            `${c.name} (${c.category}) - ${c.meetingSchedule}, ${getPrimaryLocation(c.meetingLocation)}`
        )
        .join("\n");

      const systemPrompt = `You are a helpful assistant for ClubConnect, a school community hub for Juanita High School. You help students find clubs, learn about events, and get involved. Here are the available clubs:\n${clubSummary}\n\nBe concise, friendly, and always encourage students to explore. If they ask about something you don't know, guide them to the relevant page on ClubConnect.`;

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
      const conversationHistory: { role: string; parts: { text: string }[] }[] =
        [];
      conversationHistory.push({
        role: "user",
        parts: [{ text: systemPrompt }],
      });
      conversationHistory.push({
        role: "model",
        parts: [
          {
            text: "I understand! I'm the ClubConnect AI assistant for Juanita High School. I'll help students find clubs, events, and ways to get involved. How can I help you today?",
          },
        ],
      });
      for (const msg of messages) {
        if (msg.role === "user") {
          conversationHistory.push({
            role: "user",
            parts: [{ text: msg.text }],
          });
        } else {
          conversationHistory.push({
            role: "model",
            parts: [{ text: msg.text }],
          });
        }
      }
      conversationHistory.push({ role: "user", parts: [{ text }] });

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: conversationHistory }),
        }
      );

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`Gemini API ${res.status}: ${errBody.slice(0, 120)}`);
      }
      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't process that. Try asking something else!";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error("AI Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I'm having trouble connecting right now. Please check your internet connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary-900 text-white shadow-lg hover:brightness-110 flex items-center justify-center transition-transform hover:scale-110 animate-scale-bounce"
          aria-label="Open AI Assistant"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)]  border border-primary-200 bg-white shadow-2xl flex flex-col overflow-hidden animate-fade-up"
          style={{ height: "500px", maxHeight: "calc(100vh - 6rem)" }}>
          {}
          <div className="bg-primary-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <span className="font-semibold text-sm">AI Assistant</span>
              <span className="text-xs bg-green-400 text-green-900 px-1.5 py-0.5 rounded-full">
                Online
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="hover:bg-white/20  p-1 transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2  text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary-500 text-white rounded-br-sm"
                      : "bg-neutral-100 text-neutral-800 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 text-neutral-500 px-3 py-2  rounded-bl-sm text-sm flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {}
          <div className="border-t border-neutral-200 p-3 flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask about clubs, events..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-3 py-2  border border-neutral-200 focus:border-primary-500 focus:outline-none text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-primary-900 text-white px-3 py-2  hover:brightness-110 disabled:opacity-50 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
