"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SerializedWithdrawal } from "@/lib/withdrawals";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminWithdrawalsPanel() {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<SerializedWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [transferRefs, setTransferRefs] = useState<Record<string, string>>({});
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  async function loadWithdrawals() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/withdrawals?status=PENDING");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to load withdrawals");
      }
      setWithdrawals(data.withdrawals);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWithdrawals();
  }, []);

  async function handleAction(id: string, action: "approve" | "reject") {
    setError("");
    setMessage("");
    setProcessingId(id);

    try {
      const res = await fetch(`/api/admin/withdrawals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          transferReference: transferRefs[id] || undefined,
          adminNote: adminNotes[id] || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to update withdrawal");
        return;
      }

      setMessage(
        action === "approve"
          ? `Marked ₹${data.withdrawal.amountInr} as paid to ${data.withdrawal.upiId}`
          : `Rejected withdrawal and refunded ${data.withdrawal.coins} coins`
      );
      setWithdrawals((prev) => prev.filter((w) => w.id !== id));
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
      <h2 className="text-lg font-semibold text-white">Pending Withdrawals</h2>
      <p className="mt-2 text-sm text-gray-400">
        Send UPI payment manually, then approve. Rejecting refunds coins to the user.
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

      {loading ? (
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      ) : withdrawals.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">No pending withdrawal requests.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {withdrawals.map((w) => (
            <li
              key={w.id}
              className="rounded-xl border border-surface-border bg-surface-elevated p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-white">
                    {w.user?.email ?? "Unknown user"}
                  </p>
                  <p className="mt-1 text-sm text-brand-400">
                    {w.coins} coins → ₹{w.amountInr}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">UPI: {w.upiId}</p>
                  <p className="mt-1 text-xs text-gray-500">{formatDate(w.createdAt)}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="UPI txn reference (optional)"
                  value={transferRefs[w.id] ?? ""}
                  onChange={(e) =>
                    setTransferRefs((prev) => ({ ...prev, [w.id]: e.target.value }))
                  }
                  className="rounded-lg border border-surface-border bg-surface-card px-3 py-2 text-sm text-white outline-none focus:border-brand-500/50"
                />
                <input
                  type="text"
                  placeholder="Note (required for reject)"
                  value={adminNotes[w.id] ?? ""}
                  onChange={(e) =>
                    setAdminNotes((prev) => ({ ...prev, [w.id]: e.target.value }))
                  }
                  className="rounded-lg border border-surface-border bg-surface-card px-3 py-2 text-sm text-white outline-none focus:border-brand-500/50"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={processingId === w.id}
                  onClick={() => handleAction(w.id, "approve")}
                  className="rounded-lg bg-green-600/20 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-600/30 disabled:opacity-50"
                >
                  {processingId === w.id ? "Processing..." : "Mark as paid"}
                </button>
                <button
                  type="button"
                  disabled={processingId === w.id}
                  onClick={() => handleAction(w.id, "reject")}
                  className="rounded-lg bg-red-600/20 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-600/30 disabled:opacity-50"
                >
                  Reject & refund
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
