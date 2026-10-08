/**
 * N.O.V.A — graphe conversationnel.
 *
 * Chaque étape (« step ») est identifiée par un slug. Elle contient :
 *  - say      : variantes de phrase (une est tirée au hasard). `{name}` est remplacé par la donnée saisie.
 *  - progress : 0 → 1, pilote la barre de progression.
 *  - choices  : boutons. `next` = slug suivant, `set` = données à mémoriser, `href` = lien/ancre.
 *  - inputs   : champs de formulaire (text, email, textarea, checkboxes).
 *  - next     : étape suivante (auto-avance si l'étape n'a ni choices ni inputs).
 *  - submit   : envoie les données collectées (onSubmit / endpoint) puis va vers `next`.
 *  - mood     : expression de l'écran (idle, happy, think, wink, code).
 *  - compact  : sur mobile, réduit le panneau de dialogue pour laisser voir le personnage.
 *  - reset    : efface les données collectées en arrivant sur l'étape (menu).
 *  - noBack   : désactive le retour arrière depuis cette étape.
 */

export type Mood = 'idle' | 'happy' | 'think' | 'wink' | 'code';

export type Choice = {
  label: string;
  next?: string;
  href?: string;
  set?: Record<string, string>;
  variant?: 'primary' | 'secondary';
};

export type Input = {
  name: string;
  type: 'text' | 'email' | 'textarea' | 'checkboxes';
  label: string;
  required?: boolean;
  options?: string[];
  autoComplete?: string;
};

export type Step = {
  say: string[];
  progress?: number;
  choices?: Choice[];
  inputs?: Input[];
  next?: string;
  submit?: boolean;
  mood?: Mood;
  compact?: boolean;
  reset?: boolean;
  noBack?: boolean;
};

export type Flow = Record<string, Step>;
export type NovaData = Record<string, string | string[]>;

const emailInput: Input = { name: 'email', type: 'email', label: 'votre@email.com', required: true, autoComplete: 'email' };

