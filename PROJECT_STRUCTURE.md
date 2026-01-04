# Auphere Frontend Next - Estructura del Proyecto

Este proyecto sigue estrictamente las especificaciones definidas en `FRONTEND_SPEC_AUPHERE.md`.

## 🏗️ Estructura de Carpetas

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout raíz con providers
│   ├── page.tsx                 # Página principal (redirect a /login)
│   ├── login/
│   ├── chat/
│   ├── explore/
│   ├── plans/
│   │   ├── [id]/               # Detalle de plan dinámico
│   │   └── page.tsx
│   └── profile/
│
├── components/                   # Componentes por dominio
│   ├── auth/
│   │   └── login-view/
│   ├── chat/
│   │   ├── chat-view/
│   │   └── chat-shell/         # Placeholder para @assistant-ui/react
│   ├── explore/
│   │   └── explore-view/
│   ├── plans/
│   │   ├── plans-list-view/
│   │   └── plan-detail-view/
│   ├── profile/
│   │   └── profile-view/
│   ├── layout/
│   │   └── app-layout/         # Layout con sidebar
│   ├── common/                  # Componentes reutilizables
│   └── ui/                      # shadcn/ui components (futuro)
│
├── api-queries/                 # Server state management
│   ├── api/                     # Funciones de fetch con Axios
│   │   └── plans/
│   │       ├── plans-api.ts
│   │       ├── plans-api.interface.ts
│   │       └── index.ts
│   ├── keys/                    # Query keys de React Query
│   │   └── plans/
│   │       ├── plans-keys.ts
│   │       └── index.ts
│   └── queries/                 # Hooks de React Query
│       └── plans/
│           ├── plans-queries.ts
│           └── index.ts
│
├── lib/                         # Utilidades y configuración
│   ├── types/
│   │   └── index.ts            # Tipos globales (Place, Plan, User, etc.)
│   ├── hooks/                   # Custom hooks
│   ├── store/                   # Zustand stores (solo UI state)
│   │   ├── ui-store.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── cn.ts               # clsx + tailwind-merge
│   │   └── index.ts
│   └── providers/
│       └── query-provider.tsx  # React Query provider
│
└── styles/                      # Estilos globales adicionales (futuro)
```

## 📋 Convenciones

### Naming

- **Carpetas y archivos**: `kebab-case` (ej: `chat-view`, `plans-list-view`)
- **Componentes React**: `PascalCase` (ej: `ChatView`, `PlansListView`)
- **Stores y hooks**: `camelCase` (ej: `useUIStore`, `usePlansQuery`)

### Estructura de Componentes

Cada componente no trivial sigue esta estructura:

```
component-name/
├── component-name.tsx              # Componente presentacional
├── component-name.container.tsx   # Contenedor con lógica (opcional)
├── component-name.interface.ts    # Tipos y props
└── index.ts                       # Re-exports
```

### API Queries Pattern

Todas las peticiones al servidor siguen este patrón:

1. **api/**: Define funciones de fetch usando Axios
2. **keys/**: Define query keys tipadas
3. **queries/**: Define hooks de React Query que usan api + keys

## 🎨 Design System

- **Fuente**: Space Grotesk (400, 600, 700)
- **Colores**: Magenta (#D511FD), Purple (#8A43E1), Orange (#EF7B16)
- **Gradientes**: Definidos en Tailwind config
- **Componentes UI**: shadcn/ui (a instalar según necesidad)

## 🔧 Estado

- **Zustand**: Solo para UI state (sidebar, drawers, modo de chat, IDs seleccionados)
- **React Query**: Para todo el server state (planes, lugares, usuario, sesiones)

## 🚀 Comandos

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Start producción
npm start
```

## 📝 Próximos Pasos

1. Implementar lógica real de chat con @assistant-ui/react
2. Integrar API real del backend
3. Añadir componentes de shadcn/ui según necesidad
4. Implementar filtros y búsqueda en Explore
5. Añadir autenticación real (Auth0/Supabase)
6. Implementar creación y edición de planes
7. Añadir mapas en detalle de planes
