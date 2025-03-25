// app/api/focus-log/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import getSession from "@/lib/session";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const url = new URL(req.url);
  const fallbackId = url.searchParams.get("userId");
  const userId = session?.id ?? (fallbackId ? parseInt(fallbackId) : null);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const logs = await db.focusLog.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: 10,
    });

    return NextResponse.json(logs);
  } catch (err) {
    console.error("❌ Failed to fetch logs:", err);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  const body = await req.json();
  const fallbackId = body.userId;
  const userId = session?.id ?? fallbackId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { keyboard, mouseClicks, mouseDistance, focusScore } = body;

  try {
    const newLog = await db.focusLog.create({
      data: {
        keyboard,
        mouseClicks,
        mouseDistance,
        focusScore,
        userId,
      },
    });

    return NextResponse.json(newLog, { status: 201 });
  } catch (err) {
    console.error("❌ Failed to save log:", err);
    return NextResponse.json({ error: "Failed to save log" }, { status: 500 });
  }
}
