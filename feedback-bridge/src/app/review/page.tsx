import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type Feedback = {
  feedback_id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  priority: string;
  provider_name: string | null;
  owner: string | null;
  created_at: string;
};

const statuses = ["New", "In Review", "Planned", "Resolved", "Closed"];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function ReviewBoardPage() {
  const { data, error } = await supabase
    .from("feedback")
    .select(
      "feedback_id, title, description, category, status, priority, provider_name, owner, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const feedbackItems = (data ?? []) as Feedback[];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-sm text-cyan-300 hover:underline">
              ← Back to Home
            </Link>

            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-cyan-400">
              Feedback Bridge
            </p>
            <h1 className="mt-2 text-4xl font-bold">
              Review / Prioritization Board
            </h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Manage provider feedback by workflow status, priority, and owner.
            </p>
          </div>

          <Link
            href="/feedback"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
          >
            Back to Repository
          </Link>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {statuses.map((status) => {
            const items = feedbackItems.filter(
              (feedback) => feedback.status === status
            );

            return (
              <section
                key={status}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">{status}</h2>
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                    {items.length}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {items.map((feedback) => (
                    <Link
                      key={feedback.feedback_id}
                      href={`/feedback/${feedback.feedback_id}`}
                      className="block rounded-lg border border-slate-800 bg-slate-950 p-4 hover:border-cyan-400"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-cyan-400">
                          {feedback.feedback_id}
                        </p>
                        <span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-300">
                          {feedback.priority}
                        </span>
                      </div>

                      <h3 className="mt-3 font-semibold">{feedback.title}</h3>

                      <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                        {feedback.description ?? "No description provided."}
                      </p>

                      <div className="mt-4 space-y-1 text-xs text-slate-500">
                        <p>Provider: {feedback.provider_name ?? "Unknown"}</p>
                        <p>Owner: {feedback.owner ?? "Unassigned"}</p>
                        <p>Category: {feedback.category ?? "Uncategorized"}</p>
                      </div>
                    </Link>
                  ))}

                  {items.length === 0 && (
                    <div className="rounded-lg border border-dashed border-slate-800 p-4 text-sm text-slate-500">
                      No feedback items
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}