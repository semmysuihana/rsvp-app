"use client";

export default function CardContainer({
  children,
  cols = 2, // default 2 kolom
}: {
  children: React.ReactNode;
  cols?: number;
}) {
  return (
    <div
      className={`grid gap-6 grid-cols-1 sm:grid-cols-${cols} lg:grid-cols-${cols}`}
    >
      {children}
    </div>
  );
}
