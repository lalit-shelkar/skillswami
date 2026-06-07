import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatDateTime, serializeTournament } from "@/lib/tournament-utils";
import { sortScorecard, type PayoutMode } from "@/lib/scorecard";
import JoinPoolForm from "@/components/JoinPoolForm";
import MyJoinedPool from "@/components/MyJoinedPool";
import ScorecardDisplay from "@/components/ScorecardDisplay";

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      _count: { select: { entries: true } },
      entries: {
        orderBy: [{ rank: "asc" }, { kills: "desc" }],
        select: {
          id: true,
          userId: true,
          ffUsername: true,
          ffUid: true,
          kills: true,
          rank: true,
          winningAmount: true,
          joinedAt: true,
        },
      },
    },
  });

  if (!tournament) notFound();

  const userEntry = session
    ? tournament.entries.find((entry) => entry.userId === session.id)
    : null;
  const isJoined = !!userEntry;
  const serialized = serializeTournament(tournament, { isJoined });
  const hasStarted = new Date(tournament.startTime) <= new Date();

  const scorecard =
    tournament.scorecardPublished && tournament.payoutMode
      ? sortScorecard(
          tournament.entries.map((entry) => ({
            id: entry.id,
            ffUsername: entry.ffUsername,
            kills: entry.kills,
            rank: entry.rank,
            winningAmount: entry.winningAmount,
          })),
          tournament.payoutMode as PayoutMode
        )
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm text-gray-400 transition hover:text-brand-400">
        ← Back to Pools
      </Link>

      <div className="mt-6 rounded-2xl border border-surface-border bg-surface-card p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">
          {serialized.mode}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold">{serialized.title}</h1>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-gray-500">Start</p>
            <p className="mt-1 font-medium">{formatDateTime(new Date(serialized.startTime))}</p>
          </div>
          <div>
            <p className="text-gray-500">Entry Fee</p>
            <p className="mt-1 font-medium text-brand-400">{serialized.entryFee} coins</p>
          </div>
          <div>
            <p className="text-gray-500">Pool</p>
            <p className="mt-1 font-medium">
              {serialized.playerCount}/{serialized.maxPlayers}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Spots</p>
            <p className="mt-1 font-medium">
              {serialized.isFull ? "Full" : `${serialized.spotsLeft} left`}
            </p>
          </div>
        </div>
      </div>

      {!session ? (
        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
          <h2 className="text-lg font-semibold text-amber-200">Sign up required</h2>
          <p className="mt-2 text-sm text-amber-100/80">
            You must create an account before joining any pool.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/signup"
              className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-surface-border px-5 py-2.5 text-sm font-semibold text-gray-300"
            >
              Log In
            </Link>
          </div>
        </div>
      ) : isJoined && userEntry ? (
        <MyJoinedPool
          ffUsername={userEntry.ffUsername}
          ffUid={userEntry.ffUid}
          joinedAt={userEntry.joinedAt}
          entryFee={serialized.entryFee}
          startTime={serialized.startTime}
          roomId={serialized.roomId}
          roomPassword={serialized.roomPassword}
          roomVisible={serialized.roomVisible}
          roomMessage={serialized.roomMessage}
        />
      ) : (
        <div className="mt-8">
          <JoinPoolForm
            tournamentId={id}
            entryFee={serialized.entryFee}
            balance={session.balance}
            defaultUsername={session.ffUsername ?? ""}
            defaultUid={session.ffUid ?? ""}
            isFull={serialized.isFull}
            hasStarted={hasStarted}
          />
        </div>
      )}

      {scorecard && tournament.payoutMode && (
        <div className="mt-8">
          <ScorecardDisplay
            payoutMode={tournament.payoutMode as PayoutMode}
            perKillReward={tournament.perKillReward}
            scores={scorecard}
          />
        </div>
      )}
    </div>
  );
}
