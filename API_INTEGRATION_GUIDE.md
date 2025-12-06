# Guía de Integración API - Frontend

## 🎉 Integración Completa

El frontend ahora está completamente integrado con el backend FastAPI + Supabase usando **TanStack Query v5.83**.

## 📁 Estructura Creada

```
src/
├── api-queries/
│   ├── keys/
│   │   └── auth.keys.ts          # Query keys para auth
│   ├── types/
│   │   └── auth.types.ts         # TypeScript types
│   ├── api/
│   │   └── auth.api.ts           # Funciones API con axios
│   └── query/
│       └── auth.query.ts         # Hooks de React Query
├── lib/
│   ├── config.ts                 # Configuración de la API
│   ├── axios.ts                  # Cliente axios configurado
│   └── transform.ts              # Transformación snake_case ↔ camelCase
└── .env                          # Variables de entorno
```

## 🔧 Configuración

### 1. Instalar axios

```bash
cd /Users/lmatos/Workspace/auphere/auphere-frontend
npm install axios
```

### 2. Variables de Entorno

El archivo `.env` ya está creado con:

```env
VITE_API_URL=http://localhost:8000
VITE_DEFAULT_CITY=Zaragoza
```

> Asegúrate de tener corriendo el microservicio `auphere-places` y de haber sincronizado datos (por ahora limitado a Zaragoza). El frontend usará este valor por defecto para las búsquedas si el usuario todavía no comparte su localización.

### 3. Iniciar ambos servidores

**Terminal 1 - Backend:**
```bash
cd /Users/lmatos/Workspace/auphere/auphere-backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend:**
```bash
cd /Users/lmatos/Workspace/auphere/auphere-frontend
npm run dev
```

## 🚀 Características Implementadas

### ✅ Autenticación Completa

1. **Login** - `useLogin()`
   - Envía credenciales al backend
   - Almacena token JWT
   - Redirige a `/explore`
   - Muestra toast de éxito/error

2. **Register** - `useRegister()`
   - Crea cuenta nueva
   - Almacena token JWT
   - Redirige a `/explore` o muestra mensaje de confirmación de email
   - Maneja errores (email duplicado, etc.)

3. **Forgot Password** - `useForgotPassword()`
   - Envía email de reset
   - Muestra mensaje de confirmación
   - Previene enumeración de emails

4. **Current User** - `useCurrentUser()`
   - Query para obtener datos del usuario autenticado
   - Se ejecuta automáticamente si hay token
   - Cache de 5 minutos
   - Retry deshabilitado para mejor UX

5. **Logout** - `useLogout()`
   - Cierra sesión en backend
   - Limpia token local
   - Limpia cache de queries
   - Redirige a homepage

### 🔄 Transformación de Datos

El sistema **automáticamente** transforma:
- `snake_case` (backend) → `camelCase` (frontend)
- `camelCase` (frontend) → `snake_case` (backend)

Ejemplo:
```typescript
// Backend response
{
  "access_token": "...",
  "token_type": "bearer",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "avatar_url": "https://..."
  }
}

// Frontend (transformado automáticamente)
{
  "accessToken": "...",
  "tokenType": "bearer",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "avatarUrl": "https://..."
  }
}
```

### 🔐 Manejo de Autenticación

#### Interceptores de Axios

**Request Interceptor:**
- Agrega automáticamente el token JWT a cada request
- Header: `Authorization: Bearer <token>`

**Response Interceptor:**
- Maneja errores 401 (Unauthorized)
- Limpia token y redirige a `/auth`
- Previene loops infinitos

#### Almacenamiento del Token

- Token se guarda en `localStorage` como `auth_token`
- Se limpia automáticamente en logout o 401
- Se incluye en cada request al backend

## 📝 Uso en Componentes

### Ejemplo: Login

```typescript
import { useLogin } from '@/api-queries/query/auth.query';

function LoginForm() {
  const loginMutation = useLogin();

  const onSubmit = (data: { email: string; password: string }) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* inputs */}
      <button disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Loading...' : 'Login'}
      </button>
      
      {loginMutation.isError && (
        <div>Error: {loginMutation.error.message}</div>
      )}
    </form>
  );
}
```

### Ejemplo: Current User

```typescript
import { useCurrentUser } from '@/api-queries/query/auth.query';

