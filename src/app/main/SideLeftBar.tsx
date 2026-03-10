"use client";

import { useEffect, useState } from "react";
import SideBarIcon from "@/app/_icons/sidebar";
import { Question } from "@/types";

type HistoryItem = {
  id: string;
  title: string;
  summary?: string;
  questions?: Question[];
};

export default function SideLeftBar({ onClose }: { onClose: () => void }) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  const loadHistory = () => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem("history");
      if (!raw) {
        setHistoryItems([]);
        return;
      }

      const parsed = JSON.parse(raw) as HistoryItem[];
      setHistoryItems(parsed);
    } catch (err) {
      console.error("Failed to load history", err);
      setHistoryItems([]);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    loadHistory();

    const onHistoryUpdate = () => loadHistory();
    window.addEventListener("history-update", onHistoryUpdate);

    return () => {
      window.removeEventListener("history-update", onHistoryUpdate);
    };
  }, []);

  return (
    <aside className="fixed left-5 top-16 h-[calc(100vh-3.5rem)] w-75 border-r bg-white">
      <div className="h-full px-3 py-2 flex flex-col">
        <div className="flex justify-between mb-3">
          <span className="text-xl font-semibold">History</span>
          <button className="cursor-pointer" onClick={onClose}>
            <SideBarIcon />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto space-y-1">
          {historyItems.map((item) => (
            <li
              key={item.id}
              className="cursor-pointer rounded px-2 py-4 border-y border-gray-500 hover:bg-zinc-100"
              onClick={() => {
                localStorage.setItem("selectedHistory", JSON.stringify(item));
                window.dispatchEvent(new CustomEvent("history-select"));
              }}
            >
              <div className="font-medium">{item.title}</div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
