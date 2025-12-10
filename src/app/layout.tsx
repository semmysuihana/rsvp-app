import type { Metadata } from "next";
import "./../styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import { AuthProvider } from "~/component/SessionProvider";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "~/component/themeToggle";

export const metadata: Metadata = {
  title: "RSVP Event Management System",
  description: "RSVP Event Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="dark:bg-gray-900 dark:text-white" suppressHydrationWarning>
        <AuthProvider>
          <TRPCReactProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <ThemeToggle />
            </ThemeProvider>
          </TRPCReactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
