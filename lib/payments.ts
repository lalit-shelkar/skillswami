import { prisma } from "./prisma";
import { getCashfreeClient } from "./cashfree";

export type FulfillResult =
  | { status: "PAID"; coins: number; balance: number }
  | { status: "PENDING" }
  | { status: "FAILED" }
  | { status: "NOT_FOUND" };

export async function fulfillPayment(orderId: string): Promise<FulfillResult> {
  const payment = await prisma.payment.findUnique({
    where: { orderId },
    include: { user: { select: { id: true, balance: true } } },
  });

  if (!payment) {
    return { status: "NOT_FOUND" };
  }

  if (payment.status === "PAID") {
    return {
      status: "PAID",
      coins: payment.coins,
      balance: payment.user.balance,
    };
  }

  const cashfree = getCashfreeClient();
  const response = await cashfree.PGFetchOrder(orderId);
  const orderStatus = response.data.order_status;

  if (orderStatus === "PAID") {
    const updated = await prisma.$transaction(async (tx) => {
      const current = await tx.payment.findUnique({ where: { orderId } });
      if (!current || current.status === "PAID") {
        const user = await tx.user.findUniqueOrThrow({
          where: { id: payment.userId },
        });
        return { coins: current?.coins ?? payment.coins, balance: user.balance };
      }

      await tx.payment.update({
        where: { orderId },
        data: { status: "PAID" },
      });

      const user = await tx.user.update({
        where: { id: payment.userId },
        data: { balance: { increment: payment.coins } },
        select: { balance: true },
      });

      return { coins: payment.coins, balance: user.balance };
    });

    return { status: "PAID", ...updated };
  }

  if (orderStatus === "ACTIVE" || orderStatus === "PENDING") {
    return { status: "PENDING" };
  }

  await prisma.payment.update({
    where: { orderId },
    data: { status: "FAILED" },
  });

  return { status: "FAILED" };
}
