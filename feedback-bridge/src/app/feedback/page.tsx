import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type FeedbackRow = {
  feedback_id: string;
  title: string;
  provider_name: string | null;
  category: string | null;
  status: string;
  priority: string;
  owner: string | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function FeedbackListPage() {
  const { data: feedbackItems, error } = await supabase
    .from("feedback")
    .select("feedback_id, title, provider_name, category, status, priority, owner")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-cyan-300 hover:underline">
          ← Back to Home
        </Link>

        <div className="mt-8 mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
              Project Bridge
            </p>
            <h1 className="mt-2 text-3xl font-bold">Feedback Repository</h1>
          </div>

          <Link
            href="/submit"
            className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950"
          >
            Submit Feedback
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-900 text-sm text-slate-300">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Owner</th>
              </tr>
            </thead>

            <tbody>
              {(feedbackItems as FeedbackRow[]).map((item) => (
                <tr key={item.feedback_id} className="border-t border-slate-800">
                  <td className="px-4 py-4 text-slate-400">{item.feedback_id}</td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/feedback/${item.feedback_id}`}
                      className="font-semibold text-cyan-300 hover:underline"
                    >
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-4 py-4">{item.provider_name ?? "Unknown"}</td>
                  <td className="px-4 py-4">{item.category ?? "Uncategorized"}</td>
                  <td className="px-4 py-4">{item.status}</td>
                  <td className="px-4 py-4">{item.priority}</td>
                  <td className="px-4 py-4">{item.owner ?? "Unassigned"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}