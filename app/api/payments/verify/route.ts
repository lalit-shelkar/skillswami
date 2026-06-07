import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { fulfillPayment } from "@/lib/payments";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json({ error: "order_id is required" }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({
    where: { orderId },
    select: { userId: true },
  });

  if (!payment || payment.userId !== session.id) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  try {
    const result = await fulfillPayment(orderId);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
