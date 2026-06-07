import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  coinsToInr,
  getMaxWithdrawalCoins,
  getMinWithdrawalCoins,
  isValidUpiId,
} from "@/lib/cashfree";
import { serializeWithdrawal } from "@/lib/withdrawals";

const createWithdrawalSchema = z.object({
  coins: z.number().int().min(1),
  upiId: z.string().min(3, "UPI ID is required"),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in first" }, { status: 401 });
  }

  const withdrawals = await prisma.withdrawal.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({
    withdrawals: withdrawals.map(serializeWithdrawal),
    balance: session.balance,
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in first" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createWithdrawalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { coins } = parsed.data;
    const upiId = parsed.data.upiId.trim().toLowerCase();
    const minCoins = getMinWithdrawalCoins();
    const maxCoins = getMaxWithdrawalCoins();

    if (!isValidUpiId(upiId)) {
      return NextResponse.json(
        { error: "Enter a valid UPI ID (e.g. name@upi)" },
        { status: 400 }
      );
    }

    if (coins < minCoins) {
      return NextResponse.json(
        { error: `Minimum withdrawal is ${minCoins} coins (₹${coinsToInr(minCoins)})` },
        { status: 400 }
      );
    }

    if (coins > maxCoins) {
      return NextResponse.json(
        { error: `Maximum withdrawal is ${maxCoins} coins per request` },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const pendingCount = await tx.withdrawal.count({
        where: { userId: session.id, status: "PENDING" },
      });

      if (pendingCount > 0) {
        throw new Error("PENDING_EXISTS");
      }

      const user = await tx.user.findUnique({ where: { id: session.id } });
      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      if (user.balance < coins) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      const amountInr = coinsToInr(coins);

      const [updatedUser, withdrawal] = await Promise.all([
        tx.user.update({
          where: { id: session.id },
          data: { balance: { decrement: coins } },
          select: { balance: true },
        }),
        tx.withdrawal.create({
          data: {
            userId: session.id,
            coins,
            amountInr,
            upiId,
          },
        }),
      ]);

      return { withdrawal, balance: updatedUser.balance };
    });

    return NextResponse.json({
      withdrawal: serializeWithdrawal(result.withdrawal),
      balance: result.balance,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PENDING_EXISTS") {
        return NextResponse.json(
          { error: "You already have a pending withdrawal. Wait for it to be processed." },
          { status: 409 }
        );
      }
      if (error.message === "INSUFFICIENT_BALANCE") {
        return NextResponse.json(
          { error: "Insufficient balance for this withdrawal" },
          { status: 400 }
        );
      }
      if (error.message === "USER_NOT_FOUND") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
