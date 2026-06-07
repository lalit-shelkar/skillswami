"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentStatusClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState<"loading" | "paid" | "pending" | "failed">("loading");
  const [coins, setCoins] = useState(0);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      setError("Missing payment reference");
      return;
    }

    let attempts = 0;

    async function verify() {
      try {
        const res = await fetch(`/api/payments/verify?order_id=${encodeURIComponent(orderId!)}`);
        const data = await res.json();

        if (!res.ok) {
          setStatus("failed");
          setError(data.error ?? "Verification failed");
          return;
        }

        if (data.status === "PAID") {
          setStatus("paid");
          setCoins(data.coins);
          setBalance(data.balance);
          router.refresh();
          return;
        }

        if (data.status === "PENDING" && attempts < 5) {
          attempts += 1;
          setTimeout(verify, 2000);
          return;
        }

        setStatus(data.status === "PENDING" ? "pending" : "failed");
      } catch {
        setStatus("failed");
        setError("Could not verify payment");
      }
    }

    verify();
  }, [orderId, router]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Link href="/profile" className="text-sm text-gray-400 hover:text-brand-400">
        ← Back to Profile
      </Link>

      <div className="mt-8 rounded-2xl border border-surface-border bg-surface-card p-8 text-center">
        {status === "loading" && (
          <>
            <h1 className="font-display text-2xl font-bold text-white">Verifying Payment...</h1>
            <p className="mt-3 text-sm text-gray-400">Please wait while we confirm your payment.</p>
          </>
        )}

        {status === "paid" && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-2xl text-green-400">
              ✓
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold text-white">Payment Successful</h1>
            <p className="mt-3 text-sm text-gray-400">
              <span className="font-semibold text-brand-400">{coins} coins</span> added to your
              wallet.
            </p>
            <p className="mt-2 text-sm text-gray-500">New balance: {balance} coins</p>
          </>
        )}

        {status === "pending" && (
          <>
            <h1 className="font-display text-2xl font-bold text-amber-300">Payment Pending</h1>
            <p className="mt-3 text-sm text-gray-400">
              Your payment is still processing. Coins will be added once Cashfree confirms it.
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <h1 className="font-display text-2xl font-bold text-red-300">Payment Not Completed</h1>
            <p className="mt-3 text-sm text-gray-400">
              {error || "Payment was cancelled or failed. No coins were deducted."}
            </p>
          </>
        )}

        <Link
          href="/profile"
          className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white"
        >
          Go to Profile
        </Link>
      </div>
    </div>
  );
}
