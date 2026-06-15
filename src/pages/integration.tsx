import { Link } from "react-router-dom";
import { OpenGradeBadge } from "@/components/og-badge";

const STEPS = [
  {
    n: 1,
    title: "Tenant submits the signup form",
    body: "Browser POSTs name + email to our own /api/start-check endpoint (a Cloudflare Pages Function). The OpenGrade API key never reaches the browser.",
  },
  {
    n: 2,
    title: "We create a check against OpenGrade",
    body: "The Pages Function calls POST /v1/checks on the OpenGrade Provider API, authenticated with our bearer token + an idempotency key. One credit is spent.",
  },
  {
    n: 3,
    title: "OpenGrade returns a consent URL",
    body: "The response includes a checkId and a participantToken-scoped URL. We open it in a new tab so the tenant can connect their bank via Israeli Open Finance.",
  },
  {
    n: 4,
    title: "We poll for the score",
    body: "The signup tab polls our /api/check-status every 3 seconds. The Pages Function proxies GET /v1/checks/:id and projects the response to just the fields we render.",
  },
  {
    n: 5,
    title: "Approval logic runs on the score",
    body: "Once the score lands, RentEasy decides: ≥ 78 auto-approve, 60-77 manual review, < 60 decline. The result page shows the verdict and the underlying factor breakdown.",
  },
];

const START_CHECK_CODE = `// functions/api/start-check.ts — Cloudflare Pages Function
export const onRequestPost = async ({ request, env }) => {
  const { email } = await request.json();

  const upstream = await fetch(
    "https://opengrade.cs.colman.ac.il/api/v1/checks",
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${env.OPENGRADE_API_KEY}\`,
        "Idempotency-Key": crypto.randomUUID(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participantEmails: [email],
        cadence: "ONE_OFF",
      }),
    },
  );

  const { checkId, consentUrls } = await upstream.json();
  return Response.json({
    checkId,
    consentUrl: consentUrls[0],
  });
};`;

const CHECK_STATUS_CODE = `// functions/api/check-status.ts — Cloudflare Pages Function
export const onRequestGet = async ({ request, env }) => {
  const id = new URL(request.url).searchParams.get("id");

  const upstream = await fetch(
    \`https://opengrade.cs.colman.ac.il/api/v1/checks/\${id}\`,
    { headers: { Authorization: \`Bearer \${env.OPENGRADE_API_KEY}\` } },
  );

  const data = await upstream.json();
  const p = data.participants[0];

  // Thin projection — only the fields the UI cares about.
  return Response.json({
    status: data.status,
    score: p.score,
    band: p.trafficLight,
    factors: p.factors,
  });
};`;

const POLL_CODE = `// src/pages/processing.tsx — the polling tick
const tick = async () => {
  const res = await getCheckStatus(id);
  if (typeof res.score === "number") {
    setView({ kind: "result", payload: res });   // → render ResultCard
    return;
  }
  if (["FAILED", "EXPIRED", "CANCELLED"].includes(res.status)) {
    setView({ kind: "error", message: "Verification failed." });
    return;
  }
  setTimeout(tick, 3000);   // keep polling
};`;

export function IntegrationPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              How we built this
            </span>
            <OpenGradeBadge />
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            How RentEasy verifies tenants
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Every RentEasy signup runs a real-time financial trust check using
            the OpenGrade Provider API. Here's the full picture — five steps,
            two Cloudflare Pages Functions, ~150 lines of code.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-slate-900">
            The end-to-end flow
          </h2>
          <ol className="mt-8 space-y-6">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {s.n}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-slate-600">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Code blocks */}
      <section>
        <div className="mx-auto max-w-4xl space-y-12 px-6 py-16">
          <CodeBlock title="Step 2 — Create the check" code={START_CHECK_CODE} />
          <CodeBlock title="Step 4 — Project the result" code={CHECK_STATUS_CODE} />
          <CodeBlock title="Step 4 — Poll until the score lands" code={POLL_CODE} />
        </div>
      </section>

      {/* Architecture note */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h2 className="text-xl font-semibold text-slate-900">
            Why the API key is server-side
          </h2>
          <p className="mt-3 text-slate-600">
            The browser only ever talks to RentEasy's own Pages Functions —
            it never sees the OpenGrade API key. That keeps the key out of
            the JavaScript bundle, browser DevTools, and any user's network
            tab. The Pages Function is the only thing that carries the bearer
            token to OpenGrade.
          </p>
          <p className="mt-3 text-slate-600">
            Source code on{" "}
            <a
              href="https://github.com/Amit-Za/opengrade-demo-renteasy"
              className="font-medium text-blue-600 hover:underline"
            >
              github.com/Amit-Za/opengrade-demo-renteasy
            </a>
            .
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6 text-xs text-slate-500">
          <span>© 2026 RentEasy · Demo of the OpenGrade Provider API</span>
          <Link to="/" className="text-blue-600 hover:underline">
            Back to home →
          </Link>
        </div>
      </footer>
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-700 bg-slate-800/60 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
        <pre className="overflow-x-auto p-5 text-xs leading-relaxed text-slate-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
