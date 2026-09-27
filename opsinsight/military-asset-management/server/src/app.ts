import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import {
  authenticate,
  authorize,
} from "./middleware/auth.middleware.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import assetRoutes from "./routes/asset.routes.js";
import transferRoutes from "./routes/transfer.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import expenditureRoutes from "./routes/expenditure.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Military Asset Management API is running",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Military Asset Management API is running",
  });
});

app.get(
  "/api/admin-test",
  authenticate,
  authorize("ADMIN"),
  (_req, res) => {
    res.json({
      success: true,
      message: "Admin access granted",
    });
  }
);

app.use("/api/auth", authRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/expenditures", expenditureRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;