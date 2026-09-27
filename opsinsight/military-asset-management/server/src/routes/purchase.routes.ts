import { Router } from "express";
import {
  createPurchase,
  getPurchases,
} from "../controllers/purchase.controller.js";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "LOGISTICS_OFFICER"),
  createPurchase
);

router.get(
  "/",
  authenticate,
  getPurchases
);

export default router;