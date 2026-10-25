/**
 * SignalCheck - URL Normalization and Domain Extraction Utilities
 */

const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
  'gclsrc',
  'dclid',
  'ref',
  'source',
  'share',
  'subId',
  's_kwcid',
  'msclkid',
]);

/**
 * Normalizes a URL by removing tracking params, hash anchors, trailing slashes,
 * and canonicalizing protocols and lowercased hostnames.
 */
export function normalizeUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl.trim());
    
    // Lowercase host and protocol
    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    
    // Filter out tracking query params
    const searchParams = new URLSearchParams(parsed.search);
    for (const key of Array.from(searchParams.keys())) {
      if (TRACKING_PARAMS.has(key.toLowerCase()) || key.toLowerCase().startsWith('utm_')) {
        searchParams.delete(key);
      }
    }
    
    parsed.search = searchParams.toString() ? `?${searchParams.toString()}` : '';
    parsed.hash = ''; // Remove fragment anchors
    
    // Remove trailing slash in path if not root
    if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    
    return parsed.toString();
  } catch {
    // If not valid URL, return trimmed string
    return rawUrl.trim();
  }
}

/**
 * Extracts root domain (e.g., "pib.gov.in" -> "pib.gov.in", "sub.thehindu.com" -> "thehindu.com")
 */
export function extractRootDomain(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const parts = host.split('.');
    
    // Handle Indian gov/education second-level domains: .gov.in, .nic.in, .ac.in, .co.in, .org.in
    if (parts.length >= 3 && parts[parts.length - 1] === 'in') {
      const secondLevel = parts[parts.length - 2];
      if (['gov', 'nic', 'ac', 'co', 'org', 'res', 'edu'].includes(secondLevel)) {
        return parts.slice(-3).join('.');
      }
    }
    
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    return host;
  } catch {
    return 'unknown-source';
  }
}

/**
 * Validates whether a URL is a syntactically valid public HTTP/HTTPS URL
 */
export function isValidHttpUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
