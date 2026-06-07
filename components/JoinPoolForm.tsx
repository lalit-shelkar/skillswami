"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type JoinPoolFormProps = {
  tournamentId: string;
  entryFee: number;
  balance: number;
  defaultUsername: string;
  defaultUid: string;
  isFull: boolean;
  hasStarted: boolean;
};

export default function JoinPoolForm({
  tournamentId,
  entryFee,
  balance,
  defaultUsername,
  defaultUid,
  isFull,
  hasStarted,
}: JoinPoolFormProps) {
  const router = useRouter();
  const [ffUsername, setFfUsername] = useState(defaultUsername);
  const [ffUid, setFfUid] = useState(defaultUid);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (hasStarted) {
    return (
      <div className="rounded-xl border border-surface-border bg-surface-elevated p-5 text-sm text-gray-400">
        This match has already started. Joining is closed.
      </div>
    );
  }

  if (isFull) {
    return (
      <div className="rounded-xl border border-surface-border bg-surface-elevated p-5 text-sm text-gray-400">
        Pool is full (50/50). No more spots available.
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ffUsername, ffUid }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to join pool");
        return;
      }

      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
      <h3 className="text-lg font-semibold text-white">Join Pool</h3>
      <p className="mt-2 text-sm text-gray-400">
        Sign up is required before joining. Confirm your Free Fire details below.
        Entry fee of <span className="text-brand-400">{entryFee} coins</span> will
        be deducted from your balance.
      </p>

      <div className="mt-4 rounded-lg border border-surface-border bg-surface-elevated px-4 py-3 text-sm">
        Your balance: <span className="font-semibold text-brand-400">{balance} coins</span>
        {balance < entryFee && (
          <p className="mt-1 text-red-400">
            Insufficient balance.{" "}
            <a href="/profile" className="underline text-brand-400">
              Add coins via Cashfree
            </a>{" "}
            on your profile page.
          </p>
        )}
      </div>

      {!defaultUsername || !defaultUid ? (
        <p className="mt-4 text-sm text-amber-400">
          Tip: Save your FF details in{" "}
          <Link href="/profile" className="underline">
            Profile
          </Link>{" "}
          so they auto-fill next time.
        </p>
      ) : null}

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="ffUsername" className="block text-sm font-medium text-gray-300">
            Free Fire Username
          </label>
          <input
            id="ffUsername"
            required
            value={ffUsername}
            onChange={(e) => setFfUsername(e.target.value)}
            className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
          />
        </div>

        <div>
          <label htmlFor="ffUid" className="block text-sm font-medium text-gray-300">
            Free Fire UID
          </label>
          <input
            id="ffUid"
            required
            value={ffUid}
            onChange={(e) => setFfUid(e.target.value)}
            className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
          />
        </div>

        <button
          type="submit"
          disabled={loading || balance < entryFee}
          className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3.5 text-sm font-semibold text-white transition hover:from-brand-400 hover:to-brand-500 disabled:opacity-50"
        >
          {loading ? "Joining..." : `Pay ${entryFee} coins & Join Pool`}
        </button>
      </form>
    </div>
  );
}
