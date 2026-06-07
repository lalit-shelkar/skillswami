import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { serializeWithdrawal } from "@/lib/withdrawals";

const updateSchema = z.object({
  action: z.enum(["approve", "reject"]),
  transferReference: z.string().trim().optional(),
  adminNote: z.string().trim().optional(),
});

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

    const { action, transferReference, adminNote } = parsed.data;

    const updated = await prisma.$transaction(async (tx) => {
      const withdrawal = await tx.withdrawal.findUnique({ where: { id } });

      if (!withdrawal) {
        throw new Error("NOT_FOUND");
      }

      if (withdrawal.status !== "PENDING") {
        throw new Error("ALREADY_PROCESSED");
      }

      if (action === "approve") {
        return tx.withdrawal.update({
          where: { id },
          data: {
            status: "PAID",
            transferReference: transferReference || null,
            adminNote: adminNote || null,
          },
          include: { user: { select: { email: true } } },
        });
      }

      await tx.user.update({
        where: { id: withdrawal.userId },
        data: { balance: { increment: withdrawal.coins } },
      });

      return tx.withdrawal.update({
        where: { id },
        data: {
          status: "REJECTED",
          adminNote: adminNote || null,
        },
        include: { user: { select: { email: true } } },
      });
    });

    return NextResponse.json({ withdrawal: serializeWithdrawal(updated) });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOT_FOUND") {
        return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });
      }
      if (error.message === "ALREADY_PROCESSED") {
        return NextResponse.json(
          { error: "This withdrawal has already been processed" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
