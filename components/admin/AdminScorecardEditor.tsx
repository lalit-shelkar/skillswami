"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  computeScorecard,
  DEFAULT_RANK_REWARDS,
  parseRankRewards,
  sortScorecard,
  type PayoutMode,
  type RankRewards,
} from "@/lib/scorecard";

type ScorecardEntry = {
  id: string;
  ffUsername: string;
  ffUid: string;
  kills: number;
  rank: number | null;
  winningAmount: number;
  user: { email: string };
};

type ScorecardEditorProps = {
  tournamentId: string;
  payoutMode: PayoutMode | null;
  perKillReward: number;
  rankRewardsJson: string | null;
  scorecardPublished: boolean;
  winningsPaid: boolean;
  entries: ScorecardEntry[];
};

export default function AdminScorecardEditor({
  tournamentId,
  payoutMode: initialMode,
  perKillReward: initialPerKill,
  rankRewardsJson,
  scorecardPublished,
  winningsPaid,
  entries,
}: ScorecardEditorProps) {
  const router = useRouter();
  const [payoutMode, setPayoutMode] = useState<PayoutMode>(
    initialMode ?? "PER_KILL"
  );
  const [perKillReward, setPerKillReward] = useState(String(initialPerKill || 8));
  const [rankRewards, setRankRewards] = useState<RankRewards>(
    parseRankRewards(rankRewardsJson)
  );
  const [kills, setKills] = useState<Record<string, number>>(
    Object.fromEntries(entries.map((e) => [e.id, e.kills]))
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const preview = useMemo(() => {
    const scoreInputs = entries.map((entry) => ({
      id: entry.id,
      ffUsername: entry.ffUsername,
      kills: kills[entry.id] ?? 0,
    }));

    return sortScorecard(
      computeScorecard(
        payoutMode,
        parseInt(perKillReward, 10) || 0,
        rankRewards,
        scoreInputs
      ),
      payoutMode
    );
  }, [entries, kills, payoutMode, perKillReward, rankRewards]);

  function updateRankReward(rank: string, value: string) {
    setRankRewards((prev) => ({
      ...prev,
      [rank]: parseInt(value, 10) || 0,
    }));
  }

  async function saveScorecard(publish: boolean) {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/tournaments/${tournamentId}/scorecard`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payoutMode,
          perKillReward: parseInt(perKillReward, 10) || 0,
          rankRewards: payoutMode === "BY_RANKING" ? rankRewards : undefined,
          scores: entries.map((entry) => ({
            entryId: entry.id,
            kills: kills[entry.id] ?? 0,
          })),
          publish,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to save scorecard");
        return;
      }

      setMessage(
        publish
          ? "Scorecard published and winnings credited to player balances."
          : "Scorecard saved as draft."
      );
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <h2 className="text-lg font-semibold text-white">Scorecard</h2>
        <p className="mt-2 text-sm text-gray-500">
          No players in this pool yet. Scorecard can be updated after players join.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Scorecard</h2>
          <p className="mt-1 text-sm text-gray-400">
            Update kills for each player. Winning amounts are calculated automatically.
          </p>
        </div>
        {scorecardPublished && (
          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
            Published
          </span>
        )}
      </div>

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

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-300">Payout Mode</label>
          <select
            value={payoutMode}
            onChange={(e) => setPayoutMode(e.target.value as PayoutMode)}
            disabled={winningsPaid}
            className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50 disabled:opacity-50"
          >
            <option value="PER_KILL">Pay Per Kill</option>
            <option value="BY_RANKING">Pay By Ranking</option>
          </select>
        </div>

        {payoutMode === "PER_KILL" ? (
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Coins Per Kill
            </label>
            <input
              type="number"
              min={0}
              value={perKillReward}
              onChange={(e) => setPerKillReward(e.target.value)}
              disabled={winningsPaid}
              className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50 disabled:opacity-50"
            />
          </div>
        ) : (
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-300">
              Rank Rewards (coins)
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {Object.keys(DEFAULT_RANK_REWARDS).map((rank) => (
                <div key={rank}>
                  <label className="text-xs text-gray-500">Rank #{rank}</label>
                  <input
                    type="number"
                    min={0}
                    value={rankRewards[rank] ?? 0}
                    onChange={(e) => updateRankReward(rank, e.target.value)}
                    disabled={winningsPaid}
                    className="mt-1 w-full rounded-lg border border-surface-border bg-surface-elevated px-3 py-2 text-sm text-white outline-none focus:border-brand-500/50 disabled:opacity-50"
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Rank is assigned automatically from kills (highest kills = Rank #1).
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border text-left text-xs uppercase tracking-wider text-gray-500">
              {payoutMode === "BY_RANKING" && <th className="px-3 py-2">Rank</th>}
              <th className="px-3 py-2">Username</th>
              <th className="px-3 py-2">Kills</th>
              <th className="px-3 py-2">Winning Amount</th>
            </tr>
          </thead>
          <tbody>
            {preview.map((row) => (
              <tr key={row.id} className="border-b border-surface-border/50">
                {payoutMode === "BY_RANKING" && (
                  <td className="px-3 py-2 font-semibold text-brand-400">
                    {row.rank ? `#${row.rank}` : "—"}
                  </td>
                )}
                <td className="px-3 py-2 text-gray-300">{row.ffUsername}</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    value={kills[row.id] ?? 0}
                    onChange={(e) =>
                      setKills((prev) => ({
                        ...prev,
                        [row.id]: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    disabled={winningsPaid}
                    className="w-20 rounded-lg border border-surface-border bg-surface-elevated px-2 py-1.5 text-white outline-none focus:border-brand-500/50 disabled:opacity-50"
                  />
                </td>
                <td className="px-3 py-2 font-semibold text-green-400">
                  {row.winningAmount} coins
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading || winningsPaid}
          onClick={() => saveScorecard(false)}
          className="rounded-xl border border-surface-border px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-brand-500/40 disabled:opacity-50"
        >
          Save Draft
        </button>
        <button
          type="button"
          disabled={loading || winningsPaid}
          onClick={() => saveScorecard(true)}
          className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          Publish Scorecard & Pay Winnings
        </button>
      </div>

      {winningsPaid && (
        <p className="mt-3 text-xs text-gray-500">
          Winnings have been paid. Scorecard is locked.
        </p>
      )}
    </div>
  );
}
