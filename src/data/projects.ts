export type Category = 'ia-ml' | 'fullstack' | 'mobile' | 'data'

export type Status = 'production' | 'completed' | 'in-progress'

export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  slug: string
  title: string
  /** Une ligne, affichée sur la carte et dans l'index */
  tagline: string
  category: Category
  year: string
  role: string
  client?: string
  status: Status
  /** Paragraphe de contexte */
  description: string
  /** Ce qui a été construit */
  built: string[]
  /** Chiffres et résultats */
  results: string[]
  stack: string[]
  links: ProjectLink[]
  /** Visuel 1750×1000 (ratio 1.75) dans /public/projects */
  image?: string
  /** Présent dans la bande WebGL de la page d'accueil */
  featured?: boolean
}

export const categoryLabels: Record<Category, string> = {
  'ia-ml': 'IA & ML',
  fullstack: 'Produit web',
  mobile: 'Mobile',
  data: 'Data & infra',
}

export const statusLabels: Record<Status, string> = {
  production: 'En production',
  completed: 'Livré',
  'in-progress': 'En cours',
}

/**
 * Ordre = ordre d'affichage. Les 4 premiers sont les projets vedettes.
 * TODO (Hakim) : vérifier les années et compléter les projets issus de GitHub / Hugging Face.
 */
