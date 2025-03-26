import { NextRequest, NextResponse } from 'next/server';
import getSession from '@/lib/session';
import db from '@/lib/db';
import { sessionTracker } from '@/lib/session-tracker';

// Start a new focus session
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const newSession = await sessionTracker.startSession(userId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Session started successfully',
      sessionId: newSession.id 
    });
  } catch (error) {
    console.error('Failed to start session:', error);
    return NextResponse.json({ error: 'Failed to start session' }, { status: 500 });
  }
}

// End current focus session
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
    
    return NextResponse.json({ 
      success: true, 
      message: 'Session ended successfully',
      session: result.session,
      insights: result.insights
    });
  } catch (error) {
    console.error('Failed to end session:', error);
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 });
  }
}

// Get user's focus sessions history
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
      take: 10
    });
    
    return NextResponse.json({ 
      success: true, 
      sessions 
    });
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
} 