import Link from "next/link";
import type { SessionUser } from "@/lib/types";

export default function Hero({ user }: { user: SessionUser | null }) {
  return (
    <section className="relative overflow-hidden bg-hero-glow">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              Free Fire MAX Esports Platform
            </div>

            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Master Your Skills.{" "}
              <span className="text-gradient">Win Big.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
              Join daily skill-based Free Fire MAX tournaments, compete with
              the best players in India, earn Skillswami coins, and redeem
              rewards instantly.
            </p>

            {!user ? (
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:from-brand-400 hover:to-brand-500"
                >
                  Sign Up to Join
                </Link>
                <Link
                  href="#pools"
                  className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface-elevated px-6 py-3.5 text-sm font-semibold text-white transition hover:border-brand-500/40 hover:bg-surface-card"
                >
                  View Tournaments
                </Link>
              </div>
            ) : (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="#pools"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:from-brand-400 hover:to-brand-500"
                >
                  View Tournaments
                </Link>
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface-elevated px-6 py-3.5 text-sm font-semibold text-white transition hover:border-brand-500/40"
                >
                  My Profile
                </Link>
                <span className="text-sm text-gray-500">
                  Balance:{" "}
                  <span className="font-semibold text-brand-400">{user.balance} coins</span>
                </span>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-8">
              <div>
                <p className="font-display text-2xl font-bold text-brand-400">50K+</p>
                <p className="text-sm text-gray-500">Active Players</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-brand-400">100+</p>
                <p className="text-sm text-gray-500">Daily Tournaments</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-brand-400">₹10L+</p>
                <p className="text-sm text-gray-500">Rewards Paid</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative mx-auto w-[280px] sm:w-[300px]">
              <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-b from-brand-500/20 to-purple-600/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-surface-border bg-surface-elevated shadow-2xl">
                <div className="bg-gradient-to-b from-brand-600/20 to-surface-card px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold">
                      Skill<span className="text-brand-400">swami</span>
                    </span>
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-brand-500" />
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div className="rounded-xl border border-surface-border bg-surface p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-400">Balance</span>
                      <span className="text-xs text-brand-400">+250 coins</span>
                    </div>
                    <p className="mt-1 font-display text-xl font-bold">1,250</p>
                  </div>

                  <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-3">
                    <p className="text-xs font-semibold text-brand-300">Live Tournament</p>
                    <p className="mt-1 text-sm font-medium">BR Solo · Skill On</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Entry: 25 coins</span>
                      <span className="rounded-lg bg-brand-500 px-3 py-1 text-xs font-semibold">Join</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-surface-border bg-surface p-3">
                    <p className="text-xs font-medium text-gray-400">Top Player</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400">
                        #1
                      </div>
                      <div>
                        <p className="text-sm font-medium">theved</p>
                        <p className="text-xs text-gray-500">5,945 wins</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-gray-500">
              Play directly on the website — no app download needed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
