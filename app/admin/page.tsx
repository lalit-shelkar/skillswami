import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatDateTime, serializeTournament } from "@/lib/tournament-utils";
import CreateTournamentForm from "@/components/admin/CreateTournamentForm";
import AdminWithdrawalsPanel from "@/components/admin/AdminWithdrawalsPanel";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");

  const tournaments = await prisma.tournament.findMany({
    orderBy: { startTime: "desc" },
    include: { _count: { select: { entries: true } } },
  });

  const items = tournaments.map((t) => serializeTournament(t, { isAdmin: true }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Admin Panel</h1>
          <p className="mt-2 text-gray-400">Manage tournaments, withdrawals, and player pools.</p>
        </div>
        <Link href="/" className="text-sm text-gray-400 hover:text-brand-400">
          ← Back to site
        </Link>
      </div>

      <div className="mt-10 space-y-8">
        <AdminWithdrawalsPanel />

        <div className="grid gap-8 lg:grid-cols-2">
          <CreateTournamentForm />

          <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
            <h2 className="text-lg font-semibold text-white">All Tournaments</h2>

            {items.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">No tournaments created yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {items.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/admin/tournaments/${t.id}`}
                      className="block rounded-xl border border-surface-border bg-surface-elevated p-4 transition hover:border-brand-500/30"
                    >
                      <p className="font-medium text-white">{t.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDateTime(new Date(t.startTime))} · {t.playerCount}/{t.maxPlayers} ·{" "}
                        {t.entryFee} coins
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
