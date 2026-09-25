import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js"; // Thêm import route sản phẩm

const app = express();

// Middlewares
app.use(
  cors({
    origin: true, // Allow frontend dev server
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes); // Đăng ký API Route cho sản phẩm

// Base Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "BeautyPals Backend API",
    database: "MySQL",
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy API endpoint: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(
    `[API ERROR] ${req.method} ${req.originalUrl} - ${statusCode}:`,
    err.message,
  );

  res.status(statusCode).json({
    success: false,
    message: err.message || "Lỗi hệ thống máy chủ. Vui lòng thử lại sau.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
