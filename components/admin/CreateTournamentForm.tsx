"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTournamentForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [entryFee, setEntryFee] = useState("25");
  const [startTime, setStartTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isoTime = new Date(startTime).toISOString();

      const res = await fetch("/api/admin/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          entryFee: parseInt(entryFee, 10),
          startTime: isoTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to create tournament");
        return;
      }

      router.push(`/admin/tournaments/${data.tournament.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-surface-border bg-surface-card p-6">
      <h2 className="text-lg font-semibold text-white">Create Tournament</h2>
      <p className="mt-2 text-sm text-gray-400">
        Mode is fixed to <strong className="text-brand-400">BR Match Solo (Skill On)</strong> with
        a pool of 50 players.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">
            Title
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Evening BR Solo Pool"
            className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
          />
        </div>

        <div>
          <label htmlFor="entryFee" className="block text-sm font-medium text-gray-300">
            Entry Fee (coins)
          </label>
          <input
            id="entryFee"
            type="number"
            required
            min={1}
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
          />
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-300">
            Match Start Time
          </label>
          <input
            id="startTime"
            type="datetime-local"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-brand-400 hover:to-brand-500 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Tournament"}
      </button>
    </form>
  );
}
