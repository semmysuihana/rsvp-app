"use client";
import { useEffect, useState } from "react";

export default function SettingMode() {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const savedMode = localStorage.getItem("mode");
    if (savedMode) setMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("mode", mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);
  return (
    <div
      className="fixed bottom
      -5 right-5 z-50 flex items-center gap-3
                 bg-white dark:bg-gray-800 shadow-lg px-3 py-2 rounded-full
                 transition-all"
    >
      <button
        onClick={() => setMode(mode === "light" ? "dark" : "light")}
        className={`w-12 h-6 flex items-center rounded-full transition-all
          bg-gray-300 dark:bg-gray-600
          ${mode === "dark" ? "justify-end" : "justify-start"}`}
      >
        <div className="w-5 h-5 bg-white rounded-full shadow-lg transition-all" />
      </button>
    </div>
  );
}
