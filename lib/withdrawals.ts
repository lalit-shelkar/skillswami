import type { Withdrawal } from "@prisma/client";

export type SerializedWithdrawal = {
  id: string;
  coins: number;
  amountInr: number;
  upiId: string;
  status: Withdrawal["status"];
  transferReference: string | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { email: string };
};

export function serializeWithdrawal(
  withdrawal: Withdrawal & { user?: { email: string } }
): SerializedWithdrawal {
  return {
    id: withdrawal.id,
    coins: withdrawal.coins,
    amountInr: withdrawal.amountInr,
    upiId: withdrawal.upiId,
    status: withdrawal.status,
    transferReference: withdrawal.transferReference,
    adminNote: withdrawal.adminNote,
    createdAt: withdrawal.createdAt.toISOString(),
    updatedAt: withdrawal.updatedAt.toISOString(),
    user: withdrawal.user,
  };
}
