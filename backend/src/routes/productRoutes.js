import express from "express";
import products from "../data/mockProducts.js";

const router = express.Router();

// GET /api/products - Lấy danh sách tất cả sản phẩm
router.get("/", (req, res) => {
  res.json({
    success: true,
    count: products.length,
    data: products,
  });
});

// GET /api/products/:id - Lấy chi tiết 1 sản phẩm theo ID
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy sản phẩm",
    });
  }

  res.json({
    success: true,
    data: product,
  });
});

// Phải có dòng này ở cuối cùng
export default router;
