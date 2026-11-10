/**
 * Real-Time Epistemic Confidence Scoring Model
 * Evaluates source corroboration, authority tiers, stance consensus,
 * and sub-claim coverage to calculate a dynamic, empirical confidence score.
 */

import { ClaimVerdict, SourceRecord, DecomposedSubClaim } from '../schemas/factCheck.schema.js';

export interface CalculatedConfidence {
  score: number; // 0.15 to 0.98
  level: 'High' | 'Medium' | 'Low';
  calibrationNote: string;
}

export function calculateEpistemicConfidence(
  verdict: ClaimVerdict,
  sources: SourceRecord[],
  subClaims: DecomposedSubClaim[] = []
): CalculatedConfidence {
  if (!sources || sources.length === 0) {
    return {
      score: 0.20,
      level: 'Low',
      calibrationNote: 'Zero empirical records retrieved from public registries or archives; confidence strictly bounded due to absence of evidence; not a calibrated statistical probability.',
    };
  }

  let supportingCount = 0;
  let contradictingCount = 0;
  let unresolvedCount = 0;
  let tier1Count = 0; // Primary Authority (gov.in, academic, official)
  let tier2Count = 0; // Accredited Fact-Checker
  let tier3Count = 0; // Indexed Journal / Wire
  let tier4Count = 0; // Web Snippet

  let totalRelevance = 0;

  for (const s of sources) {
    if (s.stance === 'supports') supportingCount++;
    else if (s.stance === 'contradicts') contradictingCount++;
    else unresolvedCount++;

    if (s.tier === 'Primary Data' || s.tier === 'Official Archive' || s.tier === 'Peer-Reviewed') {
      tier1Count++;
    } else if (s.tier === 'Investigative Press') {
      tier2Count++;
    } else {
      tier3Count++;
    }

    totalRelevance += s.relevanceScore || 0.75;
  }

  const avgRelevance = sources.length > 0 ? totalRelevance / sources.length : 0.75;

  // Sub-claim coverage: how many sub-claims have at least 1 corroborating source
  const coveredSubClaims = subClaims.filter((sc) => (sc.relevantSourceIds || []).length > 0).length;
  const subClaimCoverageRatio = subClaims.length > 0 ? coveredSubClaims / subClaims.length : 1;

  let rawScore = 0.5;

  if (verdict === 'Supported') {
    // 1 source: ~0.65-0.72; 2-3 sources: ~0.78-0.88; 4+ sources: ~0.90-0.96
    const sourceBase = Math.min(0.32, supportingCount * 0.08);
    const tierBonus = Math.min(0.16, tier1Count * 0.07 + tier2Count * 0.04);
    const consensusRatio = (supportingCount + 0.1) / (sources.length + 0.1);
    const consensusBonus = consensusRatio * 0.08;
    const relevanceBonus = (avgRelevance - 0.5) * 0.10;

    rawScore = 0.44 + sourceBase + tierBonus + consensusBonus + relevanceBonus;
  } else if (verdict === 'Contradicted') {
    // Official refutation has high epistemic certainty
    const sourceBase = Math.min(0.32, contradictingCount * 0.09);
    const tierBonus = Math.min(0.18, tier1Count * 0.08 + tier2Count * 0.05);
    const consensusRatio = (contradictingCount + 0.1) / (sources.length + 0.1);
    const consensusBonus = consensusRatio * 0.08;
    const relevanceBonus = (avgRelevance - 0.5) * 0.10;

    rawScore = 0.45 + sourceBase + tierBonus + consensusBonus + relevanceBonus;
  } else if (verdict === 'Mixed Evidence') {
    // Authentic factual dispute: confidence is bounded in the medium range (0.54 - 0.68)
    const divergence = Math.min(supportingCount, contradictingCount) / Math.max(1, Math.max(supportingCount, contradictingCount));
    const volumeFactor = Math.min(0.10, sources.length * 0.02);
    rawScore = 0.55 + volumeFactor - divergence * 0.04;
  } else {
    // Unverified: insufficient evidence
    // Confidence is inherently low (0.22 - 0.42)
    const volumeFactor = Math.min(0.16, sources.length * 0.035);
    rawScore = 0.22 + volumeFactor;
  }

  // Adjust for sub-claim coverage
  if (subClaims.length > 1) {
    rawScore = rawScore * (0.85 + 0.15 * subClaimCoverageRatio);
  }

  // Dynamic rounding to 2 decimal places, clamped to [0.18, 0.97]
  const finalScore = Math.max(0.18, Math.min(0.97, Math.round(rawScore * 100) / 100));

  let level: 'High' | 'Medium' | 'Low' = 'Medium';
  if (finalScore >= 0.85) level = 'High';
  else if (finalScore < 0.60) level = 'Low';

  // Context-specific, transparent calibration note
  let note = '';
  if (verdict === 'Supported') {
    note = `Calculated from ${supportingCount} corroborating record(s) (${tier1Count} primary authority, ${tier2Count} accredited fact-checks) with ${Math.round(subClaimCoverageRatio * 100)}% sub-claim coverage; not a calibrated statistical probability.`;
  } else if (verdict === 'Contradicted') {
    note = `Calculated from ${contradictingCount} refuting document(s) (${tier1Count} primary notices). Stance consensus: ${Math.round(((contradictingCount) / sources.length) * 100)}%; not a calibrated statistical probability.`;
  } else if (verdict === 'Mixed Evidence') {
    note = `Confidence moderated to reflect factual dispute across ${sources.length} sources (${supportingCount} supporting vs ${contradictingCount} contradicting); not a calibrated statistical probability.`;
  } else {
    note = `Confidence bounded at ${Math.round(finalScore * 100)}% due to insufficient primary archive records (${sources.length} retrieved, 0 definitive stances). Absence of evidence is not proof of falsity; not a calibrated statistical probability.`;
  }

  return {
    score: finalScore,
    level,
    calibrationNote: note,
  };
}
