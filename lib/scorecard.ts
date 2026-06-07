export type PayoutMode = "PER_KILL" | "BY_RANKING";

export type RankRewards = Record<string, number>;

export type ScoreInput = {
  id: string;
  ffUsername: string;
  kills: number;
};

export type ComputedScore = ScoreInput & {
  rank: number | null;
  winningAmount: number;
};

export const DEFAULT_RANK_REWARDS: RankRewards = {
  "1": 500,
  "2": 300,
  "3": 200,
  "4": 100,
  "5": 50,
  "6": 40,
  "7": 30,
  "8": 20,
  "9": 10,
  "10": 5,
};

export function parseRankRewards(json: string | null | undefined): RankRewards {
  if (!json) return { ...DEFAULT_RANK_REWARDS };
  try {
    const parsed = JSON.parse(json) as RankRewards;
    return Object.keys(parsed).length > 0 ? parsed : { ...DEFAULT_RANK_REWARDS };
  } catch {
    return { ...DEFAULT_RANK_REWARDS };
  }
}

export function rankRewardsToJson(rewards: RankRewards): string {
  return JSON.stringify(rewards);
}

function assignRanksByKills(entries: ScoreInput[]): Map<string, number> {
  const sorted = [...entries].sort((a, b) => b.kills - a.kills);
  const rankMap = new Map<string, number>();
  let currentRank = 1;

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].kills < sorted[i - 1].kills) {
      currentRank = i + 1;
    }
    rankMap.set(sorted[i].id, currentRank);
  }

  return rankMap;
}

export function computeScorecard(
  mode: PayoutMode,
  perKillReward: number,
  rankRewards: RankRewards,
  entries: ScoreInput[]
): ComputedScore[] {
  if (entries.length === 0) return [];

  if (mode === "PER_KILL") {
    return entries.map((entry) => ({
      ...entry,
      rank: null,
      winningAmount: Math.max(0, entry.kills) * perKillReward,
    }));
  }

  const rankMap = assignRanksByKills(entries);

  return entries.map((entry) => {
    const rank = rankMap.get(entry.id) ?? null;
    const winningAmount =
      rank != null ? rankRewards[String(rank)] ?? 0 : 0;

    return {
      ...entry,
      rank,
      winningAmount,
    };
  });
}

export function sortScorecard(scores: ComputedScore[], mode: PayoutMode): ComputedScore[] {
  return [...scores].sort((a, b) => {
    if (mode === "BY_RANKING") {
      return (a.rank ?? 999) - (b.rank ?? 999);
    }
    return b.kills - a.kills || b.winningAmount - a.winningAmount;
  });
}
