import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, getSelectedPageIdFromCookie } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const selectedPageId = await getSelectedPageIdFromCookie();

    if (!user || !selectedPageId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const page = await prisma.facebookPage.findFirst({
      where: {
        id: selectedPageId,
        userId: user.id,
      },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const status = request.nextUrl.searchParams.get('status');

    const conversations = await prisma.conversation.findMany({
      where: {
        pageId: page.id,
        ...(status ? { status } : {}),
      },
      include: {
        tags: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 100,
    });

    return NextResponse.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Conversations GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
