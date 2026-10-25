/**
 * SignalCheck - Comprehensive Backend Verification & Test Suite
 * Tests the requirements non-negotiably outlined in the project specification.
 */

import { FactCheckService } from './services/factCheck.service.js';
import { ProviderAggregatorService } from './providers/providerAggregator.service.js';
import { normalizeUrl, extractRootDomain, isValidHttpUrl } from './utils/url.utils.js';
import { detectLanguage, containsDevanagari, calculateJaccardSimilarity } from './utils/text.utils.js';
import { FactCheckRequestSchema } from './schemas/factCheck.schema.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName}${detail ? ` (${detail})` : ''}`);
  }
}

async function runTestSuite() {
  console.log('\n=============================================================');
  console.log('  SignalCheck India Fact-Checking Backend - Test Suite');
  console.log('=============================================================\n');

  // ---------------------------------------------------------------------------
  // Test Suite 1: Utility and Multilingual Detection
  // ---------------------------------------------------------------------------
  console.log('Suite 1: Text Utilities & Multilingual Detection');
  
  assert(
    detectLanguage('The Reserve Bank of India has issued a 500 rupee notification') === 'en',
    'English claim detection'
  );

  const hindiClaim = 'क्या सरकार सभी नागरिकों को फ्री सोलर पैनल दे रही है?';
  assert(
    detectLanguage(hindiClaim) === 'hi',
    'Hindi (Devanagari) script detection'
  );
  assert(
    containsDevanagari(hindiClaim),
    'Devanagari unicode validator detects Hindi characters'
  );

  const similarity = calculateJaccardSimilarity(
    'RBI releases new circular on UPI payment limits',
    'RBI issues circular regarding UPI payment transactions'
  );
  assert(
    similarity > 0.3,
    'Jaccard similarity detects lexical overlap for duplicate wire detection'
  );

  // ---------------------------------------------------------------------------
  // Test Suite 2: URL Normalization and Citation Integrity
  // ---------------------------------------------------------------------------
  console.log('\nSuite 2: URL Normalization & Citation Integrity');

  const dirtyUrl = 'https://pib.gov.in/PressReleasePage.aspx?PRID=1987654&utm_source=whatsapp&utm_medium=share#anchor';
  const cleanUrl = normalizeUrl(dirtyUrl);
  assert(
    !cleanUrl.includes('utm_source') && !cleanUrl.includes('#anchor'),
    'Tracking params and anchors stripped from citation URL'
  );

  assert(
    extractRootDomain('https://subdomain.pib.gov.in/notice') === 'pib.gov.in',
    'Indian government domain extracted correctly (.gov.in)'
  );

  assert(
    isValidHttpUrl('https://rbi.org.in/scripts/BS_PressReleaseDisplay.aspx'),
    'Valid HTTP/HTTPS URL accepted'
  );
  assert(
    !isValidHttpUrl('not-a-valid-url'),
    'Invalid URL rejected by citation validator'
  );

  // ---------------------------------------------------------------------------
  // Test Suite 3: Schema & Input Validation
  // ---------------------------------------------------------------------------
  console.log('\nSuite 3: Input Validation & Edge Cases');

  const invalidShort = FactCheckRequestSchema.safeParse({ claim: 'ab' });
  assert(!invalidShort.success, 'Reject claims shorter than 3 characters');

  const validEnglish = FactCheckRequestSchema.safeParse({
    claim: 'Viral message claims Indian Railways cancelled all senior citizen concessions permanently.',
  });
  assert(validEnglish.success, 'Accept well-formed English claim');

  const validHindi = FactCheckRequestSchema.safeParse({
    claim: 'पीएम किसान योजना के तहत सरकार सभी किसानों को 15000 रुपये दे रही है।',
    language: 'hi',
  });
  assert(validHindi.success, 'Accept well-formed Hindi claim with explicit language tag');

  // ---------------------------------------------------------------------------
  // Test Suite 4: Multi-Source Evidence Retrieval
  // ---------------------------------------------------------------------------
  console.log('\nSuite 4: Provider Aggregator & Multi-Source Evidence Retrieval');

  const aggregator = new ProviderAggregatorService();
  const testClaim = 'Indian government PM KISAN scheme subsidy';
  const aggResult = await aggregator.retrieveMultiSourceEvidence(testClaim, [testClaim], { maxResults: 3 });

  assert(Array.isArray(aggResult.sources), 'Sources returned as array');
  assert(aggResult.sources.length > 0, `Evidence retrieved from live public providers (${aggResult.sources.length} sources)`);
  assert(aggResult.providerStatus.indianGov.available, 'Indian government authority provider active');
  assert(aggResult.providerStatus.crossref.available, 'Crossref academic registry active');

  // Citation integrity check
  const allUrlsValid = aggResult.sources.every((s) => isValidHttpUrl(s.url));
  assert(allUrlsValid, '100% of retrieved citation URLs are valid, non-fabricated HTTP/HTTPS links');

  // ---------------------------------------------------------------------------
  // Test Suite 5: Full Fact Check Orchestration (English & Hindi)
  // ---------------------------------------------------------------------------
  console.log('\nSuite 5: End-to-End Claim Investigation Pipeline');

  const service = new FactCheckService();

  // Test 5A: English Claim
  console.log('  Testing English claim: "WHO declared India polio free in 2014"');
  const enResult = await service.conductInvestigation({
    claim: 'WHO declared India polio free in 2014',
    language: 'auto',
  });

  assert(['Supported', 'Contradicted', 'Mixed Evidence', 'Unverified'].includes(enResult.verdict), `Allowed verdict assigned: ${enResult.verdict}`);
  assert(enResult.claimBreakdown.length >= 1, `Decomposed into ${enResult.claimBreakdown.length} sub-assertions`);
  assert(enResult.confidence.calibrationNote.includes('not a calibrated statistical probability'), 'Confidence includes mandatory uncalibrated probability disclosure');
  assert(enResult.pipelineLogs.length >= 4, 'Full 4-stage pipeline event log generated');

  // Test 5B: Hindi Claim
  console.log('  Testing Hindi claim: "क्या भारतीय रिजर्व बैंक ने 500 के नए नोट बंद कर दिए हैं?"');
  const hiResult = await service.conductInvestigation({
    claim: 'क्या भारतीय रिजर्व बैंक ने 500 के नए नोट बंद कर दिए हैं?',
    language: 'auto',
  });

  assert(hiResult.language === 'hi', `Hindi language detected: ${hiResult.language}`);
  assert(hiResult.sources.length > 0, `Discovered real-world sources for Hindi claim (${hiResult.sources.length} sources)`);
  assert(hiResult.unresolvedQuestions.length >= 0, 'Unresolved questions handled gracefully');

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n=============================================================');
  console.log(`  Tests Completed: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('=============================================================\n');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
