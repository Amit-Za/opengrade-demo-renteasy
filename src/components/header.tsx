import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-md"
            style={{ background: "var(--accent)" }}
          >
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
              <path
                d="M8 16l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H9a1 1 0 0 1-1-1z"
                fill="#fff"
              />
            </svg>
          </span>
          RentEasy
        </Link>
        <nav className="hidden gap-6 text-sm text-slate-600 sm:flex">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <Link to="/landlord-stub" className="hover:text-slate-900">For landlords</Link>
          <Link to="/integration" className="hover:text-slate-900">Integration</Link>
        </nav>
      </div>
    </header>
  );
}
