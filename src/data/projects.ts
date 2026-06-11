export interface Project {
  slug: string
  title: string
  shortTitle?: string
  category: 'fullstack' | 'ia-ml' | 'data-engineering' | 'devops' | 'mobile'
  status: 'production' | 'completed' | 'in-progress'
  description: string
  longDescription?: string
  stack: string[]
  features: string[]
  metrics: string[]
  urlLive?: string
  github?: string
  huggingface?: string
  image?: string
  featured?: boolean
  level: number
  innovation?: string
  year: string
}

export const projects: Project[] = [
  {
    slug: 'llm-presence-monitor',
    title: 'Outil de Monitoring de Visibilité sur les LLMs',
    shortTitle: 'LLM Presence Monitor',
    category: 'ia-ml',
    status: 'production',
    description: 'Outil innovant qui analyse comment les marques sont mentionnées par les LLMs (ChatGPT, Claude, Gemini). Permet de mesurer et optimiser sa "présence IA".',
    longDescription: `Outil innovant qui analyse comment les marques sont mentionnées par les LLMs (ChatGPT, Claude, Gemini). Permet de mesurer et optimiser sa "présence IA".

Ce projet répond à un besoin émergent : alors que les LLMs deviennent une source majeure d'information, les entreprises doivent comprendre comment elles sont perçues et recommandées par ces systèmes.`,
    stack: ['React', 'Next.js', 'Framer Motion', 'Python', 'OpenAI API', 'Claude API', 'Gemini API'],
    features: [
      'Analyse multi-LLM simultanée',
      'Score de visibilité et tracking temporel',
      'Recommandations d\'amélioration automatiques',
      'Export de rapports détaillés',
    ],
    metrics: [
      '3 LLMs analysés simultanément',
      'Précision analyse: 92%',
    ],
    urlLive: 'https://ia-presence.facil-it.ai/',
    featured: true,
    level: 5,
    innovation: 'Concept unique sur le marché',
    year: '2024',
  },
  {
    slug: 'bird-ai-classification',
    title: 'Bird AI - Classification d\'Oiseaux par Chant',
    shortTitle: 'Bird AI',
    category: 'ia-ml',
    status: 'completed',
    description: 'Application de reconnaissance d\'oiseaux à partir de leur chant audio. CNN from scratch avec analyse spectrogrammes.',
    longDescription: `Application de reconnaissance d\'oiseaux à partir de leur chant audio utilisant un réseau de neurones convolutif construit from scratch.

Le système analyse les spectrogrammes audio pour identifier l'espèce d'oiseau, avec une interface utilisateur intuitive et un module e-learning intégré.`,
    stack: ['Python', 'TensorFlow', 'Keras', 'CNN', 'Librosa', 'Flask', 'Vue.js'],
    features: [
      'Upload audio → Identification espèce',
      'Visualisation spectrogramme en temps réel',
      'Fiche descriptive détaillée de l\'oiseau',
      'Module e-learning interactif',
    ],
    metrics: [
      'Dataset: +10,000 échantillons audio',
      'Accuracy: ~85% sur 50 espèces',
      'Temps d\'inférence: <2s',
    ],
    github: 'https://github.com/Hakim78/bird_AI',
    featured: true,
    level: 5,
    year: '2024',
  },
  {
    slug: 'gan-celeba-faces',
    title: 'GAN avec Attention - Génération de Visages',
    shortTitle: 'GAN CelebA',
    category: 'ia-ml',
    status: 'completed',
    description: 'Projet de génération d\'images de visages utilisant des architectures GAN avancées avec mécanismes d\'attention et modèle de diffusion DDPM.',
    longDescription: `Exploration approfondie des architectures génératives modernes pour la synthèse de visages réalistes.

Comparaison de plusieurs approches : Vanilla GAN, DCGAN, Self-Attention GAN et DDPM (Denoising Diffusion Probabilistic Models) sur le dataset CelebA.`,
    stack: ['Python', 'PyTorch', 'GAN', 'Self-Attention', 'DDPM'],
    features: [
      'Implémentation Vanilla GAN baseline',
      'DCGAN avec convolutions',
      'Self-Attention GAN pour cohérence globale',
      'DDPM pour génération haute qualité',
    ],
    metrics: [
      'Dataset: CelebA 200,000+ images',
      'FID Score: 45.2 (SAGAN)',
      'Résolution: 64x64 → 128x128',
    ],
    github: 'https://github.com/Hakim78/GAN_Project',
    featured: true,
    level: 5,
    year: '2024',
  },
  {
    slug: 'drone-ai-navigation',
    title: 'Navigation Autonome Drone GPS-Denied',
    shortTitle: 'Drone AI',
    category: 'ia-ml',
    status: 'in-progress',
    description: 'Système de navigation autonome pour drones en environnement sans GPS, utilisant une architecture Multi-TRM modulaire.',
    longDescription: `Système de navigation autonome pour drones conçu pour fonctionner dans des environnements où le GPS n'est pas disponible (intérieur, tunnels, zones urbaines denses).

L'architecture Multi-TRM combine plusieurs modules Transformer spécialisés : Visual Odometry, Depth Estimation, et IMU Integration, orchestrés par un module de fusion.`,
    stack: ['Python', 'PyTorch', 'Gazebo', 'Visual Odometry', 'Depth Estimation', 'IMU Fusion'],
    features: [
      'TRM-VO (~1.5M params): Visual Odometry',
      'TRM-DEPTH (~800K params): Depth Estimation',
      'TRM-IMU (~300K params): IMU Integration',
      'Orchestrator (~200K params): Fusion module',
    ],
    metrics: [
      'Total: ~2.8M paramètres',
      'Target Drift: <2% sur 50m',
      'Target Latence: <100ms',
    ],
    featured: true,
    level: 5,
    innovation: 'Architecture modulaire légère pour edge deployment',
    year: '2024-2025',
  },
  {
    slug: 'seo-platform-saas',
    title: 'Plateforme SaaS de Génération d\'Articles SEO',
    shortTitle: 'SEO Platform',
    category: 'fullstack',
    status: 'production',
    description: 'Plateforme complète de génération d\'articles SEO optimisés avec intégration multi-API IA.',
    longDescription: `Plateforme SaaS de génération de contenu SEO automatisé, intégrant plusieurs APIs d'intelligence artificielle pour produire des articles optimisés pour les moteurs de recherche.

Architecture robuste avec gestion de files d'attente asynchrones pour le traitement de gros volumes.`,
    stack: ['Python', 'Flask', 'PHP', 'MySQL', 'Redis', 'Celery', 'OpenAI GPT-4', 'Claude API', 'Perplexity API', 'Ideogram'],
    features: [
      'Génération d\'articles optimisés SEO',
      'Clustering de mots-clés intelligent',
      'Réécriture et amélioration automatique',
      'File d\'attente de tâches asynchrone',
      'Dashboard analytics complet',
    ],
    metrics: [
      '+500 articles générés/mois',
      'Temps de génération: <30s/article',
      'Score SEO moyen: 85+',
    ],
    urlLive: 'https://seo.facil-it.ai/',
    featured: false,
    level: 5,
    year: '2024',
  },
  {
    slug: 'transformer-qa-squad',
    title: 'Transformer Seq2Seq pour Question-Answering',
    shortTitle: 'Transformer Q&A',
    category: 'ia-ml',
    status: 'completed',
    description: 'Implémentation from scratch d\'un Transformer Encoder-Decoder pour la tâche de Question-Answering sur SQuAD 2.0.',
    longDescription: `Implémentation complète d'un Transformer Encoder-Decoder pour le Question-Answering, construit entièrement from scratch sans utiliser de modèles pré-entraînés.

Ce projet académique démontre une compréhension profonde de l'architecture Transformer et de ses composants : attention multi-têtes, positional encoding, etc.`,
    stack: ['Python', 'TensorFlow 2.x', 'Transformer', 'HuggingFace Hub', 'Gradio', 'FAISS'],
    features: [
      'Encoder-Decoder avec Cross-Attention',
      '6 layers, 8 heads, 256 dim',
      'Beam Search avec length penalty',
      'RAG System avec FAISS',
      'Label Smoothing & Data Augmentation',
    ],
    metrics: [
      '~26.7M paramètres',
      'F1 Score: 28.81%',
      'Train Accuracy: 30.47%',
    ],
    github: 'https://github.com/Hakim78/transformer-qa-squad',
    huggingface: 'https://huggingface.co/hakim78/transformer-qa-squad-v4b',
    featured: false,
    level: 4,
    year: '2024',
  },
  {
    slug: 'ai-sign-recognition',
    title: 'Reconnaissance Langue des Signes ASL',
    shortTitle: 'Sign Recognition',
    category: 'ia-ml',
    status: 'completed',
    description: 'Reconnaissance en temps réel de l\'alphabet ASL avec transformation lettres → mots → phrases.',
    longDescription: `Système de reconnaissance de la langue des signes américaine (ASL) fonctionnant en temps réel via webcam.

Deux approches implémentées : CNN sur images MNIST et MediaPipe + MLP pour une meilleure robustesse.`,
    stack: ['Python', 'TensorFlow', 'CNN', 'MediaPipe Hands', 'Scikit-learn', 'OpenCV'],
    features: [
      'Détection 21 landmarks de la main',
      'Stabilisation temporelle des prédictions',
      'Auto-correction orthographique',
      'Construction de phrases en temps réel',
    ],
    metrics: [
      'Accuracy: ~94% (voie MediaPipe)',
      'Temps réel: 30 FPS',
    ],
    github: 'https://github.com/MouadAgn/AI-SignRecognition',
    featured: false,
    level: 4,
    year: '2024',
  },
  {
    slug: 'crypto-trading-bot',
    title: 'Bot de Trading Crypto avec IA',
    shortTitle: 'Crypto Trading Bot',
    category: 'ia-ml',
    status: 'completed',
    description: 'Bot de trading algorithmique combinant plusieurs architectures de deep learning pour la prédiction de prix de cryptomonnaies.',
    longDescription: `Bot de trading algorithmique sophistiqué combinant Graph Neural Networks (pour les corrélations inter-crypto), LSTM (pour les séries temporelles) et Reinforcement Learning (pour la stratégie de trading).`,
    stack: ['Python', 'PyTorch', 'GNN', 'LSTM', 'Reinforcement Learning', 'Pandas', 'NumPy'],
    features: [
      'GNN pour corrélations inter-crypto',
      'LSTM pour séries temporelles',
      'RL (DQN) pour stratégie de trading',
      'Backtesting complet',
      'Gestion du risque intégrée',
    ],
    metrics: [
      'Analyse multi-crypto simultanée',
      'Backtesting sur données historiques',
    ],
    featured: false,
    level: 4,
    year: '2024',
  },
  {
    slug: 'e-reputation-platform',
    title: 'Plateforme d\'Analyse E-Réputation',
    shortTitle: 'E-Réputation',
    category: 'fullstack',
    status: 'production',
    description: 'Tableau de bord d\'analyse de réputation en ligne avec collecte multi-sources et visualisations.',
    longDescription: `Plateforme complète d'analyse de réputation en ligne permettant de surveiller et analyser la présence digitale d'une marque ou entreprise.`,
    stack: ['React', 'Next.js', 'Python', 'Flask', 'Web Scraping', 'NLP', 'Chart.js', 'Recharts'],
    features: [
      'Collecte automatisée multi-sources',
      'Analyse de sentiment NLP',
      'Dashboards interactifs',
      'Alertes en temps réel',
    ],
    metrics: [],
    urlLive: 'https://e-reputation.facil-it.ai/',
    featured: false,
    level: 4,
    year: '2024',
  },
  {
    slug: 'bigdata-pipeline-belgium',
    title: 'Pipeline Big Data - Scraping Entreprises',
    shortTitle: 'Big Data Pipeline',
    category: 'data-engineering',
    status: 'completed',
    description: 'Pipeline de collecte et traitement de données d\'entreprises belges à grande échelle.',
    longDescription: `Pipeline de données à grande échelle pour la collecte et le traitement d'informations sur les entreprises belges, utilisant une architecture distribuée moderne.`,
    stack: ['Python', 'Apache Airflow', 'Celery', 'Apache Spark', 'Web Scraping'],
    features: [
      'Orchestration DAGs Airflow',
      'Workers distribués Celery',
      'Traitement Spark à grande échelle',
      'Stockage structuré optimisé',
    ],
    metrics: [],
    featured: false,
    level: 4,
    year: '2024',
  },
  {
    slug: 'devops-infrastructure',
    title: 'Infrastructure Cloud & DevOps',
    shortTitle: 'DevOps',
    category: 'devops',
    status: 'production',
    description: 'Mise en place et gestion d\'infrastructures cloud pour les applications de l\'entreprise.',
    longDescription: `Configuration et gestion d'infrastructures cloud production-ready, incluant serveurs, bases de données, et pipelines CI/CD.`,
    stack: ['AWS', 'VPS Linux', 'Nginx', 'Gunicorn', 'Docker', 'Celery Workers', 'MySQL', 'RDS'],
    features: [
      'Configuration serveurs VPS',
      'Déploiement Docker containerisé',
      'Administration MySQL/RDS',
      'Configuration NAS Synology',
      'Mise en place CI/CD',
    ],
    metrics: [],
    featured: false,
    level: 4,
    year: '2024',
  },
  {
    slug: 'stock-analysis-bot',
    title: 'Bot d\'Analyse Boursière IA',
    shortTitle: 'Stock Bot',
    category: 'ia-ml',
    status: 'completed',
    description: 'Application d\'analyse boursière avec visualisation interactive et prédiction par modèles ML.',
    stack: ['Python', 'Scikit-learn', 'Pandas', 'Plotly', 'Dash', 'yfinance'],
    features: [
      'Visualisation interactive',
      'Indicateurs techniques',
      'Prédiction de tendance ML',
    ],
    metrics: [],
    github: 'https://github.com/zeraisse/ai_stock_bot',
    featured: false,
    level: 3,
    year: '2024',
  },
  {
    slug: 'hadoop-cluster',
    title: 'Configuration Cluster Hadoop SingleNode',
    shortTitle: 'Hadoop Cluster',
    category: 'data-engineering',
    status: 'completed',
    description: 'Configuration d\'un cluster Hadoop SingleNode avec Docker et opérations CRUD sur HDFS.',
    stack: ['Apache Hadoop', 'HDFS', 'Docker', 'MapReduce'],
    features: [
      'Setup Hadoop SingleNode',
      'Configuration HDFS',
      'Opérations MapReduce',
    ],
    metrics: [],
    featured: false,
    level: 3,
    year: '2024',
  },
  {
    slug: 'ecommerce-intuition',
    title: 'Site E-commerce Full-Stack',
    shortTitle: 'E-commerce',
    category: 'fullstack',
    status: 'completed',
    description: 'Site e-commerce complet développé pour Intuition Robotique & Technologie.',
    stack: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Stripe API'],
    features: [
      'Catalogue produits',
      'Panier et checkout',
      'Paiement Stripe intégré',
      'Back-office admin',
    ],
    metrics: [],
    featured: false,
    level: 3,
    year: '2023-2024',
  },
  {
    slug: 'mobile-app-flutter',
    title: 'Application Mobile Cross-Platform',
    shortTitle: 'App Flutter',
    category: 'mobile',
    status: 'completed',
    description: 'Application mobile cross-platform développée avec Flutter.',
    stack: ['Dart', 'Flutter', 'iOS', 'Android'],
    features: [
      'UI/UX moderne',
      'Cross-platform iOS & Android',
    ],
    metrics: [],
    featured: false,
    level: 3,
    year: '2023-2024',
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'ia-ml', label: 'IA & Machine Learning' },
  { id: 'fullstack', label: 'Full-Stack' },
  { id: 'data-engineering', label: 'Data Engineering' },
  { id: 'devops', label: 'DevOps' },
  { id: 'mobile', label: 'Mobile' },
] as const

export type CategoryId = (typeof categories)[number]['id']
