# API Contract: Better Auth Integration

## Overview
This document defines the API contracts for the Better Auth integration in the Physical AI Books project. The authentication system provides secure signup, signin, and session management functionality.

## Authentication Endpoints

### POST /api/auth/signup
Creates a new user account with technical background information.

#### Request
```json
{
  "name": "string (required, 2-50 characters)",
  "email": "string (required, valid email format)",
  "password": "string (required, minimum 8 characters with complexity)",
  "softwareSkills": ["string", ...],
  "hardwareExperience": ["string", ...]
}
```

#### Response - 201 Created
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "emailVerified": "boolean | null",
    "createdAt": "ISO date string"
  },
  "session": {
    "id": "string",
    "expiresAt": "ISO date string"
  },
  "redirectUrl": "/dashboard"
}
```

#### Response - 400 Bad Request
```json
{
  "success": false,
  "error": "string (validation error message)",
  "field": "string (field that caused the error)"
}
```

#### Response - 409 Conflict
```json
{
  "success": false,
  "error": "Email already exists"
}
```

### POST /api/auth/signin
Authenticates an existing user.

#### Request
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Response - 200 OK
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "emailVerified": "boolean | null"
  },
  "session": {
    "id": "string",
    "expiresAt": "ISO date string"
  },
  "redirectUrl": "/dashboard"
}
```

#### Response - 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

### POST /api/auth/signout
Terminates the current user session.

#### Request
```json
{
  "sessionId": "string (required)"
}
```

#### Response - 200 OK
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

### GET /api/auth/session
Retrieves the current user session information.

#### Response - 200 OK
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "emailVerified": "boolean | null"
  },
  "session": {
    "id": "string",
    "expiresAt": "ISO date string"
  },
  "technicalBackground": {
    "softwareSkills": ["string", ...],
    "hardwareExperience": ["string", ...]
  }
}
```

#### Response - 401 Unauthorized
```json
{
  "error": "No active session"
}
```

### PUT /api/auth/user/technical-background
Updates the user's technical background information.

#### Request
```json
{
  "softwareSkills": ["string", ...],
  "hardwareExperience": ["string", ...]
}
```

#### Response - 200 OK
```json
{
  "success": true,
  "technicalBackground": {
    "softwareSkills": ["string", ...],
    "hardwareExperience": ["string", ...],
    "updatedAt": "ISO date string"
  }
}
```

#### Response - 400 Bad Request
```json
{
  "success": false,
  "error": "string (validation error message)"
}
```

## Client-Side Components API

### SignupForm Component
Renders a signup form with validation.

#### Props
```typescript
interface SignupFormProps {
  onSuccess?: (user: User, session: Session) => void;
  onError?: (error: string) => void;
  redirectUrl?: string;
}
```

#### Events
- `onSubmit`: Triggered when form is submitted
- `onSuccess`: Triggered when signup is successful
- `onError`: Triggered when signup fails

### SigninForm Component
Renders a signin form with validation.

#### Props
```typescript
interface SigninFormProps {
  onSuccess?: (user: User, session: Session) => void;
  onError?: (error: string) => void;
  redirectUrl?: string;
}
```

#### Events
- `onSubmit`: Triggered when form is submitted
- `onSuccess`: Triggered when signin is successful
- `onError`: Triggered when signin fails

### ProtectedRoute Component
Renders content only for authenticated users.

#### Props
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: string;
}
```

### useAuth Hook
Provides authentication state and methods.

#### Return Value
```typescript
interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  technicalBackground: TechnicalBackground | null;
  isLoading: boolean;
  signUp: (credentials: SignUpCredentials) => Promise<AuthResult>;
  signIn: (credentials: SignInCredentials) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateTechnicalBackground: (data: TechnicalBackgroundInput) => Promise<UpdateResult>;
}
```

## Error Handling

### Standard Error Format
```json
{
  "error": {
    "type": "string (error type)",
    "message": "string (user-friendly message)",
    "details": "object (optional technical details)"
  }
}
```

### Common Error Types
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Signin credentials invalid
- `AUTHORIZATION_ERROR`: User not authorized for action
- `RESOURCE_ERROR`: Requested resource not found
- `SERVER_ERROR`: Internal server error