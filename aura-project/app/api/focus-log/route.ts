import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import getSession from "@/lib/session";

interface FocusLog {
  keyboard: number;
  mouseClicks: number;
  mouseDistance: number;
  focusScore: number;
  userId?: number; // 선택적, 세션에서 제공
}

// ✅ GET: 최근 10개의 포커스 로그 조회
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const latest = searchParams.get('latest') === 'true';

    if (latest) {
      // Get only the most recent log entry
      const latestLog = await db.focusLog.findFirst({
        where: { userId },
        orderBy: { timestamp: 'desc' }
      });
      
      return NextResponse.json(latestLog || {});
    } else {
      // Get all logs (existing behavior)
      const logs = await db.focusLog.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' }
      });
      
      return NextResponse.json(logs);
    }
  } catch (error) {
    console.error('Error fetching focus logs:', error);
    return NextResponse.json({ error: 'Failed to fetch focus logs' }, { status: 500 });
  }
}

// ✅ POST: 새로운 포커스 로그 저장
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    console.log("[FocusLog POST] Session:", session); // 세션 확인

    if (!session?.id) {
      console.warn("[FocusLog POST] No active session found");
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    const body: FocusLog = await req.json();
    console.log("[FocusLog POST] Received body:", body); // 요청 본문 확인

    const { keyboard, mouseClicks, mouseDistance, focusScore } = body;

    // 필수 필드 검증
    if (
      keyboard == null ||
      mouseClicks == null ||
      mouseDistance == null ||
      focusScore == null
    ) {
      console.warn("[FocusLog POST] Missing fields:", { keyboard, mouseClicks, mouseDistance, focusScore });
      return NextResponse.json(
        { error: "Missing required fields: keyboard, mouseClicks, mouseDistance, or focusScore" },
        { status: 400 }
      );
    }

    // 데이터 타입 검증 및 변환
    const validatedData = {
      keyboard: Number(keyboard),
      mouseClicks: Number(mouseClicks),
      mouseDistance: Number(mouseDistance),
      focusScore: Number(focusScore),
      userId: session.id,
    };

    if (isNaN(validatedData.keyboard) || isNaN(validatedData.mouseClicks) || 
        isNaN(validatedData.mouseDistance) || isNaN(validatedData.focusScore)) {
      console.warn("[FocusLog POST] Invalid numeric fields:", validatedData);
      return NextResponse.json(
        { error: "Invalid numeric fields: all fields must be numbers" },
        { status: 400 }
      );
    }

    console.log("[FocusLog POST] Saving to DB:", validatedData); // 저장 전 데이터 확인
    const newLog = await db.focusLog.create({
      data: validatedData,
    });
    console.log("[FocusLog POST] Saved log:", newLog); // 저장 성공 확인

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error("[FocusLog POST] Failed to save log:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to save focus log", details: errorMessage }, { status: 500 });
  }
}