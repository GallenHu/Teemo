export function CategoriesContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 min-h-[300px] text-left"
      style={{ width: "var(--icon-box-width)" }}
    >
      {children}
    </div>
  );
}
