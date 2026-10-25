import { EvidenceProvider, RawEvidenceItem, SearchOptions } from './provider.interface.js';
import { config } from '../config/env.config.js';
import { extractRootDomain, isValidHttpUrl } from '../utils/url.utils.js';
import { sanitizeUntrustedSnippet } from '../utils/text.utils.js';

export class BraveProvider implements EvidenceProvider {
  readonly name = 'Brave Search';

  isConfigured(): boolean {
    return Boolean(config.providers.braveApiKey && config.providers.braveApiKey.trim().length > 0);
  }

  async search(query: string, options?: SearchOptions): Promise<RawEvidenceItem[]> {
    if (!this.isConfigured()) {
      return [];
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || config.timeouts.searchMs);

    try {
      const url = new URL('https://api.search.brave.com/res/v1/web/search');
      url.searchParams.set('q', query);
      url.searchParams.set('count', String(options?.maxResults || 5));
      url.searchParams.set('country', 'IN'); // Optimize for Indian geography
      url.searchParams.set('search_lang', options?.language === 'hi' ? 'hi' : 'en');

      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': config.providers.braveApiKey!,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        console.warn(`[Brave] HTTP error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = (await response.json()) as {
        web?: {
          results?: Array<{
            title?: string;
            url?: string;
            description?: string;
            page_age?: string;
          }>;
        };
      };

      const results = data.web?.results || [];
      const items: RawEvidenceItem[] = [];

      for (const item of results) {
        if (!item.url || !isValidHttpUrl(item.url)) continue;

        const domain = extractRootDomain(item.url);
        const isOfficialGov = domain.endsWith('gov.in') || domain.endsWith('nic.in');

        items.push({
          title: item.title || 'Brave Search Result',
          url: item.url,
          domain,
          snippet: sanitizeUntrustedSnippet(item.description || ''),
          publishedDate: item.page_age,
          provider: 'Brave Search',
          tier: isOfficialGov ? 'Official Archive' : 'Investigative Press',
          sourceType: 'general_web',
        });
      }

      return items;
    } catch (err: unknown) {
      const isAbort = (err as Error)?.name === 'AbortError';
      console.warn(`[Brave] Search failed: ${isAbort ? 'Timeout' : (err as Error)?.message}`);
      return [];
    } finally {
      clearTimeout(timeout);
    }
  }
}
