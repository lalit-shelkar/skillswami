import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getCoinsPerRupee,
  getMaxWithdrawalCoins,
  getMinWithdrawalCoins,
} from "@/lib/cashfree";
import ProfileForm from "@/components/ProfileForm";
import AddCoinsForm from "@/components/AddCoinsForm";
import WithdrawCoinsForm from "@/components/WithdrawCoinsForm";
import WithdrawalHistory from "@/components/WithdrawalHistory";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { phone: true },
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-white">My Profile</h1>
      <p className="mt-2 text-gray-400">
        Manage your account and Free Fire details required for joining pools.
      </p>
      <div className="mt-8 space-y-6">
        <AddCoinsForm
          defaultPhone={user?.phone ?? ""}
          coinsPerRupee={getCoinsPerRupee()}
        />
        <WithdrawCoinsForm
          balance={session.balance}
          coinsPerRupee={getCoinsPerRupee()}
          minWithdrawalCoins={getMinWithdrawalCoins()}
          maxWithdrawalCoins={getMaxWithdrawalCoins()}
        />
        <WithdrawalHistory />
        <ProfileForm
          email={session.email}
          ffUsername={session.ffUsername ?? ""}
          ffUid={session.ffUid ?? ""}
          balance={session.balance}
        />
      </div>
    </div>
  );
}
