import { NextRequest, NextResponse } from 'next/server';
import getSession from '@/lib/session';
import db from '@/lib/db';
import { sessionTracker } from '@/lib/session-tracker';

const BACKEND_URL = process.env.BACKEND_URL || 'https://aura-backend-h4ei.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newSession = await sessionTracker.startSession(userId);

    // FastAPI 백엔드로 세션 시작 요청
    const backendResponse = await fetch(`${BACKEND_URL}/start-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: newSession.id }),
    });

    if (!backendResponse.ok) {
      throw new Error('Failed to start tracking on backend');
    }

    return NextResponse.json({
      success: true,
      message: 'Session started successfully',
      sessionId: newSession.id,
    });
  } catch (error) {
    console.error('Failed to start session:', error);
    return NextResponse.json({ error: 'Failed to start session' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await sessionTracker.endSession();

    if (!result) {
      return NextResponse.json({ error: 'No active session found' }, { status: 404 });
    }

    // FastAPI session end request
    // await fetch(`${BACKEND_URL}/stop-session`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId: result.session.id }),
    // });

    return NextResponse.json({
      success: true,
      message: 'Session ended successfully',
      session: result.session,
      insights: result.insights,
    });
  } catch (error) {
    console.error('Failed to end session:', error);
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await db.workSession.findMany({
      where: { userId },
      include: { insights: true },
      orderBy: { startTime: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}