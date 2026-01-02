# Better Auth Advanced Implementation Guide

## Customizing User Schema

Better Auth allows you to extend the default user schema with custom fields:

```typescript
import { betterAuth } from "@better-auth/node";

export const auth = betterAuth({
  // ... other config
  user: {
    // Add custom fields to the user schema
    additionalFields: {
      avatar: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
  },
});
```

## Password Validation

Implement custom password validation:

```typescript
import { betterAuth } from "@better-auth/node";

export const auth = betterAuth({
  // ... other config
  emailAndPassword: {
    enabled: true,
    passwordValidation: {
      // Custom password validation function
      validate: (password: string) => {
        // At least 8 characters, one uppercase, one lowercase, one number
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return regex.test(password);
      },
      errorMessage: "Password must be at least 8 characters with uppercase, lowercase, and number",
    },
  },
});
```

## Middleware for Route Protection

Create middleware to protect routes in Next.js:

```typescript
// middleware.ts
import { auth } from "@/lib/auth";
import { betterAuth } from "@better-auth/node";

export default auth.$middleware({
  matcher: ["/dashboard/:path*", "/api/protected/:path*"], // Protect these routes
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
```

## Role-Based Access Control

Implement role-based access control:

```typescript
// components/ProtectedRoute.tsx
import { useSession } from "@better-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Optional role requirement
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    } else if (session && requiredRole && session.user.role !== requiredRole) {
      router.push("/unauthorized"); // Redirect to unauthorized page
    }
  }, [session, isPending, router, requiredRole]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  if (requiredRole && session.user.role !== requiredRole) {
    return <div>You don't have permission to access this resource</div>;
  }

  return <>{children}</>;
}
```

## Email Templates

Customize email templates for password reset, verification, etc.:

```typescript
import { betterAuth } from "@better-auth/node";

export const auth = betterAuth({
  // ... other config
  emailVerification: {
    enabled: true,
    sendOnSignUp: true,
    subject: "Verify your email address",
    emailTemplate: {
      html: (params) => `
        <div>
          <h1>Verify your email</h1>
          <p>Click the link below to verify your email address:</p>
          <a href="${params.url}">Verify Email</a>
        </div>
      `,
      text: (params) => `Verify your email by clicking: ${params.url}`,
    },
  },
});
```

## Session Configuration

Configure session behavior:

```typescript
import { betterAuth } from "@better-auth/node";

export const auth = betterAuth({
  // ... other config
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    updateAge: 24 * 60 * 60, // Update session every 24 hours
    generateSessionToken: () => crypto.randomUUID(), // Custom session token generation
    sendOnEveryRequest: false, // Only send session when needed
  },
});
```

## Hooks for Custom Logic

Use hooks to add custom logic during authentication events:

```typescript
import { betterAuth } from "@better-auth/node";

export const auth = betterAuth({
  // ... other config
  hooks: {
    createUser: [
      {
        // Called after a user is created
        sync: (user) => {
          // Send welcome email
          console.log(`Welcome ${user.name} (${user.email})!`);
          // Add to mailing list, etc.
        },
      },
    ],
    sessionCreated: [
      {
        // Called when a session is created
        sync: (session) => {
          // Log user login
          console.log(`User ${session.userId} logged in`);
          // Update last login time in database
        },
      },
    ],
  },
});
```

## Database Migration

For database setup and migrations:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/auth.ts", // Path to your auth config
  out: "./drizzle",
  dialect: "sqlite", // or "postgresql" or "mysql"
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Error Handling Best Practices

```typescript
// utils/auth-error-handler.ts
export function handleAuthError(error: any) {
  if (error?.status === 401) {
    // Unauthorized - redirect to sign in
    window.location.href = "/signin";
  } else if (error?.status === 403) {
    // Forbidden - show access denied message
    console.error("Access denied");
  } else if (error?.status === 429) {
    // Rate limited
    console.error("Too many requests. Please try again later.");
  } else {
    // General error
    console.error("An authentication error occurred:", error);
  }
}
```

## Performance Optimization

For better performance, consider:

1. Caching session data appropriately
2. Using CDN for static assets
3. Optimizing database queries
4. Implementing proper loading states in UI

## Security Best Practices

1. Always use HTTPS in production
2. Regularly rotate secrets
3. Implement proper input validation
4. Use secure, HttpOnly cookies
5. Implement CSRF protection
6. Regular security audits

This guide provides advanced implementation patterns for Better Auth to create a robust authentication system.