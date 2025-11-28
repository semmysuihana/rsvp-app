"use client";
import { useEffect } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem("mode") ?? "light";
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  return <>{children}</>;
}
