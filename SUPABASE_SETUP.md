# Supabase Authentication Setup Guide

Este archivo contiene las instrucciones para integrar Supabase en el sistema de autenticación de Auphere.

## ⚡ Estado Actual de la Implementación

**✅ YA IMPLEMENTADO (Mock visual):**
- AuthContext con hook useAuth (`src/contexts/AuthContext.tsx`)
- ProtectedRoute component (`src/components/ProtectedRoute.tsx`)
- Rutas protegidas: `/chat` y `/planner` requieren autenticación
- Navegación con dropdown de usuario y botón de logout
- Redireccionamiento automático de usuarios autenticados desde `/auth`
- Badge de Beta en páginas protegidas para feedback de usuarios
- Integración mock usando localStorage para simular sesión

**🔧 PENDIENTE DE INTEGRACIÓN REAL:**
- Cliente de Supabase (`src/lib/supabase.ts`)
- Descomentar código de Supabase en formularios de autenticación
- Crear tabla `profiles` en Supabase
- Configurar variables de entorno

---

## 1. Configuración Inicial de Supabase

### Crear un nuevo proyecto en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Guarda las credenciales: `Project URL` y `anon public key`

### Instalar el cliente de Supabase
```bash
npm install @supabase/supabase-js
```

## 2. Configurar el Cliente de Supabase

Crear el archivo `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

### Variables de entorno
Crear archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_url_aqui
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
```

**IMPORTANTE:** Agregar `.env.local` al `.gitignore` para no subir las credenciales al repositorio.

## 3. Crear la Tabla de Perfiles en Supabase

Ejecutar este SQL en el SQL Editor de Supabase:

```sql
-- Crear tabla de perfiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  avatar_url text,
  preferences jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security
alter table public.profiles enable row level security;

-- Políticas de seguridad
-- Los usuarios pueden leer su propio perfil
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Función para crear perfil automáticamente
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, avatar_url, preferences)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    new.email,
    null,
    '{}'::jsonb
  );
  return new;
end;
$$;

-- Trigger para crear perfil cuando se registra un usuario
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Función para actualizar updated_at automáticamente
create function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Trigger para actualizar updated_at
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
```

## 4. Configurar Email Templates en Supabase

En Supabase Dashboard > Authentication > Email Templates, personaliza:
- Confirm signup
- Reset password
- Magic link

## 5. Integración en los Componentes

### LoginForm.tsx
Descomenta el código marcado con `TODO: SUPABASE INTEGRATION REQUIRED` en:
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/ForgotPasswordForm.tsx`

Y elimina el código MOCK correspondiente.

## 6. Context de Autenticación

**✅ YA IMPLEMENTADO:** El AuthContext ya está creado en `src/contexts/AuthContext.tsx` y configurado en `src/App.tsx`.

Para activar la integración real de Supabase, solo necesitas:

1. Descomentar el código marcado con `TODO: SUPABASE INTEGRATION` en `src/contexts/AuthContext.tsx`
2. Eliminar el código MOCK (implementación con localStorage)
3. Asegurarte de que el archivo `src/lib/supabase.ts` esté creado y configurado

El AuthContext ya incluye:
- Estado de usuario, sesión y loading
- Función signOut
- Listener de cambios de autenticación
- Integración completa con la aplicación

## 7. Proteger Rutas

**✅ YA IMPLEMENTADO:** El componente ProtectedRoute ya está creado en `src/components/ProtectedRoute.tsx`.

Las siguientes rutas ya están protegidas en `src/App.tsx`:
- `/chat` - Requiere autenticación
- `/planner` - Requiere autenticación

Estas rutas redirigen automáticamente a `/auth` si el usuario no está autenticado.

Para proteger rutas adicionales, simplemente envuélvelas con `<ProtectedRoute>`:

```typescript
<Route path="/nueva-ruta" element={
  <ProtectedRoute>
    <TuComponente />
  </ProtectedRoute>
} />
```

## 8. Configuración de Email Redirect URLs

En Supabase Dashboard > Authentication > URL Configuration, agregar:
- Site URL: `http://localhost:5173` (desarrollo)
- Redirect URLs: `http://localhost:5173/**` y tu dominio de producción

## 9. Testing

Credenciales de prueba en desarrollo (MOCK):
- Email: demo@auphere.com
- Password: demo123

Una vez integrado Supabase, crear usuarios reales para testing.

## 10. Deshabilitar "Confirm Email" en Desarrollo

Para agilizar el testing en desarrollo:
1. Supabase Dashboard > Authentication > Settings
2. Desactiva "Enable email confirmations"

**IMPORTANTE:** Re-activar en producción.

## Notas Adicionales

- Todos los formularios ya tienen validación con Zod
- Los errores de Supabase se manejan y se muestran al usuario
- Las contraseñas deben tener mínimo 6 caracteres
- El sistema soporta reset de contraseña via email
- Row Level Security (RLS) está habilitado para proteger los datos
