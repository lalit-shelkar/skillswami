import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { serializeWithdrawal } from "@/lib/withdrawals";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const withdrawals = await prisma.withdrawal.findMany({
    where: status === "PENDING" ? { status: "PENDING" } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { email: true } } },
  });

  return NextResponse.json({
    withdrawals: withdrawals.map(serializeWithdrawal),
  });
}
