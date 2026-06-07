import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | Skillswami",
  description: "Get in touch with the Skillswami team for support, questions, or feedback.",
};

export default function ContactPage() {
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
          Contact <span className="text-gradient">Us</span>
        </h1>

        <p className="mt-4 text-gray-400">
          Have a question about tournaments, payments, or your account? We&apos;re here to help.
        </p>

        <div className="mt-10 space-y-8 leading-relaxed text-gray-300">
          <div>
            <h2 className="text-xl font-semibold text-white">Email</h2>
            <p className="mt-3 text-gray-400">
              For general support, payment issues, or withdrawal queries, reach us at:
            </p>
            <a
              href="mailto:lalitshelkar2424@gmail.com"
              className="mt-2 inline-block font-medium text-brand-400 transition hover:text-brand-300"
            >
              lalitshelkar2424@gmail.com
            </a>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Phone</h2>
            <p className="mt-3 text-gray-400">
              For urgent match-day issues or quick support, call or WhatsApp:
            </p>
            <a
              href="tel:+917385624021"
              className="mt-2 inline-block font-medium text-brand-400 transition hover:text-brand-300"
            >
              +91 73856 24021
            </a>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">What to include</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-gray-400">
              <li>Your registered email address</li>
              <li>Free Fire username and UID (if related to a pool entry)</li>
              <li>Tournament name or date (if applicable)</li>
              <li>Payment order ID or withdrawal request details (if applicable)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Response time</h2>
            <p className="mt-3 text-gray-400">
              We aim to respond within 24–48 hours on business days. For urgent match-day
              issues (room ID, password, or entry problems), please email as early as possible
              before the tournament start time.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Related policies</h2>
            <ul className="mt-3 space-y-2 text-gray-400">
              <li>
                <Link href="/terms" className="text-brand-400 transition hover:text-brand-300">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-brand-400 transition hover:text-brand-300"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
