
import { NextResponse } from "next/server";
import db from "@/lib/db";
import getSession from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    
    if (!session?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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