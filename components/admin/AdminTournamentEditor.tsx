"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateTime, toLocalDatetimeInput } from "@/lib/tournament-utils";
import AdminScorecardEditor from "@/components/admin/AdminScorecardEditor";
import type { PayoutMode } from "@/lib/scorecard";

type Entry = {
  id: string;
  ffUsername: string;
  ffUid: string;
  kills: number;
  rank: number | null;
  winningAmount: number;
  joinedAt: string;
  user: { email: string };
};

type TournamentData = {
  id: string;
  title: string;
  mode: string;
  entryFee: number;
  startTime: string;
  maxPlayers: number;
  roomId: string | null;
  roomPassword: string | null;
  payoutMode: PayoutMode | null;
  perKillReward: number;
  rankRewards: string | null;
  scorecardPublished: boolean;
  winningsPaid: boolean;
  entries: Entry[];
  _count: { entries: number };
};

export default function AdminTournamentEditor({
  tournament: initial,
}: {
  tournament: TournamentData;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [entryFee, setEntryFee] = useState(String(initial.entryFee));
  const [startTime, setStartTime] = useState(
    toLocalDatetimeInput(new Date(initial.startTime))
  );
  const [roomId, setRoomId] = useState(initial.roomId ?? "");
  const [roomPassword, setRoomPassword] = useState(initial.roomPassword ?? "");
  const [creditEmail, setCreditEmail] = useState("");
  const [creditAmount, setCreditAmount] = useState("100");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/tournaments/${initial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          entryFee: parseInt(entryFee, 10),
          startTime: new Date(startTime).toISOString(),
          roomId: roomId || null,
          roomPassword: roomPassword || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to update");
        return;
      }

      setMessage("Tournament updated");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreditBalance(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: creditEmail,
          amount: parseInt(creditAmount, 10),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to add balance");
        return;
      }

      setMessage(`Added ${creditAmount} coins to ${data.user.email}. New balance: ${data.user.balance}`);
      setCreditEmail("");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">
          {initial.mode}
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Pool: {initial._count.entries}/{initial.maxPlayers} players
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <h2 className="text-lg font-semibold text-white">Edit Tournament</h2>

        {message && (
          <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Entry Fee</label>
            <input
              type="number"
              min={1}
              value={entryFee}
              onChange={(e) => setEntryFee(e.target.value)}
              className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Room ID</label>
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Add before match"
              className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Room Password</label>
            <input
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              placeholder="Add before match"
              className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
            />
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Room ID and password become visible to joined players 15 minutes before match start.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          Save Changes
        </button>
      </form>

      <AdminScorecardEditor
        tournamentId={initial.id}
        payoutMode={initial.payoutMode}
        perKillReward={initial.perKillReward}
        rankRewardsJson={initial.rankRewards}
        scorecardPublished={initial.scorecardPublished}
        winningsPaid={initial.winningsPaid}
        entries={initial.entries}
      />

      <form onSubmit={handleCreditBalance} className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <h2 className="text-lg font-semibold text-white">Add User Balance</h2>
        <p className="mt-2 text-sm text-gray-400">
          Credit coins to a user so they can pay match entry fees.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300">User Email</label>
            <input
              type="email"
              required
              value={creditEmail}
              onChange={(e) => setCreditEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Amount (coins)</label>
            <input
              type="number"
              min={1}
              required
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 rounded-xl border border-surface-border px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-brand-500/40 disabled:opacity-50"
        >
          Add Balance
        </button>
      </form>

      <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <h2 className="text-lg font-semibold text-white">
          Joined Players ({initial.entries.length})
        </h2>

        {initial.entries.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">No players have joined yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">FF Username</th>
                  <th className="px-3 py-2">UID</th>
                  <th className="px-3 py-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {initial.entries.map((entry, i) => (
                  <tr key={entry.id} className="border-b border-surface-border/50">
                    <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-2 text-gray-300">{entry.user.email}</td>
                    <td className="px-3 py-2 text-gray-300">{entry.ffUsername}</td>
                    <td className="px-3 py-2 text-gray-300">{entry.ffUid}</td>
                    <td className="px-3 py-2 text-gray-500">
                      {formatDateTime(new Date(entry.joinedAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
