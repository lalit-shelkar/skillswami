import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import AdminTournamentEditor from "@/components/admin/AdminTournamentEditor";

export default async function AdminTournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");

  const { id } = await params;

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      _count: { select: { entries: true } },
      entries: {
        orderBy: { joinedAt: "asc" },
        select: {
          id: true,
          ffUsername: true,
          ffUid: true,
          kills: true,
          rank: true,
          winningAmount: true,
          joinedAt: true,
          user: { select: { email: true } },
        },
      },
    },
  });

  if (!tournament) notFound();

  const data = {
    ...tournament,
    startTime: tournament.startTime.toISOString(),
    entries: tournament.entries.map((e) => ({
      ...e,
      joinedAt: e.joinedAt.toISOString(),
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Link href="/admin" className="text-sm text-gray-400 hover:text-brand-400">
        ← Back to Admin
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-white">{tournament.title}</h1>
      <div className="mt-8">
        <AdminTournamentEditor tournament={data} />
      </div>
    </div>
  );
}
