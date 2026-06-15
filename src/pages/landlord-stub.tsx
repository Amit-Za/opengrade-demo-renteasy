import { Link } from "react-router-dom";

export function LandlordStubPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">
        Landlord onboarding is coming soon.
      </h1>
      <p className="mt-3 text-slate-600">
        For now, RentEasy is invite-only on the landlord side.
      </p>
      <Link to="/" className="mt-8 inline-block text-blue-600 hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
