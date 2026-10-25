import { EvidenceProvider, RawEvidenceItem, SearchOptions } from './provider.interface.js';
import { extractRootDomain, isValidHttpUrl } from '../utils/url.utils.js';
import { sanitizeUntrustedSnippet } from '../utils/text.utils.js';

export class PubMedProvider implements EvidenceProvider {
  readonly name = 'PubMed Biomedical Literature';

  isConfigured(): boolean {
    return true; // Free public NCBI API
  }

  async search(query: string, options?: SearchOptions): Promise<RawEvidenceItem[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || 8000);

    try {
      const cleanTerm = encodeURIComponent(query.replace(/[^\w\s]/g, ' ').trim().slice(0, 80));
      // 1. Search for IDs
      const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term=${cleanTerm}&retmode=json&retmax=${options?.maxResults || 3}`;

      const searchRes = await fetch(searchUrl, {
        headers: { 'User-Agent': 'SignalCheck-Evidence-Auditor/1.0' },
        signal: controller.signal,
      });

      if (!searchRes.ok) return [];

      const searchData = (await searchRes.json()) as {
        esearchresult?: { idlist?: string[] };
      };

      const idList = searchData.esearchresult?.idlist || [];
      if (idList.length === 0) return [];

      // 2. Fetch summaries for IDs
      const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pmc&id=${idList.join(',')}&retmode=json`;
      const summaryRes = await fetch(summaryUrl, {
        headers: { 'User-Agent': 'SignalCheck-Evidence-Auditor/1.0' },
        signal: controller.signal,
      });

      if (!summaryRes.ok) return [];

      const summaryData = (await summaryRes.json()) as {
        result?: Record<string, {
          title?: string;
          source?: string;
          pubdate?: string;
          articleids?: Array<{ idtype?: string; value?: string }>;
        }>;
      };

      const resultObj = summaryData.result || {};
      const items: RawEvidenceItem[] = [];

      for (const id of idList) {
        const doc = resultObj[id];
        if (!doc || !doc.title) continue;

        const pmcUrl = `https://www.ncbi.nlm.nih.gov/pmc/articles/PMC${id}/`;
        if (!isValidHttpUrl(pmcUrl)) continue;

        const journal = doc.source || 'Biomedical Journal';
        const snippet = `Peer-reviewed biomedical literature indexed in NCBI PMC repository. Published in ${journal} (${doc.pubdate || 'Date not recorded'}). Study title: ${doc.title}`;

        items.push({
          title: doc.title,
          url: pmcUrl,
          domain: extractRootDomain(pmcUrl),
          snippet: sanitizeUntrustedSnippet(snippet),
          publishedDate: doc.pubdate,
          provider: 'PubMed (NCBI PMC)',
          publisher: journal,
          tier: 'Peer-Reviewed',
          sourceType: 'academic',
        });
      }

      return items;
    } catch {
      return [];
    } finally {
      clearTimeout(timeout);
    }
  }
}
