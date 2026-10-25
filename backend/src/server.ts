import express from 'express';
import cors from 'cors';
import { config } from './config/env.config.js';
import healthRoutes from './routes/health.routes.js';
import factCheckRoutes from './routes/factCheck.routes.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { rateLimiter } from './middleware/rateLimiter.middleware.js';

export const app = express();

// Trust proxy for IP rate limiting behind reverse proxies
app.set('trust proxy', 1);

// CORS configuration supporting local dev and production frontend
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || config.nodeEnv === 'development') {
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

// Catch-all 404 for unknown endpoints
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `API endpoint '${req.method} ${req.url}' does not exist on SignalCheck backend. Available endpoints: GET /api/health, POST /api/fact-check`,
  });
});

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
