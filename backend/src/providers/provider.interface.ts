import { SourceTier } from '../schemas/factCheck.schema.js';

export interface RawEvidenceItem {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  publishedDate?: string;
  provider: string;
  tier: SourceTier;
  sourceType: 'general_web' | 'news' | 'fact_check' | 'academic' | 'indian_gov' | 'indian_fact_checker';
  publisher?: string;
  originalVerdict?: string;
  rawMetadata?: Record<string, unknown>;
}

export interface SearchOptions {
  timeoutMs?: number;
  maxResults?: number;
  language?: string;
  category?: 'general' | 'health' | 'science' | 'government' | 'finance' | 'elections';
}

export interface EvidenceProvider {
  readonly name: string;
  isConfigured(): boolean;
  search(query: string, options?: SearchOptions): Promise<RawEvidenceItem[]>;
}
