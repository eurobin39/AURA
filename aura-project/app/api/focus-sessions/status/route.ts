import { NextRequest, NextResponse } from 'next/server';
import getSession from '@/lib/session';
import { sessionTracker } from '@/lib/session-tracker';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the current active session from the tracker
    const activeSession = await sessionTracker.getActiveSession(userId);
    
    return NextResponse.json({ 
      isActive: !!activeSession,
      session: activeSession
    });
  } catch (error) {
    console.error('Failed to get session status:', error);
    return NextResponse.json({ error: 'Failed to get session status' }, { status: 500 });
  }
} 