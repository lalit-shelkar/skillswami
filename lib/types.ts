export type SessionUser = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  ffUsername: string | null;
  ffUid: string | null;
  balance: number;
};
