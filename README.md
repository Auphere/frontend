# Auphere Frontend

Aplicación web de Auphere construida con **Next.js 14+** (App Router), **React**, y **TypeScript**.

## Tecnologías

- **Framework:** Next.js 14+ (App Router)
- **UI:** Tailwind CSS, Shadcn UI, Radix UI
- **State:** Zustand, TanStack Query
- **Auth:** Auth0
- **Analytics:** PostHog (Cloud en producción)
- **Maps:** Mapbox GL
- **Chat:** assistant-ui

## Requisitos

- Node.js 18+
- npm / yarn / pnpm / bun

## Instalación

```bash
cd auphere-frontend-next
npm install
```

## Configuración

Crea `.env.local`:

```env
# Auth0
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_client_id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://auphere-api

# API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token

# PostHog (solo producción)
# En desarrollo usa console.log automáticamente
# NEXT_PUBLIC_POSTHOG_API_KEY=phc_xxx
# NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

### Variables de PostHog (Analytics)

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `NEXT_PUBLIC_POSTHOG_API_KEY` | Project API Key (solo producción) | ⚠️ |
| `NEXT_PUBLIC_POSTHOG_HOST` | Host de PostHog | ⚠️ |

> **Nota:** En desarrollo (`NODE_ENV=development`), PostHog usa console logging. En producción, envía a PostHog Cloud.

## Ejecutar

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción local
npm run start
```

Abre [http://localhost:3000](http://localhost:3000)

## Estructura de directorios

```
auphere-frontend-next/
├── src/
│   ├── app/              # App Router pages
│   │   ├── chat/         # Chat view
│   │   ├── plans/        # Plans views
│   │   ├── explore/      # Explore view
│   │   └── profile/      # Profile view
│   ├── components/       # React components
│   │   ├── ui/           # Shadcn UI primitives
│   │   ├── chat/         # Chat components
│   │   ├── plan/         # Plan components
│   │   └── place/        # Place components
│   ├── lib/
│   │   ├── analytics/    # PostHog integration
│   │   ├── auth/         # Auth utilities
│   │   ├── hooks/        # Custom hooks
│   │   └── providers/    # Context providers
│   └── api-queries/      # TanStack Query setup
├── public/               # Static assets
├── tailwind.config.ts
└── next.config.ts
```

## Deploy

### AWS Amplify (producción)

El deploy se realiza automáticamente via GitHub Actions → AWS Amplify.

Variables de entorno en Amplify Console:
- `NEXT_PUBLIC_AUTH0_DOMAIN`
- `NEXT_PUBLIC_AUTH0_CLIENT_ID`
- `NEXT_PUBLIC_AUTH0_AUDIENCE`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- `NEXT_PUBLIC_POSTHOG_API_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

### Vercel (alternativa)

```bash
npx vercel
```

## Linting

```bash
npm run lint
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
