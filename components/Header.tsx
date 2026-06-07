"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SessionUser } from "@/lib/types";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#my-pools", label: "My Pools", authOnly: true },
  { href: "/#pools", label: "Join Pool" },
  { href: "/about", label: "About" },
];

export default function Header({ user }: { user: SessionUser | null }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border/60 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/25">
            <span className="font-display text-lg font-bold text-white">S</span>
          </div>
          <span className="font-display text-xl font-bold tracking-wide text-white">
            Skill<span className="text-brand-400">swami</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks
            .filter((link) => !link.authOnly || user)
            .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-400 transition hover:text-brand-400"
            >
              {link.label}
            </Link>
          ))}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-sm font-medium text-brand-400 transition hover:text-brand-300"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/profile"
                className="hidden text-sm text-gray-400 transition hover:text-white sm:block"
              >
                {user.email}
              </Link>
              <Link
                href="/profile"
                className="rounded-xl border border-surface-border px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-brand-500/40"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-xl px-3 py-2 text-sm text-gray-500 transition hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl border border-surface-border px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-brand-500/40"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-brand-400 hover:to-brand-500"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
