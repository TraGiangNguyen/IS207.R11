import dotenv from "dotenv";
import app from "./app.js";
import { initDatabase } from "./data/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  console.log("====================================================");
  console.log("       ✨ BeautyPals Backend API Server ✨         ");
  console.log("====================================================");

  // Initialize DB Connection & Table Schema
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`🔐 Auth Endpoints:    http://localhost:${PORT}/api/auth`);
    console.log(`📦 Product Endpoints: http://localhost:${PORT}/api/products`);
    console.log(`🩺 Health Check:      http://localhost:${PORT}/api/health`);
    console.log("====================================================");
  });
}

startServer().catch((err) => {
  console.error("Fatal error starting backend server:", err);
  process.exit(1);
});
