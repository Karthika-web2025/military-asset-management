import { Router } from "express";
import {
  createAssignment,
  getAssignments,
} from "../controllers/assignment.controller.js";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "BASE_COMMANDER"),
  createAssignment
);

router.get("/", authenticate, getAssignments);

export default router;