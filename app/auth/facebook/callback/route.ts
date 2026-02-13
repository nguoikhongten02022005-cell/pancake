import { NextRequest, NextResponse } from 'next/server';

const APP_ORIGIN = process.env.APP_ORIGIN || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  const url = new URL('/api/auth/facebook/callback', APP_ORIGIN);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url);
}
