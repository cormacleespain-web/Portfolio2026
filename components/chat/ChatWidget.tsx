"use client";

import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import { MarkdownText } from "./MarkdownText";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MOBILE_QUERY = "(max-width: 767px)";

function subscribeMobile(callback: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getMobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function useIsMobile() {
  return useSyncExternalStore(subscribeMobile, getMobileSnapshot, () => false);
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  useEffect(() => {
    function handleToggle() {
      setOpen((prev) => !prev);
    }
    window.addEventListener("toggle-chat", handleToggle);
    return () => window.removeEventListener("toggle-chat", handleToggle);
  }, []);

  useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open, isMobile]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 80 || info.velocity.y > 300) {
      setOpen(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || streaming) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        setMessages([
          ...newMessages,
          { role: "assistant", content: `Sorry, something went wrong: ${err.error || "Unknown error"}` },
        ]);
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;
            const data = trimmedLine.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulated += parsed.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: accumulated,
                  };
                  return updated;
                });
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, I couldn't connect. Please try again." },
      ]);
    }

    setStreaming(false);
  }

  const chatContent = (
    <>
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 overscroll-contain">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-8">
            <p className="text-sm text-text-muted">
              Hi! Ask me anything about Cormac&apos;s work, case studies, or experience.
            </p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {["What projects has Cormac worked on?", "Tell me about the MyThree case study", "What tools does Cormac use?"].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:border-accent hover:text-accent transition-colors"
                  >
                    {suggestion}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent text-black rounded-br-sm"
                  : "bg-surface-hover text-text rounded-bl-sm"
              }`}
            >
              {msg.content ? (
                msg.role === "assistant" ? (
                  <MarkdownText content={msg.content} />
                ) : (
                  msg.content
                )
              ) : streaming && i === messages.length - 1 ? (
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-border px-3 py-2 bg-surface"
        style={{ paddingBottom: isMobile ? "max(0.5rem, env(safe-area-inset-bottom))" : undefined }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Cormac's work..."
          disabled={streaming}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-text-subtle outline-none transition-colors disabled:opacity-50 focus:border-[#fb923c]"
        />
        <button
          type="submit"
          disabled={!input.trim() || streaming}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#fb923c" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </>
  );

  return (
    <>
      {/* Desktop-only FAB */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Chat with AI assistant"}
        className={`fixed bottom-6 right-6 z-[100] hidden h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 md:flex ${
          open
            ? "bg-surface-hover text-text hover:bg-border"
            : "text-white hover:brightness-110"
        }`}
        style={!open ? { backgroundColor: "#fb923c" } : undefined}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* ── Mobile: bottom sheet ── */}
            {isMobile && (
              <>
                {/* Backdrop */}
                <motion.div
                  key="chat-backdrop"
                  className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-[2px] md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setOpen(false)}
                />

                {/* Sheet */}
                <motion.div
                  key="chat-sheet"
                  className="fixed inset-x-0 bottom-0 z-[151] flex flex-col overflow-hidden rounded-t-2xl bg-surface shadow-2xl md:hidden"
                  style={{ height: "85vh" }}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.6 }}
                  onDragEnd={handleDragEnd}
                >
                  {/* Drag handle */}
                  <div className="flex flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none">
                    <div className="h-1 w-10 rounded-full bg-text-subtle/40" />
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold"
                      style={{ backgroundColor: "#fb923c" }}
                    >
                      C
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text">Cormac&apos;s Portfolio Bot</p>
                      <p className="text-xs text-text-muted">Ask me about projects &amp; experience</p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      aria-label="Close chat"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  {chatContent}
                </motion.div>
              </>
            )}

            {/* ── Desktop: floating panel (unchanged) ── */}
            {!isMobile && (
              <motion.div
                key="chat-desktop"
                className="fixed bottom-24 right-6 z-[100] hidden w-[360px] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl md:flex"
                style={{ height: "min(500px, calc(100vh - 8rem))" }}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold"
                    style={{ backgroundColor: "#fb923c" }}
                  >
                    C
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text">Cormac&apos;s Portfolio Bot</p>
                    <p className="text-xs text-text-muted">Ask me about projects &amp; experience</p>
                  </div>
                </div>

                {chatContent}
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}
