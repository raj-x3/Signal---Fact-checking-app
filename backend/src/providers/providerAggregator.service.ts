import { EvidenceProvider, RawEvidenceItem, SearchOptions } from './provider.interface.js';
import { TavilyProvider } from './tavily.provider.js';
import { BraveProvider } from './brave.provider.js';
import { GdeltProvider } from './gdelt.provider.js';
import { GoogleFactCheckProvider } from './googleFactCheck.provider.js';
import { CrossrefProvider } from './crossref.provider.js';
import { PubMedProvider } from './pubmed.provider.js';
import { IndianGovernmentProvider } from './indianGovernment.provider.js';
import { IndianFactCheckersProvider } from './indianFactCheckers.provider.js';
import { SourceRecord, ProviderStatus, SourceTier } from '../schemas/factCheck.schema.js';
import { normalizeUrl, extractRootDomain } from '../utils/url.utils.js';
import { calculateJaccardSimilarity, evaluateFactualStance } from '../utils/text.utils.js';

export interface AggregatedEvidenceResult {
  sources: SourceRecord[];
  providerStatus: ProviderStatus;
  logs: string[];
}

export class ProviderAggregatorService {
  private tavily = new TavilyProvider();
  private brave = new BraveProvider();
  private gdelt = new GdeltProvider();
  private googleFactCheck = new GoogleFactCheckProvider();
  private crossref = new CrossrefProvider();
  private pubmed = new PubMedProvider();
  private indianGov = new IndianGovernmentProvider();
  private indianFactCheckers = new IndianFactCheckersProvider();

  async retrieveMultiSourceEvidence(
    claim: string,
    searchQueries: string[],
    options?: SearchOptions
  ): Promise<AggregatedEvidenceResult> {
    const logs: string[] = [];
    logs.push(`[Retrieval Engine] Initiating multi-source evidence query across 8 specialized providers...`);

    const providerStatus: ProviderStatus = {
      gemma: { available: false, model: '', status: 'fallback' }, // set later by caller
      tavily: {
        configured: this.tavily.isConfigured(),
        status: this.tavily.isConfigured() ? 'active' : 'disabled',
      },
      brave: {
        configured: this.brave.isConfigured(),
        status: this.brave.isConfigured() ? 'active' : 'disabled',
      },
      googleFactCheck: {
        configured: this.googleFactCheck.isConfigured(),
        status: this.googleFactCheck.isConfigured() ? 'active' : 'disabled',
      },
      gdelt: { available: true, status: 'active' },
      crossref: { available: true, status: 'active' },
      pubmed: { available: true, status: 'active' },
      indianGov: { available: true, status: 'active' },
      indianFactCheckers: { available: true, status: 'active' },
    };

    // Primary search query plus any specialized sub-queries
    const queriesToRun = Array.from(new Set([claim, ...(searchQueries || [])])).slice(0, 3);
    const rawItems: RawEvidenceItem[] = [];

    // Run active providers in parallel with timeout safeguards
    const tasks: Promise<void>[] = [];

    // 1. Tavily
    if (this.tavily.isConfigured()) {
      tasks.push(
        this.tavily.search(queriesToRun[0], options).then((res) => {
          rawItems.push(...res);
          logs.push(`[Tavily Search] Retrieved ${res.length} search records.`);
        }).catch(() => {
          providerStatus.tavily.status = 'error';
        })
      );
    }

    // 2. Brave Search
    if (this.brave.isConfigured()) {
      tasks.push(
        this.brave.search(queriesToRun[0], options).then((res) => {
          rawItems.push(...res);
          logs.push(`[Brave Search] Retrieved ${res.length} independent web records.`);
        }).catch(() => {
          providerStatus.brave.status = 'error';
        })
      );
    }

    // 3. Google Fact Check Tools API
    if (this.googleFactCheck.isConfigured()) {
      tasks.push(
        this.googleFactCheck.search(queriesToRun[0], options).then((res) => {
          rawItems.push(...res);
          logs.push(`[Google Fact Check Tools] Located ${res.length} ClaimReview records.`);
        }).catch(() => {
          providerStatus.googleFactCheck.status = 'error';
        })
      );
    }

    // 4. GDELT News Project
    tasks.push(
      this.gdelt.search(queriesToRun[0], options).then((res) => {
        rawItems.push(...res);
        if (res.length > 0) logs.push(`[GDELT Project] Found ${res.length} news wire entries.`);
      }).catch(() => {
        providerStatus.gdelt.status = 'fallback';
      })
    );

    // 5. Crossref Academic Metadata (if scientific, historical, or policy claim)
    tasks.push(
      this.crossref.search(queriesToRun[0], options).then((res) => {
        rawItems.push(...res);
        if (res.length > 0) logs.push(`[Crossref] Found ${res.length} peer-reviewed registry entries.`);
      }).catch(() => {
        providerStatus.crossref.status = 'error';
      })
    );

    // 6. PubMed (Health & Biomedical Literature)
    const isHealthClaim = /health|virus|vaccine|disease|medicine|cure|ayurveda|covid|cancer|diet|drug/i.test(claim);
    if (isHealthClaim) {
      tasks.push(
        this.pubmed.search(queriesToRun[0], options).then((res) => {
          rawItems.push(...res);
          if (res.length > 0) logs.push(`[PubMed PMC] Retrieved ${res.length} biomedical literature entries.`);
        }).catch(() => {
          providerStatus.pubmed.status = 'error';
        })
      );
    }

    // 7. Indian Government Authorities & PIB
    tasks.push(
      this.indianGov.search(queriesToRun[0], options).then((res) => {
        rawItems.push(...res);
        logs.push(`[Indian Official Registries] Consulted government portal & PIB archives.`);
      }).catch(() => {
        providerStatus.indianGov.status = 'error';
      })
    );

    // 8. Indian Fact Checkers Registry
    tasks.push(
      this.indianFactCheckers.search(queriesToRun[0], options).then((res) => {
        rawItems.push(...res);
        if (res.length > 0) logs.push(`[Indian Fact Checkers] Found ${res.length} verified verification references.`);
      }).catch(() => {
        providerStatus.indianFactCheckers.status = 'error';
      })
    );

    // Await all evidence gathering
    await Promise.allSettled(tasks);

    // Process, normalize, deduplicate, and cluster evidence
    const processedSources = this.processAndDeduplicateEvidence(rawItems, claim);
    logs.push(`[Evidence Audit] Cleaned and deduplicated ${rawItems.length} raw hits into ${processedSources.length} verified citation records.`);

    return {
      sources: processedSources,
      providerStatus,
      logs,
    };
  }

