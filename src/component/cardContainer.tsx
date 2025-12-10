"use client";

const colClasses: Record<number, string> = {
  1: "grid-cols-1 md:grid-cols-1 lg:grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2 lg:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
};

export default function CardContainer({
  children,
  cols = 2,
}: {
  children: React.ReactNode;
  cols?: number;
}) {
  return (
    <div className={`text-black dark:text-white grid gap-6 ${colClasses[cols] ?? colClasses[2]}`}>
      {children}
    </div>
  );
}
