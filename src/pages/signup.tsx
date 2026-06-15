import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { OpenGradeBadge } from "@/components/og-badge";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Full name is required.");
    if (!EMAIL_RE.test(email)) return setError("Please enter a valid email.");
    setSubmitting(true);
    // Submit wiring lands in Task 7. For now, navigate with a fake check id so the
    // route exists end-to-end.
    localStorage.setItem("renteasy.user", JSON.stringify({ name }));
    navigate(
      `/onboarding/processing?id=stub&token=stub`,
    );
    // Silence the unused-import warning until Task 7 swaps this in.
    void phone;
    void submitting;
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Tell us about yourself.</h1>
      <p className="mt-2 text-slate-600">
        It takes 30 seconds. Verification with your bank takes another 60.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <Field
          label="Full name"
          value={name}
          onChange={setName}
          placeholder="Dana Cohen"
          required
        />
        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="dana@example.com"
          type="email"
          required
        />
        <Field
          label="Phone (optional)"
          value={phone}
          onChange={setPhone}
          placeholder="050-123-4567"
        />

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              To match you to verified landlords, we'll verify your financial trust.
              Takes about 90 seconds.
            </p>
            <OpenGradeBadge />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Starting verification…" : "Continue to verification →"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
