# Juan Diego Gómez — interactive CV

A game-like personal site: a saturated cartoon hotel lobby rendered in 3D (top-down isometric) where a penguin in a stetson walks to whatever you click. Getting close to a station opens the matching room:

| Station | Room |
| --- | --- |
| Recepción | About + mission |
| Key rack | Integration board (projects) |
| Gallery door | Swaps the lobby for the career hall |
| Voice line | Scripted AI agent Q&A |
| Service bell | Contact + CV |
| Education door | Swaps the lobby for the Madrid/Texas campus |
| Freight door | Swaps the lobby for the Vice Resell clothing factory |

The three doors replace the whole scene with another walkable world; `Esc` or the back button returns to the lobby. Inside a scene the side panel is not fixed: walk onto the stand or press `1` to open it, `Esc` or `✕` closes it without leaving the room.

- **Career hall** — framed company logos on a timeline: Lenovo, a marketing agency, Mastel Hospitality, Vice Resell, ODYN AI, Room Mate Hotels (`src/data/career.ts`).
- **Campus** — Puerta de Alcalá, Cibeles, the bear and the madroño and a café desk on the Madrid side; the Capitol dome, a water tower, a pumpjack, a longhorn and a CS lab bench on the Texas side, with a globe on the meridian between them.
- **Factory floor** — moving garment rails, shoe conveyors, stockroom shelving, dense hanger aisles, a packing bench and a photo studio, plus a side panel about the fashion-industry software. Panel photos live in `public/vice-resell/` and are wired up in `src/data/viceResell.ts`.

Keyboard: `1`–`7` jump to a station, `1` toggles the panel inside a scene, `WASD`/arrows walk relative to the camera, `Esc` closes a panel or leaves a scene. Mobile falls back to a linear list, and `/cv` is a plain recruiter-friendly résumé.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion · three.js with `@react-three/fiber` and `@react-three/drei`.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```
