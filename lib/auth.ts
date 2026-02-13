import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const USER_COOKIE_KEY = 'pancake_user_id';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_COOKIE_KEY)?.value;

  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({ where: { id: userId } });
}

export async function getSelectedPageIdFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get('selected_page_id')?.value ?? null;
}

export { USER_COOKIE_KEY };
