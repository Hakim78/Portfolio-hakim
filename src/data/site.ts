/**
 * Identité et liens du site. Un seul endroit à modifier.
 * TODO (Hakim) : vérifier l'URL du site, l'email de contact et le lien LinkedIn.
 */
export const site = {
  name: 'Hakim Djaalal',
  firstName: 'Hakim',
  role: 'AI Engineer',
  url: 'https://hakim.dev',
  email: 'contact@hakim.dev',
  description:
    "Ingénieur IA. J'entraîne des modèles de vision et de langage et je les emmène jusqu'au produit : API, interface, déploiement.",
  location: 'Île-de-France',
  availability: 'CDI ou freelance',
  links: {
    github: 'https://github.com/Hakim78',
    huggingface: 'https://huggingface.co/hakim78',
    linkedin: 'https://www.linkedin.com/in/hakim',
  },
} as const

export const nav = [
  { href: '/projects', label: 'Index' },
  { href: '/#profil', label: 'Profil' },
  { href: '/#contact', label: 'Contact' },
] as const
