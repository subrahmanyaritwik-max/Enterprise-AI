import "./config/env.js";
import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/api", apiRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "OPSpulse API Engine", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` OPSpulse Backend API Engine running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` API Endpoint: http://localhost:${PORT}/api/overview`);
  console.log(`====================================================`);
});
