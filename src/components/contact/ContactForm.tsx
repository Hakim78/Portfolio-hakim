'use client'

import { useState, type FormEvent } from 'react'
import { site } from '@/data/site'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/** Formulaire classique (hérité de l'ancien site), envoyé par l'API comme N.O.V.A. */
export function ContactForm({ id }: { id?: string }) {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const data = {
      name: String(fd.get('name') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      message: String(fd.get('message') ?? '').trim(),
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: 'formulaire', data, submittedAt: new Date().toISOString() }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form id={id} onSubmit={onSubmit} className="enter mt-10 grid gap-6 md:grid-cols-2">
      <label className="grid gap-2">
        <span className="label text-fg/50">Nom</span>
        <input name="name" required autoComplete="name" className="field" />
      </label>
      <label className="grid gap-2">
        <span className="label text-fg/50">Email</span>
        <input name="email" type="email" required autoComplete="email" className="field" />
      </label>
      <label className="grid gap-2 md:col-span-2">
        <span className="label text-fg/50">Message</span>
        <textarea name="message" required rows={5} className="field resize-y" />
      </label>
      <div className="flex flex-wrap items-center gap-5 md:col-span-2">
        <button type="submit" disabled={status === 'sending'} className="btn-pill disabled:opacity-60">
          {status === 'sending' ? 'Envoi…' : 'Envoyer'}
        </button>
        <p role="status" aria-live="polite" className="text-sm text-fg/60">
          {status === 'sent' && 'Message envoyé. Je vous réponds rapidement.'}
          {status === 'error' && (
            <>
              Échec de l’envoi. Écrivez-moi directement :{' '}
              <a className="link-line text-fg" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </>
          )}
        </p>
      </div>
    </form>
  )
}
