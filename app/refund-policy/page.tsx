import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | Skillswami",
  description: "Refund and cancellation policy for Skillswami coin purchases, pool entries, and withdrawals.",
};

export default function RefundPolicyPage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-hero-glow" />

      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-400 transition hover:text-brand-400"
        >
          ← Back to Home
        </Link>

        <h1 className="mt-6 font-display text-4xl font-bold">
          Refund <span className="text-gradient">Policy</span>
        </h1>

        <p className="mt-4 text-sm text-gray-500">Last updated: June 7, 2026</p>

        <div className="mt-10 space-y-8 leading-relaxed text-gray-300">
          <p className="text-gray-400">
            This policy explains when refunds apply on Skillswami. By using the Platform, you
            agree to the terms below.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-white">1. Coin purchases (add coins)</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-gray-400">
              <li>
                <strong className="text-gray-300">Successful payments:</strong> Once coins are
                credited to your account, purchases are generally non-refundable. Coins remain in
                your balance for tournament entry or withdrawal.
              </li>
              <li>
                <strong className="text-gray-300">Failed or cancelled payments:</strong> If a
                payment fails or is cancelled before completion, no coins are added and no charge
                should appear on your account.
              </li>
              <li>
                <strong className="text-gray-300">Duplicate charges:</strong> If you were charged
                twice for the same order, contact us with your order ID within 7 days for review.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">2. Tournament pool entry fees</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-gray-400">
              <li>
                Entry fees are deducted from your coin balance when you join a pool. Joining is
                final once confirmed.
              </li>
              <li>
                <strong className="text-gray-300">Cancelled tournaments:</strong> If we cancel a
                tournament before it starts, entry fees will be refunded to your coin balance.
              </li>
              <li>
                <strong className="text-gray-300">No-show or late join:</strong> If you fail to
                join the in-game room on time, entry fees are not refunded.
              </li>
              <li>
                <strong className="text-gray-300">Disqualification:</strong> Entry fees are not
                refunded if you are removed for cheating, rule violations, or providing incorrect
                Free Fire details.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">3. Withdrawals</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-gray-400">
              <li>
                When you submit a withdrawal request, the requested coins are deducted from your
                balance immediately.
              </li>
              <li>
                <strong className="text-gray-300">Rejected requests:</strong> If an admin rejects
                your withdrawal, the full coin amount is returned to your balance automatically.
              </li>
              <li>
                <strong className="text-gray-300">Approved requests:</strong> Once approved and
                paid to your UPI ID, withdrawals cannot be reversed. Ensure your UPI details are
                correct before submitting.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">4. Winnings and prizes</h2>
            <p className="mt-3 text-gray-400">
              Tournament winnings are credited to your coin balance according to the published
              scorecard. Prize disputes must be raised within 48 hours of scorecard publication,
              with supporting evidence. We will investigate and adjust balances only for verified
              Platform or scoring errors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">5. How to request a refund review</h2>
            <p className="mt-3 text-gray-400">
              Email{" "}
              <a
                href="mailto:lalitshelkar2424@gmail.com"
                className="text-brand-400 hover:text-brand-300"
              >
                lalitshelkar2424@gmail.com
              </a>{" "}
              or call{" "}
              <a href="tel:+917385624021" className="text-brand-400 hover:text-brand-300">
                +91 73856 24021
              </a>{" "}
              with your registered email, order ID or tournament details, and a description of the
              issue. Refund requests are reviewed on a case-by-case basis within 5–7 business
              days.
            </p>
            <p className="mt-3 text-gray-400">
              You can also visit our{" "}
              <Link href="/contact" className="text-brand-400 hover:text-brand-300">
                Contact Us
              </Link>{" "}
              page for more information.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