export const projects: Project[] = [
  {
    slug: 'ai-pathologist',
    title: 'AI Pathologist',
    tagline: 'Détection de tissus métastatiques en histopathologie',
    category: 'ia-ml',
    year: '2026',
    role: 'Ingénieur IA — modèle, API, interface',
    status: 'production',
    description:
      "Assistant de détection de cancer sur lames histopathologiques. Un ConvNeXt-Tiny entraîné sur PatchCamelyon classe chaque patch de tissu, avec test-time augmentation ×5 pour stabiliser la prédiction. Le modèle est publié sur Hugging Face et servi derrière une interface web qui explique la décision.",
    built: [
      'Entraînement ConvNeXt-Tiny sur 220 000 patches, split de test verrouillé',
      'Test-time augmentation ×5 et calibration des seuils',
      'Interface web : analyse en direct, méthodologie, explicabilité',
      'Démo publique et modèle versionné sur Hugging Face',
    ],
    results: ['AUC-ROC 0,9979 sur le split de test verrouillé', '220 K patches PatchCamelyon', 'Inférence ≈ 0,8 s'],
    stack: ['PyTorch 2.0', 'ConvNeXt', 'PatchCamelyon', 'Hugging Face', 'Next.js'],
    links: [
      { label: 'Voir la démo', href: 'https://frontend-cancer-pathologies.vercel.app/' },
      { label: 'Modèle Hugging Face', href: 'https://huggingface.co/hakim78/Cancer_pathos' },
    ],
    image: '/projects/cancer-pathologies.jpg',
    featured: true,
  },
  {
    slug: 'frenchwash',
    title: 'FrenchWash',
    tagline: 'Devis par IA et réservation de nettoyage vapeur à domicile',
    category: 'fullstack',
    year: '2026',
    role: 'Conception et développement — produit complet',
    client: 'FrenchWash, Oise',
    status: 'production',
    description:
      "Plateforme de réservation pour une entreprise de nettoyage vapeur (auto, moto, maison, pro). Un assistant génératif établit un devis personnalisé en deux minutes à partir d'une description et de photos, puis le client réserve un créneau et règle un acompte en ligne. Un back-office gère agenda, clients, prospection, documents légaux et indicateurs.",
    built: [
      'Assistant de devis en interface générative (transitions déterministes, estimation persistante)',
      'Tunnel de réservation avec acompte de 30 % et paiement sécurisé',
      'Back-office : agenda, CRM, prospection, KPI, devis et factures numérotés par trigger',
      'Règles métier en base (fuseaux, numérotation légale, cycle de vie client)',
    ],
    results: ['Devis personnalisé en ≈ 2 min', '4 univers de service', 'En production, clients réels'],
    stack: ['Next.js 14', 'FastAPI', 'PostgreSQL · Supabase', 'LLM', 'WhatsApp'],
    links: [{ label: 'Voir le site', href: 'https://frenchwash.app/' }],
    image: '/projects/frenchwash.jpg',
    featured: true,
  },
  {
    slug: 'mkm-accessoires',
    title: 'MKM Accessoires',
    tagline: 'Boutique de bijoux en acier inoxydable',
    category: 'fullstack',
    year: '2026',
    role: 'Conception et développement',
    client: 'MKM Accessoires',
    status: 'production',
    description:
      "Site e-commerce d'une marque de bijoux : cinq collections, nouveautés, fiches produits, panier et commande. Application monopage rapide, pensée pour le mobile, avec une direction artistique sobre qui laisse la place aux visuels de la marque.",
    built: [
      'Catalogue : colliers, bagues, bracelets, boucles d’oreilles, chaînes de main',
      'Fiches produits rendues côté client, panier et commande',
      'Pages de marque, FAQ, livraison et retours, mentions légales',
      'Sitemap et SEO technique',
    ],
    results: ['5 collections', 'Livraison offerte dès 50 €', 'En production'],
    stack: ['Vite', 'React', 'TypeScript'],
    links: [{ label: 'Voir le site', href: 'https://www.mkmaccessoires.com/' }],
    image: '/projects/mkm-accessoires.jpg',
    featured: true,
  },
  {
    slug: 'ilorobot',
    title: 'ilo robot',
    tagline: 'Application de pilotage et de programmation d’un robot éducatif',
    category: 'mobile',
    year: '2024',
    role: 'Développeur mobile',
    client: 'INTUITION Robotique & Technologies',
    status: 'production',
    description:
      "Application compagnon du robot éducatif ilo, utilisée en classe du primaire à l'université. Elle pilote le robot en Bluetooth ou Wi-Fi, fait programmer en blocs, affiche les capteurs en temps réel et donne accès à une bibliothèque de cours et d'examens.",
    built: [
      'Pilotage par modules simples et modes autonomes (labyrinthe, suivi de ligne, couleurs)',
      'Programmation par blocs',
      'Visualisation des capteurs en temps réel (distance, lumière, couleurs, LED)',
      'Bibliothèque de cours, examens, connexion Bluetooth / Wi-Fi / serveur',
    ],
    results: ['iOS, Android, macOS, web', 'Publiée sur l’App Store', 'Utilisée en établissement scolaire'],
    stack: ['Flutter', 'Dart', 'Bluetooth', 'Wi-Fi'],
    links: [{ label: 'App Store', href: 'https://apps.apple.com/fr/app/ilorobot/id6502907450' }],
    image: '/projects/ilorobot.jpg',
    featured: true,
  },

  /* ───────────── Index ───────────── */
  {
    slug: 'llm-presence-monitor',
    title: 'LLM Presence Monitor',
    tagline: 'Mesurer comment les LLM parlent d’une marque',
    category: 'ia-ml',
    year: '2024',
    role: 'Développeur Full-Stack & IA',
    client: 'SP Formation · facil-it.ai',
    status: 'production',
    description:
      "Outil qui interroge ChatGPT, Claude et Gemini sur une marque et mesure sa « présence IA » : score de visibilité, suivi dans le temps, recommandations.",
    built: ['Analyse multi-LLM simultanée', 'Score de visibilité et historique', 'Recommandations et export de rapports'],
    results: ['3 LLM interrogés en parallèle'],
    stack: ['Next.js', 'Python', 'OpenAI API', 'Claude API', 'Gemini API'],
    links: [{ label: 'Voir le site', href: 'https://ia-presence.facil-it.ai/' }],
  },
  {
    slug: 'seo-platform',
    title: 'Plateforme SEO',
    tagline: 'Génération d’articles optimisés à grande échelle',
    category: 'fullstack',
    year: '2024',
    role: 'Développeur Full-Stack & IA',
    client: 'SP Formation · facil-it.ai',
    status: 'production',
    description:
      "SaaS de génération de contenu SEO : clustering de mots-clés, rédaction et réécriture par plusieurs API d'IA, file d'attente asynchrone pour les gros volumes, tableau de bord.",
    built: ['Clustering de mots-clés', 'Rédaction et réécriture multi-API', 'File d’attente asynchrone (Celery, Redis)', 'Dashboard analytics'],
    results: ['+500 articles / mois', '< 30 s par article'],
    stack: ['Python', 'Flask', 'PHP', 'MySQL', 'Redis', 'Celery', 'GPT-4', 'Claude'],
    links: [{ label: 'Voir le site', href: 'https://seo.facil-it.ai/' }],
  },
  {
    slug: 'e-reputation',
    title: 'E-Réputation',
    tagline: 'Collecte multi-sources et analyse de sentiment',
    category: 'fullstack',
    year: '2024',
    role: 'Développeur Full-Stack & IA',
    client: 'SP Formation · facil-it.ai',
    status: 'production',
    description:
      "Tableau de bord de réputation en ligne : collecte automatisée, analyse de sentiment, visualisations et alertes.",
    built: ['Scraping multi-sources', 'Analyse de sentiment', 'Dashboards et alertes'],
    results: [],
    stack: ['Next.js', 'Python', 'Flask', 'NLP', 'Recharts'],
    links: [{ label: 'Voir le site', href: 'https://e-reputation.facil-it.ai/' }],
  },
  {
    slug: 'trm-arn',
    title: 'TRM · ARN',
    tagline: 'Structure d’ARN et liaison de molécules, architecture multi-modèles',
    category: 'ia-ml',
    year: '2025',
    role: 'Recherche et implémentation',
    status: 'completed',
    description:
      "Architecture multi-modèles pour prédire la structure d'ARN et analyser la liaison de molécules thérapeutiques. Modèles publiés sur Hugging Face.",
    built: ['Modules spécialisés orchestrés', 'Entraînement et évaluation', 'Publication des poids'],
    results: [],
    stack: ['Python', 'PyTorch'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hakim78/TRM_ARN' },
      { label: 'Hugging Face', href: 'https://huggingface.co/hakim78/trm_arn' },
    ],
  },
  {
    slug: 'ham10000-dermato',
    title: 'Dermato AI',
    tagline: 'Classification de lésions cutanées, HAM10000',
    category: 'ia-ml',
    year: '2026',
    role: 'Ingénieur IA',
    status: 'completed',
    description: 'Classifieur de lésions cutanées entraîné sur le jeu de données HAM10000, publié sur Hugging Face.',
    built: ['Pipeline d’entraînement et d’évaluation', 'Publication du modèle'],
    results: [],
    stack: ['PyTorch', 'Hugging Face'],
    links: [{ label: 'Hugging Face', href: 'https://huggingface.co/hakim78/ham10000-dermato-ai' }],
  },
  {
    slug: 'tiny-sat-anomaly',
    title: 'Tiny Sat Anomaly',
    tagline: 'Détection d’anomalies sur télémétrie de petits satellites',
    category: 'ia-ml',
    year: '2026',
    role: 'Ingénieur IA',
    status: 'completed',
    description: 'Détection d’anomalies sur des séries temporelles de télémétrie satellite, modèle léger publié sur Hugging Face et démo web.',
    built: ['Modèle de détection d’anomalies', 'Interface de démonstration'],
    results: [],
    stack: ['PyTorch', 'TypeScript'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hakim78/Tiny-Sat-Anomaly' },
      { label: 'Hugging Face', href: 'https://huggingface.co/hakim78/Tiny-Sat-Anomaly-Detection' },
    ],
  },
  {
    slug: 'gan-celeba',
    title: 'GAN CelebA',
    tagline: 'Génération de visages : DCGAN, self-attention, diffusion',
    category: 'ia-ml',
    year: '2025',
    role: 'Recherche et implémentation',
    status: 'completed',
    description:
      'Comparaison de Vanilla GAN, DCGAN, Self-Attention GAN et DDPM sur CelebA pour la synthèse de visages.',
    built: ['Quatre architectures génératives', 'Entraînement sur 200 000 images', 'Démo Hugging Face'],
    results: ['FID 45,2 (SAGAN)', '64×64 → 128×128'],
    stack: ['PyTorch', 'GAN', 'DDPM'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hakim78/GAN_Project' },
      { label: 'Démo', href: 'https://huggingface.co/hakim78' },
    ],
  },
  {
    slug: 'transformer-qa',
    title: 'Transformer Q&A',
    tagline: 'Encoder-decoder from scratch sur SQuAD 2.0',
    category: 'ia-ml',
    year: '2025',
    role: 'Recherche et implémentation',
    status: 'completed',
    description:
      'Transformer encoder-decoder écrit from scratch pour le question-answering, avec beam search, label smoothing et un système RAG sur FAISS.',
    built: ['6 couches, 8 têtes, 256 dimensions', 'Beam search avec pénalité de longueur', 'RAG avec FAISS'],
    results: ['≈ 26,7 M paramètres'],
    stack: ['TensorFlow', 'Transformer', 'FAISS', 'Gradio'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hakim78/LLM' },
      { label: 'Hugging Face', href: 'https://huggingface.co/hakim78/transformer-qa-squad-v4b' },
    ],
  },
  {
    slug: 'asl-sign-recognition',
    title: 'ASL Sign Recognition',
    tagline: 'Alphabet de la langue des signes en temps réel',
    category: 'ia-ml',
    year: '2026',
    role: 'Ingénieur IA',
    status: 'completed',
    description:
      'Reconnaissance en temps réel de l’alphabet ASL par webcam : landmarks de la main, stabilisation temporelle, construction de mots et de phrases.',
    built: ['21 landmarks MediaPipe', 'Stabilisation temporelle et auto-correction', 'Démo Hugging Face'],
    results: ['≈ 94 % de précision', '30 images / s'],
    stack: ['TensorFlow', 'MediaPipe', 'OpenCV'],
    links: [{ label: 'GitHub', href: 'https://github.com/Hakim78/AI-SignLanguage' }],
  },
  {
    slug: 'drone-navigation',
    title: 'Navigation drone sans GPS',
    tagline: 'Odométrie visuelle, profondeur et IMU, modules Transformer légers',
    category: 'ia-ml',
    year: '2025',
    role: 'Recherche',
    status: 'in-progress',
    description:
      'Système de navigation autonome pour drone en environnement sans GPS : modules Transformer spécialisés (odométrie visuelle, profondeur, IMU) fusionnés par un orchestrateur, pensés pour l’embarqué.',
    built: ['TRM-VO ≈ 1,5 M paramètres', 'TRM-Depth ≈ 800 K', 'TRM-IMU ≈ 300 K', 'Orchestrateur de fusion'],
    results: ['≈ 2,8 M paramètres au total', 'Cible : dérive < 2 % sur 50 m'],
    stack: ['PyTorch', 'Gazebo'],
    links: [],
  },
  {
    slug: 'bird-ai',
    title: 'Bird AI',
    tagline: 'Reconnaître un oiseau à son chant',
    category: 'ia-ml',
    year: '2025',
    role: 'Ingénieur IA & Full-Stack',
    status: 'completed',
    description:
      'Identification d’espèces à partir de spectrogrammes audio avec un CNN construit from scratch, servi par une API et une interface web.',
    built: ['CNN from scratch sur spectrogrammes', 'API Flask et front Vue.js', 'Module e-learning'],
    results: ['≈ 85 % sur 50 espèces', '< 2 s d’inférence'],
    stack: ['TensorFlow', 'Librosa', 'Flask', 'Vue.js'],
    links: [{ label: 'GitHub', href: 'https://github.com/Hakim78/bird_AI' }],
  },
  {
    slug: 'kbo-pipeline',
    title: 'Pipeline KBO',
    tagline: 'Scraping, orchestration et visualisation d’entreprises belges',
    category: 'data',
    year: '2025',
    role: 'Data engineer',
    status: 'completed',
    description: 'Pipeline distribué de collecte et de traitement de données d’entreprises belges : DAG Airflow, workers Celery, Spark.',
    built: ['Orchestration Airflow', 'Workers Celery', 'Traitement Spark et stockage HDFS'],
    results: [],
    stack: ['Airflow', 'Celery', 'Spark', 'HDFS'],
    links: [{ label: 'GitHub', href: 'https://github.com/Hakim78/TP_Airflow_Group_Project_KBO' }],
  },
  {
    slug: 'kafka-weather',
    title: 'Météo temps réel',
    tagline: 'Architecture Lambda sur flux Kafka',
    category: 'data',
    year: '2025',
    role: 'Data engineer',
    status: 'completed',
    description: 'Traitement en temps réel de données météorologiques avec une architecture Lambda : couche batch et couche vitesse sur Kafka.',
    built: ['Ingestion Kafka', 'Couche batch et couche temps réel'],
    results: [],
    stack: ['Kafka', 'Python'],
    links: [{ label: 'GitHub', href: 'https://github.com/Hakim78/TP_KAFKA' }],
  },
  {
    slug: 'air-quality-pipeline',
    title: 'Qualité de l’air',
    tagline: 'Pipeline Airflow de données de pollution',
    category: 'data',
    year: '2026',
    role: 'Data engineer',
    status: 'completed',
    description: 'Pipeline Big Data orchestré par Airflow pour collecter, traiter et exposer des données de qualité de l’air.',
    built: ['DAG Airflow', 'Transformation et stockage'],
    results: [],
    stack: ['Airflow', 'Python'],
    links: [{ label: 'GitHub', href: 'https://github.com/Hakim78/quality_air_data' }],
  },
  {
    slug: 'infra-cloud',
    title: 'Infrastructure cloud',
    tagline: 'Serveurs, conteneurs et CI/CD pour des SaaS en production',
    category: 'data',
    year: '2024',
    role: 'DevOps',
    client: 'SP Formation · facil-it.ai',
    status: 'production',
    description: 'Mise en place et exploitation de l’infrastructure des plateformes facil-it.ai : VPS, Docker, Nginx, bases MySQL et RDS, workers, CI/CD.',
    built: ['Déploiement Docker', 'Nginx et Gunicorn', 'MySQL / RDS, NAS', 'CI/CD'],
    results: [],
    stack: ['AWS', 'Docker', 'Nginx', 'MySQL'],
    links: [],
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)

export const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'ia-ml', label: 'IA & ML' },
  { id: 'fullstack', label: 'Produit web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'data', label: 'Data & infra' },
]
