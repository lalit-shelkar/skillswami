import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Skillswami",
  description: "Terms and conditions for using the Skillswami tournament platform.",
};

export default function TermsPage() {
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
          Terms &amp; <span className="text-gradient">Conditions</span>
        </h1>

        <p className="mt-4 text-sm text-gray-500">Last updated: June 7, 2026</p>

        <div className="mt-10 space-y-8 leading-relaxed text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Acceptance of terms</h2>
            <p className="mt-3 text-gray-400">
              By accessing or using Skillswami (&quot;the Platform&quot;), you agree to these
              Terms &amp; Conditions. If you do not agree, please do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">2. Eligibility</h2>
            <p className="mt-3 text-gray-400">
              You must be at least 18 years old (or the age of majority in your jurisdiction) to
              create an account, add coins, join tournament pools, or request withdrawals. You are
              responsible for ensuring that participation in skill-based gaming tournaments is
              permitted under the laws applicable to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">3. Account registration</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-gray-400">
              <li>You must provide accurate email and account information.</li>
              <li>
                Your Free Fire username and UID must match the account you use in tournament
                matches.
              </li>
              <li>You are responsible for keeping your login credentials secure.</li>
              <li>One account per person. Sharing or selling accounts is not permitted.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">4. Coins and payments</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-gray-400">
              <li>
                Coins are the in-platform balance used to pay tournament entry fees and receive
                winnings.
              </li>
              <li>
                Coin purchases are processed through our payment partner (Cashfree). Successful
                payments credit coins to your account balance.
              </li>
              <li>
                Coin balances may be withdrawn subject to minimum limits and admin approval, as
                described on the Platform and in our{" "}
                <Link href="/refund-policy" className="text-brand-400 hover:text-brand-300">
                  Refund Policy
                </Link>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">5. Tournament pools</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-gray-400">
              <li>
                Joining a pool deducts the listed entry fee from your coin balance at the time of
                entry.
              </li>
              <li>
                Room ID and password are shared before match start. It is your responsibility to
                join the in-game room on time.
              </li>
              <li>
                Prize distribution follows the scorecard and payout rules set for each tournament
                by the Platform administrators.
              </li>
              <li>
                We reserve the right to cancel, reschedule, or modify tournaments due to
                technical issues, insufficient entries, or violations of fair play.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">6. Fair play and conduct</h2>
            <p className="mt-3 text-gray-400">
              Cheating, hacking, teaming in solo modes, smurfing, account sharing, or any form of
              unfair advantage is strictly prohibited. Violations may result in disqualification,
              forfeiture of winnings, account suspension, or permanent ban without refund of entry
              fees.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">7. Withdrawals</h2>
            <p className="mt-3 text-gray-400">
              Withdrawal requests are reviewed manually. Coins are deducted when you submit a
              request and returned to your balance if the request is rejected. Approved withdrawals
              are paid to the UPI ID you provide. Processing times may vary.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">8. Limitation of liability</h2>
            <p className="mt-3 text-gray-400">
              Skillswami is provided on an &quot;as is&quot; basis. We are not liable for game
              server outages, network issues, third-party payment failures, or losses arising from
              your failure to join a match on time. Our total liability is limited to the coin
              balance directly affected by a verified Platform error.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">9. Changes to terms</h2>
            <p className="mt-3 text-gray-400">
              We may update these terms at any time. Continued use of the Platform after changes
              are posted constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">10. Contact</h2>
            <p className="mt-3 text-gray-400">
              Questions about these terms?{" "}
              <Link href="/contact" className="text-brand-400 hover:text-brand-300">
                Contact us
              </Link>{" "}
              at{" "}
              <a
                href="mailto:lalitshelkar2424@gmail.com"
                className="text-brand-400 hover:text-brand-300"
              >
                lalitshelkar2424@gmail.com
              </a>{" "}
              or{" "}
              <a href="tel:+917385624021" className="text-brand-400 hover:text-brand-300">
                +91 73856 24021
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
