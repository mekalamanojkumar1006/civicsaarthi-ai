/**
 * Application-wide configuration constants.
 * Never put secrets or API keys here — use environment variables.
 */
export const APP_CONFIG = {
  name: "CivicSaarthi AI",
  tagline: "Your AI-Powered Government Scheme Guide",
  description:
    "Discover, verify eligibility, and apply for Indian Government schemes with AI assistance.",
  version: "1.0.0",
  locale: "en-IN",
  defaultLanguage: "en",
  supportedLanguages: ["en", "hi", "te", "ta", "kn", "ml", "mr", "bn", "gu"],
  contactEmail: "support@civicsaarthi.in",
  githubUrl: "https://github.com/civicsaarthi",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  SCHEMES: "/schemes",
  ELIGIBILITY: "/eligibility",
  DOCUMENT_ASSISTANT: "/document-assistant",
  ASSISTANT: "/assistant",
  DOCUMENTS: "/documents",
  COMPARE: "/compare",
  SAVED: "/saved",
  PROFILE: "/profile",
} as const;

export const API_CONFIG = {
  // Supabase — set via .env, never hardcoded
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
  // Google Gemini — set via .env, never hardcoded
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY ?? "",
} as const;

export const DESIGN_TOKENS = {
  colors: {
    primary: "#142B4A",
    secondary: "#0F8B8D",
    background: "#F5F7FA",
    accent: "#F2A541",
  },
} as const;
