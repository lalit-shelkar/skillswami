import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "skillswami@gmail.com";
  const adminPassword = "ffmaxx";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
        balance: 0,
      },
    });
    console.log("Admin user created:", adminEmail);
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { passwordHash, role: "ADMIN" },
    });
    console.log("Admin password updated:", adminEmail);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
