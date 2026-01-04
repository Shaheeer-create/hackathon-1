// src/utils/env.ts
// Utility to safely access environment variables in both Node.js and browser environments

export function getEnvVar(name: string, defaultValue?: string): string {
  // Check for environment variable in browser context first (prefixed with REACT_APP_)
  if (typeof window !== 'undefined') {
    const browserEnvName = `REACT_APP_${name}`;
    // @ts-ignore - accessing dynamic property on window
    const browserValue = window[browserEnvName];
    if (browserValue) {
      return browserValue;
    }
  }

  // Check for environment variable in Node.js context (build time)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name] || defaultValue || '';
  }

  // Return default value if no environment variable is found
  return defaultValue || '';
}