import { createHash, randomInt } from 'node:crypto';
import { db } from '@/lib/db';

const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function hashLoginCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

export async function createLoginCode(userId: string): Promise<string> {
  // Only one live code at a time for an account.
  await db.loginCode.deleteMany({ where: { userId, usedAt: null } });

  const code = randomInt(100000, 1000000).toString();
  await db.loginCode.create({
    data: {
      userId,
      codeHash: hashLoginCode(code),
      expiresAt: new Date(Date.now() + CODE_TTL_MS),
    },
  });

  return code;
}

export async function verifyLoginCode(userId: string, code: string): Promise<boolean> {
  const record = await db.loginCode.findFirst({
    where: {
      userId,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!record || record.attempts >= MAX_ATTEMPTS) return false;

  const valid = record.codeHash === hashLoginCode(code.trim());
  if (!valid) {
    await db.loginCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return false;
  }

  await db.loginCode.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });
  return true;
}
