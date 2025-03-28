import { NextResponse } from "next/server";
import getSession from "@/lib/session"; 

export async function POST() {
  const session = await getSession();
  await session.destroy(); // destroy the session

  return NextResponse.json({ ok: true });
}
