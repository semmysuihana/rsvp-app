import "./../../styles/globals.css";
import Sidebar from "../component/sidebar";

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full dark:bg-gray-900 dark:text-white">
      {/* Sidebar fixed */}
      <div className="flex min-h-screen w-full dark:bg-gray-900 dark:text-white">
      <Sidebar />
      <main className="w-full ml-0 p-4 pt-20 md:ml-60 md:pt-4 transition-all">
        {children}
      </main>
    </div>
    </div>
  );
}
