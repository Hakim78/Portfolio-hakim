/**
 * Contenu de la section Profil. Pas de détail des études (choix de Hakim) :
 * une ligne de formation dans les faits, et uniquement les expériences.
 */

export const statement =
  "J'entraîne des modèles de vision et de langage, et je les emmène jusqu'au produit : API, interface, déploiement."

export const domains = [
  {
    title: 'Vision médicale',
    detail: 'Histopathologie, dermatologie. ConvNeXt, apprentissage multi-instances, test-time augmentation.',
  },
  {
    title: 'LLM & agents',
    detail: 'RAG, assistants génératifs, orchestration multi-modèles (OpenAI, Claude, Gemini).',
  },
  {
    title: 'Produit',
    detail: 'Next.js, FastAPI, Flutter, Supabase. Du devis par IA au back-office.',
  },
  {
    title: 'Data & infra',
    detail: 'Airflow, Spark, Kafka, Docker, AWS. Pipelines, déploiement, monitoring.',
  },
] as const

export const experiences = [
  {
    period: '2025 — aujourd’hui',
    company: 'Indépendant',
    role: 'Ingénieur IA & développeur produit',
    detail: 'FrenchWash, MKM Accessoires, AI Pathologist.',
  },
  {
    period: '2024',
    company: 'SP Formation · facil-it.ai',
    role: 'Développeur Full-Stack & IA',
    detail: 'Plateformes SaaS : génération SEO, e-réputation, monitoring de présence dans les LLM.',
  },
  {
    period: '2023 — 2024',
    company: 'INTUITION Robotique & Technologies · ilo robot',
    role: 'Développeur Full-Stack & mobile',
    detail: 'Application ilo robot (Flutter), site e-commerce.',
  },
] as const

export const facts = [
  { label: 'Base', value: 'Île-de-France' },
  { label: 'Disponibilité', value: 'CDI ou freelance' },
  { label: 'Formation', value: 'Mastère Big Data & IA — IPSSI' },
  { label: 'Langues', value: 'Français, anglais' },
] as const
