/**
 * SignalCheck Frontend API Service
 * Connects UI to the SignalCheck Backend (/api/fact-check and /api/health)
 */

import { BackendFactCheckResponse } from '../types/investigation';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

export interface FactCheckParams {
  claim: string;
  language?: 'en' | 'hi' | 'auto';
  timeoutMs?: number;
}

export async function requestFactCheck({
  claim,
  language = 'auto',
  timeoutMs = 45000,
}: FactCheckParams): Promise<BackendFactCheckResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}/api/fact-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        claim: claim.trim(),
        language,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errJson = await response.json();
        errorMessage = errJson.message || errJson.error || errorMessage;
      } catch {
        // Fallback to status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data: BackendFactCheckResponse = await response.json();
    return data;
  } catch (err: unknown) {
    if ((err as Error)?.name === 'AbortError') {
      throw new Error('Investigation request timed out. The evidence retrieval budget was exceeded. Please try again or refine the query.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function checkBackendHealth(): Promise<{ status: string; platform: string; version: string } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
