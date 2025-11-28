"use client";

export default function PageContainer({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className="px-6">{children}</div>;
}
