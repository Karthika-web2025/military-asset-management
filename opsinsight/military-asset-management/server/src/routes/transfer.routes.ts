import { Router } from "express";
import {
  createTransfer,
  getTransfers,
} from "../controllers/transfer.controller.js";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "LOGISTICS_OFFICER"),
  createTransfer
);

router.get(
  "/",
  authenticate,
  getTransfers
);

export default router;