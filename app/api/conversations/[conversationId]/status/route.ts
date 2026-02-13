import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { emitToRoom } from '@/lib/realtime';

const updateStatusSchema = z.object({
  status: z.enum(['new', 'in_progress', 'done']),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = await context.params;
    const payload = await request.json();
    const parsed = updateStatusSchema.safeParse(payload);

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
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const updated = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: parsed.data.status,
        updatedAt: new Date(),
      },
      include: {
        tags: true,
      },
    });

    emitToRoom(`page:${updated.pageId}`, 'conversation:updated', {
      conversationId: updated.id,
      pageId: updated.pageId,
      conversation: updated,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Conversation status PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
