"use client";

import { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";

const PACKAGES = [10, 20, 50, 100];

type AddCoinsFormProps = {
  defaultPhone?: string;
  coinsPerRupee?: number;
};

export default function AddCoinsForm({
  defaultPhone = "",
  coinsPerRupee = 1,
}: AddCoinsFormProps) {
  const [amountInr, setAmountInr] = useState("50");
  const [phone, setPhone] = useState(defaultPhone);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const coins = Math.round((parseFloat(amountInr) || 0) * coinsPerRupee);

  async function handlePay() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountInr: parseFloat(amountInr),
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to start payment");
        return;
      }

      const cashfree = await load({ mode: data.mode });
      const result = await cashfree?.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });

      if (result?.error) {
        setError(result.error.message ?? "Payment was cancelled");
      }
    } catch {
      setError("Something went wrong while starting payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
      <h2 className="text-lg font-semibold text-white">Add Coins</h2>
      <p className="mt-2 text-sm text-gray-400">
        Pay securely via Cashfree (UPI, cards, net banking).{" "}
        {coinsPerRupee === 1
          ? "₹1 = 1 coin"
          : `₹1 = ${coinsPerRupee} coins`}
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {PACKAGES.map((pkg) => (
          <button
            key={pkg}
            type="button"
            onClick={() => setAmountInr(String(pkg))}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
              amountInr === String(pkg)
                ? "border-brand-500/50 bg-brand-500/10 text-brand-300"
                : "border-surface-border text-gray-400 hover:border-brand-500/30"
            }`}
          >
            ₹{pkg}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="amountInr" className="block text-sm font-medium text-gray-300">
            Amount (INR)
          </label>
          <input
            id="amountInr"
            type="number"
            min={10}
            max={50000}
            value={amountInr}
            onChange={(e) => setAmountInr(e.target.value)}
            className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
            Mobile Number
          </label>
          <input
            id="phone"
            type="tel"
            required
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="9876543210"
            className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
          />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-surface-border bg-surface-elevated px-4 py-3 text-sm">
        You will receive{" "}
        <span className="font-semibold text-brand-400">{coins} coins</span> after successful
        payment.
      </div>

      <button
        type="button"
        onClick={handlePay}
        disabled={loading || !phone || (parseFloat(amountInr) || 0) < 10}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3.5 text-sm font-semibold text-white transition hover:from-brand-400 hover:to-brand-500 disabled:opacity-50"
      >
        {loading ? "Redirecting to Cashfree..." : `Pay ₹${amountInr || 0} with Cashfree`}
      </button>
    </div>
  );
}
