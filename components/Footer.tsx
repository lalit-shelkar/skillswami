import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
                <span className="font-display text-sm font-bold">S</span>
              </div>
              <span className="font-display text-lg font-bold">
                Skill<span className="text-brand-400">swami</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
              Web-based Free Fire MAX tournament pools. Sign up, join, and play.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white">Links</h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-gray-400 transition hover:text-brand-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#pools" className="text-sm text-gray-400 transition hover:text-brand-400">
                  Pools
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-400 transition hover:text-brand-400">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white">Account</h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/signup" className="text-sm text-gray-400 transition hover:text-brand-400">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-gray-400 transition hover:text-brand-400">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-gray-400 transition hover:text-brand-400">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-surface-border pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Skillswami. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
