import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const joinSchema = z.object({
  ffUsername: z.string().min(1, "Free Fire username is required"),
  ffUid: z.string().min(1, "Free Fire UID is required"),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please sign up or log in first" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = joinSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: { _count: { select: { entries: true } } },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    if (tournament.startTime <= new Date()) {
      return NextResponse.json({ error: "This match has already started" }, { status: 400 });
    }

    if (tournament._count.entries >= tournament.maxPlayers) {
      return NextResponse.json({ error: "Pool is full (50/50)" }, { status: 400 });
    }

    const existingEntry = await prisma.poolEntry.findUnique({
      where: {
        userId_tournamentId: { userId: session.id, tournamentId: id },
      },
    });

    if (existingEntry) {
      return NextResponse.json({ error: "You have already joined this pool" }, { status: 409 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.balance < tournament.entryFee) {
      return NextResponse.json(
        { error: `Insufficient balance. Entry fee is ${tournament.entryFee} coins.` },
        { status: 400 }
      );
    }

    const ffUsername = parsed.data.ffUsername.trim();
    const ffUid = parsed.data.ffUid.trim();

    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.id },
        data: {
          balance: { decrement: tournament.entryFee },
          ffUsername,
          ffUid,
        },
      }),
      prisma.poolEntry.create({
        data: {
          userId: session.id,
          tournamentId: id,
          ffUsername,
          ffUid,
        },
      }),
    ]);

    return NextResponse.json({ success: true, message: "Successfully joined the pool!" });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