function Profile() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Ejemplo: Logout

```typescript
import { useLogout } from '@/api-queries/query/auth.query';

function LogoutButton() {
  const logoutMutation = useLogout();

  return (
    <button
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
    >
      Logout
    </button>
  );
}
```

## 🎯 Query Keys

Las query keys siguen el patrón recomendado de TanStack Query:

```typescript
// auth.keys.ts
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  session: () => [...authKeys.all, 'session'] as const,
} as const;
```

Uso:
- Invalidación: `queryClient.invalidateQueries({ queryKey: authKeys.me() })`
- Prefetch: `queryClient.prefetchQuery({ queryKey: authKeys.me(), ... })`
- Set data: `queryClient.setQueryData(authKeys.me(), data)`

## 🔄 Estados de Mutaciones

Cada mutación tiene estos estados:

- `isPending` - Request en curso
- `isError` - Request falló
- `isSuccess` - Request exitoso
- `error` - Objeto de error
- `data` - Data de respuesta

## 🌐 Endpoints del Backend

Todos los endpoints están en `http://localhost:8000/api/v1`:

- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password
- `GET /auth/me` - Current user (requiere auth)
- `POST /auth/logout` - Logout (requiere auth)

## 🧪 Testing

### 1. Test de Login

1. Abre `http://localhost:8080/auth`
2. Crea una cuenta nueva o usa credenciales existentes
3. Verifica que redirige a `/explore`
4. Verifica que el token está en `localStorage`
5. Abre DevTools > Application > Local Storage
6. Deberías ver `auth_token` con un valor JWT

### 2. Test de Protección de Rutas

1. Sin estar autenticado, intenta acceder a `/chat` o `/planner`
2. Deberías ser redirigido a `/auth`
3. Después de login, intenta nuevamente
4. Ahora deberías poder acceder

### 3. Test de Logout

1. Estando autenticado, haz click en logout
2. Verifica que redirige a `/`
3. Verifica que el token fue eliminado de `localStorage`
4. Intenta acceder a rutas protegidas - deberías ser redirigido

## 🐛 Troubleshooting

### Error: "Network Error" o "CORS"

**Solución:**
1. Verifica que el backend esté corriendo
2. Verifica que `FRONTEND_URL` en backend `.env` sea `http://localhost:8080`
3. Reinicia ambos servidores

### Error: "Invalid token" o 401

**Solución:**
1. Limpia `localStorage`: `localStorage.clear()`
2. Recarga la página
3. Haz login nuevamente

### Error: "Module not found: axios"

**Solución:**
```bash
cd /Users/lmatos/Workspace/auphere/auphere-frontend
npm install axios
```

### Query no se ejecuta

**Solución:**
1. Verifica que haya un `QueryClientProvider` en `App.tsx` (ya está configurado)
2. Verifica que la query key sea correcta
3. Verifica el `enabled` flag en la query

## 📚 Recursos

- [TanStack Query v5 Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)

## 🎨 Próximos Pasos

Para agregar más módulos (places, plans, etc):

1. **Crear query keys** en `src/api-queries/keys/[module].keys.ts`
2. **Crear types** en `src/api-queries/types/[module].types.ts`
3. **Crear API functions** en `src/api-queries/api/[module].api.ts`
4. **Crear query hooks** en `src/api-queries/query/[module].query.ts`
5. **Usar en componentes**

## ✅ Checklist de Verificación

- [ ] Backend corriendo en puerto 8000
- [ ] Frontend corriendo en puerto 8080
- [ ] Axios instalado (`npm list axios`)
- [ ] Archivo `.env` configurado
- [ ] Supabase configurado en backend
- [ ] Puedes registrar un usuario
- [ ] Puedes hacer login
- [ ] Token se guarda en localStorage
- [ ] Puedes acceder a rutas protegidas
- [ ] Logout funciona correctamente

---

**¡La integración está completa! 🎉**

