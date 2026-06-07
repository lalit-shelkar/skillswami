import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { serializeTournament } from "@/lib/tournament-utils";

export async function GET() {
  const session = await getSession();

  const tournaments = await prisma.tournament.findMany({
    where: { startTime: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    orderBy: { startTime: "asc" },
    include: {
      _count: { select: { entries: true } },
      ...(session
        ? {
            entries: {
              where: { userId: session.id },
              select: { id: true },
            },
          }
        : {}),
    },
  });

  const data = tournaments.map((t) => {
    const entries = "entries" in t ? t.entries : [];
    return serializeTournament(t, {
      isJoined: session ? entries.length > 0 : false,
      isAdmin: session?.role === "ADMIN",
    });
  });

  return NextResponse.json({ tournaments: data });
}
