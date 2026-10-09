'use client'

import { useState } from 'react'
import NovaAssistant from '@/components/nova/NovaAssistant'
import { ContactForm } from './ContactForm'

/** Contact : l'assistant N.O.V.A d'abord, un formulaire classique en repli. */
export function Contact() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <NovaAssistant id="contact" theme="dark" accent="#10b981" endpoint="/api/contact" />
      <div className="gutter border-t border-line py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <p className="text-sm text-fg/60 md:text-base">Vous préférez un formulaire classique ?</p>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="formulaire"
            className="btn-pill"
          >
            {open ? 'Masquer le formulaire' : 'Ouvrir le formulaire'}
          </button>
        </div>
        {open && <ContactForm id="formulaire" />}
      </div>
    </>
  )
}
