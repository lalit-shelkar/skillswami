import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { DEFAULT_MAX_PLAYERS, DEFAULT_MODE, serializeTournament } from "@/lib/tournament-utils";

const createSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  entryFee: z.number().int().min(1, "Entry fee must be at least 1"),
  startTime: z.string().datetime({ message: "Invalid start time" }),
});

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tournaments = await prisma.tournament.findMany({
    orderBy: { startTime: "desc" },
    include: { _count: { select: { entries: true } } },
  });

  return NextResponse.json({
    tournaments: tournaments.map((t) =>
      serializeTournament(t, { isAdmin: true })
    ),
  });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const startTime = new Date(parsed.data.startTime);
    if (startTime <= new Date()) {
      return NextResponse.json(
        { error: "Start time must be in the future" },
        { status: 400 }
      );
    }

    const tournament = await prisma.tournament.create({
      data: {
        title: parsed.data.title.trim(),
        entryFee: parsed.data.entryFee,
        startTime,
        mode: DEFAULT_MODE,
        maxPlayers: DEFAULT_MAX_PLAYERS,
      },
      include: { _count: { select: { entries: true } } },
    });

    return NextResponse.json({
      tournament: serializeTournament(tournament, { isAdmin: true }),
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
