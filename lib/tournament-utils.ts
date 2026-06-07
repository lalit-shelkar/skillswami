export const DEFAULT_MODE = "BR Match Solo (Skill On)";
export const DEFAULT_MAX_PLAYERS = 50;
export const ROOM_VISIBLE_MINUTES = 15;

export function canViewRoom(startTime: Date) {
  const now = Date.now();
  const start = startTime.getTime();
  return now >= start - ROOM_VISIBLE_MINUTES * 60 * 1000;
}

export function toLocalDatetimeInput(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function getRoomVisibilityMessage(startTime: Date) {
  if (canViewRoom(startTime)) {
    return null;
  }
  const revealAt = new Date(startTime.getTime() - ROOM_VISIBLE_MINUTES * 60 * 1000);
  return `Room details will be visible at ${formatDateTime(revealAt)} (15 minutes before match start).`;
}

export function serializeTournament(
  tournament: {
    id: string;
    title: string;
    mode: string;
    entryFee: number;
    startTime: Date;
    maxPlayers: number;
    roomId: string | null;
    roomPassword: string | null;
    _count?: { entries: number };
    entries?: { id: string; ffUsername: string; ffUid: string; joinedAt: Date }[];
  },
  options: { isJoined?: boolean; isAdmin?: boolean } = {}
) {
  const isJoined = options.isJoined ?? false;
  const isAdmin = options.isAdmin ?? false;
  const playerCount = tournament._count?.entries ?? tournament.entries?.length ?? 0;
  const showRoom = isAdmin || (isJoined && canViewRoom(tournament.startTime));

  return {
    id: tournament.id,
    title: tournament.title,
    mode: tournament.mode,
    entryFee: tournament.entryFee,
    startTime: tournament.startTime.toISOString(),
    maxPlayers: tournament.maxPlayers,
    playerCount,
    spotsLeft: tournament.maxPlayers - playerCount,
    isFull: playerCount >= tournament.maxPlayers,
    isJoined,
    roomId: showRoom ? tournament.roomId : null,
    roomPassword: showRoom ? tournament.roomPassword : null,
    roomVisible: showRoom && !!tournament.roomId,
    roomMessage: isJoined && !showRoom
      ? getRoomVisibilityMessage(tournament.startTime)
      : null,
  };
}
