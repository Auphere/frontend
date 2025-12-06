# 🗺️ Auphere

[![Beta](https://img.shields.io/badge/status-beta-blue.svg)](https://auphere.lovable.app)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)

**Auphere** es tu compañero inteligente de descubrimiento de lugares, impulsado por IA. Encuentra el lugar perfecto para cualquier momento, crea planes completos con amigos, y descubre experiencias personalizadas basadas en tus preferencias.

> 🚧 **Estado Actual**: Beta | Esta aplicación está en desarrollo activo y evolucionando con retroalimentación de usuarios reales.

---

## 📋 Tabla de Contenidos

- [Sobre Auphere](#-sobre-auphere)
- [Características](#-características)
- [Arquitectura Técnica](#️-arquitectura-técnica)
- [Modelo de Datos](#-modelo-de-datos)
- [Instalación](#-instalación-y-desarrollo)
- [Autenticación](#-autenticación)
- [Sistema de Diseño](#-sistema-de-diseño)
- [Rutas de Aplicación](#-rutas-de-la-aplicación)
- [Roadmap](#️-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🎯 Sobre Auphere

### Visión

Auphere transforma la manera en que las personas descubren y deciden dónde ir, combinando inteligencia artificial conversacional con información detallada de lugares para crear experiencias personalizadas en cualquier momento del día.

### Misión

Eliminar la indecisión sobre "¿a dónde vamos?" mediante:

- **Descubrimiento inteligente**: Recomendaciones contextuales basadas en preferencias, ubicación, horario y ocasión
- **Asistente conversacional**: Chat con IA que entiende tus necesidades y genera planes completos
- **Información completa**: Datos detallados de lugares (reviews, horarios, amenidades, tiempos populares)
- **Planificación social**: Creación y compartición de planes con amigos

### Propuesta de Valor

#### Para Usuarios (B2C)

- ✨ Descubre lugares que coinciden con tu vibe actual
- 🤖 Conversa con IA para crear planes completos automáticamente
- 📍 Explora información detallada: reviews, horarios, amenidades, popularidad
- 👥 Crea y comparte planes con amigos
- ❤️ Guarda tus lugares favoritos y planes recurrentes

#### Para Negocios (B2B)

- 📈 Mayor visibilidad ante audiencias objetivo
- 🎯 Alcance a usuarios en el momento exacto de decisión
- 💡 Insights sobre preferencias de clientes potenciales
- 🔗 Integración con sistemas de reservas
- 📊 Analytics de descubrimiento e interacción

### Estado Beta

Auphere está en fase beta invitando activamente retroalimentación de usuarios. **"Esta app está construida para ti y puedes ayudarnos a mejorar la aplicación cada día."** La retroalimentación es visible en la interfaz mediante badges y mensajes discretos que fomentan la participación colaborativa.

---

## ✨ Características

### 🔍 Explore (Explorar Lugares)

**Ruta:** `/explore`

Página principal de descubrimiento con:

- **Búsqueda contextual**: Input con sugerencias en tiempo real
- **Filtrado avanzado**: Por categoría, precio, distancia, rating, amenidades
- **Grid responsivo**: Cards de lugares con información clave
- **Vista rápida**: Imagen, nombre, categoría, rating, precio, distancia
- **Acciones rápidas**: Ver detalles, agregar a favoritos, agregar a plan

**Tecnologías:**

- React Query para gestión de estado
- Mock data (`src/data/mockPlaces.ts`)
- Componente `FilterBar` con filtros múltiples
- Componente `PlaceCard` reutilizable

### 🤖 AI Chat Assistant (Asistente de IA)

**Ruta:** `/chat` (Protegida - requiere autenticación)

Asistente conversacional con dos modos distintos:

#### Modo 1: **Buscar Lugares**

- Usuario describe lo que busca ("un lugar tranquilo para trabajar con wifi")
- IA recomienda lugares específicos con justificación
- Resultados incluyen action buttons: Ver Detalles, Guardar ❤️, Agregar a Plan
- Sugerencias de seguimiento contextuales
- **Conversión a Plan**: Botón flotante para convertir lugares discutidos en un plan completo

#### Modo 2: **Crear Plan**

- IA solicita contexto: número de personas, vibe, horario, presupuesto
- Genera plan estructurado con 2-4 lugares en secuencia lógica
- Muestra `PlanPreview` con timeline, duración, distancia
- Acciones: Guardar Plan, Modificar, Compartir
- Integración automática con `/planner`

**Componentes Clave:**

- `ModeSelector`: Toggle entre modos
- `ChatMessage`: Renderizado de mensajes con acciones
- `ChatPlaceCard`: Cards especializadas para chat
- `PlanPreview`: Vista previa de planes generados

**Estado Global:**

- `PlanContext`: Gestión del plan en construcción compartido entre Chat y Planner

### 📍 Place Detail (Detalle de Lugar)

**Ruta:** `/place/:id`

Vista completa de información del lugar:

#### Secciones Principales

1. **Photo Gallery**

   - Responsive carousel en mobile
   - Grid en desktop
   - Navegación con thumbnails

2. **Información Básica**

   - Nombre, categoría, rating agregado
   - Tags de vibe y características
   - Precio promedio, distancia

3. **AI Insights Card**

   - Mejor momento para visitar
   - "Perfecto para" (ocasiones sugeridas)
   - Tips generados por IA

4. **Reviews Externas**

   - Google Reviews, Trustpilot, TripAdvisor
   - Ratings con links directos
   - Agregación de reseñas de múltiples fuentes

5. **User Reviews Section**

   - Reviews de usuarios de Auphere
   - Filtrado por rating, fecha, vibe
   - Sistema de votación (helpful/not helpful)

6. **Popular Times Chart**

   - Gráfico de barras por día de la semana
   - Indicador de horas más/menos concurridas
   - Ayuda en decisión de cuándo visitar

7. **Amenities Grid**

   - WiFi, Wheelchair Access, Parking
   - Outdoor Seating, Pet-Friendly, Card Payments
   - Reservations, Live Music, etc.

8. **Contact Information Card**

   - Teléfono, website, email
   - Links a redes sociales
   - Horarios detallados por día

9. **You Might Also Like**
   - Recomendaciones de lugares similares
   - Basado en categoría, vibe, ubicación

**Componentes:**

- `PhotoGallery`, `AIInsightsCard`, `ReviewsSection`
- `PopularTimesChart`, `AmenitiesSection`, `RecommendedPlaces`

### 📅 Evening Planner (Planificador)

**Ruta:** `/planner` (Protegida - requiere autenticación)

Gestión completa de planes:

#### Vista Principal

- Lista de planes guardados
- Información rápida: fecha, número de stops, duración estimada
- Estados: Upcoming, Past, Draft
- Acciones: Ver, Editar, Compartir, Eliminar

#### Plan Detail View

- **Timeline visual** con lugares en orden
- **Mapa de ruta** (placeholder para integración futura)
- **Estadísticas**: Duración total, distancia, # de lugares
- **Stops detallados**: Horario sugerido, tiempo en cada lugar, actividad
- **Compartir con amigos**:
  - `SharePlanDialog` con opciones de compartir
  - Link generado, integración con WhatsApp/SMS
  - Invitación de amigos a unirse al plan

#### Crear/Editar Plan

- Selector de fecha
- Agregar lugares desde lista o búsqueda
- Reordenar stops (drag & drop placeholder)
- Asignar tiempos y actividades
- Notas del plan

**Integración con Chat:**

- Planes generados en Chat se sincronizan automáticamente
- Contexto compartido mediante `PlanContext`

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

| Capa                 | Tecnología                                | Propósito                          |
| -------------------- | ----------------------------------------- | ---------------------------------- |
| **Frontend**         | React 18.3                                | Biblioteca UI                      |
| **Lenguaje**         | TypeScript 5.5                            | Type safety                        |
| **Build Tool**       | Vite 5.4                                  | Bundling y dev server              |
| **Routing**          | React Router 6.30                         | Navegación SPA                     |
| **Styling**          | Tailwind CSS 3.4                          | Utility-first CSS                  |
| **UI Components**    | shadcn/ui + Radix UI                      | Sistema de componentes             |
| **State Management** | React Context + Hooks                     | Estado global                      |
| **Data Fetching**    | TanStack Query 5.83                       | Server state (preparado)           |
| **Forms**            | React Hook Form + Zod                     | Validación de formularios          |
| **Icons**            | Lucide React                              | Iconografía                        |
| **Charts**           | Recharts 2.15                             | Visualización de datos             |
| **Animations**       | Tailwind Animate + Framer Motion (futuro) | Micro-interacciones                |
| **Backend (Futuro)** | Lovable Cloud / Supabase                  | Database, Auth, Storage, Functions |

### Estructura de Carpetas

```
src/
├── assets/                  # Imágenes, logos, mockups
├── components/              # Componentes React
│   ├── ui/                 # Componentes base shadcn/ui
│   ├── auth/               # Login, Register, ForgotPassword forms
│   ├── chat/               # ModeSelector, ChatMessage, PlanPreview, ChatPlaceCard
│   ├── place/              # PhotoGallery, AIInsightsCard, ReviewsSection, etc.
│   ├── sections/           # Hero, HowItWorks, ForUsers, ForBusinesses, Testimonials
│   ├── Logo.tsx            # Logo component con navegación
│   ├── Navigation.tsx      # Header navigation
│   ├── Footer.tsx          # Footer con links
│   ├── PlaceCard.tsx       # Card reutilizable de lugar
│   ├── FilterBar.tsx       # Filtros para Explore
│   ├── SharePlanDialog.tsx # Modal de compartir planes
│   └── ProtectedRoute.tsx  # HOC para rutas protegidas
├── contexts/               # React Contexts
│   ├── AuthContext.tsx     # Estado de autenticación
│   └── PlanContext.tsx     # Plan en construcción (global)
├── data/                   # Mock data
│   └── mockPlaces.ts       # Lugares mock para desarrollo
├── hooks/                  # Custom hooks
│   ├── use-mobile.tsx      # Detección de mobile
│   └── use-toast.ts        # Toast notifications
├── lib/                    # Utilidades
│   └── utils.ts            # Helpers (cn, etc.)
├── pages/                  # Páginas/Rutas principales
│   ├── Index.tsx           # Landing page (Home)
│   ├── Explore.tsx         # Búsqueda y descubrimiento
│   ├── Chat.tsx            # AI Assistant (protegida)
│   ├── PlaceDetail.tsx     # Detalle de lugar
│   ├── Planner.tsx         # Gestión de planes (protegida)
│   ├── Auth.tsx            # Login/Register
│   ├── ForgotPassword.tsx  # Recuperación de contraseña
│   ├── BrandGuide.tsx      # Sistema de marca (para referencia)
│   └── NotFound.tsx        # 404 page
├── types/                  # TypeScript types
│   ├── place.ts            # Place, Review, EveningPlan types
│   └── chat.ts             # Message, ChatMode, PlanContext types
├── App.tsx                 # Root component con routing
├── main.tsx                # Entry point
└── index.css               # Global styles + design tokens
```

### Diagrama de Componentes Principales

```
App (Router)
├── Navigation (Header)
├── Routes
│   ├── Index (Landing)
│   │   ├── Hero
│   │   ├── HowItWorks
│   │   ├── ForUsers
│   │   ├── ForBusinesses
│   │   ├── Screenshots
│   │   ├── Testimonials
│   │   └── FinalCTA
│   ├── Explore
│   │   ├── FilterBar
│   │   └── PlaceCard (Grid)
│   ├── PlaceDetail
│   │   ├── PhotoGallery
│   │   ├── AIInsightsCard
│   │   ├── ReviewsSection
│   │   ├── PopularTimesChart
│   │   ├── AmenitiesSection
│   │   └── RecommendedPlaces
│   ├── Chat (Protected)
│   │   ├── ModeSelector
│   │   ├── ChatMessage
│   │   ├── ChatPlaceCard
│   │   └── PlanPreview
│   ├── Planner (Protected)
│   │   └── SharePlanDialog
│   ├── Auth
│   │   ├── LoginForm
│   │   └── RegisterForm
│   └── ForgotPassword
└── Footer
```

---

## 📦 Modelo de Datos

### Place (Lugar)

```typescript
interface Place {
  id: string;
  name: string;
  category: string;
  image: string;
  images?: string[]; // Galería completa
  rating: number;
  reviews: number;
  price: "$" | "$$" | "$$$" | "$$$$";
  distance: string;
  address: string;
  vibe: string[]; // ["Trendy", "Quiet", "Lively"]
  description: string;
  openingHours: {
    [day: string]: string; // "Monday": "9:00 AM - 10:00 PM"
  };
  amenities: string[]; // ["WiFi", "Outdoor Seating"]
  contact: {
    phone: string;
    website: string;
    email: string;
    social: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  popularTimes?: {
    [day: string]: number[]; // Array de 24 horas con % de ocupación
  };
  externalReviews?: {
    google?: { rating: number; count: number; url: string };
    trustpilot?: { rating: number; count: number; url: string };
    tripadvisor?: { rating: number; count: number; url: string };
  };
  aiInsights?: {
    bestTimeToVisit: string;
    perfectFor: string[];
    tips: string[];
  };
}
```

### Review (Reseña)

```typescript
interface Review {
  id: string;
  placeId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  text: string;
  vibe: string[];
  helpful: number; // Votos útiles
}
```

### EveningPlan (Plan)

```typescript
interface EveningPlan {
  id: string;
  name: string;
  date: string;
  createdBy: string;
  stops: Array<{
    place: Place;
    order: number;
    suggestedTime: string;
    duration: number; // minutos
    activity?: string;
  }>;
  totalDuration: number;
  totalDistance: number;
  status: "upcoming" | "past" | "draft";
  sharedWith?: string[]; // User IDs
  notes?: string;
}
```

### Chat Types

```typescript
type ChatMode = "explore" | "plan";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  places?: Place[]; // Lugares recomendados
  plan?: EveningPlan; // Plan generado
  suggestions?: string[]; // Sugerencias de seguimiento
}

interface PlanContext {
  places: Place[];
  preferences: {
    vibe?: string;
    date?: string;
    groupSize?: number;
    budget?: string;
  };
}
```

---

## 🚀 Instalación y Desarrollo

### Requisitos Previos

- **Node.js** 18+ y npm (recomendado: [instalar con nvm](https://github.com/nvm-sh/nvm))
- **Git**
- Editor de código (VS Code recomendado)

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <YOUR_GIT_URL>
cd auphere

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

El servidor se ejecutará en `http://localhost:3000` por defecto.

### Scripts Disponibles

| Script      | Comando           | Descripción                           |
| ----------- | ----------------- | ------------------------------------- |
| **Dev**     | `npm run dev`     | Inicia servidor de desarrollo con HMR |
| **Build**   | `npm run build`   | Crea build de producción optimizado   |
| **Preview** | `npm run preview` | Preview del build de producción       |
| **Lint**    | `npm run lint`    | Ejecuta ESLint para verificar código  |

### Variables de Entorno (Futuro)

Cuando se integre Supabase, crear `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_OPENAI_API_KEY=your_openai_key (backend only)
```

---

## 🔐 Autenticación

### Estado Actual (Beta)

**Implementación:** UI-only / Mock

La autenticación está implementada como **UI skeleton** con placeholders para integración futura de Supabase. Los componentes y flujos están construidos y funcionando visualmente, pero sin validación backend real.

#### Componentes de Autenticación

- `LoginForm.tsx`: Formulario de login con validación Zod
- `RegisterForm.tsx`: Registro de usuario con confirmación de contraseña
- `ForgotPasswordForm.tsx`: Recuperación de contraseña
- `AuthContext.tsx`: Context provider con métodos mock (login, logout, register)
- `ProtectedRoute.tsx`: HOC para rutas que requieren autenticación

#### Flujo Mock Actual

```typescript
// AuthContext.tsx (simplificado)
const login = async (email: string, password: string) => {
  // TODO: Integrar con Supabase
  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email, password
  // });

  // Mock actual: simula login exitoso
  setUser({
    id: "mock-user-123",
    email,
    name: "Usuario Mock",
  });
  toast.success("Sesión iniciada");
};
```

#### Campos de Usuario Requeridos

- `email` (string, unique)
- `password` (string, hash)
- `name` (string)
- `avatar` (string, URL, opcional)
- `preferences` (JSON, opcional): vibes favoritos, categorías, presupuesto

### Preparación para Supabase

**Pasos para Activar Autenticación Real:**

1. **Habilitar Lovable Cloud** en el proyecto
2. **Configurar tabla `profiles`** en Supabase:
   ```sql
   create table profiles (
     id uuid references auth.users primary key,
     email text unique not null,
     name text,
     avatar text,
     preferences jsonb,
     created_at timestamp with time zone default now()
   );
   ```
3. **Descomentar código Supabase** en `AuthContext.tsx`
4. **Configurar RLS policies** para proteger datos de usuario
5. **Integrar triggers** para crear profile automáticamente en registro

#### Proveedores de Autenticación Planificados

- ✅ Email/Password (prioritario)
- ⏳ Google OAuth
- ⏳ Magic Link (passwordless)

---

## 🎨 Sistema de Diseño

### Paleta de Colores (Pastel Light Theme)

El sistema de diseño usa **tokens semánticos HSL** definidos en `src/index.css`:

```css
:root {
  /* Base colors */
  --background: 0 0% 100%; /* White */
  --foreground: 240 10% 3.9%; /* Nearly black */

  /* Primary brand color */
  --primary: 221 83% 53%; /* Vibrant blue */
  --primary-foreground: 0 0% 100%;

  /* Secondary accent */
  --secondary: 280 65% 60%; /* Soft purple */
  --secondary-foreground: 0 0% 100%;

  /* Muted backgrounds */
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;

  /* Accent highlights */
  --accent: 172 66% 50%; /* Teal/turquoise */
  --accent-foreground: 0 0% 100%;

  /* Destructive/Error */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 100%;

  /* Borders and inputs */
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 221 83% 53%;

  /* Card backgrounds */
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;

  /* Popover backgrounds */
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;

  /* Radius tokens */
  --radius: 0.5rem;
}
```

#### Uso de Colores en Componentes

```tsx
// ❌ INCORRECTO: Colores directos
<div className="bg-blue-500 text-white">

// ✅ CORRECTO: Tokens semánticos
<div className="bg-primary text-primary-foreground">
<div className="bg-muted text-muted-foreground">
<div className="bg-accent text-accent-foreground">
```

### Tipografía

#### Font Families

```css
/* src/index.css */
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap");

.font-space-grotesk {
  font-family: "Space Grotesk", system-ui, sans-serif;
}
```

#### Typography Scale

| Elemento       | Clase Tailwind                       | Uso               |
| -------------- | ------------------------------------ | ----------------- |
| **H1**         | `text-4xl md:text-6xl font-bold`     | Hero headings     |
| **H2**         | `text-3xl md:text-5xl font-bold`     | Section titles    |
| **H3**         | `text-2xl md:text-3xl font-semibold` | Subsection titles |
| **H4**         | `text-xl font-semibold`              | Card titles       |
| **Body Large** | `text-lg`                            | Intro paragraphs  |
| **Body**       | `text-base`                          | Default text      |
| **Body Small** | `text-sm`                            | Secondary text    |
| **Caption**    | `text-xs`                            | Labels, metadata  |

### Componentes UI

Auphere usa **shadcn/ui** como sistema base de componentes, todos customizados con los tokens de diseño del proyecto:

- Buttons (variants: default, secondary, accent, outline, ghost)
- Cards
- Dialogs/Modals
- Forms (Input, Textarea, Select, Checkbox, Radio)
- Navigation (Tabs, Breadcrumbs)
- Feedback (Toast, Alert, Badge)
- Data Display (Table, Tabs, Accordion, Avatar)

Todos los componentes se encuentran en `src/components/ui/` y son completamente reutilizables.

---

## 📱 Rutas de la Aplicación

### Tabla de Rutas

| Ruta               | Componente           | Descripción                          | Protegida | Móvil-first |
| ------------------ | -------------------- | ------------------------------------ | --------- | ----------- |
| `/`                | `Index.tsx`          | Landing page con Hero, Features, CTA | No        | ✅          |
| `/explore`         | `Explore.tsx`        | Búsqueda y filtrado de lugares       | No        | ✅          |
| `/place/:id`       | `PlaceDetail.tsx`    | Detalle completo de lugar            | No        | ✅          |
| `/chat`            | `Chat.tsx`           | AI Assistant con modos explore/plan  | **Sí**    | ✅          |
| `/planner`         | `Planner.tsx`        | Gestión de planes guardados          | **Sí**    | ✅          |
| `/auth`            | `Auth.tsx`           | Login y registro                     | No        | ✅          |
| `/forgot-password` | `ForgotPassword.tsx` | Recuperación de contraseña           | No        | ✅          |
| `/brand-guide`     | `BrandGuide.tsx`     | Sistema de marca (referencia)        | No        | ✅          |
| `*`                | `NotFound.tsx`       | 404 error page                       | No        | ✅          |

### Rutas Protegidas

Las rutas protegidas (`/chat`, `/planner`) requieren autenticación y redirigen a `/auth` si el usuario no está autenticado:

```tsx
// ProtectedRoute.tsx
<Route
  path="/chat"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>
```

### Navegación

**Header Navigation:**

- Logo (clickeable, navega a `/`)
- Explorar → `/explore`
- Chat → `/chat` (con icono de lock si no autenticado)
- Mis Planes → `/planner` (con icono de lock si no autenticado)
- Login/Avatar → `/auth` o perfil de usuario

**Mobile Navigation:**

- Hamburger menu con las mismas opciones
- CTA destacado: "Empezar"

---

## 🗺️ Roadmap

### Fase 1: Backend Integration (Q1 2025)

- [ ] Activar **Lovable Cloud / Supabase**
- [ ] Configurar tablas: `profiles`, `places`, `reviews`, `plans`, `favorites`
- [ ] Implementar RLS policies para seguridad
- [ ] Conectar `AuthContext` con Supabase Auth
- [ ] Migrar mock data a database real
- [ ] Edge Functions para lógica server-side

### Fase 2: Real AI Integration (Q1-Q2 2025)

- [ ] Integrar **OpenAI GPT-4** o **Anthropic Claude** para Chat Assistant
- [ ] Sistema de embeddings para búsqueda semántica de lugares
- [ ] Generación de AI Insights en tiempo real
- [ ] Personalización basada en historial de usuario
- [ ] Fine-tuning de prompts para mejor UX

### Fase 3: Social Features (Q2 2025)

- [ ] Sistema de **Favoritos y Colecciones**
  - Listas personalizadas (Favoritos, Para Visitar, Visitados)
  - Compartir colecciones con amigos
  - Sincronización en tiempo real
- [ ] **Perfiles de Usuario** completos
  - Bio, foto, preferencias públicas
  - Historial de lugares visitados
  - Badges y gamificación
- [ ] **Sistema de Amigos**
  - Agregar/seguir amigos
  - Ver planes de amigos
  - Recomendaciones sociales

### Fase 4: Booking & Payments (Q2-Q3 2025)

- [ ] Integración con **Stripe** para pagos
- [ ] Sistema de **Reservas** directas desde la app
- [ ] Integración con APIs de restaurantes (OpenTable, Resy)
- [ ] Comisiones por reserva (modelo B2B)
- [ ] Dashboard para negocios (B2B portal)

### Fase 5: Advanced Features (Q3 2025)

- [ ] **Mapa interactivo** con rutas optimizadas
- [ ] **Notificaciones push** (recordatorios de planes, nuevos lugares)
- [ ] **Modo offline** (cache de lugares favoritos)
- [ ] **Filtros avanzados**: accesibilidad, dietary restrictions
- [ ] **Integración de calendarios** (Google Calendar, Apple Calendar)
- [ ] **Analytics dashboard** para usuarios (lugares visitados, estadísticas)

### Fase 6: Scale & Expansion (Q4 2025)

- [ ] **Multi-ciudad**: Expansión más allá de ciudad inicial
- [ ] **Internacionalización**: i18n para múltiples idiomas
- [ ] **App móvil nativa** (React Native o Flutter)
- [ ] **Web3 features** (opcional): NFT badges, tokenized rewards
- [ ] **Partnerships** con marcas y venues
- [ ] **API pública** para developers

---

## 🤝 Contribuir

¡Gracias por tu interés en contribuir a Auphere! Como proyecto en beta, valoramos enormemente la retroalimentación y contribuciones de la comunidad.

### Cómo Contribuir

1. **Reportar Bugs**

   - Usa GitHub Issues
   - Incluye pasos para reproducir
   - Screenshots/videos si es posible
   - Especifica device/browser

2. **Sugerir Features**

   - Abre un Issue con etiqueta `enhancement`
   - Describe el problema que resuelve
   - Propón una solución (opcional)

3. **Contribuir Código**

   ```bash
   # 1. Fork el repositorio
   # 2. Crea una rama para tu feature
   git checkout -b feature/amazing-feature

   # 3. Commit tus cambios
   git commit -m 'Add amazing feature'

   # 4. Push a tu fork
   git push origin feature/amazing-feature

   # 5. Abre un Pull Request
   ```

4. **Código de Conducta**
   - Sé respetuoso y constructivo
   - Acepta feedback con mente abierta
   - Enfócate en lo mejor para el proyecto

### Guía de Estilo

- **TypeScript**: Usa tipos explícitos, evita `any`
- **Componentes**: Functional components con hooks
- **Naming**: camelCase para variables, PascalCase para componentes
- **Tailwind**: Usa tokens semánticos, no colores directos
- **Commits**: Mensajes descriptivos en inglés

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver el archivo `LICENSE` para más detalles.

---

## 🔗 Links Útiles

- **Lovable Project**: [https://lovable.dev/projects/c2e4b584-3562-42ee-98d0-c889944ce9ee](https://lovable.dev/projects/c2e4b584-3562-42ee-98d0-c889944ce9ee)
- **Documentación Lovable**: [https://docs.lovable.dev/](https://docs.lovable.dev/)
- **Lovable Cloud**: [https://docs.lovable.dev/features/cloud](https://docs.lovable.dev/features/cloud)
- **shadcn/ui Docs**: [https://ui.shadcn.com/](https://ui.shadcn.com/)
- **Tailwind CSS**: [https://tailwindcss.com/](https://tailwindcss.com/)

---

## 📧 Contacto

Para preguntas, feedback o colaboraciones:

- **Email**: [tu-email@auphere.app]
- **Discord Community**: [Link a Discord]
- **Twitter**: [@AuphereApp]

---

<div align="center">

**Construido con ❤️ por el equipo Auphere**

_Esta app está construida para ti y puedes ayudarnos a mejorar cada día._

[⭐ Star este repo](https://github.com/tu-usuario/auphere) si te gusta el proyecto!

</div>
