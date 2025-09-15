import express from 'express';
import { createOffer } from '../controllers/offerController.js';

const router = express.Router();

// POST /offer
router.post('/', createOffer);

export default router;