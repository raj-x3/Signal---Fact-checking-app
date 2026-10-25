import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend folder or project root
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export interface AppConfig {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  gemma: {
    apiKey: string | undefined;
    modelId: string;
    isAvailable: boolean;
  };
  providers: {
    tavilyApiKey: string | undefined;
    braveApiKey: string | undefined;
    googleFactCheckApiKey: string | undefined;
  };
  timeouts: {
    searchMs: number;
    gemmaMs: number;
    requestTimeoutMs: number;
  };
}

const gemmaKey = process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY || undefined;

export const config: AppConfig = {
  port: Number(process.env.PORT) || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  gemma: {
    apiKey: gemmaKey,
    modelId: process.env.GEMMA_MODEL_ID || 'gemma-4-26b-a4b-it',
    isAvailable: Boolean(gemmaKey && gemmaKey.trim().length > 0),
  },
  providers: {
    tavilyApiKey: process.env.TAVILY_API_KEY || undefined,
    braveApiKey: process.env.BRAVE_SEARCH_API_KEY || undefined,
    googleFactCheckApiKey: process.env.GOOGLE_FACT_CHECK_API_KEY || undefined,
  },
  timeouts: {
    searchMs: 8000,
    gemmaMs: 25000,
    requestTimeoutMs: 35000,
  },
};
