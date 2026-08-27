import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createFeedback(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const providerName = String(formData.get("provider_name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title || !providerName || !category || !description) {
    throw new Error("Title, provider, category, and description are required.");
  }

  const { count, error: countError } = await supabase
    .from("feedback")
    .select("*", { count: "exact", head: true });

  if (countError) {
    throw new Error(countError.message);
  }

  const nextNumber = String((count ?? 0) + 1).padStart(3, "0");
  const feedbackId = `FB-${nextNumber}`;

  const { error } = await supabase.from("feedback").insert({
    feedback_id: feedbackId,
    title,
    description,
    category,
    status: "New",
    priority: "Medium",
    provider_name: providerName,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/feedback");
}

export default function SubmitFeedbackPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-cyan-300 hover:underline">
          ← Back to Home
        </Link>

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
            Provider Feedback Form
          </p>

          <h1 className="mt-2 text-3xl font-bold">Submit Feedback</h1>

          <form action={createFeedback} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-300"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                required
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                placeholder="Short title of the feedback"
              />
            </div>

            <div>
              <label
                htmlFor="provider_name"
                className="block text-sm font-medium text-slate-300"
              >
                Provider
              </label>
              <input
                id="provider_name"
                name="provider_name"
                required
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                placeholder="Provider name"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-300"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue="Provider Experience"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              >
                <option value="Provider Experience">Provider Experience</option>
                <option value="Operations">Operations</option>
                <option value="Product Feature">Product Feature</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Marketplace">Marketplace</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-300"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                className="mt-2 min-h-32 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                placeholder="Describe the issue, feedback, or improvement idea"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}