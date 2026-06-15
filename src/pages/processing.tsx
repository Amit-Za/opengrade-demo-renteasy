import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ResultCard } from "@/components/result-card";
import { getCheckStatus, type CheckStatusResponse } from "@/lib/api";

const POLL_MS = 3000;
const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
const MAX_CONSECUTIVE_FAILURES = 3;

type View =
  | { kind: "awaiting"; statusText: string }
  | { kind: "result"; payload: CheckStatusResponse }
  | { kind: "error"; message: string };

function statusToText(status: CheckStatusResponse["status"]): string {
  switch (status) {
    case "PENDING":
      return "Waiting for bank connection";
    case "SCORING":
      return "Scoring…";
    case "COMPLETED":
      return "Scoring complete";
    default:
      return "Working…";
  }
}

export function ProcessingPage() {
  const [params] = useSearchParams();
  const id = params.get("id") ?? "";
  const url = params.get("url") ?? "";

  const [view, setView] = useState<View>({
    kind: "awaiting",
    statusText: "Opening verification window…",
  });
  const openedRef = useRef(false);
  const failuresRef = useRef(0);
  const startedAtRef = useRef<number>(Date.now());

  const openTab = () => {
    if (!url) return;
    window.open(url, "_blank", "noopener");
  };

  // Open the OpenGrade applicant tab on first mount only.
  useEffect(() => {
    if (openedRef.current || !url) return;
    openedRef.current = true;
    openTab();
    setView({ kind: "awaiting", statusText: "Waiting for bank connection" });
  }, [url]);

  // Polling loop.
  useEffect(() => {
    if (!id) {
      setView({ kind: "error", message: "Missing check id in URL." });
      return;
    }

    let cancelled = false;
    const tick = async () => {
      if (cancelled) return;
      if (Date.now() - startedAtRef.current > TIMEOUT_MS) {
        setView({
          kind: "error",
          message: "This is taking longer than expected. Check back in a few minutes.",
        });
        return;
      }
      try {
        const res = await getCheckStatus(id);
        failuresRef.current = 0;
        if (typeof res.score === "number") {
          setView({ kind: "result", payload: res });
          return;
        }
        if (res.status === "FAILED" || res.status === "EXPIRED" || res.status === "CANCELLED") {
          setView({
            kind: "error",
            message: "We couldn't complete the verification. Please try again later.",
          });
          return;
        }
        setView({ kind: "awaiting", statusText: statusToText(res.status) });
      } catch {
        failuresRef.current += 1;
        if (failuresRef.current >= MAX_CONSECUTIVE_FAILURES) {
          setView({
            kind: "error",
            message: "We're having trouble checking your status. Please refresh.",
          });
          return;
        }
      }
      window.setTimeout(tick, POLL_MS);
    };

    void tick();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {view.kind === "awaiting" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">
            Connect your bank in the new window
          </h1>
          <p className="mt-2 text-slate-600">
            We'll detect when you're done. {view.statusText}.
          </p>
          <button
            onClick={openTab}
            className="mt-6 text-sm font-medium text-blue-600 hover:underline"
          >
            Didn't open? Click here.
          </button>
        </div>
      )}

      {view.kind === "result" && view.payload.score != null && (
        <ResultCard
          score={view.payload.score}
          band={view.payload.band}
          factors={view.payload.factors}
        />
      )}

      {view.kind === "error" && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
          <h1 className="text-xl font-semibold text-rose-800">Something went wrong</h1>
          <p className="mt-2 text-rose-700">{view.message}</p>
        </div>
      )}
    </div>
  );
}
