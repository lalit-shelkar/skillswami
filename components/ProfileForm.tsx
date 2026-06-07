"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProfileFormProps = {
  email: string;
  ffUsername: string;
  ffUid: string;
  balance: number;
};

export default function ProfileForm({
  email,
  ffUsername: initialUsername,
  ffUid: initialUid,
  balance,
}: ProfileFormProps) {
  const router = useRouter();
  const [ffUsername, setFfUsername] = useState(initialUsername);
  const [ffUid, setFfUid] = useState(initialUid);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ffUsername, ffUid }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to update profile");
        return;
      }

      setMessage("Profile updated successfully");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <h2 className="text-lg font-semibold text-white">Account</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Email</dt>
            <dd className="text-gray-200">{email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Balance</dt>
            <dd className="font-semibold text-brand-400">{balance} coins</dd>
          </div>
        </dl>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-surface-border bg-surface-card p-6"
      >
        <h2 className="text-lg font-semibold text-white">Free Fire Profile</h2>
        <p className="mt-2 text-sm text-gray-400">
          These details are required before joining any pool. They will be asked
          again at join time for confirmation.
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

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="ffUsername" className="block text-sm font-medium text-gray-300">
              Free Fire Username
            </label>
            <input
              id="ffUsername"
              required
              value={ffUsername}
              onChange={(e) => setFfUsername(e.target.value)}
              className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
            />
          </div>

          <div>
            <label htmlFor="ffUid" className="block text-sm font-medium text-gray-300">
              Free Fire UID
            </label>
            <input
              id="ffUid"
              required
              value={ffUid}
              onChange={(e) => setFfUid(e.target.value)}
              className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white outline-none focus:border-brand-500/50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-brand-400 hover:to-brand-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
