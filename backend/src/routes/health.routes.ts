import { Router, Request, Response } from 'express';
import { config } from '../config/env.config.js';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  const uptimeSeconds = Math.floor(process.uptime());

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    platform: 'SignalCheck India-First Fact-Checking Platform',
    version: '1.0.0',
    model: {
      primary: config.gemma.modelId,
      configured: config.gemma.isAvailable,
      provider: 'Google GenAI SDK (@google/genai)',
    },
    providers: {
      tavily: Boolean(config.providers.tavilyApiKey),
      brave: Boolean(config.providers.braveApiKey),
      googleFactCheck: Boolean(config.providers.googleFactCheckApiKey),
      gdelt: true,
      crossref: true,
      pubmed: true,
      indianGovRegistries: true,
      indianFactCheckers: true,
    },
    supportedLanguages: ['en', 'hi'],
  });
});

export default router;
