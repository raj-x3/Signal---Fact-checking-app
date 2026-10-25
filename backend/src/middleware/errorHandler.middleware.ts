import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Handle Zod input validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Invalid Request Payload',
      details: err.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      })),
    });
    return;
  }

  // Handle timeout errors
  if ((err as Error)?.name === 'AbortError' || (err as Error)?.message?.includes('timeout')) {
    res.status(504).json({
      error: 'Investigation Request Timeout',
      message: 'Evidence retrieval exceeded maximum response budget. Please try a more specific claim query.',
    });
    return;
  }

  // General server error
  console.error('[ServerError]', (err as Error)?.stack || err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred while compiling the evidence dossier. No claims were fabricated.',
  });
}
