import type { Metadata } from "next";
import "./../styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import SettingMode from "./component/settingMode";
import ThemeProvider from "./component/themeProvider";
import { AuthProvider } from "~/component/SessionProvider";
export const metadata: Metadata = {
  title: "RSVP Event Management System",
  description: "RSVP Event Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
       <body className="min-h-screen bg-gray-900">
        <AuthProvider>
 <TRPCReactProvider>
  <ThemeProvider>
    
  {children}
  
  </ThemeProvider>

  </TRPCReactProvider>
   </AuthProvider>
 <SettingMode />


</body>

    </html>
  );
} 


