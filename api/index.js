import express from "express";
import cors from "cors";
import apiRoutes from "../OPSpulse/BACKEND/src/routes/api.js";

const app = express();

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount API routes
app.use("/api", apiRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "OPSpulse Vercel Serverless API Engine",
    timestamp: new Date().toISOString()
  });
});

export default app;
