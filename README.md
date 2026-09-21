# Juan Diego Gómez — interactive CV

A game-like personal site: a pastel, cartoon hotel lobby rendered in 3D (top-down isometric) where a character walks to whatever you click. Getting close to a station opens the matching room:

| Station | Room |
| --- | --- |
| Recepción | About + mission |
| Key rack | Integration board (projects) |
| PMS terminal | Career log |
| Voice line | Scripted AI agent Q&A |
| Service bell | Contact + CV |

Keyboard: `1`–`5` jump to a station, `WASD`/arrows walk, `Esc` closes a room. Mobile falls back to a linear list, and `/cv` is a plain recruiter-friendly résumé.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion · three.js with `@react-three/fiber` and `@react-three/drei`.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```
