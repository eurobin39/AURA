import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";
import getSession from "@/lib/session";


// PATCH - Update profile (excluding password)
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  const userId = session.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { email, username, lowFocusAlert, feedbackInterval } = body;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        email,
        username,
        lowFocusAlert,
        feedbackInterval,
      },
    });

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
