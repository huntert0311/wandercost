import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderWidth: "0.5px" }}>
        <span className="text-xl font-bold tracking-tight">
          Wander<span style={{ color: "#1D9E75" }}>cost</span>
        </span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: "#1D9E75" }}
          >
            Get started
          </Link>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 max-w-2xl leading-tight">
          Real travel costs from real travelers
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl">
          Wandercost combines trip photos with actual cost data — per day, stay, food, flights — so you know what travel really costs before you go.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/signup"
            className="rounded-lg px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: "#1D9E75" }}
          >
            Start sharing trips
          </Link>
          <Link
            href="/explore"
            className="rounded-lg px-6 py-3 text-sm font-medium text-gray-700 border transition hover:bg-gray-50"
            style={{ borderWidth: "0.5px" }}
          >
            Explore destinations
          </Link>
        </div>
      </section>

      <section className="border-t px-6 py-16" style={{ borderWidth: "0.5px" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Real cost data", desc: "Every post includes actual spend — per day, accommodation, food, transport, and flights." },
            { label: "Verified travelers", desc: "Blue checkmarks mean ID-verified. Trust the data behind the photos." },
            { label: "Any budget", desc: "Filter by travel style — budget backpacker to luxury. See what each tier actually costs." },
          ].map((f) => (
            <div key={f.label} className="border rounded-xl p-6" style={{ borderWidth: "0.5px" }}>
              <h3 className="font-semibold text-gray-900">{f.label}</h3>
              <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
