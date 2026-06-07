import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { serializeTournament } from "@/lib/tournament-utils";
import Hero from "@/components/Hero";
import TournamentCard from "@/components/TournamentCard";

export default async function HomePage() {
  const session = await getSession();

  const tournaments = await prisma.tournament.findMany({
    where: { startTime: { gte: new Date() } },
    orderBy: { startTime: "asc" },
    include: {
      _count: { select: { entries: true } },
      ...(session
        ? {
            entries: {
              where: { userId: session.id },
              select: { id: true },
            },
          }
        : {}),
    },
  });

  const items = tournaments.map((t) => {
    const entries = "entries" in t ? t.entries : [];
    return serializeTournament(t, {
      isJoined: session ? entries.length > 0 : false,
    });
  });

  const myJoinedPools = items.filter((t) => t.isJoined);
  const availablePools = items.filter((t) => !t.isJoined);

  return (
    <>
      <Hero user={session} />

      {session && myJoinedPools.length > 0 && (
        <section id="my-pools" className="border-t border-surface-border bg-surface-card/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-green-400">
                My Pools
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                My Joined <span className="text-gradient">Pools</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-400">
                Tournaments you have already joined. View room details and match info here.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myJoinedPools.map((t) => (
                <TournamentCard key={t.id} tournament={t} variant="joined" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="pools" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
              Tournaments
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              BR Match Solo <span className="text-gradient">(Skill On)</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              50-player pools. Sign up, pay the entry fee, and join directly from the website.
            </p>
          </div>

          {availablePools.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-surface-border bg-surface-card p-12 text-center">
              <p className="text-gray-400">
                {items.length === 0
                  ? "No active pools right now."
                  : "No open pools to join right now. Check My Joined Pools above."}
              </p>
              <p className="mt-2 text-sm text-gray-500">Check back soon for new tournaments.</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availablePools.map((t) => (
                <TournamentCard key={t.id} tournament={t} variant="join" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="how-it-works" className="border-t border-surface-border bg-surface-card/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-bold">How It Works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Sign Up",
                desc: "Create an account with email and password.",
              },
              {
                step: "2",
                title: "Set FF Profile",
                desc: "Add your Free Fire username and UID in your profile.",
              },
              {
                step: "3",
                title: "Join & Play",
                desc: "Pay the entry fee, join the pool, and get room details 15 min before start.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 font-display text-lg font-bold text-brand-400">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
