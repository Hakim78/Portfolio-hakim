# Portfolio — Hakim Djaalal, AI Engineer

Site Next.js 14 (App Router, TypeScript, Tailwind) : une bande de projets en WebGL
sur la page d'accueil, un profil, un index des projets, des fiches, et N.O.V.A,
un assistant de contact conversationnel.

## Lancer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production (0 erreur TS / lint attendu)
npm run start
```

## Où modifier le contenu

| Quoi | Fichier |
|---|---|
| Nom, rôle, email, liens, disponibilité | `src/data/site.ts` |
| Projets (vedettes = 4 premiers, `featured: true`) | `src/data/projects.ts` |
| Phrase de position, terrains, expériences, repères | `src/data/profile.ts` |
| Logos affichés dans « Outils » et sur les stacks | `src/data/tech.ts` (icônes `simple-icons`) |
| Dialogue de N.O.V.A | `src/components/nova/flow.ts` |
| Visuels des cartes (1750 × 1000, ratio 1,75) | `public/projects/*.jpg` |

## Bande de projets (accueil)

`src/components/work/` — `strip.ts` (scène three.js), `shaders.ts` (déformation,
éclairage, grille au sol), `cardTexture.ts` (capture + titre dessinés sur la carte),
`WorkStrip.tsx` (section épinglée, scroll, glisser, clic).

- Cartes de 59 % de la largeur (86 % sur mobile), ratio 1,75, écart 2 %.
- La bande s'éloigne sur les côtés ; une onde en profondeur, proportionnelle à la
  vitesse de défilement, ondule les bords et fait balayer un reflet.
- Scroll libre avec inertie (Lenis), sans snap. Grille fixe au sol.

## Envoi des messages (N.O.V.A)

`POST /api/contact`. Sans variables d'environnement, les messages sont tracés en
console. Pour les recevoir par email avec Resend : copier `.env.example` en
`.env.local` et renseigner `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`.

## Animations

GSAP (easing global `main`), Lenis, révélation par lignes, bracket headings,
texte roulant au survol, footer révélé, transition de page. Tout respecte
`prefers-reduced-motion`.