  /**
   * Normalizes URLs, detects syndication/duplicates, scores reliability and calculates stance.
   */
  private processAndDeduplicateEvidence(rawItems: RawEvidenceItem[], claimText: string): SourceRecord[] {
    const seenUrls = new Set<string>();
    const seenTitles: string[] = [];
    const domainCounts: Record<string, number> = {};
    const finalSources: SourceRecord[] = [];

    let counter = 1;

    for (const item of rawItems) {
      const normalized = normalizeUrl(item.url);

      // Check URL uniqueness
      if (seenUrls.has(normalized)) {
        continue;
      }

      // Check syndication / near-duplicate title (wire reports replicated on multiple sites)
      const isSyndicated = seenTitles.some((existingTitle) => {
        const similarity = calculateJaccardSimilarity(existingTitle, item.title);
        return similarity > 0.8;
      });

      if (isSyndicated) {
        // Skip duplicate syndication to prioritize independent reporting
        continue;
      }

      seenUrls.add(normalized);
      seenTitles.push(item.title);

      const domain = extractRootDomain(item.url);
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;

      // Determine Source Tier
      let tier: SourceTier = item.tier || 'Investigative Press';
      let reliabilityNote = 'Published media report. Cross-referencing against primary documentation.';

      if (domain.endsWith('gov.in') || domain.endsWith('nic.in') || domain.includes('rbi.org.in') || domain.includes('eci.gov.in')) {
        tier = 'Official Archive';
        reliabilityNote = 'Official Republic of India statutory authority, gazette, or ministry portal.';
      } else if (item.sourceType === 'academic' || domain.includes('doi.org') || domain.includes('ncbi.nlm.nih.gov')) {
        tier = 'Peer-Reviewed';
        reliabilityNote = 'Indexed scientific or biomedical literature metadata.';
      } else if (item.sourceType === 'fact_check') {
        tier = 'Investigative Press';
        reliabilityNote = `Previously published fact-check dossier${item.publisher ? ` by ${item.publisher}` : ''}; evaluate independently.`;
      }

      // Compute initial heuristic relevance score based on lexical overlap with claim
      const jaccard = calculateJaccardSimilarity(claimText, `${item.title} ${item.snippet}`);
      const relevanceScore = Math.min(0.98, Math.max(0.65, Number((0.6 + jaccard * 0.4).toFixed(2))));

      // Determine preliminary stance based on semantic factual evaluation
      const textBlock = `${item.title} ${item.snippet} ${item.originalVerdict || ''}`;
      const stance = evaluateFactualStance(claimText, textBlock);

      finalSources.push({
        id: `src-gen-${counter++}`,
        title: item.title,
        url: item.url,
        domain,
        provider: item.provider,
        publicationDate: item.publishedDate || new Date().toISOString().slice(0, 10),
        retrievalTimestamp: new Date().toISOString(),
        snippet: item.snippet,
        extractionType: 'snippet',
        tier,
        reliabilityNote,
        relevanceScore,
        stance,
      });

      // Cap at 10 high-quality distinct sources
      if (finalSources.length >= 10) break;
    }

    return finalSources;
  }
}
