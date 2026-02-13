import { NextRequest, NextResponse } from 'next/server';

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID';
const APP_ORIGIN = process.env.APP_ORIGIN || 'http://localhost:3000';
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI || `${APP_ORIGIN}/api/auth/facebook/callback`;
const FACEBOOK_API_VERSION = process.env.FACEBOOK_API_VERSION || 'v22.0';
const FACEBOOK_LOGIN_CONFIG_ID = process.env.FACEBOOK_LOGIN_CONFIG_ID;
const HAS_VALID_CONFIG_ID =
  !!FACEBOOK_LOGIN_CONFIG_ID &&
  FACEBOOK_LOGIN_CONFIG_ID !== 'PASTE_YOUR_LOGIN_CONFIG_ID_HERE';

function appUrl(path: string) {
  return new URL(path, APP_ORIGIN);
}

export async function GET(request: NextRequest) {
  try {
    if (!FACEBOOK_APP_ID || FACEBOOK_APP_ID === 'YOUR_FACEBOOK_APP_ID') {
      return NextResponse.redirect(appUrl('/login?error=missing_facebook_config'));
    }

    if (!HAS_VALID_CONFIG_ID) {
      return NextResponse.redirect(appUrl('/login?error=missing_facebook_business_config'));
    }

    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state') || Math.random().toString(36).substring(7);

    // Facebook OAuth authorize URL
    const authUrl = new URL(`https://www.facebook.com/${FACEBOOK_API_VERSION}/dialog/oauth`);
    authUrl.searchParams.append('client_id', FACEBOOK_APP_ID);
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('state', state);

    // Facebook Login for Business bắt buộc: dùng Login Configuration (config_id)
    authUrl.searchParams.append('config_id', FACEBOOK_LOGIN_CONFIG_ID!);

    // Lưu state vào session/cookie để verify sau này (đây là ví dụ đơn giản)
    const response = NextResponse.redirect(authUrl.toString());
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 phút
    });

    return response;
  } catch (error) {
    console.error('Facebook authorize error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Facebook authorization' },
      { status: 500 }
    );
  }
}