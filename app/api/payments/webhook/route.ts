import { NextResponse } from "next/server";
import { getCashfreeClient } from "@/lib/cashfree";
import { fulfillPayment } from "@/lib/payments";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-webhook-signature");
    const timestamp = request.headers.get("x-webhook-timestamp");

    if (signature && timestamp) {
      const cashfree = getCashfreeClient();
      cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    }

    const payload = JSON.parse(rawBody) as {
      data?: { order?: { order_id?: string; order_status?: string } };
      order_id?: string;
    };

    const orderId =
      payload.data?.order?.order_id ??
      payload.order_id ??
      null;

    if (!orderId) {
      return NextResponse.json({ received: true });
    }

    const orderStatus = payload.data?.order?.order_status;
    if (orderStatus === "PAID" || !orderStatus) {
      await fulfillPayment(orderId);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 });
  }
}
