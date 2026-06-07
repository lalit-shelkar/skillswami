import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { serializeTournament } from "@/lib/tournament-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      _count: { select: { entries: true } },
      ...(session
        ? {
            entries: {
              where: { userId: session.id },
              select: { id: true, ffUsername: true, ffUid: true, joinedAt: true },
            },
          }
        : {}),
    },
  });

  if (!tournament) {
    return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
  }

  const userEntries = "entries" in tournament ? tournament.entries : [];
  const isJoined = session ? userEntries.length > 0 : false;
  const joinedEntry = isJoined ? userEntries[0] : null;

  return NextResponse.json({
    tournament: serializeTournament(tournament, {
      isJoined,
      isAdmin: session?.role === "ADMIN",
    }),
    joinedEntry,
    user: session
      ? {
          balance: session.balance,
          ffUsername: session.ffUsername,
          ffUid: session.ffUid,
        }
      : null,
  });
}
