import { formatDateTime } from "@/lib/tournament-utils";

type MyJoinedPoolProps = {
  ffUsername: string;
  ffUid: string;
  joinedAt: Date;
  entryFee: number;
  startTime: string;
  roomId: string | null;
  roomPassword: string | null;
  roomVisible: boolean;
  roomMessage: string | null;
};

export default function MyJoinedPool({
  ffUsername,
  ffUid,
  joinedAt,
  entryFee,
  startTime,
  roomId,
  roomPassword,
  roomVisible,
  roomMessage,
}: MyJoinedPoolProps) {
  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6">
        <h2 className="text-lg font-semibold text-green-300">My Joined Pool</h2>
        <p className="mt-2 text-sm text-green-200/80">
          You have successfully joined this tournament pool.
        </p>

        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-400">FF Username</dt>
            <dd className="mt-1 font-medium text-white">{ffUsername}</dd>
          </div>
          <div>
            <dt className="text-gray-400">FF UID</dt>
            <dd className="mt-1 font-medium text-white">{ffUid}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Entry Paid</dt>
            <dd className="mt-1 font-medium text-brand-400">{entryFee} coins</dd>
          </div>
          <div>
            <dt className="text-gray-400">Joined At</dt>
            <dd className="mt-1 font-medium text-white">{formatDateTime(joinedAt)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-gray-400">Match Start</dt>
            <dd className="mt-1 font-medium text-white">{formatDateTime(new Date(startTime))}</dd>
          </div>
        </dl>
      </div>

      {roomVisible && roomId ? (
        <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-6">
          <h2 className="text-lg font-semibold text-brand-300">Room Details</h2>
          <dl className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-400">Room ID</dt>
              <dd className="font-mono font-semibold text-white">{roomId}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-400">Password</dt>
              <dd className="font-mono font-semibold text-white">{roomPassword ?? "—"}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
          <h2 className="text-lg font-semibold text-white">Room Details</h2>
          <p className="mt-2 text-sm text-gray-400">
            {roomMessage ??
              "Room ID and password will appear here 15 minutes before match start."}
          </p>
        </div>
      )}
    </div>
  );
}
