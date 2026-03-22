SendWishes is a romantic, playful digital gift platform scaffold.

Tech stack:
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Key files:
- `src/app/layout.tsx` (romantic base layout + floating hearts background)
- `src/app/page.tsx` (homepage)
- `src/app/create/page.tsx` (Create Your Surprise dashboard)
- `src/components/FloatingHearts.tsx` (background animation)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Notes

Phase 1 sets up the foundation and styling/animation primitives. The homepage buttons are placeholders for now and will be wired up in later phases.

Prompt 2 adds a multi-step "Create Your Surprise" dashboard at `/create` (category → message → photo → generate link success state).
