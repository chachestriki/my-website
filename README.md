# Juan Diego Gómez — interactive CV

A game-like personal site: a saturated cartoon hotel lobby rendered in 3D (top-down isometric) where a cowboy walks to whatever you click. Getting close to a station opens the matching room:

| Station | Room |
| --- | --- |
| Recepción | About + mission |
| Key rack | Integration board (projects) |
| PMS terminal | Career log |
| Voice line | Scripted AI agent Q&A |
| Service bell | Contact + CV |
| Study wing | Education, split Madrid ↔ Texas |
| Freight door | Swaps the lobby for the Vice Resell clothing factory |

The freight door replaces the whole scene with a walkable factory floor — moving garment rails, two shoe conveyor layers, workbenches — and a side panel about the fashion-industry software. `Esc` or the back button returns to the lobby. Photos go in `public/vice-resell/` and are wired up in `src/data/viceResell.ts`.

Keyboard: `1`–`7` jump to a station, `WASD`/arrows walk relative to the camera, `Esc` closes a room or leaves the factory. Mobile falls back to a linear list, and `/cv` is a plain recruiter-friendly résumé.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion · three.js with `@react-three/fiber` and `@react-three/drei`.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```
