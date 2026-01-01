# Better Auth Signup and Signin Implementation

## Overview
This skill provides guidance for implementing user signup and signin functionality using Better Auth (https://www.better-auth.com/), a full-featured authentication library for modern web applications.

## Prerequisites
- Node.js application
- TypeScript (recommended)
- React/Next.js or other modern framework

## Installation
```bash
npm install @better-auth/react @better-auth/node
# For Next.js specifically:
npm install @better-auth/next-js
```

## Configuration

### 1. Create Auth Configuration
Create an `auth.ts` file in your project:

```typescript
import { betterAuth } from "@better-auth/node";
import { nextJs } from "@better-auth/next-js";

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET || "your-secret-key-here",
  database: {
    provider: "sqlite", // or "postgresql", "mysql"
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true if you want email verification
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});

export const { signIn, signUp, signOut } = nextJs(auth);
```

### 2. Environment Variables
Add these to your `.env` file:

```env
AUTH_SECRET=your-super-secret-jwt-key-here-make-sure-it-is-long
DATABASE_URL=file:./db.sqlite
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Implementation

### 1. Signup Component
Create a signup form component:

```tsx
"use client";

import { useState } from "react";
import { useSignUp } from "@better-auth/react";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { signUp, isPending } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp({
      email,
      password,
      name,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </div>
      <button type="submit" disabled={isPending}>
        {isPending ? "Signing up..." : "Sign up"}
      </button>
    </form>
  );
}
```

### 2. Signin Component
Create a signin form component:

```tsx
"use client";

import { useState } from "react";
import { useSignIn } from "@better-auth/react";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isPending } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn({
      email,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
```

### 3. Protected Route Component
Create a component to handle protected routes:

```tsx
"use client";

import { useSession } from "@better-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
```

### 4. API Routes (for Next.js)
Create API routes for authentication:

```typescript
// app/api/auth/[...auth].ts
import { auth } from "@/lib/auth";
import { betterAuth } from "@better-auth/node";

export const { GET, POST } = auth;
```

## Social Login Implementation

### Google Login
```tsx
import { useSignIn } from "@better-auth/react";

export function GoogleSignInButton() {
  const { signIn } = useSignIn();

  const handleGoogleSignIn = () => {
    signIn.social({
      provider: "google",
      callbackURL: "/dashboard", // Redirect after login
    });
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  );
}
```

### GitHub Login
```tsx
import { useSignIn } from "@better-auth/react";

export function GitHubSignInButton() {
  const { signIn } = useSignIn();

  const handleGitHubSignIn = () => {
    signIn.social({
      provider: "github",
      callbackURL: "/dashboard", // Redirect after login
    });
  };

  return (
    <button onClick={handleGitHubSignIn}>
      Sign in with GitHub
    </button>
  );
}
```

## Session Management

### Check Session Status
```tsx
import { useSession } from "@better-auth/react";

export function UserProfile() {
  const { session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;

  if (!session) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <p>Welcome, {session.user.name}</p>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

### Sign Out
```tsx
import { useSignOut } from "@better-auth/react";

export function SignOutButton() {
  const { signOut } = useSignOut();

  return (
    <button onClick={() => signOut()}>
      Sign out
    </button>
  );
}
```

## Error Handling
Better Auth provides error handling for common authentication issues:

```tsx
import { useState } from "react";
import { useSignUp } from "@better-auth/react";

export function SignUpFormWithErrorHandling() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { signUp, isPending } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const result = await signUp({
        email,
        password,
        name,
      });
      
      if (result?.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* Form fields as before */}
    </form>
  );
}
```

## Security Considerations
- Always use HTTPS in production
- Store secrets in environment variables
- Validate user input on both client and server
- Implement rate limiting for authentication endpoints
- Use strong passwords (minimum 8 characters)
- Consider enabling two-factor authentication for sensitive applications

## Testing
For testing authentication flows, consider using:
- Jest for unit tests
- Playwright or Cypress for end-to-end tests
- Mock authentication services during testing

This implementation provides a complete authentication system with signup, signin, social login, and session management using Better Auth.