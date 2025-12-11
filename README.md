# 🎨 Auphere Frontend

**React + TypeScript Modern Frontend**

Aplicación frontend de Auphere construida con React, TypeScript, Vite y Shadcn UI para una experiencia de usuario moderna y responsive.

---

## 📋 **Tabla de Contenidos**

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Build](#build)
- [Estructura](#estructura)
- [Componentes](#componentes)
- [Testing](#testing)
- [Docker](#docker)
- [Troubleshooting](#troubleshooting)

---

## 📝 **Descripción**

El frontend de Auphere proporciona:

- **Interfaz moderna** con React 18 y TypeScript
- **UI Components** con Shadcn UI y Radix UI
- **Autenticación** con Auth0
- **State Management** con TanStack Query
- **Routing** con React Router v6
- **Diseño responsive** con Tailwind CSS
- **Dark mode** con next-themes

---

## 🛠️ **Tecnologías**

- **Framework:** React 18.3+
- **Build Tool:** Vite 5.4+
- **Lenguaje:** TypeScript 5.8+
- **UI Library:** Shadcn UI + Radix UI
- **Styling:** Tailwind CSS 3.4+
- **State Management:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod
- **Auth:** Auth0 React SDK

### **Dependencias Principales**

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.8.3",
  "vite": "^5.4.19",
  "@auth0/auth0-react": "^2.10.0",
  "@tanstack/react-query": "^5.83.0",
  "react-router-dom": "^6.30.1",
  "axios": "^1.13.2",
  "tailwindcss": "^3.4.17",
  "zod": "^3.25.76"
}
```

---

## ✅ **Requisitos Previos**

### **Opción 1: Docker**
- Docker >= 24.0
- Docker Compose >= 2.20

### **Opción 2: Local**
- Node.js 20+
- npm 10+ (o pnpm/yarn)

---

## 📦 **Instalación**

### **Opción 1: Con Docker (Recomendado)**

Ver [README principal](../README.md) para instrucciones de Docker Compose.

### **Opción 2: Desarrollo Local**

```bash
# Navegar al directorio del frontend
cd auphere-frontend

# Instalar dependencias
npm install

# O con legacy peer deps si hay conflictos
npm install --legacy-peer-deps
```

---

## ⚙️ **Configuración**

### **Variables de Entorno**

Crea un archivo `.env` en `auphere-frontend/`:

```env
# ============================================
# API Configuration
# ============================================
VITE_API_URL=http://localhost:8000

# ============================================
# Auth0 Configuration
# ============================================
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_AUTH0_AUDIENCE=https://auphere-api

# ============================================
# Feature Flags (Optional)
# ============================================
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### **Tabla de Variables**

| Variable | Descripción | Requerido | Valor por Defecto |
|----------|-------------|-----------|-------------------|
| `VITE_API_URL` | URL del Backend API | ✅ | `http://localhost:8000` |
| `VITE_AUTH0_DOMAIN` | Dominio de Auth0 | ✅ | - |
| `VITE_AUTH0_CLIENT_ID` | Client ID de Auth0 | ✅ | - |
| `VITE_AUTH0_AUDIENCE` | API Audience de Auth0 | ✅ | `https://auphere-api` |
| `VITE_ENABLE_ANALYTICS` | Habilitar analytics | ⚠️ | `false` |
| `VITE_ENABLE_DEBUG` | Modo debug | ⚠️ | `true` |

**⚠️ Nota:** Todas las variables deben comenzar con `VITE_` para ser accesibles en el cliente.

---

## 🏃 **Ejecución**

### **Desarrollo Local**

```bash
# Modo desarrollo con hot reload
npm run dev

# La app estará disponible en http://localhost:5173
```

### **Con Docker**

```bash
# Desde la raíz del proyecto
docker-compose up frontend

# O build y run
docker build -t auphere-frontend .
docker run -p 3000:80 auphere-frontend
```

### **Verificar que funciona**

Abre tu navegador en:
- **Desarrollo:** http://localhost:5173
- **Docker:** http://localhost:3000

---

## 🏗️ **Build**

### **Development Build**

```bash
npm run build:dev
```

### **Production Build**

```bash
# Build optimizado para producción
npm run build

# Los archivos se generan en dist/
ls -la dist/
```

### **Preview Production Build**

```bash
# Build y servir localmente
npm run build
npm run preview

# Disponible en http://localhost:4173
```

---

## 📁 **Estructura del Proyecto**

```
auphere-frontend/
├── public/                  # Assets estáticos
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── api-queries/         # React Query hooks
│   │   ├── useAuth.ts
│   │   ├── usePlaces.ts
│   │   ├── useChat.ts
│   │   └── ...
│   ├── assets/              # Imágenes, iconos
│   │   └── hero-background.jpg
│   ├── components/          # Componentes React
│   │   ├── ui/              # Componentes base (Shadcn)
│   │   ├── layout/          # Layout components
│   │   ├── places/          # Componentes de lugares
│   │   ├── chat/            # Componentes de chat
│   │   └── ...
│   ├── contexts/            # React Contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── lib/                 # Utilidades
│   │   ├── axios.ts         # Axios config
│   │   ├── config.ts        # App config
│   │   ├── transform.ts     # Data transformers
│   │   └── utils.ts         # Helpers
│   ├── pages/               # Páginas/Routes
│   │   ├── Index.tsx        # Home
│   │   ├── Auth.tsx         # Login/Registro
│   │   ├── Explore.tsx      # Explorar lugares
│   │   ├── Chat.tsx         # Chat con IA
│   │   ├── Planner.tsx      # Planificador
│   │   ├── PlaceDetail.tsx  # Detalle de lugar
│   │   ├── Settings.tsx     # Configuración
│   │   └── NotFound.tsx     # 404
│   ├── types/               # TypeScript types
│   │   ├── api.ts
│   │   └── models.ts
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── .env.example             # Environment template
├── index.html               # HTML template
├── package.json
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind config
├── vite.config.ts           # Vite config
├── Dockerfile
└── README.md
```

---

## 🎨 **Componentes**

### **Componentes UI Base (Shadcn)**

Componentes reutilizables en `src/components/ui/`:

- `Button` - Botones con variantes
- `Card` - Tarjetas de contenido
- `Dialog` - Modales
- `Input` - Campos de texto
- `Select` - Dropdowns
- `Tabs` - Pestañas
- `Toast` - Notificaciones
- `Avatar` - Avatares de usuario
- `Badge` - Etiquetas
- Y muchos más...

### **Componentes Personalizados**

#### **PlaceCard**
```tsx
import { PlaceCard } from '@/components/places/PlaceCard'

<PlaceCard
  place={place}
  onSelect={() => handleSelect(place.id)}
/>
```

#### **ChatMessage**
```tsx
import { ChatMessage } from '@/components/chat/ChatMessage'

<ChatMessage
  message={message}
  isUser={true}
/>
```

---

## 🔄 **State Management**

### **TanStack Query (React Query)**

```typescript
// src/api-queries/usePlaces.ts
import { useQuery } from '@tanstack/react-query'

export const usePlaces = (city: string) => {
  return useQuery({
    queryKey: ['places', city],
    queryFn: () => fetchPlaces(city),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Uso en componente
const { data, isLoading, error } = usePlaces('Zaragoza')
```

---

## 🔐 **Autenticación**

### **Auth0 Integration**

```typescript
// src/main.tsx
import { Auth0Provider } from '@auth0/auth0-react'

<Auth0Provider
  domain={import.meta.env.VITE_AUTH0_DOMAIN}
  clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  }}
>
  <App />
</Auth0Provider>
```

### **Protected Routes**

```typescript
// src/components/ProtectedRoute.tsx
import { useAuth0 } from '@auth0/auth0-react'

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0()
  
  if (isLoading) return <Loading />
  if (!isAuthenticated) return <Navigate to="/auth" />
  
  return children
}
```

---

## 🧪 **Testing**

```bash
# Ejecutar tests (si están configurados)
npm test

# Con coverage
npm run test:coverage

# E2E tests (si están configurados)
npm run test:e2e
```

---

## 🐳 **Docker**

### **Build**

```bash
docker build -t auphere-frontend:latest \
  --build-arg VITE_API_URL=http://localhost:8000 \
  --build-arg VITE_AUTH0_DOMAIN=your-tenant.auth0.com \
  --build-arg VITE_AUTH0_CLIENT_ID=your-client-id \
  --build-arg VITE_AUTH0_AUDIENCE=https://auphere-api \
  .
```

### **Run**

```bash
docker run -p 3000:80 auphere-frontend:latest
```

### **Dockerfile**

El Dockerfile usa:
- **Build stage:** Node 20 para compilar
- **Runtime stage:** NGINX Alpine para servir archivos estáticos

---

## 🎨 **Theming**

### **Dark Mode**

```typescript
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()

<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  Toggle Theme
</button>
```

### **Tailwind Customization**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          // ...
          900: '#14532d',
        },
      },
    },
  },
}
```

---

## 📱 **Responsive Design**

El frontend es completamente responsive usando Tailwind breakpoints:

- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+
- `2xl:` - 1536px+

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {places.map(place => (
    <PlaceCard key={place.id} place={place} />
  ))}
</div>
```

