"use client";

import ProtectedLayout from "~/component/protectedLayout";

export default function ProtectedRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
