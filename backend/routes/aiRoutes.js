// routes/aiRoutes.js
import express from 'express';
import { analyzeComplaint, quickAnalyze } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, analyzeComplaint);   // Analyze & save to complaint
router.post('/quick-analyze', quickAnalyze);           // Quick analysis without saving

export default router;
