/**
 * Contenu des sections Présentation, Parcours et Repères.
 * Expériences : données de l'ancien portfolio (dates exactes), plus l'activité indépendante.
 * Pas de détail des études (choix de Hakim) : une ligne dans les repères.
 */

/** Phrase géante après le hero (mots animés au scroll). */
export const intro =
  "Je suis Hakim, AI Engineer. J'entraîne des modèles de vision et de langage, et je les emmène jusqu'au produit : API, interface, déploiement."

export const introDetail =
  "Je cherche un poste d'AI Engineer, en CDI ou en mission : un endroit où le modèle n'est qu'une partie du travail, et où il faut aussi livrer l'API, l'interface et l'infrastructure."

export interface Experience {
  period: string
  company: string
  role: string
  detail: string
  stack: string[]
  /** Logo de l'entreprise (PNG, fond transparent) */
  logo?: string
  /** Visuel affiché au survol sur desktop */
  mockup?: string
}

export const experiences: Experience[] = [
  {
    period: '2025 — aujourd’hui',
    company: 'Indépendant',
    role: 'Ingénieur IA & développeur produit',
    detail:
      'FrenchWash (devis par IA et réservation), MKM Accessoires (e-commerce), AI Pathologist (détection de cancer en histopathologie).',
    stack: ['Next.js', 'FastAPI', 'Supabase', 'PyTorch', 'Hugging Face'],
    mockup: '/projects/frenchwash.jpg',
  },
  {
    period: 'Oct. 2024 — Janv. 2026',
    company: 'Formation Detailing · SP Formation',
    role: 'Développeur Full-Stack & IA',
    detail:
      "Plateformes SaaS : génération d'articles SEO, monitoring de présence dans les LLM, analyse e-réputation. Chatbot IA (Python / GPT), infrastructure AWS, automatisation de workflows.",
    stack: ['Python', 'Flask', 'React', 'Next.js', 'AWS', 'Docker'],
    logo: '/assets/experiences/fd_logo_sp_formation.png',
    mockup: '/assets/experiences/sp_formation_mockup_macbook.png',
  },
  {
    period: 'Oct. 2023 — Juil. 2024',
    company: 'ilo robot',
    role: 'Développeur Full-Stack & mobile',
    detail:
      'Startup robotique : application mobile de téléguidage en Flutter / Dart, déploiement autonome sur iOS et Android, intégration Stripe pour la boutique en ligne.',
    stack: ['Flutter', 'Dart', 'Stripe', 'React', 'Node.js', 'MongoDB'],
    logo: '/assets/experiences/logo_ilorobot.png',
    mockup: '/assets/experiences/ilorobot_mockup2phones.png',
  },
  {
    period: 'Oct. 2022 — Sept. 2023',
    company: 'Adame Tech',
    role: 'Développeur Frontend',
    detail:
      'Interfaces modernes et responsive : intégration de maquettes, optimisation des performances frontend, collaboration sur des API REST.',
    stack: ['React', 'JavaScript', 'HTML/CSS', 'Tailwind', 'Git'],
    mockup: '/assets/experiences/adame_tech_mockup.png',
  },
]

export const facts = [
  { label: 'Base', value: 'Île-de-France' },
  { label: 'Disponibilité', value: 'CDI ou freelance' },
  { label: 'Formation', value: 'Mastère Big Data & IA — IPSSI' },
  { label: 'Langues', value: 'Français, anglais' },
] as const
