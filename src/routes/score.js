import express from "express";
import { scoreLeads } from"../controllers/scoreController.js";

const router = express.Router();

// POST /score - Run scoring on uploaded leads
router.post("/", scoreLeads);

export default router;
