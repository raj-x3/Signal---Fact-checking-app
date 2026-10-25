import { EvidenceProvider, RawEvidenceItem, SearchOptions } from './provider.interface.js';
import { extractRootDomain, isValidHttpUrl } from '../utils/url.utils.js';
import { sanitizeUntrustedSnippet } from '../utils/text.utils.js';

export class CrossrefProvider implements EvidenceProvider {
  readonly name = 'Crossref Academic Index';

  isConfigured(): boolean {
    return true; // Free public API
  }

  async search(query: string, options?: SearchOptions): Promise<RawEvidenceItem[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || 8000);

    try {
      const cleanQuery = query.replace(/[^\w\s]/g, ' ').trim().slice(0, 100);
      const url = new URL('https://api.crossref.org/works');
      url.searchParams.set('query', cleanQuery);
      url.searchParams.set('rows', String(options?.maxResults || 3));
      url.searchParams.set('select', 'title,URL,published,container-title,author,abstract,DOI');

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'SignalCheck-Evidence-Auditor/1.0 (mailto:contact@signalcheck.in)',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        return [];
      }

      const data = (await response.json()) as {
        message?: {
          items?: Array<{
            title?: string[];
            URL?: string;
            DOI?: string;
            published?: { 'date-parts'?: number[][] };
            'container-title'?: string[];
            author?: Array<{ given?: string; family?: string }>;
            abstract?: string;
          }>;
        };
      };

      const items = data.message?.items || [];
      const results: RawEvidenceItem[] = [];

      for (const item of items) {
        const title = item.title?.[0] || 'Peer-Reviewed Scientific Publication';
        const itemUrl = item.URL || (item.DOI ? `https://doi.org/${item.DOI}` : '');
        if (!itemUrl || !isValidHttpUrl(itemUrl)) continue;

        let dateStr: string | undefined;
        const dateParts = item.published?.['date-parts']?.[0];
        if (dateParts && dateParts.length > 0) {
          dateStr = dateParts.map((p) => String(p).padStart(2, '0')).join('-');
        }

        const journal = item['container-title']?.[0] || 'Scholarly Journal';
        const authors = (item.author || []).map((a) => `${a.given || ''} ${a.family || ''}`.trim()).filter(Boolean).slice(0, 3).join(', ');
        const authorText = authors ? `Authors: ${authors}. ` : '';
        const snippet = `${authorText}Published in ${journal}. DOI: ${item.DOI || 'N/A'}. ${item.abstract || 'Peer-reviewed academic study indexed in Crossref database.'}`;

        results.push({
          title,
          url: itemUrl,
          domain: extractRootDomain(itemUrl),
          snippet: sanitizeUntrustedSnippet(snippet),
          publishedDate: dateStr,
          provider: 'Crossref Academic Registry',
          publisher: journal,
          tier: 'Peer-Reviewed',
          sourceType: 'academic',
        });
      }

      return results;
    } catch {
      return [];
    } finally {
      clearTimeout(timeout);
    }
  }
}
