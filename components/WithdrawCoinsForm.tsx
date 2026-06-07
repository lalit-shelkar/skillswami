"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type WithdrawCoinsFormProps = {
  balance: number;
  coinsPerRupee?: number;
  minWithdrawalCoins?: number;
  maxWithdrawalCoins?: number;
};

export default function WithdrawCoinsForm({
  balance,
  coinsPerRupee = 1,
  minWithdrawalCoins = 10,
  maxWithdrawalCoins = 50000,
}: WithdrawCoinsFormProps) {
  const router = useRouter();
  const [coins, setCoins] = useState(String(Math.min(balance, minWithdrawalCoins)));
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const coinsNum = parseInt(coins, 10) || 0;
  const amountInr = Math.round((coinsNum / coinsPerRupee) * 100) / 100;
  const canSubmit =
    coinsNum >= minWithdrawalCoins &&
    coinsNum <= maxWithdrawalCoins &&
    coinsNum <= balance &&
    upiId.trim().length >= 3;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coins: coinsNum,
          upiId: upiId.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to submit withdrawal");
        return;
      }

      setMessage(
        `Withdrawal request submitted. ₹${amountInr} will be sent to ${upiId.trim()} after admin approval.`
      );
      setUpiId("");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-surface-border bg-surface-card p-6"
    >
      <h2 className="text-lg font-semibold text-white">Withdraw Coins</h2>
      <p className="mt-2 text-sm text-gray-400">
        Redeem coins to INR via UPI. Minimum {minWithdrawalCoins} coins (₹
        {Math.round((minWithdrawalCoins / coinsPerRupee) * 100) / 100}). Coins are
        deducted immediately and refunded if rejected.
      </p>

      {message && (
        <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-5 rounded-lg border border-surface-border bg-surface-elevated px-4 py-3 text-sm">
        Available balance:{" "}
        <span className="font-semibold text-brand-400">{balance} coins</span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="withdrawCoins" className="block text-sm font-medium text-gray-300">
            Coins to withdraw
          </label>
          <input
            id="withdrawCoins"
            type="number"
            min={minWithdrawalCoins}
            max={Math.min(maxWithdrawalCoins, balance)}
            value={coins}
            onChange={(e) => setCoins(e.target.value)}
            className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
          />
        </div>

        <div>
          <label htmlFor="upiId" className="block text-sm font-medium text-gray-300">
            UPI ID
          </label>
          <input
            id="upiId"
            type="text"
            required
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="name@upi"
            className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
          />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-surface-border bg-surface-elevated px-4 py-3 text-sm">
        You will receive{" "}
        <span className="font-semibold text-brand-400">₹{amountInr}</span> after approval.
      </div>

      <button
        type="submit"
        disabled={loading || !canSubmit}
        className="mt-6 w-full rounded-xl border border-brand-500/40 bg-brand-500/10 py-3.5 text-sm font-semibold text-brand-300 transition hover:bg-brand-500/20 disabled:opacity-50"
      >
        {loading ? "Submitting..." : `Request withdrawal (₹${amountInr})`}
      </button>
    </form>
  );
}
