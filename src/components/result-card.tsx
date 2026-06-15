import { Link } from "react-router-dom";
import { OpenGradeBadge } from "@/components/og-badge";

type Band = "GREEN" | "YELLOW" | "RED" | null;
type Factor = { label: string; score: number };

type Props = {
  score: number;
  band: Band;
  factors: Factor[] | null;
};

function verdict(score: number) {
  if (score >= 78) {
    return {
      title: "You're approved",
      body: "Welcome to RentEasy. You can apply to listings with one click.",
      tone: "emerald" as const,
    };
  }
  if (score >= 60) {
    return {
      title: "Pending review",
      body: "We need a quick second look. Our team will reach out within 24 hours.",
      tone: "amber" as const,
    };
  }
  return {
    title: "We can't approve you at this time",
    body: "Thanks for trying RentEasy. You're welcome to apply again in 90 days.",
    tone: "slate" as const,
  };
}

const TONE: Record<"emerald" | "amber" | "slate", { bg: string; text: string; ring: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
  slate: { bg: "bg-slate-100", text: "text-slate-700", ring: "ring-slate-200" },
};

export function ResultCard({ score, band, factors }: Props) {
  const v = verdict(score);
  const tone = TONE[v.tone];
  const top = (factors ?? []).slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500">
            Trust score
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-5xl font-bold tabular-nums text-slate-900">
              {score}
            </div>
            <div className="text-lg text-slate-500">/ 100</div>
          </div>
        </div>
        {band && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              band === "GREEN"
                ? "bg-emerald-50 text-emerald-700"
                : band === "YELLOW"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-rose-50 text-rose-700"
            }`}
          >
            {band}
          </span>
        )}
      </div>

      {top.length > 0 && (
        <div className="mt-6 space-y-3">
          {top.map((f) => (
            <div key={f.label}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-slate-600">{f.label}</span>
                <span className="font-medium text-slate-900 tabular-nums">
                  {Math.round(f.score)}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${Math.max(0, Math.min(100, f.score))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={`mt-8 rounded-xl ${tone.bg} p-5 ring-1 ${tone.ring}`}>
        <div className={`text-lg font-semibold ${tone.text}`}>{v.title}</div>
        <p className="mt-1 text-sm text-slate-700">{v.body}</p>
      </div>

      <Link
        to="/dashboard"
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
      >
        Continue to your RentEasy dashboard →
      </Link>

      <div className="mt-4 flex justify-center">
        <OpenGradeBadge />
      </div>
    </div>
  );
}
