import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, getSelectedPageIdFromCookie } from '@/lib/auth';

const SAMPLE_CUSTOMERS = [
  { name: 'Nguyễn Thảo Linh', avatar: 'https://i.pravatar.cc/100?img=31' },
  { name: 'Trần Minh Khoa', avatar: 'https://i.pravatar.cc/100?img=32' },
  { name: 'Phạm Hoàng An', avatar: 'https://i.pravatar.cc/100?img=33' },
  { name: 'Lê Thanh Tùng', avatar: 'https://i.pravatar.cc/100?img=34' },
  { name: 'Võ Gia Hân', avatar: 'https://i.pravatar.cc/100?img=35' },
  { name: 'Đỗ Bảo Châu', avatar: 'https://i.pravatar.cc/100?img=36' },
];

export async function POST() {
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

    const existingCount = await prisma.conversation.count({ where: { pageId: page.id } });

    if (existingCount > 0) {
      return NextResponse.json({ success: true, message: 'Seed already exists' });
    }

    for (const [index, customer] of SAMPLE_CUSTOMERS.entries()) {
      const conversation = await prisma.conversation.create({
        data: {
          pageId: page.id,
          customerName: customer.name,
          customerAvatarUrl: customer.avatar,
          status: index % 3 === 0 ? 'new' : index % 3 === 1 ? 'in_progress' : 'done',
          unreadCount: index % 2,
          lastMessagePreview: 'Cho mình xin giá và thời gian giao hàng nhé.',
          tags: {
            create: [
              {
                label: index % 2 === 0 ? 'Đơn mới' : 'Quan tâm',
                color: index % 2 === 0 ? '#2563eb' : '#f59e0b',
              },
            ],
          },
          messages: {
            create: [
              {
                senderType: 'CUSTOMER',
                senderName: customer.name,
                content: 'Chào shop, còn mẫu này không ạ?',
              },
              {
                senderType: 'AGENT',
                senderName: user.name,
                content: 'Dạ shop còn hàng, bạn cần tư vấn size nào ạ?',
              },
            ],
          },
        },
      });

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          facebookThreadId: `thread_${Date.now()}_${index}`,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Seed data created' });
  } catch (error) {
    console.error('Seed conversation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
