import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type Feedback = {
  feedback_id: string;
  title: string;
  category: string | null;
  status: string;
  priority: string;
  provider_name: string | null;
  owner: string | null;
  created_at: string;
};

type CountItem = {
  label: string;
  count: number;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function countBy(items: Feedback[], field: keyof Feedback): CountItem[] {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    const rawValue = item[field];
    const label = typeof rawValue === "string" && rawValue.trim() !== "" ? rawValue : "Unassigned";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function BreakdownCard({
  title,
  items,
  total,
}: {
  title: string;
  items: CountItem[];
  total: number;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="font-semibold">{title}</h2>

      <div className="mt-5 space-y-4">
        {items.map((item) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

          return (
            <div key={item.label}>
              <div className="flex justify-between text-sm">
                <span>{item.label}</span>
                <span>{item.count}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-cyan-400"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <p className="text-sm text-slate-500">No feedback data yet.</p>
        )}
      </div>
    </div>
  );
}

export default async function ReportingDashboardPage() {
  const { data, error } = await supabase
    .from("feedback")
    .select(
      "feedback_id, title, category, status, priority, provider_name, owner, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const feedbackItems = (data ?? []) as Feedback[];
  const totalFeedback = feedbackItems.length;
  const highPriority = feedbackItems.filter(
    (item) => item.priority === "High" || item.priority === "Critical"
  ).length;
  const inReview = feedbackItems.filter(
    (item) => item.status === "In Review"
  ).length;
  const unassigned = feedbackItems.filter(
    (item) => !item.owner || item.owner.trim() === ""
  ).length;

  const metrics = [
    { label: "Total Feedback", value: totalFeedback },
    { label: "High Priority", value: highPriority },
    { label: "In Review", value: inReview },
    { label: "Unassigned", value: unassigned },
  ];

  const categoryBreakdown = countBy(feedbackItems, "category");
  const statusBreakdown = countBy(feedbackItems, "status");
  const priorityBreakdown = countBy(feedbackItems, "priority");
  const providerBreakdown = countBy(feedbackItems, "provider_name");

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm text-cyan-300 hover:underline">
            ← Back to Home
          </Link>

          <Link
            href="/review"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
          >
            View Review Board
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
            Feedback Bridge
          </p>
          <h1 className="mt-2 text-3xl font-bold">Reporting Dashboard</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            View feedback trends by category, status, priority, and provider.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <p className="text-sm text-slate-400">{metric.label}</p>
              <p className="mt-3 text-3xl font-bold">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <BreakdownCard
            title="Feedback by Category"
            items={categoryBreakdown}
            total={totalFeedback}
          />
          <BreakdownCard
            title="Feedback by Status"
            items={statusBreakdown}
            total={totalFeedback}
          />
          <BreakdownCard
            title="Feedback by Priority"
            items={priorityBreakdown}
            total={totalFeedback}
          />
          <BreakdownCard
            title="Feedback by Provider"
            items={providerBreakdown}
            total={totalFeedback}
          />
        </div>
      </div>
    </main>
  );
}