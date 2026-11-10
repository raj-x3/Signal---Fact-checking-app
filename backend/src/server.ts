import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config/env.config.js';
import healthRoutes from './routes/health.routes.js';
import factCheckRoutes from './routes/factCheck.routes.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { rateLimiter } from './middleware/rateLimiter.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Trust proxy for IP rate limiting behind reverse proxies (like Render / Cloudflare)
app.set('trust proxy', 1);

// CORS configuration supporting local dev and production frontend (including onrender.com)
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.onrender.com') ||
        config.nodeEnv === 'development'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

// Apply rate limiting to all /api endpoints
app.use('/api', rateLimiter);

// Register routes
app.use('/api', healthRoutes);
app.use('/api', factCheckRoutes);

// Serve static frontend in production if built
const frontendDistPath = fs.existsSync(path.resolve(process.cwd(), 'frontend/dist'))
  ? path.resolve(process.cwd(), 'frontend/dist')
  : path.resolve(__dirname, '../../frontend/dist');

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Catch-all 404 for unknown endpoints when running standalone API
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `API endpoint '${req.method} ${req.url}' does not exist on SignalCheck backend. Available endpoints: GET /api/health, POST /api/fact-check`,
    });
  });
}

// Global error handler
app.use(errorHandler);

// Only listen if not imported by test runner
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(config.port, () => {
    console.log(`=======================================================`);
    console.log(`  SignalCheck India Fact-Checking Backend Running`);
    console.log(`  Port: http://localhost:${config.port}`);
    console.log(`  Gemma Model: ${config.gemma.modelId} (${config.gemma.isAvailable ? 'API Key Configured' : 'Offline Heuristic Engine'})`);
    console.log(`  Environment: ${config.nodeEnv}`);
    console.log(`=======================================================`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Error: Port ${config.port} is already in use by another process.`);
      console.error(`Quick fix to kill the old process:`);
      console.error(`  lsof -ti :${config.port} | xargs kill -9\n`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });

  const shutdown = () => {
    console.log('Shutting down SignalCheck backend server gracefully...');
    server.close(() => {
      console.log('Server terminated cleanly.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
