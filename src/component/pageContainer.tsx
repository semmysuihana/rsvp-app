"use client";

export default function PageContainer({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className="text-gray-800 dark:text-white px-6">{children}</div>;
}
