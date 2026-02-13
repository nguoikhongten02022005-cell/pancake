import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCurrentUser, getSelectedPageIdFromCookie } from '@/lib/auth';

const FACEBOOK_API_VERSION = process.env.FACEBOOK_API_VERSION || 'v22.0';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const selectedPageId = await getSelectedPageIdFromCookie();
    const cookieStore = await cookies();
    const pageAccessToken = cookieStore.get('selected_page_token')?.value;

    if (!user || !selectedPageId || !pageAccessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = request.nextUrl.searchParams.get('status');

    const url = new URL(`https://graph.facebook.com/${FACEBOOK_API_VERSION}/${selectedPageId}/conversations`);
    url.searchParams.append('access_token', pageAccessToken);
    url.searchParams.append('fields', 'id,updated_time,snippet,unread_count,senders.limit(10){id,name}');
    url.searchParams.append('limit', '100');

    const fbRes = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    const fbData = await fbRes.json();

    if (!fbRes.ok || fbData.error) {
      return NextResponse.json(
        { error: fbData?.error?.message || 'Failed to fetch conversations from Facebook' },
        { status: 400 }
      );
    }

    const conversations = (fbData.data || []).map((item: {
      id: string;
      updated_time?: string;
      snippet?: string;
      unread_count?: number;
      senders?: { data?: Array<{ id: string; name: string }> };
    }) => {
      const participants = item.senders?.data || [];
      const customer = participants.find((p) => p.id !== selectedPageId) || participants[0];
      const unreadCount = Number(item.unread_count || 0);

      return {
        id: item.id,
        customerName: customer?.name || 'Khách hàng Facebook',
        customerAvatarUrl: null,
        lastMessagePreview: item.snippet || null,
        status: unreadCount > 0 ? 'new' : 'in_progress',
        unreadCount,
        updatedAt: item.updated_time || new Date().toISOString(),
        tags: [],
      };
    });

    const filtered = status && status !== 'all'
      ? conversations.filter((item: { status: string }) => item.status === status)
      : conversations;

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error('Conversations GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
