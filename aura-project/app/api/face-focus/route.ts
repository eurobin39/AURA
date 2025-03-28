import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import getSession from "@/lib/session";

interface FaceFocusLog {
  userId?: number; // 선택적, 세션에서 제공
  focusScore: number;
  yaw: number;
  pitch: number;
}

// ✅ GET: 최근 20개의 얼굴 포커스 로그 조회
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get URL parameters for time filtering
    const { searchParams } = new URL(request.url);
    const sessionStart = searchParams.get('sessionStart');
    const sessionEnd = searchParams.get('sessionEnd');

    // Create where clause with time filters
    const where: any = { userId };
    
    if (sessionStart || sessionEnd) {
      where.timestamp = {};
      
      if (sessionStart) {
        where.timestamp.gte = new Date(sessionStart);
      }
      
      if (sessionEnd) {
        where.timestamp.lte = new Date(sessionEnd);
      }
    }

    // Query the database with filters
    const faceLogs = await db.faceFocusLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      // Limit to most recent 50 records to avoid excessive data transfer
      take: 50
    });

    return NextResponse.json(faceLogs);
  } catch (error) {
    console.error('Error fetching face focus data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch face focus data' },
      { status: 500 }
    );
  }
}

// ✅ POST: 새로운 얼굴 포커스 로그 저장
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    console.log("[FaceFocus POST] Session:", session); // 세션 확인

    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    const body: FaceFocusLog = await req.json();
    console.log("[FaceFocus POST] Received body:", body); // 요청 본문 확인

    const { focusScore, yaw, pitch } = body;

    // 필수 필드 검증
    if (focusScore == null || yaw == null || pitch == null) {
      console.warn("[FaceFocus POST] Missing fields:", { focusScore, yaw, pitch });
      return NextResponse.json(
        { error: "Missing required fields: focusScore, yaw, or pitch" },
        { status: 400 }
      );
    }

    const newLog = await db.faceFocusLog.create({
      data: {
        userId: session.id,
        focusScore,
        yaw,
        pitch,
      },
    });
    console.log("[FaceFocus POST] Saved log:", newLog); // 저장 성공 확인

    return NextResponse.json({ success: true, log: newLog }, { status: 201 });
  } catch (error) {
    console.error("[FaceFocus POST] Failed to save log:", error);
    return NextResponse.json({ error: "Failed to save face focus log" }, { status: 500 });
  }
}