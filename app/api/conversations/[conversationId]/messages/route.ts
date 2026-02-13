import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { emitToConversation, emitToRoom } from '@/lib/realtime';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

const FACEBOOK_API_VERSION = process.env.FACEBOOK_API_VERSION || 'v22.0';

const createMessageSchema = z.object({
  content: z.string().min(1).max(2000),
});

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = await context.params;
    const cookieStore = await cookies();
    const pageAccessToken = cookieStore.get('selected_page_token')?.value;
    const selectedPageId = cookieStore.get('selected_page_id')?.value;

    if (!pageAccessToken || !selectedPageId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(`https://graph.facebook.com/${FACEBOOK_API_VERSION}/${conversationId}/messages`);
    url.searchParams.append('access_token', pageAccessToken);
    url.searchParams.append('fields', 'id,message,from,created_time');
    url.searchParams.append('limit', '200');

    const fbRes = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    const fbData = await fbRes.json();

    if (!fbRes.ok || fbData.error) {
      return NextResponse.json(
        { error: fbData?.error?.message || 'Failed to fetch messages from Facebook' },
        { status: 400 }
      );
    }

    const messages = (fbData.data || [])
      .map((item: {
        id: string;
        message?: string;
        from?: { id?: string; name?: string };
        created_time?: string;
      }) => ({
        id: item.id,
        senderType: item.from?.id === selectedPageId ? 'AGENT' : 'CUSTOMER',
        senderName: item.from?.name || 'Facebook User',
        content: item.message || '',
        createdAt: item.created_time || new Date().toISOString(),
      }))
      .filter((item: { content: string }) => item.content.trim().length > 0)
      .sort(
        (a: { createdAt: string }, b: { createdAt: string }) =>
          Number(new Date(a.createdAt)) - Number(new Date(b.createdAt))
      );

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('Messages GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = await context.params;
    const body = await request.json();
    const parsed = createMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        page: {
          userId: user.id,
        },
      },
      include: {
        page: true,
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderType: 'AGENT',
        senderName: user.name,
        content: parsed.data.content,
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessagePreview: parsed.data.content,
        status: 'in_progress',
        updatedAt: new Date(),
      },
    });

    const payload = {
      conversationId,
      pageId: conversation.pageId,
      message,
    };

    emitToConversation(conversationId, 'message:new', payload);
    emitToRoom(`page:${conversation.pageId}`, 'conversation:updated', payload);

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error('Messages POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
