"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faDesktop } from "@fortawesome/free-solid-svg-icons";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    { value: "light", label: "Light", icon: faSun },
    { value: "dark", label: "Dark", icon: faMoon },
    { value: "system", label: "System", icon: faDesktop },
  ];

  const currentTheme = themes.find((t) => t.value === theme)! ?? themes[0];


  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Theme Options Dropdown */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 p-2 min-w-[140px] animate-fade-in">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTheme(t.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left
                ${
                  theme === t.value
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              <FontAwesomeIcon icon={t.icon} className="w-4 h-4" />
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 flex items-center justify-center rounded-full 
                   bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700
                   hover:scale-110 transition-all duration-200"
        title="Change theme"
        aria-label="Toggle theme menu"
      >
        <FontAwesomeIcon
          icon={currentTheme.icon}
          className="w-5 h-5 text-gray-700 dark:text-gray-300"
        />
      </button>
    </div>
  );
}
