/**
 * Shared TypeScript types for CivicSaarthi AI.
 * Keep domain types here and import them across the codebase.
 */

// ─── User & Auth ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  state?: string;
  district?: string;
  preferredLanguage?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Scheme ──────────────────────────────────────────────────────────────────

export type SchemeCategory =
  | "agriculture"
  | "education"
  | "health"
  | "housing"
  | "employment"
  | "women"
  | "child"
  | "senior"
  | "disability"
  | "financial"
  | "skill"
  | "social";

export type SchemeLevel = "central" | "state" | "district";

export type SchemeStatus = "active" | "upcoming" | "closed" | "archived";

export interface Scheme {
  id: string;
  title: string;
  titleHindi?: string;
  description: string;
  category: SchemeCategory;
  level: SchemeLevel;
  status: SchemeStatus;
  ministry?: string;
  state?: string;
  launchDate?: string;
  deadline?: string;
  benefitAmount?: string;
  benefitType?: string;
  eligibility: EligibilityCriteria;
  requiredDocuments: string[];
  applicationUrl?: string;
  officialUrl?: string;
  tags: string[];
  viewCount?: number;
  savedCount?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EligibilityCriteria {
  minAge?: number;
  maxAge?: number;
  gender?: "male" | "female" | "other" | "all";
  incomeLimit?: number;
  caste?: string[];
  occupation?: string[];
  state?: string[];
  otherCriteria?: string[];
}

// ─── Eligibility Check ───────────────────────────────────────────────────────

export interface UserProfile {
  age?: number;
  gender?: string;
  state?: string;
  district?: string;
  annualIncome?: number;
  caste?: string;
  occupation?: string;
  education?: string;
  maritalStatus?: string;
  hasDisability?: boolean;
  isMinority?: boolean;
  isFarmer?: boolean;
  hasBPLCard?: boolean;
  hasAadhar?: boolean;
  hasBankAccount?: boolean;
}

export interface EligibilityResult {
  schemeId: string;
  scheme: Scheme;
  isEligible: boolean;
  score: number; // 0-100
  matchedCriteria: string[];
  missedCriteria: string[];
  notes?: string;
}

// ─── Assistant ───────────────────────────────────────────────────────────────

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isLoading?: boolean;
  metadata?: {
    schemesReferenced?: string[];
    language?: string;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// ─── Documents ───────────────────────────────────────────────────────────────

export type DocumentType =
  | "aadhar"
  | "pan"
  | "income_certificate"
  | "caste_certificate"
  | "residence_proof"
  | "bank_passbook"
  | "photo"
  | "other";

export interface Document {
  id: string;
  userId: string;
  type: DocumentType;
  name: string;
  url: string;
  status: "pending" | "verified" | "rejected";
  uploadedAt: string;
}

// ─── UI State ────────────────────────────────────────────────────────────────

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
}

export interface PageMeta {
  title: string;
  description?: string;
}
