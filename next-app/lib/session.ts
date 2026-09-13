import { cookies } from 'next/headers';

const COOKIE_NAME = 'uid';

export async function getCurrentUserId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function setSession(userId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
