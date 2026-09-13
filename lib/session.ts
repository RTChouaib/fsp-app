import { cookies } from 'next/headers';
import { db } from './db';

const COOKIE_NAME = 'uid';
const EMAIL_COOKIE_NAME = 'user-email';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 365,
  path: '/',
};

export function reconcileUserSession({
  uid,
  email,
  userByEmail,
}: {
  uid: string | null;
  email: string | null;
  userByEmail: Record<string, string>;
}): string | null {
  if (!email) return uid ?? null;
  const userIdFromEmail = userByEmail[email];
  return userIdFromEmail ?? uid ?? null;
}

export async function getCurrentUserId(): Promise<string | null> {
  const store = await cookies();
  const uid = store.get(COOKIE_NAME)?.value ?? null;
  const email = store.get(EMAIL_COOKIE_NAME)?.value ?? null;

  if (!uid && !email) return null;

  // Never trust a client-supplied uid by itself. Verify it against the DB.
  if (uid) {
    const user = await db.user.findUnique({ where: { id: uid } });
    if (user) {
      if (email && email !== user.email) {
        store.set(EMAIL_COOKIE_NAME, user.email, cookieOptions);
      }
      return user.id;
    }
    store.delete(COOKIE_NAME);
  }

  if (email) {
    const user = await db.user.findUnique({ where: { email } });
    if (user) {
      store.set(COOKIE_NAME, user.id, cookieOptions);
      store.set(EMAIL_COOKIE_NAME, user.email, cookieOptions);
      return user.id;
    }
    store.delete(EMAIL_COOKIE_NAME);
  }

  return null;
}

export async function setSession(userId: string, email?: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, userId, cookieOptions);

  if (email) {
    store.set(EMAIL_COOKIE_NAME, email, cookieOptions);
  }
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  store.delete(EMAIL_COOKIE_NAME);
}
