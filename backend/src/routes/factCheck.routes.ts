import { Router, Request, Response, NextFunction } from 'express';
import { FactCheckService } from '../services/factCheck.service.js';
import { FactCheckRequestSchema } from '../schemas/factCheck.schema.js';

const router = Router();
const factCheckService = new FactCheckService();

router.post('/fact-check', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validatedBody = FactCheckRequestSchema.parse(req.body);

    // Conduct evidence investigation
    const result = await factCheckService.conductInvestigation(validatedBody);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
