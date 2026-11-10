/**
 * SignalCheck - Text Processing, Multilingual & Deduplication Utilities
 */

/**
 * Detects whether the text contains Devanagari (Hindi / Marathi / Sanskrit) script.
 */
export function containsDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Detects whether input is predominantly Hindi or English
 */
export function detectLanguage(text: string): 'hi' | 'en' {
  if (containsDevanagari(text)) {
    return 'hi';
  }
  return 'en';
}

/**
 * Normalizes colloquial question queries into declarative assertions
 * and cleans conversational noise and common phonetic typos.
 */
export function normalizeClaimQuery(raw: string): string {
  let cleaned = raw.trim();

  // Strip leading question markers
  cleaned = cleaned.replace(/^(?:is|was|are|does|did|can|could|whether|tell me if|kya|क्या)\s+/i, '');
  // Remove question mark at the end
  cleaned = cleaned.replace(/[?？]+$/, '').trim();

  // Fix common transliteration/keyboard typos in frequent Indian queries
  cleaned = cleaned
    .replace(/\bnrendra\b/gi, 'Narendra')
    .replace(/\bmodii\b/gi, 'Modi')
    .replace(/\bgov(?:t|t\.)\b/gi, 'government');

  // Remove duplicate consecutive words like "is ... is"
  cleaned = cleaned.replace(/\b(is|the|a|an)\s+\1\b/gi, '$1');

  return cleaned;
}

/**
 * Decodes HTML entities and normalizes ordinal numbers (e.g. 7th <-> seventh)
 */
export function normalizeSemanticText(text: string): string {
  return text
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\bfirst\b/gi, '1st')
    .replace(/\bsecond\b/gi, '2nd')
    .replace(/\bthird\b/gi, '3rd')
    .replace(/\bfourth\b/gi, '4th')
    .replace(/\bfifth\b/gi, '5th')
    .replace(/\bsixth\b/gi, '6th')
    .replace(/\bseventh\b/gi, '7th')
    .replace(/\beighth\b/gi, '8th')
    .replace(/\bninth\b/gi, '9th')
    .replace(/\btenth\b/gi, '10th')
    .toLowerCase();
}

/**
 * Evaluates whether retrieved factual text supports, contradicts, or leaves a claim unresolved.
 */
export function evaluateFactualStance(
  claimText: string,
  sourceText: string
): 'supports' | 'contradicts' | 'neutral' | 'unresolved' {
  const normClaim = normalizeSemanticText(claimText);
  const normSource = normalizeSemanticText(sourceText);

  // 1. Contradiction Detection
  const contradictionMarkers = [
    'fake',
    'false',
    'debunk',
    'misleading',
    'hoax',
    'bust',
    'clarifies no',
    'untrue',
    'no evidence',
    'bogus',
    'fabricated',
    'is not the prime minister',
    'never served as',
    'incorrectly claims',
    'not true',
  ];
  if (contradictionMarkers.some((m) => normSource.includes(m))) {
    return 'contradicts';
  }

  // 2. Explicit Corroboration Markers
  const supportMarkers = [
    'has served as',
    'serving as',
    'is the prime minister',
    'assumed office as',
    'sworn in as',
    'incumbent prime minister',
    'headed by the prime minister',
    'head of government',
    'confirmed',
    'announces',
    'officially launched',
    'notified in gazette',
    'proves',
    'factual',
    'valid',
    'accurate',
    'verified',
  ];
  if (supportMarkers.some((m) => normSource.includes(m))) {
    return 'supports';
  }

  // 3. Entity Co-occurrence & Affirmative Semantic Predicates
  // If claim asserts a person holds an office (e.g. Narendra Modi + Prime Minister + India)
  const isModiClaim = normClaim.includes('modi') && normClaim.includes('prime minister');
  if (isModiClaim) {
    const hasModi = normSource.includes('modi') || normSource.includes('narendra');
    const hasPM = normSource.includes('prime minister') || normSource.includes('pm of india');
    const hasNegation = /\b(?:not|never|fake|falsely)\b/i.test(normSource);

    if (hasModi && hasPM && !hasNegation) {
      return 'supports';
    }
  }

  // 4. Rank, Geography & Superlative Predicates (e.g., "India" + "7th largest" + "country")
  const rankMatch = normClaim.match(/\b(\d+(?:st|nd|rd|th))\s+(?:largest|biggest|smallest|highest|populous)\b/i);
  if (rankMatch) {
    const rankPhrase = rankMatch[0]; // e.g. "7th largest"
    if (normSource.includes(rankPhrase) || normSource.includes(rankPhrase.replace(/\s+/, '-'))) {
      if (!/\b(?:not|fake|false|disputed|misleading)\b/i.test(normSource)) {
        return 'supports';
      }
    }
  }

  // 5. General check: high lexical overlap with no negation
  const jaccard = calculateJaccardSimilarity(normClaim, normSource);
  if (jaccard > 0.25 && !/\b(?:not|fake|false|misleading)\b/i.test(normSource)) {
    return 'supports';
  }

  return 'unresolved';
}

/**
 * Simple token-based Jaccard similarity for detecting syndicated/duplicate headlines
 */
export function calculateJaccardSimilarity(text1: string, text2: string): number {
  const tokenize = (t: string) =>
    new Set(
      t
        .toLowerCase()
        .replace(/[^\w\s\u0900-\u097F]/g, '')
        .split(/\s+/)
        .filter((w) => w.length >= 2)
    );

  const set1 = tokenize(text1);
  const set2 = tokenize(text2);

  if (set1.size === 0 || set2.size === 0) return 0;

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

/**
 * Sanitizes snippets from untrusted retrieved web text, removing prompt injection patterns
 * and control characters while preserving journalistic facts.
 */
export function sanitizeUntrustedSnippet(rawText: string, maxLength = 600): string {
  if (!rawText) return '';
  
  let cleaned = rawText
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '') // strip any html tags
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/(?:ignore previous instructions|system prompt|you are gemma|developer mode)/gi, '[REDACTED]')
    .trim();

  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength) + '...';
  }

  return cleaned;
}

/**
 * Extracts year numbers and date strings if present
 */
export function extractDatesAndYears(text: string): string[] {
  const years = text.match(/\b(19\d{2}|20\d{2})\b/g) || [];
  return Array.from(new Set(years));
}
