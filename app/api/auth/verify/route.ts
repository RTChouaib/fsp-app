import { db } from '@/lib/db';
import { normalizeEmail, verifyLoginCode } from '@/lib/auth';
import { setSession } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normalizeEmail(typeof body.email === 'string' ? body.email : '');
    const code = typeof body.code === 'string' ? body.code : '';

    if (!email || !/^\d{6}$/.test(code)) {
      return Response.json({ ok: false, error: 'Ungültiger Code.' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
      include: { subscription: true },
    });

    if (!user || !user.subscription || !['active', 'trial'].includes(user.subscription.status)) {
      return Response.json({ ok: false, error: 'Code oder Konto ist ungültig.' }, { status: 401 });
    }

    const valid = await verifyLoginCode(user.id, code);
    if (!valid) {
      return Response.json({ ok: false, error: 'Code ist falsch, abgelaufen oder wurde zu oft versucht.' }, { status: 401 });
    }

    await setSession(user.id, user.email);
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Login verification failed', error);
    return Response.json({ ok: false, error: 'Login konnte nicht abgeschlossen werden.' }, { status: 500 });
  }
}
