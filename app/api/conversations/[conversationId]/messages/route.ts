import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { emitToConversation, emitToRoom } from '@/lib/realtime';
import { getCurrentUser } from '@/lib/auth';

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

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        page: {
          userId: user.id,
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 300,
    });

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
