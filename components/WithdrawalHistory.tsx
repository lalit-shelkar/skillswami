"use client";

import { useEffect, useState } from "react";
import type { SerializedWithdrawal } from "@/lib/withdrawals";

const STATUS_LABELS: Record<SerializedWithdrawal["status"], string> = {
  PENDING: "Pending",
  PAID: "Paid",
  REJECTED: "Rejected",
};

const STATUS_STYLES: Record<SerializedWithdrawal["status"], string> = {
  PENDING: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  PAID: "text-green-300 bg-green-500/10 border-green-500/30",
  REJECTED: "text-red-300 bg-red-500/10 border-red-500/30",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WithdrawalHistory() {
  const [withdrawals, setWithdrawals] = useState<SerializedWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/withdrawals")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Failed to load withdrawals");
        }
        setWithdrawals(data.withdrawals);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load withdrawals");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <h2 className="text-lg font-semibold text-white">Withdrawal History</h2>
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
      <h2 className="text-lg font-semibold text-white">Withdrawal History</h2>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {!error && withdrawals.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No withdrawal requests yet.</p>
      )}

      {withdrawals.length > 0 && (
        <ul className="mt-4 space-y-3">
          {withdrawals.map((w) => (
            <li
              key={w.id}
              className="rounded-xl border border-surface-border bg-surface-elevated p-4 text-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-white">
                    {w.coins} coins → ₹{w.amountInr}
                  </p>
                  <p className="mt-1 text-gray-500">{formatDate(w.createdAt)}</p>
                  <p className="mt-1 text-gray-400">UPI: {w.upiId}</p>
                </div>
                <span
                  className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[w.status]}`}
                >
                  {STATUS_LABELS[w.status]}
                </span>
              </div>
              {w.status === "REJECTED" && w.adminNote && (
                <p className="mt-2 text-xs text-red-300">Reason: {w.adminNote}</p>
              )}
              {w.status === "PAID" && w.transferReference && (
                <p className="mt-2 text-xs text-gray-400">Ref: {w.transferReference}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
