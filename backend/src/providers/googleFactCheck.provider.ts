import { EvidenceProvider, RawEvidenceItem, SearchOptions } from './provider.interface.js';
import { config } from '../config/env.config.js';
import { extractRootDomain, isValidHttpUrl } from '../utils/url.utils.js';
import { sanitizeUntrustedSnippet } from '../utils/text.utils.js';

export class GoogleFactCheckProvider implements EvidenceProvider {
  readonly name = 'Google Fact Check Tools API';

  isConfigured(): boolean {
    return Boolean(config.providers.googleFactCheckApiKey && config.providers.googleFactCheckApiKey.trim().length > 0);
  }

  async search(query: string, options?: SearchOptions): Promise<RawEvidenceItem[]> {
    if (!this.isConfigured()) {
      return [];
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || config.timeouts.searchMs);

    try {
      const url = new URL('https://factchecktools.googleapis.com/v1alpha1/claims:search');
      url.searchParams.set('query', query);
      url.searchParams.set('key', config.providers.googleFactCheckApiKey!);
      if (options?.language) {
        url.searchParams.set('languageCode', options.language);
      }
      url.searchParams.set('pageSize', String(options?.maxResults || 5));

      const response = await fetch(url.toString(), { signal: controller.signal });

      if (!response.ok) {
        console.warn(`[Google Fact Check] HTTP error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = (await response.json()) as {
        claims?: Array<{
          text?: string;
          claimant?: string;
          claimDate?: string;
          claimReview?: Array<{
            publisher?: { name?: string; site?: string };
            url?: string;
            title?: string;
            reviewDate?: string;
            textualRating?: string;
          }>;
        }>;
      };

      if (!data.claims || !Array.isArray(data.claims)) {
        return [];
      }

      const items: RawEvidenceItem[] = [];

      for (const claim of data.claims) {
        const reviews = claim.claimReview || [];
        for (const review of reviews) {
          if (!review.url || !isValidHttpUrl(review.url)) continue;

          const publisherName = review.publisher?.name || 'Fact-Checking Publisher';
          const rating = review.textualRating || 'Unspecified Verdict';
          const originalClaimText = claim.text ? `Claim: "${claim.text}"` : '';
          const snippetText = `${originalClaimText}. Publisher verdict by ${publisherName}: "${rating}". ${review.title || ''}`;

          items.push({
            title: review.title || `${publisherName}: Fact Check Assessment`,
            url: review.url,
            domain: extractRootDomain(review.url),
            snippet: sanitizeUntrustedSnippet(snippetText),
            publishedDate: review.reviewDate || claim.claimDate,
            provider: 'Google Fact Check Tools (ClaimReview)',
            publisher: publisherName,
            originalVerdict: rating,
            tier: 'Investigative Press',
            sourceType: 'fact_check',
            rawMetadata: {
              claimant: claim.claimant,
              rating,
              claimText: claim.text,
            },
          });
        }
      }

      return items;
    } catch (err: unknown) {
      const isAbort = (err as Error)?.name === 'AbortError';
      console.warn(`[Google Fact Check] Search failed: ${isAbort ? 'Timeout' : (err as Error)?.message}`);
      return [];
    } finally {
      clearTimeout(timeout);
    }
  }
}
