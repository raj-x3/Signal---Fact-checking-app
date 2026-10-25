import { EvidenceProvider, RawEvidenceItem, SearchOptions } from './provider.interface.js';
import { extractRootDomain, isValidHttpUrl } from '../utils/url.utils.js';
import { sanitizeUntrustedSnippet } from '../utils/text.utils.js';

export class GdeltProvider implements EvidenceProvider {
  readonly name = 'GDELT Global News';

  isConfigured(): boolean {
    return true; // Free public API
  }

  async search(query: string, options?: SearchOptions): Promise<RawEvidenceItem[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || 5000);

    try {
      // Build GDELT 2.0 Doc API query
      // Append India geography keyword or country filter
      const cleanQuery = query.replace(/[^\w\s]/g, ' ').trim().slice(0, 100);
      const url = new URL('https://api.gdeltproject.org/api/v2/doc/doc');
      url.searchParams.set('query', `${cleanQuery} sourcecountry:IN`);
      url.searchParams.set('mode', 'artlist');
      url.searchParams.set('format', 'json');
      url.searchParams.set('maxrecords', String(options?.maxResults || 5));
      url.searchParams.set('sort', 'DateDesc');

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'SignalCheck-India-FactChecker/1.0',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        return [];
      }

      const data = (await response.json()) as {
        articles?: Array<{
          url?: string;
          title?: string;
          seendate?: string;
          domain?: string;
          language?: string;
          sourcecountry?: string;
        }>;
      };

      if (!data.articles || !Array.isArray(data.articles)) {
        return [];
      }

      const items: RawEvidenceItem[] = [];
      for (const art of data.articles) {
        if (!art.url || !isValidHttpUrl(art.url)) continue;

        let dateStr: string | undefined;
        if (art.seendate && art.seendate.length >= 8) {
          // GDELT format: YYYYMMDDTHHMMSSZ
          dateStr = `${art.seendate.slice(0, 4)}-${art.seendate.slice(4, 6)}-${art.seendate.slice(6, 8)}`;
        }

        items.push({
          title: art.title || 'GDELT News Article',
          url: art.url,
          domain: art.domain || extractRootDomain(art.url),
          snippet: sanitizeUntrustedSnippet(`News coverage recorded by GDELT news monitor in ${art.sourcecountry || 'India'}: ${art.title}`),
          publishedDate: dateStr,
          provider: 'GDELT Project',
          tier: 'Investigative Press',
          sourceType: 'news',
        });
      }

      return items;
    } catch {
      // GDELT may be transiently unavailable or rate-limited; gracefully degrade
      return [];
    } finally {
      clearTimeout(timeout);
    }
  }
}
