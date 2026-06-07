import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Skillswami | Skillswami",
  description: "Skillswami — skill-based Free Fire MAX tournament pools on the web.",
};

export default function AboutPage() {
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
          About <span className="text-gradient">Skillswami</span>
        </h1>

        <div className="mt-10 space-y-8 leading-relaxed text-gray-300">
          <p>
            Skillswami is a web-based tournament platform for Free Fire MAX players.
            Join BR Match Solo (Skill On) pools directly from your browser — no app
            download required.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-white">How it works</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-gray-400">
              <li>Sign up with your email and password</li>
              <li>Set your Free Fire username and UID in your profile</li>
              <li>Join a pool by paying the match entry fee from your balance</li>
              <li>Room ID and password appear 15 minutes before match start</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Current game mode</h2>
            <p className="mt-3 text-gray-400">
              We currently offer <strong className="text-brand-400">BR Match Solo (Skill On)</strong>{" "}
              pools with up to 50 players. More tournament formats will be added soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
