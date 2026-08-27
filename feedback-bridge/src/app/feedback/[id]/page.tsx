import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { InternalReviewForm } from "./FeedbackToast";

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

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function FeedbackDetailPage({ params }: PageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("feedback")
    .select(
      "feedback_id, title, description, category, status, priority, provider_name, owner, created_at"
    )
    .eq("feedback_id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const feedback = data as Feedback;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/feedback" className="text-sm text-cyan-300 hover:underline">
          ← Back to Feedback List
        </Link>

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm font-semibold text-cyan-400">
            {feedback.feedback_id}
          </p>

          <h1 className="mt-3 text-3xl font-bold">{feedback.title}</h1>

          <p className="mt-4 text-slate-300">
            {feedback.description ?? "No description provided."}
          </p>

          <InternalReviewForm
            feedbackId={feedback.feedback_id}
            initialStatus={feedback.status}
            initialPriority={feedback.priority}
            initialOwner={feedback.owner}
            providerName={feedback.provider_name}
            category={feedback.category}
          />
        </div>
      </div>
    </main>
  );
}