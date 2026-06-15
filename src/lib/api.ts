export type StartCheckResponse = {
  checkId: string;
  consentUrl: string;
};

export type CheckStatusResponse = {
  status:
    | "PENDING"
    | "SCORING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
    | "EXPIRED";
  score: number | null;
  band: "GREEN" | "YELLOW" | "RED" | null;
  factors: Array<{ label: string; score: number }> | null;
};

export type ApiError = {
  error: string;
  message: string;
};

export async function startCheck(input: {
  name: string;
  email: string;
}): Promise<StartCheckResponse> {
  const res = await fetch("/api/start-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(err?.message ?? `start-check failed with status ${res.status}`);
  }
  return (await res.json()) as StartCheckResponse;
}

export async function getCheckStatus(id: string): Promise<CheckStatusResponse> {
  const res = await fetch(`/api/check-status?id=${encodeURIComponent(id)}`);
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(err?.message ?? `check-status failed with status ${res.status}`);
  }
  return (await res.json()) as CheckStatusResponse;
}
