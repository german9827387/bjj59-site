"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function RevalidateScheduleButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleClick() {
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/revalidate", { method: "POST" });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-semibold hover:bg-blue-500/20 transition-all disabled:opacity-50"
    >
      <RefreshCw size={15} className={status === "loading" ? "animate-spin" : ""} />
      {status === "loading" && "Обновляем..."}
      {status === "done" && "Обновлено ✓"}
      {status === "error" && "Ошибка ✗"}
      {status === "idle" && "Обновить расписание"}
    </button>
  );
}
