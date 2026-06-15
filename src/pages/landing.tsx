import { Link } from "react-router-dom";
import { OpenGradeBadge } from "@/components/og-badge";

const STEPS = [
  { n: 1, title: "Apply", body: "Tell us about yourself. Takes 30 seconds." },
  { n: 2, title: "Verify with your bank", body: "Connect your bank via Open Finance. Takes 60 seconds." },
  { n: 3, title: "Get matched", body: "Verified tenants get faster responses from landlords." },
];

export function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              For tenants
            </span>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Rent your next apartment in Israel.{" "}
              <span className="text-blue-600">Verified tenants only.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              Skip the bureaucracy. Get verified once, apply to any RentEasy listing
              with one click.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              >
                I'm a tenant — sign up
              </Link>
              <Link
                to="/landlord-stub"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:border-slate-400"
              >
                I'm a landlord — list a property
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            {/* Decorative card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1693209079362-521e1792aeb9?w=800&q=80&auto=format&fit=crop"
                alt="Tel Aviv apartment building, Florentin neighborhood"
                loading="lazy"
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">2BR Tel Aviv, Florentin</div>
                  <div className="text-xs text-slate-500">₪ 7,800 / mo · available now</div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  Verified landlord
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center text-2xl font-semibold text-slate-900">
            How RentEasy works
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-base font-semibold text-blue-700">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 max-w-xs text-sm text-slate-600">{s.body}</p>
                {s.n === 2 && (
                  <div className="mt-3">
                    <OpenGradeBadge />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-slate-500">
          © 2026 RentEasy · Demo of the OpenGrade Provider API
        </div>
      </footer>
    </div>
  );
}
