import { Cashfree, CFEnvironment } from "cashfree-pg";

function getEnv() {
  return process.env.CASHFREE_ENV === "production"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;
}

export function getCashfreeClient() {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) {
    throw new Error("Cashfree credentials are not configured");
  }

  return new Cashfree(getEnv(), appId, secretKey);
}

export function getAppBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "http://localhost:3000"
  );
}

export function getCashfreeMode(): "sandbox" | "production" {
  return process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";
}

export function getCoinsPerRupee() {
  const rate = parseInt(process.env.COINS_PER_RUPEE ?? "1", 10);
  return Number.isFinite(rate) && rate > 0 ? rate : 1;
}

export function inrToCoins(amountInr: number) {
  return Math.round(amountInr * getCoinsPerRupee());
}

export function coinsToInr(coins: number) {
  return Math.round((coins / getCoinsPerRupee()) * 100) / 100;
}

export function getMinWithdrawalInr() {
  return 10;
}

export function getMinWithdrawalCoins() {
  return inrToCoins(getMinWithdrawalInr());
}

export function getMaxWithdrawalInr() {
  return 50000;
}

export function getMaxWithdrawalCoins() {
  return inrToCoins(getMaxWithdrawalInr());
}

const UPI_ID_PATTERN = /^[\w.-]{2,256}@[\w.-]{2,64}$/;

export function isValidUpiId(upiId: string) {
  return UPI_ID_PATTERN.test(upiId.trim().toLowerCase());
}

export function generateOrderId(userId: string) {
  return `SW_${userId.slice(0, 8)}_${Date.now()}`;
}
