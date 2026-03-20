"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function friendlyUrl(url: string): string {
  if (url.includes("yandex.ru/maps")) return "Яндекс Карты →";
  if (url.includes("t.me") || url.includes("telegram")) return "Telegram →";
  if (url.includes("vk.com")) return "ВКонтакте →";
  if (url.includes("bjj59.ru/schedule")) return "Расписание →";
  try {
    return new URL(url).hostname.replace("www.", "") + " →";
  } catch {
    return url;
  }
}

function MessageContent({ text }: { text: string }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return (
    <>
      {parts.map((part, i) =>
        urlRegex.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block underline underline-offset-2 opacity-90 hover:opacity-100 font-medium"
          >
            {friendlyUrl(part)}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const QUICK_QUESTIONS = [
  "Как добраться?",
  "Расписание занятий",
  "Сколько стоит?",
  "Что взять на тренировку?",
  "Пробное занятие бесплатно?",
  "Какие направления есть?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Здравствуйте! Меня зовут Алина, я онлайн-ассистент академии GSAcademy 😊 Как могу к вам обращаться?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [messages, open]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const body = JSON.stringify({ messages: newMessages });
      const headers = { "Content-Type": "application/json" };
      let res!: Response;
      for (let attempt = 1; attempt <= 3; attempt++) {
        res = await fetch("/api/chat", { method: "POST", headers, body });
        if (res.ok) break;
        if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 3000));
      }
      const data = await res.json();
      if (data.sendLead && data.leadName && data.leadPhone) {
        fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.leadName,
            phone: data.leadPhone,
            source: "Чат-консультант",
            direction: data.leadDirection,
            dayTime: data.leadDayTime,
          }),
        }).catch(() => {});
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Секунду, попробуем ещё раз — напишите ваш ответ снова 😊",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Ошибка соединения. Напишите нам в Telegram — ответим быстро!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Кнопка открытия */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2">
        {!open && (
          <div className="hidden md:flex items-center gap-2 bg-[#111] border border-[#2a2a2a] rounded-full px-3 py-1.5 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-white text-xs font-medium whitespace-nowrap">Алина онлайн</span>
          </div>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-2xl shadow-blue-500/40 flex items-center justify-center text-white hover:scale-110 transition-transform"
          aria-label="Открыть чат-консультант"
        >
          {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>

      {/* Окно чата */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ height: "480px" }}
        >
          {/* Шапка */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#111] border-b border-[#1e1e1e] shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">GSAcademy</p>
              <p className="text-gray-500 text-xs mt-0.5">Онлайн-ассистент</p>
            </div>
          </div>

          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-[#1a1a1a] text-gray-200 rounded-bl-sm border border-[#2a2a2a]"
                  }`}
                >
                  <MessageContent text={m.content} />
                </div>
              </div>
            ))}

            {/* Быстрые вопросы — только при первом сообщении */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Индикатор загрузки */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Поле ввода */}
          <div className="px-3 py-3 border-t border-[#1e1e1e] flex gap-2 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && send(input)
              }
              placeholder="Напишите вопрос..."
              disabled={loading}
              className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50"
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 flex items-center justify-center shrink-0 transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
