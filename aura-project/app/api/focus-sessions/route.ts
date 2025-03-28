import { NextRequest, NextResponse } from "next/server";
import getSession from "@/lib/session";
import db from "@/lib/db";
import { sessionTracker } from "@/lib/session-tracker";

// ✅ POST: 새로운 세션 시작
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    console.log("[FocusSessions POST] Session:", session); // 세션 확인

    const userId = session?.id;
    if (!userId) {
      console.warn("[FocusSessions POST] No userId found in session");
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    const newSession = await sessionTracker.startSession(userId);
    console.log("[FocusSessions POST] New session created:", newSession); // 세션 생성 확인

    return NextResponse.json({
      success: true,
      message: "Session started successfully",
      sessionId: newSession.id,
    }, { status: 201 });
  } catch (error) {
    console.error("[FocusSessions POST] Failed to start session:", error);
    return NextResponse.json({ error: "Failed to start session" }, { status: 500 });
  }
}

// ✅ PUT: 현재 세션 종료
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    console.log("[FocusSessions PUT] Session:", session); // 세션 확인

    const userId = session?.id;
    if (!userId) {
      console.warn("[FocusSessions PUT] No userId found in session");
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    const result = await sessionTracker.endSession();
    console.log("[FocusSessions PUT] Session end result:", result); // 종료 결과 확인

    if (!result) {
      console.warn("[FocusSessions PUT] No active session found in sessionTracker");
      return NextResponse.json({ error: "No active session found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Session ended successfully",
      session: result.session,
      insights: result.insights,
    }, { status: 200 });
  } catch (error) {
    console.error("[FocusSessions PUT] Failed to end session:", error);
    return NextResponse.json({ error: "Failed to end session" }, { status: 500 });
  }
}

// ✅ GET: 최근 10개 세션 조회
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    console.log("[FocusSessions GET] Session:", session); // 세션 확인

    const userId = session?.id;
    if (!userId) {
      console.warn("[FocusSessions GET] No userId found in session");
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    const sessions = await db.workSession.findMany({
      where: { userId },
      include: { insights: true },
      orderBy: { startTime: "desc" },
      take: 10,
    });
    console.log("[FocusSessions GET] Retrieved sessions:", sessions); // 조회 결과 확인

    return NextResponse.json({
      success: true,
      sessions,
    }, { status: 200 });
  } catch (error) {
    console.error("[FocusSessions GET] Failed to fetch sessions:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}