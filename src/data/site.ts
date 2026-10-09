/**
 * Identité et liens du site. Un seul endroit à modifier.
 * Données reprises de l'ancien portfolio (portfolio-hakim-one.vercel.app).
 */
export const site = {
  name: 'Hakim Djaalal',
  firstName: 'Hakim',
  role: 'AI Engineer',
  url: 'https://portfolio-hakim-one.vercel.app',
  email: 'hakim.djaalal@outlook.fr',
  description:
    "Ingénieur IA. J'entraîne des modèles de vision et de langage et je les emmène jusqu'au produit : API, interface, déploiement.",
  location: 'Île-de-France',
  availability: 'CDI ou freelance',
  links: {
    github: 'https://github.com/Hakim78',
    huggingface: 'https://huggingface.co/hakim78',
    linkedin: 'https://www.linkedin.com/in/hakim-djaalal78000/',
  },
  analytics: {
    /** Google Analytics 4 */
    ga: 'G-3X2SQWK8Z8',
    /** Microsoft Clarity */
    clarity: 'w3jfqmoktv',
    /** Balise de vérification Search Console */
    googleVerification: 'SCGB6n9jhKBj2-t4btYZZvPhUrUjB9pUcKg0Rg3jwy0',
  },
} as const

export const nav = [
  { href: '/#projets', label: 'Projets' },
  { href: '/#parcours', label: 'Parcours' },
  { href: '/#competences', label: 'Compétences' },
  { href: '/#contact', label: 'Contact' },
] as const
