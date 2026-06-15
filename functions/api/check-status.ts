interface Env {
  OPENGRADE_API_KEY: string;
  OPENGRADE_API_BASE?: string;
}

const DEFAULT_BASE = "https://opengrade.cs.colman.ac.il/api/v1";
const UUID_RE = /^[0-9a-f-]{8,}$/i;

type UpstreamFactor = { label?: string; weight?: number } & Record<string, unknown>;
type UpstreamParticipant = {
  score: number | null;
  trafficLight: "GREEN" | "YELLOW" | "RED" | null;
  factors: Record<string, unknown> | UpstreamFactor[] | null;
};
type UpstreamResponse = {
  status: string;
  participants: UpstreamParticipant[];
};

function projectFactors(
  raw: UpstreamParticipant["factors"],
): Array<{ label: string; weight: number }> | null {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    return raw
      .map((f) => ({
        label: typeof f.label === "string" ? f.label : "",
        weight: typeof f.weight === "number" ? f.weight : 0,
      }))
      .filter((f) => f.label !== "");
  }
  // Treat as Record<string, number-ish>: { "Income Stability": 84, ... }
  return Object.entries(raw)
    .map(([label, v]) => ({
      label,
      weight: typeof v === "number" ? v : Number(v) || 0,
    }))
    .filter((f) => !Number.isNaN(f.weight));
}

export const onRequestGet = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  if (!env.OPENGRADE_API_KEY) {
    return Response.json(
      { error: "config_error", message: "OPENGRADE_API_KEY is not set" },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id") ?? "";
  if (!UUID_RE.test(id)) {
    return Response.json(
      { error: "invalid_id", message: "Query parameter `id` is required" },
      { status: 400 },
    );
  }

  const base = env.OPENGRADE_API_BASE ?? DEFAULT_BASE;
  const upstream = await fetch(`${base}/checks/${id}`, {
    headers: { Authorization: `Bearer ${env.OPENGRADE_API_KEY}` },
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = (await upstream.json()) as UpstreamResponse;
  const p = data.participants?.[0] ?? null;
  return Response.json({
    status: data.status,
    score: p?.score ?? null,
    band: p?.trafficLight ?? null,
    factors: projectFactors(p?.factors ?? null),
  });
};
