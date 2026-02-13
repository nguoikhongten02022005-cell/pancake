import { NextResponse } from 'next/server';
import { USER_COOKIE_KEY } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.delete('user_access_token');
  response.cookies.delete('user_info');
  response.cookies.delete('selected_page_id');
  response.cookies.delete('selected_page_token');
  response.cookies.delete(USER_COOKIE_KEY);

  return response;
}
