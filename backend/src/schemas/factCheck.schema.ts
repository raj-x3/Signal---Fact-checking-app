import { z } from 'zod';

export const ClaimStatusEnum = z.enum([
  'Supported',
  'Contradicted',
  'Mixed Evidence',
  'Unverified',
]);
export type ClaimVerdict = z.infer<typeof ClaimStatusEnum>;

export const SourceTierEnum = z.enum([
  'Primary Data',
  'Official Archive',
  'Peer-Reviewed',
  'Investigative Press',
  'Social Platform',
]);
export type SourceTier = z.infer<typeof SourceTierEnum>;

export const SourceStanceEnum = z.enum(['supports', 'contradicts', 'neutral', 'unresolved']);
export type SourceStance = z.infer<typeof SourceStanceEnum>;

// Source Citation Schema
export const SourceRecordSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  domain: z.string(),
  provider: z.string(),
  publicationDate: z.string().optional(),
  retrievalTimestamp: z.string(),
  snippet: z.string(),
  extractionType: z.enum(['snippet', 'full_page']),
  tier: SourceTierEnum,
  reliabilityNote: z.string(),
  relevanceScore: z.number().min(0).max(1),
  stance: SourceStanceEnum,
  relatedSubClaimId: z.string().optional(),
});
export type SourceRecord = z.infer<typeof SourceRecordSchema>;

// Decomposed SubClaim Schema
export const SubClaimSchema = z.object({
  id: z.string(),
  statement: z.string(),
  verdict: z.enum(['Supported', 'Contradicted', 'Unverified', 'Mixed Evidence']),
  findingSummary: z.string(),
  sourceCount: z.number().default(0),
  relevantSourceIds: z.array(z.string()).default([]),
});
export type DecomposedSubClaim = z.infer<typeof SubClaimSchema>;

// Confidence Schema (with mandatory calibration caveat)
export const ConfidenceScoreSchema = z.object({
  score: z.number().min(0).max(1),
  level: z.enum(['High', 'Medium', 'Low']),
  calibrationNote: z.string(),
});
export type ConfidenceScore = z.infer<typeof ConfidenceScoreSchema>;

// Provider Status Record
export const ProviderStatusSchema = z.object({
  gemma: z.object({
    available: z.boolean(),
    model: z.string(),
    status: z.enum(['active', 'fallback', 'disabled', 'error']),
  }),
  tavily: z.object({
    configured: z.boolean(),
    status: z.enum(['active', 'disabled', 'error']),
  }),
  brave: z.object({
    configured: z.boolean(),
    status: z.enum(['active', 'disabled', 'error']),
  }),
  googleFactCheck: z.object({
    configured: z.boolean(),
    status: z.enum(['active', 'disabled', 'error']),
  }),
  gdelt: z.object({
    available: z.boolean(),
    status: z.enum(['active', 'fallback', 'error']),
  }),
  crossref: z.object({
    available: z.boolean(),
    status: z.enum(['active', 'disabled', 'error']),
  }),
  pubmed: z.object({
    available: z.boolean(),
    status: z.enum(['active', 'disabled', 'error']),
  }),
  indianGov: z.object({
    available: z.boolean(),
    status: z.enum(['active', 'disabled', 'error']),
  }),
  indianFactCheckers: z.object({
    available: z.boolean(),
    status: z.enum(['active', 'disabled', 'error']),
  }),
});
export type ProviderStatus = z.infer<typeof ProviderStatusSchema>;

// Fact Check Request Schema
export const FactCheckRequestSchema = z.object({
  claim: z.string().min(3, 'Claim must be at least 3 characters long').max(1000, 'Claim exceeds 1000 character limit'),
  language: z.enum(['en', 'hi', 'auto']).default('auto'),
  context: z.string().optional(),
});
export type FactCheckRequest = z.infer<typeof FactCheckRequestSchema>;

// Fact Check Response Schema
export const FactCheckResponseSchema = z.object({
  claim: z.string(),
  originalClaim: z.string(),
  language: z.enum(['en', 'hi', 'other']),
  verdict: ClaimStatusEnum,
  summary: z.string(),
  confidence: ConfidenceScoreSchema,
  claimBreakdown: z.array(SubClaimSchema),
  supportingEvidence: z.array(SourceRecordSchema),
  contradictingEvidence: z.array(SourceRecordSchema),
  sources: z.array(SourceRecordSchema),
  limitations: z.array(z.string()),
  unresolvedQuestions: z.array(z.string()),
  providerStatus: ProviderStatusSchema,
  pipelineLogs: z.array(z.string()),
  timestamp: z.string(),
});
export type FactCheckResponse = z.infer<typeof FactCheckResponseSchema>;
