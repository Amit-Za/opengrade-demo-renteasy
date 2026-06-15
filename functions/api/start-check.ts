interface Env {
  OPENGRADE_API_KEY: string;
  OPENGRADE_API_BASE?: string;
}

const DEFAULT_BASE = "https://opengrade.cs.colman.ac.il/api/v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const onRequestPost = async ({
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

  let body: { name?: unknown; email?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "invalid_json", message: "Request body must be JSON" },
      { status: 400 },
    );
  }

  const { email } = body;
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return Response.json(
      { error: "invalid_email", message: "Email is not valid" },
      { status: 400 },
    );
  }

  const base = env.OPENGRADE_API_BASE ?? DEFAULT_BASE;
  const upstream = await fetch(`${base}/checks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENGRADE_API_KEY}`,
      "Idempotency-Key": crypto.randomUUID(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      participantEmails: [email],
      cadence: "ONE_OFF",
    }),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = (await upstream.json()) as {
    checkId: string;
    consentUrls: string[];
  };
  return Response.json({
    checkId: data.checkId,
    consentUrl: data.consentUrls[0],
  });
};
