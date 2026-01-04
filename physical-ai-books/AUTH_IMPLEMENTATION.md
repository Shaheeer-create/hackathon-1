# Better Auth Implementation

This document describes the Better Auth implementation for the Physical AI Books Docusaurus project.

## Overview

The authentication system provides secure signup and signin functionality with personalization based on user's technical background. It includes:

- Signup form collecting name, email, password, software skills, and hardware experience
- Signin form with email and password validation
- Integration with Better Auth SDK for secure authentication
- Storage of user technical background for personalization
- Protected routes and session management
- Error handling and validation

## Components

### AuthContext
The `AuthContext` provides authentication state management across the application. It includes:

- `user`: Current user information
- `session`: Current session information
- `technicalBackground`: User's technical background information
- `signUp`: Function to register a new user
- `signIn`: Function to authenticate an existing user
- `signOut`: Function to terminate the current session
- `updateTechnicalBackground`: Function to update user's technical background

### Auth Components

#### SignupForm
A form component that allows new users to create an account with their personal information and technical background.

#### SigninForm
A form component that allows existing users to authenticate with their credentials.

#### ProtectedRoute
A component that renders content only for authenticated users.

#### UserProfile
A component that displays user information and technical background.

#### SignOutButton
A button component that allows users to sign out of their session.

## Usage

### Wrapping the Application

The application needs to be wrapped with the `AuthProvider` to make authentication context available:

```jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your application components */}
    </AuthProvider>
  );
}
```

### Accessing Auth State

Use the `useAuth` hook to access authentication state and functions:

```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, signIn, signUp, signOut } = useAuth();
  
  // Use auth functions and state
}
```

### Protecting Routes

Use the `ProtectedRoute` component to restrict access to authenticated users:

```jsx
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
```

## Environment Variables

The following environment variables need to be configured:

- `AUTH_SECRET`: Secret key for JWT tokens
- `DATABASE_URL`: Database connection string

## API Endpoints

The implementation uses Better Auth's built-in API endpoints for authentication. No additional API routes are required.

## Security Considerations

- Passwords are securely hashed by Better Auth
- Sessions are managed securely with appropriate expiration
- CSRF protection is implemented by Better Auth
- Input validation is performed on both client and server