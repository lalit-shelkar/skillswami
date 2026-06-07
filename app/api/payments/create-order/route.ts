import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  generateOrderId,
  getAppBaseUrl,
  getCashfreeClient,
  getCashfreeMode,
  inrToCoins,
} from "@/lib/cashfree";

const createOrderSchema = z.object({
  amountInr: z.number().min(10, "Minimum top-up is ₹10").max(50000, "Maximum top-up is ₹50,000"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in first" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { amountInr, phone } = parsed.data;
    const coins = inrToCoins(amountInr);
    const orderId = generateOrderId(session.id);
    const cashfree = getCashfreeClient();

    const response = await cashfree.PGCreateOrder({
      order_id: orderId,
      order_amount: amountInr,
      order_currency: "INR",
      customer_details: {
        customer_id: session.id,
        customer_email: session.email,
        customer_phone: phone,
      },
      order_meta: {
        return_url: `${getAppBaseUrl()}/profile/payment?order_id={order_id}`,
      },
      order_note: `Skillswami wallet top-up: ${coins} coins`,
    });

    const paymentSessionId = response.data.payment_session_id;
    if (!paymentSessionId) {
      return NextResponse.json({ error: "Failed to create payment session" }, { status: 500 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.id },
        data: { phone },
      }),
      prisma.payment.create({
        data: {
          orderId,
          userId: session.id,
          amountInr,
          coins,
          paymentSessionId,
          status: "PENDING",
        },
      }),
    ]);

    return NextResponse.json({
      orderId,
      paymentSessionId,
      amountInr,
      coins,
      mode: getCashfreeMode(),
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("Cashfree credentials")
        ? "Payment gateway is not configured. Add Cashfree keys to .env"
        : error instanceof Error
          ? error.message
          : "Failed to create payment order";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
