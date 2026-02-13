import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const FACEBOOK_API_VERSION = process.env.FACEBOOK_API_VERSION || 'v22.0';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cookieStore = await cookies();
    const userAccessToken = cookieStore.get('user_access_token')?.value;

    if (!userAccessToken) {
      return NextResponse.json(
        { error: 'No user access token found' },
        { status: 401 }
      );
    }

    // Lấy danh sách pages với page access token
    const pagesUrl = new URL(`https://graph.facebook.com/${FACEBOOK_API_VERSION}/me/accounts`);
    pagesUrl.searchParams.append('access_token', userAccessToken);
    pagesUrl.searchParams.append('fields', 'id,name,access_token,picture,category,tasks,about');
    pagesUrl.searchParams.append('limit', '50');

    const pagesResponse = await fetch(pagesUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    const pagesData = await pagesResponse.json();

    if (!pagesResponse.ok || pagesData.error) {
      console.error('Facebook pages fetch error:', pagesData);
      return NextResponse.json(
        { error: 'Failed to fetch pages', details: pagesData.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pagesData.data || [],
      paging: pagesData.paging,
    });
  } catch (error) {
    console.error('Facebook pages API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { pageId, pageAccessToken, pageName, pageCategory, pagePictureUrl } = body;

    if (!pageId || !pageAccessToken) {
      return NextResponse.json(
        { error: 'pageId and pageAccessToken are required' },
        { status: 400 }
      );
    }

    const page = await prisma.facebookPage.upsert({
      where: { facebookPageId: pageId },
      update: {
        name: pageName ?? 'Facebook Page',
        category: pageCategory ?? null,
        pictureUrl: pagePictureUrl ?? null,
        pageAccessToken,
        userId: user.id,
      },
      create: {
        facebookPageId: pageId,
        name: pageName ?? 'Facebook Page',
        category: pageCategory ?? null,
        pictureUrl: pagePictureUrl ?? null,
        pageAccessToken,
        userId: user.id,
      },
    });

    // Lưu page access token vào session/cookie
    const response = NextResponse.json({
      success: true,
      message: 'Page connected successfully',
    });

    response.cookies.set('selected_page_id', page.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 giờ
    });

    response.cookies.set('selected_page_token', pageAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
    });

    return response;
  } catch (error) {
    console.error('Save page token error:', error);
    return NextResponse.json(
      { error: 'Failed to save page token' },
      { status: 500 }
    );
  }
}