import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const profileSchema = z.object({
  ffUsername: z.string().min(1, "Free Fire username is required").max(50),
  ffUid: z.string().min(1, "Free Fire UID is required").max(20),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user: session });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.id },
      data: {
        ffUsername: parsed.data.ffUsername.trim(),
        ffUid: parsed.data.ffUid.trim(),
      },
      select: {
        id: true,
        email: true,
        role: true,
        ffUsername: true,
        ffUid: true,
        balance: true,
      },
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
