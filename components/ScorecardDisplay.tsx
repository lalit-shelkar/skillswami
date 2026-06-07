import type { ComputedScore, PayoutMode } from "@/lib/scorecard";

type ScorecardDisplayProps = {
  payoutMode: PayoutMode;
  perKillReward: number;
  scores: ComputedScore[];
};

export default function ScorecardDisplay({
  payoutMode,
  perKillReward,
  scores,
}: ScorecardDisplayProps) {
  if (scores.length === 0) return null;

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Scorecard</h2>
        <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-400">
          {payoutMode === "PER_KILL"
            ? `Pay Per Kill · ${perKillReward} coins/kill`
            : "Pay By Ranking"}
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
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
            {scores.map((row) => (
              <tr key={row.id} className="border-b border-surface-border/50">
                {payoutMode === "BY_RANKING" && (
                  <td className="px-3 py-2 font-semibold text-brand-400">
                    {row.rank ? `#${row.rank}` : "—"}
                  </td>
                )}
                <td className="px-3 py-2 font-medium text-gray-200">{row.ffUsername}</td>
                <td className="px-3 py-2 text-gray-300">{row.kills}</td>
                <td className="px-3 py-2 font-semibold text-green-400">
                  {row.winningAmount} coins
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
