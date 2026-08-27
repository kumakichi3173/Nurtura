import Link from "next/link";

const workflowCards = [
  {
    title: "Submit Feedback",
    description:
      "Capture provider feedback through a structured intake form.",
    href: "/submit",
  },
  {
    title: "Feedback Repository",
    description:
      "View all provider feedback records in one centralized list.",
    href: "/feedback",
  },
  {
    title: "Review Board",
    description:
      "Manage feedback by workflow status, priority, and owner.",
    href: "/review",
  },
  {
    title: "Reporting Dashboard",
    description:
      "Review feedback trends by category, status, priority, and provider.",
    href: "/dashboard",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-cyan-400">
          Nurtura / Feedback Bridge
        </p>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight">
          Provider Feedback & Roadmap Management Platform
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          A centralized system for collecting provider feedback, reviewing
          requests, prioritizing work, and turning insights into product and
          operational decisions.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/submit"
            className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Start Demo Flow
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-900"
          >
            View Reporting Dashboard
          </Link>
        </div>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
                V1 Workflow
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                Database-backed feedback workflow
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {workflowCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-cyan-400"
              >
                <h3 className="text-xl font-bold">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
            Current Demo Scope
          </p>
          <p className="mt-3 max-w-3xl text-slate-300">
            This local V1 demo supports feedback submission, centralized
            repository viewing, feedback detail review, internal status and
            priority updates, review board visibility, and reporting dashboard
            summaries backed by Supabase.
          </p>
        </section>
      </div>
    </main>
  );
}