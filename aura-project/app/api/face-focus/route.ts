// app/api/face-focus/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";
import getSession from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    // 세션이 없거나 사용자 ID가 없는 경우
    if (!session?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 데이터베이스에서 로그 조회
    const logs = await db.faceFocusLog.findMany({
      where: { userId: session.id },
      orderBy: { timestamp: "desc" },
      take: 20,
    });

    // logs가 null/undefined이거나 배열이 아닌 경우 빈 배열 반환
    const responseData = Array.isArray(logs) && logs ? logs : [];
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[FaceAPI] Failed to fetch logs:", error);
    // 오류 발생 시에도 빈 배열 반환으로 일관성 유지
    return NextResponse.json([], { status: 500 });
  }
}