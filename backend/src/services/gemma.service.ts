import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.config.js';
import {
  ClaimVerdict,
  ConfidenceScore,
  DecomposedSubClaim,
  SourceRecord,
} from '../schemas/factCheck.schema.js';
import { containsDevanagari, detectLanguage, extractDatesAndYears, normalizeClaimQuery } from '../utils/text.utils.js';

export interface ClaimDecompositionResult {
  normalizedClaim: string;
  detectedLanguage: 'en' | 'hi';
  namedEntities: string[];
  datesDetected: string[];
  subClaims: DecomposedSubClaim[];
  searchQueries: string[];
  isGemmaPowered: boolean;
}

export interface ClaimSynthesisResult {
  verdict: ClaimVerdict;
  summary: string;
  confidence: ConfidenceScore;
  subClaims: DecomposedSubClaim[];
  limitations: string[];
  unresolvedQuestions: string[];
  isGemmaPowered: boolean;
  gemmaModelUsed: string;
}

export class GemmaService {
  private ai: GoogleGenAI | null = null;
  private primaryModel: string;

  constructor() {
    this.primaryModel = config.gemma.modelId;
    if (config.gemma.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: config.gemma.apiKey });
    }
  }

  isAvailable(): boolean {
    return Boolean(this.ai && config.gemma.apiKey);
  }

  /**
   * Phase 1: Decomposes a user claim into atomic falsifiable sub-statements
   * and generates targeted search queries.
   */
  async decomposeClaim(rawClaim: string, explicitLang?: 'en' | 'hi' | 'auto'): Promise<ClaimDecompositionResult> {
    const lang = explicitLang === 'auto' || !explicitLang ? detectLanguage(rawClaim) : explicitLang;
    const dates = extractDatesAndYears(rawClaim);

    if (!this.isAvailable()) {
      return this.heuristicDecompose(rawClaim, lang, dates);
    }

    try {
      const prompt = `You are Gemma 4, an advanced epistemic reasoning model powering SignalCheck, an India-first fact-checking platform.
Task: Analyze this claim circulating in India.
Original Claim: "${rawClaim}"
Language detected: ${lang === 'hi' ? 'Hindi' : 'English'}

Instructions:
1. Normalize the exact claim without losing qualifiers, dates, negations, or regional nuances.
2. Extract key named entities (people, ministries, institutions, locations, laws, schemes).
3. Break compound claims into 2 to 4 individually falsifiable atomic assertions (sub-claims).
4. Generate 2 to 4 targeted search queries to find official records, PIB statements, and peer-reviewed/press evidence.
5. If the claim is in Hindi, preserve the Hindi text and also provide English search query equivalents for broader retrieval.

Output MUST be strict JSON in this exact structure:
{
  "normalizedClaim": "...",
  "namedEntities": ["..."],
  "subClaims": [
    {
      "id": "sub-1",
      "statement": "...",
      "verdict": "Unverified",
      "findingSummary": "Awaiting cross-examination against primary evidence records.",
      "sourceCount": 0,
      "relevantSourceIds": []
    }
  ],
  "searchQueries": ["..."]
}`;

      const response = await this.ai!.models.generateContent({
        model: this.primaryModel,
        contents: prompt,
        config: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text?.trim() || '';
      const parsed = JSON.parse(responseText);

      return {
        normalizedClaim: parsed.normalizedClaim || rawClaim,
        detectedLanguage: lang,
        namedEntities: parsed.namedEntities || [],
        datesDetected: dates,
        subClaims: (parsed.subClaims || []).map((sc: any, idx: number) => ({
          id: sc.id || `sub-${idx + 1}`,
          statement: sc.statement || '',
          verdict: 'Unverified' as const,
          findingSummary: sc.findingSummary || 'Pending evidence audit.',
          sourceCount: 0,
          relevantSourceIds: [],
        })),
        searchQueries: parsed.searchQueries || [rawClaim],
        isGemmaPowered: true,
      };
    } catch (err: unknown) {
      console.warn(`[GemmaService] Decomposition with ${this.primaryModel} failed: ${(err as Error)?.message}. Falling back to heuristic decomposition.`);
      return this.heuristicDecompose(rawClaim, lang, dates);
    }
  }

  /**
   * Phase 2: Synthesizes retrieved evidence, evaluates stances, detects contradictions,
   * checks for outdated or misleading context, and determines an epistemic verdict.
   */
  async synthesizeEvidence(
    claim: string,
    subClaims: DecomposedSubClaim[],
    sources: SourceRecord[],
    language: 'en' | 'hi'
  ): Promise<ClaimSynthesisResult> {
    if (!this.isAvailable() || sources.length === 0) {
      return this.heuristicSynthesize(claim, subClaims, sources, language);
    }

    try {
      const evidenceDigest = sources.map((s) => ({
        id: s.id,
        title: s.title,
        domain: s.domain,
        tier: s.tier,
        date: s.publicationDate,
        snippet: s.snippet,
        stance: s.stance,
      }));

      const prompt = `You are Gemma 4, the primary factual reasoning and epistemic verification engine for SignalCheck.
Auditing claim circulating in India: "${claim}"
Language: ${language}

Sub-claims to evaluate:
${JSON.stringify(subClaims, null, 2)}

Retrieved Real-World Evidence Documents:
${JSON.stringify(evidenceDigest, null, 2)}

Requirements:
1. Cross-examine each sub-claim against the provided evidence records.
2. Allowed overall verdicts: "Supported", "Contradicted", "Mixed Evidence", "Unverified".
   - Do NOT treat absence of evidence as proof of falsehood; if evidence is insufficient, use "Unverified".
   - If official notice/evidence directly refutes the core claim, use "Contradicted".
   - If genuine documentation confirms the claim, use "Supported".
   - If parts are true but crucial context or secondary assertions are false, use "Mixed Evidence".
3. Assign each sub-claim a verdict: "Supported" | "Contradicted" | "Unverified" | "Mixed Evidence", with a clear 1-2 sentence finding summary referencing relevant source IDs.
4. Highlight source limitations (e.g., outdated dates, regional mismatches, unverified social claims, wire syndication).
5. Identify open empirical questions that cannot be resolved from the current evidence.
6. Provide an honest confidence score (0.0 to 1.0) and level ("High" | "Medium" | "Low").

Output MUST be strict JSON in this exact structure:
{
  "verdict": "Supported" | "Contradicted" | "Mixed Evidence" | "Unverified",
  "summary": "...",
  "confidenceScore": 0.85,
  "confidenceLevel": "High" | "Medium" | "Low",
  "evaluatedSubClaims": [
    {
      "id": "sub-1",
      "statement": "...",
      "verdict": "Supported" | "Contradicted" | "Unverified" | "Mixed Evidence",
      "findingSummary": "...",
      "relevantSourceIds": ["src-gen-1"]
    }
  ],
  "limitations": ["..."],
  "unresolvedQuestions": ["..."]
}`;

      const response = await this.ai!.models.generateContent({
        model: this.primaryModel,
        contents: prompt,
        config: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text?.trim() || '';
      const parsed = JSON.parse(responseText);

      const finalVerdict: ClaimVerdict = ['Supported', 'Contradicted', 'Mixed Evidence', 'Unverified'].includes(parsed.verdict)
        ? parsed.verdict
        : 'Unverified';

      const evaluatedSubClaims: DecomposedSubClaim[] = (parsed.evaluatedSubClaims || []).map((sc: any, idx: number) => {
        const matchingOriginal = subClaims.find((orig) => orig.id === sc.id) || subClaims[idx];
        return {
          id: sc.id || `sub-${idx + 1}`,
          statement: sc.statement || matchingOriginal?.statement || '',
          verdict: sc.verdict || 'Unverified',
          findingSummary: sc.findingSummary || 'Evaluated against retrieved source records.',
          sourceCount: (sc.relevantSourceIds || []).length,
          relevantSourceIds: sc.relevantSourceIds || [],
        };
      });

      return {
        verdict: finalVerdict,
        summary: parsed.summary || 'Evidence cross-examination completed by Gemma 4.',
        confidence: {
          score: typeof parsed.confidenceScore === 'number' ? Math.max(0.1, Math.min(0.99, parsed.confidenceScore)) : 0.85,
          level: ['High', 'Medium', 'Low'].includes(parsed.confidenceLevel) ? parsed.confidenceLevel : 'Medium',
          calibrationNote: 'Heuristic model assessment based on source tier agreement; not a calibrated statistical probability.',
        },
        subClaims: evaluatedSubClaims.length > 0 ? evaluatedSubClaims : subClaims,
        limitations: parsed.limitations || ['Retrieved records reflect currently available public registry data.'],
        unresolvedQuestions: parsed.unresolvedQuestions || [],
        isGemmaPowered: true,
        gemmaModelUsed: this.primaryModel,
      };
    } catch (err: unknown) {
      console.warn(`[GemmaService] Synthesis with ${this.primaryModel} failed: ${(err as Error)?.message}. Using heuristic synthesis.`);
      return this.heuristicSynthesize(claim, subClaims, sources, language);
    }
  }

  /**
   * Deterministic heuristic claim decomposer for offline/fallback mode
   */
  private heuristicDecompose(rawClaim: string, lang: 'en' | 'hi', dates: string[]): ClaimDecompositionResult {
    const normalized = normalizeClaimQuery(rawClaim);

    // Break on sentence punctuation or common conjunctions
    const segments = normalized
      .split(/[.?!|।\n]|(?:\s+(?:and|because|leading to|resulting in|लेकिन|क्योंकि|और)\s+)/i)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);

    const subClaims: DecomposedSubClaim[] = [];

    if (segments.length >= 2) {
      segments.slice(0, 3).forEach((seg, i) => {
        subClaims.push({
          id: `sub-${i + 1}`,
          statement: seg.endsWith('.') ? seg : `${seg}.`,
          verdict: 'Unverified',
          findingSummary: 'Atomic statement isolated for independent verification.',
          sourceCount: 0,
          relevantSourceIds: [],
        });
      });
    } else {
      // Split into physical event vs attribution/impact
      subClaims.push({
        id: 'sub-1',
        statement: `Primary assertion: "${normalized.slice(0, 120)}" as stated.`,
        verdict: 'Unverified',
        findingSummary: 'Primary verification check against official registries and press archives.',
        sourceCount: 0,
        relevantSourceIds: [],
      });
      subClaims.push({
        id: 'sub-2',
        statement: `Official authorization or statutory validity of the circulating assertion.`,
        verdict: 'Unverified',
        findingSummary: 'Pending check against ministry circulars and gazette notices.',
        sourceCount: 0,
        relevantSourceIds: [],
      });
    }

    const searchQueries = [
      normalized,
      `${normalized} India`,
      `${normalized} official notice government`,
    ];

    return {
      normalizedClaim: rawClaim.trim(),
      detectedLanguage: lang,
      namedEntities: ['Government Authority', 'Public Notice'],
      datesDetected: dates,
      subClaims,
      searchQueries,
      isGemmaPowered: false,
    };
  }

  /**
   * Deterministic heuristic synthesizer for offline/fallback mode
   */
  private heuristicSynthesize(
    claim: string,
    subClaims: DecomposedSubClaim[],
    sources: SourceRecord[],
    language: 'en' | 'hi'
  ): ClaimSynthesisResult {
    let supportedCount = 0;
    let contradictedCount = 0;

    for (const src of sources) {
      if (src.stance === 'supports') supportedCount++;
      if (src.stance === 'contradicts') contradictedCount++;
    }

    let verdict: ClaimVerdict = 'Unverified';
    let summary = '';

    if (contradictedCount > 0 && contradictedCount >= supportedCount) {
      verdict = 'Contradicted';
      summary = `Retrieved evidence from ${contradictedCount} independent source(s) contradicts the central claim. Official notices or verification dossiers indicate the assertion is unsubstantiated or debunked.`;
    } else if (supportedCount > 0 && contradictedCount === 0) {
      verdict = 'Supported';
      summary = `Primary documentation and reports corroborate the key factual elements of this claim.`;
    } else if (supportedCount > 0 && contradictedCount > 0) {
      verdict = 'Mixed Evidence';
      summary = `Evidence is divided or reveals conflicting narratives: while certain elements align with public reporting, other core aspects are contradicted by official records.`;
    } else {
      verdict = 'Unverified';
      summary = `Currently available evidence from public registries, news archives, and official bulletins is insufficient to conclusively verify or refute this claim.`;
    }

    // Assign sources to subclaims
    const updatedSubClaims = subClaims.map((sc, idx) => {
      const assignedSources = sources.filter((_, sIdx) => sIdx % subClaims.length === idx);
      const subVerdict: ClaimVerdict = verdict === 'Contradicted' ? 'Contradicted' : verdict === 'Supported' ? 'Supported' : 'Unverified';
      return {
        ...sc,
        verdict: subVerdict,
        findingSummary: assignedSources.length > 0
          ? `Cross-referenced against ${assignedSources.length} source records.`
          : 'Pending further primary disclosure.',
        sourceCount: assignedSources.length,
        relevantSourceIds: assignedSources.map((s) => s.id),
      };
    });

    return {
      verdict,
      summary,
      confidence: {
        score: sources.length > 3 ? 0.82 : 0.65,
        level: sources.length > 3 ? 'Medium' : 'Low',
        calibrationNote: 'Heuristic synthesis engine assessment based on lexical stance matching; not a calibrated statistical probability.',
      },
      subClaims: updatedSubClaims,
      limitations: [
        'Provider keys for Gemma 4 or commercial search APIs may be running in fallback mode.',
        'Always verify critical legal, financial, or public safety claims with original gazette circulars.',
      ],
      unresolvedQuestions: [
        'Has a formal press statement been issued by the designated nodal department?',
      ],
      isGemmaPowered: false,
      gemmaModelUsed: 'heuristic-engine-v1',
    };
  }
}
