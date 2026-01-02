# Better Auth Implementation Examples for Different Frameworks

## Next.js Implementation

### 1. App Router Setup

For Next.js 13+ with App Router:

```typescript
// lib/auth.ts
import { betterAuth } from "@better-auth/node";
import { nextJs } from "@better-auth/next-js";

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET!,
  database: {
    provider: "sqlite",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
  },
});

export const { signIn, signUp, signOut } = nextJs(auth);
```

### 2. API Route Handler

```typescript
// app/api/auth/[...auth]/route.ts
import { auth } from "@/lib/auth";
import { betterAuth } from "@better-auth/node";

export const { GET, POST } = auth;
```

### 3. Server Component Usage

```tsx
// app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.$context.getSession();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
    </div>
  );
}
```

### 4. Client Component Usage

```tsx
// components/user-profile.tsx
"use client";

import { useSession } from "@better-auth/react";

export function UserProfile() {
  const { session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <p>Name: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

## Remix Implementation

### 1. Entry Point Setup

```typescript
// app/services/auth.server.ts
import { betterAuth } from "@better-auth/node";

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET!,
  database: {
    provider: "sqlite",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
  },
});
```

### 2. Action Handler

```typescript
// app/routes/auth/login.ts
import type { ActionFunctionArgs } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const result = await auth.signIn.email({
      email,
      password,
    });

    if (result?.session) {
      return redirect("/dashboard", {
        headers: {
          "Set-Cookie": await auth.setSessionCookie(result.session),
        },
      });
    }
  } catch (error) {
    return json({ error: "Invalid credentials" }, { status: 400 });
  }
}
```

### 3. Loader for Protected Routes

```typescript
// app/routes/dashboard.ts
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await auth.getSession(request);

  if (!session) {
    throw redirect("/login");
  }

  return json({ user: session.user });
}
```

## SvelteKit Implementation

### 1. Hooks Setup

```typescript
// src/hooks.server.ts
import { auth } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.getSession = async () => {
    return auth.getSession(event.request);
  };

  return resolve(event);
};
```

### 2. Server Load Function

```typescript
// src/routes/dashboard/+page.server.ts
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const session = await event.locals.getSession();

  if (!session) {
    throw redirect(302, "/signin");
  }

  return {
    user: session.user,
  };
};
```

### 3. Client-Side Usage

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  
  let session = $state(null);
  let loading = $state(true);
  
  onMount(async () => {
    if (browser) {
      const res = await fetch("/api/auth/session");
      session = await res.json();
      loading = false;
    }
  });
</script>

{#if loading}
  <p>Loading...</p>
{:else}
  {#if session}
    <p>Welcome, {session.user.name}!</p>
  {:else}
    <p>Please sign in</p>
  {/if}
{/if}
```

## Nuxt.js Implementation

### 1. Server API Endpoint

```typescript
// server/api/auth/[...].ts
import { betterAuth } from "@better-auth/node";

export default defineEventHandler({
  handler: eventHandler(),
  options: {
    prefix: "/api/auth",
  },
});
```

### 2. Authentication Composable

```typescript
// composables/useAuth.ts
export const useAuth = () => {
  const session = useState("session", () => null);

  const signIn = async (email: string, password: string) => {
    const response = await $fetch("/api/auth/signin", {
      method: "POST",
      body: { email, password },
    });

    if (response?.session) {
      session.value = response.session;
    }

    return response;
  };

  const signOut = async () => {
    await $fetch("/api/auth/signout", { method: "POST" });
    session.value = null;
  };

  return {
    session: readonly(session),
    signIn,
    signOut,
  };
};
```

### 3. Middleware for Protected Routes

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async () => {
  const { data: session } = await useFetch("/api/auth/session");

  if (!session.value) {
    return navigateTo("/signin");
  }
});
```

## General Best Practices Across Frameworks

### 1. Environment Configuration

Always use environment variables for sensitive data:

```env
AUTH_SECRET=your-super-secret-jwt-key-here-make-sure-it-is-long
DATABASE_URL=your-database-connection-string
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. Type Safety

Create TypeScript types for better development experience:

```typescript
// types/auth.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}
```

### 3. Error Handling

Implement consistent error handling:

```typescript
// utils/error-handler.ts
export class AuthError extends Error {
  constructor(
    public message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export const handleAuthError = (error: any) => {
  if (error.status === 401) {
    throw new AuthError("Unauthorized", "UNAUTHORIZED", 401);
  } else if (error.status === 403) {
    throw new AuthError("Forbidden", "FORBIDDEN", 403);
  } else {
    throw new AuthError("Authentication Error", "AUTH_ERROR", 500);
  }
};
```

This guide provides implementation examples for various popular frameworks using Better Auth.