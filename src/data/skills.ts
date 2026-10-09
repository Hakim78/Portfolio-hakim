/**
 * Compétences : les 5 catégories de l'ancien portfolio, présentées en
 * accordéon épinglé. Les technos sont résolues en logos par data/tech.ts.
 */
export interface SkillCategory {
  n: string
  title: string
  subtitle: string
  description: string
  /** Icône 3D de la catégorie (reprise de l'ancien site) */
  visual: string
  techs: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    n: '01',
    title: 'Full-Stack',
    subtitle: 'Frontend & backend',
    description:
      'Du frontend React / Next.js au backend Python ou Node, en passant par PHP et les API REST / GraphQL. Des produits complets, du devis au back-office.',
    visual: '/assets/skills/fullstack.png',
    techs: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 'Flask', 'PHP', 'Tailwind', 'PostgreSQL', 'Supabase'],
  },
  {
    n: '02',
    title: 'IA & Deep Learning',
    subtitle: 'Vision, NLP, LLM',
    description:
      'Conception et entraînement de modèles : classification, détection, NLP, séries temporelles. Assistants génératifs et RAG. Déploiement sur Hugging Face et intégration en production.',
    visual: '/assets/skills/ai.png',
    techs: ['Python', 'PyTorch', 'TensorFlow', 'Keras', 'Hugging Face', 'OpenCV', 'MediaPipe', 'scikit-learn', 'Claude', 'Gemini'],
  },
  {
    n: '03',
    title: 'Data Engineering',
    subtitle: 'Pipelines & Big Data',
    description:
      'Pipelines ETL avec Airflow et Kafka, scraping à grande échelle, traitement massif avec Spark, orchestration de workflows et bases de données SQL / NoSQL.',
    visual: '/assets/skills/data.png',
    techs: ['Airflow', 'Kafka', 'Spark', 'Pandas', 'Selenium', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'MongoDB'],
  },
  {
    n: '04',
    title: 'Mobile',
    subtitle: 'iOS & Android',
    description:
      'Applications cross-platform en Flutter : développement, tests, publication sur l’App Store et Google Play. Bluetooth, paiement, temps réel.',
    visual: '/assets/skills/mobile.png',
    techs: ['Flutter', 'Dart', 'Firebase', 'Stripe', 'Bluetooth', 'App Store', 'Google Play'],
  },
  {
    n: '05',
    title: 'DevOps & Cloud',
    subtitle: 'Infrastructure & déploiement',
    description:
      'Infrastructures AWS, conteneurisation Docker, Nginx, déploiement de modèles sur Hugging Face Spaces, CI/CD et monitoring.',
    visual: '/assets/skills/devops.png',
    techs: ['Docker', 'AWS', 'Nginx', 'CI/CD', 'Hugging Face', 'Vercel', 'Git'],
  },
]
