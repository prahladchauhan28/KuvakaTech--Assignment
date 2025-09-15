import express from 'express';
import { getResults, exportResults } from '../controllers/resultsController.js';

const router = express.Router();

// GET /results - Get scoring results
router.get('/', getResults);

// GET /results/export - Export results as CSV
router.get('/export', exportResults);

export default router;