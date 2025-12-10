"use client";

import Sidebar from "~/component/sidebar";
import { useEffect, useState } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // cegah mismatch SSR

  return (
    <div className="flex min-h-screen w-full dark:bg-gray-900 dark:text-white">
      <Sidebar />
      <main className="w-full ml-0 p-4 pt-20 md:ml-60 md:pt-20 transition-all">
        {children}
      </main>
    </div>
  );
}
