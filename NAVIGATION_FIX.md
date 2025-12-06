# Fix: useNavigate fuera del Router Context

## Problema Original

Los hooks de React Query estaban usando `useNavigate()` dentro de las mutaciones, pero esto causaba un error porque `useNavigate` necesita estar dentro del contexto del Router.

## Solución Implementada

Movimos toda la lógica de navegación a los componentes que llaman a las mutaciones, usando el patrón de callbacks de TanStack Query.

## Archivos Modificados

### 1. **auth.query.ts** - Queries sin navegación

Removido:
- ❌ `import { useNavigate } from "react-router-dom"`
- ❌ Todas las llamadas a `navigate()` dentro de mutaciones

Las mutaciones ahora solo:
- ✅ Ejecutan la lógica de datos
- ✅ Muestran toasts
- ✅ Actualizan el cache
- ✅ **NO navegan** (eso lo hacen los componentes)

### 2. **LoginForm.tsx** - Navegación en el componente

```typescript
const navigate = useNavigate();
const loginMutation = useLogin();

const onSubmit = (data: LoginFormData) => {
  loginMutation.mutate(data, {
    onSuccess: () => {
      navigate("/explore");  // ← Navegación aquí
    },
  });
};
```

### 3. **RegisterForm.tsx** - Navegación condicional

```typescript
const navigate = useNavigate();
const registerMutation = useRegister();

const onSubmit = (data: RegisterFormData) => {
  registerMutation.mutate(data, {
    onSuccess: (data) => {
      if (data.accessToken) {
        navigate("/explore");
      } else {
        navigate("/auth");  // Email confirmation required
      }
    },
  });
};
```

### 4. **AuthContext.tsx** - Exponiendo la mutación

Antes:
```typescript
const signOut = () => {
  logoutMutation.mutate(undefined, {
    onSuccess: () => navigate('/'),
  });
};

return { signOut, ... }  // signOut era función
```

Ahora:
```typescript
return {
  signOut: logoutMutation,  // ← Exponemos la mutación completa
  ...
}
```

**Cambio en el tipo:**
```typescript
interface AuthContextType {
  signOut: UseMutationResult<MessageResponse, Error, void, unknown>;
  // Antes era: signOut: () => void;
}
```

### 5. **Navigation.tsx** - Usando la mutación

```typescript
const { signOut } = useAuth();
const navigate = useNavigate();

const handleSignOut = () => {
  signOut.mutate(undefined, {
    onSuccess: () => navigate("/"),
    onError: () => navigate("/"),
  });
};
```

### 6. **SecurityTab.tsx** - Usando la mutación

```typescript
const { signOut } = useAuth();
const navigate = useNavigate();

const handleDeleteAccount = () => {
  signOut.mutate(undefined, {
    onSuccess: () => {
      toast({ title: 'Account deleted', ... });
      navigate('/');
    },
    onError: () => {
      toast({ title: 'Error', ... });
    },
  });
};
```

## Patrón a Seguir

### ✅ Correcto - Navegación en componentes

```typescript
// En el componente
const navigate = useNavigate();
const mutation = useSomeMutation();

const handleAction = () => {
  mutation.mutate(data, {
    onSuccess: () => {
      navigate('/somewhere');  // ← Aquí
    },
  });
};
```

### ❌ Incorrecto - Navegación en queries

```typescript
// En auth.query.ts
export function useSomeMutation() {
  const navigate = useNavigate();  // ❌ Error!
  
  return useMutation({
    onSuccess: () => {
      navigate('/somewhere');  // ❌ No funciona
    },
  });
}
```

## Ventajas de Este Patrón

1. **Sin errores de Router** - `useNavigate` siempre está en el contexto correcto
2. **Más flexible** - Diferentes componentes pueden navegar a diferentes lugares
3. **Mejor testing** - Las queries son más fáciles de testear sin dependencias de Router
4. **Separación de responsabilidades** - Queries = datos, Componentes = UI + navegación

## Estado Actual

✅ Todos los errores de navegación resueltos  
✅ Pattern consistente en todos los componentes  
✅ AuthContext expone la mutación completa  
✅ Componentes manejan su propia navegación

## Verificación

Para verificar que todo funciona:

1. Login en `/auth`
2. Debería navegar a `/explore` después de login exitoso
3. Logout desde Navigation
4. Debería navegar a `/` después de logout
5. Sin errores de Router Context en la consola

---

**Estado:** ✅ Resuelto  
**Fecha:** 2024-11-29

