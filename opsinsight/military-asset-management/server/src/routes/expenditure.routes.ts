import { Router } from "express";
import {
  createExpenditure,
  getExpenditures,
} from "../controllers/expenditure.controller.js";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "BASE_COMMANDER"),
  createExpenditure
);

router.get("/", authenticate, getExpenditures);

export default router;