export const defaultFlow: Flow = {
  intro: {
    progress: 0.05,
    compact: true,
    mood: 'happy',
    next: 'menu',
    say: [
      "Bonjour, je suis N.O.V.A, l'assistante numérique de Hakim.",
      "Oh, un visiteur ! Je suis N.O.V.A. Je gère l'accueil pendant que Hakim entraîne ses modèles.",
      "Bienvenue. Je suis N.O.V.A, l'assistante de Hakim. Techniquement, c'est moi qui tiens la boutique.",
    ],
  },

  menu: {
    progress: 0.1,
    reset: true,
    noBack: true,
    mood: 'idle',
    say: [
      "Qu'est-ce qui vous amène ?",
      'Alors, comment puis-je vous aider ?',
      'Dites-moi tout. Vous venez pour quoi ?',
    ],
    choices: [
      { label: 'Démarrer un projet', next: 'project-name', set: { goal: 'project' } },
      { label: 'Recruter Hakim', next: 'hire-name', set: { goal: 'hire' } },
      { label: 'Découvrir son parcours', next: 'about-1', set: { goal: 'about' } },
      { label: 'Juste dire bonjour', next: 'hello-name', set: { goal: 'hello' }, variant: 'secondary' },
    ],
  },

  /* ───────────── Projet ───────────── */
  'project-name': {
    progress: 0.18,
    say: ['Excellent. On commence par les présentations : comment vous appelez-vous ?'],
    inputs: [{ name: 'name', type: 'text', label: 'Votre nom', required: true, autoComplete: 'name' }],
    next: 'project-company',
  },
  'project-company': {
    progress: 0.28,
    mood: 'happy',
    say: ['Enchantée {name} ! Vous représentez quelle entreprise ou quel projet ?'],
    inputs: [{ name: 'company', type: 'text', label: 'Entreprise / organisation', autoComplete: 'organization' }],
    next: 'project-type',
  },
  'project-type': {
    progress: 0.38,
    mood: 'think',
    say: ['Quel type de projet avez-vous en tête ? Plusieurs réponses possibles.'],
    inputs: [
      {
        name: 'services',
        type: 'checkboxes',
        label: 'Type de projet',
        required: true,
        options: [
          'Agent IA / LLM',
          'RAG & recherche documentaire',
          'Vision / imagerie médicale',
          'Data engineering & MLOps',
          'Application web ou mobile',
          'Autre chose',
        ],
      },
    ],
    next: 'project-budget',
  },
  'project-budget': {
    progress: 0.48,
    mood: 'wink',
    say: ['Parlons budget. Sans tabou, je ne juge pas.', 'Question délicate mais nécessaire : quel budget envisagez-vous ?'],
    choices: [
      { label: '< 5 k€', next: 'project-deadline', set: { budget: '< 5 k€' } },
      { label: '5 – 15 k€', next: 'project-deadline', set: { budget: '5 – 15 k€' } },
      { label: '15 – 40 k€', next: 'project-deadline', set: { budget: '15 – 40 k€' } },
      { label: '> 40 k€', next: 'project-deadline', set: { budget: '> 40 k€' } },
      { label: 'Je ne sais pas encore', next: 'project-deadline', set: { budget: 'Non défini' }, variant: 'secondary' },
    ],
  },
  'project-deadline': {
    progress: 0.58,
    say: ["Et côté calendrier, c'est pour quand ?"],
    choices: [
      { label: 'Urgent', next: 'project-brief', set: { deadline: 'Urgent' } },
      { label: "D'ici 1 à 3 mois", next: 'project-brief', set: { deadline: '1 à 3 mois' } },
      { label: 'Plus tard', next: 'project-brief', set: { deadline: 'Plus tard' } },
      { label: 'Pas de date fixe', next: 'project-brief', set: { deadline: 'Flexible' }, variant: 'secondary' },
    ],
  },
  'project-brief': {
    progress: 0.7,
    mood: 'think',
    say: ['Décrivez-moi le projet en quelques lignes : le problème, l\'objectif, le contexte. Je transmets tout.'],
    inputs: [{ name: 'brief', type: 'textarea', label: 'Votre projet en quelques lignes', required: true }],
    next: 'project-email',
  },
  'project-email': {
    progress: 0.82,
    say: ['Parfait. À quelle adresse Hakim peut-il vous répondre ?'],
    inputs: [emailInput],
    next: 'send',
  },

  /* ───────────── Recrutement ───────────── */
  'hire-name': {
    progress: 0.2,
    mood: 'happy',
    say: ['Bon goût. Je commence par votre nom ?'],
    inputs: [{ name: 'name', type: 'text', label: 'Votre nom', required: true, autoComplete: 'name' }],
    next: 'hire-company',
  },
  'hire-company': {
    progress: 0.35,
    say: ['Ravie {name}. Pour quelle entreprise recrutez-vous ?'],
    inputs: [{ name: 'company', type: 'text', label: 'Entreprise', required: true, autoComplete: 'organization' }],
    next: 'hire-contract',
  },
  'hire-contract': {
    progress: 0.5,
    mood: 'think',
    say: ['Quel type de collaboration envisagez-vous ?'],
    choices: [
      { label: 'CDI', next: 'hire-role', set: { contract: 'CDI' } },
      { label: 'Mission freelance', next: 'hire-role', set: { contract: 'Freelance' } },
      { label: 'Autre', next: 'hire-role', set: { contract: 'Autre' }, variant: 'secondary' },
    ],
  },
  'hire-role': {
    progress: 0.68,
    say: ["Un mot sur le poste ou l'équipe ? Un lien vers l'offre fonctionne aussi."],
    inputs: [{ name: 'brief', type: 'textarea', label: 'Poste, équipe, lien…', required: true }],
    next: 'hire-email',
  },
  'hire-email': {
    progress: 0.82,
    say: ['Noté. Votre adresse email professionnelle ?'],
    inputs: [emailInput],
    next: 'send',
  },

  /* ───────────── Bonjour ───────────── */
  'hello-name': {
    progress: 0.25,
    mood: 'happy',
    say: ['Bonjour à vous aussi ! Je note votre nom ?'],
    inputs: [{ name: 'name', type: 'text', label: 'Votre nom', required: true, autoComplete: 'name' }],
    next: 'hello-message',
  },
  'hello-message': {
    progress: 0.5,
    say: ['Votre message pour Hakim, {name} :'],
    inputs: [{ name: 'brief', type: 'textarea', label: 'Votre message', required: true }],
    next: 'hello-email',
  },
  'hello-email': {
    progress: 0.78,
    say: ["Une adresse pour qu'il puisse vous répondre ?"],
    inputs: [emailInput],
    next: 'send',
  },

  /* ───────────── Parcours ───────────── */
  'about-1': {
    progress: 0.3,
    mood: 'happy',
    say: ["Hakim est ingénieur IA, diplômé d'un Mastère Big Data & IA à l'IPSSI."],
    choices: [{ label: 'Et ensuite ?', next: 'about-2' }],
  },
  'about-2': {
    progress: 0.55,
    mood: 'think',
    say: [
      "Sa spécialité : l'IA au service du diagnostic médical. Pathologie computationnelle, apprentissage multi-instances, imagerie.",
    ],
    choices: [{ label: 'Intéressant, continuez', next: 'about-3' }],
  },
  'about-3': {
    progress: 0.8,
    say: [
      "Avant ça, il a mis en production des plateformes SaaS à base de LLM chez SP Formation, et développé des apps mobiles pour la robotique chez ILO ROBOT.",
    ],
    choices: [
      { label: 'Voir ses projets', href: '#work' },
      { label: 'Démarrer un projet', next: 'project-name', set: { goal: 'project' } },
      { label: 'Le recruter', next: 'hire-name', set: { goal: 'hire' } },
      { label: 'Retour au menu', next: 'menu', variant: 'secondary' },
    ],
  },

  /* ───────────── Envoi ───────────── */
  send: {
    progress: 0.92,
    mood: 'code',
    submit: true,
    noBack: true,
    next: 'done',
    say: [
      "Je compile tout ça et j'envoie. Ne fermez pas l'onglet…",
      "Transmission en cours. J'ajoute une note : « dossier prometteur ».",
    ],
  },
  done: {
    progress: 1,
    mood: 'happy',
    noBack: true,
    say: ["C'est envoyé ! Hakim vous répond généralement sous 48 h. Merci {name}."],
    choices: [
      { label: 'Retour au menu', next: 'menu' },
      { label: 'Hugging Face', href: 'https://huggingface.co/hakim78', variant: 'secondary' },
      // TODO (Hakim) : vérifier le lien LinkedIn (voir aussi src/data/site.ts)
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hakim', variant: 'secondary' },
      { label: 'GitHub', href: 'https://github.com/Hakim78', variant: 'secondary' },
    ],
  },
  error: {
    progress: 0.92,
    mood: 'wink',
    noBack: true,
    say: ["Oups, la transmission a échoué. Mes circuits rougissent. On réessaie ?"],
    choices: [
      { label: 'Réessayer', next: '__retry' },
      { label: 'Retour au menu', next: 'menu', variant: 'secondary' },
    ],
  },
};
