# Quickstart Guide: Better Auth Integration

## Overview
This guide provides a step-by-step process to implement the Better Auth integration in the Physical AI Books Docusaurus project.

## Prerequisites
- Node.js 18+ installed
- Yarn or npm package manager
- Basic knowledge of React and TypeScript
- Better Auth account and API keys (if needed)

## Step 1: Install Dependencies

First, install the required dependencies in the `physical-ai-books` directory:

```bash
cd physical-ai-books
npm install @better-auth/react @better-auth/node @better-auth/next-js
npm install react-hook-form zod @hookform/resolvers
```

For development dependencies:
```bash
npm install -D @types/react
```

## Step 2: Configure Better Auth

Create an `auth.ts` configuration file in the `src/lib` directory:

```typescript
// src/lib/auth.ts
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
    // Add social providers if needed
  },
  // Extend user schema to include technical background
  user: {
    additionalFields: {
      softwareSkills: {
        type: "string",
        required: false,
      },
      hardwareExperience: {
        type: "string",
        required: false,
      },
    },
  },
});

export const { signIn, signUp, signOut } = nextJs(auth);
```

## Step 3: Create Authentication Context

Create an authentication context to manage the authentication state across the application:

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from "@better-auth/react";
import { User, Session } from '../types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Initialize auth state
  useEffect(() => {
    if (!isPending) {
      setUser(session?.user || null);
      setLoading(false);
    }
  }, [session, isPending]);

  // Implement signIn, signUp, signOut functions
  const signIn = async (email: string, password: string) => {
    // Implementation using Better Auth
  };

  const signUp = async (userData: SignUpData) => {
    // Implementation using Better Auth
  };

  const signOut = async () => {
    // Implementation using Better Auth
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## Step 4: Create Authentication Components

Create the signup and signin forms using React and TypeScript:

```typescript
// src/components/auth/SignupForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';

// Define signup schema with Zod
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  softwareSkills: z.string().array().min(1, 'At least one software skill is required'),
  hardwareExperience: z.string().array().min(1, 'At least one hardware experience is required'),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm: React.FC = () => {
  const { signUp } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signUp(data);
    } catch (error) {
      setError('root', { message: (error as Error).message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          {...register('name')}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div>
        <label htmlFor="softwareSkills">Software Skills</label>
        <input
          id="softwareSkills"
          {...register('softwareSkills')}
          className={errors.softwareSkills ? 'error' : ''}
        />
        {errors.softwareSkills && <span>{errors.softwareSkills.message}</span>}
      </div>

      <div>
        <label htmlFor="hardwareExperience">Hardware Experience</label>
        <input
          id="hardwareExperience"
          {...register('hardwareExperience')}
          className={errors.hardwareExperience ? 'error' : ''}
        />
        {errors.hardwareExperience && <span>{errors.hardwareExperience.message}</span>}
      </div>

      {errors.root && <div className="error">{errors.root.message}</div>}
      
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
```

```typescript
// src/components/auth/SigninForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';

// Define signin schema with Zod
const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SigninFormData = z.infer<typeof signinSchema>;

const SigninForm: React.FC = () => {
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninFormData) => {
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      setError('root', { message: (error as Error).message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      {errors.root && <div className="error">{errors.root.message}</div>}
      
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SigninForm;
```

## Step 5: Create Protected Route Component

Create a component to protect routes that require authentication:

```typescript
// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom'; // or your routing solution

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <div>Redirecting...</div>, 
  requiredRole 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to signin page if not authenticated
    return <Navigate to="/signin" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Handle role-based access if needed
    return <div>Access denied</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

## Step 6: Update Docusaurus Configuration

Update the Docusaurus configuration to include authentication routes:

```typescript
// docusaurus.config.ts
import { auth } from './src/lib/auth'; // Import the auth configuration

const config: Config = {
  // ... existing configuration
  plugins: [
    // ... existing plugins
    // Add any auth-related plugins if needed
  ],
  themes: [
    // ... existing themes
  ],
  // Add custom configuration for auth routes if needed
};

export default config;
```

## Step 7: Create Authentication Pages

Create the signup and signin pages in the Docusaurus pages directory:

```typescript
// src/pages/signup.tsx
import React from 'react';
import Layout from '@theme/Layout';
import SignupForm from '../components/auth/SignupForm';

const SignupPage: React.FC = () => {
  return (
    <Layout title="Sign Up" description="Create your account">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <h1>Sign Up</h1>
            <SignupForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;
```

```typescript
// src/pages/signin.tsx
import React from 'react';
import Layout from '@theme/Layout';
import SigninForm from '../components/auth/SigninForm';

const SigninPage: React.FC = () => {
  return (
    <Layout title="Sign In" description="Sign in to your account">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <h1>Sign In</h1>
            <SigninForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SigninPage;
```

## Step 8: Wrap Application with Auth Provider

Update the Docusaurus application to use the authentication context:

```typescript
// src/theme/Layout/index.tsx (or in a custom App wrapper)
import React from 'react';
import { AuthProvider } from '../../contexts/AuthContext';
import OriginalLayout from '@theme-original/Layout';

export default function Layout(props) {
  return (
    <AuthProvider>
      <OriginalLayout {...props} />
    </AuthProvider>
  );
}
```

## Step 9: Testing

To test the authentication system:

1. Run the development server:
```bash
npm run start
```

2. Navigate to `/signup` to create a new account
3. Navigate to `/signin` to sign in with an existing account
4. Access protected routes to verify authentication

## Environment Variables

Add these environment variables to your `.env` file:

```env
AUTH_SECRET=your-super-secret-jwt-key-here-make-sure-it-is-long
DATABASE_URL=file:./db.sqlite  # or your database connection string
```

## Troubleshooting

### Common Issues:

1. **Session not persisting**: Ensure your AUTH_SECRET is consistent across deployments
2. **Database connection errors**: Verify your DATABASE_URL is correctly formatted
3. **TypeScript errors**: Ensure all type definitions are properly imported

### Debugging:

1. Check browser console for client-side errors
2. Check server logs for API errors
3. Verify environment variables are properly set