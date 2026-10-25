import { EvidenceProvider, RawEvidenceItem, SearchOptions } from './provider.interface.js';
import { config } from '../config/env.config.js';
import { extractRootDomain, isValidHttpUrl } from '../utils/url.utils.js';
import { sanitizeUntrustedSnippet } from '../utils/text.utils.js';

export class TavilyProvider implements EvidenceProvider {
  readonly name = 'Tavily Search';

  isConfigured(): boolean {
    return Boolean(config.providers.tavilyApiKey && config.providers.tavilyApiKey.trim().length > 0);
  }

  async search(query: string, options?: SearchOptions): Promise<RawEvidenceItem[]> {
    if (!this.isConfigured()) {
      return [];
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || config.timeouts.searchMs);

    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: config.providers.tavilyApiKey,
          query,
          search_depth: 'advanced',
          include_answer: false,
          max_results: options?.maxResults || 5,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        console.warn(`[Tavily] HTTP error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = (await response.json()) as {
        results?: Array<{ title?: string; url?: string; content?: string; published_date?: string }>;
      };

      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }

      const items: RawEvidenceItem[] = [];
      for (const item of data.results) {
        if (!item.url || !isValidHttpUrl(item.url)) continue;

        const domain = extractRootDomain(item.url);
        const isOfficialGov = domain.endsWith('gov.in') || domain.endsWith('nic.in');
        const isAcademic = domain.endsWith('edu') || domain.includes('ncbi') || domain.includes('springer');

        items.push({
          title: item.title || 'Web Search Result',
          url: item.url,
          domain,
          snippet: sanitizeUntrustedSnippet(item.content || ''),
          publishedDate: item.published_date,
          provider: 'Tavily Search',
          tier: isOfficialGov ? 'Official Archive' : isAcademic ? 'Peer-Reviewed' : 'Investigative Press',
          sourceType: 'general_web',
        });
      }

      return items;
    } catch (err: unknown) {
      const isAbort = (err as Error)?.name === 'AbortError';
      console.warn(`[Tavily] Search failed: ${isAbort ? 'Timeout' : (err as Error)?.message}`);
      return [];
    } finally {
      clearTimeout(timeout);
    }
  }
}
