export function OpenGradeBadge({ size = "sm" }: { size?: "sm" | "md" }) {
  const dim = size === "md" ? 14 : 12;
  const text = size === "md" ? "text-sm" : "text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 ${text} font-medium text-emerald-700`}
    >
      <svg width={dim} height={dim} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect width="24" height="24" rx="5" fill="currentColor" opacity="0.15" />
        <rect x="6" y="13" width="3" height="5" rx="1" fill="currentColor" />
        <rect x="10.5" y="10" width="3" height="8" rx="1" fill="currentColor" />
        <rect x="15" y="7" width="3" height="11" rx="1" fill="currentColor" />
      </svg>
      Verified by OpenGrade
    </span>
  );
}
