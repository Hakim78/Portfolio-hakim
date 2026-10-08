import { NextResponse } from 'next/server'

/**
 * Reçoit les messages de N.O.V.A (POST JSON { goal, data, submittedAt }).
 * Envoi par Resend si RESEND_API_KEY et CONTACT_TO sont définis (voir .env.example),
 * sinon simple trace serveur — pratique en développement.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Body = { goal?: string; data?: Record<string, string | string[]> }

export async function POST(req: Request) {
  let body: Body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const data = body.data ?? {}
  const email = typeof data.email === 'string' ? data.email.trim() : ''
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }

  const lines = Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
  const subject = `[Portfolio] ${body.goal ?? 'contact'} — ${data.name ?? email}`
  const text = lines.join('\n')

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO
  const from = process.env.CONTACT_FROM ?? 'N.O.V.A <onboarding@resend.dev>'

  if (apiKey && to) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, reply_to: email, subject, text }),
    })
    if (!res.ok) {
      console.error('[contact] Resend a répondu', res.status, await res.text())
      return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  }

  console.info(`[contact] ${subject}\n${text}`)
  return NextResponse.json({ ok: true })
}
