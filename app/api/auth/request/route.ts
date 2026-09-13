import { db } from '@/lib/db';
import { createLoginCode, normalizeEmail } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normalizeEmail(typeof body.email === 'string' ? body.email : '');

    if (!email || !email.includes('@') || email.length > 254) {
      return Response.json({ ok: false, error: 'Bitte eine gültige E-Mail-Adresse eingeben.' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
      include: { subscription: true },
    });

    // Don't reveal whether an email exists or has paid access.
    if (!user || !user.subscription || !['active', 'trial'].includes(user.subscription.status)) {
      return Response.json({ ok: true });
    }

    // Avoid repeatedly sending codes to the same account. The response stays
    // generic so account existence is not disclosed.
    const recentCode = await db.loginCode.findFirst({
      where: {
        userId: user.id,
        createdAt: { gt: new Date(Date.now() - 60 * 1000) },
        usedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
    if (recentCode) return Response.json({ ok: true });

    const code = await createLoginCode(user.id);
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;

    if (!apiKey || !from) {
      console.error('Login email is not configured. Set RESEND_API_KEY and EMAIL_FROM.');
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEV LOGIN CODE] ${email}: ${code}`);
      }
      return Response.json({ ok: false, error: 'Der Login ist momentan nicht konfiguriert.' }, { status: 500 });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Dein FSP Terminology Login-Code',
        text: `Dein Login-Code ist ${code}. Er ist 10 Minuten gültig. Wenn du diesen Login nicht angefordert hast, kannst du diese E-Mail ignorieren.`,
      }),
    });

    if (!response.ok) {
      console.error('Resend email failed', await response.text());
      return Response.json({ ok: false, error: 'Die Login-E-Mail konnte nicht gesendet werden.' }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Login code request failed', error);
    return Response.json({ ok: false, error: 'Anfrage konnte nicht verarbeitet werden.' }, { status: 500 });
  }
}
