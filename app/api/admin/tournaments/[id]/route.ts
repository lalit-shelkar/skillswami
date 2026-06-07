import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const updateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  entryFee: z.number().int().min(1).optional(),
  startTime: z.string().datetime().optional(),
  roomId: z.string().max(50).nullable().optional(),
  roomPassword: z.string().max(50).nullable().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      _count: { select: { entries: true } },
      entries: {
        orderBy: { joinedAt: "asc" },
        select: {
          id: true,
          ffUsername: true,
          ffUid: true,
          joinedAt: true,
          user: { select: { email: true } },
        },
      },
    },
  });

  if (!tournament) {
    return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
  }

  return NextResponse.json({
    tournament: {
      ...tournament,
      startTime: tournament.startTime.toISOString(),
      entries: tournament.entries.map((e) => ({
        ...e,
        joinedAt: e.joinedAt.toISOString(),
      })),
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
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) data.title = parsed.data.title.trim();
    if (parsed.data.entryFee !== undefined) data.entryFee = parsed.data.entryFee;
    if (parsed.data.startTime !== undefined) {
      data.startTime = new Date(parsed.data.startTime);
    }
    if (parsed.data.roomId !== undefined) data.roomId = parsed.data.roomId?.trim() || null;
    if (parsed.data.roomPassword !== undefined) {
      data.roomPassword = parsed.data.roomPassword?.trim() || null;
    }

    const tournament = await prisma.tournament.update({
      where: { id },
      data,
      include: { _count: { select: { entries: true } } },
    });

    return NextResponse.json({
      tournament: {
        ...tournament,
        startTime: tournament.startTime.toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.tournament.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
  }
}
