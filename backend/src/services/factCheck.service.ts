import { GemmaService } from './gemma.service.js';
import { ProviderAggregatorService } from '../providers/providerAggregator.service.js';
import {
  FactCheckRequest,
  FactCheckResponse,
  SourceRecord,
} from '../schemas/factCheck.schema.js';
import { config } from '../config/env.config.js';

export class FactCheckService {
  private gemmaService = new GemmaService();
  private providerAggregator = new ProviderAggregatorService();

  async conductInvestigation(req: FactCheckRequest): Promise<FactCheckResponse> {
    const pipelineLogs: string[] = [];
    const startTime = Date.now();

    pipelineLogs.push(`[SignalCheck Engine] Ingesting claim: "${req.claim.slice(0, 100)}${req.claim.length > 100 ? '...' : ''}"`);

    // -------------------------------------------------------------------------
    // Stage 1: Atomic Claim Decomposition & Entity Extraction
    // -------------------------------------------------------------------------
    pipelineLogs.push(`[Gemma 4] Parsing logical predicates, entities, and falsifiability criteria...`);
    const decomposition = await this.gemmaService.decomposeClaim(req.claim, req.language);

    if (decomposition.isGemmaPowered) {
      pipelineLogs.push(`[Gemma 4] Decomposed into ${decomposition.subClaims.length} atomic assertions using model: ${config.gemma.modelId}.`);
    } else {
      pipelineLogs.push(`[SignalCheck Engine] Decomposed into ${decomposition.subClaims.length} atomic assertions via heuristic syntactic parser.`);
    }

    if (decomposition.detectedLanguage === 'hi') {
      pipelineLogs.push(`[Multilingual Layer] Hindi claim detected. Preserved original Devanagari text with cross-lingual English query translation.`);
    }

    // -------------------------------------------------------------------------
    // Stage 2: Multi-Source Evidence Retrieval
    // -------------------------------------------------------------------------
    pipelineLogs.push(`[Retrieval Orchestrator] Dispatching search vectors across general web, news, and specialized Indian archives...`);
    const aggregatedResult = await this.providerAggregator.retrieveMultiSourceEvidence(
      decomposition.normalizedClaim,
      decomposition.searchQueries,
      { language: decomposition.detectedLanguage }
    );

    pipelineLogs.push(...aggregatedResult.logs);

    // -------------------------------------------------------------------------
    // Stage 3: Gemma 4 Epistemic Reasoning & Cross-Examination
    // -------------------------------------------------------------------------
    pipelineLogs.push(`[Gemma 4] Comparing contradiction vectors & stance alignment against ${aggregatedResult.sources.length} retrieved records...`);
    const synthesis = await this.gemmaService.synthesizeEvidence(
      decomposition.normalizedClaim,
      decomposition.subClaims,
      aggregatedResult.sources,
      decomposition.detectedLanguage
    );

    // Update provider status for Gemma
    aggregatedResult.providerStatus.gemma = {
      available: this.gemmaService.isAvailable(),
      model: config.gemma.modelId,
      status: synthesis.isGemmaPowered ? 'active' : 'fallback',
    };

    // Separate supporting and contradicting sources
    const supportingEvidence: SourceRecord[] = [];
    const contradictingEvidence: SourceRecord[] = [];

    for (const src of aggregatedResult.sources) {
      if (src.stance === 'supports') {
        supportingEvidence.push(src);
      } else if (src.stance === 'contradicts') {
        contradictingEvidence.push(src);
      }
    }

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
    pipelineLogs.push(`[Done] Investigation dossier compiled in ${durationSec}s. Epistemic verdict: ${synthesis.verdict.toUpperCase()}`);

    return {
      claim: decomposition.normalizedClaim,
      originalClaim: req.claim,
      language: decomposition.detectedLanguage,
      verdict: synthesis.verdict,
      summary: synthesis.summary,
      confidence: synthesis.confidence,
      claimBreakdown: synthesis.subClaims,
      supportingEvidence,
      contradictingEvidence,
      sources: aggregatedResult.sources,
      limitations: synthesis.limitations,
      unresolvedQuestions: synthesis.unresolvedQuestions,
      providerStatus: aggregatedResult.providerStatus,
      pipelineLogs,
      timestamp: new Date().toISOString(),
    };
  }
}
