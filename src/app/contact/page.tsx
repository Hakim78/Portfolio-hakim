'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'

export default function ContactPage() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.animate-in',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      )
    }, contentRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormState({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div ref={contentRef} className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <header className="animate-in mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-mono text-primary">CONTACT</span>
            <div className="h-px flex-1 bg-dark-300" />
          </div>

          <h1 className="text-display-lg font-display font-bold mb-6">
            Travaillons
            <br />
            <span className="text-dark-500">Ensemble</span>
          </h1>

          <p className="text-xl text-dark-600 leading-relaxed max-w-2xl">
            Vous avez un projet en tête ou une opportunité d&apos;alternance ?
            N&apos;hésitez pas à me contacter. Je suis toujours ouvert à de nouvelles
            collaborations.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="animate-in">
            {isSubmitted ? (
              <div className="p-8 border border-green-500/30 rounded-lg bg-green-500/5 text-center">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-xl font-display font-semibold mb-2">
                  Message envoyé !
                </h3>
                <p className="text-dark-600">
                  Merci pour votre message. Je vous répondrai dans les plus brefs
                  délais.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-sm text-primary hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-mono text-dark-500 mb-2"
                  >
                    NOM
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-100 border border-dark-300 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-mono text-dark-500 mb-2"
                  >
                    EMAIL
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-100 border border-dark-300 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-mono text-dark-500 mb-2"
                  >
                    SUJET
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-100 border border-dark-300 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="alternance">Opportunité d&apos;alternance</option>
                    <option value="projet">Projet / Collaboration</option>
                    <option value="question">Question technique</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-mono text-dark-500 mb-2"
                  >
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-dark-100 border border-dark-300 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Votre message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer le message
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="animate-in space-y-8">
            <div>
              <h3 className="text-sm font-mono text-dark-500 mb-4">
                LIENS DIRECTS
              </h3>
              <div className="space-y-4">
                <a
                  href="mailto:contact@hakim.dev"
                  className="flex items-center gap-4 p-4 border border-dark-300 rounded-lg hover:border-primary/30 transition-colors group"
                >
                  <div className="w-12 h-12 flex items-center justify-center border border-dark-300 rounded-lg group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                    <svg
                      className="w-5 h-5 text-dark-600 group-hover:text-primary transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-dark-500">Email</div>
                    <div className="font-medium group-hover:text-primary transition-colors">
                      contact@hakim.dev
                    </div>
                  </div>
                </a>

                <a
                  href="https://linkedin.com/in/hakim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border border-dark-300 rounded-lg hover:border-primary/30 transition-colors group"
                >
                  <div className="w-12 h-12 flex items-center justify-center border border-dark-300 rounded-lg group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                    <svg
                      className="w-5 h-5 text-dark-600 group-hover:text-primary transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-dark-500">LinkedIn</div>
                    <div className="font-medium group-hover:text-primary transition-colors">
                      linkedin.com/in/hakim
                    </div>
                  </div>
                </a>

                <a
                  href="https://github.com/Hakim78"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border border-dark-300 rounded-lg hover:border-primary/30 transition-colors group"
                >
                  <div className="w-12 h-12 flex items-center justify-center border border-dark-300 rounded-lg group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                    <svg
                      className="w-5 h-5 text-dark-600 group-hover:text-primary transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-dark-500">GitHub</div>
                    <div className="font-medium group-hover:text-primary transition-colors">
                      github.com/Hakim78
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-mono text-dark-500 mb-4">
                LOCALISATION
              </h3>
              <div className="p-4 border border-dark-300 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-primary mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <div className="font-medium">Île-de-France, France</div>
                    <div className="text-sm text-dark-600 mt-1">
                      Disponible pour des opportunités remote, hybride ou sur site
                      en région parisienne.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-mono text-dark-500 mb-4">
                DISPONIBILITÉ
              </h3>
              <div className="p-4 border border-green-500/30 rounded-lg bg-green-500/5">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <div>
                    <div className="font-medium text-green-400">
                      Actuellement disponible
                    </div>
                    <div className="text-sm text-dark-600">
                      Pour alternance à partir de maintenant
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
