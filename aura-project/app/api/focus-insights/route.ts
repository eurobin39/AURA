// app/api/focus-insights/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import getSession from '@/lib/session';

export async function GET(req: NextRequest) {
  const session = await getSession();
  const userId = session.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await db.focusInsight.findMany({
      where: { userId },
      orderBy: { date: 'asc' }, // optional, for chronological order
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Focus insight fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
