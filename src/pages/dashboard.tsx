const LISTINGS = [
  { title: "2BR · Tel Aviv, Florentin", price: "₪ 7,800 / mo", img: "from-blue-100 via-blue-50 to-white" },
  { title: "Studio · Haifa, Hadar", price: "₪ 3,200 / mo", img: "from-emerald-100 via-emerald-50 to-white" },
  { title: "3BR · Jerusalem, Talpiot", price: "₪ 9,500 / mo", img: "from-amber-100 via-amber-50 to-white" },
];

function readName(): string {
  try {
    const raw = localStorage.getItem("renteasy.user");
    if (!raw) return "there";
    const parsed = JSON.parse(raw) as { name?: string };
    return parsed.name?.split(" ")[0] ?? "there";
  } catch {
    return "there";
  }
}

export function DashboardPage() {
  const name = readName();
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">
        Welcome to RentEasy, {name}!
      </h1>
      <p className="mt-2 text-slate-600">
        You're verified. Here are a few open listings to get you started.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LISTINGS.map((l) => (
          <div
            key={l.title}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className={`aspect-[4/3] bg-gradient-to-br ${l.img}`} />
            <div className="p-4">
              <div className="text-sm font-semibold text-slate-900">{l.title}</div>
              <div className="text-xs text-slate-500">{l.price}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-12 text-center text-xs text-slate-500">
        RentEasy is a demonstration of the OpenGrade Provider API. No
        properties, landlords, or rentals are real.
      </p>
    </div>
  );
}
