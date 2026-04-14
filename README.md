# Requiem

> *A digital graveyard for dead technology.*

Submit a piece of dead tech, receive an AI-generated eulogy, watch a gravestone rise from the ground.

## Structure

```
requiem/
├── apps/
│   ├── web/     Next.js frontend + Three.js graveyard
│   └── api/     Express + Socket.io backend
└── packages/
    ├── ai-engine/            Claude eulogy generator
    ├── gravestone-renderer/  Three.js scenes
    └── shared-types/         Shared TypeScript types
```

## Quick Start

```bash
npm install
cp .env.example .env   # fill in your keys
# paste docs/schema.sql into Supabase SQL editor
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `NEXT_PUBLIC_APP_URL` | Frontend URL |
| `NEXT_PUBLIC_API_URL` | API URL (default: http://localhost:4000) |

## Pages

| Route | What it does |
|---|---|
| `/` | Search bar + recent burials |
| `/submit` | Submit a dead technology |
| `/graveyard` | Full 3D graveyard |
| `/[slug]` | Individual memorial + tributes |

Built for Micathon 2026.
