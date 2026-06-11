export interface Skill {
  name: string
  category: 'language' | 'framework' | 'ai-ml' | 'data' | 'devops' | 'tool'
  level: number
  featured?: boolean
}

export const skills: Skill[] = [
  // Languages
  { name: 'Python', category: 'language', level: 5, featured: true },
  { name: 'TypeScript', category: 'language', level: 4, featured: true },
  { name: 'JavaScript', category: 'language', level: 4, featured: true },
  { name: 'SQL', category: 'language', level: 4 },
  { name: 'Dart', category: 'language', level: 3 },
  { name: 'PHP', category: 'language', level: 3 },

  // Frameworks
  { name: 'React', category: 'framework', level: 4, featured: true },
  { name: 'Next.js', category: 'framework', level: 4, featured: true },
  { name: 'Flask', category: 'framework', level: 4 },
  { name: 'Node.js', category: 'framework', level: 4 },
  { name: 'Vue.js', category: 'framework', level: 3 },
  { name: 'Flutter', category: 'framework', level: 3 },
  { name: 'Express', category: 'framework', level: 3 },
  { name: 'Tailwind CSS', category: 'framework', level: 4, featured: true },

  // AI & ML
  { name: 'TensorFlow', category: 'ai-ml', level: 4, featured: true },
  { name: 'PyTorch', category: 'ai-ml', level: 4, featured: true },
  { name: 'Keras', category: 'ai-ml', level: 4 },
  { name: 'Transformers', category: 'ai-ml', level: 4, featured: true },
  { name: 'Computer Vision', category: 'ai-ml', level: 4, featured: true },
  { name: 'NLP', category: 'ai-ml', level: 4, featured: true },
  { name: 'GANs', category: 'ai-ml', level: 4 },
  { name: 'CNNs', category: 'ai-ml', level: 4 },
  { name: 'LSTMs', category: 'ai-ml', level: 4 },
  { name: 'OpenAI API', category: 'ai-ml', level: 5 },
  { name: 'Claude API', category: 'ai-ml', level: 5 },
  { name: 'Scikit-learn', category: 'ai-ml', level: 4 },
  { name: 'HuggingFace', category: 'ai-ml', level: 4 },

  // Data
  { name: 'Pandas', category: 'data', level: 5 },
  { name: 'NumPy', category: 'data', level: 5 },
  { name: 'Apache Spark', category: 'data', level: 3, featured: true },
  { name: 'Apache Airflow', category: 'data', level: 3 },
  { name: 'Redis', category: 'data', level: 4 },
  { name: 'MySQL', category: 'data', level: 4 },
  { name: 'MongoDB', category: 'data', level: 3 },
  { name: 'HDFS', category: 'data', level: 3 },

  // DevOps
  { name: 'Docker', category: 'devops', level: 4, featured: true },
  { name: 'AWS', category: 'devops', level: 3 },
  { name: 'Linux', category: 'devops', level: 4 },
  { name: 'Nginx', category: 'devops', level: 4 },
  { name: 'CI/CD', category: 'devops', level: 3 },
  { name: 'Git', category: 'devops', level: 5 },

  // Tools
  { name: 'Celery', category: 'tool', level: 4 },
  { name: 'Gradio', category: 'tool', level: 4 },
  { name: 'Framer Motion', category: 'tool', level: 4 },
  { name: 'GSAP', category: 'tool', level: 3 },
  { name: 'Three.js', category: 'tool', level: 3 },
]

export const skillCategories = [
  { id: 'all', label: 'Toutes' },
  { id: 'language', label: 'Langages' },
  { id: 'framework', label: 'Frameworks' },
  { id: 'ai-ml', label: 'IA & ML' },
  { id: 'data', label: 'Data' },
  { id: 'devops', label: 'DevOps' },
] as const

export const featuredSkills = skills.filter((s) => s.featured)
