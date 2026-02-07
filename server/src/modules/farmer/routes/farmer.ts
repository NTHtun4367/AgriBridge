import { Router } from "express";
import {
  handleStartSeason,
  handleBulkAddCrops,
  handleGetCrops,
  handleEndSeason,
  handleGetActiveSeason, // Import the new handler
} from "../controllers/farmer";
import { protect } from "../../../shared/middleware/authMiddleware";

const router = Router();

// Season Management
router.get("/seasons/active", protect, handleGetActiveSeason); // NEW ROUTE
router.post("/seasons/start", protect, handleStartSeason);
router.patch("/seasons/:id/end", protect, handleEndSeason);

// Crop Management
router.post("/crops/bulk", protect, handleBulkAddCrops);
router.get("/crops", protect, handleGetCrops);

export default router;
