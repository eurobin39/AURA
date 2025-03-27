// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import getSession from '@/lib/session';

// ✅ GET - fetch user info
export async function GET(req: NextRequest) {
  const session = await getSession();
  const userId = session.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        lowFocusAlert: true,
        feedbackInterval: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('GET /api/user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
