"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type FeedbackToastProps = {
  show: boolean;
};

type InternalReviewFormProps = {
  feedbackId: string;
  initialStatus: string;
  initialPriority: string;
  initialOwner: string | null;
  providerName: string | null;
  category: string | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function FeedbackToast({ show }: FeedbackToastProps) {
  const [visible, setVisible] = useState(show);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!show) return;

    setVisible(true);
    setEntered(false);
    setLeaving(false);

    const enterTimer = setTimeout(() => {
      setEntered(true);
    }, 20);

    const fadeTimer = setTimeout(() => {
      setLeaving(true);
      setEntered(false);
    }, 2600);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 3200);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [show]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex w-[360px] items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-3 text-sm text-slate-100 shadow-2xl shadow-slate-950/70 backdrop-blur transition-all duration-500 ease-out ${
        leaving
          ? "translate-y-3 opacity-0"
          : entered
            ? "translate-y-0 opacity-100"
            : "translate-y-3 opacity-0"
      }`}
    >
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-slate-950">
        ✓
      </div>

      <div>
        <p className="font-semibold">Feedback updated</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-400">
          Status, priority, and owner were saved successfully.
        </p>
      </div>
    </div>
  );
}

export function InternalReviewForm({
  feedbackId,
  initialStatus,
  initialPriority,
  initialOwner,
  providerName,
  category,
}: InternalReviewFormProps) {
  const [status, setStatus] = useState(initialStatus);
  const [priority, setPriority] = useState(initialPriority);
  const [owner, setOwner] = useState(initialOwner ?? "");
  const [saving, setSaving] = useState(false);
  const [toastKey, setToastKey] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("feedback")
      .update({
        status,
        priority,
        owner: owner.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("feedback_id", feedbackId);

    setSaving(false);

    if (error) {
      throw new Error(error.message);
    }

    setToastKey((current) => current + 1);
  }

  return (
    <>
      {toastKey > 0 && <FeedbackToast key={toastKey} show />}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-800 p-4">
          <p className="text-sm text-slate-400">Status</p>
          <p className="mt-1 font-semibold">{status}</p>
        </div>

        <div className="rounded-lg border border-slate-800 p-4">
          <p className="text-sm text-slate-400">Priority</p>
          <p className="mt-1 font-semibold">{priority}</p>
        </div>

        <div className="rounded-lg border border-slate-800 p-4">
          <p className="text-sm text-slate-400">Provider</p>
          <p className="mt-1 font-semibold">{providerName ?? "Unknown"}</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-slate-800 p-4">
        <h2 className="font-semibold">Category</h2>
        <p className="mt-2 text-slate-300">{category ?? "Uncategorized"}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
              Internal Review
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Review and prioritize this feedback
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Update the workflow status, priority, and internal owner for this item.
            </p>
          </div>

          <span className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">
            Roadmap workflow
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm text-slate-400">Status</label>
            <select
              name="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
            >
              <option value="New">New</option>
              <option value="In Review">In Review</option>
              <option value="Planned">Planned</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-400">Priority</label>
            <select
              name="priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-400">Owner</label>
            <input
              name="owner"
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              placeholder="Assign owner"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">
            This UI prepares the detail page for the internal review workflow.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Update Feedback"}
          </button>
        </div>
      </form>
    </>
  );
}