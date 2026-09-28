import React, { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProductCard({ product }) {
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "staff";

  const handleTymClick = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  // HÀM XỬ LÝ THÊM VÀO GIỎ HÀNG CHUẨN THỰC TẾ
  const handleAddToCart = (e) => {
    e.preventDefault(); // Rất quan trọng: Ngăn không cho click bị xuyên qua thẻ Link (chuyển trang)

    try {
      // 1. Lấy dữ liệu giỏ hàng cũ từ LocalStorage (nếu chưa có thì trả về mảng rỗng)
      const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];

      // 2. Kiểm tra xem sản phẩm này đã được thêm vào giỏ trước đó chưa
      const existingProductIndex = existingCart.findIndex(
        (item) => item.id === product.id,
      );

      if (existingProductIndex !== -1) {
        // Nếu đã có trong giỏ, tiến hành cộng dồn số lượng thêm 1
        existingCart[existingProductIndex].quantity += 1;
      } else {
        // Nếu chưa có, thêm nguyên object sản phẩm vào mảng kèm theo thuộc tính quantity = 1
        existingCart.push({ ...product, quantity: 1 });
      }

      // 3. Lưu mảng mới ngược trở lại vào LocalStorage
      localStorage.setItem("cartItems", JSON.stringify(existingCart));

      // 4. Phát sự kiện để Header (nếu có cục số lượng) tự động cập nhật
      window.dispatchEvent(new Event("cartUpdated"));

      // 5. Thông báo thành công
      alert(`Đã thêm thành công: ${product.name} vào giỏ hàng!`);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* 1. Phần liên kết để xem chi tiết */}
      <Link to={`/product/${product.id}`} className="flex flex-col flex-grow">
        <div className="relative w-full aspect-square bg-[#f8f9fa] overflow-hidden group">
          {product.discountPercentage > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-[#008B8B] text-white text-xs font-bold px-2 py-1 rounded">
              {product.discountPercentage}% OFF
            </div>
          )}
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-gray-900 font-medium text-base line-clamp-2 min-h-[3rem] mb-1 group-hover:text-[#008B8B] transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < product.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-200 fill-gray-200"
                }
              />
            ))}
            <span className="text-gray-400 text-xs ml-1">
              ({product.reviewCount})
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#008B8B]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* 2. CÁC NÚT TƯƠNG TÁC */}
      <div className="px-4 pb-4 mt-auto">
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleTymClick}
            className={`p-2 rounded-lg border transition-colors ${
              isLiked
                ? "text-red-500 bg-red-50 border-red-200"
                : "text-gray-400 hover:text-red-500 hover:bg-red-50 border-gray-200"
            }`}
          >
            <Heart size={20} className={isLiked ? "fill-current" : ""} />
          </button>

          {/* Hide Add to Cart for Admin/Staff */}
          {!isAdmin && (
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-[#008B8B] text-white py-2 px-4 rounded-lg hover:bg-[#007070] transition-colors font-medium"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