---

## 🔧 **Troubleshooting**

### **Error: Cannot find module**

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### **Error: Vite cannot find .env variables**

```bash
# Las variables deben empezar con VITE_
# Verificar archivo .env
cat .env

# Reiniciar dev server
npm run dev
```

### **Error: Auth0 authentication failed**

```bash
# Verificar configuración de Auth0
echo $VITE_AUTH0_DOMAIN
echo $VITE_AUTH0_CLIENT_ID

# Verificar callback URL en Auth0 Dashboard
# Debe incluir: http://localhost:5173
```

### **Error: CORS policy blocking requests**

```bash
# Verificar que el backend tiene configurado CORS
# para permitir http://localhost:5173

# En auphere-backend/app/main.py debe tener:
# allow_origins=["http://localhost:5173"]
```

### **Error: Build fails with memory error**

```bash
# Aumentar límite de memoria para Node
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## 🚀 **Performance**

### **Optimizaciones**

1. **Code Splitting** - Rutas lazy loaded
2. **Image Optimization** - WebP format, lazy loading
3. **Bundle Analysis** - Vite rollup visualizer
4. **CSS Purging** - Tailwind purge en producción
5. **Minification** - Vite minifica automáticamente

### **Bundle Size**

```bash
# Analizar tamaño del bundle
npm run build
npx vite-bundle-visualizer
```

---

## 📝 **Scripts Disponibles**

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run build:dev` | Build de desarrollo |
| `npm run preview` | Preview del build |
| `npm run lint` | Linter de código |
| `npm test` | Ejecutar tests |

---

## 🔗 **Enlaces Útiles**

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/)
- [Auth0 React SDK](https://auth0.com/docs/quickstart/spa/react)

---

## 📝 **Notas de Desarrollo**

### **Agregar nuevos componentes de Shadcn**

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

### **Alias de importación**

```typescript
// tsconfig.json configura @ para apuntar a src/
import { Button } from '@/components/ui/button'
import { config } from '@/lib/config'
```

### **Hot Module Replacement (HMR)**

Vite proporciona HMR automático. Los cambios se reflejan instantáneamente sin recargar la página.

---

## 🤝 **Contribuir**

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
