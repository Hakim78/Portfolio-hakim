import {
  siApachehadoop,
  siApachekafka,
  siBluetooth,
  siCelery,
  siClaude,
  siFastapi,
  siGit,
  siGithub,
  siGooglegemini,
  siGradio,
  siHtml5,
  siJavascript,
  siJupyter,
  siMediapipe,
  siMongodb,
  siNextdotjs,
  siNginx,
  siNumpy,
  siOpencv,
  siScikitlearn,
  siStreamlit,
  siSupabase,
  siTypescript,
  siVercel,
  siVite,
  siVuedotjs,
  siWhatsapp,
  type SimpleIcon,
} from 'simple-icons'

/**
 * Logos de langages et de marques, toujours en couleur (choix de Hakim).
 * 1. PNG couleur repris de l'ancien portfolio (/public/assets/icons_stack)
 * 2. sinon simple-icons avec la couleur officielle de la marque
 * Les libellés sans logo (ConvNeXt, FAISS, LSTM…) s'affichent en texte seul.
 */
export type TechLogoSpec = { kind: 'img'; src: string } | { kind: 'svg'; path: string; color: string }

const PNG: Record<string, string> = {
  python: 'Python.png',
  pytorch: 'PyTorch.png',
  tensorflow: 'TensorFlow.png',
  keras: 'Keras.png',
  react: 'React.png',
  'node.js': 'Node.js.png',
  flask: 'Flask.png',
  php: 'PHP.png',
  tailwind: 'Tailwind_CSS.png',
  postgresql: 'PostgresSQL.png',
  mysql: 'MySQL.png',
  redis: 'Redis.png',
  pandas: 'Pandas.png',
  selenium: 'Selenium.png',
  airflow: 'Apache_Airflow.png',
  spark: 'spark.png',
  elasticsearch: 'elasticsearch.png',
  docker: 'Docker.png',
  aws: 'AWS.png',
  'hugging face': 'huggingface-color.png',
  flutter: 'flutter_dart.png',
  dart: 'flutter_dart.png',
  stripe: 'stripe.png',
  firebase: 'Firebase.png',
  'app store': 'App_store.png',
  'google play': 'google_play_store.png',
  'ci/cd': 'ci_CD.png',
  'computer vision': 'computer_vision.png',
}

const SVG: Record<string, SimpleIcon> = {
  'next.js': siNextdotjs,
  typescript: siTypescript,
  javascript: siJavascript,
  'html/css': siHtml5,
  fastapi: siFastapi,
  supabase: siSupabase,
  opencv: siOpencv,
  mediapipe: siMediapipe,
  'scikit-learn': siScikitlearn,
  claude: siClaude,
  gemini: siGooglegemini,
  kafka: siApachekafka,
  hdfs: siApachehadoop,
  nginx: siNginx,
  vercel: siVercel,
  vite: siVite,
  'vue.js': siVuedotjs,
  gradio: siGradio,
  celery: siCelery,
  whatsapp: siWhatsapp,
  mongodb: siMongodb,
  streamlit: siStreamlit,
  git: siGit,
  github: siGithub,
  bluetooth: siBluetooth,
  numpy: siNumpy,
  jupyter: siJupyter,
}

const ALIASES: Record<string, string> = {
  'pytorch 2.0': 'pytorch',
  'next.js 14': 'next.js',
  'postgresql · supabase': 'supabase',
  'tensorflow 2.x': 'tensorflow',
  'claude api': 'claude',
  'gemini api': 'gemini',
  'tailwind css': 'tailwind',
  tailwindcss: 'tailwind',
  'apache airflow': 'airflow',
  'apache spark': 'spark',
  'apache kafka': 'kafka',
  'aws (ec2, s3)': 'aws',
  'flutter / dart': 'flutter',
  'scikit learn': 'scikit-learn',
  sklearn: 'scikit-learn',
  huggingface: 'hugging face',
}

/** Couleur de marque lisible sur fond noir : les logos noirs passent en blanc cassé. */
function brandColor(hex: string) {
  const n = parseInt(hex, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return lum < 60 ? '#f4f4f2' : `#${hex}`
}

export function techLogo(label: string): TechLogoSpec | undefined {
  const raw = label.trim().toLowerCase()
  const key = ALIASES[raw] ?? raw
  const png = PNG[key]
  if (png) return { kind: 'img', src: `/assets/icons_stack/${png}` }
  const icon = SVG[key]
  if (icon) return { kind: 'svg', path: icon.path, color: brandColor(icon.hex) }
  return undefined
}
