import Link from "next/link";
import { formatDateTime } from "@/lib/tournament-utils";

export type TournamentItem = {
  id: string;
  title: string;
  mode: string;
  entryFee: number;
  startTime: string;
  maxPlayers: number;
  playerCount: number;
  spotsLeft: number;
  isFull: boolean;
  isJoined?: boolean;
};

export default function TournamentCard({
  tournament,
  variant = "join",
}: {
  tournament: TournamentItem;
  variant?: "join" | "joined";
}) {
  const startDate = new Date(tournament.startTime);

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card bg-card-glow p-6 transition hover:border-brand-500/30">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">
            {tournament.mode}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">{tournament.title}</h3>
        </div>
        {variant === "joined" && (
          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
            Joined
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Start Time</p>
          <p className="mt-1 font-medium text-gray-200">{formatDateTime(startDate)}</p>
        </div>
        <div>
          <p className="text-gray-500">Entry Fee</p>
          <p className="mt-1 font-medium text-brand-400">{tournament.entryFee} coins</p>
        </div>
        <div>
          <p className="text-gray-500">Pool</p>
          <p className="mt-1 font-medium text-gray-200">
            {tournament.playerCount}/{tournament.maxPlayers} players
          </p>
        </div>
        <div>
          <p className="text-gray-500">Status</p>
          <p className="mt-1 font-medium text-gray-200">
            {tournament.isFull ? "Full" : `${tournament.spotsLeft} spots left`}
          </p>
        </div>
      </div>

      <Link
        href={`/tournaments/${tournament.id}`}
        className={`mt-6 flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-white transition ${
          variant === "joined"
            ? "border border-green-500/30 bg-green-500/10 text-green-300 hover:border-green-500/50"
            : "bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500"
        }`}
      >
        {variant === "joined" ? "My Joined Pool" : "Join Pool"}
      </Link>
    </div>
  );
}
