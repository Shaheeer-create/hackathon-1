// Form validation utilities for auth forms

import { z } from 'zod';

// Define signup schema with Zod
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  ),
  softwareSkills: z.string().min(1, 'At least one software skill is required'),
  hardwareExperience: z.string().min(1, 'At least one hardware experience is required'),
});

// Define signin schema with Zod
export const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Define technical background schema
export const technicalBackgroundSchema = z.object({
  softwareSkills: z.array(z.string()).min(1, 'At least one software skill is required'),
  hardwareExperience: z.array(z.string()).min(1, 'At least one hardware experience is required'),
});

// Type inference
// export type SignupFormData = z.infer<typeof signupSchema>;
// export type SigninFormData = z.infer<typeof signinSchema>;
// export type TechnicalBackgroundData = z.infer<typeof technicalBackgroundSchema>;