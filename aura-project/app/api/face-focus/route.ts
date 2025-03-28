import { NextResponse } from "next/server";
import db from "@/lib/db";
import getSession from "@/lib/session";

// ✅ GET: face log 
export async function GET() {
  try {
    const session = await getSession();

    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await db.faceFocusLog.findMany({
      where: { userId: session.id },
      orderBy: { timestamp: "desc" },
      take: 20,
    });

    const responseData = Array.isArray(logs) && logs ? logs : [];
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[FaceAPI] Failed to fetch logs:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// ✅ POST: new face log save in db
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, focusScore, yaw, pitch } = body;

    if (!userId || focusScore == null || yaw == null || pitch == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newLog = await db.faceFocusLog.create({
      data: {
        userId,
        focusScore,
        yaw,
        pitch,
      },
    });

    return NextResponse.json({ success: true, log: newLog });
  } catch (error) {
    console.error("[FaceAPI] Failed to save log:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
