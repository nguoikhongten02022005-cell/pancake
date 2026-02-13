import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
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

    const cookieStore = await cookies();
    const pageAccessToken = cookieStore.get('selected_page_token')?.value;
    const selectedPageId = cookieStore.get('selected_page_id')?.value;

    if (!pageAccessToken || !selectedPageId) {
      return NextResponse.json({ error: 'Unauthorized - no page token' }, { status: 401 });
    }

    // First, get the conversation to find the recipient (the customer PSID)
    const convoUrl = new URL(`https://graph.facebook.com/${FACEBOOK_API_VERSION}/${conversationId}`);
    convoUrl.searchParams.append('access_token', pageAccessToken);
    convoUrl.searchParams.append('fields', 'participants');

    const convoRes = await fetch(convoUrl.toString(), { cache: 'no-store' });
    const convoData = await convoRes.json();

    if (!convoRes.ok || convoData.error) {
      return NextResponse.json(
        { error: convoData?.error?.message || 'Failed to get conversation participants' },
        { status: 400 }
      );
    }

    // Find the customer (participant who is NOT the page)
    const participants = convoData.participants?.data || [];
    const customer = participants.find((p: { id: string }) => p.id !== selectedPageId);

    if (!customer) {
      return NextResponse.json({ error: 'Could not find customer in conversation' }, { status: 400 });
    }

    // Send message via Facebook Send API
    const sendUrl = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/me/messages`;
    const sendRes = await fetch(sendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: pageAccessToken,
        recipient: { id: customer.id },
        message: { text: parsed.data.content },
        messaging_type: 'RESPONSE',
      }),
    });

    const sendData = await sendRes.json();

    if (!sendRes.ok || sendData.error) {
      return NextResponse.json(
        { error: sendData?.error?.message || 'Failed to send message via Facebook' },
        { status: 400 }
      );
    }

    // Return the sent message in the expected format
    const message = {
      id: sendData.message_id || `sent_${Date.now()}`,
      senderType: 'AGENT' as const,
      senderName: user.name,
      content: parsed.data.content,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error('Messages POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
