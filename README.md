# JD Portfolio — Juan Diego Gómez

A scroll-driven personal site. Each chapter pins its copy on one side and an abstract 3D figure on the other; how far you have scrolled into the chapter drives the figure's animation.

| Chapter | Figure |
| --- | --- |
| Landing | A floating monument: a hotel on a torn slab, ringed by rails of hangers and clothes, turning on its vertical axis |
| Room Mate Hospitality Group | Two systems joined by a wire carrying packets |
| Mastel Hospitality | A card tilting over a folio that stacks under it |
| Vice Resell | Scattered points assembling into a sphere |
| Odyn AI | A speech waveform building into bars |
| Lenovo | Rack slabs sliding home |
| Education | Two points on the same arc around a globe |
| Stack | A 3×3×3 lattice assembling |
| Ask the agent | Two rings locking into one mark |
| Contact | A sheet folding into a send |

All chapters share a single WebGL canvas: only the active chapter's figure is mounted, and the scroll progress reaches it through a ref, so scrolling never re-renders React. The header is fixed, with everything else — sections, GitHub, LinkedIn, CV and email — behind the hamburger. `/cv` is a plain, printable recruiter-facing résumé.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion · three.js with `@react-three/fiber` and `@react-three/drei`.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## The CV agent

The "Ask the agent" chapter talks to `/api/agent`, which prompts an OpenAI model with a dossier built from the site's own data (`src/data/agentContext.ts`), capped at five questions per visit. Set `OPENAI_API_KEY` in `.env.local` locally and in the hosting provider's environment variables for production; without it the route replies in demo mode and the chapter falls back to scripted answers.
