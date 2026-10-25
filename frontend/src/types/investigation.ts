/**
 * SignalCheck - Investigation Data & Pipeline Types
 */

export type ClaimStatus = 'supported' | 'contradicted' | 'mixed' | 'unverified';

export interface SourceCitation {
  name: string;
  url: string;
  domain: string;
  tier: 'Primary Data' | 'Official Archive' | 'Peer-Reviewed' | 'Investigative Press' | 'Social Platform';
  date: string;
  reliabilityNote: string;
}

export interface EvidenceDocument {
  id: string;
  type: 'supporting' | 'contradicting' | 'original_claim' | 'timeline' | 'source_audit' | 'open_questions';
  title: string;
  status: ClaimStatus;
  primaryMetricOrDate: string;
  summary: string;
  excerpt: string;
  highlightedText?: string;
  source: SourceCitation;
  reasoning: string;
  limitations: string;
  relevanceScore: number;
}

export interface SubClaim {
  id: string;
  statement: string;
  status: ClaimStatus;
  findingSummary: string;
  sourceCount: number;
}

export interface PresetClaim {
  id: string;
  category: 'Social Media' | 'Science & Health' | 'Corporate & Tech';
  claimText: string;
  sourceOrigin: string;
  previewDossier: {
    subClaims: SubClaim[];
    summary: string;
    verdictDistribution: {
      supported: number;
      contradicted: number;
      unresolved: number;
    };
  };
}

export interface PipelineStage {
  id: 'decompose' | 'retrieve' | 'compare' | 'synthesize';
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  logs: string[];
}

// -----------------------------------------------------------------------------
// Live Backend Response Interface
// -----------------------------------------------------------------------------

export interface BackendSourceRecord {
  id: string;
  title: string;
  url: string;
  domain: string;
  provider: string;
  publicationDate?: string;
  retrievalTimestamp: string;
  snippet: string;
  extractionType: 'snippet' | 'full_page';
  tier: 'Primary Data' | 'Official Archive' | 'Peer-Reviewed' | 'Investigative Press' | 'Social Platform';
  reliabilityNote: string;
  relevanceScore: number;
  stance: 'supports' | 'contradicts' | 'neutral' | 'unresolved';
}

export interface BackendSubClaim {
  id: string;
  statement: string;
  verdict: 'Supported' | 'Contradicted' | 'Unverified' | 'Mixed Evidence';
  findingSummary: string;
  sourceCount: number;
  relevantSourceIds: string[];
}

export interface BackendFactCheckResponse {
  claim: string;
  originalClaim: string;
  language: 'en' | 'hi' | 'other';
  verdict: 'Supported' | 'Contradicted' | 'Mixed Evidence' | 'Unverified';
  summary: string;
  confidence: {
    score: number;
    level: 'High' | 'Medium' | 'Low';
    calibrationNote: string;
  };
  claimBreakdown: BackendSubClaim[];
  supportingEvidence: BackendSourceRecord[];
  contradictingEvidence: BackendSourceRecord[];
  sources: BackendSourceRecord[];
  limitations: string[];
  unresolvedQuestions: string[];
  providerStatus: {
    gemma: { available: boolean; model: string; status: string };
    tavily: { configured: boolean; status: string };
    brave: { configured: boolean; status: string };
    googleFactCheck: { configured: boolean; status: string };
    gdelt: { available: boolean; status: string };
    crossref: { available: boolean; status: string };
    pubmed: { available: boolean; status: string };
    indianGov: { available: boolean; status: string };
    indianFactCheckers: { available: boolean; status: string };
  };
  pipelineLogs: string[];
  timestamp: string;
}

/**
 * Converts live backend sources into EvidenceDocument format expected by EvidenceExplorer
 */
export function convertSourcesToEvidenceDocs(
  sources: BackendSourceRecord[],
  overallVerdict?: string,
  claimSummary?: string
): EvidenceDocument[] {
  if (!sources || sources.length === 0) return [];
  return sources.map((src, index) => {
    let docStatus: ClaimStatus = 'unverified';
    if (src.stance === 'supports') docStatus = 'supported';
    if (src.stance === 'contradicts') docStatus = 'contradicted';

    return {
      id: src.id || `doc-${index + 1}`,
      type: src.stance === 'supports' ? 'supporting' : src.stance === 'contradicts' ? 'contradicting' : 'source_audit',
      title: src.title,
      status: docStatus,
      primaryMetricOrDate: src.publicationDate || new Date().toISOString().slice(0, 10),
      summary: src.snippet.slice(0, 160) + (src.snippet.length > 160 ? '...' : ''),
      excerpt: src.snippet,
      highlightedText: src.snippet.slice(0, 80),
      source: {
        name: src.provider || src.domain,
        url: src.url,
        domain: src.domain,
        tier: src.tier,
        date: src.publicationDate || 'Recent',
        reliabilityNote: src.reliabilityNote,
      },
      reasoning: `Extracted via ${src.provider}. Stance evaluation indicates this source ${src.stance === 'contradicts' ? 'contradicts or debunks' : src.stance === 'supports' ? 'corroborates' : 'discusses'} key elements of the claim.`,
      limitations: 'Record reflects public registry/web publication. Independent verification advised.',
      relevanceScore: src.relevanceScore,
    };
  });
}
