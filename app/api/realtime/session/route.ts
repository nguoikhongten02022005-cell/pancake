import { NextResponse } from 'next/server';
import { getCurrentUser, getSelectedPageIdFromCookie } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  const pageId = await getSelectedPageIdFromCookie();

  if (!user || !pageId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
    },
    pageId,
  });
}
