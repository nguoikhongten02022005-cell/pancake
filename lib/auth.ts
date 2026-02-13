import { cookies } from 'next/headers';

const USER_COOKIE_KEY = 'pancake_user_id';

export interface CookieUser {
  id: string;
  facebookId: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
}

export async function getCurrentUser(): Promise<CookieUser | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_COOKIE_KEY)?.value;
  const userInfoRaw = cookieStore.get('user_info')?.value;

  if (!userId || !userInfoRaw) {
    return null;
  }

  try {
    const userInfo = JSON.parse(userInfoRaw);
    return {
      id: userId,
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email ?? null,
      avatarUrl: userInfo.avatarUrl ?? null,
    };
  } catch {
    return null;
  }
}

export async function getSelectedPageIdFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get('selected_page_id')?.value ?? null;
}

export { USER_COOKIE_KEY };
