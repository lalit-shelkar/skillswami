import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import {
  computeScorecard,
  parseRankRewards,
  rankRewardsToJson,
  sortScorecard,
  type PayoutMode,
} from "@/lib/scorecard";

const scoreSchema = z.object({
  entryId: z.string(),
  kills: z.number().int().min(0),
});

const saveSchema = z.object({
  payoutMode: z.enum(["PER_KILL", "BY_RANKING"]),
  perKillReward: z.number().int().min(0).optional(),
  rankRewards: z.record(z.string(), z.number().int().min(0)).optional(),
  scores: z.array(scoreSchema),
  publish: z.boolean().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    select: {
      id: true,
      payoutMode: true,
      perKillReward: true,
      rankRewards: true,
      scorecardPublished: true,
      entries: {
        orderBy: [{ rank: "asc" }, { kills: "desc" }],
        select: {
          id: true,
          ffUsername: true,
          kills: true,
          rank: true,
          winningAmount: true,
        },
      },
    },
  });

  if (!tournament) {
    return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
  }

  if (!tournament.scorecardPublished) {
    return NextResponse.json({ scorecard: null });
  }

  const mode = (tournament.payoutMode ?? "PER_KILL") as PayoutMode;
  const scores = sortScorecard(
    tournament.entries.map((e) => ({
      id: e.id,
      ffUsername: e.ffUsername,
      kills: e.kills,
      rank: e.rank,
      winningAmount: e.winningAmount,
    })),
    mode
  );

  return NextResponse.json({
    scorecard: {
      payoutMode: tournament.payoutMode,
      perKillReward: tournament.perKillReward,
      rankRewards: parseRankRewards(tournament.rankRewards),
      scores,
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = saveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        entries: {
          orderBy: { joinedAt: "asc" },
          select: { id: true, ffUsername: true, userId: true },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    if (tournament.winningsPaid && parsed.data.publish) {
      return NextResponse.json(
        { error: "Winnings have already been paid for this tournament" },
        { status: 400 }
      );
    }

    const entryIds = new Set(tournament.entries.map((e) => e.id));
    for (const score of parsed.data.scores) {
      if (!entryIds.has(score.entryId)) {
        return NextResponse.json({ error: "Invalid pool entry" }, { status: 400 });
      }
    }

    const killsMap = new Map(
      parsed.data.scores.map((s) => [s.entryId, s.kills])
    );

    const scoreInputs = tournament.entries.map((entry) => ({
      id: entry.id,
      ffUsername: entry.ffUsername,
      kills: killsMap.get(entry.id) ?? 0,
    }));

    const perKillReward =
      parsed.data.payoutMode === "PER_KILL"
        ? (parsed.data.perKillReward ?? tournament.perKillReward)
        : 0;

    const rankRewards =
      parsed.data.payoutMode === "BY_RANKING"
        ? (parsed.data.rankRewards ?? parseRankRewards(tournament.rankRewards))
        : parseRankRewards(tournament.rankRewards);

    const computed = computeScorecard(
      parsed.data.payoutMode,
      perKillReward,
      rankRewards,
      scoreInputs
    );

    const computedMap = new Map(computed.map((c) => [c.id, c]));

    await prisma.$transaction(async (tx) => {
      await tx.tournament.update({
        where: { id },
        data: {
          payoutMode: parsed.data.payoutMode,
          perKillReward,
          rankRewards:
            parsed.data.payoutMode === "BY_RANKING"
              ? rankRewardsToJson(rankRewards)
              : tournament.rankRewards,
          scorecardPublished: parsed.data.publish
            ? true
            : tournament.scorecardPublished,
        },
      });

      for (const entry of tournament.entries) {
        const result = computedMap.get(entry.id);
        if (!result) continue;

        await tx.poolEntry.update({
          where: { id: entry.id },
          data: {
            kills: result.kills,
            rank: result.rank,
            winningAmount: result.winningAmount,
          },
        });
      }

      if (parsed.data.publish && !tournament.winningsPaid) {
        for (const entry of tournament.entries) {
          const result = computedMap.get(entry.id);
          if (!result || result.winningAmount <= 0) continue;

          await tx.user.update({
            where: { id: entry.userId },
            data: { balance: { increment: result.winningAmount } },
          });
        }

        await tx.tournament.update({
          where: { id },
          data: { winningsPaid: true },
        });
      }
    });

    const updated = await prisma.tournament.findUnique({
      where: { id },
      include: {
        entries: {
          orderBy: [{ rank: "asc" }, { kills: "desc" }],
          select: {
            id: true,
            ffUsername: true,
            kills: true,
            rank: true,
            winningAmount: true,
            user: { select: { email: true } },
          },
        },
      },
    });

    const mode = (parsed.data.payoutMode) as PayoutMode;
    const scores = sortScorecard(
      (updated?.entries ?? []).map((e) => ({
        id: e.id,
        ffUsername: e.ffUsername,
        kills: e.kills,
        rank: e.rank,
        winningAmount: e.winningAmount,
      })),
      mode
    );

    return NextResponse.json({
      success: true,
      published: !!parsed.data.publish,
      scorecard: {
        payoutMode: parsed.data.payoutMode,
        perKillReward,
        rankRewards,
        scorecardPublished: updated?.scorecardPublished ?? false,
        winningsPaid: updated?.winningsPaid ?? tournament.winningsPaid,
        scores,
      },
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
