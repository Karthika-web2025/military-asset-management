import { Router } from "express";
import { getAssets } from "../controllers/asset.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getAssets);

export default router;