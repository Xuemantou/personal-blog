import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  if (!validateSession(authToken)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
