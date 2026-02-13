import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { USER_COOKIE_KEY } from '@/lib/auth';

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID';
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || 'YOUR_FACEBOOK_APP_SECRET';
const APP_ORIGIN = process.env.APP_ORIGIN || 'http://localhost:3000';
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI || `${APP_ORIGIN}/api/auth/facebook/callback`;
const FACEBOOK_API_VERSION = process.env.FACEBOOK_API_VERSION || 'v22.0';

function isPlaceholderValue(value: string | undefined) {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  return (
    normalized.length === 0 ||
    normalized.startsWith('your_') ||
    normalized.startsWith('paste_') ||
    normalized.includes('your_facebook_') ||
    normalized.includes('paste_your_')
  );
}

function appUrl(path: string) {
  return new URL(path, APP_ORIGIN);
}

export async function GET(request: NextRequest) {
  try {
    if (isPlaceholderValue(FACEBOOK_APP_ID) || isPlaceholderValue(FACEBOOK_APP_SECRET)) {
      return NextResponse.redirect(appUrl('/login?error=missing_facebook_config'));
    }

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // Verify state
    const cookieStore = await cookies();
    const savedState = cookieStore.get('oauth_state')?.value;

    if (!state || !savedState || state !== savedState) {
      return NextResponse.redirect(
        appUrl('/login?error=invalid_state')
      );
    }

    if (!code) {
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description') ?? 'missing_authorization_code';
      return NextResponse.redirect(
        appUrl(`/login?error=${error}&description=${errorDescription}`)
      );
    }

    // Exchange code for user access token
    const tokenUrl = new URL(`https://graph.facebook.com/${FACEBOOK_API_VERSION}/oauth/access_token`);
    tokenUrl.searchParams.append('client_id', FACEBOOK_APP_ID);
    tokenUrl.searchParams.append('client_secret', FACEBOOK_APP_SECRET);
    tokenUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    tokenUrl.searchParams.append('code', code);

    const tokenResponse = await fetch(tokenUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error) {
      console.error('Facebook token exchange error:', tokenData);
      const errorMessage = tokenData?.error?.message ?? 'Token exchange failed';
      return NextResponse.redirect(
        appUrl(`/login?error=token_exchange_failed&description=${encodeURIComponent(errorMessage)}`)
      );
    }

    const userAccessToken = tokenData.access_token;

    // Get user info
    const userUrl = new URL(`https://graph.facebook.com/${FACEBOOK_API_VERSION}/me`);
    userUrl.searchParams.append('access_token', userAccessToken);
    userUrl.searchParams.append('fields', 'id,name,email,picture.width(200).height(200)');

    const userResponse = await fetch(userUrl.toString());
    const userData = await userResponse.json();

    const user = await prisma.user.upsert({
      where: {
        facebookId: userData.id,
      },
      update: {
        name: userData.name,
        email: userData.email ?? null,
        avatarUrl: userData.picture?.data?.url ?? null,
      },
      create: {
        facebookId: userData.id,
        name: userData.name,
        email: userData.email ?? null,
        avatarUrl: userData.picture?.data?.url ?? null,
      },
    });

    // Lưu user access token và user info vào session/cookie
    const response = NextResponse.redirect(
      appUrl('/auth/facebook/pages')
    );

    // Lưu vào cookies (trong thực tế nên dùng database hoặc session)
    response.cookies.set('user_access_token', userAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 giờ
    });

    response.cookies.set('user_info', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600,
    });

    response.cookies.set(USER_COOKIE_KEY, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
    });

    // Xóa state cookie
    response.cookies.delete('oauth_state');

    return response;
  } catch (error) {
    console.error('Facebook callback error:', error);
    return NextResponse.redirect(
      appUrl('/login?error=callback_failed')
    );
  }
}